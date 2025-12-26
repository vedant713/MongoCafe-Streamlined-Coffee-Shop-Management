from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from backend.database import Database
from backend.auth_utils import (
    UserContext, get_current_user, require_permission, 
    PERM_ORDERS_CREATE, PERM_ORDERS_READ, PERM_ORDERS_UPDATE,
    ROLE_CUSTOMER
)
from backend.audit import log_action
import uuid

router = APIRouter()
db = Database()
orders_collection = db.get_collection("orders")
inventory_collection = db.get_collection("inventory")

class OrderItem(BaseModel):
    name: str
    price: int
    quantity: int
    notes: Optional[str] = None 

class OrderModel(BaseModel):
    items: List[OrderItem]
    subtotal: int
    tax: int 
    service_charge: int
    grand_total: int
    payment_method: str 
    split_details: Optional[dict] = None 
    customer_name: Optional[str] = "Walk-in"

# Recipe Mapping (Product Name -> {Ingredient Name: Quantity})
@router.post("/orders")
def create_order(
    order: OrderModel, 
    user: UserContext = Depends(get_current_user) # Anyone logged in (Customer or Staff with perm)
):
    # Verify permission: Customers can create, Staff with PERM_ORDERS_CREATE can create
    if user.role != ROLE_CUSTOMER and PERM_ORDERS_CREATE not in user.permissions:
        raise HTTPException(status_code=403, detail="Permission denied")

    new_order = order.dict()
    
    # 0. Fetch Recipes for items
    item_names = [item["name"] for item in new_order["items"]]
    products_cursor = db.get_collection("prices").find({"name": {"$in": item_names}})
    product_map = {p["name"]: p for p in products_cursor}

    # 1. Check Inventory
    for item in new_order["items"]:
        product_name = item["name"]
        quantity = item["quantity"]
        
        product_doc = product_map.get(product_name)
        if product_doc and "recipe" in product_doc and product_doc["recipe"]:
            ingredients = product_doc["recipe"]
            for ing_name, amount_needed in ingredients.items():
                total_needed = amount_needed * quantity
                inventory_item = inventory_collection.find_one({"name": ing_name})
                if not inventory_item:
                    continue # Skip if not tracked
                
                if inventory_item["quantity"] < total_needed:
                    raise HTTPException(status_code=400, detail=f"Insufficient stock for {ing_name}. Be sure to restock!")

    # 2. Deduct Inventory
    for item in new_order["items"]:
        product_name = item["name"]
        quantity = item["quantity"]
        
        product_doc = product_map.get(product_name)
        if product_doc and "recipe" in product_doc and product_doc["recipe"]:
            ingredients = product_doc["recipe"]
            for ing_name, amount_needed in ingredients.items():
                total_deducted = amount_needed * quantity
                inventory_collection.update_one(
                    {"name": ing_name},
                    {"$inc": {"quantity": -total_deducted}}
                )

    # Recalculate totals
    calculated_subtotal = sum(item["price"] * item["quantity"] for item in new_order["items"])
    new_order["subtotal"] = calculated_subtotal
    new_order["tax"] = int(calculated_subtotal * 0.05)
    new_order["service_charge"] = 0 
    new_order["grand_total"] = new_order["subtotal"] + new_order["tax"] + new_order["service_charge"]

    new_order["order_id"] = str(uuid.uuid4())[:8]
    new_order["timestamp"] = datetime.now()
    new_order["status"] = "Received"
    new_order["creator_id"] = user.user_id # Link to creator
    
    orders_collection.insert_one(new_order)
    
    log_action(user.user_id, user.role, "create", "order", new_order["order_id"])
    
    return {"status": "success", "order_id": new_order["order_id"], "message": "Order created successfully"}

@router.get("/orders")
def get_orders(user: UserContext = Depends(get_current_user)):
    # RBAC Logic:
    # - Staff: See ALL orders (if they have READ perm)
    # - Customer: See ONLY their own orders
    
    if user.role == ROLE_CUSTOMER:
        # Filter by creator_id
        orders = list(orders_collection.find({"creator_id": user.user_id}, {"_id": 0}).sort("timestamp", -1))
        return orders
    
    # Check permissions for staff
    if PERM_ORDERS_READ not in user.permissions:
         raise HTTPException(status_code=403, detail="Permission denied")
         
    orders = list(orders_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    return orders

@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: str, 
    status: str,
    user: UserContext = Depends(require_permission(PERM_ORDERS_UPDATE))
):
    result = orders_collection.update_one(
        {"order_id": order_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    log_action(user.user_id, user.role, "update_status", "order", order_id, {"new_status": status})
        
    return {"status": "success", "message": f"Order marked as {status}"}

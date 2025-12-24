from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from backend.database import Database
import uuid

router = APIRouter()
db = Database()
orders_collection = db.get_collection("orders")
inventory_collection = db.get_collection("inventory")

class OrderItem(BaseModel):
    name: str
    price: int
    quantity: int
    notes: Optional[str] = None # For add-ons later

class OrderModel(BaseModel):
    items: List[OrderItem]
    subtotal: int
    tax: int # Calculated on backend or passed
    service_charge: int
    grand_total: int
    payment_method: str # Cash, Card, UPI, Split
    split_details: Optional[dict] = None # { "Cash": 100, "Card": 200 } for split payment
    customer_name: Optional[str] = "Walk-in"

# Recipe Mapping (Product Name -> {Ingredient Name: Quantity})
RECIPES = {
    "Espresso": {"Espresso Beans": 18, "Cups": 1},
    "Latte": {"Espresso Beans": 18, "Milk": 200, "Cups": 1},
    "Cappuccino": {"Espresso Beans": 18, "Milk": 150, "Cups": 1},
    "Iced Coffee": {"Espresso Beans": 18, "Milk": 100, "Cups": 1}, # Simplified
    "Croissant": {"Croissants": 1},
    "Muffin": {"Muffins": 1}
}

@router.post("/orders")
def create_order(order: OrderModel):
    new_order = order.dict()
    
    # 1. Check Inventory
    for item in new_order["items"]:
        product_name = item["name"]
        quantity = item["quantity"]
        
        if product_name in RECIPES:
            ingredients = RECIPES[product_name]
            for ing_name, amount_needed in ingredients.items():
                total_needed = amount_needed * quantity
                
                # Check DB
                inventory_item = inventory_collection.find_one({"name": ing_name})
                if not inventory_item:
                    # If ingredient doesn't exist, we skip or error? 
                    # For now, let's log and skip, or maybe error if critical.
                    # Creating "Muffins" without "Muffins" in inventory is bad if we track it.
                    # Let's assume seeded data. If missing, we skip check (soft fail).
                    continue
                
                if inventory_item["quantity"] < total_needed:
                    raise HTTPException(status_code=400, detail=f"Insufficient stock for {ing_name}. Be sure to restock!")

    # 2. Deduct Inventory
    for item in new_order["items"]:
        product_name = item["name"]
        quantity = item["quantity"]
        
        if product_name in RECIPES:
            ingredients = RECIPES[product_name]
            for ing_name, amount_needed in ingredients.items():
                total_deducted = amount_needed * quantity
                inventory_collection.update_one(
                    {"name": ing_name},
                    {"$inc": {"quantity": -total_deducted}}
                )

    # Recalculate totals on backend for security
    calculated_subtotal = sum(item["price"] * item["quantity"] for item in new_order["items"])
    new_order["subtotal"] = calculated_subtotal
    
    # Simple Tax Logic: 5% GST
    new_order["tax"] = int(calculated_subtotal * 0.05)
    new_order["service_charge"] = 0 # Optional logic
    new_order["grand_total"] = new_order["subtotal"] + new_order["tax"] + new_order["service_charge"]

    new_order["order_id"] = str(uuid.uuid4())[:8] # Short ID for receipt
    new_order["timestamp"] = datetime.now()
    new_order["status"] = "Received" # Received -> Preparing -> Ready -> Served
    
    orders_collection.insert_one(new_order)
    return {"status": "success", "order_id": new_order["order_id"], "message": "Order created successfully"}

@router.get("/orders")
def get_orders():
    # Return sorted by newest first
    orders = list(orders_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    return orders

@router.put("/orders/{order_id}/status")
def update_order_status(order_id: str, status: str):
    result = orders_collection.update_one(
        {"order_id": order_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "success", "message": f"Order marked as {status}"}

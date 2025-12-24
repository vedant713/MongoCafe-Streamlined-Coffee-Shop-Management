from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from backend.database import Database
from backend.auth_utils import require_permission, PERM_INVENTORY_READ, PERM_INVENTORY_WRITE, UserContext
from backend.audit import log_action

router = APIRouter()
db = Database()
inventory_collection = db.get_collection("inventory")

class InventoryItem(BaseModel):
    name: str 
    quantity: float 
    unit: str 
    threshold: float 

@router.get("/inventory")
def get_inventory(user: UserContext = Depends(require_permission(PERM_INVENTORY_READ))):
    return list(inventory_collection.find({}, {"_id": 0}))

@router.post("/inventory")
def add_inventory_item(
    item: InventoryItem,
    user: UserContext = Depends(require_permission(PERM_INVENTORY_WRITE))
):
    if inventory_collection.find_one({"name": item.name}):
        raise HTTPException(status_code=400, detail="Item already exists")
    
    inventory_collection.insert_one(item.dict())
    
    log_action(user.user_id, user.role, "create", "inventory", item.name)
    
    return {"status": "success", "message": "Item added"}

@router.put("/inventory/{name}")
def update_inventory_stock(
    name: str, 
    quantity: float,
    user: UserContext = Depends(require_permission(PERM_INVENTORY_WRITE))
):
    result = inventory_collection.update_one(
        {"name": name},
        {"$set": {"quantity": quantity}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
        
    log_action(user.user_id, user.role, "update", "inventory", name, {"new_quantity": quantity})
        
    return {"status": "success", "message": "Stock updated"}

@router.post("/inventory/seed")
def seed_inventory(
    user: UserContext = Depends(require_permission(PERM_INVENTORY_WRITE)) # Only authorized can seed
):
    if inventory_collection.count_documents({}) > 0:
        return {"message": "Inventory already seeded"}

    defaults = [
        {"name": "Milk", "quantity": 10000, "unit": "ml", "threshold": 1000},
        {"name": "Espresso Beans", "quantity": 5000, "unit": "g", "threshold": 500},
        {"name": "Sugar", "quantity": 2000, "unit": "g", "threshold": 200},
        {"name": "Cups", "quantity": 500, "unit": "pcs", "threshold": 50},
        {"name": "Croissants", "quantity": 20, "unit": "pcs", "threshold": 5},
        {"name": "Muffins", "quantity": 20, "unit": "pcs", "threshold": 5},
    ]
    inventory_collection.insert_many(defaults)
    
    log_action(user.user_id, user.role, "seed", "inventory", "all")
    
    return {"status": "success", "message": "Inventory seeded"}

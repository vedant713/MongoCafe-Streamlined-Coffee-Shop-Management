from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.database import Database

router = APIRouter()
db = Database()
inventory_collection = db.get_collection("inventory")

class InventoryItem(BaseModel):
    name: str # e.g. "Milk", "Beans"
    quantity: float # Current stock level
    unit: str # e.g. "ml", "g", "kg"
    threshold: float # Low stock alert level

@router.get("/inventory")
def get_inventory():
    return list(inventory_collection.find({}, {"_id": 0}))

@router.post("/inventory")
def add_inventory_item(item: InventoryItem):
    if inventory_collection.find_one({"name": item.name}):
        raise HTTPException(status_code=400, detail="Item already exists")
    
    inventory_collection.insert_one(item.dict())
    return {"status": "success", "message": "Item added"}

@router.put("/inventory/{name}")
def update_inventory_stock(name: str, quantity: float):
    # This endpoint is to manually update/restock
    result = inventory_collection.update_one(
        {"name": name},
        {"$set": {"quantity": quantity}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"status": "success", "message": "Stock updated"}

@router.post("/inventory/seed")
def seed_inventory():
    # Helper to quickly populate default ingredients
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
    return {"status": "success", "message": "Inventory seeded"}

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from backend.database import Database

router = APIRouter()
db = Database()
prices_collection = db.get_collection("prices")

class ProductModel(BaseModel):
    name: str # Using name as ID effectively since structure is simple
    price: int
    image_url: str = None

@router.get("/products", response_model=List[dict])
def get_products():
    products = []
    for p in prices_collection.find():
        p["_id"] = str(p["_id"])
        products.append(p)
    return products

@router.put("/products/{name}")
def update_product(name: str, product: ProductModel):
    update_data = {"price": product.price}
    if product.image_url:
        update_data["image_url"] = product.image_url

    result = prices_collection.update_one(
        {"name": name},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        # If not found, maybe insert? deciding to just error for now or insert
        # The prompt implies management, so let's upsert
        prices_collection.update_one(
             {"name": name},
             {"$set": update_data},
             upsert=True
        )
    return {"status": "success"}

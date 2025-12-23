from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.database import Database
from bson import ObjectId

router = APIRouter()
db = Database()
customers_collection = db.get_collection("customer")

class CustomerModel(BaseModel):
    name: str
    phoneno: str
    age: str
    email: str

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "phoneno": "1234567890",
                "age": "25",
                "email": "john@example.com"
            }
        }

@router.get("/customers", response_model=List[dict])
def get_customers():
    customers = []
    for customer in customers_collection.find():
        customer["_id"] = str(customer["_id"])
        customers.append(customer)
    return customers

@router.post("/customers")
def add_customer(customer: CustomerModel):
    # Check if exists
    if customers_collection.find_one({"phoneno": customer.phoneno}):
         raise HTTPException(status_code=400, detail="Customer already exists")
    
    result = customers_collection.insert_one(customer.dict())
    return {"status": "success", "id": str(result.inserted_id)}

@router.delete("/customers/{phoneno}")
def delete_customer(phoneno: str):
    result = customers_collection.delete_one({"phoneno": phoneno})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"status": "success"}

@router.put("/customers/{phoneno}")
def update_customer(phoneno: str, customer: CustomerModel):
    result = customers_collection.update_one(
        {"phoneno": phoneno},
        {"$set": customer.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"status": "success"}

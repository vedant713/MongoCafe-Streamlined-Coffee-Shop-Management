from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from backend.database import Database

router = APIRouter()
db = Database()

class LoginRequest(BaseModel):
    user_id: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    # Determine collection based on some logic or try both?
    # The original app has 'manager' login and 'owner' login.
    # We'll check 'login' collection (manager) and 'owner' collection.
    
    login_collection = db.get_collection("login")
    owner_collection = db.get_collection("owner")
    
    # Check Manager
    manager = login_collection.find_one({"userid": request.user_id, "password": request.password})
    if manager:
        return {"status": "success", "role": "manager", "message": "Login successful"}
        
    # Check Owner
    owner = owner_collection.find_one({"userid": request.user_id, "password": request.password})
    if owner:
        return {"status": "success", "role": "owner", "message": "Login successful"}

    raise HTTPException(status_code=401, detail="Invalid credentials")

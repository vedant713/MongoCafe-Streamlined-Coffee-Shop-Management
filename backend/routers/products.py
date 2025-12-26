from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
import uuid
from backend.database import Database
from backend.auth_utils import require_permission, PERM_MENU_READ, PERM_MENU_WRITE, UserContext, get_current_user
from backend.audit import log_action

router = APIRouter()
db = Database()
products_collection = db.get_collection("prices") # Note: Collection name is 'prices' in DB for some reason

# Update ProductModel to be consistent, though for Form data we use function args
class ProductModel(BaseModel):
    name: Optional[str]
    price: Optional[int]
    image_url: Optional[str] = None
    category: Optional[str] = None

@router.get("/products", response_model=List[dict])
def get_products():
    # Public endpoint
    products = []
    for p in products_collection.find():
        p["_id"] = str(p["_id"])
        products.append(p)
    return products

@router.post("/products")
def add_product(
    name: str = Form(...),
    price: int = Form(...),
    category: str = Form("Snacks"),
    image: UploadFile = File(None),
    user: UserContext = Depends(require_permission(PERM_MENU_WRITE))
):
    if products_collection.find_one({"name": name}):
        raise HTTPException(status_code=400, detail="Product already exists")
    
    image_url = "/images/latte.png" # Default fallback
    
    if image:
        # Save image locally
        file_extension = os.path.splitext(image.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        # Ensure directory exists (it should, but just in case)
        upload_dir = "frontend/public/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        image_url = f"/uploads/{unique_filename}"

    new_product = {
        "name": name,
        "price": price,
        "category": category,
        "image_url": image_url
    }

    products_collection.insert_one(new_product)
    new_product["_id"] = str(new_product["_id"])
    
    log_action(user.user_id, user.role, "create", "product", name)
    
    return {"status": "success", "message": "Product added", "product": new_product}

@router.delete("/products/{name}")
def delete_product(
    name: str,
    user: UserContext = Depends(require_permission(PERM_MENU_WRITE))
):
    result = products_collection.delete_one({"name": name})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
        
    log_action(user.user_id, user.role, "delete", "product", name)
    
    return {"status": "success", "message": "Product deleted"}

@router.put("/products/{name}")
def update_product(
    name: str, 
    product: ProductModel,
    user: UserContext = Depends(require_permission(PERM_MENU_WRITE))
):
    update_data = {k: v for k, v in product.dict().items() if v is not None}
    
    if not update_data:
         raise HTTPException(status_code=400, detail="No fields to update")

    result = products_collection.update_one(
        {"name": name},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
        
    log_action(user.user_id, user.role, "update", "product", name)
    
    return {"status": "success", "message": "Product updated"}

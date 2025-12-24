from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from backend.database import Database
from backend.security import verify_password, verify_pin, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from backend.auth_utils import UserContext, get_current_user, ROLE_CUSTOMER
from backend.audit import log_action
from datetime import timedelta, datetime
import uuid

router = APIRouter()
db = Database()

# --- Schemas ---
class StaffLoginRequest(BaseModel):
    email: str # Changed from username to email for realism, or can keep username if preferred
    password: str

class StaffPinRequest(BaseModel):
    pin: str

class CustomerOtpRequest(BaseModel):
    phone: str

class CustomerVerifyRequest(BaseModel):
    phone: str
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

# --- STAFF Endpoints ---

@router.post("/auth/staff/login", response_model=Token)
async def login_staff_email(request: StaffLoginRequest):
    users_collection = db.get_collection("users_staff")
    
    # Try finding by email OR username
    user = users_collection.find_one({"$or": [{"email": request.email}, {"username": request.email}]})
    
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"], "user_id": str(user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    log_action(str(user["_id"]), user["role"], "login:password", "system")
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user["role"],
        "username": user["username"]
    }

@router.post("/auth/staff/pin", response_model=Token)
async def login_staff_pin(request: StaffPinRequest):
    users_collection = db.get_collection("users_staff")
    
    # In a real app, pins might be non-unique, but for small shop 
    # we iterate or assume unique. Since we hash pins, we can't search by hash directly 
    # unless using deterministic hash (insecure) or retrieving all potential users.
    # Simple approach for this scale: Iterate all staff (usually < 20) and check.
    
    # Optimization: If PINs are short (4-6 chars), we could store `pin_hash` and check against it 
    # if using salt. But bcrypt always salts.
    # For small <50 users, linear scan is instantaneous.
    
    all_staff = list(users_collection.find({}))
    found_user = None
    
    for user in all_staff:
        if "pin" in user and verify_pin(request.pin, user["pin"]):
            found_user = user
            break
            
    if not found_user:
        raise HTTPException(status_code=401, detail="Invalid PIN")
        
    access_token = create_access_token(
        data={"sub": found_user["username"], "role": found_user["role"], "user_id": str(found_user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    log_action(str(found_user["_id"]), found_user["role"], "login:pin", "system")

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": found_user["role"],
        "username": found_user["username"]
    }

# --- CUSTOMER Endpoints ---

@router.post("/auth/customer/send-otp")
async def send_otp(request: CustomerOtpRequest):
    # Mock OTP - in real world integ w/ Twilio/SNS
    # Create customer if not exists or just ensuring existence?
    # Usually we create on verify.
    print(f"DEBUG: OTP '1234' sent to {request.phone}")
    return {"status": "success", "message": "OTP sent", "debug_otp": "1234"}

@router.post("/auth/customer/verify-otp", response_model=Token)
async def verify_otp(request: CustomerVerifyRequest):
    if request.otp != "1234":
         raise HTTPException(status_code=401, detail="Invalid OTP")
         
    customers_collection = db.get_collection("customers")
    customer = customers_collection.find_one({"phone": request.phone})
    
    if not customer:
        # Register new
        new_customer = {
            "phone": request.phone,
            "created_at": str(datetime.now())
        }
        res = customers_collection.insert_one(new_customer)
        customer_id = str(res.inserted_id)
        name = f"Customer-{request.phone[-4:]}"
    else:
        customer_id = str(customer["_id"])
        name = customer.get("name", f"Customer-{request.phone[-4:]}")
        
    access_token = create_access_token(
        data={"sub": name, "role": ROLE_CUSTOMER, "user_id": customer_id},
        expires_delta=timedelta(days=7) # Customers stay logged in longer
    )
    
    log_action(customer_id, ROLE_CUSTOMER, "login:otp", "system")

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": ROLE_CUSTOMER,
        "username": name
    }

# --- UTILITY ---

@router.get("/auth/me")
async def read_users_me(current_user: UserContext = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "role": current_user.role,
        "permissions": current_user.permissions
    }

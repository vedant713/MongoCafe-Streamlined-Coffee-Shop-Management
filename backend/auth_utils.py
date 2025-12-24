from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from backend.security import SECRET_KEY, ALGORITHM
from backend.database import Database
from dataclasses import dataclass
from typing import List

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/staff/login")

# --- Permission Constants ---
PERM_MENU_READ = "menu:read"
PERM_MENU_WRITE = "menu:write"

PERM_ORDERS_READ = "orders:read"            # Read all orders
PERM_ORDERS_CREATE = "orders:create"        # Create new order
PERM_ORDERS_UPDATE = "orders:update_status" # Move order status
PERM_ORDERS_REFUND = "orders:refund"        # Process refund

PERM_INVENTORY_READ = "inventory:read"
PERM_INVENTORY_WRITE = "inventory:write"

PERM_EMPLOYEES_READ = "employees:read"
PERM_EMPLOYEES_WRITE = "employees:write"

PERM_ANALYTICS_READ = "analytics:read"

# --- Role Definition ---
ROLE_OWNER = "owner"
ROLE_MANAGER = "manager"
ROLE_CASHIER = "cashier"
ROLE_BARISTA = "barista"
ROLE_CUSTOMER = "customer"

# --- Role -> Permissions Mapping ---
ROLE_PERMISSIONS = {
    ROLE_OWNER: [
        PERM_MENU_READ, PERM_MENU_WRITE,
        PERM_ORDERS_READ, PERM_ORDERS_CREATE, PERM_ORDERS_UPDATE, PERM_ORDERS_REFUND,
        PERM_INVENTORY_READ, PERM_INVENTORY_WRITE,
        PERM_EMPLOYEES_READ, PERM_EMPLOYEES_WRITE,
        PERM_ANALYTICS_READ
    ],
    ROLE_MANAGER: [
        PERM_MENU_READ, PERM_MENU_WRITE,
        PERM_ORDERS_READ, PERM_ORDERS_CREATE, PERM_ORDERS_UPDATE, PERM_ORDERS_REFUND,
        PERM_INVENTORY_READ, PERM_INVENTORY_WRITE,
        PERM_EMPLOYEES_READ, PERM_EMPLOYEES_WRITE, # Manager usually manages schedule but maybe not salary/hiring? Let's give full emp access for now.
        PERM_ANALYTICS_READ
    ],
    ROLE_CASHIER: [
        PERM_MENU_READ, 
        PERM_ORDERS_READ, PERM_ORDERS_CREATE, PERM_ORDERS_UPDATE, PERM_ORDERS_REFUND, # Cashier handles payments & refunds
        PERM_INVENTORY_READ, # Check stock
        PERM_CUSTOMERS_READ := "customers:read",
        PERM_CUSTOMERS_WRITE := "customers:write"
    ],
    ROLE_BARISTA: [
        PERM_MENU_READ,
        PERM_ORDERS_READ, PERM_ORDERS_UPDATE, # Update status to "Ready"
        PERM_INVENTORY_READ # Check stock
    ],
    ROLE_CUSTOMER: [
        PERM_MENU_READ,
        "orders:read_own", # Special permission for own orders
        PERM_ORDERS_CREATE # Can place own order
    ]
}

@dataclass
class UserContext:
    user_id: str
    username: str # or email/phone
    role: str
    permissions: List[str]

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserContext:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        user_id: str = payload.get("user_id") # We should start putting user_id in token
        
        if username is None or role is None:
            raise credentials_exception
            
        # Optional: Check if user exists in DB? For strictness yes. 
        # For now, trust the signed token to avoid DB hit every request, assuming short expiration.
        
        perms = ROLE_PERMISSIONS.get(role, [])
        
        return UserContext(user_id=user_id, username=username, role=role, permissions=perms)
        
    except JWTError:
        raise credentials_exception

# --- Dependencies ---

def require_role(required_role: str):
    def role_checker(user: UserContext = Depends(get_current_user)):
        if user.role != required_role and user.role != ROLE_OWNER: # Owner is god
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Role {required_role} required"
            )
        return user
    return role_checker

def require_permission(permission: str):
    def permission_checker(user: UserContext = Depends(get_current_user)):
        if permission not in user.permissions and user.role != ROLE_OWNER:
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Permission {permission} required"
            )
        return user
    return permission_checker

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from backend.database import Database
from backend.auth_utils import require_permission, PERM_EMPLOYEES_READ, PERM_EMPLOYEES_WRITE, UserContext
from backend.audit import log_action

router = APIRouter()
db = Database()
employees_collection = db.get_collection("employee")
attendance_collection = db.get_collection("attendance")

class EmployeeModel(BaseModel):
    name: str
    age: str
    phoneno: str
    salary: str
    email: str
    category: str

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Jane Doe",
                "age": "28",
                "phoneno": "9876543210",
                "salary": "50000",
                "email": "jane@example.com",
                "category": "Barista"
            }
        }

class AttendanceLog(BaseModel):
    phoneno: str
    type: str 
    timestamp: datetime

@router.get("/employees", response_model=List[dict])
def get_employees(
    user: UserContext = Depends(require_permission(PERM_EMPLOYEES_READ))
):
    employees = []
    for emp in employees_collection.find():
        emp["_id"] = str(emp["_id"])
        employees.append(emp)
    return employees

@router.post("/employees")
def add_employee(
    employee: EmployeeModel,
    user: UserContext = Depends(require_permission(PERM_EMPLOYEES_WRITE))
):
    if employees_collection.find_one({"phoneno": employee.phoneno}):
         raise HTTPException(status_code=400, detail="Employee already exists")
    
    result = employees_collection.insert_one(employee.dict())
    
    log_action(user.user_id, user.role, "create", "employee", employee.phoneno)
    
    return {"status": "success", "id": str(result.inserted_id)}

@router.delete("/employees/{phoneno}")
def delete_employee(
    phoneno: str,
    user: UserContext = Depends(require_permission(PERM_EMPLOYEES_WRITE))
):
    result = employees_collection.delete_one({"phoneno": phoneno})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    log_action(user.user_id, user.role, "delete", "employee", phoneno)
    
    return {"status": "success"}

@router.put("/employees/{phoneno}")
def update_employee(
    phoneno: str, 
    employee: EmployeeModel,
    user: UserContext = Depends(require_permission(PERM_EMPLOYEES_WRITE))
):
    result = employees_collection.update_one(
        {"phoneno": phoneno},
        {"$set": employee.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    log_action(user.user_id, user.role, "update", "employee", phoneno)
        
    return {"status": "success"}

# Attendance Endpoints
# Allow managers to manage attendance manually? Or maybe just viewing?
# Usually clocking in/out is done by the employee themselves (maybe via PIN on POS) or a manager does it.
# For now, let's assume Manager/Owner can record attendance for anyone, 
# and maybe later we add a "My Attendance" for logged in staff.
# Given the current simplistic "Check-in" button on UI, let's require WRITE permission (Manager/Owner)
# OR... let anyone with EMPLOYEES_READ (all staff) record it? No, that's messy.
# Let's say WRITE is needed to update records. Note: Cashier does not have EMP_WRITE in my mapping.
# Wait, Cashier might need to clock in myself?
# The current UI lets you clock in *others* from the table list. So this is a Manager Task.

@router.post("/employees/attendance")
def record_attendance(
    log: AttendanceLog,
    user: UserContext = Depends(require_permission(PERM_EMPLOYEES_WRITE))
):
    if not employees_collection.find_one({"phoneno": log.phoneno}):
        raise HTTPException(status_code=404, detail="Employee not found")

    new_log = log.dict()
    new_log["timestamp"] = datetime.now() # Force server time
    attendance_collection.insert_one(new_log)
    
    log_action(user.user_id, user.role, "attendance_" + log.type.lower(), "employee", log.phoneno)
    
    return {"status": "success", "message": f"{log.type} recorded"}

@router.get("/employees/attendance/{phoneno}")
def get_attendance_history(
    phoneno: str,
    user: UserContext = Depends(require_permission(PERM_EMPLOYEES_READ))
):
    logs = list(attendance_collection.find({"phoneno": phoneno}, {"_id": 0}).sort("timestamp", -1))
    return logs

@router.get("/employees/attendance/status/{phoneno}")
def get_current_status(
    phoneno: str,
    user: UserContext = Depends(require_permission(PERM_EMPLOYEES_READ))
):
    latest = attendance_collection.find_one(
        {"phoneno": phoneno}, 
        sort=[("timestamp", -1)]
    )
    
    status = "Checked-out" 
    if latest and latest["type"] == "Check-in":
        status = "Checked-in"
        
    return {"status": status, "last_log": latest["timestamp"] if latest else None}

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from backend.database import Database

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
    type: str # "Check-in" or "Check-out"
    timestamp: datetime

@router.get("/employees", response_model=List[dict])
def get_employees():
    employees = []
    for emp in employees_collection.find():
        emp["_id"] = str(emp["_id"])
        employees.append(emp)
    return employees

@router.post("/employees")
def add_employee(employee: EmployeeModel):
    if employees_collection.find_one({"phoneno": employee.phoneno}):
         raise HTTPException(status_code=400, detail="Employee already exists")
    
    result = employees_collection.insert_one(employee.dict())
    return {"status": "success", "id": str(result.inserted_id)}

@router.delete("/employees/{phoneno}")
def delete_employee(phoneno: str):
    result = employees_collection.delete_one({"phoneno": phoneno})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"status": "success"}

@router.put("/employees/{phoneno}")
def update_employee(phoneno: str, employee: EmployeeModel):
    result = employees_collection.update_one(
        {"phoneno": phoneno},
        {"$set": employee.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"status": "success"}

# Attendance Endpoints

@router.post("/employees/attendance")
def record_attendance(log: AttendanceLog):
    # Verify employee exists
    if not employees_collection.find_one({"phoneno": log.phoneno}):
        raise HTTPException(status_code=404, detail="Employee not found")

    new_log = log.dict()
    new_log["timestamp"] = datetime.now() # Force server time
    attendance_collection.insert_one(new_log)
    return {"status": "success", "message": f"{log.type} recorded"}

@router.get("/employees/attendance/{phoneno}")
def get_attendance_history(phoneno: str):
    logs = list(attendance_collection.find({"phoneno": phoneno}, {"_id": 0}).sort("timestamp", -1))
    return logs

@router.get("/employees/attendance/status/{phoneno}")
def get_current_status(phoneno: str):
    # Get latest log to determine if checked in or out
    latest = attendance_collection.find_one(
        {"phoneno": phoneno}, 
        sort=[("timestamp", -1)]
    )
    
    status = "Checked-out" # Default
    if latest and latest["type"] == "Check-in":
        status = "Checked-in"
        
    return {"status": status, "last_log": latest["timestamp"] if latest else None}

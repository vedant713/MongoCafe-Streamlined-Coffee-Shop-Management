from datetime import datetime
from backend.database import Database

# Simple audit logger
# In a real app, this might be async or write to a separate service/DB

def log_action(user_id: str, role: str, action: str, target_entity: str, target_id: str = None, metadata: dict = None):
    db = Database()
    audit_collection = db.get_collection("audit_logs")
    
    log_entry = {
        "timestamp": datetime.now(),
        "actor_id": user_id,
        "actor_role": role,
        "action": action, # e.g., "create", "update", "delete", "login"
        "target_entity": target_entity, # e.g., "order", "inventory", "employee"
        "target_id": target_id,
        "metadata": metadata or {}
    }
    
    try:
        audit_collection.insert_one(log_entry)
    except Exception as e:
        print(f"FAILED TO LOG AUDIT: {e}")

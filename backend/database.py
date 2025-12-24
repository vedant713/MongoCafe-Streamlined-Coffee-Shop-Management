import os
import pymongo
import mongomock
from dotenv import load_dotenv
from backend.security import get_password_hash

load_dotenv()

class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            # Fallback to mongomock since local mongo is missing
            print("Using in-memory MongoDB (Mongomock)")
            cls._instance.client = mongomock.MongoClient()
            cls._instance.db = cls._instance.client[os.getenv("DB_NAME", "coffeeshop")] # Use consistent DB name
            
            # Seed data if empty
            if cls._instance.db["prices"].count_documents({}) == 0:
                print("Seeding database with default products...")
                seed_data = [
                    {"name": "Espresso", "price": 140, "image_url": "/images/espresso.png"},
                    {"name": "Latte", "price": 280, "image_url": "/images/latte.png"},
                    {"name": "Cappuccino", "price": 260, "image_url": "/images/cappuccino.png"},
                    {"name": "Croissant", "price": 120, "image_url": "/images/snack.png"},
                    {"name": "Muffin", "price": 100, "image_url": "/images/snack.png"},
                    {"name": "Iced Coffee", "price": 220, "image_url": "/images/espresso.png"}
                ]
                cls._instance.db["prices"].insert_many(seed_data)

            # Seed Users (Owner & Staff) with Hashed Passwords
            # UPDATED FOR PHASE 5 SCHEMAS
            if cls._instance.db["users_staff"].count_documents({}) == 0:
                print("Seeding database with default STAFF users...")
                staff_data = [
                    {
                        "email": "owner@mongo.cafe", 
                        "username": "owner",
                        "password": get_password_hash("admin123"), 
                        "pin": get_password_hash("1111"), # Matches UI instructions
                        "role": "owner",
                        "name": "Big Boss"
                    },
                    {
                        "email": "manager@mongo.cafe", 
                        "username": "manager",
                        "password": get_password_hash("manager123"), 
                        "pin": get_password_hash("2222"),
                        "role": "manager",
                        "name": "Shift Lead"
                    },
                    {
                        "email": "cashier@mongo.cafe", 
                        "username": "cashier",
                        "password": get_password_hash("cashier123"), 
                        "pin": get_password_hash("3333"),
                        "role": "cashier",
                        "name": "Barista Bob"
                    },
                    {
                        "email": "barista@mongo.cafe", 
                        "username": "barista",
                        "password": get_password_hash("barista123"), 
                        "pin": get_password_hash("4444"),
                        "role": "barista",
                        "name": "Just Barista"
                    }
                ]
                cls._instance.db["users_staff"].insert_many(staff_data)
                
                # Also Seed a demo customer if not exists
                if cls._instance.db["customers"].count_documents({}) == 0:
                    cls._instance.db["customers"].insert_one({
                        "phone": "9876543210",
                        "name": "Demo Customer",
                        "email": "demo@customer.com"
                    })

        return cls._instance

    def get_db(self):
        return self.db

    def get_collection(self, collection_name):
        return self.db[collection_name]

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
                    # Hot Coffee
                    {"name": "Masala Chai", "price": 40, "category": "Hot Coffee", "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80"},
                    {"name": "Filter Coffee", "price": 50, "category": "Hot Coffee", "image_url": "https://images.unsplash.com/photo-1596952763776-3fb7637d7a5b?w=500&q=80"},
                    {"name": "Espresso", "price": 120, "category": "Hot Coffee", "image_url": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80"},
                    {"name": "Cappuccino", "price": 180, "category": "Hot Coffee", "image_url": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80"},
                    
                    # Cold Coffee
                    {"name": "Iced Americano", "price": 160, "category": "Cold Coffee", "image_url": "https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?w=500&q=80"},
                    {"name": "Frappe", "price": 220, "category": "Cold Coffee", "image_url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80"},
                    {"name": "Cold Coffee with Ice Cream", "price": 250, "category": "Cold Coffee", "image_url": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&q=80"},

                    # Snacks
                    {"name": "Vada Pav", "price": 60, "category": "Snacks", "image_url": "https://images.unsplash.com/photo-1629862803859-9941a5472855?w=500&q=80"},
                    {"name": "Bun Maska", "price": 80, "category": "Snacks", "image_url": "https://images.unsplash.com/photo-1610137312627-880c59296544?w=500&q=80"},
                    {"name": "Paneer Sandwich", "price": 150, "category": "Snacks", "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80"},
                    {"name": "Veg Burger", "price": 140, "category": "Snacks", "image_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80"},
                    {"name": "Fries", "price": 100, "category": "Snacks", "image_url": "https://images.unsplash.com/photo-1518013431117-e5952c874f94?w=500&q=80"}
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

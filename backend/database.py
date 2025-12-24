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
            cls._instance.db = cls._instance.client[os.getenv("DB_NAME", "coffeeshop")]
            
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

            # Seed Users (Owner & Manager) with Hashed Passwords
            if cls._instance.db["users"].count_documents({}) == 0:
                print("Seeding database with default users...")
                users_data = [
                    {
                        "username": "owner", 
                        "password": get_password_hash("owner123"), 
                        "role": "owner",
                        "name": "Big Boss"
                    },
                    {
                        "username": "manager", 
                        "password": get_password_hash("manager123"), 
                        "role": "manager",
                        "name": "Shift Lead"
                    },
                    {
                        "username": "cashier", 
                        "password": get_password_hash("cashier123"), 
                        "role": "cashier",
                        "name": "Barista Bob"
                    }
                ]
                cls._instance.db["users"].insert_many(users_data)

        return cls._instance

    def get_db(self):
        return self.db

    def get_collection(self, collection_name):
        return self.db[collection_name]

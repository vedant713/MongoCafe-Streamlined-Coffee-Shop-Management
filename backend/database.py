import os
import pymongo
from dotenv import load_dotenv

load_dotenv()

class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.client = pymongo.MongoClient(os.getenv("MONGO_URI"))
            cls._instance.db = cls._instance.client[os.getenv("DB_NAME")]
        return cls._instance

    def get_db(self):
        return self.db

    def get_collection(self, collection_name):
        return self.db[collection_name]

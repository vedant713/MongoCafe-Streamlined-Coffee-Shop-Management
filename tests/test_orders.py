
import unittest
from datetime import datetime
from backend.database import Database
from backend.routers.orders import create_order, OrderModel, OrderItem
from backend.auth_utils import UserContext

class TestOrders(unittest.TestCase):
    def setUp(self):
        # Reset Database
        self.db = Database()
        self.db.db.drop_collection("orders")
        self.db.db.drop_collection("inventory")
        self.db.db.drop_collection("prices")
        
        # Seed Inventory
        self.inventory_col = self.db.get_collection("inventory")
        self.inventory_col.insert_many([
            {"name": "Espresso Beans", "quantity": 1000},
            {"name": "Milk", "quantity": 1000},
            {"name": "Cups", "quantity": 100}
        ])

        # Seed Products with Recipes
        self.prices_col = self.db.get_collection("prices")
        self.prices_col.insert_one({
            "name": "Latte", 
            "price": 100, 
            "recipe": {"Espresso Beans": 18, "Milk": 200, "Cups": 1}
        })

    def test_create_order_deducts_inventory(self):
        # Prepare Order
        order_input = OrderModel(
            items=[OrderItem(name="Latte", price=100, quantity=2)],
            subtotal=200,
            tax=10,
            service_charge=0,
            grand_total=210,
            payment_method="Cash"
        )
        
        # Mock User (Owner has all perms)
        user = UserContext(
            user_id="test_user",
            username="owner", 
            role="owner",
            permissions=["orders:create", "orders:read"]
        )
        
        # Execute
        response = create_order(order_input, user)
        
        # Assert Response
        self.assertEqual(response["status"], "success")
        
        # Assert Inventory Deduction
        # Latte uses 18g Beans * 2 = 36g. Start 1000 -> End 964
        beans = self.inventory_col.find_one({"name": "Espresso Beans"})
        self.assertEqual(beans["quantity"], 964)
        
        # Milk uses 200ml * 2 = 400ml. Start 1000 -> End 600
        milk = self.inventory_col.find_one({"name": "Milk"})
        self.assertEqual(milk["quantity"], 600)

    def test_create_order_insufficient_stock(self):
        # Reduce Stock
        self.inventory_col.update_one({"name": "Espresso Beans"}, {"$set": {"quantity": 10}})
        
        order_input = OrderModel(
            items=[OrderItem(name="Latte", price=100, quantity=1)],
            subtotal=100,
            tax=5,
            service_charge=0,
            grand_total=105,
            payment_method="Cash"
        )
        
        user = UserContext(user_id="test_user", username="owner", role="owner", permissions=["orders:create"])
        
        # Expect 400 Error
        from fastapi import HTTPException
        with self.assertRaises(HTTPException) as cm:
            create_order(order_input, user)
        
        self.assertEqual(cm.exception.status_code, 400)
        self.assertIn("Insufficient stock", cm.exception.detail)

if __name__ == '__main__':
    unittest.main()

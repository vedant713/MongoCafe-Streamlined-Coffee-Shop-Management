from fastapi import APIRouter
from backend.database import Database
from datetime import datetime, timedelta

router = APIRouter()
db = Database()
orders_collection = db.get_collection("orders")

@router.get("/analytics/summary")
def get_analytics_summary():
    # Total Sales (Sum of grand_total)
    pipeline_sales = [
        {"$group": {"_id": None, "total_sales": {"$sum": "$grand_total"}}}
    ]
    sales_result = list(orders_collection.aggregate(pipeline_sales))
    total_sales = sales_result[0]["total_sales"] if sales_result else 0
    
    # Total Orders
    total_orders = orders_collection.count_documents({})
    
    return {
        "total_sales": total_sales,
        "total_orders": total_orders
    }

@router.get("/analytics/peak-hours")
def get_peak_hours():
    # Group by hour of day
    pipeline = [
        {"$project": {"hour": {"$hour": "$timestamp"}}},
        {"$group": {"_id": "$hour", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    results = list(orders_collection.aggregate(pipeline))
    
    # Format for frontend: [{ hour: 10, orders: 5 }, ...]
    formatted = [{"hour": r["_id"], "orders": r["count"]} for r in results]
    return formatted

@router.get("/analytics/popular-items")
def get_popular_items():
    # Unwind items and group by name
    pipeline = [
        {"$unwind": "$items"},
        {"$group": {"_id": "$items.name", "quantity": {"$sum": "$items.quantity"}}},
        {"$sort": {"quantity": -1}},
        {"$limit": 5}
    ]
    results = list(orders_collection.aggregate(pipeline))
    
    # Format: [{ name: "Latte", quantity: 50 }, ...]
    formatted = [{"name": r["_id"], "quantity": r["quantity"]} for r in results]
    return formatted

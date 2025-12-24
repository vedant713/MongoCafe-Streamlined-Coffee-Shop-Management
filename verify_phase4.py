import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://localhost:8000/api"

def print_pass(msg):
    print(f"\033[92m[PASS] {msg}\033[0m")

def print_fail(msg):
    print(f"\033[91m[FAIL] {msg}\033[0m")

def make_request(endpoint, method="GET", data=None):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    
    if data:
        json_data = json.dumps(data).encode('utf-8')
        req.data = json_data

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return {"status_code": response.getcode(), "body": json.loads(res_body) if res_body else {}}
    except urllib.error.HTTPError as e:
        res_body = e.read().decode('utf-8')
        return {"status_code": e.code, "body": json.loads(res_body) if res_body else {}, "error": str(e)}
    except Exception as e:
        return {"status_code": 500, "error": str(e)}

def verify_inventory():
    print("\n--- Verifying Inventory Deduction ---")
    
    # 0. Seed Inventory (since mongomock resets on reload)
    make_request("/inventory/seed", method="POST")

    # 1. Get Initial Stock of Beans
    res = make_request("/inventory")
    if res.get("error"):
         print_fail(f"Failed to get inventory: {res['error']}")
         return

    inventory = res["body"]
    beans_start = next((item["quantity"] for item in inventory if item["name"] == "Espresso Beans"), None)
    
    if beans_start is None:
        print_fail("Espresso Beans not found in inventory. Did seeding work?")
        return

    print(f"Initial Beans: {beans_start}")

    # 2. Place Order for Espresso (Uses 18g Beans)
    order_payload = {
        "items": [{"name": "Espresso", "price": 140, "quantity": 1}],
        "subtotal": 140,
        "tax": 7,
        "service_charge": 0,
        "grand_total": 147,
        "payment_method": "Cash"
    }
    
    res = make_request("/orders", method="POST", data=order_payload)
    if res["status_code"] != 200:
        print_fail(f"Order failed: {res.get('body')}")
        return
    
    print_pass("Order placed successfully")

    # 3. Verify Deduction
    res = make_request("/inventory")
    inventory = res["body"]
    beans_end = next((item["quantity"] for item in inventory if item["name"] == "Espresso Beans"), None)
    
    print(f"Final Beans: {beans_end}")
    
    expected = beans_start - 18
    if beans_end == expected:
        print_pass(f"Inventory deducted correctly ({beans_start} -> {beans_end})")
    else:
        print_fail(f"Inventory mismatch! Expected {expected}, got {beans_end}")

def verify_attendance():
    print("\n--- Verifying Employee Attendance ---")
    
    # 1. Create Test Employee
    test_emp = {
        "name": "Test Bot",
        "age": "99",
        "phoneno": "0000000000",
        "salary": "100",
        "email": "bot@test.com",
        "category": "Cleaner"
    }
    
    # Clean up first
    make_request("/employees/0000000000", method="DELETE")
    
    res = make_request("/employees", method="POST", data=test_emp)
    if res["status_code"] != 200:
        print_fail(f"Failed to create employee: {res.get('body')}")
        return
    print_pass("Test employee created")

    # 2. Check In
    checkin_payload = {"phoneno": "0000000000", "type": "Check-in", "timestamp": "2024-01-01T10:00:00"}
    res = make_request("/employees/attendance", method="POST", data=checkin_payload)
    if res["status_code"] != 200:
        print_fail(f"Check-in failed: {res.get('body')}")
    else:
        print_pass("Check-in successful")

    # 3. Verify Status
    res = make_request("/employees/attendance/status/0000000000")
    status = res["body"].get("status")
    if status == "Checked-in":
        print_pass("Status verified: Checked-in")
    else:
        print_fail(f"Status mismatch! Expected Checked-in, got {status}")

    # 4. Check Out
    checkout_payload = {"phoneno": "0000000000", "type": "Check-out", "timestamp": "2024-01-01T18:00:00"}
    res = make_request("/employees/attendance", method="POST", data=checkout_payload)
    if res["status_code"] != 200:
        print_fail(f"Check-out failed: {res.get('body')}")
    else:
        print_pass("Check-out successful")

    # 5. Verify Status Again
    res = make_request("/employees/attendance/status/0000000000")
    status = res["body"].get("status")
    if status == "Checked-out":
        print_pass("Status verified: Checked-out")
    else:
        print_fail(f"Status mismatch! Expected Checked-out, got {status}")

    # Cleanup
    make_request("/employees/0000000000", method="DELETE")

if __name__ == "__main__":
    try:
        verify_inventory()
        verify_attendance()
    except Exception as e:
        print_fail(f"Exception during verification: {e}")

import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://localhost:8000/api/auth"
API_URL = "http://localhost:8000/api"

def print_pass(msg):
    print(f"\033[92m[PASS] {msg}\033[0m")

def print_fail(msg):
    print(f"\033[91m[FAIL] {msg}\033[0m")

def make_request(url, method="GET", data=None, token=None):
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    
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

def verify_auth():
    print("\n--- Verifying Authentication & RBAC ---")
    
    # 0. Seed needed? Database py seeds on init.
    # Assuming app is running and seeded.
    
    # 1. Staff Login (Owner - Email)
    print("1. Testing Owner Login (Email)...")
    login_data = {"email": "owner@mongo.cafe", "password": "admin123"}
    res = make_request(f"{BASE_URL}/staff/login", method="POST", data=login_data)
    if res["status_code"] != 200:
        print_fail(f"Owner login failed: {res.get('body')}")
        return
    owner_token = res["body"]["access_token"]
    print_pass("Owner logged in")

    # 2. Staff Login (Cashier - PIN)
    print("2. Testing Cashier Login (PIN)...")
    pin_data = {"pin": "1234"}
    res = make_request(f"{BASE_URL}/staff/pin", method="POST", data=pin_data)
    if res["status_code"] != 200:
        print_fail(f"Cashier PIN login failed: {res.get('body')}")
        return
    cashier_token = res["body"]["access_token"]
    print_pass("Cashier logged in via PIN")

    # 3. Customer Login (OTP)
    print("3. Testing Customer Login (OTP)...")
    # Send
    make_request(f"{BASE_URL}/customer/send-otp", method="POST", data={"phone": "9998887776"})
    # Verify
    res = make_request(f"{BASE_URL}/customer/verify-otp", method="POST", data={"phone": "9998887776", "otp": "1234"})
    if res["status_code"] != 200:
        print_fail(f"Customer OTP verify failed: {res.get('body')}")
        return
    customer_token = res["body"]["access_token"]
    print_pass("Customer logged in via OTP")

    # 4. RBAC Check: Inventory Access
    print("4. Testing RBAC: Inventory Write Access")
    
    # Owner SHOULD be able to add inventory
    inv_item = {"name": "TestItem", "quantity": 100, "unit": "kg", "threshold": 10}
    res = make_request(f"{API_URL}/inventory", method="POST", data=inv_item, token=owner_token)
    if res["status_code"] == 200:
        print_pass("Owner added inventory")
    else:
        print_fail(f"Owner failed to add inventory: {res.get('body')}")

    # Cashier SHOULD NOT be able to add inventory (Read only)
    res = make_request(f"{API_URL}/inventory", method="POST", data=inv_item, token=cashier_token)
    if res["status_code"] == 403:
        print_pass("Cashier correctly blocked from adding inventory")
    else:
        print_fail(f"Cashier was NOT blocked! Status: {res['status_code']}")

    # Customer SHOULD NOT be able to access inventory list (No PERM)
    res = make_request(f"{API_URL}/inventory", method="GET", token=customer_token)
    if res["status_code"] == 403:
        print_pass("Customer correctly blocked from reading inventory")
    else:
        print_fail(f"Customer was NOT blocked! Status: {res['status_code']}")

    # 5. Order Creation
    print("5. Testing Order Creation")
    order_data = {
         "items": [{"name": "Espresso", "price": 140, "quantity": 1}],
         "subtotal": 140, "tax": 7, "service_charge": 0, "grand_total": 147, "payment_method": "Cash"
    }
    
    # Customer can create order
    res = make_request(f"{API_URL}/orders", method="POST", data=order_data, token=customer_token)
    if res["status_code"] == 200:
        print_pass("Customer created order")
    else:
        print_fail(f"Customer failed to create order: {res.get('body')}")

if __name__ == "__main__":
    try:
        verify_auth()
    except Exception as e:
        print_fail(f"Exception: {e}")

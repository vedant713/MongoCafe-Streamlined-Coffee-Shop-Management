from backend.security import get_password_hash, verify_password

password = "owner123"
hashed = get_password_hash(password)
print(f"Password: {password}")
print(f"Hashed: {hashed}")
print(f"Type of Hashed: {type(hashed)}")

is_valid = verify_password(password, hashed)
print(f"Is Valid: {is_valid}")

if is_valid:
    print("SUCCESS: Password verification works.")
else:
    print("FAILURE: Password verification FAILED.")

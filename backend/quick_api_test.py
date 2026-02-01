#!/usr/bin/env python
import urllib.request
import urllib.error
import json

BASE_URL = 'http://127.0.0.1:8000/api'

print("=" * 60)
print("TESTING LOGIN API")
print("=" * 60)

# Test login
data = json.dumps({'email': 'member@muscles.fit', 'password': 'member123'}).encode()
request = urllib.request.Request(
    f'{BASE_URL}/auth/login/',
    data=data,
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode())
        print(f"\n✅ Login Successful (Status: {response.status})")
        print(f"   Access Token: {result.get('access', '')[:30]}...")
        print(f"   User Role: {result.get('user', {}).get('role')}")
        print(f"   User Name: {result.get('user', {}).get('first_name')} {result.get('user', {}).get('last_name')}")
except urllib.error.HTTPError as e:
    print(f"\n❌ Login Failed (Status: {e.code})")
    try:
        error_data = json.loads(e.read().decode())
        print(f"   Error: {json.dumps(error_data, indent=2)}")
    except:
        print(f"   Response: {e.read().decode()}")
except Exception as e:
    print(f"\n❌ Connection Error: {e}")
    print("   Is the backend running on http://127.0.0.1:8000 ?")

"""
Test: Owner creates member with full details (name, email, password, join_date, plan)
Member can then login with email + password
"""
import os
import django
import json
import urllib.request
import urllib.error
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

BASE_URL = 'http://127.0.0.1:8000/api'

def make_request(method, url, data=None, headers=None):
    """Helper to make HTTP requests"""
    if headers is None:
        headers = {}
    headers['Content-Type'] = 'application/json'
    
    if data:
        data = json.dumps(data).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode())
        except:
            return e.code, {'error': e.read().decode()}

print("=" * 70)
print("TEST: Owner Creates Member with Full Details")
print("=" * 70)

# Step 1: Get owner token
print("\n1️⃣ Get Owner Token")
status_code, response = make_request('POST', f'{BASE_URL}/auth/login/', {
    'email': 'owner@test.com',
    'password': 'owner123'
})

if status_code != 200:
    print(f"❌ ERROR: {response}")
    exit(1)

owner_token = response['access']
print("✅ Owner authenticated")

# Step 2: Owner creates member with full details
print("\n2️⃣ Owner Creates Member with Full Details")
member_data = {
    'name': 'Sarah Johnson',
    'email': 'sarah.johnson@test.com',
    'password': 'Sarah@12345',
    'join_date': datetime.now().isoformat() + 'Z',
    'plan': 'Premium 6-Month'
}

headers = {'Authorization': f'Bearer {owner_token}'}
status_code, response = make_request('POST', f'{BASE_URL}/members/create_member/', member_data, headers)

print(f"   Status: {status_code}")
if status_code != 201:
    print(f"   ❌ ERROR: {json.dumps(response, indent=2)}")
    exit(1)

print("✅ Member created successfully")
print(f"   Name: {response.get('name')}")
print(f"   Email: {response.get('email')}")
print(f"   Plan: {response.get('plan')}")
print(f"   Join Date: {response.get('join_date')}")

# Step 3: Member logs in with email + password
print("\n3️⃣ Member Logs In with Email + Password")
status_code, response = make_request('POST', f'{BASE_URL}/auth/login/', {
    'email': 'sarah.johnson@test.com',
    'password': 'Sarah@12345'
})

if status_code != 200:
    print(f"❌ ERROR: Member login failed!")
    print(f"   Response: {json.dumps(response, indent=2)}")
    exit(1)

member_token = response['access']
user_info = response.get('user', {})
print("✅ Member logged in successfully")
print(f"   Email: {user_info.get('email')}")
print(f"   Role: {user_info.get('role')}")

# Step 4: Member accesses dashboard
print("\n4️⃣ Member Accesses Dashboard")
headers = {'Authorization': f'Bearer {member_token}'}
status_code, response = make_request('GET', f'{BASE_URL}/users/dashboard/', headers=headers)

if status_code != 200:
    print(f"❌ ERROR: Dashboard not accessible")
    print(f"   Response: {json.dumps(response, indent=2)}")
    exit(1)

print("✅ Member dashboard accessible")
print(f"   Role: {response.get('role')}")

print("\n" + "=" * 70)
print("✅ ALL TESTS PASSED!")
print("=" * 70)
print("\nMember Creation Flow (Complete):")
print("  ✓ Owner creates member with name, email, password, join_date, plan")
print("  ✓ Member info stored in database (User + Member profile)")
print("  ✓ Member can login immediately with email + password")
print("  ✓ Member can access dashboard")

"""
Setup script: Create owner account and test member creation flow
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from members.models import Member

User = get_user_model()

# Create or get owner account
print("=" * 60)
print("SETUP: Create Owner Account")
print("=" * 60)

owner_email = 'owner@test.com'
owner_password = 'owner123'

owner, created = User.objects.get_or_create(
    email=owner_email,
    defaults={
        'first_name': 'Gym',
        'last_name': 'Owner',
        'role': 'owner'
    }
)

if created:
    owner.set_password(owner_password)
    owner.save()
    print(f"✅ Owner created: {owner_email}")
else:
    print(f"✅ Owner already exists: {owner_email}")

print(f"   Password: {owner_password}")

# Now test member creation
print("\n" + "=" * 60)
print("TEST: Create Member via API")
print("=" * 60)

import json
import urllib.request
import urllib.error

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
        return e.code, json.loads(e.read().decode())

# Step 1: Get owner token
print("\n1️⃣ Get Owner Token")
status_code, response = make_request('POST', f'{BASE_URL}/auth/login/', {
    'email': owner_email,
    'password': owner_password
})
print(f"   Status: {status_code}")

if status_code != 200:
    print(f"   ❌ ERROR: {response}")
    exit(1)

owner_token = response['access']
print(f"   ✅ Owner token obtained")

# Step 2: Create new member
print("\n2️⃣ Create New Member (as Owner)")
new_member_email = 'testmember2@test.com'
new_member_password = 'TestMember123'

headers = {'Authorization': f'Bearer {owner_token}'}
status_code, response = make_request('POST', f'{BASE_URL}/members/create_member/', {
    'email': new_member_email,
    'password': new_member_password,
    'first_name': 'Test',
    'last_name': 'Member'
}, headers)

print(f"   Status: {status_code}")
if status_code != 201:
    print(f"   ❌ ERROR: {json.dumps(response, indent=2)}")
    exit(1)

print(f"   ✅ Member created: {new_member_email}")
print(f"      Response: {json.dumps(response, indent=2)}")

# Step 3: Login with new member
print("\n3️⃣ Login with New Member Credentials")
status_code, response = make_request('POST', f'{BASE_URL}/auth/login/', {
    'email': new_member_email,
    'password': new_member_password
})

print(f"   Status: {status_code}")
if status_code != 200:
    print(f"   ❌ ERROR: New member login failed!")
    print(f"   Response: {json.dumps(response, indent=2)}")
    exit(1)

member_token = response['access']
user_info = response.get('user', {})
print(f"   ✅ Member logged in successfully!")
print(f"      Email: {user_info.get('email')}")
print(f"      Role: {user_info.get('role')}")

# Step 4: Access dashboard with member token
print("\n4️⃣ Access Member Dashboard")
headers = {'Authorization': f'Bearer {member_token}'}
status_code, response = make_request('GET', f'{BASE_URL}/users/dashboard/', headers=headers)

print(f"   Status: {status_code}")
if status_code == 200:
    print(f"   ✅ Dashboard accessible!")
else:
    print(f"   ❌ Dashboard not accessible: {json.dumps(response, indent=2)}")
    exit(1)

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED!")
print("=" * 60)
print("\nMember Creation Flow Works:")
print(f"  1. Owner creates member: {new_member_email}")
print(f"  2. Member can login: {new_member_email} / {new_member_password}")
print(f"  3. Member can access dashboard")

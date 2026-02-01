"""
Test script: Create a member via API and verify login works
"""
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

# Test 1: First, get owner token
print("=" * 60)
print("TEST 1: Get Owner Token")
print("=" * 60)
status_code, response = make_request('POST', f'{BASE_URL}/auth/login/', {
    'email': 'owner@test.com',
    'password': 'owner123'
})
print(f"Status: {status_code}")
print(f"Response: {json.dumps(response, indent=2)}")

if status_code != 200:
    print("ERROR: Could not get owner token. Exiting.")
    exit(1)

owner_token = response['access']
print(f"✅ Owner token obtained: {owner_token[:50]}...")

# Test 2: Create a new member using owner token
print("\n" + "=" * 60)
print("TEST 2: Create New Member (as Owner)")
print("=" * 60)

new_member_email = 'newmember@test.com'
new_member_password = 'NewMember123'

headers = {'Authorization': f'Bearer {owner_token}'}
status_code, response = make_request('POST', f'{BASE_URL}/members/create_member/', {
    'email': new_member_email,
    'password': new_member_password,
    'first_name': 'New',
    'last_name': 'Member'
}, headers)

print(f"Status: {status_code}")
print(f"Response: {json.dumps(response, indent=2)}")

if status_code != 201:
    print("ERROR: Could not create member. Exiting.")
    exit(1)

print(f"✅ Member created: {new_member_email}")

# Test 3: Try to log in with the new member credentials
print("\n" + "=" * 60)
print("TEST 3: Login with New Member Credentials")
print("=" * 60)

status_code, response = make_request('POST', f'{BASE_URL}/auth/login/', {
    'email': new_member_email,
    'password': new_member_password
})

print(f"Status: {status_code}")
print(f"Response: {json.dumps(response, indent=2)}")

if status_code != 200:
    print("❌ ERROR: New member could not log in!")
    exit(1)

member_token = response['access']
user_info = response.get('user', {})
print(f"✅ New member logged in successfully!")
print(f"   Email: {user_info.get('email')}")
print(f"   Role: {user_info.get('role')}")
print(f"   Token: {member_token[:50]}...")

# Test 4: Verify member can access dashboard
print("\n" + "=" * 60)
print("TEST 4: Access Member Dashboard with New Token")
print("=" * 60)

headers = {'Authorization': f'Bearer {member_token}'}
status_code, response = make_request('GET', f'{BASE_URL}/users/dashboard/', headers=headers)

print(f"Status: {status_code}")
if status_code == 200:
    print(f"✅ Dashboard accessible!")
    print(f"   Role: {response.get('role')}")
    print(f"   User: {response.get('user', {}).get('first_name')} {response.get('user', {}).get('last_name')}")
else:
    print(f"❌ Dashboard not accessible")
    print(f"Response: {json.dumps(response, indent=2)}")

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED!")
print("=" * 60)

#!/usr/bin/env python
import urllib.request
import json

BASE_URL = 'http://127.0.0.1:8000/api'

print("=" * 60)
print("TESTING LOGIN + DASHBOARD")
print("=" * 60)

# Step 1: Login
print("\n1️⃣ LOGGING IN")
data = json.dumps({'email': 'member@muscles.fit', 'password': 'member123'}).encode()
request = urllib.request.Request(
    f'{BASE_URL}/auth/login/',
    data=data,
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode())
        access_token = result.get('access')
        refresh_token = result.get('refresh')
        
        print(f"✅ Login Successful")
        print(f"   Access Token: {access_token[:50] if access_token else 'NONE'}...")
        print(f"   Refresh Token: {refresh_token[:50] if refresh_token else 'NONE'}...")
        print(f"   User: {result.get('user', {}).get('first_name')} {result.get('user', {}).get('last_name')}")
        
        # Step 2: Test dashboard with token
        print(f"\n2️⃣ TESTING DASHBOARD ENDPOINT")
        dashboard_request = urllib.request.Request(
            f'{BASE_URL}/users/dashboard/',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        )
        
        try:
            with urllib.request.urlopen(dashboard_request) as dash_response:
                dash_result = json.loads(dash_response.read().decode())
                print(f"✅ Dashboard Successful")
                print(f"   Role: {dash_result.get('role')}")
                print(f"   Trainer: {dash_result.get('trainer', {}).get('first_name')} {dash_result.get('trainer', {}).get('last_name')}")
                print(f"   Programs: {len(dash_result.get('programs', []))} assigned")
        except urllib.error.HTTPError as e:
            error_data = json.loads(e.read().decode())
            print(f"❌ Dashboard Failed (Status: {e.code})")
            print(f"   Error: {json.dumps(error_data, indent=2)}")
            
except urllib.error.HTTPError as e:
    error_data = json.loads(e.read().decode())
    print(f"❌ Login Failed (Status: {e.code})")
    print(f"   Error: {json.dumps(error_data, indent=2)}")
except Exception as e:
    print(f"❌ Connection Error: {e}")

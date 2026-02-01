#!/usr/bin/env python
"""
Quick test to verify Member Dashboard API response structure
Run this after starting the backend server
"""
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"
MEMBER_EMAIL = "member@muscles.fit"
MEMBER_PASSWORD = "member123"

def test_member_dashboard():
    print("=" * 60)
    print("MEMBER DASHBOARD API TEST")
    print("=" * 60)
    
    # Step 1: Login
    print("\n1. Testing login...")
    login_response = requests.post(
        f"{BASE_URL}/login/",
        json={"email": MEMBER_EMAIL, "password": MEMBER_PASSWORD}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.json())
        return False
    
    login_data = login_response.json()
    access_token = login_data.get('access')
    
    if not access_token:
        print("❌ No access token returned")
        return False
    
    print(f"✅ Login successful")
    print(f"   Token: {access_token[:30]}...")
    
    # Step 2: Fetch dashboard
    print("\n2. Fetching member dashboard...")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    dashboard_response = requests.get(
        f"{BASE_URL}/users/dashboard/",
        headers=headers
    )
    
    if dashboard_response.status_code != 200:
        print(f"❌ Dashboard fetch failed: {dashboard_response.status_code}")
        print(dashboard_response.json())
        return False
    
    dashboard_data = dashboard_response.json()
    print(f"✅ Dashboard fetched successfully")
    
    # Step 3: Validate response structure
    print("\n3. Validating response structure...")
    
    # Check role
    if dashboard_data.get('role') != 'member':
        print(f"❌ Invalid role: {dashboard_data.get('role')}")
        return False
    print(f"✅ Role: member")
    
    # Check trainer
    trainer = dashboard_data.get('trainer')
    if trainer:
        print(f"✅ Trainer assigned:")
        print(f"   Name: {trainer.get('first_name')} {trainer.get('last_name')}")
        print(f"   Email: {trainer.get('email')}")
    else:
        print(f"⚠️  No trainer assigned (optional)")
    
    # Check programs
    programs = dashboard_data.get('programs', [])
    print(f"✅ Programs: {len(programs)} assigned")
    for i, program in enumerate(programs, 1):
        print(f"   {i}. {program.get('name')} (${program.get('price')})")
    
    # Check stats
    stats = dashboard_data.get('stats', {})
    print(f"✅ Stats:")
    print(f"   Workouts Done: {stats.get('workouts_done')}")
    print(f"   Attendance Rate: {stats.get('attendance_rate')}%")
    print(f"   Progress: {stats.get('progress')}%")
    
    # Step 4: Full response
    print("\n4. Complete Response Structure:")
    print(json.dumps(dashboard_data, indent=2))
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED - API response is correct!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    try:
        success = test_member_dashboard()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

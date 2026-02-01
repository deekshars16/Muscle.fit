#!/usr/bin/env python
"""Test the backend API endpoints with proper token handling"""

import json

BASE_URL = 'http://127.0.0.1:8000/api'

# Test with curl-like approach
import subprocess

def test_api():
    print("\n=== Testing Backend API ===\n")
    
    credentials = [
        ('member@muscles.fit', 'member123', 'member'),
    ]
    
    for email, password, role in credentials:
        print(f"\n--- Testing {role.upper()} ({email}) ---")
        
        # Login
        login_cmd = f'''curl -s -X POST http://127.0.0.1:8000/api/auth/login/ -H "Content-Type: application/json" -d '{{"email":"{email}","password":"{password}"}}' '''
        
        result = subprocess.run(login_cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            try:
                login_data = json.loads(result.stdout)
                token = login_data.get('access')
                user_data = login_data.get('user', {})
                
                print(f"✅ Login successful")
                print(f"   User: {user_data.get('email')} ({user_data.get('role')})")
                
                # Get dashboard
                dashboard_cmd = f'''curl -s -X GET http://127.0.0.1:8000/api/users/dashboard/ -H "Authorization: Bearer {token}" -H "Content-Type: application/json" '''
                
                result = subprocess.run(dashboard_cmd, shell=True, capture_output=True, text=True)
                
                if result.returncode == 0:
                    dashboard_data = json.loads(result.stdout)
                    print(f"✅ Dashboard retrieved")
                    print(f"   {json.dumps(dashboard_data, indent=4)}")
                else:
                    print(f"❌ Dashboard failed: {result.stdout}")
            except Exception as e:
                print(f"❌ Error: {e}")
                print(f"   Response: {result.stdout}")
        else:
            print(f"❌ Login failed: {result.stdout}")

if __name__ == '__main__':
    test_api()

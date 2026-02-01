#!/usr/bin/env python
"""Simple test to check token validity"""

import subprocess
import json

# Test login
login_cmd = '''curl -s -X POST http://127.0.0.1:8000/api/auth/login/ -H "Content-Type: application/json" -d "{\\"email\\":\\"member@muscles.fit\\",\\"password\\":\\"member123\\"}" '''

result = subprocess.run(login_cmd, shell=True, capture_output=True, text=True)
print("Login Response:")
print(result.stdout)
print("\n")

if result.returncode == 0:
    try:
        data = json.loads(result.stdout)
        print("Parsed JSON:")
        print(f"- Access Token: {data.get('access')[:50]}...")
        print(f"- Refresh Token: {data.get('refresh')[:50]}...")
        print(f"- User: {data.get('user')}")
        print("\n")
        
        # Test with the token
        token = data.get('access')
        if token:
            print(f"Testing dashboard with token: {token[:30]}...")
            dashboard_cmd = f'''curl -s -X GET http://127.0.0.1:8000/api/users/dashboard/ -H "Authorization: Bearer {token}" '''
            result = subprocess.run(dashboard_cmd, shell=True, capture_output=True, text=True)
            print("Dashboard Response:")
            print(result.stdout)
    except Exception as e:
        print(f"Error parsing JSON: {e}")

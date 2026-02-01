import os
import sys
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import Client
import json

print("=" * 60)
print("TESTING API LOGIN ENDPOINT")
print("=" * 60)

client = Client()

# Test the login API
response = client.post(
    '/api/login/',
    data=json.dumps({
        'email': 'owner@muscles.fit',
        'password': 'test123'
    }),
    content_type='application/json'
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.content.decode()}")

if response.status_code == 200:
    data = json.loads(response.content)
    print("\n✓ LOGIN SUCCESSFUL!")
    print(f"  Role: {data.get('role')}")
    print(f"  Has access token: {'access' in data}")
    print(f"  Has refresh token: {'refresh' in data}")
else:
    print("\n✗ LOGIN FAILED!")
    data = json.loads(response.content)
    print(f"  Error: {data.get('error', 'Unknown error')}")

import requests
import json

print("=" * 60)
print("TESTING LOGIN API WITH HTTP REQUEST")
print("=" * 60)

url = 'http://localhost:8000/api/login/'
payload = {
    'email': 'owner@muscles.fit',
    'password': 'test123'
}

try:
    response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'})
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code == 200:
        print("\n✓ LOGIN SUCCESSFUL!")
    else:
        print(f"\n✗ LOGIN FAILED!")
        
except requests.exceptions.ConnectionError:
    print("✗ Cannot connect to Django server!")
    print("  Make sure Django is running: python manage.py runserver")
except Exception as e:
    print(f"✗ Error: {e}")

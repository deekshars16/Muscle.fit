#!/usr/bin/env python
import requests
import json

# Test the login endpoint
url = "http://127.0.0.1:8000/api/login/"
data = {
    "email": "owner@muscles.fit",
    "password": "admin123"
}

print(f"Testing: POST {url}")
print(f"Data: {json.dumps(data, indent=2)}")

try:
    response = requests.post(url, json=data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

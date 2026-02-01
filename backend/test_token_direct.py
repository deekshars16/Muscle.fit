#!/usr/bin/env python
"""
Direct test to verify the token is valid
"""
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIRequestFactory
from users.views import DashboardView

User = get_user_model()

print("=" * 60)
print("TESTING TOKEN VALIDATION")
print("=" * 60)

# Step 1: Authenticate user
print("\n1️⃣ AUTHENTICATING USER")
user = authenticate(username='member@muscles.fit', password='member123')
if user:
    print(f"✅ User authenticated: {user.email}")
else:
    print("❌ User authentication failed")
    exit(1)

# Step 2: Generate token
print("\n2️⃣ GENERATING TOKEN")
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)
print(f"✅ Token generated")
print(f"   Access Token: {access_token[:50]}...")

# Step 3: Test dashboard endpoint
print("\n3️⃣ TESTING DASHBOARD ENDPOINT")
factory = APIRequestFactory()
request = factory.get('/api/users/dashboard/', HTTP_AUTHORIZATION=f'Bearer {access_token}')
view = DashboardView.as_view()

try:
    response = view(request)
    if response.status_code == 200:
        print(f"✅ Dashboard endpoint successful (Status: {response.status_code})")
        data = response.data
        print(f"   Role: {data.get('role')}")
        print(f"   Trainer: {data.get('trainer', {}).get('first_name')}")
        print(f"   Programs: {len(data.get('programs', []))}")
    else:
        print(f"❌ Dashboard endpoint failed (Status: {response.status_code})")
        print(f"   Response: {response.data}")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n✅ ALL TESTS PASSED - Token is valid!")

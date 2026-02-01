#!/usr/bin/env python
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import authenticate
from users.models import User

# Test authentication
email = 'owner@muscles.fit'
password = 'admin123'

print(f"Testing login for: {email}")

# Check if user exists
user = User.objects.filter(email=email).first()
print(f"User exists: {user is not None}")
if user:
    print(f"  Email: {user.email}")
    print(f"  Role: {user.role}")
    print(f"  Is active: {user.is_active}")
    print(f"  Has usable password: {user.has_usable_password()}")

# Test authenticate
authenticated_user = authenticate(username=email, password=password)
print(f"\nauthenticate(username='{email}', password='***') result: {authenticated_user}")

if authenticated_user:
    print(f"✓ Authentication successful!")
    print(f"  User: {authenticated_user.email}")
    print(f"  Role: {authenticated_user.role}")
else:
    print(f"✗ Authentication failed!")

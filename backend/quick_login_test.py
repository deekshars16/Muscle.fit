#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

User = get_user_model()

# Check if user exists
user = User.objects.filter(email='member@muscles.fit').first()

if user:
    print(f"✅ User found: {user.email}")
    print(f"   Role: {user.role}")
    print(f"   First Name: {user.first_name}")
    print(f"   Last Name: {user.last_name}")
    
    # Check password
    if check_password('member123', user.password):
        print(f"✅ Password is CORRECT")
    else:
        print(f"❌ Password is INCORRECT")
        print(f"   Password hash: {user.password}")
else:
    print("❌ User not found!")
    print("\nCreating test user...")
    user = User.objects.create_user(
        email='member@muscles.fit',
        password='member123',
        first_name='Member',
        last_name='Muscles',
        role='member'
    )
    user.username = 'member@muscles.fit'
    user.save()
    print(f"✅ User created: {user.email}")

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

# Check owner user
print("=" * 50)
print("CHECKING OWNER USER")
print("=" * 50)
owner = User.objects.get(email='owner@muscles.fit')
print(f"✓ Email: {owner.email}")
print(f"✓ Role: {owner.role}")
print(f"✓ Is Active: {owner.is_active}")
print(f"✓ Password set: {owner.has_usable_password()}")

# Try to authenticate
print("\n" + "=" * 50)
print("ATTEMPTING AUTHENTICATION")
print("=" * 50)

# First, let's see what password you should use
print("\nTry logging in with:")
print(f"  Email: owner@muscles.fit")
print(f"  Password: (the password you set)")

# Test with Django's authenticate function
# auth_user = authenticate(email='owner@muscles.fit', password='test123')
# if auth_user:
#     print(f"\n✓ Authentication successful!")
#     print(f"  Email: {auth_user.email}")
#     print(f"  Role: {auth_user.role}")
# else:
#     print(f"\n✗ Authentication failed!")
#     print(f"  Check the password is correct")

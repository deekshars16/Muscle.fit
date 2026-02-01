import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("TESTING AUTHENTICATION")
print("=" * 60)

# Check if user exists
try:
    user = User.objects.get(email='owner@muscles.fit')
    print(f"✓ User found: {user.email}")
    print(f"✓ Role: {user.role}")
    print(f"✓ Is Active: {user.is_active}")
    print(f"✓ Has usable password: {user.has_usable_password()}")
except User.DoesNotExist:
    print("✗ User not found!")
    exit()

# Test authentication
print("\n" + "=" * 60)
print("TESTING PASSWORD WITH KNOWN VALUES")
print("=" * 60)

# Test with a test password
test_password = "test123"
user.set_password(test_password)
user.save()
print(f"✓ Set password to: {test_password}")

# Now test authentication
authenticated_user = authenticate(username='owner@muscles.fit', password=test_password)
if authenticated_user:
    print(f"✓ AUTHENTICATION SUCCESSFUL!")
    print(f"  Email: {authenticated_user.email}")
    print(f"  Role: {authenticated_user.role}")
else:
    print(f"✗ AUTHENTICATION FAILED!")
    print(f"  Check the backend is properly configured")
    print(f"  Backend should be: users.backends.EmailBackend")

import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from members.models import Member

User = get_user_model()

# Ensure owner and trainer users exist (only these two test accounts)
def ensure_user(email, password, first_name, last_name, role, is_staff=False, is_superuser=False):
    try:
        u = User.objects.get(email=email)
        u.set_password(password)
        u.role = role.upper() if isinstance(role, str) else role
        u.is_staff = is_staff
        u.is_superuser = is_superuser
        u.first_name = first_name
        u.last_name = last_name
        u.save()
        print(f"✅ Updated: {email}")
    except User.DoesNotExist:
        u = User.objects.create_user(
            email=email,
            password=password,
            role=role.upper() if isinstance(role, str) else role,
            first_name=first_name,
            last_name=last_name
        )
        u.is_staff = is_staff
        u.is_superuser = is_superuser
        u.save()
        print(f"✅ Created: {email} / {password}")

ensure_user('owner@muscles.fit', 'owner123', 'Owner', 'Admin', 'OWNER', is_staff=True, is_superuser=True)
ensure_user('trainer@muscles.fit', 'trainer123', 'Trainer', 'User', 'TRAINER')

print("\n📊 Test users ready:")
print("  Owner: owner@muscles.fit / owner123")
print("  Trainer: trainer@muscles.fit / trainer123")

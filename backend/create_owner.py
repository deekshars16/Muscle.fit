#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

# Delete existing owner if any
User.objects.filter(email='owner@muscles.fit').delete()

# Create owner user
owner = User.objects.create_user(
    email='owner@muscles.fit',
    username='owner@muscles.fit',
    password='admin123',
    role='OWNER',
    first_name='Gym',
    last_name='Owner'
)
owner.is_staff = True
owner.is_superuser = True
owner.save()

print(f"✓ Created owner: {owner.email} (role: {owner.role})")
print(f"✓ Password: admin123")
print(f"✓ User exists: {User.objects.filter(email='owner@muscles.fit').exists()}")

# List all users
print("\nAll users:")
for u in User.objects.all():
    print(f"  - {u.email} ({u.role})")

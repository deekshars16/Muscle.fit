#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from gym_info.models import GymInfo

# Create a default gym info record
gym, created = GymInfo.objects.get_or_create(
    id=1,
    defaults={
        'name': 'Muscle.fit',
        'email': 'owner@muscle.fit',
        'phone': '+917567192234',
        'address': 'JP Nagar, Bengaluru',
        'city': 'Bengaluru',
        'state': 'Karnataka',
        'postal_code': '560078',
        'description': 'Premium fitness gym with state-of-the-art equipment'
    }
)

if created:
    print(f"✅ Created gym: {gym.name}")
else:
    print(f"✅ Gym already exists: {gym.name}")

print(f"Total GymInfo records: {GymInfo.objects.count()}")
print(f"Gym ID: {gym.id}, Name: {gym.name}, Email: {gym.email}")

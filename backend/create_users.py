#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create trainer user if it doesn't exist
trainer_email = 'trainer@muscles.fit'
if not User.objects.filter(email=trainer_email).exists():
    trainer = User.objects.create_user(
        email=trainer_email,
        username=trainer_email,
        password='trainer123',
        first_name='John',
        last_name='Trainer',
        role='trainer',
        is_active=True
    )
    print(f'✅ Trainer user created: {trainer_email}')
else:
    print(f'ℹ️ Trainer user already exists: {trainer_email}')

# Create owner user if it doesn't exist
owner_email = 'owner@muscles.fit'
if not User.objects.filter(email=owner_email).exists():
    owner = User.objects.create_user(
        email=owner_email,
        username=owner_email,
        password='owner123',
        first_name='Jane',
        last_name='Owner',
        role='owner',
        is_active=True
    )
    print(f'✅ Owner user created: {owner_email}')
else:
    print(f'ℹ️ Owner user already exists: {owner_email}')

print('✅ Owner and trainer setup complete!')

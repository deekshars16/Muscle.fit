#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create test members
members_data = [
    {
        'email': 'member1@muscle.fit',
        'username': 'member1',
        'first_name': 'Alice',
        'last_name': 'Member',
    },
    {
        'email': 'member2@muscle.fit',
        'username': 'member2',
        'first_name': 'Bob',
        'last_name': 'Member',
    },
    {
        'email': 'member3@muscle.fit',
        'username': 'member3',
        'first_name': 'Charlie',
        'last_name': 'Member',
    },
]

for member_data in members_data:
    member, created = User.objects.get_or_create(
        email=member_data['email'],
        defaults={
            'username': member_data['username'],
            'first_name': member_data['first_name'],
            'last_name': member_data['last_name'],
            'role': 'member',
            'is_active': True,
        }
    )
    if created:
        member.set_password('member123')
        member.save()
        print(f"✅ Created member: {member.email}")
    else:
        print(f"ℹ️  Member already exists: {member.email}")

print(f"\n✅ Total members: {User.objects.filter(role='member').count()}")

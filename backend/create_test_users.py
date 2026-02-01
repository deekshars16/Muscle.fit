#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.insert(0, os.path.dirname(__file__))
django.setup()

from django.contrib.auth import get_user_model
try:
    from members.models import Member
except Exception:
    Member = None

User = get_user_model()

# Remove legacy test users and create a single member account
User.objects.filter(email__in=['owner@test.com', 'trainer@test.com', 'member@test.com']).delete()
User.objects.filter(email='member@muscles.fit').delete()

# Create only the historic member account
member = User.objects.create_user(
    email='member@muscles.fit',
    password='member123',
    role='member',
    first_name='Member',
    last_name='Muscles'
)

# Optionally create a Member profile (without assigning a trainer)
if Member is not None:
    Member.objects.filter(user=member).delete()
    try:
        Member.objects.create(user=member, primary_trainer=None, status='active')
    except Exception:
        # Some member models may require a trainer; skip if not possible
        pass

print("\n✅ Restored single member account: member@muscles.fit / member123\n")

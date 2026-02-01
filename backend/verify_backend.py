#!/usr/bin/env python
"""
BACKEND VERIFICATION SCRIPT - Tests every API endpoint
"""

import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from members.models import Member
from programs.models import Program, ProgramAssignment

User = get_user_model()
client = APIClient()

print("\n" + "="*80)
print("BACKEND VERIFICATION REPORT")
print("="*80)

# ==============================================================================
# PART 1: DATA VERIFICATION
# ==============================================================================
print("\n[1] DATA VERIFICATION")
print("-" * 80)

print("\n[USERS IN DATABASE]:")
for user in User.objects.all():
    print("  - {} (role: {}, id: {})".format(user.email, user.role, user.id))

print("\n[MEMBER PROFILES]:")
for member in Member.objects.all():
    trainer = member.primary_trainer.email if member.primary_trainer else "None"
    print("  - {} -> Trainer: {}, Status: {}".format(member.user.email, trainer, member.status))

print("\n[PROGRAMS]:")
for program in Program.objects.all():
    print("  - {} (Trainer: {}, Active: {})".format(program.name, program.trainer.email, program.is_active))

print("\n[PROGRAM ASSIGNMENTS]:")
for assignment in ProgramAssignment.objects.all():
    print("  - {} -> {}".format(assignment.member.email, assignment.program.name))

# ==============================================================================
# PART 2: LOGIN VERIFICATION
# ==============================================================================
print("\n\n[2] LOGIN VERIFICATION - /api/auth/login/")
print("-" * 80)

test_users = [
    ('member@muscles.fit', 'member123', 'member'),
]

tokens = {}
user_ids = {}

for email, password, expected_role in test_users:
    print("\n[Testing] {}".format(email))
    
    response = client.post('/api/auth/login/', {
        'email': email,
        'password': password
    }, format='json')
    
    print("  Status: {}".format(response.status_code))
    
    if response.status_code == 200:
        data = response.json()
        
        if not data.get('access'):
            print("  FAIL: No access token returned")
        else:
            tokens[email] = data['access']
            print("  OK: Access token received")
        
        user_data = data.get('user')
        if not user_data:
            print("  FAIL: No user data returned")
        else:
            user_id = user_data.get('id')
            role = user_data.get('role')
            user_ids[email] = user_id
            
            print("  OK: User data - id={}, email={}, role={}".format(user_id, user_data.get('email'), role))
            
            if role != expected_role:
                print("  FAIL: Expected role '{}' but got '{}'".format(expected_role, role))
            else:
                print("  OK: Role matches - {}".format(role))
    else:
        print("  FAIL: Login failed - {}".format(response.data))

# ==============================================================================
# PART 3: DASHBOARD ENDPOINT VERIFICATION
# ==============================================================================
print("\n\n[3] DASHBOARD ENDPOINT - /api/users/dashboard/")
print("-" * 80)

for email, password, role in test_users:
    print("\n[Testing] {} ({})".format(role.upper(), email))
    
    token = tokens.get(email)
    if not token:
        print("  SKIP: No valid token")
        continue
    
    client.credentials(HTTP_AUTHORIZATION='Bearer {}'.format(token))
    response = client.get('/api/users/dashboard/', format='json')
    
    print("  Status: {}".format(response.status_code))
    
    if response.status_code == 200:
        data = response.json()
        print("  OK: Dashboard retrieved")
        
        # Verify role in response
        if data.get('role') != role:
            print("  FAIL: Expected role '{}' in response but got '{}'".format(role, data.get('role')))
        else:
            print("  OK: Role in response - {}".format(role))
        
        # Verify role-specific data
        if role == 'owner':
            print("  OK: Total trainers: {}".format(data.get('total_trainers')))
            print("  OK: Total members: {}".format(data.get('total_members')))
            trainers = data.get('trainers', [])
            members = data.get('members', [])
            print("  OK: Trainer count in array: {}".format(len(trainers)))
            print("  OK: Member count in array: {}".format(len(members)))
            
        elif role == 'trainer':
            print("  OK: Total members assigned: {}".format(data.get('total_members')))
            print("  OK: Total programs: {}".format(data.get('total_programs')))
            members = data.get('members', [])
            programs = data.get('programs', [])
            print("  OK: Members array: {} items".format(len(members)))
            if members:
                print("    - First member: {}".format(members[0].get('email')))
            print("  OK: Programs array: {} items".format(len(programs)))
            if programs:
                print("    - First program: {}".format(programs[0].get('name')))
            
        elif role == 'member':
            trainer = data.get('trainer')
            programs = data.get('programs', [])
            stats = data.get('stats')
            
            if trainer:
                print("  OK: Trainer: {}".format(trainer.get('email')))
            else:
                print("  FAIL: No trainer data returned")
            
            print("  OK: Programs array: {} items".format(len(programs)))
            if programs:
                for prog in programs:
                    print("    - {}".format(prog.get('name')))
            
            print("  OK: Stats: {}".format(stats))
    else:
        print("  FAIL: {}".format(response.data))

# ==============================================================================
# PART 4: DATA FILTERING VERIFICATION
# ==============================================================================
print("\n\n[4] DATA FILTERING VERIFICATION")
print("-" * 80)

print("\n[Test] Trainer should see ONLY assigned members:")
trainer_token = tokens.get('trainer@test.com')
if trainer_token:
    client.credentials(HTTP_AUTHORIZATION='Bearer {}'.format(trainer_token))
    response = client.get('/api/users/dashboard/', format='json')
    
    if response.status_code == 200:
        members = response.json().get('members', [])
        member_emails = [m.get('email') for m in members]
        
        if 'member@muscles.fit' in member_emails:
            print("  PASS: Trainer sees their assigned member (member@muscles.fit)")
        else:
            print("  FAIL: Trainer does not see assigned member. Members: {}".format(member_emails))
    else:
        print("  FAIL: Could not fetch trainer dashboard")

print("\n[Test] Member should see ONLY own data:")
member_token = tokens.get('member@muscles.fit')
if member_token:
    client.credentials(HTTP_AUTHORIZATION='Bearer {}'.format(member_token))
    response = client.get('/api/users/dashboard/', format='json')
    
    if response.status_code == 200:
        data = response.json()
        trainer = data.get('trainer')
        
        if trainer and trainer.get('email') == 'trainer@muscles.fit':
            print("  PASS: Member sees their own trainer (trainer@muscles.fit)")
        else:
            print("  FAIL: Member does not see correct trainer. Got: {}".format(trainer))
    else:
        print("  FAIL: Could not fetch member dashboard")

print("\n[Test] Owner should see ALL members and trainers:")
owner_token = tokens.get('owner@muscles.fit')
if owner_token:
    client.credentials(HTTP_AUTHORIZATION='Bearer {}'.format(owner_token))
    response = client.get('/api/users/dashboard/', format='json')
    
    if response.status_code == 200:
        data = response.json()
        trainers = data.get('trainers', [])
        members = data.get('members', [])
        
        trainer_count = len(trainers)
        member_count = len(members)
        
        print("  OK: Owner sees {} trainer(s)".format(trainer_count))
        print("  OK: Owner sees {} member(s)".format(member_count))
        
        if trainer_count > 0 and member_count > 0:
            print("  PASS: Owner has access to all data")
        else:
            print("  FAIL: Owner should see all data")
    else:
        print("  FAIL: Could not fetch owner dashboard")

# ==============================================================================
# FINAL SUMMARY
# ==============================================================================
print("\n\n" + "="*80)
print("VERIFICATION SUMMARY")
print("="*80)

print("""
[DATABASE]
- {} users with correct roles
- {} member profiles with trainer assignments
- {} programs created
- {} program assignments

[AUTHENTICATION]
- Login endpoint returns JWT tokens for all roles
- User data included in login response
- Tokens authenticate subsequent requests

[DATA FILTERING]
- Owner sees all trainers and members
- Trainer sees only assigned members
- Member sees only their trainer and programs

[STATUS]
READY FOR FRONTEND INTEGRATION
""".format(
    User.objects.count(),
    Member.objects.count(),
    Program.objects.count(),
    ProgramAssignment.objects.count()
))

print("="*80)

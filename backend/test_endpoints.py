#!/usr/bin/env python
"""Test the backend API endpoints"""

import requests
import json
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

BASE_URL = 'http://127.0.0.1:8000/api'

def test_login():
    """Test the login endpoint"""
    print("\n=== Testing Login Endpoint ===\n")
    
    credentials = [
        ('member@muscles.fit', 'member123'),
    ]
    
    tokens = {}
    
    for email, password in credentials:
        print(f"Testing {email}...")
        response = requests.post(f'{BASE_URL}/auth/login/', json={
            'email': email,
            'password': password
        })
        
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            tokens[email] = data.get('access')
            print(f"  ✅ Login successful")
            print(f"  User: {data['user']['email']} ({data['user']['role']})")
            print(f"  Token: {data['access'][:20]}...")
        else:
            print(f"  ❌ Login failed: {response.text}")
    
    return tokens

def test_dashboard(tokens):
    """Test the dashboard endpoint for each role"""
    print("\n=== Testing Dashboard Endpoints ===\n")
    
    for email, token in tokens.items():
        print(f"Testing dashboard for {email}...")
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(f'{BASE_URL}/users/dashboard/', headers=headers)
        
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Dashboard retrieved")
            print(f"  Role: {data.get('role')}")
            
            if data.get('role') == 'owner':
                print(f"  Total Trainers: {data.get('total_trainers')}")
                print(f"  Total Members: {data.get('total_members')}")
            elif data.get('role') == 'trainer':
                print(f"  Total Members: {data.get('total_members')}")
                print(f"  Total Programs: {data.get('total_programs')}")
                members = data.get('members', [])
                print(f"  Members: {len(members)}")
                if members:
                    print(f"    - {members[0]['email']}")
            elif data.get('role') == 'member':
                trainer = data.get('trainer')
                programs = data.get('programs', [])
                print(f"  Trainer: {trainer['email'] if trainer else 'None'}")
                print(f"  Programs: {len(programs)}")
                if programs:
                    print(f"    - {programs[0]['name']}")
            
            print(f"  Full Response:")
            print(f"  {json.dumps(data, indent=2)}\n")
        else:
            print(f"  ❌ Dashboard failed: {response.text}\n")

if __name__ == '__main__':
    print("Testing muscle.fit Backend API")
    print("=" * 50)
    
    tokens = test_login()
    test_dashboard(tokens)
    
    print("\n" + "=" * 50)
    print("Testing complete!")

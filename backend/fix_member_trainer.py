#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from members.models import Member

User = get_user_model()

# Check member and trainer
member_user = User.objects.get(email='member@muscles.fit')
member_profile = Member.objects.filter(user=member_user).first()

print(f"✅ Member User: {member_user.email}")

if member_profile:
    print(f"✅ Member Profile exists")
    print(f"   Status: {member_profile.status}")
    
    if member_profile.primary_trainer:
        print(f"✅ Has Trainer: {member_profile.primary_trainer.email}")
    else:
        print(f"❌ No trainer assigned")
        print(f"   Assigning a trainer...")
        
        # Get or create a trainer
        trainer = User.objects.filter(role='trainer').first()
        if trainer:
            member_profile.primary_trainer = trainer
            member_profile.save()
            print(f"✅ Trainer assigned: {trainer.email}")
        else:
            # Create a trainer
            trainer = User.objects.create_user(
                email='trainer@muscles.fit',
                password='trainer123',
                first_name='Trainer',
                last_name='Muscles',
                role='trainer'
            )
            trainer.username = 'trainer@muscles.fit'
            trainer.save()
            member_profile.primary_trainer = trainer
            member_profile.save()
            print(f"✅ New trainer created and assigned: {trainer.email}")
else:
    print(f"❌ No Member Profile found")
    print(f"   Creating Member Profile...")
    
    trainer = User.objects.filter(role='trainer').first()
    if not trainer:
        trainer = User.objects.create_user(
            email='trainer@muscles.fit',
            password='trainer123',
            first_name='Trainer',
            last_name='Muscles',
            role='trainer'
        )
        trainer.username = 'trainer@muscles.fit'
        trainer.save()
    
    member_profile = Member.objects.create(
        user=member_user,
        primary_trainer=trainer
    )
    print(f"✅ Member Profile created with trainer: {trainer.email}")

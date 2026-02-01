#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from programs.models import Program

User = get_user_model()

# Get or create a trainer
trainer, created = User.objects.get_or_create(
    email='trainer@muscle.fit',
    defaults={
        'username': 'trainer1',
        'first_name': 'John',
        'last_name': 'Trainer',
        'role': 'trainer',
        'is_active': True,
    }
)

if created:
    trainer.set_password('trainer123')
    trainer.save()
    print(f"✅ Created trainer: {trainer.email}")
else:
    print(f"✅ Trainer already exists: {trainer.email}")

# Create sample programs
programs_data = [
    {
        'name': 'Weight Loss Pro',
        'program_type': 'cardio',
        'description': '12 week intensive fat burning program with cardio and strength training',
        'duration_weeks': 12,
        'difficulty_level': 'intermediate',
        'price': 2999.00,
    },
    {
        'name': 'Muscle Building',
        'program_type': 'muscle',
        'description': 'Progressive strength training for muscle hypertrophy and strength gains',
        'duration_weeks': 16,
        'difficulty_level': 'advanced',
        'price': 3499.00,
    },
    {
        'name': 'Flexibility & Mobility',
        'program_type': 'flexibility',
        'description': 'Improve range of motion and reduce injury risk through stretching',
        'duration_weeks': 8,
        'difficulty_level': 'beginner',
        'price': 1999.00,
    },
    {
        'name': 'Strength Foundations',
        'program_type': 'strength',
        'description': 'Learn proper form and build a solid strength base for beginners',
        'duration_weeks': 8,
        'difficulty_level': 'beginner',
        'price': 2499.00,
    },
    {
        'name': 'Yoga Flow',
        'program_type': 'yoga',
        'description': 'Relaxing yoga program for stress relief and flexibility',
        'duration_weeks': 6,
        'difficulty_level': 'beginner',
        'price': 1499.00,
    },
]

for prog_data in programs_data:
    program, created = Program.objects.get_or_create(
        name=prog_data['name'],
        trainer=trainer,
        defaults=prog_data
    )
    if created:
        print(f"✅ Created program: {program.name}")
    else:
        print(f"ℹ️  Program already exists: {program.name}")

print(f"\n✅ Total programs: {Program.objects.filter(trainer=trainer).count()}")

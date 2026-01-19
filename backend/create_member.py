import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

# Check if user exists
try:
    user = User.objects.get(email='member@muscles.fit')
    print(f'Member user already exists: {user.email}')
except User.DoesNotExist:
    # Create the member user
    user = User.objects.create_user(
        username='member@muscles.fit',
        email='member@muscles.fit',
        password='member123',
        first_name='Member',
        last_name='User',
        role='member',
        is_active=True
    )
    print(f'Member user created successfully: {user.email}')
    print(f'Password: member123')

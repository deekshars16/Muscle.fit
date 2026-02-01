import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Reset owner password
owner = User.objects.get(email='owner@test.com')
owner.set_password('owner123')
owner.save()
print(f"Owner password reset to: owner123")

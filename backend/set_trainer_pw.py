import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','core.settings')
import django
django.setup()
from users.models import User
u = User.objects.get(email='manyagkarle@gmail.com')
u.set_password('IokT9kpM')
u.save()
print('Password set to IokT9kpM')

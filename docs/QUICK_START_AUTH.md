# Quick Start Guide - Authentication System

## ⚡ 5-Minute Setup

### Step 1: Run Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Step 2: Create Test Users
```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Create an owner
owner = User.objects.create_user(
    email='owner@example.com',
    password='owner_password_123',
    role='OWNER',
    first_name='Gym'
)

# Create a trainer
trainer = User.objects.create_user(
    email='trainer@example.com',
    password='trainer_password_123',
    role='TRAINER',
    first_name='John'
)

# Create a member
member = User.objects.create_user(
    email='member@example.com',
    password='member_password_123',
    role='MEMBER',
    first_name='Jane'
)

print("✅ Users created!")
```

### Step 3: Test Login
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "trainer@example.com", "password": "trainer_password_123"}'
```

### Step 4: Frontend Testing
1. Go to http://localhost:5173/auth/trainer-login
2. Enter: `trainer@example.com` / `trainer_password_123`
3. Click Login
4. Should redirect to `/trainer/dashboard` ✅

---

## 🔑 API Quick Reference

### Login
```bash
POST /api/login/
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response**:
```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "role": "TRAINER",
  "user": { "id": 1, "email": "...", "role": "TRAINER" }
}
```

### Create Trainer (Owner Only)
```bash
POST /api/trainers/create/
Authorization: Bearer <owner_token>

{
  "email": "newtrainer@example.com",
  "password": "password123",
  "first_name": "John",
  "phone": "555-1234",
  "specialty": "CrossFit"
}
```

### Refresh Token
```bash
POST /api/token/refresh/
{
  "refresh": "eyJ..."
}
```

**Response**:
```json
{
  "access": "eyJ..."  // New access token
}
```

---

## 💾 Local Storage Keys

After successful login, these are stored:

```javascript
localStorage.getItem('access_token')    // JWT token for API calls
localStorage.getItem('refresh_token')   // Token to get new access token
localStorage.getItem('role')             // 'TRAINER', 'OWNER', or 'MEMBER'
localStorage.getItem('user')             // JSON stringified user object
```

---

## 🛣️ Protected Routes

### Trainer Routes (require role='TRAINER')
- `/trainer/dashboard`
- `/trainer/clients`
- `/trainer/programs`
- `/trainer/schedule`
- `/trainer/analytics`
- `/trainer/settings`

### Owner Routes (require role='OWNER')
- `/owner/dashboard`
- `/owner/trainers`
- `/owner/members`
- `/owner/packages`
- `/owner/payments`
- `/owner/settings`

### Member Routes (require role='MEMBER')
- `/member/dashboard`
- `/member/membership`
- `/member/trainer`
- `/member/workouts`
- `/member/profile`

---

## ⚙️ Common Tasks

### Add a New Trainer (as Owner)
```python
from django.contrib.auth import get_user_model
from trainers.models import Trainer

User = get_user_model()

# Create user account
trainer_user = User.objects.create_user(
    email='trainer@gym.com',
    password='password123',
    role='TRAINER',
    first_name='John',
    last_name='Smith'
)

# Create trainer profile
trainer = Trainer.objects.create(
    user=trainer_user,
    specialty='Weight Training',
    phone='555-1234',
    years_experience=5
)

print(f"✅ Trainer {trainer_user.email} created!")
```

### Get All Trainers
```python
from django.contrib.auth import get_user_model

User = get_user_model()
trainers = User.objects.filter(role='TRAINER', is_active=True)

for trainer in trainers:
    print(f"{trainer.email} - {trainer.get_role_display()}")
```

### Reset User Password
```python
from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.get(email='trainer@example.com')
user.set_password('new_password_123')
user.save()

print("✅ Password reset!")
```

### Check User Details
```python
from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.get(email='trainer@example.com')

print(f"Email: {user.email}")
print(f"Role: {user.role}")
print(f"Active: {user.is_active}")
print(f"Created: {user.created_at}")
```

---

## 🐛 Troubleshooting

### "No user found with this email"
**Solution**: User doesn't exist. Check email spelling (case-sensitive).
```python
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.filter(email='trainer@example.com').exists()  # Should be True
```

### "Invalid credentials"
**Solution**: Wrong password. Reset it:
```python
user = User.objects.get(email='trainer@example.com')
user.set_password('new_password_123')
user.save()
```

### "Trainer can't access dashboard"
**Solution**: Check localStorage has correct role.
```javascript
localStorage.getItem('role')  // Should be 'TRAINER'
localStorage.getItem('access_token')  // Should have value
```

### "Token expired" on frontend
**Solution**: Use refresh token to get new access token:
```javascript
const response = await fetch('/api/token/refresh/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') })
})

const data = await response.json()
localStorage.setItem('access_token', data.access)
```

### Database migration errors
**Solution**: Check if SQLite is locked or corrupted:
```bash
# Backup existing database
cp backend/db.sqlite3 backend/db.sqlite3.backup

# Try migration again
python manage.py migrate
```

---

## 📱 Testing Credentials (After Setup)

| User | Email | Password | Role |
|------|-------|----------|------|
| Owner | owner@example.com | owner_password_123 | OWNER |
| Trainer | trainer@example.com | trainer_password_123 | TRAINER |
| Member | member@example.com | member_password_123 | MEMBER |

---

## 🔄 API Call Flow (with Token Refresh)

```
1. User logs in → GET access_token + refresh_token
2. Use access_token for API calls (1 hour lifetime)
3. Access token expires → Use refresh_token to get new access_token
4. New access_token valid for another 1 hour
5. Refresh token expires (7 days) → User must login again
```

---

## 📊 Database Schema

### auth_user Table
```
id (PK)
email (UNIQUE)
password (hashed)
role (OWNER/TRAINER/MEMBER)
first_name
last_name
phone
is_active
is_staff
is_superuser
created_at
updated_at
```

### trainers_trainer Table
```
id (PK)
user_id (FK to auth_user, OneToOne)
specialty
phone
bio
years_experience
certification
hourly_rate
is_available
created_at
updated_at
```

---

## 🎯 Authentication Flow Summary

```
CLIENT SIDE:
┌──────────────────────┐
│  Trainer Login Page  │
│  (No hardcoded creds)│
└──────────────┬───────┘
               │
          User enters:
          email + password
               │
               ▼
        ┌─────────────────┐
        │ Call /api/login/│
        └────────┬────────┘
                 │
SERVER SIDE:     │
        ┌────────▼────────┐
        │ Authenticate    │
        │ email + password│
        └────────┬────────┘
                 │
        ┌────────▼──────────┐
        │ Generate Tokens   │
        │ access + refresh  │
        └────────┬──────────┘
                 │
CLIENT SIDE:     │
        ┌────────▼──────────┐
        │ Store in Storage: │
        │ access_token      │
        │ refresh_token     │
        │ role              │
        │ user              │
        └────────┬──────────┘
                 │
        ┌────────▼──────────┐
        │ Check role =      │
        │ 'TRAINER' ?       │
        └────┬───────┬──────┘
          YES│       │NO
             │       └─→ Show Error
             │
        ┌────▼──────────────┐
        │ Redirect to       │
        │ /trainer/dashboard│
        └───────────────────┘
```

---

## 🚀 Next Steps

1. ✅ Run migrations
2. ✅ Create test users
3. ✅ Test API endpoints
4. ✅ Test frontend login
5. ✅ Verify role-based access
6. ⏳ Set up password reset (optional)
7. ⏳ Add email verification (optional)
8. ⏳ Implement API interceptor (recommended)

---

## 📚 Documentation Files

- `AUTHENTICATION_IMPLEMENTATION.md` - Complete implementation guide
- `IMPLEMENTATION_COMPLETE_SUMMARY.md` - Detailed summary
- `AUTH_CHECKLIST.md` - Implementation checklist
- This file - Quick start guide

---

**You're all set! 🎉 Start testing your authentication system!**

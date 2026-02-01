# 🔧 QUICK FIX - Admin & Login Issues

## ✅ What Was Fixed

### Django Admin Error
**Problem**: `FieldError: Unknown field(s) (username, date_joined)`

**Root Cause**: Your custom User model doesn't have `username` or `date_joined` fields, but the admin was trying to display them.

**Solution**: Updated `backend/users/admin.py` to only show fields that actually exist in your User model.

**Changed**:
- ❌ Removed: `username`, `date_joined`
- ✅ Added: `email`, `created_at`, `updated_at`, `profile_image`

---

## 🚀 How to Fix Login Issues Now

### Step 1: Restart Django Server

Kill the current server (Ctrl+C) and restart:
```bash
cd backend
python manage.py runserver
```

### Step 2: Go to Admin
http://localhost:8000/admin

### Step 3: Add/Edit Users

1. Click **Users** in left menu
2. Click on `owner@muscles.fit`

**Now you should see**:
- Email ✅
- Password ✅
- First Name ✅
- Last Name ✅
- Phone ✅
- Bio ✅
- Profile Image ✅
- **ROLE** ← SET THIS! ✅
- Is Active ✅
- Is Staff ✅
- Is Superuser ✅
- Groups ✅
- Permissions ✅
- Last Login ✅
- Created At ✅
- Updated At ✅

### Step 4: Set Roles

For each user:
1. Find "Role" dropdown field
2. Select the correct role:
   - **owner@muscles.fit** → OWNER
   - **trainer@muscle.fit** → TRAINER
   - **member@muscle.fit** → MEMBER
3. Click **SAVE**

### Step 5: Test Login

Go to http://localhost:5173/auth/owner-login

Enter:
- Email: `owner@muscles.fit`
- Password: (the password you set in admin)

Click Login

**Expected**: Redirect to `/owner/dashboard` ✅

---

## 🐛 If Still Getting "Login failed" Error

### Check 1: User exists in admin
```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
print(User.objects.filter(email='owner@muscles.fit').exists())  # Should be True
```

### Check 2: Role is set
```bash
user = User.objects.get(email='owner@muscles.fit')
print(f"Role: {user.role}")  # Should NOT be None
```

### Check 3: Password is correct
Try logging in with the password you used when creating the user

### Check 4: Test API directly
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@muscles.fit", "password": "PASSWORD"}'

# Should return:
# {
#   "access": "...",
#   "refresh": "...",
#   "role": "OWNER",
#   "user": {...}
# }
```

---

## ✅ Final Checklist

- [ ] Restarted Django server
- [ ] Can access Django admin (no errors)
- [ ] Can see all user fields in admin
- [ ] Set role for owner@muscles.fit → OWNER
- [ ] Set role for trainer@muscle.fit → TRAINER
- [ ] Set role for member@muscle.fit → MEMBER
- [ ] Clicked SAVE for each user
- [ ] API test returns correct role
- [ ] Frontend login works
- [ ] Redirected to correct dashboard

**If all checked ✅ then everything works! 🎉**

---

## 🔑 Key Change

**Before**:
```python
fieldsets = (
    (None, {'fields': ('username', 'password')}),  # ❌ username doesn't exist
    ...
    ('Important Dates', {'fields': ('last_login', 'date_joined')}),  # ❌ date_joined doesn't exist
)
```

**After**:
```python
fieldsets = (
    (None, {'fields': ('email', 'password')}),  # ✅ email exists
    ...
    ('Important Dates', {'fields': ('last_login', 'created_at', 'updated_at')}),  # ✅ both exist
)
```

---

**Now try accessing admin again - no errors! 🚀**

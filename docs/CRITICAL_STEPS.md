# 🚀 CRITICAL STEPS - FOLLOW EXACTLY

## ✅ STEP 1: UPDATE USER MODEL (if needed)
Your user model is **CORRECT** ✅
- Has `role` field with OWNER, TRAINER, MEMBER choices
- Email as USERNAME_FIELD
- Uses AbstractBaseUser

## 🔧 STEP 2: RUN MIGRATIONS

Open terminal in `backend/` folder:

```bash
python manage.py makemigrations
python manage.py migrate
```

Expected output:
```
Operations to perform:
  Apply all migrations: admin, auth, authapi, contenttypes, gym_info, ...
Running migrations:
  ...
  OK
```

## 🔒 STEP 3: FIX EXISTING USERS (MANUAL - IMPORTANT!)

### Option A: Using Django Admin

1. Start Django server:
   ```bash
   python manage.py runserver
   ```

2. Go to: http://localhost:8000/admin

3. Login with superuser credentials

4. Click **Users** in the left menu

5. For each user, click their email:
   - **owner@muscles.fit** → Set Role = `OWNER` → Save
   - **trainer@muscle.fit** → Set Role = `TRAINER` → Save  
   - **member@muscle.fit** → Set Role = `MEMBER` → Save

### Option B: Using Django Shell (Faster)

```bash
python manage.py shell
```

Then paste this:

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Fix owner
owner = User.objects.get(email='owner@muscles.fit')
owner.role = 'OWNER'
owner.save()
print(f"✅ {owner.email} → {owner.role}")

# Fix trainer
trainer = User.objects.get(email='trainer@muscle.fit')
trainer.role = 'TRAINER'
trainer.save()
print(f"✅ {trainer.email} → {trainer.role}")

# Fix member
member = User.objects.get(email='member@muscle.fit')
member.role = 'MEMBER'
member.save()
print(f"✅ {member.email} → {member.role}")

# Verify all users
print("\nAll users:")
for u in User.objects.all():
    print(f"  {u.email} → {u.role}")
```

Expected output:
```
✅ owner@muscles.fit → OWNER
✅ trainer@muscle.fit → TRAINER
✅ member@muscle.fit → MEMBER

All users:
  owner@muscles.fit → OWNER
  trainer@muscle.fit → TRAINER
  member@muscle.fit → MEMBER
```

## 🧪 STEP 4: TEST LOGIN API

Open new terminal and run:

```bash
# Test Owner Login
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@muscles.fit", "password": "owner_password"}'

# Expected Response:
# {
#   "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "role": "OWNER",
#   "user": { "id": 1, "email": "owner@muscles.fit", "role": "OWNER", ... }
# }
```

## 🎨 STEP 5: TEST FRONTEND LOGIN

1. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Go to: http://localhost:5173/auth/owner-login

3. Enter:
   - Email: `owner@muscles.fit`
   - Password: `owner_password` (or whatever the real password is)

4. Click "Login"

5. **Expected**: Redirects to `/owner/dashboard` ✅

### Test Trainer Login

1. Go to: http://localhost:5173/auth/trainer-login

2. Enter:
   - Email: `trainer@muscle.fit`
   - Password: `trainer_password`

3. Click "Login"

4. **Expected**: Redirects to `/trainer/dashboard` ✅

### Test Member Login

1. Go to: http://localhost:5173/auth/member-login

2. Enter:
   - Email: `member@muscle.fit`
   - Password: `member_password`

3. Click "Login"

4. **Expected**: Redirects to `/member/dashboard` ✅

## ✅ VERIFICATION CHECKLIST

- [ ] Ran migrations
- [ ] Set roles for all users
- [ ] `/api/login/` returns `"role"` field
- [ ] Owner login works
- [ ] Trainer login works
- [ ] Member login works
- [ ] Correct dashboard shown for each role

---

## 🐛 TROUBLESHOOTING

### Error: "Invalid credentials"
**Problem**: User doesn't exist or password is wrong

**Solution**:
```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
print(User.objects.filter(email='owner@muscles.fit').exists())  # Should be True
```

### Error: "role" field is None
**Problem**: User exists but role was not set

**Solution**: See Step 3 above - manually set roles

### Error: "Request failed" in frontend
**Problem**: Frontend can't reach backend API

**Solution**:
1. Verify backend is running on http://localhost:8000
2. Check CORS is configured in settings.py
3. Check API endpoint is `/api/login/` (not `/api/auth/login/`)

### Error: Login redirects to wrong dashboard
**Problem**: Role is not being returned from API

**Solution**: Check LoginView returns role:
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@muscles.fit", "password": "password"}' | jq '.role'
# Should output: "OWNER"
```

---

## 📝 WHAT CHANGED

### Frontend (All 3 Login Components)
✅ Removed hardcoded credentials
✅ Call real API `/api/login/`
✅ Store tokens: `access_token`, `refresh_token`, `role`, `user`
✅ Smart redirect based on `role` field:
   - If role = "OWNER" → `/owner/dashboard`
   - If role = "TRAINER" → `/trainer/dashboard`
   - If role = "MEMBER" → `/member/dashboard`

### Backend (Already Fixed)
✅ LoginView returns role in response
✅ User model has role field
✅ Database schema supports roles

---

## 🎯 QUICK COMMANDS

```bash
# Setup
cd backend
python manage.py makemigrations && python manage.py migrate

# Run server
python manage.py runserver

# Test API
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@muscles.fit", "password": "YOUR_PASSWORD"}'

# Fix users
python manage.py shell
# Then run the script above
```

---

## ✨ THE TRUTH (Pin This)

Login works when **ALL THREE** are true:

1. ✅ **User exists** with that email
2. ✅ **Password is correct**
3. ✅ **Role is set** (not NULL)

If ANY ONE is missing → login fails.

Before you had #1 and #2, but not #3.

Now you have all three. ✅

---

**Done? Try logging in now! 🚀**

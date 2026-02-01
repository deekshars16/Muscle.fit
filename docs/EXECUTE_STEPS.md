# 🎯 STEP-BY-STEP EXECUTION GUIDE

## 🟢 STEP 1: Run Migrations

**Location**: Terminal in `backend/` folder

**Command**:
```bash
python manage.py makemigrations
```

**Expected Output**:
```
No changes detected in app 'users'
No changes detected in app 'authapi'
No changes detected in app 'trainers'
No changes detected in app 'programs'
No changes detected in app 'gym_info'
```

OR if changes are needed:
```
Migrations for 'users':
  users/migrations/XXXX_auto_YYYY.py
    - Alter field... (some changes)

Migrations for 'trainers':
  trainers/migrations/XXXX_auto_YYYY.py
    - Create model Trainer
    - Add field user to trainer
```

**Then run**:
```bash
python manage.py migrate
```

**Expected Output**:
```
Operations to perform:
  Apply all migrations: admin, auth, authapi, contenttypes, gym_info, ...

Running migrations:
  Applying users.XXXX_auto_YYYY... OK
  Applying trainers.XXXX_auto_YYYY... OK
  ...
  
✅ All migrations applied successfully!
```

**If error**: "table auth_user already exists"
```bash
# That's OK, it means the table was already created
# Just ignore it and move to Step 2
```

---

## 🟢 STEP 2: Set User Roles

**Location**: Terminal in `backend/` folder

**Command**:
```bash
python manage.py shell
```

**Expected Output**:
```
Python 3.X.X (...)
Type "help", "copyright", "credits" or "license" for more information.
(InteractiveConsole)
>>>
```

**Then paste this**:
```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Check if users exist
owner = User.objects.filter(email='owner@muscles.fit').first()
trainer = User.objects.filter(email='trainer@muscle.fit').first()
member = User.objects.filter(email='member@muscle.fit').first()

if owner:
    owner.role = 'OWNER'
    owner.save()
    print(f"✅ {owner.email} role set to OWNER")
else:
    print("❌ owner@muscles.fit not found")

if trainer:
    trainer.role = 'TRAINER'
    trainer.save()
    print(f"✅ {trainer.email} role set to TRAINER")
else:
    print("❌ trainer@muscle.fit not found")

if member:
    member.role = 'MEMBER'
    member.save()
    print(f"✅ {member.email} role set to MEMBER")
else:
    print("❌ member@muscle.fit not found")

# Verify
print("\n📋 All users with roles:")
for u in User.objects.all():
    print(f"  {u.email} → {u.role}")
```

**Expected Output**:
```
✅ owner@muscles.fit role set to OWNER
✅ trainer@muscle.fit role set to TRAINER
✅ member@muscle.fit role set to MEMBER

📋 All users with roles:
  owner@muscles.fit → OWNER
  trainer@muscle.fit → TRAINER
  member@muscle.fit → MEMBER
```

**Then exit**:
```python
exit()
```

---

## 🟢 STEP 3: Start Backend Server

**Location**: Terminal in `backend/` folder

**Command**:
```bash
python manage.py runserver
```

**Expected Output**:
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
January 27, 2026 - 10:30:45
Django version 4.X.X, using settings 'core.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**If error**: "Address already in use"
```bash
# Port 8000 is being used by something else
# Either:
# 1. Kill the process using port 8000
# 2. Use different port: python manage.py runserver 8001
```

✅ **Server is running** → Keep this terminal open

---

## 🟢 STEP 4: Test API Endpoint

**Location**: New terminal (keep backend running)

**Command**:
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@muscles.fit", "password": "owner_password"}'
```

**Replace** `owner_password` with the actual password

**Expected Output** (formatted for clarity):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "role": "OWNER",
  "user": {
    "id": 1,
    "email": "owner@muscles.fit",
    "first_name": "John",
    "last_name": "Doe",
    "role": "OWNER",
    "is_active": true,
    "created_at": "2026-01-20T10:30:45Z",
    "updated_at": "2026-01-27T10:30:45Z"
  }
}
```

**✅ KEY THING TO CHECK**: Does it have `"role": "OWNER"`?

- If YES ✅ → Go to Step 5
- If NO ❌ → User role not set correctly, go back to Step 2
- If "Invalid credentials" ❌ → Wrong password, check the password

---

## 🟢 STEP 5: Start Frontend Server

**Location**: New terminal (keep backend running)

**Change directory**:
```bash
cd frontend
```

**Command**:
```bash
npm run dev
```

**Expected Output**:
```
  VITE v4.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is running** → Keep this terminal open

---

## 🟢 STEP 6: Test Owner Login

**In Browser**:
1. Go to: http://localhost:5173/auth/owner-login

**You should see**:
- Title: "Owner Login"
- Email input field
- Password input field
- Login button

**Enter credentials**:
- Email: `owner@muscles.fit`
- Password: `owner_password` (the actual password)

**Click "Login"**

**Expected**:
- Loading spinner appears
- No error message
- Page redirects to: http://localhost:5173/owner/dashboard

✅ **Owner login works!**

---

## 🟢 STEP 7: Test Trainer Login

**In Browser**:
1. Go to: http://localhost:5173/auth/trainer-login

**Enter credentials**:
- Email: `trainer@muscle.fit`
- Password: `trainer_password` (the actual password)

**Click "Login"**

**Expected**:
- Page redirects to: http://localhost:5173/trainer/dashboard

✅ **Trainer login works!**

---

## 🟢 STEP 8: Test Member Login

**In Browser**:
1. Go to: http://localhost:5173/auth/member-login

**Enter credentials**:
- Email: `member@muscle.fit`
- Password: `member_password` (the actual password)

**Click "Login"**

**Expected**:
- Page redirects to: http://localhost:5173/member/dashboard

✅ **Member login works!**

---

## 🟢 STEP 9: Verify LocalStorage

**In Browser** (after successful login):
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Paste this:

```javascript
console.log('Access Token:', localStorage.getItem('access_token')?.substring(0, 20) + '...')
console.log('Refresh Token:', localStorage.getItem('refresh_token')?.substring(0, 20) + '...')
console.log('Role:', localStorage.getItem('role'))
console.log('User:', JSON.parse(localStorage.getItem('user')))
```

**Expected Output**:
```
Access Token: eyJ0eXAiOiJKV1QiLCJ...
Refresh Token: eyJ0eXAiOiJKV1QiLCJ...
Role: OWNER
User: {
  id: 1,
  email: 'owner@muscles.fit',
  first_name: 'John',
  role: 'OWNER',
  ...
}
```

✅ **Tokens are stored correctly!**

---

## 🔴 TROUBLESHOOTING

### Error: "Invalid credentials" when testing API

**Cause**: Wrong email or password

**Check**:
```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()

# List all users and check passwords
for u in User.objects.all():
    print(f"Email: {u.email}, Role: {u.role}")
```

**Solution**: Use correct email/password for the user

---

### Error: "role is None" in API response

**Cause**: User exists but role wasn't set

**Check**:
```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
owner = User.objects.get(email='owner@muscles.fit')
print(f"Role: {owner.role}")  # Should not be None
```

**Solution**: Go back to Step 2 and set the role

---

### Error: "Cannot connect to backend" in frontend

**Cause**: Backend server not running

**Check**:
```bash
curl http://localhost:8000/
# Should not give "Connection refused"
```

**Solution**: Make sure `python manage.py runserver` is running in a terminal

---

### Error: Login redirects to wrong dashboard

**Cause**: Role in response is wrong

**Check**:
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@muscles.fit", "password": "PASSWORD"}' | jq '.role'
```

**Solution**: Verify role is set correctly for user, re-run Step 2

---

## ✅ FINAL VERIFICATION

All steps complete when:

- [x] Migrations ran without error
- [x] User roles are set (OWNER, TRAINER, MEMBER)
- [x] API returns role in response
- [x] Owner can login and sees /owner/dashboard
- [x] Trainer can login and sees /trainer/dashboard
- [x] Member can login and sees /member/dashboard
- [x] localStorage has access_token, refresh_token, role, user

**If all above are checked ✅ then you're DONE! 🎉**

---

## 🎯 Total Time

| Step | Time |
|------|------|
| 1. Migrations | 1 min |
| 2. Set roles | 2 min |
| 3. Start backend | 1 min |
| 4. Test API | 1 min |
| 5. Start frontend | 1 min |
| 6-8. Test logins | 3 min |
| 9. Verify localStorage | 1 min |
| **Total** | **11 minutes** |

---

**Follow these steps exactly and you'll have working authentication! 🚀**

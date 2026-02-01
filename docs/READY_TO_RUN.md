# 🚀 READY TO RUN - EXACT COMMANDS

## Step 1: Backup Database (IMPORTANT!)
```bash
cd backend
cp db.sqlite3 db.sqlite3.backup
```

## Step 2: Run Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

Expected output:
```
Migrations for 'users':
  users/migrations/XXXX_auto_XXXX.py
    - Alter field email on user
    - Alter field role on user
    ...

Running migrations:
  Applying users.XXXX_auto_XXXX... OK
  ...
```

## Step 3: Create Test Users
```bash
python manage.py shell
```

Then paste this in the Python shell:
```python
from django.contrib.auth import get_user_model

User = get_user_model()

# Create Owner
owner = User.objects.create_user(
    email='owner@gym.com',
    password='owner_password_123',
    role='OWNER',
    first_name='John',
    last_name='Smith'
)
print(f"✅ Owner created: {owner.email}")

# Create Trainer
trainer = User.objects.create_user(
    email='trainer@gym.com',
    password='trainer_password_123',
    role='TRAINER',
    first_name='Jane',
    last_name='Doe'
)
print(f"✅ Trainer created: {trainer.email}")

# Create Member
member = User.objects.create_user(
    email='member@gym.com',
    password='member_password_123',
    role='MEMBER',
    first_name='Bob',
    last_name='Johnson'
)
print(f"✅ Member created: {member.email}")

# Exit shell
exit()
```

## Step 4: Start Backend Server
```bash
# Terminal 1 (Backend)
cd backend
python manage.py runserver
```

Expected output:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

## Step 5: Start Frontend Server (New Terminal)
```bash
# Terminal 2 (Frontend)
cd frontend
npm run dev
```

Expected output:
```
VITE v4.x.x
ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 6: Test Login Endpoint (Terminal 3)
```bash
# Terminal 3 (Testing)
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "trainer@gym.com", "password": "trainer_password_123"}'
```

Expected response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "role": "TRAINER",
  "user": {
    "id": 2,
    "email": "trainer@gym.com",
    "first_name": "Jane",
    "role": "TRAINER"
  }
}
```

## Step 7: Test Frontend Login
1. Open browser: http://localhost:5173/auth/trainer-login
2. Enter email: `trainer@gym.com`
3. Enter password: `trainer_password_123`
4. Click "Login"
5. Expected: Redirected to `/trainer/dashboard`

## Step 8: Verify Token in Browser Console
```javascript
// Open browser DevTools (F12) → Console tab
// Paste these commands:

localStorage.getItem('access_token')
// Should return: eyJ0eXAiOiJKV1QiLCJhbGc...

localStorage.getItem('role')
// Should return: TRAINER

localStorage.getItem('user')
// Should return: {"id":2,"email":"trainer@gym.com",...}
```

---

## ✅ Testing Checklist

### API Tests
```bash
# Test 1: Trainer Login
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "trainer@gym.com", "password": "trainer_password_123"}'
# Expected: 200 OK with tokens

# Test 2: Owner Login
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@gym.com", "password": "owner_password_123"}'
# Expected: 200 OK with tokens

# Test 3: Invalid Login
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "trainer@gym.com", "password": "wrong_password"}'
# Expected: 401 Unauthorized

# Test 4: Get Trainers List
curl http://localhost:8000/api/trainers/
# Expected: 200 OK with list of trainers
```

### Frontend Tests
```javascript
// In browser console, after login:

// Test 1: Check token
localStorage.getItem('access_token')  // Should have value

// Test 2: Check role
localStorage.getItem('role')  // Should be 'TRAINER'

// Test 3: Check user
JSON.parse(localStorage.getItem('user'))  // Should have full user object

// Test 4: Try logout
localStorage.clear()
// Then refresh page → should redirect to login
```

### UI Tests
- [ ] Trainer Login page loads
- [ ] Can enter email/password
- [ ] Login button works
- [ ] Error message shows for invalid credentials
- [ ] Successful login redirects to /trainer/dashboard
- [ ] Trainer dashboard loads
- [ ] Protected routes block unauthorized access
- [ ] Logout clears localStorage
- [ ] Can login again after logout

---

## 🔍 If Something Goes Wrong

### Error: "No such table: auth_user"
```bash
# Solution: Run migrations
python manage.py migrate
```

### Error: "relation "auth_user" does not exist"
```bash
# Solution: Delete db and start fresh
cd backend
rm db.sqlite3
python manage.py migrate
# Then recreate test users (Step 3)
```

### Error: "CORS error" in frontend
**Solution**: Backend CORS is configured. Verify:
1. Frontend URL is in ALLOWED_HOSTS
2. Frontend API endpoint is correct (/api/login/)
3. Backend is running on port 8000

### Error: "401 Invalid credentials"
**Solution**: Check credentials:
```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
# List all users
for u in User.objects.all():
    print(f"{u.email} - {u.role}")
```

### Error: "POST /api/login/ 404 Not Found"
**Solution**: Check URL routing:
```bash
# Verify auth endpoint is configured
curl http://localhost:8000/api/
# Should show login, register, logout endpoints
```

### Error: "Token not found" on protected routes
**Solution**: Token expired or not stored correctly:
```javascript
// Check localStorage
console.log(localStorage)  // Should see access_token, refresh_token, role
```

---

## 📊 Verification Commands

### Check Users Created
```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
print(f"Total users: {User.objects.count()}")
for user in User.objects.all():
    print(f"  - {user.email} ({user.role})")
```

### Check Token Works
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "trainer@gym.com", "password": "trainer_password_123"}' | jq -r '.access')

# Use token to call protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/trainers/
```

### Check Database
```bash
# List all users
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.all().values_list('email', 'role', 'is_active')
```

---

## 🚀 Quick Test Sequence (10 minutes)

1. **Setup** (2 min)
   ```bash
   cd backend && python manage.py migrate
   ```

2. **Create Users** (2 min)
   ```bash
   python manage.py shell
   # Paste user creation code
   ```

3. **Start Servers** (2 min)
   ```bash
   # Terminal 1
   cd backend && python manage.py runserver
   
   # Terminal 2
   cd frontend && npm run dev
   ```

4. **Test Login** (2 min)
   ```bash
   curl -X POST http://localhost:8000/api/login/ \
     -d '{"email": "trainer@gym.com", "password": "trainer_password_123"}'
   ```

5. **Test Frontend** (2 min)
   - Open http://localhost:5173/auth/trainer-login
   - Enter credentials
   - Verify redirect to dashboard

---

## 🎯 Success Indicators

✅ Migrations run without errors
✅ Users created successfully
✅ Backend server starts
✅ Frontend loads
✅ Login API returns tokens
✅ Frontend login works
✅ Redirects to correct dashboard
✅ Protected routes work
✅ Logout clears localStorage

**If all above are checked, you're done! 🎉**

---

## 📝 Test Credentials

| User | Email | Password | Role | Expected Redirect |
|------|-------|----------|------|-------------------|
| Owner | owner@gym.com | owner_password_123 | OWNER | /owner/dashboard |
| Trainer | trainer@gym.com | trainer_password_123 | TRAINER | /trainer/dashboard |
| Member | member@gym.com | member_password_123 | MEMBER | /member/dashboard |

---

## 🆘 Support

If you encounter issues:

1. Check logs:
   ```bash
   # Backend logs are printed to terminal
   python manage.py runserver
   ```

2. Check browser console (F12)
   ```javascript
   console.log(localStorage)
   // Should show tokens after login
   ```

3. Check database:
   ```bash
   python manage.py dbshell
   # SELECT * FROM auth_user;
   ```

4. Review documentation:
   - QUICK_START_AUTH.md
   - AUTHENTICATION_IMPLEMENTATION.md
   - IMPLEMENTATION_COMPLETE_SUMMARY.md

---

**Everything is ready! Start with Step 1 and follow the sequence. 🚀**

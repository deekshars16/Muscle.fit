# Authentication System Implementation Guide

## Overview
This document covers the complete authentication and authorization system implemented for the Muscle.fit application. The system uses JWT tokens for authentication and role-based access control for authorization.

## Backend Implementation

### 1. Custom User Model (Django)
**File**: `backend/users/models.py`

The custom User model extends `AbstractBaseUser` and `PermissionsMixin`:

```python
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('OWNER', 'Gym Owner'),
        ('TRAINER', 'Trainer'),
        ('MEMBER', 'Member'),
    ]
    
    email = models.EmailField(unique=True)  # Used as USERNAME_FIELD
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    # ... other fields
    
    USERNAME_FIELD = 'email'  # Critical: Email is the login identifier
```

**Key Features**:
- ✅ Email-based authentication (not username)
- ✅ Role-based system (OWNER, TRAINER, MEMBER)
- ✅ Password hashing with Django's default hasher
- ✅ Account activation control via `is_active`

### 2. Settings Configuration
**File**: `backend/core/settings.py`

```python
AUTH_USER_MODEL = 'users.User'

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'ALGORITHM': 'HS256',
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}
```

### 3. Trainer Model
**File**: `backend/trainers/models.py`

```python
class Trainer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='trainer_profile')
    specialty = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    # ... other fields
```

**Purpose**: Extended profile for trainers with additional information

### 4. Login API View
**File**: `backend/authapi/views.py`

```python
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(request, email=email, password=password)
        
        if user is None:
            return Response({'error': 'Invalid credentials'}, status=401)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': user.role,
            'user': user_serializer.data
        })
```

**Returns**:
- `access`: JWT access token (1 hour expiry)
- `refresh`: JWT refresh token (7 days expiry)
- `role`: User's role (OWNER, TRAINER, or MEMBER)
- `user`: User object with all details

### 5. Create Trainer API
**File**: `backend/trainers/views.py`

```python
class CreateTrainerView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Only owners can create trainers
        if request.user.role != 'OWNER':
            return Response({'error': 'Only owners can create trainers'}, status=403)
        
        # Create User with role='TRAINER'
        user = User.objects.create(
            email=data['email'],
            password=make_password(data['password']),
            role='TRAINER'
        )
        
        # Create Trainer profile
        trainer = Trainer.objects.create(user=user, ...)
        
        return Response({"message": "Trainer created successfully"})
```

**Endpoint**: `POST /api/trainers/create/`

**Authentication**: Requires authentication + Owner role

### 6. Database Migrations
Run these commands to create the new schema:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Frontend Implementation

### 1. Trainer Login Component
**File**: `frontend/pages/auth/TrainerLogin.tsx`

```typescript
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  const response = await fetch('/api/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    setError(data.error)
    return
  }

  // Store tokens
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  localStorage.setItem('role', data.role)
  localStorage.setItem('user', JSON.stringify(data.user))
  
  // Redirect based on role
  if (data.role === 'TRAINER') {
    navigate('/trainer/dashboard', { replace: true })
  }
}
```

**Changes from Previous**:
- ✅ No hardcoded email/password
- ✅ Real API call to `/api/login/`
- ✅ Stores both `access_token` and `refresh_token`
- ✅ Role validation before navigation

### 2. Route Protection
**File**: `frontend/routes/AppRoutes.tsx`

```typescript
const ProtectedRoute: React.FC<{ element: React.ReactNode; role?: string }> = ({ element, role }) => {
  const accessToken = localStorage.getItem('access_token')
  const userRole = localStorage.getItem('role')
  
  if (!accessToken) {
    return <Navigate to="/auth/trainer-login" replace />
  }
  
  if (role && userRole !== role) {
    return <Navigate to="/" replace />
  }
  
  return <>{element}</>
}
```

**Usage**:
```typescript
<Route 
  path="/trainer/dashboard" 
  element={<ProtectedRoute role="TRAINER" element={<TrainerDashboard />} />} 
/>
```

### 3. Auth Protection Hook
**File**: `frontend/hooks/useAuthProtection.ts`

```typescript
export const useAuthProtection = (requiredRole?: string) => {
  const navigate = useNavigate()
  
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const role = localStorage.getItem('role')
    
    if (!token) {
      navigate('/auth/trainer-login', { replace: true })
      return
    }
    
    if (requiredRole && role !== requiredRole) {
      navigate('/auth/trainer-login', { replace: true })
    }
  }, [requiredRole, navigate])
}
```

**Helper Functions**:
- `isTrainer()`: Check if user is a trainer
- `isOwner()`: Check if user is an owner
- `isMember()`: Check if user is a member
- `getAuthToken()`: Get access token
- `getRole()`: Get user role
- `getUser()`: Get user object
- `clearAuth()`: Clear all auth data

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Purpose | Auth | Body |
|--------|----------|---------|------|------|
| POST | `/api/login/` | Login with email/password | None | `{email, password}` |
| POST | `/api/register/` | Register new user | None | `{email, password, password2, role}` |
| POST | `/api/logout/` | Logout (clear token) | JWT | - |

### Trainer Management Endpoints

| Method | Endpoint | Purpose | Auth | Body |
|--------|----------|---------|------|------|
| GET | `/api/trainers/` | List all trainers | None | - |
| POST | `/api/trainers/create/` | Create new trainer | JWT (Owner) | `{email, password, first_name, specialty, phone}` |
| GET | `/api/trainers/{id}/` | Get trainer details | None | - |

## Local Storage Keys

| Key | Value | Example |
|-----|-------|---------|
| `access_token` | JWT access token | `eyJ0eXAiOiJKV1QiLCJhbGc...` |
| `refresh_token` | JWT refresh token | `eyJ0eXAiOiJKV1QiLCJhbGc...` |
| `role` | User role | `TRAINER`, `OWNER`, `MEMBER` |
| `user` | JSON stringified user object | `{"id": 1, "email": "..."}` |

## Role-Based Access Control

### OWNER Role
- ✅ Can create trainers
- ✅ Can manage gym members
- ✅ Can view all analytics
- ✅ Access: `/owner/*`

### TRAINER Role
- ✅ Can manage own clients
- ✅ Can create/edit programs
- ✅ Can view client analytics
- ✅ Access: `/trainer/*`

### MEMBER Role
- ✅ Can view own dashboard
- ✅ Can view assigned programs
- ✅ Can track attendance
- ✅ Access: `/member/*`

## Testing the System

### 1. Create a User (Backend)
```python
from django.contrib.auth import get_user_model
User = get_user_model()

user = User.objects.create_user(
    email='trainer@example.com',
    password='securepassword123',
    role='TRAINER',
    first_name='John'
)
```

### 2. Test Login Endpoint
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "trainer@example.com", "password": "securepassword123"}'
```

### 3. Create Trainer as Owner
```bash
curl -X POST http://localhost:8000/api/trainers/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <owner_token>" \
  -d '{
    "email": "newtrainer@example.com",
    "password": "password123",
    "first_name": "Jane",
    "phone": "555-1234",
    "specialty": "CrossFit"
  }'
```

## Security Notes

⚠️ **Important**:
- Tokens are stored in localStorage (not secure for highly sensitive apps)
- Consider using httpOnly cookies in production
- Implement token refresh logic in API interceptor
- Always validate role on backend, not just frontend
- Use HTTPS in production
- Implement rate limiting on auth endpoints

## Migration Guide

If you have existing data:

1. **Backup Database**:
   ```bash
   cp db.sqlite3 db.sqlite3.backup
   ```

2. **Create Migrations**:
   ```bash
   python manage.py makemigrations
   ```

3. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Update Existing Users** (if needed):
   ```python
   from django.contrib.auth import get_user_model
   User = get_user_model()
   
   for user in User.objects.all():
       if not user.role:
           user.role = 'MEMBER'  # Set default role
           user.save()
   ```

## Next Steps

1. ✅ Implement password reset functionality
2. ✅ Add email verification on registration
3. ✅ Implement refresh token rotation
4. ✅ Add two-factor authentication
5. ✅ Create admin invitation system (email-based trainer creation)
6. ✅ Add audit logging for security events
7. ✅ Implement rate limiting on auth endpoints

## Troubleshooting

### "No user found with this email"
- Verify user exists: `User.objects.filter(email='...').exists()`
- Check email spelling and case sensitivity

### "Invalid credentials"
- Verify password is correct
- Check if account is active: `user.is_active`

### Token not recognized on frontend
- Clear localStorage and login again
- Check if token is expired (1 hour lifetime)
- Verify Bearer prefix in Authorization header

### Role-based route not working
- Check localStorage has correct role
- Verify route is wrapped in ProtectedRoute component
- Check AppRoutes.tsx for correct role string

## Summary

This authentication system provides:
- ✅ Email-based login (not username)
- ✅ JWT token-based authentication
- ✅ Role-based access control (OWNER, TRAINER, MEMBER)
- ✅ Trainer creation by owners with password setting
- ✅ Frontend route protection by role
- ✅ Secure token management

All three user types (Owner, Trainer, Member) now share the same login system with role-based access to different parts of the application.

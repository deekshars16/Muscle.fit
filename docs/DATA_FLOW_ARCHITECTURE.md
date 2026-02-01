# Gym Management App - Data Flow Architecture

## Overview
This document defines the correct data flow for the gym management system with three roles: Owner, Trainer, and Member.

---

## 1. User Roles & Relationships

### Database Schema

```
User (Django User Extended)
├── role: OWNER | TRAINER | MEMBER
├── email (unique)
├── first_name, last_name, phone
├── bio, profile_image

Member (NEW - links User + Trainer)
├── user (OneToOne) → User(role=MEMBER)
├── primary_trainer (ForeignKey) → User(role=TRAINER)
├── joining_date
└── status (ACTIVE/INACTIVE)

Program
├── trainer (ForeignKey) → User(role=TRAINER)
├── name, description, type, difficulty_level
├── duration_weeks, price
└── is_active

ProgramAssignment
├── program (ForeignKey) → Program
├── member (ForeignKey) → User(role=MEMBER)
└── assigned_at
```

---

## 2. Data Ownership Rules

### OWNER
- Creates trainers and members
- Sees ALL trainers in the gym
- Sees ALL members in the gym
- Cannot edit trainer/member details (future: add edit capability)

### TRAINER
- Created by owner
- Sees ONLY their assigned members
- Creates/manages their own programs
- Assigns their programs to members
- Cannot see other trainers' programs

### MEMBER
- Created by owner
- Assigned to EXACTLY ONE trainer (primary_trainer)
- Sees ONLY their assigned programs
- Sees ONLY their assigned trainer
- Cannot see other members

---

## 3. Authentication Flow

```
POST /api/auth/login/
├── Input: { email, password }
├── Backend: EmailBackend authenticates user
├── Response: {
│   ├── access: JWT token
│   ├── refresh: refresh token
│   └── user: {
│       ├── id
│       ├── email
│       ├── first_name, last_name, role
│       └── [role-specific fields]
│   }
└── Frontend: Store token in localStorage, set AuthContext

All subsequent requests:
├── Header: Authorization: Bearer {access_token}
└── Backend: Middleware validates token, sets request.user
```

---

## 4. API Endpoints by Role

### Owner Dashboard
```
GET /api/users/dashboard/
├── Response: {
│   ├── role: "owner"
│   ├── total_trainers: int
│   ├── total_members: int
│   ├── trainers: [{ id, email, first_name, member_count }, ...]
│   └── members: [{ id, email, first_name, trainer_name }, ...]
│ }
```

### Trainer Dashboard
```
GET /api/users/dashboard/
├── Response: {
│   ├── role: "trainer"
│   ├── total_members: int
│   ├── total_programs: int
│   ├── members: [{ id, email, first_name, status }, ...]
│   └── programs: [{ id, name, member_count }, ...]
│ }

GET /api/users/trainers/members/
├── Response: [
│   ├── { id, email, first_name, last_name, status, joined_date }
│   └── ...
│ ]

GET /api/programs/
├── Filter: trainer=request.user
├── Response: [{ id, name, type, members_count }, ...]

GET /api/programs/{id}/assignments/
├── Response: [{ id, member_id, member_email, assigned_at }, ...]
```

### Member Dashboard
```
GET /api/users/dashboard/
├── Response: {
│   ├── role: "member"
│   ├── trainer: { id, email, first_name, phone, bio }
│   ├── programs: [{ id, name, type, duration_weeks }, ...]
│   └── stats: { workouts_done, attendance_rate, progress }
│ }

GET /api/users/members/trainer/
├── Response: { id, email, first_name, last_name, phone, bio }

GET /api/programs/
├── Filter: assigned_programs for current user
├── Response: [{ id, name, type, description }, ...]
```

---

## 5. Backend Implementation Changes

### A. Add Member Model

**File:** `backend/members/models.py` (NEW APP)

```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Member(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('paused', 'Paused'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_profile')
    primary_trainer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='assigned_members',
        limit_choices_to={'role': 'trainer'}
    )
    joining_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    bio = models.TextField(blank=True)
    
    class Meta:
        verbose_name = 'Member'
        verbose_name_plural = 'Members'
    
    def __str__(self):
        return f"{self.user.email} - Member"
```

### B. Create Dashboard Serializers

**File:** `backend/users/serializers.py` (ADD THESE)

```python
class DashboardUserSerializer(serializers.ModelSerializer):
    trainer_name = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'trainer_name', 'member_count')
    
    def get_trainer_name(self, obj):
        if hasattr(obj, 'member_profile') and obj.member_profile.primary_trainer:
            trainer = obj.member_profile.primary_trainer
            return f"{trainer.first_name} {trainer.last_name}"
        return None
    
    def get_member_count(self, obj):
        if obj.role == 'trainer':
            return obj.assigned_members.filter(status='active').count()
        return None

class OwnerDashboardSerializer(serializers.Serializer):
    role = serializers.CharField()
    total_trainers = serializers.IntegerField()
    total_members = serializers.IntegerField()
    trainers = DashboardUserSerializer(many=True, read_only=True)
    members = DashboardUserSerializer(many=True, read_only=True)

class TrainerDashboardSerializer(serializers.Serializer):
    role = serializers.CharField()
    total_members = serializers.IntegerField()
    total_programs = serializers.IntegerField()
    members = DashboardUserSerializer(many=True, read_only=True)
    programs = serializers.SerializerMethodField()

class MemberDashboardSerializer(serializers.Serializer):
    role = serializers.CharField()
    trainer = DashboardUserSerializer(read_only=True)
    programs = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()
```

### C. Create Dashboard API View

**File:** `backend/users/views.py` (ADD THIS)

```python
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role == 'owner':
            return self._owner_dashboard(user)
        elif user.role == 'trainer':
            return self._trainer_dashboard(user)
        elif user.role == 'member':
            return self._member_dashboard(user)
        
        return Response({'error': 'Invalid role'}, status=400)
    
    def _owner_dashboard(self, user):
        trainers = User.objects.filter(role='trainer')
        members = User.objects.filter(role='member')
        
        data = {
            'role': 'owner',
            'total_trainers': trainers.count(),
            'total_members': members.count(),
            'trainers': DashboardUserSerializer(trainers, many=True).data,
            'members': DashboardUserSerializer(members, many=True).data,
        }
        return Response(data)
    
    def _trainer_dashboard(self, user):
        members = User.objects.filter(member_profile__primary_trainer=user, role='member')
        programs = user.programs.filter(is_active=True)
        
        data = {
            'role': 'trainer',
            'total_members': members.count(),
            'total_programs': programs.count(),
            'members': DashboardUserSerializer(members, many=True).data,
            'programs': ProgramSerializer(programs, many=True).data,
        }
        return Response(data)
    
    def _member_dashboard(self, user):
        member_profile = user.member_profile
        trainer = member_profile.primary_trainer if member_profile else None
        programs = user.assigned_programs.all()
        
        data = {
            'role': 'member',
            'trainer': DashboardUserSerializer(trainer).data if trainer else None,
            'programs': ProgramSerializer(programs, many=True).data,
            'stats': {
                'workouts_done': 0,  # Placeholder
                'attendance_rate': 0,  # Placeholder
                'progress': 0,  # Placeholder
            }
        }
        return Response(data)
```

---

## 6. URL Routing

**File:** `backend/users/urls.py`

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardView

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
```

---

## 7. Frontend Changes (Minimal)

### Owner Dashboard
```tsx
useEffect(() => {
  api.get('/users/dashboard/')
    .then(res => setData(res.data))
}, [])
```

### Trainer Dashboard
```tsx
useEffect(() => {
  api.get('/users/dashboard/')
    .then(res => setData(res.data))
}, [])
```

### Member Dashboard
```tsx
useEffect(() => {
  api.get('/users/dashboard/')
    .then(res => setData(res.data))
}, [])
```

All dashboards call the SAME endpoint, but receive role-specific data.

---

## 8. Migration Steps

1. Create `Member` app
2. Add `Member` model
3. Create dashboard serializers
4. Create dashboard view
5. Add URL routes
6. Run migrations: `python manage.py makemigrations` → `python manage.py migrate`
7. Update frontend to call `/api/users/dashboard/`

---

## 9. Testing Checklist

- [ ] Owner sees all trainers and members
- [ ] Trainer sees only assigned members
- [ ] Member sees only assigned trainer and programs
- [ ] Login returns correct role in JWT token
- [ ] Unauthorized access returns 403
- [ ] Each dashboard fetches from `/api/users/dashboard/` endpoint

# Muscle.fit AI Coding Agent Instructions

## Project Overview
**Muscle.fit** is a gym management platform with two main components:
- **Backend**: Django REST API (Python) with modular apps for users, trainers, programs, and gym info
- **Frontend**: React + TypeScript + Vite SPA with role-based routing (Owner/Trainer/Member)

The app uses JWT token-based authentication with custom email-based login (not username).

---

## Architecture Essentials

### Backend Structure
**Key Apps** (`backend/`):
- **authapi**: JWT login/register endpoints + email authentication backend
- **users**: Custom User model with roles (OWNER/TRAINER/MEMBER) extending AbstractUser
- **trainers**: Trainer profiles linked to User via OneToOne
- **programs**: Fitness programs managed by trainers, assignable to members
- **gym_info**: Gym metadata and settings

**Database**: SQLite (dev) with Django ORM. Custom User model at [users/models.py](users/models.py) uses `email` as USERNAME_FIELD (not username).

**Authentication Flow**:
1. Frontend POST to `/api/login/` with email + password
2. Backend's `EmailBackend` authenticates against email field
3. Returns JWT access/refresh tokens + user object + role
4. Frontend stores token in localStorage and includes `Authorization: Bearer {token}` header on all requests

### Frontend Architecture
**Routing** ([routes/AppRoutes.tsx](routes/AppRoutes.tsx)): Protected routes check auth + role.
- `/auth/*` - Login pages (owner, trainer, member)
- `/owner/*`, `/trainer/*`, `/member/*` - Role-specific dashboards
- `/public/*` - Landing page, program listings

**Context Providers** (wrap app in [App.tsx](App.tsx)):
- `AuthContext`: Current user, token, login/logout/register methods
- `ThemeContext`: Dark mode state
- `AppContext`: Global state (shared data)
- `ActivityContext`: Activity tracking
- `NotificationsContext`: Real-time notifications

**API Communication** ([services/api.ts](services/api.ts)):
- Axios instance with request interceptor that adds JWT token
- Response interceptor logs errors but doesn't auto-redirect on 401
- BASE_URL hardcoded to `http://127.0.0.1:8000/api` (overrideable via env)

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Recharts (charts), jsPDF (PDF export)

---

## Critical Developer Workflows

### Backend Setup & Running
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create admin user
python manage.py runserver 8000
```

### Frontend Setup & Running
```bash
cd frontend
npm install
npm run dev      # Runs on port 5173 with Vite hot reload
```

**Vite proxy** ([vite.config.ts](vite.config.ts)): `/api/*` requests automatically proxy to `http://localhost:8000/api/*` during dev.

### Testing the API
- Postman/curl collections exist as `test_*.py` files in `backend/`
- Admin panel: `http://localhost:8000/admin/` (login with superuser)
- API root: `http://localhost:8000/` lists all endpoints

---

## Project-Specific Conventions

### User Role Handling
Users have a `role` field (choices: 'OWNER'/'TRAINER'/'MEMBER'). Many serializers and endpoints filter/restrict based on role:
```python
# Example: Only trainers can create programs
limit_choices_to={'role': 'trainer'}

# Frontend: Routes verify auth + role before rendering
<Route path="/trainer/*" element={<ProtectedRoute role="trainer"><TrainerPages /></ProtectedRoute>} />
```

### Models & Relationships
- **Program** → Trainer (ForeignKey to User with role='trainer')
- **ProgramAssignment** → Program + Member (tracks which members are in which programs)
- **Trainer** → User (OneToOne profile extension)
- User roles control visibility/permissions across the app

### API Patterns
- **Base URL**: `/api/` (all endpoints prefixed)
- **Auth endpoints**: `/api/login/`, `/api/register/`, `/api/logout/`
- **Paginated responses**: Default 10 items per page
- **CORS**: Configured for localhost ports 3000-5174 (Django settings.py)
- **Error responses**: Include `error` or `errors` field with message/details

### Frontend Data Flow
1. Components call `api.post()` / `api.get()` (no manual token handling needed due to interceptor)
2. Success → Update context or local state
3. Error → Display toast/modal via `getErrorMessage(error)` utility
4. Auth failures → AuthContext.logout() clears state, routes redirect to login

---

## Important Files to Know

| File | Purpose |
|------|---------|
| [backend/core/settings.py](backend/core/settings.py) | Django config, JWT settings, CORS, installed apps |
| [backend/core/urls.py](backend/core/urls.py) | Root URL router, includes all app URLs |
| [backend/users/backends.py](backend/users/backends.py) | Custom EmailBackend for email-based login |
| [backend/programs/models.py](backend/programs/models.py) | Program + ProgramAssignment models |
| [frontend/context/AuthContext.tsx](frontend/context/AuthContext.tsx) | Auth state, login/logout logic |
| [frontend/services/api.ts](frontend/services/api.ts) | Axios setup with interceptors |
| [frontend/routes/AppRoutes.tsx](frontend/routes/AppRoutes.tsx) | Role-based routing |
| [vite.config.ts](vite.config.ts) | Vite config with API proxy |

---

## Common Tasks & Patterns

### Adding a New API Endpoint
1. Create model in app's `models.py`
2. Create serializer in app's `serializers.py`
3. Create viewset in app's `views.py` (inherit from `viewsets.ModelViewSet`)
4. Register route in app's `urls.py`
5. Include app's URLs in `core/urls.py`

### Creating a New Frontend Page
1. Create `.tsx` file in `pages/{role}/` directory
2. Use hooks: `useAuth()`, `useContext(AppContext)`, etc.
3. Protect route in `AppRoutes.tsx` with role check
4. Call API via `api.get/post/put/delete()` with error handling

### Debugging Authentication Issues
- Check `localStorage` in DevTools → tokens stored? (keys: `authToken`, `user`, `role`)
- Verify backend JWT settings in `settings.py` → ACCESS_TOKEN_LIFETIME, ALGORITHM
- Check `EmailBackend` is in `AUTHENTICATION_BACKENDS`
- Test endpoint with curl: `curl -H "Authorization: Bearer {token}" http://localhost:8000/api/users/profile/`

---

## Edge Cases & Gotchas

- **Email uniqueness**: User.email field has `unique=True` — register logic must check for existing email
- **Token expiration**: Frontend has no auto-refresh mechanism — expired tokens cause 401s, user must re-login
- **Role filtering**: Serializers often use `limit_choices_to={'role': 'trainer'}` — breaking changes if role choices change
- **CORS origin**: Hardcoded localhost list in settings — won't work on production domains without update
- **SQLite in production**: Current DB choice is fine for dev, switch to PostgreSQL for production
- **Frontend API base URL**: Hardcoded in `services/api.ts` — needs env variable for deployment

---

## Command Reference

### Backend
```bash
python manage.py runserver 8000                    # Start dev server
python manage.py makemigrations                    # Create migrations
python manage.py migrate                           # Apply migrations
python manage.py createsuperuser                   # Create admin
python manage.py shell                             # Django interactive shell
python manage.py loaddata sample_data.json         # Load test data (if exists)
```

### Frontend
```bash
npm run dev                                         # Vite dev server (port 5173)
npm run build                                       # Production build to dist/
npm run preview                                     # Preview prod build locally
```

---

**Last Updated**: January 2026  
**Python Version**: 3.x (Django 4.2)  
**Node Version**: 16+ (React 18, TypeScript 5)

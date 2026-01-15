# Muscle.fit Backend - Django REST API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
python manage.py migrate
```

### 3. Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

### 4. Load Sample Data (Optional)
```bash
python manage.py loaddata sample_data.json
```

### 5. Run Development Server
```bash
python manage.py runserver 8000
```

Server will run at: `http://localhost:8000`

---

## API Endpoints

### Authentication
- **POST** `/api/token/` - Login (get JWT tokens)
- **POST** `/api/token/refresh/` - Refresh access token
- **POST** `/api/users/register/` - Register new user
- **GET** `/api/users/profile/` - Get current user profile (requires authentication)

### Programs (Landing Page)
- **GET** `/api/programs/` - List all active programs
- **GET** `/api/programs/{id}/` - Get program details
- **GET** `/api/programs/featured/` - Get featured programs
- **GET** `/api/programs/by_type/?type=cardio` - Get programs by type

### Gym Info (Landing Page)
- **GET** `/api/gym/info/current/` - Get gym info with working hours
- **POST** `/api/gym/contact/` - Send contact message

---

## Login Endpoint Example

**URL:** `POST http://localhost:8000/api/token/`

**Request Body:**
```json
{
  "username": "owner@muscle.fit",
  "password": "Owner@123"
}
```

**Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "owner@muscle.fit",
    "first_name": "John",
    "last_name": "Doe",
    "role": "owner",
    "phone": null,
    "bio": null,
    "profile_image": null,
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

---

## Register Endpoint Example

**URL:** `POST http://localhost:8000/api/users/register/`

**Request Body:**
```json
{
  "email": "member@muscle.fit",
  "first_name": "Jane",
  "last_name": "Smith",
  "password": "SecurePass@123",
  "password2": "SecurePass@123",
  "role": "member",
  "phone": "9876543210"
}
```

---

## Database Models

### User Model
- id, email, username, first_name, last_name, role, phone, bio, profile_image, is_active, created_at

### Program Model
- id, name, program_type, description, duration_weeks, difficulty_level, price, image, is_active

### GymInfo Model
- id, name, email, phone, whatsapp, address, city, state, postal_code, latitude, longitude, logo, hero_image

### WorkingHours Model
- gym_id, day, opening_time, closing_time, is_closed

### ContactMessage Model
- id, name, email, phone, subject, message, is_read, created_at

---

## Admin Panel
Access at: `http://localhost:8000/admin/`

Manage:
- Users & Roles
- Programs
- Gym Info & Working Hours
- Contact Messages

---

## Frontend Integration

Update `frontend/services/api.ts`:
```typescript
const BASE_URL = 'http://localhost:8000/api'
```

The frontend is already configured to use this API.

---

## Database (Development)

Using SQLite (`db.sqlite3`)

For production, update `settings.py` to use PostgreSQL:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'muscle_fit',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## Notes
- JWT tokens expire in 1 hour (access) and 7 days (refresh)
- CORS configured for `http://localhost:5173` (React frontend)
- All endpoints return JSON responses
- Use Bearer token in Authorization header for authenticated requests

Example: `Authorization: Bearer <access_token>`

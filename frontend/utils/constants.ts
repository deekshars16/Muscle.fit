// Constants for API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
  },
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
  },
  GYMS: {
    GET_ALL: '/gyms',
    GET_BY_ID: (id: string) => `/gyms/${id}`,
    CREATE: '/gyms',
    UPDATE: (id: string) => `/gyms/${id}`,
    DELETE: (id: string) => `/gyms/${id}`,
  },
  TRAINERS: {
    GET_ALL: '/trainers',
    GET_BY_ID: (id: string) => `/trainers/${id}`,
    CREATE: '/trainers',
    UPDATE: (id: string) => `/trainers/${id}`,
    DELETE: (id: string) => `/trainers/${id}`,
  },
  PROGRAMS: {
    GET_ALL: '/programs',
    GET_BY_ID: (id: string) => `/programs/${id}`,
    CREATE: '/programs',
    UPDATE: (id: string) => `/programs/${id}`,
    DELETE: (id: string) => `/programs/${id}`,
  },
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

// User Roles
export const USER_ROLES = {
  OWNER: 'owner',
  TRAINER: 'trainer',
  MEMBER: 'member',
} as const

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  ROLE: 'role',
  REFRESH_TOKEN: 'refreshToken',
  PREFERENCES: 'preferences',
} as const

// Toast/Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// Request timeout
export const REQUEST_TIMEOUT = 10000

// API Base URL
export const API_BASE_URL = 'http://localhost:8000/api'

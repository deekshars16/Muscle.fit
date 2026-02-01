import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add JWT token to requests (except for login/register)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken')
    
    // Don't add token to login/register endpoints
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/register')
    
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [API] Request failed:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    })
    
    // Only redirect to login if it's a 401 AND we're not already on the login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/auth/')) {
      console.warn('⚠️ [API] Unauthorized (401) - Token may be invalid or expired')
      // Don't automatically clear the token - let the ProtectedRoute handle the redirect
      // localStorage.removeItem('authToken')
      // localStorage.removeItem('user')
      // localStorage.removeItem('role')
      // window.location.href = '/auth/owner-login'
    }
    return Promise.reject(error)
  }
)

export default api

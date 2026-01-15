import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  name: string
  role: 'owner' | 'trainer' | 'member'
}

export interface User {
  id: string
  email: string
  name: string
  role: 'owner' | 'trainer' | 'member'
  createdAt: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}

// Login
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload)
  return response.data
}

// Register
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload)
  return response.data
}

// Logout
export const logout = async (): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.LOGOUT)
}

// Refresh token
export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
  return response.data
}

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>(API_ENDPOINTS.USERS.GET_PROFILE)
  return response.data
}

// Update user profile
export const updateProfile = async (payload: Partial<User>): Promise<User> => {
  const response = await api.put<User>(API_ENDPOINTS.USERS.UPDATE_PROFILE, payload)
  return response.data
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useAuthProtection = (requiredRole?: string) => {
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('access_token')

    // If no token, redirect to login
    if (!token) {
      navigate('/auth/trainer-login', { replace: true })
      return
    }

    // If specific role required, check it
    if (requiredRole && role !== requiredRole) {
      navigate('/auth/trainer-login', { replace: true })
      return
    }
  }, [requiredRole, navigate])
}

export const isTrainer = (): boolean => {
  return localStorage.getItem('role') === 'TRAINER'
}

export const isOwner = (): boolean => {
  return localStorage.getItem('role') === 'OWNER'
}

export const isMember = (): boolean => {
  return localStorage.getItem('role') === 'MEMBER'
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token')
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token')
}

export const getRole = (): string | null => {
  return localStorage.getItem('role')
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const clearAuth = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
}

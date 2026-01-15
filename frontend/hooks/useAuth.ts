import { useState, useCallback, useEffect } from 'react'
import api from '../services/api'

interface User {
  id: string
  email: string
  role: 'owner' | 'trainer' | 'member'
  name?: string
}

interface AuthResponse {
  token: string
  user: User
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken')
  })
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!token && !!user

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      })
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('role', newUser.role)
      
      setToken(newToken)
      setUser(newUser)
      
      return { success: true, user: newUser }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    setToken(null)
    setUser(null)
    setError(null)
  }, [])

  const register = useCallback(async (data: {
    email: string
    password: string
    name: string
    role: 'owner' | 'trainer' | 'member'
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<AuthResponse>('/auth/register', data)
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('role', newUser.role)
      
      setToken(newToken)
      setUser(newUser)
      
      return { success: true, user: newUser }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    clearError,
  }
}

export default useAuth

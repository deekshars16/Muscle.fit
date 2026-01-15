import React, { createContext, useCallback, useState, useEffect } from 'react'
import api from '../services/api'
import { API_ENDPOINTS } from '../utils/constants'
import { getErrorMessage } from '../utils/errorHandler'

export interface User {
  id: string
  email: string
  name: string
  role: 'owner' | 'trainer' | 'member'
  createdAt: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: {
    email: string
    password: string
    name: string
    role: 'owner' | 'trainer' | 'member'
  }) => Promise<void>
  clearError: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken')
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!token && !!user

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post<{ token: string; user: User }>(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password }
      )
      const { token: newToken, user: newUser } = response.data

      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('role', newUser.role)

      setToken(newToken)
      setUser(newUser)
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: {
    email: string
    password: string
    name: string
    role: 'owner' | 'trainer' | 'member'
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post<{ token: string; user: User }>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      )
      const { token: newToken, user: newUser } = response.data

      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('role', newUser.role)

      setToken(newToken)
      setUser(newUser)
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
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

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const response = await api.get<User>(API_ENDPOINTS.USERS.GET_PROFILE)
      localStorage.setItem('user', JSON.stringify(response.data))
      setUser(response.data)
    } catch (err) {
      console.error('Failed to refresh user:', err)
      // Don't logout automatically, just log the error
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Don't make API calls on mount - let user interact first
  useEffect(() => {
    // Just restore user session from localStorage if it exists
    const stored = localStorage.getItem('user')
    if (stored && token && !user) {
      try {
        setUser(JSON.parse(stored))
      } catch (err) {
        console.error('Failed to parse stored user:', err)
      }
    }
  }, [])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

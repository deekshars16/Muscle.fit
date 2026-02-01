import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('access_token')

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/auth/trainer-login" replace />
  }

  // If specific role required, check it
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/auth/trainer-login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

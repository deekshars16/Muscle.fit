import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from '../pages/public/Landing'
import Register from '../pages/auth/Register'
import OwnerLogin from '../pages/auth/OwnerLogin'
import OwnerDashboard from '../pages/owner/OwnerDashboard'
import TrainersPage from '../pages/owner/Trainers'
import MembersPage from '../pages/owner/Members'
import PaymentsPage from '../pages/owner/Payments'
import SettingsPage from '../pages/owner/Settings'

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const authToken = localStorage.getItem('authToken')
  console.log('ProtectedRoute check - authToken:', authToken)
  
  if (!authToken) {
    console.log('No auth token, redirecting to login')
    return <Navigate to="/auth/owner-login" replace />
  }
  
  console.log('Auth token found, rendering element')
  return <>{element}</>
}

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/auth/register" element={<Register />} />
    <Route path="/auth/owner-login" element={<OwnerLogin />} />
    
    {/* Protected Owner Routes */}
    <Route path="/owner/dashboard" element={<ProtectedRoute element={<OwnerDashboard />} />} />
    <Route path="/owner/trainers" element={<ProtectedRoute element={<TrainersPage />} />} />
    <Route path="/owner/members" element={<ProtectedRoute element={<MembersPage />} />} />
    <Route path="/owner/payments" element={<ProtectedRoute element={<PaymentsPage />} />} />
    <Route path="/owner/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
    
    {/* Catch all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes

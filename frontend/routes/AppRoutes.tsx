import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from '../pages/public/Landing'
import Register from '../pages/auth/Register'
import OwnerLogin from '../pages/auth/OwnerLogin'
import TrainerLogin from '../pages/auth/TrainerLogin'
import MemberLogin from '../pages/auth/MemberLogin'
import OwnerDashboard from '../pages/owner/OwnerDashboard'
import TrainersPage from '../pages/owner/Trainers'
import MembersPage from '../pages/owner/Members'
import PackagesPage from '../pages/owner/Packages'
import PaymentsPage from '../pages/owner/Payments'
import SettingsPage from '../pages/owner/Settings'
import TrainerDashboard from '../pages/trainer/TrainerDashboard'
import TrainerClients from '../pages/trainer/TrainerClients'
import TrainerSchedule from '../pages/trainer/TrainerSchedule'
import TrainerPrograms from '../pages/trainer/TrainerPrograms'
import TrainerAnalytics from '../pages/trainer/TrainerAnalytics'
import TrainerSettings from '../pages/trainer/TrainerSettings'
import MemberDashboard from '../pages/member/MemberDashboard'
import MemberMembership from '../pages/member/MemberMembership'
import MemberTrainer from '../pages/member/MemberTrainer'
import MemberWorkouts from '../pages/member/MemberWorkouts'
import MemberSchedule from '../pages/member/MemberSchedule'
import MemberAttendance from '../pages/member/MemberAttendance'
import MemberProgress from '../pages/member/MemberProgress'
import MemberProfile from '../pages/member/MemberProfile'

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
    <Route path="/auth/trainer-login" element={<TrainerLogin />} />
    <Route path="/auth/member-login" element={<MemberLogin />} />
    
    {/* Protected Owner Routes */}
    <Route path="/owner/dashboard" element={<ProtectedRoute element={<OwnerDashboard />} />} />
    <Route path="/owner/trainers" element={<ProtectedRoute element={<TrainersPage />} />} />
    <Route path="/owner/members" element={<ProtectedRoute element={<MembersPage />} />} />
    <Route path="/owner/packages" element={<ProtectedRoute element={<PackagesPage />} />} />
    <Route path="/owner/payments" element={<ProtectedRoute element={<PaymentsPage />} />} />
    <Route path="/owner/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
    
    {/* Protected Trainer Routes */}
    <Route path="/trainer/dashboard" element={<ProtectedRoute element={<TrainerDashboard />} />} />
    <Route path="/trainer/clients" element={<ProtectedRoute element={<TrainerClients />} />} />
    <Route path="/trainer/schedule" element={<ProtectedRoute element={<TrainerSchedule />} />} />
    <Route path="/trainer/programs" element={<ProtectedRoute element={<TrainerPrograms />} />} />
    <Route path="/trainer/analytics" element={<ProtectedRoute element={<TrainerAnalytics />} />} />
    <Route path="/trainer/settings" element={<ProtectedRoute element={<TrainerSettings />} />} />
    
    {/* Protected Member Routes */}
    <Route path="/member/dashboard" element={<ProtectedRoute element={<MemberDashboard />} />} />
    <Route path="/member/membership" element={<ProtectedRoute element={<MemberMembership />} />} />
    <Route path="/member/trainer" element={<ProtectedRoute element={<MemberTrainer />} />} />
    <Route path="/member/workouts" element={<ProtectedRoute element={<MemberWorkouts />} />} />
    <Route path="/member/schedule" element={<ProtectedRoute element={<MemberSchedule />} />} />
    <Route path="/member/attendance" element={<ProtectedRoute element={<MemberAttendance />} />} />
    <Route path="/member/progress" element={<ProtectedRoute element={<MemberProgress />} />} />
    <Route path="/member/profile" element={<ProtectedRoute element={<MemberProfile />} />} />
    
    {/* Catch all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes

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
import SettingsTest from '../pages/owner/SettingsTest'
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
const ProtectedRoute: React.FC<{ element: React.ReactNode; role?: string }> = ({ element, role }) => {
  const authToken = localStorage.getItem('authToken')
  const userRole = localStorage.getItem('role')
  
  if (!authToken) {
    console.log('⚠️ No auth token found, redirecting to login')
    // Redirect to appropriate login based on role
    if (role === 'trainer') {
      return <Navigate to="/auth/trainer-login" replace />
    } else if (role === 'member') {
      return <Navigate to="/auth/member-login" replace />
    }
    return <Navigate to="/auth/owner-login" replace />
  }
  
  console.log('✅ Auth token found:', authToken.substring(0, 20) + '...', 'role:', userRole)
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
    <Route path="/owner/dashboard" element={<ProtectedRoute role="owner" element={<OwnerDashboard />} />} />
    <Route path="/owner/trainers" element={<ProtectedRoute role="owner" element={<TrainersPage />} />} />
    <Route path="/owner/members" element={<ProtectedRoute role="owner" element={<MembersPage />} />} />
    <Route path="/owner/packages" element={<ProtectedRoute role="owner" element={<PackagesPage />} />} />
    <Route path="/owner/payments" element={<ProtectedRoute role="owner" element={<PaymentsPage />} />} />
    <Route path="/owner/settings" element={<ProtectedRoute role="owner" element={<SettingsPage />} />} />
    <Route path="/owner/settings-test" element={<ProtectedRoute role="owner" element={<SettingsTest />} />} />
    
    {/* Protected Trainer Routes */}
    <Route path="/trainer/dashboard" element={<ProtectedRoute role="trainer" element={<TrainerDashboard />} />} />
    <Route path="/trainer/clients" element={<ProtectedRoute role="trainer" element={<TrainerClients />} />} />
    <Route path="/trainer/schedule" element={<ProtectedRoute role="trainer" element={<TrainerSchedule />} />} />
    <Route path="/trainer/programs" element={<ProtectedRoute role="trainer" element={<TrainerPrograms />} />} />
    <Route path="/trainer/analytics" element={<ProtectedRoute role="trainer" element={<TrainerAnalytics />} />} />
    <Route path="/trainer/settings" element={<ProtectedRoute role="trainer" element={<TrainerSettings />} />} />
    
    {/* Protected Member Routes */}
    <Route path="/member/dashboard" element={<ProtectedRoute role="member" element={<MemberDashboard />} />} />
    <Route path="/member/membership" element={<ProtectedRoute role="member" element={<MemberMembership />} />} />
    <Route path="/member/trainer" element={<ProtectedRoute role="member" element={<MemberTrainer />} />} />
    <Route path="/member/workouts" element={<ProtectedRoute role="member" element={<MemberWorkouts />} />} />
    <Route path="/member/schedule" element={<ProtectedRoute role="member" element={<MemberSchedule />} />} />
    <Route path="/member/attendance" element={<ProtectedRoute role="member" element={<MemberAttendance />} />} />
    <Route path="/member/progress" element={<ProtectedRoute role="member" element={<MemberProgress />} />} />
    <Route path="/member/profile" element={<ProtectedRoute role="member" element={<MemberProfile />} />} />
    
    {/* Catch all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes

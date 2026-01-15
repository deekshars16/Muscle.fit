import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/public/Landing'
import Register from '../pages/auth/Register'
import OwnerLogin from '../pages/auth/OwnerLogin'

const OwnerDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">Owner Dashboard</h1>
      <p className="text-gray-700">Welcome! This is your gym management dashboard.</p>
    </div>
  </div>
)

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/auth/register" element={<Register />} />
    <Route path="/auth/owner-login" element={<OwnerLogin />} />
    <Route path="/owner/dashboard" element={<OwnerDashboard />} />
  </Routes>
)

export default AppRoutes

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, CheckCircle } from 'lucide-react'

const ChangePassword: React.FC = () => {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Get email from localStorage if present (flow from trainer creation)
    const storedEmail = localStorage.getItem('change_password_email')
    if (storedEmail) setEmail(storedEmail)
  }, [navigate])

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    setError('')
    setLoading(true)

    // Validate passwords
    if ((!email && !localStorage.getItem('change_password_email')) || !currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      setLoading(false)
      return
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('temp_access_token')
      let response

      if (token) {
        // Authenticated change (existing temp token)
        response = await fetch('/api/users/change_password/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: confirmPassword
          })
        })
      } else {
        // Unauthenticated initial change using email + temporary password
        response = await fetch('/api/users/initial_change_password/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email || localStorage.getItem('change_password_email'),
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: confirmPassword
          })
        })
      }

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.detail || 'Failed to change password')
        setLoading(false)
        return
      }

      setSuccess(true)
      // Clear temporary tokens and stored email
      localStorage.removeItem('temp_access_token')
      localStorage.removeItem('temp_refresh_token')
      localStorage.removeItem('change_password_email')

      // Store new tokens if provided
      if (data.access) {
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        localStorage.setItem('role', data.role || 'TRAINER')
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/trainer/dashboard', { replace: true })
      }, 2000)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to change password. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Changed!</h1>
            <p className="text-gray-600 mb-4">Your password has been successfully updated.</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
            <p className="text-gray-600 text-sm">Please create a new password for your account</p>
            <p className="text-xs text-gray-500 mt-2">Email: {email}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password (Temporary)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter temporary password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Password must be at least 8 characters and different from the temporary password
          </p>
        </div>
      </div>
    </section>
  )
}

export default ChangePassword

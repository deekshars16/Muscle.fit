import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

const MemberLogin: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('member@muscles.fit')
  const [password, setPassword] = useState('member123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Member login form submitted')
    
    setError('')
    setLoading(true)

    // Validate inputs
    if (!email || !password) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }

    // Dummy authentication - accept any email/password combination
    console.log('Dummy login - navigating to member dashboard')
    
    // Save dummy auth data to localStorage
    localStorage.setItem('authToken', 'dummy-token-' + Date.now())
    localStorage.setItem('role', 'member')
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userFirstName', 'David')
    localStorage.setItem('userLastName', 'Kim')
    
    console.log('Member auth saved to localStorage')
    setLoading(false)
    
    // Navigate to member dashboard
    setTimeout(() => {
      navigate('/member/dashboard', { replace: true })
    }, 300)
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-black py-12 px-4 flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-purple-100 dark:border-gray-700 transition-colors duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Member Login !</h1>
            <p className="text-gray-600 dark:text-gray-400">Access your training programs and membership</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 text-sm transition-colors duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@muscles.fit"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-2.5 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/auth/register?role=member')}
              className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition"
            >
              Register here
            </button>
          </p>

          <p className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition"
            >
              Go back home
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}

export default MemberLogin

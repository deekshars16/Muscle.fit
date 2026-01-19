import React, { useState, useMemo } from 'react'
import { Search, Bell, LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  sidebarOpen?: boolean
}

// Mock data for search
const mockMembers = [
  { id: '1', name: 'Rahul Sharma', type: 'member' },
  { id: '2', name: 'Priya Patel', type: 'member' },
  { id: '3', name: 'Amit Kumar', type: 'member' },
  { id: '4', name: 'Sneha Gupta', type: 'member' },
]

const mockTrainers = [
  { id: '1', name: 'Rajesh Kumar', type: 'trainer' },
  { id: '2', name: 'Priya Sharma', type: 'trainer' },
  { id: '3', name: 'Vikram Singh', type: 'trainer' },
  { id: '4', name: 'Anita Patel', type: 'trainer' },
]

const Header: React.FC<HeaderProps> = ({ title, sidebarOpen = true }) => {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const ownerEmail = localStorage.getItem('userEmail') || 'owner@muscle.fit'

  // Search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    const term = searchTerm.toLowerCase()
    const members = mockMembers.filter(m => m.name.toLowerCase().includes(term))
    const trainers = mockTrainers.filter(t => t.name.toLowerCase().includes(term))
    return [...members, ...trainers]
  }, [searchTerm])

  const handleBellClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleAdminClick = () => {
    setShowAdminMenu(!showAdminMenu)
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Searching for:', searchTerm)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    localStorage.removeItem('userEmail')
    navigate('/auth/owner-login')
  }

  return (
    <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-40">
      <div className="h-16 px-8 flex items-center justify-between gap-6">
        {/* Left Side - Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search members, trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors duration-200"
            />
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                {searchResults.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{result.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{result.type}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                        {result.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Notifications & User */}
        <div className="flex items-center gap-6 ml-8">
          {/* Notification Bell */}
          <div className="relative">
            <button onClick={handleBellClick} className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-4 z-50">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Notifications</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    ✓ New member registration
                  </button>
                  <button className="w-full text-left p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    ✓ Payment received from John
                  </button>
                  <button className="w-full text-left p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    ⚠ Membership expiring soon
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button onClick={handleAdminClick} className="flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow rounded-lg p-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Owner</p>
              </div>
            </button>
            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-4 z-50">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-sm text-gray-900 dark:text-white font-semibold break-all">{ownerEmail}</p>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-600" />
                  <button 
                    onClick={() => {
                      setShowProfileModal(true)
                      setShowAdminMenu(false)
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300"
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/owner/settings')
                      setShowAdminMenu(false)
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </button>
                  <hr className="border-gray-200 dark:border-gray-600" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Name</label>
                <input
                  type="text"
                  defaultValue="Gym Owner"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={ownerEmail}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header

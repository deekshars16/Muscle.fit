import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import { ChevronDown, LogOut, Sun, Moon } from 'lucide-react'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Hide header on protected routes
  if (location.pathname.startsWith('/owner/') || location.pathname.startsWith('/member/') || location.pathname.startsWith('/trainer/')) {
    return null
  }

  const handleNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        element?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/')
  }

  return (
    <header className="bg-white dark:bg-black py-4 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
          Muscle.fit
        </Link>

        {/* Navigation - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
              Home
            </Link>
            <button
              onClick={() => handleNavigation('programs')}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition bg-none border-none cursor-pointer"
            >
              Programs
            </button>
            <button
              onClick={() => handleNavigation('contact')}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition bg-none border-none cursor-pointer"
            >
              Contact Us
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-700" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </button>
          </nav>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition"
              >
                <span>{user.name || user.email}</span>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || user.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <nav className="p-2 space-y-1">
                    {user.role === 'owner' && (
                      <Link
                        to="/owner/dashboard"
                        className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 transition text-sm"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 transition text-sm flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button aria-label="open menu" className="p-2 rounded-md text-gray-700 hover:text-purple-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  )
}

export default Header

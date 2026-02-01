import React, { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Calendar,
  BarChart3,
  BookOpen,
  Clock,
  Package,
} from 'lucide-react'
import { useAppContext } from '../../hooks/useAppContext'

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
}

interface CollapsibleSidebarProps {
  role: 'owner' | 'trainer' | 'member'
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ role }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarOpen, toggleSidebar } = useAppContext()

  // Define navigation items based on role
  const navItems: NavItem[] = useMemo(() => {
    switch (role) {
      case 'owner':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/owner/dashboard' },
          { label: 'Trainers', icon: <UserCheck className="w-5 h-5" />, path: '/owner/trainers' },
          { label: 'Members', icon: <Users className="w-5 h-5" />, path: '/owner/members' },
          { label: 'Packages', icon: <Package className="w-5 h-5" />, path: '/owner/packages' },
          { label: 'Payments', icon: <CreditCard className="w-5 h-5" />, path: '/owner/payments' },
          { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/owner/settings' },
        ]
      case 'trainer':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/trainer/dashboard' },
          { label: 'Members', icon: <Users className="w-5 h-5" />, path: '/trainer/clients' },
          { label: 'Schedule', icon: <Calendar className="w-5 h-5" />, path: '/trainer/schedule' },
          { label: 'Programs', icon: <BookOpen className="w-5 h-5" />, path: '/trainer/programs' },
          { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/trainer/analytics' },
          { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/trainer/settings' },
        ]
      case 'member':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/member/dashboard' },
          { label: 'Membership', icon: <CreditCard className="w-5 h-5" />, path: '/member/membership' },
          { label: 'My Trainer', icon: <UserCheck className="w-5 h-5" />, path: '/member/trainer' },
          { label: 'Workouts', icon: <Dumbbell className="w-5 h-5" />, path: '/member/workouts' },
          { label: 'Schedule', icon: <Calendar className="w-5 h-5" />, path: '/member/schedule' },
          { label: 'Attendance', icon: <Clock className="w-5 h-5" />, path: '/member/attendance' },
          { label: 'Progress', icon: <BarChart3 className="w-5 h-5" />, path: '/member/progress' },
          { label: 'Profile', icon: <Users className="w-5 h-5" />, path: '/member/profile' },
        ]
      default:
        return []
    }
  }, [role])

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    localStorage.removeItem('userEmail')
    const loginPath = role === 'owner' ? '/auth/owner-login' : role === 'trainer' ? '/auth/trainer-login' : '/auth/member-login'
    navigate(loginPath)
  }

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col z-50 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo Section with Toggle Button */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {sidebarOpen ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💪</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">MUSCLES.FIT</h1>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">💪</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            title={!sidebarOpen ? item.label : undefined}
          >
            {item.icon}
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${
            sidebarOpen ? 'justify-start' : 'justify-center'
          }`}
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default CollapsibleSidebar

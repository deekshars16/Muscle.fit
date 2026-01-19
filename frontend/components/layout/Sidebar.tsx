import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Settings,
  LogOut,
  Package,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
}

interface SidebarProps {
  collapsed?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/owner/dashboard' },
    { label: 'Trainers', icon: <UserCheck className="w-5 h-5" />, path: '/owner/trainers' },
    { label: 'Members', icon: <Users className="w-5 h-5" />, path: '/owner/members' },
    { label: 'Packages', icon: <Package className="w-5 h-5" />, path: '/owner/packages' },
    { label: 'Payments', icon: <CreditCard className="w-5 h-5" />, path: '/owner/payments' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/owner/settings' },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    localStorage.removeItem('userEmail')
    navigate('/auth/owner-login')
  }

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
      {/* Logo Section */}
      <div className={`${collapsed ? 'p-3' : 'p-6'} border-b border-gray-200 dark:border-gray-700 flex-shrink-0`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">💪</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">MUSCLES.FIT</h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className={`flex-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-4'} py-6 space-y-2`}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-4'} py-3 rounded-lg font-medium transition-all duration-200 relative group ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
            
            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Section */}
      <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-gray-200 dark:border-gray-700`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-4'} py-3 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 relative group`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
          
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar

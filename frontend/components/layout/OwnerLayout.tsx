import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './OwnerHeader'

interface OwnerLayoutProps {
  children: React.ReactNode
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
}

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children, sidebarOpen = true, onToggleSidebar }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      {/* Sidebar with Toggle Button */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 relative flex-shrink-0`}>
        <Sidebar collapsed={!sidebarOpen} />
        
        {/* Collapse/Expand Button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="absolute top-3 -right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm z-40"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default OwnerLayout

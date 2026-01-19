import React from 'react'
import CollapsibleSidebar from './CollapsibleSidebar'
import Header from './Header'
import { useAppContext } from '../../hooks/useAppContext'

interface TrainerLayoutProps {
  children: React.ReactNode
}

const TrainerLayout: React.FC<TrainerLayoutProps> = ({ children }) => {
  const { sidebarOpen } = useAppContext()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Sidebar */}
      <CollapsibleSidebar role="trainer" />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto pt-24 pb-8 px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default TrainerLayout

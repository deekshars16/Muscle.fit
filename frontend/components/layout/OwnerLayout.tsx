import React from 'react'
import Sidebar from './Sidebar'
import Header from './OwnerHeader'

interface OwnerLayoutProps {
  children: React.ReactNode
}

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
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

export default OwnerLayout

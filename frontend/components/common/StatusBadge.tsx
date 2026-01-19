import React from 'react'

interface StatusBadgeProps {
  status: 'Active' | 'Draft' | 'Disabled'
  size?: 'sm' | 'md'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'Draft':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
      case 'Disabled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
    }
  }

  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <span className={`inline-block rounded-full font-medium ${sizeClass} ${getStatusStyles(status)}`}>
      {status}
    </span>
  )
}

export default StatusBadge

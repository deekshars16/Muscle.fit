import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  borderColor?: string
  bgGradient?: string
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  borderColor = 'border-orange-400',
  bgGradient = 'from-orange-50 to-white dark:from-gray-800 dark:to-gray-900',
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl border-l-4 ${borderColor} p-6 shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
          )}
        </div>
        <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
          <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
      </div>
    </div>
  )
}

export default StatCard

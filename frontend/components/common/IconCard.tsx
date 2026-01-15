import React from 'react'
import { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  title: string
  subtitle: string
  onClick?: () => void
}

const IconCard: React.FC<Props> = ({ icon: Icon, title, subtitle, onClick }) => {
  return (
    <button onClick={onClick} className="w-full md:flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 flex items-start gap-4 hover:shadow-md dark:hover:shadow-lg transition dark:text-white">
      <div className="text-purple-600 dark:text-purple-400">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-left">
        <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </button>
  )
}

export default IconCard

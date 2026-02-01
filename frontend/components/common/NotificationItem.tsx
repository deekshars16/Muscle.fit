import React from 'react'
import { Check, AlertTriangle, User } from 'lucide-react'

const iconForType = (type: string) => {
  if (type === 'payment') return <Check className="w-4 h-4 text-green-600" />
  if (type === 'expiry') return <AlertTriangle className="w-4 h-4 text-yellow-500" />
  return <User className="w-4 h-4 text-purple-600" />
}

const NotificationItem: React.FC<{ notif: any; onClick: () => void }> = ({ notif, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-3 rounded-lg transition-colors flex items-start gap-3 ${!notif.isRead ? 'bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-sm">
        {iconForType(notif.type)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className={`font-semibold text-sm ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>{notif.title}</div>
          <div className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</div>
      </div>
    </div>
  )
}

export default NotificationItem

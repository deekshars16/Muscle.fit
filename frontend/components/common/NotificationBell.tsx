import React, { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../../context/NotificationsContext'
import NotificationItem from './NotificationItem'
import { useNavigate } from 'react-router-dom'

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markRead } = useNotifications()
  const navigate = useNavigate()

  const list = notifications.slice(0, 10)

  const handleClickNotif = async (n: any) => {
    if (!n.isRead) await markRead(n.id)
    setOpen(false)
    if (n.redirectUrl) navigate(n.redirectUrl)
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div style={{ width: 420 }} className="fixed right-6 top-20 max-w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-2xl z-50">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">Notifications</div>
              <div className="text-xs text-gray-500">Latest</div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && <button onClick={() => notifications.slice(0,10).forEach(n => !n.isRead && markRead(n.id))} className="text-xs text-purple-600 hover:underline">Mark all read</button>}
              <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
            </div>
          </div>
          <div className="max-h-[420px] overflow-auto p-2 space-y-1">
            {list.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">
                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">No notifications</div>
                <div className="mt-2 text-xs">You will see notifications here when events occur.</div>
              </div>
            )}
            {list.map(n => (
              <div key={n.id} className="p-1">
                <NotificationItem notif={n} onClick={() => handleClickNotif(n)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell

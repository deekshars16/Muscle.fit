import React, { createContext, useContext, useEffect, useState } from 'react'
import notificationService from '../services/notificationService'

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'payment' | 'member' | 'expiry' | string
  isRead: boolean
  createdAt: string
  redirectUrl: string
}

interface NotificationsContextValue {
  notifications: Notification[]
  unreadCount: number
  markRead: (id: string) => Promise<void>
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    // Return a safe fallback so components can render even if provider isn't mounted yet
    return {
      notifications: [],
      unreadCount: 0,
      markRead: async (_id: string) => {},
    }
  }
  return ctx
}

export const NotificationsProvider: React.FC<{ userId: string }> = ({ userId, children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [socket, setSocket] = useState<any | null>(null)

  useEffect(() => {
    if (!userId) return

    let mounted = true

    // initial fetch
    ;(async () => {
      try {
        const data = await notificationService.fetchForUser(userId)
        if (mounted) setNotifications(data)
      } catch (e) {
        console.warn('Failed to fetch notifications', e)
      }
    })()

    // connect socket (import socket.io-client dynamically so missing dep doesn't break initial render)
    ;(async () => {
      try {
        const mod = await import('socket.io-client')
        const s = mod.io('http://localhost:3001', { query: { userId } })
        setSocket(s)

        s.on('notification', (notif: Notification) => {
          setNotifications(prev => [notif, ...prev].slice(0, 20))
        })
      } catch (e) {
        console.warn('socket.io-client not available or failed to connect', e)
      }
    })()

    return () => {
      mounted = false
      s.disconnect()
    }
  }, [userId])

  const markRead = async (id: string) => {
    try {
      await notificationService.markRead(userId, id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      // fallback: mark locally
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    }
  }

  const value: NotificationsContextValue = {
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    markRead,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

// No default export to keep HMR fast-refresh stable; use named exports: `NotificationsProvider` and `useNotifications`

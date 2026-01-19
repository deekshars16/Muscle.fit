import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'

export interface Activity {
  id: string
  action: 'member_added' | 'member_edited' | 'member_deleted' | 'trainer_added' | 'trainer_edited' | 'trainer_deleted' | 'photo_added' | 'package_created' | 'package_edited' | 'package_deleted' | 'package_cloned' | 'package_status_changed' | 'member_restored' | 'trainer_restored' | 'package_restored' | 'payment_added' | 'payment_edited' | 'payment_deleted'
  description: string
  timestamp: Date
  details?: string
  deletedData?: any // Store deleted item data for restoration
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (action: Activity['action'], description: string, details?: string, deletedData?: any) => void
  clearActivities: () => void
  removeActivity: (id: string) => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

const STORAGE_KEY = 'gym_activities'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([])

  // Load activities from localStorage on mount
  useEffect(() => {
    const loadActivities = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Convert timestamp strings back to Date objects
          const activitiesWithDates = parsed.map((activity: any) => ({
            ...activity,
            timestamp: new Date(activity.timestamp),
          }))
          
          // Filter out activities older than 7 days
          const now = new Date()
          const filteredActivities = activitiesWithDates.filter((activity: Activity) => {
            const ageMs = now.getTime() - activity.timestamp.getTime()
            return ageMs < SEVEN_DAYS_MS
          })
          
          // Save filtered activities back to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredActivities))
          setActivities(filteredActivities)
        }
      } catch (error) {
        console.error('Error loading activities:', error)
        setActivities([])
      }
    }
    
    loadActivities()
  }, [])

  const addActivity = (action: Activity['action'], description: string, details?: string, deletedData?: any) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      action,
      description,
      timestamp: new Date(),
      details,
      deletedData,
    }
    
    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities))
    } catch (error) {
      console.error('Error saving activities:', error)
    }
  }

  const clearActivities = () => {
    setActivities([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const removeActivity = (id: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== id)
    setActivities(updatedActivities)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities))
    } catch (error) {
      console.error('Error saving activities:', error)
    }
  }

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities, removeActivity }}>
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivity = () => {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider')
  }
  return context
}

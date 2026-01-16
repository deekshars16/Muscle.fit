import React, { createContext, useState, useContext, ReactNode } from 'react'

export interface Activity {
  id: string
  action: 'member_added' | 'member_edited' | 'member_deleted' | 'trainer_added' | 'trainer_edited' | 'trainer_deleted' | 'photo_added'
  description: string
  timestamp: Date
  details?: string
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (action: Activity['action'], description: string, details?: string) => void
  clearActivities: () => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([])

  const addActivity = (action: Activity['action'], description: string, details?: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      action,
      description,
      timestamp: new Date(),
      details,
    }
    setActivities([newActivity, ...activities])
  }

  const clearActivities = () => {
    setActivities([])
  }

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities }}>
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

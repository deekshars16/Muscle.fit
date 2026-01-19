import React, { useState, useEffect } from 'react'
import { UserPlus, Edit, Trash2, Users, AlertCircle, Package, RotateCcw, CheckCircle } from 'lucide-react'
import { Activity } from '../../context/ActivityContext'

interface ActivityFeedProps {
  activities: Activity[]
  onRestoreMember?: (member: any, activityId: string) => void
  onRestoreTrainer?: (trainer: any, activityId: string) => void
  onRestorePackage?: (pkg: any, activityId: string) => void
}

const getIconAndColor = (action: Activity['action']) => {
  switch (action) {
    case 'member_added':
      return {
        icon: UserPlus,
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        iconColor: 'text-green-600 dark:text-green-400',
      }
    case 'member_edited':
      return {
        icon: Edit,
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        iconColor: 'text-blue-600 dark:text-blue-400',
      }
    case 'member_deleted':
      return {
        icon: Trash2,
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        iconColor: 'text-red-600 dark:text-red-400',
      }
    case 'trainer_added':
      return {
        icon: Users,
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        iconColor: 'text-purple-600 dark:text-purple-400',
      }
    case 'trainer_edited':
      return {
        icon: Edit,
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-600 dark:text-indigo-400',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
      }
    case 'trainer_deleted':
      return {
        icon: Trash2,
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-600 dark:text-orange-400',
        iconColor: 'text-orange-600 dark:text-orange-400',
      }
    case 'package_created':
      return {
        icon: Package,
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        text: 'text-cyan-600 dark:text-cyan-400',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
      }
    case 'package_edited':
      return {
        icon: Edit,
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        text: 'text-teal-600 dark:text-teal-400',
        iconColor: 'text-teal-600 dark:text-teal-400',
      }
    case 'package_deleted':
      return {
        icon: Trash2,
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        text: 'text-rose-600 dark:text-rose-400',
        iconColor: 'text-rose-600 dark:text-rose-400',
      }
    case 'package_cloned':
      return {
        icon: Package,
        bg: 'bg-lime-50 dark:bg-lime-900/20',
        text: 'text-lime-600 dark:text-lime-400',
        iconColor: 'text-lime-600 dark:text-lime-400',
      }
    case 'photo_added':
      return {
        icon: AlertCircle,
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-600 dark:text-amber-400',
        iconColor: 'text-amber-600 dark:text-amber-400',
      }
    case 'member_restored':
      return {
        icon: CheckCircle,
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      }
    case 'trainer_restored':
      return {
        icon: CheckCircle,
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      }
    case 'package_restored':
      return {
        icon: CheckCircle,
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      }
    case 'payment_added':
      return {
        icon: AlertCircle,
        bg: 'bg-sky-50 dark:bg-sky-900/20',
        text: 'text-sky-600 dark:text-sky-400',
        iconColor: 'text-sky-600 dark:text-sky-400',
      }
    case 'payment_edited':
      return {
        icon: Edit,
        bg: 'bg-slate-50 dark:bg-slate-900/20',
        text: 'text-slate-600 dark:text-slate-400',
        iconColor: 'text-slate-600 dark:text-slate-400',
      }
    case 'payment_deleted':
      return {
        icon: Trash2,
        bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
        text: 'text-fuchsia-600 dark:text-fuchsia-400',
        iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
      }
    default:
      return {
        icon: AlertCircle,
        bg: 'bg-gray-50 dark:bg-gray-700',
        text: 'text-gray-600 dark:text-gray-300',
        iconColor: 'text-gray-600 dark:text-gray-300',
      }
  }
}

const formatTimestamp = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString()
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const [displayedActivities, setDisplayedActivities] = useState(activities)

  useEffect(() => {
    setDisplayedActivities(activities)
  }, [activities])

  // Auto-refresh timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedActivities([...activities])
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [activities])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors duration-300">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>

      {/* Activities List */}
      <div className="space-y-4">
        {displayedActivities.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent activity</p>
        ) : (
          displayedActivities.slice(0, 10).map((activity) => {
            const { icon: IconComponent, bg, text, iconColor } = getIconAndColor(activity.action)
            const isDeleteAction = activity.action.includes('deleted')
            
            return (
              <div
                key={activity.id}
                className={`flex items-start gap-4 p-4 rounded-lg ${bg} transition-all duration-300 hover:shadow-sm`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <IconComponent className={`w-5 h-5 ${iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{activity.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {activity.details && (
                        <p className={`text-xs ${text}`}>
                          {activity.details}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                  
                  {/* Restore Button for Deleted Items */}
                  {isDeleteAction && activity.deletedData && (
                    <button
                      onClick={() => {
                        if (activity.action === 'member_deleted' && onRestoreMember) {
                          onRestoreMember(activity.deletedData, activity.id)
                        } else if (activity.action === 'trainer_deleted' && onRestoreTrainer) {
                          onRestoreTrainer(activity.deletedData, activity.id)
                        } else if (activity.action === 'package_deleted' && onRestorePackage) {
                          onRestorePackage(activity.deletedData, activity.id)
                        }
                      }}
                      className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ActivityFeed
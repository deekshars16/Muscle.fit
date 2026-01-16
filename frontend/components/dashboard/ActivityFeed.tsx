import React from 'react'
import { UserPlus, Edit, Trash2, Users, AlertCircle } from 'lucide-react'
import { Activity } from '../../context/ActivityContext'

interface ActivityFeedProps {
  activities: Activity[]
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
    case 'photo_added':
      return {
        icon: AlertCircle,
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        text: 'text-cyan-600 dark:text-cyan-400',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors duration-300">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>

      {/* Activities List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const { icon: IconComponent, bg, text, iconColor } = getIconAndColor(activity.action)
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
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${text}`}>
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
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
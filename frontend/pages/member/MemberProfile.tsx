import React, { useState } from 'react'
import MemberLayout from '../../components/layout/MemberLayout'
import { Dumbbell, FileText, Users, Calendar, Clock, TrendingUp, User, Edit2, Camera } from 'lucide-react'

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
}

interface FitnessInfo {
  height: number
  weight: number
  goal: number
  bmi: number
}

interface Preference {
  name: string
  enabled: boolean
}

const MemberProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    emailNotifications: true,
    workoutReminders: true,
    progressReports: false,
  })

  const personalInfo: PersonalInfo = {
    fullName: 'David Kim',
    email: 'david.kim@gmail.com',
    phone: '+91 98765 43210',
    dateOfBirth: 'March 15, 1995',
    address: '123 Fitness Street, Mumbai, India',
  }

  const fitnessInfo: FitnessInfo = {
    height: 175,
    weight: 162,
    goal: 155,
    bmi: 24.2,
  }

  const togglePreference = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <MemberLayout>
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View and update your personal details.</p>
      </div>
      <div className="space-y-6">
            {/* Profile Card and Personal Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col items-center">
                    {/* Profile Picture */}
                    <div className="relative w-32 h-32 mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                        alt="David Kim"
                        className="w-full h-full rounded-full object-cover border-4 border-purple-500"
                      />
                      <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Member Info */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">David Kim</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Member since Jan 2025</p>

                    {/* Membership Plan */}
                    <div className="w-full mt-6 p-4 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg border border-purple-200 dark:border-purple-700">
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300 text-center">Monthly Plan</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 text-center mt-1">Active until Feb 17, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={personalInfo.fullName}
                          readOnly={!isEditing}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={personalInfo.email}
                          readOnly={!isEditing}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    {/* Phone and DOB Row */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400">📱</span>
                          <input
                            type="tel"
                            value={personalInfo.phone}
                            readOnly={!isEditing}
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400">📅</span>
                          <input
                            type="text"
                            value={personalInfo.dateOfBirth}
                            readOnly={!isEditing}
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500 dark:text-gray-400 mt-2">📍</span>
                        <input
                          type="text"
                          value={personalInfo.address}
                          readOnly={!isEditing}
                          className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fitness Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Fitness Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Height (cm)', value: fitnessInfo.height },
                  { label: 'Weight (lbs)', value: fitnessInfo.weight },
                  { label: 'Goal (lbs)', value: fitnessInfo.goal },
                  { label: 'BMI', value: fitnessInfo.bmi },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications' },
                  { key: 'workoutReminders', label: 'Workout Reminders' },
                  { key: 'progressReports', label: 'Progress Reports', value: 'Weekly' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
                    <div className="flex items-center gap-4">
                      {item.value && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.value}</span>
                      )}
                      <button
                        onClick={() => togglePreference(item.key)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                          preferences[item.key] ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span
                        className={`text-sm font-medium ${
                          preferences[item.key]
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {preferences[item.key] ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
      </div>
    </MemberLayout>
  )
}

export default MemberProfile

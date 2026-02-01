import React, { useState, useEffect, useRef } from 'react'
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
  const [savingMessage, setSavingMessage] = useState('')

  // persistent preferences
  const [preferences, setPreferences] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('member_preferences')
      return raw ? JSON.parse(raw) : {
        emailNotifications: true,
        workoutReminders: true,
        progressReports: false,
      }
    } catch {
      return {
        emailNotifications: true,
        workoutReminders: true,
        progressReports: false,
      }
    }
  })

  useEffect(() => {
    try { localStorage.setItem('member_preferences', JSON.stringify(preferences)) } catch {}
  }, [preferences])

  // Profile data (editable)
  const [profile, setProfile] = useState<PersonalInfo>({
    fullName: 'David Kim',
    email: 'david.kim@gmail.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1995-03-15',
    address: '123 Fitness Street, Mumbai, India',
  })

  // local temp edits while editing
  const [draft, setDraft] = useState<PersonalInfo>(profile)

  // fitness info with live BMI
  const [fitness, setFitness] = useState<FitnessInfo>({
    height: 175,
    weight: 162,
    goal: 155,
    bmi: 0,
  })

  // draft for fitness when editing
  const [fitnessDraft, setFitnessDraft] = useState<FitnessInfo>(fitness)

  // compute BMI
  const computeBmi = (heightCm: number, weightLbs: number) => {
    if (!heightCm || !weightLbs) return 0
    const weightKg = weightLbs * 0.45359237
    const heightM = heightCm / 100
    const bmi = weightKg / (heightM * heightM)
    return Math.round(bmi * 10) / 10
  }

  useEffect(() => {
    setFitness(f => ({ ...f, bmi: computeBmi(f.height, f.weight) }))
  }, [])

  // update BMI live when fitnessDraft changes
  useEffect(() => {
    setFitnessDraft(fd => ({ ...fd, bmi: computeBmi(fd.height, fd.weight) }))
  }, [fitnessDraft.height, fitnessDraft.weight])

  // profile picture
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [savedProfileImage, setSavedProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // membership modal
  const [showPlanModal, setShowPlanModal] = useState(false)

  const togglePreference = (key: string) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // editing helpers
  const startEditing = () => {
    setDraft(profile)
    setFitnessDraft(fitness)
    setIsEditing(true)
    setSavingMessage('')
  }

  const cancelEditing = () => {
    setDraft(profile)
    setFitnessDraft(fitness)
    setProfileImage(savedProfileImage)
    setIsEditing(false)
    setSavingMessage('')
  }

  const saveProfile = () => {
    setProfile(draft)
    // persist fitness edits
    setFitness(fitnessDraft)
    // if a new image was chosen, mark it saved
    if (profileImage) setSavedProfileImage(profileImage)
    setIsEditing(false)
    setSavingMessage('Saved')
    setTimeout(() => setSavingMessage(''), 2000)
  }

  const handleImagePick = (file?: File) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setProfileImage(url)
  }

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    if (f) handleImagePick(f)
  }

  const hasDraftChanges = () => {
    const profileChanged = JSON.stringify(draft) !== JSON.stringify(profile)
    const fitnessChanged = JSON.stringify(fitnessDraft) !== JSON.stringify(fitness)
    const imageChanged = profileImage !== null && profileImage !== savedProfileImage
    return profileChanged || fitnessChanged || imageChanged
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
                        src={profileImage || savedProfileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'}
                        alt={profile.fullName}
                        className="w-full h-full rounded-full object-cover border-4 border-purple-500"
                      />
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageInput} className="hidden" />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
                        aria-label="Change profile photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Member Info */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Member since Jan 2025</p>

                    {/* Membership Plan */}
                    <div
                      onClick={() => setShowPlanModal(true)}
                      className="w-full mt-6 p-4 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg border border-purple-200 dark:border-purple-700 hover:shadow-md transition-shadow cursor-pointer"
                    >
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
                    {!isEditing ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={startEditing}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={saveProfile}
                          disabled={!hasDraftChanges()}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${hasDraftChanges() ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={isEditing ? draft.fullName : profile.fullName}
                          readOnly={!isEditing}
                          onChange={e => isEditing && setDraft({ ...draft, fullName: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          value={isEditing ? draft.email : profile.email}
                          readOnly={!isEditing}
                          onChange={e => isEditing && setDraft({ ...draft, email: e.target.value })}
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
                            value={isEditing ? draft.phone : profile.phone}
                            readOnly={!isEditing}
                            onChange={e => isEditing && setDraft({ ...draft, phone: e.target.value })}
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
                          {isEditing ? (
                            <input
                              type="date"
                              value={draft.dateOfBirth}
                              onChange={e => setDraft({ ...draft, dateOfBirth: e.target.value })}
                              className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <input
                              type="text"
                              value={new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              readOnly
                              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          )}
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
                          value={isEditing ? draft.address : profile.address}
                          readOnly={!isEditing}
                          onChange={e => isEditing && setDraft({ ...draft, address: e.target.value })}
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
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Height (cm)</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={fitnessDraft.height}
                      onChange={e => setFitnessDraft(fd => ({ ...fd, height: Number(e.target.value) }))}
                      className="w-full text-2xl font-bold text-center bg-transparent outline-none"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{fitness.height}</p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Weight (lbs)</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={fitnessDraft.weight}
                      onChange={e => setFitnessDraft(fd => ({ ...fd, weight: Number(e.target.value) }))}
                      className="w-full text-2xl font-bold text-center bg-transparent outline-none"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{fitness.weight}</p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Goal (lbs)</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={fitnessDraft.goal}
                      onChange={e => setFitnessDraft(fd => ({ ...fd, goal: Number(e.target.value) }))}
                      className="w-full text-2xl font-bold text-center bg-transparent outline-none"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{fitness.goal}</p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">BMI</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{isEditing ? fitnessDraft.bmi : fitness.bmi}</p>
                </div>
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
      {/* Membership Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Plan</h4>
              <button onClick={() => setShowPlanModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Close</button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Valid until Feb 17, 2026</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Access to all gym equipment</li>
              <li>Group classes included</li>
              <li>Monthly progress check-in</li>
            </ul>
            <div className="mt-6 text-right">
              <button onClick={() => setShowPlanModal(false)} className="py-2 px-4 bg-purple-600 text-white rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  )
}

export default MemberProfile

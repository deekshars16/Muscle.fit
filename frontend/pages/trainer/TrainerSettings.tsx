import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BarChart3, Users, Settings, Bell, Dumbbell, Upload } from 'lucide-react'
import TrainerLayout from '../../components/layout/TrainerLayout'

const TrainerSettings: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 234 567 890',
    bio: 'Certified personal trainer with 10+ years of experience specializing in weight loss and strength training.',
  })
  const [profilePhoto, setProfilePhoto] = useState(
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData)
    // Here you would typically make an API call to save the changes
    alert('Changes saved successfully!')
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfilePhoto(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <TrainerLayout>
      <div className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your account preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'notifications', label: 'Notifications', icon: '🔔' },
              { id: 'security', label: 'Security', icon: '🔒' },
              { id: 'billing', label: 'Billing', icon: '💳' },
              { id: 'appearance', label: 'Appearance', icon: '🎨' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content - Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Profile Picture Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Profile Picture</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Update your profile photo</p>

                <div className="flex items-center gap-8">
                  <div className="relative">
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <label className="absolute bottom-0 right-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 shadow-lg">
                      <Dumbbell className="w-3 h-3 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload new photo
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Update your personal details</p>

                <div className="space-y-6">
                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', checked: true },
                  { label: 'SMS Notifications', checked: false },
                  { label: 'Push Notifications', checked: true },
                  { label: 'Weekly Report', checked: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</label>
                    <input type="checkbox" defaultChecked={item.checked} className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content - Security */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-gray-900 dark:text-white font-medium mb-2">Change Password</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Update your password regularly to keep your account secure</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                    Change Password
                  </button>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-gray-900 dark:text-white font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Billing */}
          {activeTab === 'billing' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Billing Information</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Plan: <span className="font-semibold text-gray-900 dark:text-white">Professional</span></p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Renewal Date: January 31, 2024</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                  Manage Billing
                </button>
              </div>
            </div>
          )}

          {/* Tab Content - Appearance */}
          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Theme</label>
                  <div className="flex gap-4">
                    {[
                      { id: 'light', label: 'Light' },
                      { id: 'dark', label: 'Dark' },
                      { id: 'auto', label: 'Auto' },
                    ].map(theme => (
                      <label key={theme.id} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="theme" defaultChecked={theme.id === 'auto'} className="w-4 h-4" />
                        <span className="text-gray-700 dark:text-gray-300">{theme.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </TrainerLayout>
  )
}

export default TrainerSettings

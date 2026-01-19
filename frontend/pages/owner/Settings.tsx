import React, { useState, useEffect } from 'react'
import { Save, Edit2, Clock, Package, Bell, X, Upload, Trash2 } from 'lucide-react'
import OwnerLayout from '../../components/layout/OwnerLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import gymService, { GymInfo } from '../../services/gymService'
import userService from '../../services/userService'

const SettingsPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [gymInfo, setGymInfo] = useState<GymInfo | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  const [formData, setFormData] = useState({
    gymName: '',
    address: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    postal_code: '',
    openingTime: '05:00',
    closingTime: '22:00',
  })

  // Fetch gym info and user profile on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch gym info
        const gymData = await gymService.getGymInfo()
        if (gymData) {
          setGymInfo(gymData)
          setFormData(prev => ({
            ...prev,
            gymName: gymData.name || '',
            address: gymData.address || '',
            phone: gymData.phone || '',
            email: gymData.email || '',
            city: gymData.city || '',
            state: gymData.state || '',
            postal_code: gymData.postal_code || '',
          }))
        }

        // Fetch user profile (optional, don't fail if this errors)
        try {
          const userProfileData = await userService.getProfile()
          if (userProfileData) {
            setUserProfile(userProfileData)
            if (userProfileData.profile_image) {
              setProfilePhoto(userProfileData.profile_image)
            }
          }
        } catch (err) {
          // Ignore user profile errors - it's optional
          console.log('User profile not available')
        }
      } catch (err: any) {
        // Only set error if gym data failed to load
        console.error('❌ Failed to load gym data:', {
          message: err?.message,
          status: err?.response?.status,
          statusText: err?.response?.statusText,
          data: err?.response?.data,
          url: err?.config?.url,
          fullError: err
        })
        let errorMessage = 'Failed to load gym settings'
        if (err?.message === 'Network Error') {
          errorMessage = 'Network error - please check your connection'
        } else if (err?.response?.status === 404) {
          errorMessage = 'Gym information not found'
        } else {
          errorMessage = `Error: ${err?.message || 'Unknown error'}`
        }
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeletePhoto = () => {
    setProfilePhoto(null)
  }

  const handleSaveProfile = async () => {
    try {
      // Update user profile if needed
      if (userProfile) {
        await userService.partialUpdate(userProfile.id, {
          profile_image: profilePhoto || undefined,
        })
      }
      setShowProfileModal(false)
      setSuccessMessage('Profile updated successfully')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile')
    }
  }

  const handleSave = async () => {
    try {
      setError(null)
      
      // Form data should always be available
      const response = await gymService.updateGymInfo({
        name: formData.gymName || '',
        address: formData.address || '',
        phone: formData.phone || '',
        email: formData.email || '',
        city: formData.city || '',
        state: formData.state || '',
        postal_code: formData.postal_code || '',
      })
      
      if (response) {
        setGymInfo(response)
        setIsEditing(false)
        setSuccessMessage('Settings saved successfully')
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (err: any) {
      console.error('❌ Error saving settings:', err)
      // Show meaningful error message
      let errorMessage = 'Failed to save settings'
      if (err?.response?.status === 404) {
        errorMessage = 'Gym information not found'
      } else if (err?.response?.status === 400) {
        errorMessage = `Invalid data: ${err?.response?.data?.detail || 'Please check your input'}`
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error - please try again'
      } else if (err?.message === 'Network Error') {
        errorMessage = 'Network error - please check your connection'
      } else {
        errorMessage = err?.message || 'Failed to save settings'
      }
      setError(errorMessage)
    }
  }

  if (error && loading && !gymInfo && !userProfile) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </OwnerLayout>
    )
  }

  return (
    <OwnerLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your gym settings</p>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isEditing ? (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5" />
                Edit
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Owner Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Owner Profile</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : userProfile ? (
                  (userProfile.first_name?.charAt(0) || 'G').toUpperCase()
                ) : (
                  'A'
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{userProfile?.first_name || 'Gym Owner'}</p>
                <p className="text-gray-600 dark:text-gray-400">{userProfile?.email || 'owner@muscle.fit'}</p>
              </div>
              <button onClick={() => setShowProfileModal(true)} className="ml-auto px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Gym Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Gym Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gym Name</label>
              <input
                type="text"
                name="gymName"
                value={formData.gymName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white disabled:opacity-60 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white disabled:opacity-60 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white disabled:opacity-60 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Gym Timings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gym Timings</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opening Time</label>
              <input
                type="time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white disabled:opacity-60 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Closing Time</label>
              <input
                type="time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white disabled:opacity-60 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Membership Plans Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Membership Plans</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Basic Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly access</p>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹1,500/mo</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Premium Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full access + trainer</p>
              </div>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">₹2,500/mo</p>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Expiry Reminders</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Send reminders before plan expires</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ml-1" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Payment Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notify on new payments</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ml-1" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">New Members</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alert when someone joins</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile Photo</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Photo Preview */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  'A'
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Upload Photo</span>
                </div>
              </label>
            </div>

            {/* Delete Button */}
            {profilePhoto && (
              <button
                onClick={handleDeletePhoto}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Photo
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}
    </OwnerLayout>
  )}

export default SettingsPage
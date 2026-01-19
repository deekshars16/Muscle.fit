import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BarChart3, TrendingUp, ImagePlus, Trash2, Menu, X } from 'lucide-react'
import OwnerLayout from '../../components/layout/OwnerLayout'
import StatCard from '../../components/dashboard/StatCard'
import Calendar from '../../components/dashboard/Calendar'
import MembershipChart from '../../components/dashboard/MembershipChart'

import LoadingSpinner from '../../components/common/LoadingSpinner'
import gymService, { DashboardStats, MembershipGrowthData } from '../../services/gymService'
import trainerService, { Trainer as BackendTrainer } from '../../services/trainerService'
import userService from '../../services/userService'
import { useAppContext } from '../../hooks/useAppContext'

interface Trainer {
  id: string | number
  initials: string
  name: string
  specialty: string
  rating: number
  color: string
  email?: string
}

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { trainers: contextTrainers, members: contextMembers, payments } = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const colors = ['bg-orange-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-red-500']

  const getInitials = (firstName: string, lastName?: string): string => {
    return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase()
  }

  const getRandomColor = (): string => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Default empty states
  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: 1,
      initials: 'RK',
      name: 'Rajesh Kumar',
      specialty: 'Strength',
      rating: 4.8,
      color: 'bg-orange-500',
    },
    {
      id: 2,
      initials: 'PS',
      name: 'Priya Singh',
      specialty: 'Yoga',
      rating: 4.9,
      color: 'bg-cyan-500',
    },
    {
      id: 3,
      initials: 'VS',
      name: 'Vikram Sharma',
      specialty: 'CrossFit',
      rating: 4.7,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      initials: 'AP',
      name: 'Anita Patel',
      specialty: 'HIIT',
      rating: 4.6,
      color: 'bg-pink-500',
    },
  ])
  const [members, setMembers] = useState<any[]>([])

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [membershipData, setMembershipData] = useState<MembershipGrowthData | null>({
    chart_type: 'area',
    title: 'Membership Growth',
    subtitle: 'January 2026 – Weekly overview',
    data: [
      { week: 'Week 1', members: 50 },
      { week: 'Week 2', members: 60 },
      { week: 'Week 3', members: 55 },
      { week: 'Week 4', members: 65 },
    ],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<Array<{id: string, url: string, description: string}>>(() => {
    try {
      const saved = localStorage.getItem('dashboard_gallery_images')
      if (saved) {
        console.log('✅ Loaded gallery images from localStorage')
        return JSON.parse(saved)
      }
    } catch (err) {
      console.error('❌ Error loading gallery images from localStorage:', err)
    }
    return []
  })
  const [newImage, setNewImage] = useState<{file: File | null, description: string}>({file: null, description: ''})

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage({...newImage, file})
    }
  }

  // Persist gallery images to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dashboard_gallery_images', JSON.stringify(galleryImages))
      console.log('💾 Saved gallery images to localStorage:', galleryImages.length, 'items')
    } catch (err) {
      console.error('❌ Error saving gallery images to localStorage:', err)
    }
  }, [galleryImages])

  const handleAddPhoto = () => {
    if (newImage.file && newImage.description) {
      const reader = new FileReader()
      const fileToRead = newImage.file
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setGalleryImages([...galleryImages, {
          id: Date.now().toString(),
          url: imageUrl,
          description: newImage.description
        }])
        setNewImage({file: null, description: ''})
        // Reset file input
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
      reader.readAsDataURL(fileToRead)
    }
  }

  const handleDeletePhoto = (id: string) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  // Update stats when context data changes
  useEffect(() => {
    // Calculate stats from context data
    const trainerCount = (contextTrainers as any[]).length || 3
    const memberCount = (contextMembers as any[]).length || 2
    
    // Only sum completed payments
    const completedPayments = ((payments as any[]) || []).filter(p => p.status === 'completed' || p.status === 'Completed')
    const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0) || 8000

    setStats({
      trainers: { count: trainerCount, label: 'Active' },
      members: { count: memberCount, new: 12, label: '+12 new' },
      revenue: { amount: totalRevenue, currency: '₹', period: 'This month' },
      alerts: { count: 2, label: 'Expiring' },
    })
  }, [contextTrainers, contextMembers, payments])

  // Load initial data from API if context is empty
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        // Only fetch if context data is empty
        if ((contextTrainers as any[]).length === 0) {
          const trainersData = await trainerService.getAll().catch(() => [])
          // Trainers will be added to context through trainer page if needed
        }

        if ((contextMembers as any[]).length === 0) {
          const membersData = await userService.getMembers().catch(() => [])
          // Members will be added to context through members page if needed
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading initial data:', err)
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Don't show loading state - dashboard can display with default data
  // if (loading) {
  //   return (
  //     <OwnerLayout>
  //       <div className="flex items-center justify-center min-h-screen">
  //         <LoadingSpinner />
  //       </div>
  //     </OwnerLayout>
  //   )
  // }

  return (
    <OwnerLayout sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}>
      <div className="max-w-7xl mx-auto transition-all duration-300">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Owner!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your gym today.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Grid and Calendar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 4 Stats Cards in Horizontal Row */}
          {stats ? (
            <>
              <StatCard
                icon={Users}
                label={stats.trainers.label}
                value={stats.trainers.count}
                borderColor="border-orange-400"
                bgGradient="from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800"
              />
              <StatCard
                icon={Users}
                label="MEMBERS"
                value={stats.members.count}
                subtext={stats.members.label}
                borderColor="border-cyan-400"
                bgGradient="from-cyan-50 to-white dark:from-cyan-900/20 dark:to-gray-800"
              />
              <StatCard
                icon={TrendingUp}
                label="COMPLETED PAYMENT"
                value={`${stats.revenue.currency}${stats.revenue.amount.toLocaleString()}`}
                subtext={stats.revenue.period}
                borderColor="border-purple-400"
                bgGradient="from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800"
              />
            </>
          ) : (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 h-32 animate-pulse" />
              ))}
            </>
          )}
        </div>

        {/* Calendar and Membership Growth Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            {membershipData && (
              <MembershipChart
                data={membershipData.data}
                title={membershipData.title}
                subtitle={membershipData.subtitle}
                selectedDate={selectedDate}
              />
            )}
          </div>

          {/* Sidebar - Calendar */}
          <div>
            <Calendar onDateSelect={handleDateSelect} />
          </div>
        </div>

        {/* Top Trainers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Top Trainers</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your best performing trainers</p>
            </div>
            <button 
              onClick={() => navigate('/owner/trainers')}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200">
              View More
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className={`${trainer.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-semibold text-lg`}>
                    {trainer.initials}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{trainer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{trainer.specialty}</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{trainer.rating}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Gym Gallery Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gym Gallery</h2>
            </div>
            <label className="flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer">
              <ImagePlus className="w-5 h-5" />
              Add Photo
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Image Preview and Description Input */}
          {newImage.file && (
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex gap-6">
                <img 
                  src={URL.createObjectURL(newImage.file)} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (1 line)</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={newImage.description}
                    onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                    placeholder="Enter a brief description..."
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400"
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddPhoto}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Upload Photo
                    </button>
                    <button
                      onClick={() => {
                        setNewImage({file: null, description: ''})
                        const fileInput = document.getElementById('photo-upload') as HTMLInputElement
                        if (fileInput) fileInput.value = ''
                      }}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Grid or Empty State */}
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
                  <img src={image.url} alt={image.description} className="w-full h-48 object-cover" />
                  <div className="p-3 flex justify-between items-start">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 flex-1">{image.description}</p>
                    <button
                      onClick={() => handleDeletePhoto(image.id)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">No photos yet. Add your first gym photo!</p>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  )
}

export default OwnerDashboard

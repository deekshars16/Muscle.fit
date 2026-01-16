import React, { useState, useEffect } from 'react'
import { Plus, MoreVertical, Edit, Trash2, X } from 'lucide-react'
import OwnerLayout from '../../components/layout/OwnerLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import trainerService, { Trainer as BackendTrainer } from '../../services/trainerService'
import { useActivity } from '../../context/ActivityContext'
import { useAppContext } from '../../hooks/useAppContext'

interface TrainerUI extends BackendTrainer {
  initials: string
  color: string
  members: number
  rating: number
}

const TrainersPage: React.FC = () => {
  const { addActivity } = useActivity()
  const { trainers, addTrainer, updateTrainer, deleteTrainer } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialty: 'Fitness Instructor',
  })

  const colors = ['bg-orange-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-red-500', 'bg-blue-500', 'bg-indigo-500']

  const trainerSpecialties = ['Fitness Instructor', 'Zumba Instructor', 'Specialist Trainer', 'Personal Trainer']

  const getInitials = (firstName: string, lastName?: string): string => {
    return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase()
  }

  const getRandomColor = (): string => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Fetch trainers on mount
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await trainerService.getAll()
        
        const transformedTrainers = data.map((trainer) => ({
          ...trainer,
          initials: getInitials(trainer.first_name, trainer.last_name),
          color: getRandomColor(),
          members: Math.floor(Math.random() * 30) + 5,
          rating: 4.5 + Math.random() * 0.5,
        }))
        
        // Add fetched trainers to context if not already there
        transformedTrainers.forEach((trainer) => {
          if (!trainers.find((t) => t.id === trainer.id)) {
            addTrainer(trainer as any)
          }
        })
      } catch (err) {
        console.error('Error fetching trainers:', err)
        // Don't set error state - use context data if available
      } finally {
        setLoading(false)
      }
    }

    if (trainers.length === 0) {
      fetchTrainers()
    } else {
      setLoading(false)
    }
  }, [])

  const filteredTrainers = (trainers as any[]).filter((trainer) =>
    `${trainer.first_name} ${trainer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (trainer?: TrainerUI) => {
    if (trainer) {
      setEditingId(trainer.id)
      setFormData({
        first_name: trainer.first_name,
        last_name: trainer.last_name,
        email: trainer.email,
        phone: trainer.phone || '',
      })
    } else {
      setEditingId(null)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialty: 'Fitness Instructor',
      })
    }
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    })
  }

  const handleSaveTrainer = async () => {
    if (!formData.first_name.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        // Update existing trainer
        await trainerService.partialUpdate(editingId, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
        })
        
        updateTrainer(editingId, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          initials: getInitials(formData.first_name, formData.last_name),
        } as any)
        
        addActivity('trainer_edited', `Edited trainer ${formData.first_name} ${formData.last_name}`, `Email: ${formData.email}`)
      } else {
        // Add new trainer - Try API first, fallback to context
        try {
          const newTrainerData = await trainerService.create({
            username: formData.email.split('@')[0],
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            password: 'DefaultPass@123',
            role: 'trainer',
          })
          
          const newTrainerUI: TrainerUI = {
            ...newTrainerData,
            initials: getInitials(formData.first_name, formData.last_name),
            color: getRandomColor(),
            members: 0,
            rating: 4.5,
          }
          addTrainer(newTrainerUI as any)
          addActivity('trainer_added', `Added new trainer ${formData.first_name} ${formData.last_name}`, `Email: ${formData.email}`)
        } catch (apiErr) {
          // Fallback - add locally through context
          console.log('API failed, adding locally')
          const localTrainer: TrainerUI = {
            id: Math.floor(Math.random() * 10000),
            username: formData.email.split('@')[0],
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone || '',
            role: 'trainer',
            is_active: true,
            created_at: new Date().toISOString(),
            initials: getInitials(formData.first_name, formData.last_name),
            color: getRandomColor(),
            members: 0,
            rating: 4.5,
          }
          addTrainer(localTrainer as any)
          addActivity('trainer_added', `Added new trainer ${formData.first_name} ${formData.last_name}`, `Email: ${formData.email}`)
        }
      }
      
      handleCloseModal()
    } catch (err: any) {
      console.error('Error saving trainer:', err)
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to save trainer'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleDeleteTrainer = async (id: number | string) => {
    if (confirm('Are you sure you want to delete this trainer?')) {
      try {
        await trainerService.delete(id)
        const trainerToDelete = (trainers as any[]).find((t) => t.id === id)
        deleteTrainer(id)
        if (trainerToDelete) {
          addActivity('trainer_deleted', `Deleted trainer ${trainerToDelete.first_name} ${trainerToDelete.last_name}`, `Email: ${trainerToDelete.email}`)
        }
        setOpenMenuId(null)
      } catch (err) {
        console.error('Error deleting trainer:', err)
        // Still delete locally even if API fails
        deleteTrainer(id)
      }
    }
  }

  if (loading) {
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trainers</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your gym trainers</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Trainer
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search trainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
          />
        </div>

        {/* Add/Edit Trainer Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Trainer' : 'Add Trainer'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveTrainer()
                }}
                className="space-y-4"
              >
                {/* First Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
                    placeholder="Enter email"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Specialty Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialty
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
                  >
                    {trainerSpecialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    {editingId ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 relative"
            >
              {/* Header with Menu */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`${trainer.color} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg`}
                >
                  {trainer.initials}
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === trainer.id ? null : trainer.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* Action Menu */}
                  {openMenuId === trainer.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                      <button
                        onClick={() => handleOpenModal(trainer)}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg border-b border-gray-200 dark:border-gray-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTrainer(trainer.id)}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{trainer.first_name} {trainer.last_name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{trainer.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{trainer.role || 'Trainer'}</p>

              {/* Stats */}
              <div className="space-y-2 mb-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{trainer.members}</span> members
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{trainer.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  )
}

export default TrainersPage

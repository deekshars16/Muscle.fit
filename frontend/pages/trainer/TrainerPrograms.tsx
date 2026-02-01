import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BarChart3, Users, Settings, Bell, Dumbbell, Plus, Filter, MoreVertical, Copy, Edit, Trash2, X } from 'lucide-react'
import TrainerLayout from '../../components/layout/TrainerLayout'
import programService, { Program } from '../../services/programService'
import trainerService from '../../services/trainerService'
import { useAuth } from '../../hooks/useAuth'

const TrainerPrograms: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    program_type: 'muscle' as const,
    description: '',
    duration_weeks: 12,
    difficulty_level: 'intermediate' as const,
    price: 0,
    is_active: true,
  })

  // Load programs on mount
  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await programService.getMyPrograms()
      setPrograms(data)
    } catch (err) {
      setError('Failed to load programs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProgram) {
        // Update program
        await programService.update(editingProgram.id, formData)
        setSuccessMessage('Program updated successfully!')
      } else {
        // Create new program using trainer-specific endpoint
        await trainerService.createProgram({
          name: formData.name,
          program_type: formData.program_type,
          description: formData.description,
          duration_weeks: formData.duration_weeks,
          difficulty_level: formData.difficulty_level,
          price: formData.price,
          is_active: formData.is_active,
        })
        setSuccessMessage('Program created successfully!')
      }
      setIsModalOpen(false)
      setEditingProgram(null)
      resetForm()
      await loadPrograms()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err: any) {
      let errorMsg = 'Failed to save program'
      
      if (err?.response?.status === 0 || err?.message === 'Network Error') {
        errorMsg = 'Network Error: Cannot connect to server. Make sure the backend is running on localhost:8000.'
      } else if (err?.response?.data?.error) {
        errorMsg = err.response.data.error
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err?.response?.data?.detail) {
        errorMsg = err.response.data.detail
      } else if (err?.response?.data?.name && Array.isArray(err.response.data.name)) {
        errorMsg = err.response.data.name[0]
      } else if (err?.response?.data?.program_type && Array.isArray(err.response.data.program_type)) {
        errorMsg = err.response.data.program_type[0]
      } else if (err?.message) {
        errorMsg = err.message
      }
      
      setError(errorMsg)
      console.error('Error saving program:', {
        status: err?.response?.status,
        message: err?.message,
        data: err?.response?.data,
        fullError: err,
      })
    }
  }

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program)
    setFormData({
      name: program.name,
      program_type: program.program_type as any,
      description: program.description,
      duration_weeks: program.duration_weeks,
      difficulty_level: program.difficulty_level as any,
      price: program.price,
      is_active: program.is_active,
    })
    setIsModalOpen(true)
  }

  const handleDuplicateProgram = async (programId: number) => {
    try {
      await programService.duplicate(programId)
      await loadPrograms()
    } catch (err) {
      setError('Failed to duplicate program')
      console.error(err)
    }
  }

  const handleDeleteProgram = async (programId: number) => {
    if (confirm('Are you sure you want to delete this program?')) {
      try {
        await programService.delete(programId)
        await loadPrograms()
      } catch (err) {
        setError('Failed to delete program')
        console.error(err)
      }
    }
  }

  const handleOpenModal = () => {
    setEditingProgram(null)
    resetForm()
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      program_type: 'muscle',
      description: '',
      duration_weeks: 12,
      difficulty_level: 'intermediate',
      price: 0,
      is_active: true,
    })
  }

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    {
      label: 'Total Programs',
      value: programs.length.toString(),
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Active Programs',
      value: programs.filter(p => p.is_active).length.toString(),
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Enrollments',
      value: programs.reduce((acc, p) => acc + (p.enrollments || 0), 0).toString(),
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Avg. Enrollments',
      value:
        programs.length > 0
          ? Math.round(programs.reduce((acc, p) => acc + (p.enrollments || 0), 0) / programs.length).toString()
          : '0',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <TrainerLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Programs</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Create and manage training programs</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Program
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
            {error}
            <button onClick={() => setError(null)} className="ml-2 font-semibold">
              Dismiss
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400 flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="font-semibold">
              ✕
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading programs...</p>
            </div>
          </div>
        )}

        {/* Programs Grid */}
        {!loading && (
          <>
            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-3xl">💪</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{program.name}</h3>
                          <span
                            className={`inline-block text-xs font-medium mt-1 px-2 py-1 rounded ${
                              program.is_active
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                            }`}
                          >
                            {program.is_active ? 'active' : 'inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => handleEditProgram(program)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateProgram(program.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(program.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{program.description}</p>

                    {/* Info Row */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{program.enrollments || 0} members</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>⏱️</span>
                        <span>{program.duration_weeks} weeks</span>
                      </div>
                    </div>

                    {/* Difficulty and Progress */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium capitalize">{program.difficulty_level}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Type: {program.program_type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Price: ₹{program.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {searchTerm ? 'No programs found matching your search' : 'No programs yet'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleOpenModal}
                    className="mt-4 text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Create your first program
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProgram ? 'Edit Program' : 'Create New Program'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Weight Loss Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Type *
                </label>
                <select
                  value={formData.program_type}
                  onChange={(e) => setFormData({ ...formData, program_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cardio">Cardio</option>
                  <option value="muscle">Muscle Building</option>
                  <option value="yoga">Yoga</option>
                  <option value="strength">Strength Training</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 rows-3"
                  placeholder="Describe the program..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  {editingProgram ? 'Update' : 'Create'} Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </TrainerLayout>
  )
}

export default TrainerPrograms

import api from './api'
import { Program } from './programService'

export interface Trainer {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  profile_image?: string
  bio?: string
  role: string
  is_active: boolean
  created_at: string
}

export interface TrainerListResponse {
  data: Trainer[]
  total?: number
}

export interface CreateProgramData {
  name: string
  program_type: 'cardio' | 'muscle' | 'yoga' | 'strength' | 'flexibility'
  description: string
  duration_weeks: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  is_active: boolean
}

// Trainer Service API calls
const trainerService = {
  // Get all trainers
  getAll: async (): Promise<Trainer[]> => {
    try {
      const response = await api.get('/trainers/')
      return response.data.results || response.data
    } catch (error) {
      console.error('Failed to fetch trainers:', error)
      return []
    }
  },

  // Get trainer by ID
  getById: async (id: number): Promise<Trainer | null> => {
    try {
      const response = await api.get(`/trainers/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch trainer ${id}:`, error)
      return null
    }
  },

  // Create trainer
  create: async (data: Partial<Trainer>): Promise<Trainer> => {
    const response = await api.post('/trainers/', data)
    return response.data
  },

  // Update trainer
  update: async (id: number, data: Partial<Trainer>): Promise<Trainer> => {
    const response = await api.put(`/trainers/${id}/`, data)
    return response.data
  },

  // Partial update trainer
  partialUpdate: async (id: number, data: Partial<Trainer>): Promise<Trainer> => {
    const response = await api.patch(`/trainers/${id}/`, data)
    return response.data
  },

  // Delete trainer
  delete: async (id: number): Promise<void> => {
    await api.delete(`/trainers/${id}/`)
  },

  // Create program for logged-in trainer
  createProgram: async (data: CreateProgramData): Promise<Program> => {
    try {
      const response = await api.post('/trainers/programs/', data)
      return response.data
    } catch (error: any) {
      console.error('Create trainer program error:', error?.response?.data || error?.message)
      throw error
    }
  },
}

export default trainerService

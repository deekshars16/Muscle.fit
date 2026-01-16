import api from './api'

export interface Program {
  id: number
  name: string
  program_type: string
  description: string
  duration_weeks: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  image?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Program Service API calls
const programService = {
  // Get all programs
  getAll: async (): Promise<Program[]> => {
    try {
      const response = await api.get('/programs/')
      return response.data.results || response.data
    } catch (error) {
      console.error('Failed to fetch programs:', error)
      return []
    }
  },

  // Get program by ID
  getById: async (id: number): Promise<Program | null> => {
    try {
      const response = await api.get(`/programs/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch program ${id}:`, error)
      return null
    }
  },

  // Create program
  create: async (data: Partial<Program>): Promise<Program> => {
    const response = await api.post('/programs/', data)
    return response.data
  },

  // Update program
  update: async (id: number, data: Partial<Program>): Promise<Program> => {
    const response = await api.put(`/programs/${id}/`, data)
    return response.data
  },

  // Partial update program
  partialUpdate: async (id: number, data: Partial<Program>): Promise<Program> => {
    const response = await api.patch(`/programs/${id}/`, data)
    return response.data
  },

  // Delete program
  delete: async (id: number): Promise<void> => {
    await api.delete(`/programs/${id}/`)
  },
}

export default programService
  await api.delete(API_ENDPOINTS.PROGRAMS.DELETE(id))
}

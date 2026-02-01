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
  trainer_id?: number
  trainer_name?: string
  enrollments?: number
}

export interface ProgramAssignment {
  id: number
  program: number
  member: number
  member_name: string
  member_email: string
  program_name: string
  assigned_at: string
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

  // Get trainer's own programs
  getMyPrograms: async (): Promise<Program[]> => {
    try {
      const response = await api.get('/programs/my_programs/')
      return response.data.results || response.data
    } catch (error) {
      console.error('Failed to fetch trainer programs:', error)
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
    try {
      const response = await api.post('/programs/', data)
      return response.data
    } catch (error: any) {
      console.error('Create program error:', error?.response?.data || error?.message)
      throw error
    }
  },

  // Update program
  update: async (id: number, data: Partial<Program>): Promise<Program> => {
    try {
      const response = await api.put(`/programs/${id}/`, data)
      return response.data
    } catch (error: any) {
      console.error('Update program error:', error?.response?.data || error?.message)
      throw error
    }
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

  // Duplicate a program
  duplicate: async (id: number): Promise<Program> => {
    const response = await api.post(`/programs/${id}/duplicate/`)
    return response.data
  },

  // Assign program to a member
  assignMember: async (programId: number, memberId: number): Promise<ProgramAssignment> => {
    const response = await api.post(`/programs/${programId}/assign_member/`, {
      member_id: memberId,
    })
    return response.data
  },

  // Remove program assignment from a member
  unassignMember: async (programId: number, memberId: number): Promise<void> => {
    await api.delete(`/programs/${programId}/unassign_member/`, {
      data: { member_id: memberId },
    })
  },

  // Get members assigned to a program
  getAssignedMembers: async (programId: number): Promise<ProgramAssignment[]> => {
    try {
      const response = await api.get('/programs/assigned_members/', {
        params: { program_id: programId },
      })
      return response.data.results || response.data
    } catch (error) {
      console.error(`Failed to fetch assigned members for program ${programId}:`, error)
      return []
    }
  },
}

export default programService

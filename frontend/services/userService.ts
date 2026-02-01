import api from './api'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  profile_image?: string
  bio?: string
  role: 'owner' | 'trainer' | 'member'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Member extends User {
  role: 'member'
  plan?: string
  joinDate?: string
  expiryDate?: string
  status?: 'active' | 'expiring' | 'expired'
}

// User Service API calls
const userService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users/')
      return response.data.results || response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
      return []
    }
  },

  // Get all members
  getMembers: async (): Promise<Member[]> => {
    try {
      const response = await api.get('/users/members/')
      return response.data.results || response.data
    } catch (error) {
      console.error('Failed to fetch members:', error)
      return []
    }
  },

  // Get user by ID
  getById: async (id: number): Promise<User | null> => {
    try {
      const response = await api.get(`/users/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error)
      return null
    }
  },

  // Get profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile/')
    return response.data
  },

  // Create user
  create: async (data: Partial<User>): Promise<User> => {
    const response = await api.post('/users/', data)
    return response.data
  },

  // Update user
  update: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}/`, data)
    return response.data
  },

  // Partial update user
  partialUpdate: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.patch(`/users/${id}/`, data)
    return response.data
  },

  // Delete user
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}/`)
  },
}

export default userService

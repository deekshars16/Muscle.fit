import api from './api'

export interface Payment {
  id: string
  user_id: number
  user_name: string
  user_role: 'trainer' | 'member'
  amount: number
  date: string
  method: 'UPI' | 'Card' | 'Cash'
  status: 'completed' | 'pending' | 'failed'
  description?: string
  created_at: string
  updated_at: string
}

// Payment Service API calls
const paymentService = {
  // Get all payments
  getAll: async (): Promise<Payment[]> => {
    try {
      // Since payments might not have a dedicated endpoint, we'll fetch from a gym endpoint
      const response = await api.get('/gym/payments/')
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch payments:', error)
      return []
    }
  },

  // Get payment by ID
  getById: async (id: string): Promise<Payment | null> => {
    try {
      const response = await api.get(`/gym/payments/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch payment ${id}:`, error)
      return null
    }
  },

  // Get payments by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<Payment[]> => {
    try {
      const response = await api.get('/gym/payments/', {
        params: { startDate, endDate },
      })
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch payments by date range:', error)
      return []
    }
  },

  // Get payments by status
  getByStatus: async (status: 'completed' | 'pending' | 'failed'): Promise<Payment[]> => {
    try {
      const response = await api.get('/gym/payments/', {
        params: { status },
      })
      return response.data || []
    } catch (error) {
      console.error(`Failed to fetch ${status} payments:`, error)
      return []
    }
  },

  // Create payment
  create: async (data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post('/gym/payments/', data)
    return response.data
  },

  // Update payment
  update: async (id: string, data: Partial<Payment>): Promise<Payment> => {
    const response = await api.put(`/gym/payments/${id}/`, data)
    return response.data
  },

  // Partial update payment
  partialUpdate: async (id: string, data: Partial<Payment>): Promise<Payment> => {
    const response = await api.patch(`/gym/payments/${id}/`, data)
    return response.data
  },

  // Delete payment
  delete: async (id: string): Promise<void> => {
    await api.delete(`/gym/payments/${id}/`)
  },

  // Get payment statistics
  getStats: async () => {
    try {
      const response = await api.get('/gym/payments/stats/')
      return response.data
    } catch (error) {
      console.error('Failed to fetch payment stats:', error)
      return null
    }
  },
}

export default paymentService

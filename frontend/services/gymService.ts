import api from './api'

// Types for dashboard data
export interface DashboardStats {
  trainers: {
    count: number
    label: string
  }
  members: {
    count: number
    new: number
    label: string
  }
  revenue: {
    amount: number
    currency: string
    period: string
  }
  alerts: {
    count: number
    label: string
  }
}

export interface MembershipGrowthData {
  chart_type: string
  data: Array<{
    week: string
    members: number
  }>
  title: string
  subtitle: string
}

export interface Activity {
  type: string
  title: string
  name: string
  amount?: string
  timestamp: string
  icon: string
}

export interface RecentActivityResponse {
  activities: Activity[]
}

export interface GymInfo {
  id: number
  name: string
  email: string
  phone: string
  whatsapp?: string
  address: string
  city: string
  state: string
  postal_code: string
  logo?: string
  hero_image?: string
  description: string
  established_year?: number
}

export interface WorkingHours {
  id: number
  day: string
  opening_time: string
  closing_time: string
  is_closed: boolean
}

// Gym Service API calls
const gymService = {
  // Fetch dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/gym/dashboard_stats/')
    return response.data
  },

  // Fetch membership growth data
  getMembershipGrowth: async (): Promise<MembershipGrowthData> => {
    const response = await api.get('/gym/membership_growth/')
    return response.data
  },

  // Fetch recent activity
  getRecentActivity: async (): Promise<RecentActivityResponse> => {
    const response = await api.get('/gym/recent_activity/')
    return response.data
  },

  // Fetch gym information
  getGymInfo: async (): Promise<GymInfo> => {
    try {
      console.log('📡 [GymService] Calling api.get("/gym/current/")')
      const response = await api.get('/gym/current/')
      console.log('✅ [GymService] Response received:', response)
      console.log('✅ [GymService] Response status:', response.status)
      console.log('✅ [GymService] Response data:', response.data)
      return response.data
    } catch (err: any) {
      console.error('❌ [GymService] Error details:', {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        headers: err?.response?.headers,
        config: err?.config,
        fullError: err
      })
      throw err
    }
  },

  // Update gym information
  updateGymInfo: async (data: Partial<GymInfo>): Promise<GymInfo> => {
    try {
      console.log('📡 [GymService] Updating gym info with data:', data)
      const response = await api.put('/gym/1/', data)
      console.log('✅ [GymService] Update response:', response)
      console.log('✅ [GymService] Update response data:', response.data)
      return response.data
    } catch (err: any) {
      console.error('❌ [GymService] Update error:', {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        headers: err?.response?.headers,
        fullError: err
      })
      throw err
    }
  },

  // Fetch working hours
  getWorkingHours: async (): Promise<WorkingHours[]> => {
    const response = await api.get('/gym/1/working_hours/')
    return response.data
  },

  // Update working hours
  updateWorkingHours: async (day: string, data: Partial<WorkingHours>): Promise<WorkingHours> => {
    const response = await api.put(`/gym/1/working_hours/${day}/`, data)
    return response.data
  },
}

export default gymService

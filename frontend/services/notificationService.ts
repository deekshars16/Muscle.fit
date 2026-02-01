import axios from 'axios'

const BASE = 'http://localhost:3001'

const notificationService = {
  fetchForUser: async (userId: string) => {
    const res = await axios.get(`${BASE}/notifications/${userId}`)
    return res.data
  },
  markRead: async (userId: string, id: string) => {
    const res = await axios.post(`${BASE}/notifications/${userId}/${id}/read`)
    return res.data
  },
  create: async (payload: any) => {
    const res = await axios.post(`${BASE}/notifications/create`, payload)
    return res.data
  }
}

export default notificationService

import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

export interface Trainer {
  id: string
  name: string
  email: string
  specialization: string
  experience: number
  bio?: string
  image?: string
  createdAt: string
}

export interface TrainerResponse {
  data: Trainer[]
  total: number
  page: number
  pageSize: number
}

// Get all trainers
export const getTrainers = async (page: number = 1, pageSize: number = 10): Promise<TrainerResponse> => {
  const response = await api.get<TrainerResponse>(API_ENDPOINTS.TRAINERS.GET_ALL, {
    params: { page, pageSize },
  })
  return response.data
}

// Get trainer by ID
export const getTrainerById = async (id: string): Promise<Trainer> => {
  const response = await api.get<Trainer>(API_ENDPOINTS.TRAINERS.GET_BY_ID(id))
  return response.data
}

// Create trainer
export const createTrainer = async (payload: Omit<Trainer, 'id' | 'createdAt'>): Promise<Trainer> => {
  const response = await api.post<Trainer>(API_ENDPOINTS.TRAINERS.CREATE, payload)
  return response.data
}

// Update trainer
export const updateTrainer = async (id: string, payload: Partial<Trainer>): Promise<Trainer> => {
  const response = await api.put<Trainer>(API_ENDPOINTS.TRAINERS.UPDATE(id), payload)
  return response.data
}

// Delete trainer
export const deleteTrainer = async (id: string): Promise<void> => {
  await api.delete(API_ENDPOINTS.TRAINERS.DELETE(id))
}

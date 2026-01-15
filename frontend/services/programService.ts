import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

export interface Program {
  id: string
  name: string
  description: string
  category: string
  duration: number
  level: 'beginner' | 'intermediate' | 'advanced'
  price?: number
  image?: string
  createdAt: string
}

export interface ProgramResponse {
  data: Program[]
  total: number
  page: number
  pageSize: number
}

// Get all programs
export const getPrograms = async (page: number = 1, pageSize: number = 10): Promise<ProgramResponse> => {
  const response = await api.get<ProgramResponse>(API_ENDPOINTS.PROGRAMS.GET_ALL, {
    params: { page, pageSize },
  })
  return response.data
}

// Get program by ID
export const getProgramById = async (id: string): Promise<Program> => {
  const response = await api.get<Program>(API_ENDPOINTS.PROGRAMS.GET_BY_ID(id))
  return response.data
}

// Create program
export const createProgram = async (payload: Omit<Program, 'id' | 'createdAt'>): Promise<Program> => {
  const response = await api.post<Program>(API_ENDPOINTS.PROGRAMS.CREATE, payload)
  return response.data
}

// Update program
export const updateProgram = async (id: string, payload: Partial<Program>): Promise<Program> => {
  const response = await api.put<Program>(API_ENDPOINTS.PROGRAMS.UPDATE(id), payload)
  return response.data
}

// Delete program
export const deleteProgram = async (id: string): Promise<void> => {
  await api.delete(API_ENDPOINTS.PROGRAMS.DELETE(id))
}

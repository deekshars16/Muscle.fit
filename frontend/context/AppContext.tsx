import React, { createContext, useState, useEffect, useCallback } from 'react'

export interface Trainer {
  id: number | string
  username: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  specialty?: string
  role: string
  is_active: boolean
  created_at: string
  initials?: string
  color?: string
  members?: number
  rating?: number
}

export interface Member {
  id: number | string
  username: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: string
  is_active: boolean
  created_at: string
  initials?: string
  color?: string
  joinDate?: string
  expiryDate?: string
  status?: string
}

export interface Payment {
  id: string
  user_name: string
  user_role: string
  amount: number
  date: string
  method: string
  status: string
  displayName?: string
  displayRole?: string
}

export interface AppContextType {
  trainers: Trainer[]
  members: Member[]
  payments: Payment[]
  addTrainer: (trainer: Trainer) => void
  updateTrainer: (id: number | string, trainer: Partial<Trainer>) => void
  deleteTrainer: (id: number | string) => void
  addMember: (member: Member) => void
  updateMember: (id: number | string, member: Partial<Member>) => void
  deleteMember: (id: number | string) => void
  addPayment: (payment: Payment) => void
  updatePayment: (id: string, payment: Partial<Payment>) => void
  deletePayment: (id: string) => void
}

const defaultValue: AppContextType = {
  trainers: [],
  members: [],
  payments: [],
  addTrainer: () => {},
  updateTrainer: () => {},
  deleteTrainer: () => {},
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
  addPayment: () => {},
  updatePayment: () => {},
  deletePayment: () => {},
}

export const AppContext = createContext<AppContextType>(defaultValue)

interface AppContextProviderProps {
  children: React.ReactNode
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedTrainers = localStorage.getItem('app_trainers')
    const savedMembers = localStorage.getItem('app_members')
    const savedPayments = localStorage.getItem('app_payments')

    if (savedTrainers) {
      try {
        setTrainers(JSON.parse(savedTrainers))
      } catch (err) {
        console.error('Error loading trainers from localStorage:', err)
      }
    }

    if (savedMembers) {
      try {
        setMembers(JSON.parse(savedMembers))
      } catch (err) {
        console.error('Error loading members from localStorage:', err)
      }
    }

    if (savedPayments) {
      try {
        setPayments(JSON.parse(savedPayments))
      } catch (err) {
        console.error('Error loading payments from localStorage:', err)
      }
    }
  }, [])

  // Persist trainers to localStorage
  useEffect(() => {
    localStorage.setItem('app_trainers', JSON.stringify(trainers))
  }, [trainers])

  // Persist members to localStorage
  useEffect(() => {
    localStorage.setItem('app_members', JSON.stringify(members))
  }, [members])

  // Persist payments to localStorage
  useEffect(() => {
    localStorage.setItem('app_payments', JSON.stringify(payments))
  }, [payments])

  const addTrainer = useCallback((trainer: Trainer) => {
    setTrainers((prev) => [...prev, trainer])
  }, [])

  const updateTrainer = useCallback((id: number | string, updatedData: Partial<Trainer>) => {
    setTrainers((prev) =>
      prev.map((trainer) =>
        trainer.id === id ? { ...trainer, ...updatedData } : trainer
      )
    )
  }, [])

  const deleteTrainer = useCallback((id: number | string) => {
    setTrainers((prev) => prev.filter((trainer) => trainer.id !== id))
  }, [])

  const addMember = useCallback((member: Member) => {
    setMembers((prev) => [...prev, member])
  }, [])

  const updateMember = useCallback((id: number | string, updatedData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, ...updatedData } : member
      )
    )
  }, [])

  const deleteMember = useCallback((id: number | string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id))
  }, [])

  const addPayment = useCallback((payment: Payment) => {
    setPayments((prev) => [...prev, payment])
  }, [])

  const updatePayment = useCallback((id: string, updatedData: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, ...updatedData } : payment
      )
    )
  }, [])

  const deletePayment = useCallback((id: string) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id))
  }, [])

  const value: AppContextType = {
    trainers,
    members,
    payments,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    addMember,
    updateMember,
    deleteMember,
    addPayment,
    updatePayment,
    deletePayment,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

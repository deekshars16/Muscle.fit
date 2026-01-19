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

export interface Package {
  id: number | string
  name: string
  type: 'Gym' | 'PT' | 'Classes'
  description?: string
  mrp: number
  sellingPrice: number
  discountType: 'Flat' | 'Percentage'
  discountValue: number
  finalPrice: number
  validityNumber: number
  validityUnit: 'Days' | 'Months'
  startRule: 'From purchase' | 'From first check-in'
  features: string[]
  thumbnailUrl?: string
  videoUrl?: string
  status: 'Active' | 'Draft' | 'Disabled'
  createdAt: string
}

export interface AppContextType {
  trainers: Trainer[]
  members: Member[]
  payments: Payment[]
  packages: Package[]
  sidebarOpen: boolean
  toggleSidebar: () => void
  addTrainer: (trainer: Trainer) => void
  updateTrainer: (id: number | string, trainer: Partial<Trainer>) => void
  deleteTrainer: (id: number | string) => void
  addMember: (member: Member) => void
  updateMember: (id: number | string, member: Partial<Member>) => void
  deleteMember: (id: number | string) => void
  addPayment: (payment: Payment) => void
  updatePayment: (id: string, payment: Partial<Payment>) => void
  deletePayment: (id: string) => void
  addPackage: (pkg: Package) => void
  updatePackage: (id: number | string, pkg: Partial<Package>) => void
  deletePackage: (id: number | string) => void
}

const defaultValue: AppContextType = {
  trainers: [],
  members: [],
  payments: [],
  packages: [],
  sidebarOpen: true,
  toggleSidebar: () => {},
  addTrainer: () => {},
  updateTrainer: () => {},
  deleteTrainer: () => {},
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
  addPayment: () => {},
  updatePayment: () => {},
  deletePayment: () => {},
  addPackage: () => {},
  updatePackage: () => {},
  deletePackage: () => {},
}

export const AppContext = createContext<AppContextType>(defaultValue)

interface AppContextProviderProps {
  children: React.ReactNode
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sidebarOpen')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    // Initialize from localStorage immediately
    try {
      const saved = localStorage.getItem('app_trainers')
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log('✅ Loaded trainers from localStorage:', parsed)
        return parsed
      }
    } catch (err) {
      console.error('❌ Error loading trainers from localStorage:', err)
    }
    return []
  })

  const [members, setMembers] = useState<Member[]>(() => {
    // Initialize from localStorage immediately
    try {
      const saved = localStorage.getItem('app_members')
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log('✅ Loaded members from localStorage:', parsed)
        return parsed
      }
    } catch (err) {
      console.error('❌ Error loading members from localStorage:', err)
    }
    return []
  })

  const [payments, setPayments] = useState<Payment[]>(() => {
    // Initialize from localStorage immediately
    try {
      const saved = localStorage.getItem('app_payments')
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log('✅ Loaded payments from localStorage:', parsed)
        return parsed
      }
    } catch (err) {
      console.error('❌ Error loading payments from localStorage:', err)
    }
    return []
  })

  const [packages, setPackages] = useState<Package[]>(() => {
    // Initialize from localStorage immediately
    try {
      const saved = localStorage.getItem('app_packages')
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log('✅ Loaded packages from localStorage:', parsed)
        return parsed
      }
    } catch (err) {
      console.error('❌ Error loading packages from localStorage:', err)
    }
    return []
  })

  // Persist trainers to localStorage immediately
  useEffect(() => {
    try {
      const data = JSON.stringify(trainers)
      localStorage.setItem('app_trainers', data)
      console.log('💾 Saved trainers to localStorage:', trainers.length, 'items')
    } catch (err) {
      console.error('❌ Error saving trainers to localStorage:', err)
    }
  }, [trainers])

  // Persist sidebar state
  useEffect(() => {
    try {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen))
    } catch (err) {
      console.error('❌ Error saving sidebar state to localStorage:', err)
    }
  }, [sidebarOpen])

  // Persist members to localStorage immediately
  useEffect(() => {
    try {
      const data = JSON.stringify(members)
      localStorage.setItem('app_members', data)
      console.log('💾 Saved members to localStorage:', members.length, 'items')
    } catch (err) {
      console.error('❌ Error saving members to localStorage:', err)
    }
  }, [members])

  // Persist payments to localStorage immediately
  useEffect(() => {
    try {
      const data = JSON.stringify(payments)
      localStorage.setItem('app_payments', data)
      console.log('💾 Saved payments to localStorage:', payments.length, 'items')
    } catch (err) {
      console.error('❌ Error saving payments to localStorage:', err)
    }
  }, [payments])

  // Persist packages to localStorage immediately
  useEffect(() => {
    try {
      const data = JSON.stringify(packages)
      localStorage.setItem('app_packages', data)
      console.log('💾 Saved packages to localStorage:', packages.length, 'items')
    } catch (err) {
      console.error('❌ Error saving packages to localStorage:', err)
    }
  }, [packages])

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

  const addPackage = useCallback((pkg: Package) => {
    setPackages((prev) => [...prev, pkg])
  }, [])

  const updatePackage = useCallback((id: number | string, updatedData: Partial<Package>) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === id ? { ...pkg, ...updatedData } : pkg
      )
    )
  }, [])

  const deletePackage = useCallback((id: number | string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id))
  }, [])

  const value: AppContextType = {
    trainers,
    members,
    payments,
    packages,
    sidebarOpen,
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
    addTrainer,
    updateTrainer,
    deleteTrainer,
    addMember,
    updateMember,
    deleteMember,
    addPayment,
    updatePayment,
    deletePayment,
    addPackage,
    updatePackage,
    deletePackage,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

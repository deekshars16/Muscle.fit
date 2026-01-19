import React, { useState, useEffect } from 'react'
import { Plus, Filter, MoreVertical, Edit, Trash2, X } from 'lucide-react'
import OwnerLayout from '../../components/layout/OwnerLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import userService, { Member } from '../../services/userService'
import { useActivity } from '../../context/ActivityContext'
import { useAppContext } from '../../hooks/useAppContext'

interface MemberUI extends Member {
  initials: string
  color: string
  joinDate: string
  expiryDate: string
  status: 'active' | 'expiring' | 'expired'
}

const MembersPage: React.FC = () => {
  const { addActivity } = useActivity()
  const { members, addMember, updateMember, deleteMember } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [sortType, setSortType] = useState<'date' | 'name' | 'none'>('none')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    plan: 'Basic',
    status: 'active' as 'active' | 'expiring' | 'expired',
    joinDate: '',
    expiryDate: '',
  })

  const colors = ['bg-cyan-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500']

  const getInitials = (firstName: string, lastName?: string): string => {
    return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase()
  }

  const getRandomColor = (): string => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Fetch members from API in background without blocking UI
  useEffect(() => {
    let isMounted = true
    
    const fetchMembers = async () => {
      try {
        setError(null)
        // Only set loading if we don't have data in context yet
        if (members.length === 0) {
          setLoading(true)
        }
        
        const data = await userService.getMembers()
        
        if (!isMounted) return
        
        if (data && data.length > 0) {
          const transformedMembers = data.map((member) => ({
            ...member,
            initials: getInitials(member.first_name, member.last_name),
            color: getRandomColor(),
            joinDate: member.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active' as const,
          }))
          
          // Add members from API only if they don't already exist in context
          transformedMembers.forEach((member) => {
            const exists = (members as any[]).some((m) => m.id === member.id)
            if (!exists) {
              addMember(member as any)
            }
          })
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching members:', err)
          if (members.length === 0) {
            setError('Failed to load members')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Fetch members on initial mount
    const timer = setTimeout(() => {
      fetchMembers()
    }, 0)
    
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  const filteredMembers = (members as any[]).filter((member) =>
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortType === 'name') {
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
    } else if (sortType === 'date') {
      const dateA = new Date(a.created_at || 0)
      const dateB = new Date(b.created_at || 0)
      return dateB.getTime() - dateA.getTime()
    }
    return 0
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'expiring':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'expired':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const handleOpenModal = (memberId?: number) => {
    if (memberId) {
      const member = members.find((m) => m.id === memberId)
      if (member) {
        setFormData({
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          phone: member.phone || '',
          plan: 'Basic',
          status: member.status,
          joinDate: member.joinDate,
          expiryDate: member.expiryDate,
        })
        setEditingId(memberId)
      }
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        plan: 'Basic',
        status: 'active',
        joinDate: '',
        expiryDate: '',
      })
      setEditingId(null)
    }
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSaveMember = async () => {
    if (!formData.first_name || !formData.email) {
      alert('Please fill all required fields')
      return
    }

    try {
      if (editingId) {
        // Edit existing member
        await userService.partialUpdate(editingId, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
        })
        
        updateMember(editingId, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
        } as any)
        
        addActivity('member_edited', `Edited member ${formData.first_name} ${formData.last_name}`, `Email: ${formData.email}`)
      } else {
        // Add new member - Try API first, fallback to context
        try {
          const newMemberData = await userService.create({
            username: formData.email.split('@')[0],
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            password: 'DefaultPass@123',
            role: 'member',
          })
          
          const newMemberUI: MemberUI = {
            ...newMemberData,
            initials: getInitials(formData.first_name, formData.last_name),
            color: getRandomColor(),
            joinDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active',
          }
          addMember(newMemberUI as any)
          addActivity('member_added', `Added new member ${formData.first_name} ${formData.last_name}`, `Email: ${formData.email}`)
        } catch (apiErr) {
          // Fallback - add locally through context
          console.log('API failed, adding locally')
          const localMember: MemberUI = {
            id: Math.floor(Math.random() * 10000),
            username: formData.email.split('@')[0],
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone || '',
            role: 'member',
            is_active: true,
            created_at: new Date().toISOString(),
            initials: getInitials(formData.first_name, formData.last_name),
            color: getRandomColor(),
            joinDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active',
          }
          addMember(localMember as any)
          addActivity('member_added', `Added new member ${formData.first_name} ${formData.last_name}`, `Email: ${formData.email}`)
        }
      }
      handleCloseModal()
    } catch (err: any) {
      console.error('Error saving member:', err)
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to save member'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleDeleteMember = async (memberId: number | string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        const memberToDelete = (members as any[]).find((m) => m.id === memberId)
        await userService.delete(memberId)
        deleteMember(memberId)
        if (memberToDelete) {
          addActivity('member_deleted', `Deleted member ${memberToDelete.first_name} ${memberToDelete.last_name}`, `Email: ${memberToDelete.email}`, memberToDelete)
        }
        setOpenMenuId(null)
      } catch (err) {
        console.error('Error deleting member:', err)
        // Still delete locally even if API fails
        deleteMember(memberId)
      }
    }
  }

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </OwnerLayout>
    )
  }

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Members</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage gym members</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Member
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Sort
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                <button
                  onClick={() => {
                    setSortType('none')
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg ${
                    sortType === 'none'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  No Sort
                </button>
                <button
                  onClick={() => {
                    setSortType('name')
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium border-t border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    sortType === 'name'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Sort by Name (A-Z)
                </button>
                <button
                  onClick={() => {
                    setSortType('date')
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium border-t border-gray-200 dark:border-gray-600 last:rounded-b-lg hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    sortType === 'date'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Sort by Join Date (Newest)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Member</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Plan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedMembers.length > 0 ? (
                  sortedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`${member.color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold`}>
                            {member.initials}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{member.first_name} {member.last_name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Premium</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {getStatusLabel(member.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{member.joinDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{member.expiryDate}</td>
                      <td className="px-6 py-4 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        {openMenuId === member.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                            <button
                              onClick={() => handleOpenModal(member.id as number)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id as number)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Member' : 'Add New Member'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Enter first name"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Enter last name"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveMember}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                >
                  {editingId ? 'Update Member' : 'Add Member'}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  )
}

export default MembersPage

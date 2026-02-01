import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BarChart3, Users, Settings, Bell, Dumbbell, Plus, MoreVertical, Filter, ChevronDown } from 'lucide-react'
import TrainerLayout from '../../components/layout/TrainerLayout'
import { useAppContext } from '../../hooks/useAppContext'

const TrainerClients: React.FC = () => {
  const navigate = useNavigate()
  const { members } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'name' | 'joinDate' | 'expiryDate'>('name')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const filteredClients = useMemo(() => {
    const filtered = members.filter(member =>
      `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort the filtered results
    if (sortOption === 'name') {
      return filtered.sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase()
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase()
        return nameA.localeCompare(nameB)
      })
    } else if (sortOption === 'joinDate') {
      return filtered.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA // Most recent first
      })
    } else if (sortOption === 'expiryDate') {
      return filtered.sort((a, b) => {
        const dateA = new Date(a.expiryDate || '9999-12-31').getTime()
        const dateB = new Date(b.expiryDate || '9999-12-31').getTime()
        return dateA - dateB // Earliest expiry first
      })
    }

    return filtered
  }, [members, searchTerm, sortOption])

  const getInitials = (firstName: string, lastName?: string) => {
    return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase()
  }

  return (
    <TrainerLayout>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Members</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your members</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showSortMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setSortOption('name')
                      setShowSortMenu(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                      sortOption === 'name' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className={sortOption === 'name' ? '✓' : ''}>Sort by Name</span>
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('joinDate')
                      setShowSortMenu(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 border-t border-gray-300 dark:border-gray-600 ${
                      sortOption === 'joinDate' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className={sortOption === 'joinDate' ? '✓' : ''}>Sort by Join Date</span>
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('expiryDate')
                      setShowSortMenu(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 border-t border-gray-300 dark:border-gray-600 ${
                      sortOption === 'expiryDate' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className={sortOption === 'expiryDate' ? '✓' : ''}>Sort by Expiry Date</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div key={client.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  {/* Header with avatar and status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(client.first_name, client.last_name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{client.first_name} {client.last_name}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          client.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                        }`}>
                          {client.is_active ? 'active' : 'inactive'}
                        </span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span>✉️</span>
                      <span className="truncate">{client.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span>📱</span>
                      {client.phone || 'N/A'}
                    </p>
                  </div>

                  {/* Join Date and Expiry Date */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Joined {client.joinDate || new Date(client.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Expires {client.expiryDate || 'N/A'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No members found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
    </TrainerLayout>
  )
}
  
export default TrainerClients

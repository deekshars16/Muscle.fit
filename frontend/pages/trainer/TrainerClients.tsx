import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BarChart3, Users, Settings, Bell, Dumbbell, Plus, MoreVertical, Filter } from 'lucide-react'
import TrainerLayout from '../../components/layout/TrainerLayout'

const TrainerClients: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const clients = [
    { id: 1, name: 'Jennifer Wilson', email: 'jennifer@email.com', phone: '+1 234 567 890', program: 'Weight Loss', progress: 75, status: 'active', joinDate: 'Jan 15, 2024' },
    { id: 2, name: 'David Brown', email: 'david@email.com', phone: '+1 234 567 891', program: 'Muscle Gain', progress: 60, status: 'active', joinDate: 'Feb 20, 2024' },
    { id: 3, name: 'Lisa Anderson', email: 'lisa@email.com', phone: '+1 234 567 892', program: 'Flexibility', progress: 90, status: 'active', joinDate: 'Mar 10, 2024' },
    { id: 4, name: 'Robert Taylor', email: 'robert@email.com', phone: '+1 234 567 893', program: 'Cardio', progress: 45, status: 'inactive', joinDate: 'Dec 5, 2023' },
    { id: 5, name: 'Sarah Miller', email: 'sarah@email.com', phone: '+1 234 567 894', program: 'Weight Loss Pro', progress: 85, status: 'active', joinDate: 'Jan 28, 2024' },
    { id: 6, name: 'Mike Johnson', email: 'mike@email.com', phone: '+1 234 567 895', program: 'Strength Building', progress: 30, status: 'active', joinDate: 'Apr 1, 2024' },
  ]

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <TrainerLayout>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your client base</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Client
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                {/* Header with avatar and status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(client.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        client.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                      }`}>
                        {client.status}
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
                    {client.phone}
                  </p>
                </div>

                {/* Program and Progress */}
                <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{client.program}</p>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: `${client.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white ml-3">{client.progress}%</span>
                  </div>
                </div>

                {/* Join Date */}
                <p className="text-xs text-gray-500 dark:text-gray-500">Joined {client.joinDate}</p>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredClients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No clients found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          )}
    </TrainerLayout>
  )
}
  
export default TrainerClients

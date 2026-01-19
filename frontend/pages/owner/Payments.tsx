import React, { useState, useEffect } from 'react'
import { Download, Plus, X, Calendar, ChevronDown, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import OwnerLayout from '../../components/layout/OwnerLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import paymentService, { Payment as BackendPayment } from '../../services/paymentService'
import trainerService from '../../services/trainerService'
import userService from '../../services/userService'
import { useAppContext } from '../../hooks/useAppContext'
import { useActivity } from '../../context/ActivityContext'

interface PaymentUI extends BackendPayment {
  displayName: string
  displayRole: string
}

const PaymentsPage: React.FC = () => {
  const { payments, addPayment, updatePayment, deletePayment, trainers, members } = useAppContext()
  const { addActivity } = useActivity()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localTrainers, setLocalTrainers] = useState<any[]>([])
  const [localMembers, setLocalMembers] = useState<any[]>([])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    gym_role: 'member' as 'trainer' | 'member',
    selectedPerson: null as any,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    dateType: 'manual' as 'manual' | 'calendar',
    method: 'UPI' as 'UPI' | 'Card' | 'Cash',
    status: 'completed' as 'completed' | 'pending' | 'failed',
  })

  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [showMethodDropdown, setShowMethodDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showPersonDropdown, setShowPersonDropdown] = useState(false)
  const [searchPerson, setSearchPerson] = useState('')

  // Fetch additional trainer/member data on mount in background (context data used immediately)
  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      try {
        setError(null)
        // Don't set loading - use context data immediately

        const [trainersData, membersData] = await Promise.all([
          trainerService.getAll().catch(() => []),
          userService.getMembers().catch(() => []),
        ])

        if (!isMounted) return

        setLocalTrainers(trainersData)
        setLocalMembers(membersData)
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data:', err)
          // Don't show error - context data is available
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    const timer = setTimeout(() => {
      fetchData()
    }, 0)
    
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  const filteredPayments = (payments as any[]).filter((payment) =>
    payment.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getNextPaymentId = () => {
    const maxId = Math.max(
      0,
      ...(payments as any[]).map((p) => {
        const num = parseInt(p.id.replace('PAY', ''))
        return isNaN(num) ? 0 : num
      })
    )
    return `PAY${String(maxId + 1).padStart(3, '0')}`
  }

  const getAvailablePeople = () => {
    const trainerList = localTrainers.length > 0 ? localTrainers : (trainers as any[])
    const memberList = localMembers.length > 0 ? localMembers : (members as any[])
    
    if (formData.gym_role === 'trainer') {
      return trainerList.map(t => ({ ...t, name: `${t.first_name} ${t.last_name}`, role: 'Trainer' })).filter((t) =>
        t.name.toLowerCase().includes(searchPerson.toLowerCase())
      )
    } else {
      return memberList.map(m => ({ ...m, name: `${m.first_name} ${m.last_name}`, role: 'Member' })).filter((m) =>
        m.name.toLowerCase().includes(searchPerson.toLowerCase())
      )
    }
  }

  const handleAddPayment = () => {
    if (!formData.selectedPerson || !formData.amount || !formData.date || !formData.method) {
      alert('Please fill in all fields')
      return
    }

    const personName = formData.selectedPerson.first_name ? `${formData.selectedPerson.first_name} ${formData.selectedPerson.last_name}` : formData.selectedPerson.name

    if (editingId) {
      // Update existing payment
      updatePayment(editingId, {
        user_name: personName,
        user_role: formData.gym_role,
        amount: parseFloat(formData.amount),
        date: formData.date,
        method: formData.method,
        status: formData.status,
      } as any)
      addActivity('payment_edited', `Updated payment for ${personName}`, `Amount: ₹${formData.amount} | Status: ${formData.status}`)
    } else {
      // Add new payment
      const newPayment: any = {
        id: getNextPaymentId(),
        user_name: personName,
        user_role: formData.gym_role,
        amount: parseFloat(formData.amount),
        date: formData.date,
        method: formData.method,
        status: formData.status,
      }

      addPayment(newPayment)
      addActivity('payment_added', `Added payment for ${personName}`, `Amount: ₹${formData.amount} | Method: ${formData.method}`)
    }

    resetForm()
    setShowModal(false)
  }

  const handleEditPayment = (payment: PaymentUI) => {
    setEditingId(payment.id)
    const allPeople = [
      ...trainers.map(t => ({ ...t, name: `${t.first_name} ${t.last_name}` })),
      ...members.map(m => ({ ...m, name: `${m.first_name} ${m.last_name}` }))
    ]
    const person = allPeople.find((p) => p.name === payment.displayName)
    setFormData({
      gym_role: payment.displayRole === 'Trainer' ? 'trainer' : 'member',
      selectedPerson: person || null,
      amount: payment.amount.toString(),
      date: payment.date,
      dateType: 'calendar',
      method: payment.method as 'UPI' | 'Card' | 'Cash',
      status: payment.status as 'completed' | 'pending' | 'failed',
    })
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleDeletePayment = (id: string) => {
    const payment = (payments as any[]).find(p => p.id === id)
    if (confirm('Are you sure you want to delete this payment?')) {
      deletePayment(id)
      if (payment) {
        addActivity('payment_deleted', `Deleted payment for ${payment.user_name}`, `Amount: ₹${payment.amount}`)
      }
      setOpenMenuId(null)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      gym_role: 'member',
      selectedPerson: null,
      amount: '',
      date: new Date().toISOString().split('T')[0],
      dateType: 'manual',
      method: 'UPI',
      status: 'completed',
    })
    setSearchPerson('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
    }
  }

  const getStatusColorFull = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600'
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'failed':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)
  const failedAmount = payments
    .filter((p) => p.status === 'failed')
    .reduce((sum, p) => sum + p.amount, 0)

  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf')
    await import('jspdf-autotable')

    const doc = new jsPDF()
    const tableData = payments.map((p) => [
      p.id,
      p.user_name,
      `₹${p.amount.toLocaleString()}`,
      p.date,
      p.method,
      p.status.charAt(0).toUpperCase() + p.status.slice(1),
    ])

    ;(doc as any).autoTable({
      head: [['ID', 'Name', 'Amount', 'Date', 'Method', 'Status']],
      body: tableData,
      startY: 20,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: '#8B5CF6',
        textColor: '#fff',
        fontStyle: 'bold',
      },
    })

    doc.text('MUSCLES.FIT - Payment Records', 14, 15)
    doc.save('payments.pdf')
  }

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track fees & transactions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Payment
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-2">+12% this month</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Pending</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{pendingAmount.toLocaleString()}</p>
            <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">
              {payments.filter((p) => p.status === 'pending').length} payments
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Failed</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{failedAmount.toLocaleString()}</p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              {payments.filter((p) => p.status === 'failed').length} this week
            </p>
          </div>
        </div>

        {/* Add/Edit Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Payment' : 'Add Payment'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <form className="space-y-4">
                {/* Payment ID (Auto) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment ID
                  </label>
                  <input
                    type="text"
                    value={editingId || getNextPaymentId()}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Gym Role */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gym Role
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white flex items-center justify-between focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                      >
                        {formData.gym_role === 'member' ? 'Member' : 'Trainer'}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showRoleDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                          {['Member', 'Trainer'].map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, gym_role: role.toLowerCase() as 'trainer' | 'member', selectedPerson: null })
                                setShowRoleDropdown(false)
                                setSearchPerson('')
                              }}
                              className={`w-full text-left px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                                formData.gym_role === role.toLowerCase()
                                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                                  : 'text-gray-900 dark:text-gray-300'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Person */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {formData.gym_role === 'trainer' ? 'Trainer' : 'Member'}
                    </label>
                    {formData.selectedPerson ? (
                      <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-600 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{formData.selectedPerson.name || `${formData.selectedPerson.first_name} ${formData.selectedPerson.last_name}`}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{formData.selectedPerson.role || (formData.gym_role === 'trainer' ? 'Trainer' : 'Member')}</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={`Search ${formData.gym_role}...`}
                          value={searchPerson}
                          onChange={(e) => setSearchPerson(e.target.value)}
                          onFocus={() => setShowPersonDropdown(true)}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                        />
                        {showPersonDropdown && getAvailablePeople().length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                            {getAvailablePeople().map((person) => (
                              <button
                                key={person.id}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, selectedPerson: person })
                                  setShowPersonDropdown(false)
                                  setSearchPerson('')
                                }}
                                className="w-full text-left px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              >
                                <p className="font-medium text-gray-900 dark:text-white">{person.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{person.role}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Type
                    </label>
                    <div className="flex gap-2">
                      {['manual', 'calendar'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, dateType: type as 'manual' | 'calendar' })}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            formData.dateType === type
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {type === 'manual' ? 'Manual' : 'Calendar'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    {formData.dateType === 'manual' ? (
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="e.g., Jan 10, 2024"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                      />
                    ) : (
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                      />
                    )}
                  </div>
                </div>

                {/* Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Method
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowMethodDropdown(!showMethodDropdown)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white flex items-center justify-between focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                    >
                      {formData.method}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showMethodDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                        {['UPI', 'Card', 'Cash'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, method: method as 'UPI' | 'Card' | 'Cash' })
                              setShowMethodDropdown(false)
                            }}
                            className={`w-full text-left px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                              formData.method === method
                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                                : 'text-gray-900 dark:text-gray-300'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: 'completed', label: 'Completed', color: 'bg-green-500 hover:bg-green-600' },
                      { value: 'pending', label: 'Pending', color: 'bg-yellow-500 hover:bg-yellow-600' },
                      { value: 'failed', label: 'Failed', color: 'bg-red-500 hover:bg-red-600' },
                    ].map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: status.value as 'completed' | 'pending' | 'failed' })}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                          formData.status === status.value ? status.color : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                  >
                    {editingId ? 'Update Payment' : 'Add Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
          />
        </div>

        {/* Payments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Method</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{payment.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{payment.role}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">₹{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{payment.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{payment.method}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === payment.id ? null : payment.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Actions"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      {openMenuId === payment.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => handleEditPayment(payment)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OwnerLayout>
  )
}

export default PaymentsPage

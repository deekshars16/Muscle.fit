import React, { useState, useEffect } from 'react'
import { Plus, Filter } from 'lucide-react'
import OwnerLayout from '../../components/layout/OwnerLayout'
import PackageTable from '../../components/common/PackageTable'
import CreatePackageModal from '../../components/common/CreatePackageModal'
import { useAppContext } from '../../hooks/useAppContext'
import { Package } from '../../context/AppContext'
import { useActivity } from '../../context/ActivityContext'

const PackagesPage: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage } = useAppContext()
  const { addActivity } = useActivity()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [filterType, setFilterType] = useState<'All' | 'Gym' | 'PT' | 'Classes'>('All')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Draft' | 'Disabled'>('All')

  // Initialize with mock data if no packages exist
  useEffect(() => {
    if (packages.length === 0) {
      const mockPackages: Package[] = [
        {
          id: 1,
          name: 'Gold Membership',
          type: 'Gym',
          description: 'Premium gym access with all facilities',
          mrp: 3000,
          sellingPrice: 2250,
          discountType: 'Percentage',
          discountValue: 25,
          finalPrice: 2250,
          validityNumber: 1,
          validityUnit: 'Months',
          startRule: 'From purchase',
          features: ['Gym Access', 'Equipment Usage', 'Locker Facility', 'Basic Support'],
          thumbnailUrl: '',
          videoUrl: '',
          status: 'Active',
          createdAt: new Date('2026-01-18').toISOString(),
        },
        {
          id: 2,
          name: 'Quarterly Gym Plan',
          type: 'Gym',
          description: 'Get 3 months of unrestricted gym access',
          mrp: 10000,
          sellingPrice: 8000,
          discountType: 'Flat',
          discountValue: 2000,
          finalPrice: 8000,
          validityNumber: 3,
          validityUnit: 'Months',
          startRule: 'From purchase',
          features: [
            'Gym Access',
            'Equipment Usage',
            'Priority Support',
            'Monthly Assessment',
            'Guest Pass',
          ],
          thumbnailUrl: '',
          videoUrl: '',
          status: 'Draft',
          createdAt: new Date('2026-01-17').toISOString(),
        },
        {
          id: 3,
          name: 'PT 12 Sessions',
          type: 'PT',
          description: 'Personal training with expert trainers',
          mrp: 10000,
          sellingPrice: 10000,
          discountType: 'Percentage',
          discountValue: 17,
          finalPrice: 8300,
          validityNumber: 12,
          validityUnit: 'Months',
          startRule: 'From first check-in',
          features: [
            '12 PT Sessions',
            '1-on-1 Training',
            'Customized Workout Plan',
            'Progress Tracking',
            'Nutrition Guide',
          ],
          thumbnailUrl: '',
          videoUrl: '',
          status: 'Active',
          createdAt: new Date('2026-01-16').toISOString(),
        },
        {
          id: 4,
          name: 'Trial 7 Days',
          type: 'Classes',
          description: 'Free trial to explore all classes',
          mrp: 0,
          sellingPrice: 0,
          discountType: 'Flat',
          discountValue: 0,
          finalPrice: 0,
          validityNumber: 7,
          validityUnit: 'Days',
          startRule: 'From purchase',
          features: ['All Classes', 'Group Sessions', 'Facility Access', 'Instructor Support'],
          thumbnailUrl: '',
          videoUrl: '',
          status: 'Active',
          createdAt: new Date('2026-01-15').toISOString(),
        },
        {
          id: 5,
          name: 'Yoga Unlimited',
          type: 'Classes',
          description: 'Unlimited yoga sessions',
          mrp: 5500,
          sellingPrice: 5500,
          discountType: 'Flat',
          discountValue: 500,
          finalPrice: 5000,
          validityNumber: 1,
          validityUnit: 'Months',
          startRule: 'From purchase',
          features: ['Unlimited Yoga', 'Meditation Sessions', 'Personalized Guidance'],
          thumbnailUrl: '',
          videoUrl: '',
          status: 'Draft',
          createdAt: new Date('2026-01-14').toISOString(),
        },
      ]

      mockPackages.forEach((pkg) => addPackage(pkg))
    }
  }, [packages.length, addPackage])

  const filteredPackages = packages
    .filter((pkg) => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'All' || pkg.type === filterType
      const matchesStatus = filterStatus === 'All' || pkg.status === filterStatus
      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleOpenModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg)
    } else {
      setEditingPackage(null)
    }
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleSavePackage = (pkg: Package) => {
    if (editingPackage) {
      updatePackage(pkg.id, pkg)
      addActivity('package_edited', `Updated package: ${pkg.name}`, `Status: ${pkg.status}`)
    } else {
      addPackage(pkg)
      addActivity('package_created', `Created new package: ${pkg.name}`, `Type: ${pkg.type}`)
    }
    setEditingPackage(null)
    setShowModal(false)
  }

  const handleDeletePackage = (id: number | string) => {
    const pkg = packages.find((p) => p.id === id)
    if (confirm(`Are you sure you want to delete "${pkg?.name}"?`)) {
      deletePackage(id)
      addActivity('package_deleted', `Deleted package: ${pkg?.name}`, undefined, pkg)
    }
  }

  const handleClonePackage = (pkg: Package) => {
    const clonedPackage: Package = {
      ...pkg,
      id: Date.now(),
      name: `${pkg.name} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
    }
    addPackage(clonedPackage)
    addActivity('package_cloned', `Cloned package: ${pkg.name} → ${clonedPackage.name}`)
  }

  const handleToggleStatus = (id: number | string, newStatus: 'Active' | 'Draft' | 'Disabled') => {
    const pkg = packages.find((p) => p.id === id)
    if (pkg) {
      updatePackage(id, { ...pkg, status: newStatus })
      addActivity(
        'package_status_changed',
        `Changed package status: ${pkg.name}`,
        `New status: ${newStatus}`
      )
    }
  }

  const packageStats = {
    total: packages.length,
    active: packages.filter((p) => p.status === 'Active').length,
    draft: packages.filter((p) => p.status === 'Draft').length,
    gym: packages.filter((p) => p.type === 'Gym').length,
    pt: packages.filter((p) => p.type === 'PT').length,
    classes: packages.filter((p) => p.type === 'Classes').length,
  }

  return (
    <OwnerLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Packages</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage gym membership packages</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create Package
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Total Packages
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {packageStats.total}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Active
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              {packageStats.active}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Drafts
            </p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-2">
              {packageStats.draft}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Gym Plans
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {packageStats.gym}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              PT/Classes
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {packageStats.pt + packageStats.classes}
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search packages…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <Filter className="w-4 h-4" />
              Sort
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 top-12 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20 min-w-max">
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase mb-2">
                      Type
                    </p>
                    <div className="space-y-1">
                      {['All', 'Gym', 'PT', 'Classes'].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={filterType === (type as any)}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="w-4 h-4 text-purple-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-600" />

                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase mb-2">
                      Status
                    </p>
                    <div className="space-y-1">
                      {['All', 'Active', 'Draft', 'Disabled'].map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={filterStatus === (status as any)}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="w-4 h-4 text-purple-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Packages Table */}
        <PackageTable
          packages={filteredPackages}
          onEdit={handleOpenModal}
          onClone={handleClonePackage}
          onDelete={handleDeletePackage}
          onToggleStatus={handleToggleStatus}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
        />
      </div>

      {/* Create/Edit Modal */}
      <CreatePackageModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingPackage(null)
        }}
        onSave={handleSavePackage}
        editingPackage={editingPackage}
      />
    </OwnerLayout>
  )
}

export default PackagesPage

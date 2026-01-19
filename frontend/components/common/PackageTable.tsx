import React from 'react'
import { MoreVertical, Edit, Copy, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { Package } from '../../context/AppContext'

interface PackageTableProps {
  packages: Package[]
  onEdit: (pkg: Package) => void
  onClone: (pkg: Package) => void
  onDelete: (id: number | string) => void
  onToggleStatus: (id: number | string, newStatus: 'Active' | 'Draft' | 'Disabled') => void
  openMenuId: number | string | null
  setOpenMenuId: (id: number | string | null) => void
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  onEdit,
  onClone,
  onDelete,
  onToggleStatus,
  openMenuId,
  setOpenMenuId,
}) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  const getValidityLabel = (num: number, unit: 'Days' | 'Months') => {
    return `${num} ${unit}`
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
              Package Name
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
              Type
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
              Price
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
              Discount
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
              Validity
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
              Status
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
              Created Date
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {packages.map((pkg) => (
            <tr
              key={pkg.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {pkg.name}
                {pkg.description && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {pkg.description}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                  {pkg.type}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(pkg.finalPrice)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(pkg.mrp)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {pkg.discountType === 'Flat' ? (
                  <span>{formatPrice(pkg.discountValue)}</span>
                ) : (
                  <span>{pkg.discountValue}%</span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {getValidityLabel(pkg.validityNumber, pkg.validityUnit)}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={pkg.status} />
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {new Date(pkg.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === pkg.id ? null : pkg.id)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {openMenuId === pkg.id && (
                  <div className="absolute right-0 top-12 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20 min-w-40">
                    <button
                      onClick={() => {
                        onEdit(pkg)
                        setOpenMenuId(null)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 border-b border-gray-100 dark:border-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onClone(pkg)
                        setOpenMenuId(null)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 border-b border-gray-100 dark:border-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                      Clone
                    </button>
                    <button
                      onClick={() => {
                        onDelete(pkg.id)
                        setOpenMenuId(null)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
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

      {packages.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No packages found. Create your first package to get started.</p>
        </div>
      )}
    </div>
  )
}

export default PackageTable

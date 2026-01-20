import React, { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Info, Tag, Calendar, List, Image, Eye, Check } from 'lucide-react'
import { Package } from '../../context/AppContext'

interface CreatePackageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pkg: Package) => void
  editingPackage?: Package | null
}

interface FormData {
  name: string
  type: 'Gym' | 'PT' | 'Classes'
  description: string
  status: 'Active' | 'Draft' | 'Disabled'
  mrp: number
  sellingPrice: number
  discountType: 'Flat' | 'Percentage'
  discountValue: number
  validityNumber: number
  validityUnit: 'Days' | 'Months'
  startRule: 'From purchase' | 'From first check-in'
  features: string[]
  thumbnailUrl: string
  videoUrl: string
}

const TEMPLATES = {
  monthlyGym: {
    name: 'Monthly Gym Plan',
    type: 'Gym',
    description: 'Complete gym access for 30 days',
    status: 'Active',
    mrp: 3000,
    sellingPrice: 2250,
    discountType: 'Percentage',
    discountValue: 25,
    validityNumber: 1,
    validityUnit: 'Months',
    startRule: 'From purchase',
    features: ['Gym Access', 'Equipment Usage', 'Basic Support'],
    thumbnailUrl: '',
    videoUrl: '',
  },
  quarterlyGym: {
    name: 'Quarterly Gym Plan',
    type: 'Gym',
    description: 'Complete gym access for 3 months',
    status: 'Active',
    mrp: 10000,
    sellingPrice: 8000,
    discountType: 'Flat',
    discountValue: 2000,
    validityNumber: 3,
    validityUnit: 'Months',
    startRule: 'From purchase',
    features: ['Gym Access', 'Equipment Usage', 'Priority Support', 'Monthly Assessment'],
    thumbnailUrl: '',
    videoUrl: '',
  },
  pt12Sessions: {
    name: 'PT 12 Sessions',
    type: 'PT',
    description: 'Personal training with 12 sessions',
    status: 'Active',
    mrp: 10000,
    sellingPrice: 10000,
    discountType: 'Percentage',
    discountValue: 17,
    validityNumber: 12,
    validityUnit: 'Months',
    startRule: 'From first check-in',
    features: ['12 PT Sessions', '1-on-1 Training', 'Customized Plan', 'Progress Tracking'],
    thumbnailUrl: '',
    videoUrl: '',
  },
  trial7Days: {
    name: 'Trial 7 Days',
    type: 'Classes',
    description: 'Try our classes for 7 days free',
    status: 'Active',
    mrp: 0,
    sellingPrice: 0,
    discountType: 'Flat',
    discountValue: 0,
    validityNumber: 7,
    validityUnit: 'Days',
    startRule: 'From purchase',
    features: ['All Classes', 'Group Sessions', 'Facility Access'],
    thumbnailUrl: '',
    videoUrl: '',
  },
}

const CreatePackageModal: React.FC<CreatePackageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPackage,
}) => {
  const [step, setStep] = useState(1)
  const [templateSelected, setTemplateSelected] = useState(false)
  const [formData, setFormData] = useState<FormData>(
    editingPackage
      ? {
          name: editingPackage.name,
          type: editingPackage.type,
          description: editingPackage.description || '',
          status: editingPackage.status,
          mrp: editingPackage.mrp,
          sellingPrice: editingPackage.sellingPrice,
          discountType: editingPackage.discountType,
          discountValue: editingPackage.discountValue,
          validityNumber: editingPackage.validityNumber,
          validityUnit: editingPackage.validityUnit,
          startRule: editingPackage.startRule,
          features: editingPackage.features || [],
          thumbnailUrl: editingPackage.thumbnailUrl || '',
          videoUrl: editingPackage.videoUrl || '',
        }
      : {
          name: '',
          type: 'Gym',
          description: '',
          status: 'Draft',
          mrp: 0,
          sellingPrice: 0,
          discountType: 'Percentage',
          discountValue: 0,
          validityNumber: 1,
          validityUnit: 'Months',
          startRule: 'From purchase',
          features: [],
          thumbnailUrl: '',
          videoUrl: '',
        }
  )

  const [newFeature, setNewFeature] = useState('')

  if (!isOpen) return null

  const calculateFinalPrice = () => {
    if (formData.discountType === 'Flat') {
      return Math.max(0, formData.sellingPrice - formData.discountValue)
    } else {
      return Math.max(0, formData.sellingPrice - (formData.sellingPrice * formData.discountValue) / 100)
    }
  }

  const applyTemplate = (templateKey: string) => {
    const template = TEMPLATES[templateKey as keyof typeof TEMPLATES]
    if (template) {
      setFormData({
        name: template.name,
        type: template.type as 'Gym' | 'PT' | 'Classes',
        description: template.description,
        status: template.status as 'Active' | 'Draft' | 'Disabled',
        mrp: template.mrp,
        sellingPrice: template.sellingPrice,
        discountType: template.discountType as 'Flat' | 'Percentage',
        discountValue: template.discountValue,
        validityNumber: template.validityNumber,
        validityUnit: template.validityUnit as 'Days' | 'Months',
        startRule: template.startRule as 'From purchase' | 'From first check-in',
        features: template.features,
        thumbnailUrl: template.thumbnailUrl,
        videoUrl: template.videoUrl,
      })
      setTemplateSelected(true)
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Package name is required')
      return
    }

    if (formData.mrp <= 0) {
      alert('MRP must be greater than 0')
      return
    }

    if (formData.sellingPrice <= 0) {
      alert('Selling price must be greater than 0')
      return
    }

    if (formData.validityNumber <= 0) {
      alert('Validity must be greater than 0')
      return
    }

    const finalPrice = calculateFinalPrice()

    const newPackage: Package = {
      id: editingPackage?.id || Date.now(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      status: formData.status,
      mrp: formData.mrp,
      sellingPrice: formData.sellingPrice,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      finalPrice,
      validityNumber: formData.validityNumber,
      validityUnit: formData.validityUnit,
      startRule: formData.startRule,
      features: formData.features,
      thumbnailUrl: formData.thumbnailUrl,
      videoUrl: formData.videoUrl,
      createdAt: editingPackage?.createdAt || new Date().toISOString(),
    }

    onSave(newPackage)
    onClose()
  }

  const finalPrice = calculateFinalPrice()

  const STEP_ICONS = [Info, Tag, Calendar, List, Image, Eye]

  // Step 0: Template Selection
  if (!templateSelected && step === 1 && !editingPackage) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a Template</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(TEMPLATES).map(([key, template]) => (
              <div
                key={key}
                onClick={() => applyTemplate(key)}
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{template.sellingPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                    {template.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => setTemplateSelected(true)}
              className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Create Without Template
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Wizard Steps
  const totalSteps = 6

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with stepper */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingPackage ? 'Edit Package' : 'Create Package'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center w-full">
              {['Basic Info', 'Pricing', 'Validity', 'Features', 'Media', 'Preview'].map(
                (label, idx) => {
                  const s = idx + 1
                  const isActive = step === s
                  const isCompleted = step > s
                  const IconComp = STEP_ICONS[idx]
                  const connectorActive = step > s
                  return (
                    <React.Fragment key={label}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setStep(s)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setStep(s)
                        }}
                        className="flex flex-col items-center w-24 cursor-pointer select-none"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            isCompleted || isActive
                              ? 'bg-purple-500 text-white'
                              : 'border border-gray-300 text-gray-600 bg-white'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <IconComp className="w-4 h-4 text-current" />
                          )}
                        </div>
                        <div className={`mt-2 text-xs ${isActive ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
                          {label}
                        </div>
                      </div>

                      {idx < totalSteps - 1 && (
                        <div
                          key={`conn-${idx}`}
                          className={`flex-1 h-px my-4 ${connectorActive ? 'bg-purple-500' : 'bg-gray-200'}`}
                        />
                      )}
                    </React.Fragment>
                  )
                }
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[300px]">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., Gold Membership"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Package Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as 'Gym' | 'PT' | 'Classes' })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  >
                    <option>Gym</option>
                    <option>PT</option>
                    <option>Classes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'Active' | 'Draft' | 'Disabled',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  >
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Disabled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Brief description of the package"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Pricing */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    MRP (Original Price) *
                  </label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, sellingPrice: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'Flat' | 'Percentage',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  >
                    <option>Flat</option>
                    <option>Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Discount Value
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({ ...formData, discountValue: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      {formData.discountType === 'Flat' ? '₹' : '%'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Final Price:</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ₹{finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Validity */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Validity Number *
                  </label>
                  <input
                    type="number"
                    value={formData.validityNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, validityNumber: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Validity Unit *
                  </label>
                  <select
                    value={formData.validityUnit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validityUnit: e.target.value as 'Days' | 'Months',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  >
                    <option>Days</option>
                    <option>Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  When does validity start?
                </label>
                <select
                  value={formData.startRule}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startRule: e.target.value as 'From purchase' | 'From first check-in',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                >
                  <option>From purchase</option>
                  <option>From first check-in</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Features */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddFeature()
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Add a feature..."
                />
                <button
                  onClick={handleAddFeature}
                  className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${
                    step === 4 ? 'bg-purple-500 hover:bg-purple-600' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {formData.features.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    No features added yet. Add features to highlight package benefits.
                  </p>
                ) : (
                  formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-gray-900 dark:text-white">{feature}</span>
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 5: Media */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Promo Video URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {formData.thumbnailUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Preview:</p>
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail"
                    className="max-w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/300x120?text=Image+Not+Found'
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 6: Preview */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {formData.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {formData.description}
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                    {formData.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Validity</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formData.validityNumber} {formData.validityUnit}
                    </p>
                  </div>
                </div>

                {formData.features.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Features:
                    </p>
                    <ul className="space-y-1">
                      {formData.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                      {formData.features.length > 3 && (
                        <li className="text-sm text-gray-600 dark:text-gray-400">
                          +{formData.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-6 flex gap-3 justify-end">
          <button
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Save Package
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreatePackageModal

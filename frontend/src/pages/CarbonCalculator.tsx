import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { carbonAPI } from '../services/api'
import { 
  HomeIcon, 
  TruckIcon, 
  BoltIcon, 
  DropletIcon,
  FireIcon,
  TrashIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { Pie, Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface CarbonEntry {
  id: number
  category: string
  subcategory: string
  value: number
  unit: string
  co2_calculated: number
  date: string
  notes: string
}

const CarbonCalculator: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'domestic' | 'transportation'>('domestic')
  const [entries, setEntries] = useState<CarbonEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<any>(null)

  // Form states
  const [formData, setFormData] = useState({
    category: 'DOMESTIC',
    subcategory: 'ELECTRICITY',
    value: '',
    unit: 'kWh',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const domesticCategories = [
    { value: 'ELECTRICITY', label: 'Electricity', unit: 'kWh', icon: BoltIcon, factor: 0.4 },
    { value: 'WATER', label: 'Water', unit: 'liters', icon: DropletIcon, factor: 0.0003 },
    { value: 'NATURAL_GAS', label: 'Natural Gas', unit: 'cubic meters', icon: FireIcon, factor: 0.2 },
    { value: 'WASTE', label: 'Waste', unit: 'kg', icon: TrashIcon, factor: 0.5 },
  ]

  const transportationCategories = [
    { value: 'CAR', label: 'Car', unit: 'km', icon: TruckIcon, factor: 0.2 },
    { value: 'MOTORCYCLE', label: 'Motorcycle/Bike', unit: 'km', icon: TruckIcon, factor: 0.1 },
    { value: 'PUBLIC_TRANSIT', label: 'Public Transit', unit: 'km', icon: TruckIcon, factor: 0.05 },
    { value: 'FLIGHT', label: 'Flight', unit: 'km', icon: TruckIcon, factor: 0.285 },
  ]

  useEffect(() => {
    fetchEntries()
    fetchSummary()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await carbonAPI.getEntries()
      setEntries(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching entries:', error)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await carbonAPI.getSummary()
      setSummary(response.data)
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.value || parseFloat(formData.value) <= 0) return

    setIsLoading(true)
    try {
      const selectedCategory = activeTab === 'domestic' ? domesticCategories : transportationCategories
      const categoryData = selectedCategory.find(cat => cat.value === formData.subcategory)
      
      const co2Calculated = parseFloat(formData.value) * (categoryData?.factor || 0)

      await carbonAPI.createEntry({
        ...formData,
        value: parseFloat(formData.value),
        co2_calculated: co2Calculated,
      })

      // Reset form
      setFormData({
        category: activeTab === 'domestic' ? 'DOMESTIC' : 'TRANSPORTATION',
        subcategory: activeTab === 'domestic' ? 'ELECTRICITY' : 'CAR',
        value: '',
        unit: activeTab === 'domestic' ? 'kWh' : 'km',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      })

      fetchEntries()
      fetchSummary()
    } catch (error) {
      console.error('Error creating entry:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (subcategory: string) => {
    const selectedCategory = activeTab === 'domestic' ? domesticCategories : transportationCategories
    const categoryData = selectedCategory.find(cat => cat.value === subcategory)
    
    setFormData(prev => ({
      ...prev,
      subcategory,
      unit: categoryData?.unit || prev.unit,
    }))
  }

  const calculateCO2Preview = () => {
    if (!formData.value) return 0
    const selectedCategory = activeTab === 'domestic' ? domesticCategories : transportationCategories
    const categoryData = selectedCategory.find(cat => cat.value === formData.subcategory)
    return parseFloat(formData.value) * (categoryData?.factor || 0)
  }

  // Chart data
  const pieData = {
    labels: ['Domestic', 'Transportation'],
    datasets: [
      {
        data: [
          entries.filter(e => e.category === 'DOMESTIC').reduce((sum, e) => sum + e.co2_calculated, 0),
          entries.filter(e => e.category === 'TRANSPORTATION').reduce((sum, e) => sum + e.co2_calculated, 0),
        ],
        backgroundColor: ['#10B981', '#3B82F6'],
        borderWidth: 0,
      },
    ],
  }

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Your CO2 (kg)',
        data: [45, 52, 48, 61, 55, 67],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'National Average',
        data: [65, 68, 70, 72, 75, 78],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  const currentCategories = activeTab === 'domestic' ? domesticCategories : transportationCategories

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Carbon Calculator
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your carbon footprint and discover ways to reduce emissions
          </p>
        </div>
        <button
          onClick={() => {/* Export functionality */}}
          className="btn-outline flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Add New Entry
            </h2>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setActiveTab('domestic')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'domestic'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <HomeIcon className="h-4 w-4 inline mr-2" />
                Domestic
              </button>
              <button
                onClick={() => setActiveTab('transportation')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'transportation'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <TruckIcon className="h-4 w-4 inline mr-2" />
                Transportation
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="input-field"
                >
                  {currentCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Value ({formData.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  className="input-field"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Additional details..."
                />
              </div>

              {/* CO2 Preview */}
              {formData.value && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Estimated CO2:
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      {calculateCO2Preview().toFixed(2)} kg
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !formData.value}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add Entry'}
              </button>
            </form>
          </div>
        </div>

        {/* Charts and Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {summary?.monthly_total || '0'} kg
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-secondary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Year</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {summary?.yearly_total || '0'} kg
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-earth-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">vs Average</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    -{summary?.reduction_percentage || '0'}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Category Breakdown
              </h3>
              <div className="h-64">
                <Pie data={pieData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Monthly Trends
              </h3>
              <div className="h-64">
                <Line data={monthlyData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recent Entries
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CO2
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {entries.slice(0, 5).map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {entry.subcategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {entry.value} {entry.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {entry.co2_calculated.toFixed(2)} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarbonCalculator

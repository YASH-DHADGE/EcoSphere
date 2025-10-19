import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  CalculatorIcon, 
  NewspaperIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon,
  TrophyIcon,
  ChartBarIcon,
  GlobeAltIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { climateAPI } from '../services/api'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
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

interface ClimateStats {
  global_co2: number
  global_temp_anomaly: number
  arctic_ice_extent: number
  sea_level_rise: number
}

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const [climateStats, setClimateStats] = useState<ClimateStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchClimateStats()
  }, [])

  const fetchClimateStats = async () => {
    try {
      const response = await climateAPI.getStats()
      setClimateStats(response.data)
    } catch (error) {
      console.error('Error fetching climate stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const featureCards = [
    {
      name: 'Carbon Calculator',
      description: 'Track your carbon footprint and discover ways to reduce emissions',
      icon: CalculatorIcon,
      href: '/calculator',
      color: 'bg-primary-500',
    },
    {
      name: 'Climate News',
      description: 'Stay updated with the latest climate science and environmental news',
      icon: NewspaperIcon,
      href: '/news',
      color: 'bg-secondary-500',
    },
    {
      name: 'AI Assistant',
      description: 'Get personalized climate tips and answers to your questions',
      icon: ChatBubbleLeftRightIcon,
      href: '#',
      color: 'bg-earth-500',
    },
    {
      name: 'Your Profile',
      description: 'View your progress, achievements, and environmental impact',
      icon: UserIcon,
      href: '/profile',
      color: 'bg-purple-500',
    },
  ]

  const co2TrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Global CO2 (ppm)',
        data: [415, 416, 417, 418, 419, 420],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const temperatureData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Temperature Anomaly (°C)',
        data: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-6 py-16 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                EcoSphere
              </span>
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-2xl">
              Track your carbon footprint, join climate challenges, and make a positive impact on our planet. 
              Together, we can build a sustainable future.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/calculator"
                    className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Calculate Carbon Footprint
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4 text-white">
                  <div className="flex items-center space-x-2">
                    <TrophyIcon className="h-6 w-6" />
                    <span className="font-semibold">{user?.total_points} Points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FireIcon className="h-6 w-6" />
                    <span className="font-semibold">{user?.login_streak} Day Streak</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Climate Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <GlobeAltIcon className="h-6 w-6 mr-2 text-primary-600" />
            Live Climate Dashboard
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Updated hourly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Global CO2</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {climateStats?.global_co2 || '420'} ppm
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FireIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Temp Anomaly</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  +{climateStats?.global_temp_anomaly || '1.2'}°C
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GlobeAltIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Arctic Ice</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {climateStats?.arctic_ice_extent || '4.2'}M km²
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sea Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  +{climateStats?.sea_level_rise || '3.4'}mm/year
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">CO2 Trends</h3>
            <Line data={co2TrendData} options={chartOptions} />
          </div>
          <div className="h-64">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Temperature Anomaly</h3>
            <Bar data={temperatureData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Explore EcoSphere Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feature) => (
            <Link
              key={feature.name}
              to={feature.href}
              className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {feature.name}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-primary-500 transition-all"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join thousands of users who are already tracking their carbon footprint and making 
            positive changes for the environment. Start your sustainability journey today.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Join EcoSphere Now
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home

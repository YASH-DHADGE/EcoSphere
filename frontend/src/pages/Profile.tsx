import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI, carbonAPI, gamificationAPI } from '../services/api'
import { 
  UserCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  CalendarIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface UserStats {
  total_carbon_entries: number
  monthly_carbon_total: number
  yearly_carbon_total: number
  challenges_completed: number
  achievements_earned: number
  friends_count: number
}

interface Achievement {
  id: number
  name: string
  description: string
  badge_icon: string
  earned_at: string
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'achievements' | 'friends' | 'settings'>('overview')

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const [statsResponse, achievementsResponse] = await Promise.all([
        userAPI.getUserStats(),
        gamificationAPI.getAchievements()
      ])
      
      setStats(statsResponse.data)
      setAchievements(achievementsResponse.data.results || achievementsResponse.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (data: any) => {
    try {
      const response = await userAPI.updateProfile(data)
      updateUser(response.data)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  // Chart data
  const carbonTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'CO2 Emissions (kg)',
        data: [45, 52, 48, 61, 55, 67],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const categoryData = {
    labels: ['Domestic', 'Transportation'],
    datasets: [
      {
        data: [stats?.monthly_carbon_total ? stats.monthly_carbon_total * 0.6 : 30, 
               stats?.monthly_carbon_total ? stats.monthly_carbon_total * 0.4 : 20],
        backgroundColor: ['#10B981', '#3B82F6'],
        borderWidth: 0,
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

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="h-20 w-20 rounded-full"
            />
          ) : (
            <div className="h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-12 w-12 text-white" />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user?.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.location} • {user?.get_role_display?.() || user?.role}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {user?.bio || 'No bio available'}
            </p>
            
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {user?.total_points} Points
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FireIcon className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {user?.login_streak} Day Streak
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setActiveTab('settings')}
            className="btn-outline flex items-center space-x-2"
          >
            <Cog6ToothIcon className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'goals', label: 'Goals', icon: CalendarIcon },
              { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
              { id: 'friends', label: 'Friends', icon: UserGroupIcon },
              { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8 text-primary-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats?.monthly_carbon_total?.toFixed(1) || '0'} kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrophyIcon className="h-8 w-8 text-secondary-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Challenges</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats?.challenges_completed || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <StarIcon className="h-8 w-8 text-earth-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Achievements</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats?.achievements_earned || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Carbon Trends
                  </h3>
                  <div className="h-64">
                    <Line data={carbonTrendData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Category Breakdown
                  </h3>
                  <div className="h-64">
                    <Pie data={categoryData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Personal Goals
                </h3>
                <button className="btn-primary">
                  Add New Goal
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Reduce Monthly Carbon Footprint
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">75% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Target: 50kg CO2 • Current: 37.5kg CO2
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Complete 5 Challenges
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">60% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-secondary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Target: 5 challenges • Completed: 3 challenges
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Your Achievements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">{achievement.badge_icon}</div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Earned {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Friends ({stats?.friends_count || 0})
                </h3>
                <button className="btn-primary">
                  Add Friend
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">JD</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">John Doe</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">250 points • 15 day streak</p>
                    </div>
                    <button className="btn-outline text-sm">
                      Compare
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">JS</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Jane Smith</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">180 points • 8 day streak</p>
                    </div>
                    <button className="btn-outline text-sm">
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Account Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.location || ''}
                    className="input-field"
                    placeholder="Enter your location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    defaultValue={user?.bio || ''}
                    className="input-field"
                    rows={3}
                    placeholder="Tell us about yourself"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={user?.notifications_enabled}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Enable notifications
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={user?.email_notifications}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Email notifications
                  </label>
                </div>
                
                <button className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

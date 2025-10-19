import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { gamificationAPI, userAPI } from '../services/api'
import { 
  PlusIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
  UsersIcon,
  FireIcon
} from '@heroicons/react/24/outline'

interface NGOStats {
  total_members: number
  active_challenges: number
  total_co2_reduced: number
  total_points_earned: number
  monthly_engagement: number
}

interface Challenge {
  id: number
  name: string
  description: string
  participants_count: number
  completion_rate: number
  total_co2_reduced: number
  status: string
}

const NGODashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<NGOStats | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'members' | 'analytics'>('overview')
  const [showCreateChallenge, setShowCreateChallenge] = useState(false)

  useEffect(() => {
    if (user?.role === 'NGO') {
      fetchNGOData()
    }
  }, [user])

  const fetchNGOData = async () => {
    try {
      const [statsResponse, challengesResponse] = await Promise.all([
        userAPI.getNGOStats(),
        gamificationAPI.getNGOChallenges()
      ])
      
      setStats(statsResponse.data)
      setChallenges(challengesResponse.data.results || challengesResponse.data)
    } catch (error) {
      console.error('Error fetching NGO data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChallenge = async (challengeData: any) => {
    try {
      await gamificationAPI.createChallenge(challengeData)
      setShowCreateChallenge(false)
      fetchNGOData()
    } catch (error) {
      console.error('Error creating challenge:', error)
    }
  }

  if (user?.role !== 'NGO') {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <Cog6ToothIcon className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This dashboard is only available for NGO accounts.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            NGO Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your organization's environmental initiatives
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateChallenge(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Challenge</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.total_members || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-secondary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Challenges</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.active_challenges || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-earth-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CO2 Reduced</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.total_co2_reduced?.toFixed(1) || '0'} kg
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <FireIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Points Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.total_points_earned?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'challenges', label: 'Challenges', icon: TrophyIcon },
              { id: 'members', label: 'Members', icon: UsersIcon },
              { id: 'analytics', label: 'Analytics', icon: CalendarIcon },
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        New member joined: John Doe
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Challenge completed: Weekly Public Transport
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        New challenge created: Zero Waste Week
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Monthly Engagement
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {stats?.monthly_engagement || 0}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Member participation rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {challenge.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {challenge.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Participants</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {challenge.participants_count}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Completion Rate</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {challenge.completion_rate}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">CO2 Reduced</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {challenge.total_co2_reduced.toFixed(1)} kg
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`badge ${
                        challenge.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {challenge.status}
                      </span>
                      <button className="btn-outline text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'John Doe', points: 1250, co2_reduced: 45.2 },
                    { name: 'Jane Smith', points: 980, co2_reduced: 38.7 },
                    { name: 'Mike Johnson', points: 750, co2_reduced: 29.1 },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.co2_reduced} kg CO2 reduced
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {member.points} pts
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Rank #{index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Member Growth
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      +12%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This month
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Challenge Success Rate
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      78%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Average completion rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Create New Challenge
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleCreateChallenge({
                name: formData.get('name'),
                description: formData.get('description'),
                points_reward: parseInt(formData.get('points') as string),
                duration_days: parseInt(formData.get('duration') as string),
                target_value: parseInt(formData.get('target') as string),
                target_unit: formData.get('unit'),
                category: formData.get('category'),
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Challenge Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-field"
                    placeholder="Enter challenge name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="input-field"
                    placeholder="Describe the challenge"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Points Reward
                    </label>
                    <input
                      type="number"
                      name="points"
                      required
                      className="input-field"
                      placeholder="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      required
                      className="input-field"
                      placeholder="7"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Value
                    </label>
                    <input
                      type="number"
                      name="target"
                      required
                      className="input-field"
                      placeholder="5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit
                    </label>
                    <select name="unit" required className="input-field">
                      <option value="trips">Trips</option>
                      <option value="kg">Kilograms</option>
                      <option value="days">Days</option>
                      <option value="trees">Trees</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select name="category" required className="input-field">
                    <option value="Transportation">Transportation</option>
                    <option value="Energy">Energy</option>
                    <option value="Waste">Waste</option>
                    <option value="Nature">Nature</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateChallenge(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default NGODashboard

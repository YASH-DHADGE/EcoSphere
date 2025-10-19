import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { gamificationAPI } from '../services/api'
import { 
  TrophyIcon,
  FireIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface LeaderboardEntry {
  id: number
  username: string
  avatar?: string
  total_points: number
  rank: number
  rank_change: number
  monthly_co2_reduction: number
  challenges_completed: number
  achievements_count: number
  location?: string
  is_current_user: boolean
}

interface LeaderboardData {
  entries: LeaderboardEntry[]
  total_participants: number
  current_user_rank: number
  period: string
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'city' | 'ngo'>('global')
  const [timeFilter, setTimeFilter] = useState<'monthly' | 'alltime'>('monthly')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [activeTab, timeFilter])

  const fetchLeaderboard = async () => {
    try {
      const response = await gamificationAPI.getLeaderboard(activeTab, { period: timeFilter })
      setLeaderboardData(response.data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return '↗️'
    if (change < 0) return '↘️'
    return '➡️'
  }

  const filteredEntries = leaderboardData?.entries.filter(entry =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
            Leaderboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            See how you rank against other EcoSphere users
          </p>
        </div>
        
        {leaderboardData && (
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your Rank
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              #{leaderboardData.current_user_rank}
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'global', label: 'Global', icon: GlobeAltIcon },
              { id: 'friends', label: 'Friends', icon: UserGroupIcon },
              { id: 'city', label: 'City', icon: BuildingOfficeIcon },
              { id: 'ngo', label: 'NGO Teams', icon: TrophyIcon },
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
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeFilter('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === 'monthly'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <CalendarIcon className="h-4 w-4 inline mr-2" />
                Monthly
              </button>
              <button
                onClick={() => setTimeFilter('alltime')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === 'alltime'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <TrophyIcon className="h-4 w-4 inline mr-2" />
                All Time
              </button>
            </div>
          </div>

          {/* Stats */}
          {leaderboardData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-primary-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Participants</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {leaderboardData.total_participants}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <TrophyIcon className="h-8 w-8 text-secondary-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Rank</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      #{leaderboardData.current_user_rank}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <FireIcon className="h-8 w-8 text-earth-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Period</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {timeFilter === 'monthly' ? 'This Month' : 'All Time'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="space-y-2">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                  entry.is_current_user
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-12 text-center">
                  <span className="text-2xl font-bold">
                    {getRankIcon(entry.rank)}
                  </span>
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  {entry.avatar ? (
                    <img
                      src={entry.avatar}
                      alt={entry.username}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {entry.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-semibold truncate ${
                      entry.is_current_user
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {entry.username}
                    </h3>
                    {entry.is_current_user && (
                      <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.location || 'Unknown Location'}
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">CO2 Reduced</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {entry.monthly_co2_reduction.toFixed(1)} kg
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Challenges</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {entry.challenges_completed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Achievements</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {entry.achievements_count}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {entry.total_points.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">points</p>
                </div>

                {/* Rank Change */}
                {entry.rank_change !== 0 && (
                  <div className="flex-shrink-0">
                    <span className={`text-sm font-medium ${
                      entry.rank_change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getRankChangeIcon(entry.rank_change)} {Math.abs(entry.rank_change)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No users found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { gamificationAPI } from '../services/api'
import { 
  TrophyIcon,
  CalendarIcon,
  UserGroupIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Challenge {
  id: number
  name: string
  description: string
  challenge_type: string
  points_reward: number
  duration_days: number
  target_value: number
  target_unit: string
  category: string
  start_date: string
  end_date: string
  is_active: boolean
  participants_count: number
  progress_percentage: number
  user_status: 'not_joined' | 'joined' | 'completed' | 'failed'
  creator_name?: string
  creator_type?: string
}

const Challenges: React.FC = () => {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'available'>('active')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Waste', label: 'Waste' },
    { value: 'Nature', label: 'Nature' },
    { value: 'Community', label: 'Community' },
  ]

  useEffect(() => {
    fetchChallenges()
  }, [activeTab])

  const fetchChallenges = async () => {
    try {
      const response = await gamificationAPI.getChallenges({ 
        status: activeTab,
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined
      })
      setChallenges(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinChallenge = async (challengeId: number) => {
    try {
      await gamificationAPI.joinChallenge(challengeId)
      // Refresh challenges
      fetchChallenges()
    } catch (error) {
      console.error('Error joining challenge:', error)
    }
  }

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'WEEKLY': return <CalendarIcon className="h-5 w-5" />
      case 'MONTHLY': return <CalendarIcon className="h-5 w-5" />
      case 'COMMUNITY': return <UserGroupIcon className="h-5 w-5" />
      case 'NGO_CUSTOM': return <StarIcon className="h-5 w-5" />
      default: return <TrophyIcon className="h-5 w-5" />
    }
  }

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'WEEKLY': return 'bg-blue-100 text-blue-800'
      case 'MONTHLY': return 'bg-purple-100 text-purple-800'
      case 'COMMUNITY': return 'bg-green-100 text-green-800'
      case 'NGO_CUSTOM': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'joined': return 'bg-primary-100 text-primary-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffInDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays < 0) return 'Expired'
    if (diffInDays === 0) return 'Ends today'
    if (diffInDays === 1) return '1 day left'
    return `${diffInDays} days left`
  }

  const filteredChallenges = challenges.filter(challenge => {
    if (selectedCategory !== 'ALL' && challenge.category !== selectedCategory) {
      return false
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
            Challenges
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join challenges to earn points and make a positive impact
          </p>
        </div>
        
        {user?.role === 'NGO' && (
          <button className="btn-primary flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Create Challenge</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'active', label: 'Active Challenges', icon: FireIcon },
              { id: 'completed', label: 'Completed', icon: CheckCircleIcon },
              { id: 'available', label: 'Available', icon: TrophyIcon },
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
          {/* Filter */}
          <div className="mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getChallengeTypeIcon(challenge.challenge_type)}
                      <span className={`badge ${getChallengeTypeColor(challenge.challenge_type)}`}>
                        {challenge.challenge_type}
                      </span>
                    </div>
                    <span className={`badge ${getStatusColor(challenge.user_status)}`}>
                      {challenge.user_status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {challenge.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {challenge.description}
                  </p>

                  {/* Progress Bar */}
                  {challenge.user_status === 'joined' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{challenge.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${challenge.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Points</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {challenge.points_reward}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Participants</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {challenge.participants_count}
                      </p>
                    </div>
                  </div>

                  {/* Target and Duration */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Target</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {challenge.target_value} {challenge.target_unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {challenge.duration_days} days
                      </p>
                    </div>
                  </div>

                  {/* Time Remaining */}
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatTimeRemaining(challenge.end_date)}</span>
                  </div>

                  {/* Creator Info */}
                  {challenge.creator_name && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Created by {challenge.creator_name} ({challenge.creator_type})
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    {challenge.user_status === 'not_joined' && (
                      <button
                        onClick={() => handleJoinChallenge(challenge.id)}
                        className="btn-primary w-full"
                      >
                        Join Challenge
                      </button>
                    )}
                    {challenge.user_status === 'joined' && (
                      <button className="btn-outline w-full">
                        View Progress
                      </button>
                    )}
                    {challenge.user_status === 'completed' && (
                      <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                        <CheckCircleIcon className="h-5 w-5" />
                        <span className="font-medium">Completed!</span>
                      </div>
                    )}
                    {challenge.user_status === 'failed' && (
                      <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                        <ClockIcon className="h-5 w-5" />
                        <span className="font-medium">Failed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No challenges found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Challenges

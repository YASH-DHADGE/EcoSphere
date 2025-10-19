import React, { useState, useEffect } from 'react'
import { newsAPI } from '../services/api'
import { 
  MagnifyingGlassIcon,
  BookmarkIcon,
  ShareIcon,
  FunnelIcon,
  CalendarIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline'

interface NewsArticle {
  id: number
  title: string
  summary: string
  content: string
  source: string
  url: string
  image_url?: string
  category: string
  published_date: string
  is_featured: boolean
  is_trending: boolean
  view_count: number
  bookmark_count: number
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [activeTab, setActiveTab] = useState<'latest' | 'trending' | 'digest'>('latest')

  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'POLICY', label: 'Policy' },
    { value: 'SCIENCE', label: 'Science' },
    { value: 'DISASTERS', label: 'Disasters' },
    { value: 'SOLUTIONS', label: 'Solutions' },
    { value: 'LOCAL', label: 'Local' },
    { value: 'GLOBAL', label: 'Global' },
  ]

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchQuery, selectedCategory])

  const fetchArticles = async () => {
    try {
      const response = await newsAPI.getArticles()
      setArticles(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by published date
    filtered = filtered.sort((a, b) => 
      new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
    )

    setFilteredArticles(filtered)
  }

  const handleBookmark = async (articleId: number) => {
    try {
      await newsAPI.bookmarkArticle(articleId)
      // Update local state to reflect bookmark
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, bookmark_count: article.bookmark_count + 1 }
          : article
      ))
    } catch (error) {
      console.error('Error bookmarking article:', error)
    }
  }

  const handleShare = (article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: article.url,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(article.url)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      POLICY: 'bg-blue-100 text-blue-800',
      SCIENCE: 'bg-green-100 text-green-800',
      DISASTERS: 'bg-red-100 text-red-800',
      SOLUTIONS: 'bg-purple-100 text-purple-800',
      LOCAL: 'bg-yellow-100 text-yellow-800',
      GLOBAL: 'bg-gray-100 text-gray-800',
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

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
            Climate News
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Stay updated with the latest climate science and environmental news
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'latest', label: 'Latest News', icon: CalendarIcon },
              { id: 'trending', label: 'Trending', icon: TrendingUpIcon },
              { id: 'digest', label: 'Weekly Digest', icon: BookmarkIcon },
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
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field pl-10 pr-8"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Articles Grid */}
          {activeTab === 'latest' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`badge ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      {article.is_trending && (
                        <span className="badge bg-orange-100 text-orange-800">
                          🔥 Trending
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{article.source}</span>
                      <span>{formatTimeAgo(article.published_date)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBookmark(article.id)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <BookmarkIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleShare(article)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <ShareIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                      >
                        Read Full Article →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Trending Climate Topics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { topic: 'Renewable Energy', trend: '+25%', color: 'bg-green-100 text-green-800' },
                  { topic: 'Carbon Pricing', trend: '+18%', color: 'bg-blue-100 text-blue-800' },
                  { topic: 'Climate Adaptation', trend: '+12%', color: 'bg-purple-100 text-purple-800' },
                  { topic: 'Ocean Conservation', trend: '+8%', color: 'bg-cyan-100 text-cyan-800' },
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {item.topic}
                      </h4>
                      <span className={`badge ${item.color}`}>
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.filter(article => article.is_trending).map((article) => (
                  <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`badge ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                        <span className="badge bg-orange-100 text-orange-800">
                          🔥 Trending
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{article.source}</span>
                        <span>{formatTimeAgo(article.published_date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'digest' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Weekly Climate Digest
              </h3>
              
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  This Week's Highlights
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">
                        Global CO2 Levels Reach New Record
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Atmospheric CO2 concentrations hit 420.5 ppm, the highest in human history.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">
                        Renewable Energy Milestone Achieved
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Solar and wind power now generate more electricity globally than coal.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-earth-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">
                        Arctic Ice Extent Continues Decline
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Satellite data shows second-lowest Arctic sea ice extent on record.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No articles found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default News

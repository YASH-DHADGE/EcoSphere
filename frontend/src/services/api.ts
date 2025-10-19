import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  googleLogin: (token: string) => api.post('/auth/google/', { access_token: token }),
  refreshToken: () => api.post('/auth/token/refresh/'),
  logout: () => api.post('/auth/logout/'),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data: any) => api.put('/users/profile/', data),
  getUserStats: (userId: number) => api.get(`/users/${userId}/stats/`),
  getLeaderboard: (type: string = 'global') => api.get(`/users/leaderboard/?type=${type}`),
  getFriends: () => api.get('/users/friends/'),
  addFriend: (friendId: number) => api.post('/users/friends/', { friend_id: friendId }),
  removeFriend: (friendId: number) => api.delete(`/users/friends/${friendId}/`),
}

export const carbonAPI = {
  getEntries: (params?: any) => api.get('/carbon/entries/', { params }),
  createEntry: (data: any) => api.post('/carbon/entries/', data),
  updateEntry: (id: number, data: any) => api.put(`/carbon/entries/${id}/`, data),
  deleteEntry: (id: number) => api.delete(`/carbon/entries/${id}/`),
  getSummary: (params?: any) => api.get('/carbon/summary/', { params }),
  getComparison: (params?: any) => api.get('/carbon/comparison/', { params }),
  exportReport: (params?: any) => api.get('/carbon/export/', { params, responseType: 'blob' }),
  getGoals: () => api.get('/carbon/goals/'),
  createGoal: (data: any) => api.post('/carbon/goals/', data),
  updateGoal: (id: number, data: any) => api.put(`/carbon/goals/${id}/`, data),
}

export const gamificationAPI = {
  getChallenges: (params?: any) => api.get('/gamification/challenges/', { params }),
  joinChallenge: (challengeId: number) => api.post(`/gamification/challenges/${challengeId}/join/`),
  updateProgress: (challengeId: number, data: any) => api.put(`/gamification/challenges/${challengeId}/progress/`, data),
  getAchievements: () => api.get('/gamification/achievements/'),
  getLeaderboard: (params?: any) => api.get('/gamification/leaderboard/', { params }),
  getUserPoints: () => api.get('/gamification/points/'),
}

export const newsAPI = {
  getArticles: (params?: any) => api.get('/news/articles/', { params }),
  getArticle: (id: number) => api.get(`/news/articles/${id}/`),
  bookmarkArticle: (id: number) => api.post(`/news/articles/${id}/bookmark/`),
  getWeeklyDigest: () => api.get('/news/digest/'),
  getTrendingTopics: () => api.get('/news/trending/'),
  searchArticles: (query: string) => api.get('/news/search/', { params: { q: query } }),
}

export const notificationAPI = {
  getNotifications: (params?: any) => api.get('/notifications/', { params }),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read/`),
  markAllAsRead: () => api.put('/notifications/read-all/'),
  getUnreadCount: () => api.get('/notifications/unread-count/'),
}

export const chatbotAPI = {
  sendMessage: (data: any) => api.post('/chatbot/message/', data),
  getHistory: (sessionId?: string) => api.get('/chatbot/history/', { params: { session_id: sessionId } }),
  getSessions: () => api.get('/chatbot/sessions/'),
  getConfig: () => api.get('/chatbot/config/'),
}

export const climateAPI = {
  getStats: () => api.get('/climate/stats/'),
  getTrends: (params?: any) => api.get('/climate/trends/', { params }),
  getData: (params?: any) => api.get('/climate/data/', { params }),
  getAlerts: (params?: any) => api.get('/climate/alerts/', { params }),
  getStatistics: (params?: any) => api.get('/climate/statistics/', { params }),
}

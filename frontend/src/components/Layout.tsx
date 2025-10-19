import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Header from './Header'
import Sidebar from './Sidebar'
import NotificationCenter from './NotificationCenter'
import Chatbot from './Chatbot'
import { 
  HomeIcon, 
  CalculatorIcon, 
  UserIcon, 
  NewspaperIcon, 
  TrophyIcon, 
  PuzzlePieceIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Calculator', href: '/calculator', icon: CalculatorIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'News', href: '/news', icon: NewspaperIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
    { name: 'Challenges', href: '/challenges', icon: PuzzlePieceIcon },
    { name: 'NGO Dashboard', href: '/ngo-dashboard', icon: BuildingOfficeIcon, roles: ['NGO'] },
    { name: 'Admin Dashboard', href: '/admin-dashboard', icon: ShieldCheckIcon, roles: ['ADMIN'] },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter />

      {/* Chatbot Widget */}
      <Chatbot />
    </div>
  )
}

export default Layout

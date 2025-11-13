import React, { useState, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import  Header from '../components/Header';
import { Dashboard } from '../components/Dashboard';
import { CarbonCalculator } from '../components/CarbonCalculator';
import { Chatbot } from '../components/Chatbot';
import { NewsFeed } from '../components/NewsFeed';
import { Gamification } from '../components/Gamification';
import {ThemeProvider}  from '../context/ThemeContext';

type View = 'dashboard' | 'calculator' | 'chatbot' | 'news' | 'gamification';

const AppLoggedIn: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'calculator':
        return <CarbonCalculator />;
      case 'chatbot':
        return <Chatbot />;
      case 'news':
        return <NewsFeed />;
      case 'gamification':
        return <Gamification />;
      default:
        return <Dashboard />;
    }
  }, [currentView]);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            {renderView()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AppLoggedIn;


import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-primary-green dark:hover:text-primary-green"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className="ml-4 flex items-center">
             <img 
                src={`https://picsum.photos/seed/user/40/40`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-primary-green"
             />
             <div className="ml-3 hidden sm:block">
                 <p className="text-sm font-semibold text-gray-800 dark:text-white">Alex Green</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Eco-Enthusiast</p>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

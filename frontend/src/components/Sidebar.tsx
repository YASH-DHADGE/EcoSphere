
import React from 'react';
import { BarChart3, Bot, Calculator, Sun, Moon, Leaf, Newspaper, Trophy, X, Menu } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

// FIX: Define props interface for NavItem
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

// FIX: Type NavItem as a React.FC to correctly handle props including the 'key' prop.
const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary-green/20 text-primary-green dark:bg-primary-green/30 dark:text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="ml-4 font-semibold text-sm">{label}</span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isSidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'calculator', label: 'Carbon Calculator', icon: <Calculator size={20} /> },
    { id: 'chatbot', label: 'Eco Assistant', icon: <Bot size={20} /> },
    { id: 'news', label: 'Climate News', icon: <Newspaper size={20} /> },
    { id: 'gamification', label: 'Challenges', icon: <Trophy size={20} /> },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside className={`absolute lg:relative flex flex-col w-64 bg-white dark:bg-gray-800 h-full shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Leaf className="text-primary-green" size={28} />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">EcoSphere</h1>
          </div>
          <button className="lg:hidden text-gray-500 dark:text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {navItems.map(item => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={currentView === item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
              />
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">© 2024 EcoSphere. All rights reserved.</p>
        </div>
      </aside>
    </>
  );
};

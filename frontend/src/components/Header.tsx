import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import LogoIcon from './icons/LogoIcon';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="w-full bg-[#1B4332] dark:bg-[#0F241C] text-white shadow-lg sticky top-0 z-50 border-b border-[#2D6A4F]"
    >
      <div className="flex items-center justify-between w-full px-8 py-3">
        
        {/* LEFT SIDE: Logo + Brand */}
        <Link to="/" className="flex items-center space-x-2 mr-auto">
          <LogoIcon className="h-9 w-9 text-[#95D5B2]" />
          <span className="text-2xl font-bold tracking-tight">EcoSphere</span>
        </Link>

        {/* RIGHT SIDE: Navigation + Auth + Theme */}
        <div className="flex items-center space-x-6 ml-auto">
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/about"
              className="font-medium hover:text-amber-400 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="font-medium hover:text-amber-400 transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <Link
            to="/auth"
            className="px-4 py-2 text-sm font-medium border border-[#95D5B2] rounded-lg hover:bg-[#95D5B2] hover:text-[#1B4332] transition-colors"
          >
            Login
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

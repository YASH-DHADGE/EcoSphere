import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import LogoIcon from "./icons/LogoIcon";

interface HeaderProps {
  toggleSidebar?: () => void;
}

/**
 * Single Header component:
 * - Shows Logged-In Header when token exists
 * - Shows Public Header when token is missing
 */
const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = localStorage.getItem("token") !== null;

  return isLoggedIn ? (
    /* ------------------------------------------- */
    /*                LOGGED-IN HEADER             */
    /* ------------------------------------------- */
    <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

        {/* Sidebar toggle for dashboard */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-primary-green dark:hover:text-primary-green"
        >
          <Menu size={24} />
        </button>

        {/* RIGHT SIDE CONTENT */}
        <div className="flex items-center ml-auto space-x-4">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* User Avatar */}
          <div className="flex items-center">
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

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/"; // go back to landing page
            }}
            className="text-sm px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>

        </div>
      </div>
    </header>
  ) : (
    /* ------------------------------------------- */
    /*                  PUBLIC HEADER              */
    /* ------------------------------------------- */
    <header className="w-full bg-[#1B4332] dark:bg-[#0F241C] text-white shadow-lg sticky top-0 z-50 border-b border-[#2D6A4F]">
      <div className="flex items-center justify-between w-full px-8 py-3">

        {/* Left side – Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-auto">
          <LogoIcon className="h-9 w-9 text-[#95D5B2]" />
          <span className="text-2xl font-bold tracking-tight">EcoSphere</span>
        </Link>

        {/* Right side – About, Contact, Login */}
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

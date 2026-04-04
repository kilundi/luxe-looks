import React from 'react';
import { Bell, Search, User, Moon, Sun, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';

interface TopbarProps {
  toggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-dark-800 text-dark-400"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            placeholder="Search products, categories..."
            className="w-64 lg:w-96 pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dark-500 hidden sm:block">
            Ctrl+K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2 rounded-lg hover:bg-dark-800 text-dark-400 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-dark-400">Admin</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-900 border border-dark-800 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-dark-800 flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

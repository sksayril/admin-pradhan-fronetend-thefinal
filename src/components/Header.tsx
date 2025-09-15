import React from 'react';
import { Menu, LogOut, Bell, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search members, students, payments..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent w-80 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group">
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-sky-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-white text-sm font-semibold">
              {user?.firstName?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-gray-700 font-medium text-sm">
              {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
            </p>
            <p className="text-gray-500 text-xs">
              {user?.role || 'Administrator'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group"
          title="Logout"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default Header;
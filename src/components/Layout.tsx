import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Shield, Store } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>{children}</div>;
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'store_owner':
        return <Store className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin':
        return 'bg-blue-600';
      case 'store_owner':
        return 'bg-purple-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className={`${getRoleColor()} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                {getRoleIcon()}
                <span className="ml-2 text-white text-xl font-bold">
                  Store Rating System
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <span className="font-medium">{user.name}</span>
                <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                  {user.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-white hover:text-gray-200 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
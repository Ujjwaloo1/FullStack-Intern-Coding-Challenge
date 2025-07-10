import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { StoreOwnerDashboard } from './components/StoreOwnerDashboard';
import { initializeMockData } from './utils/mockData';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    initializeMockData();
  }, []);

  if (!isAuthenticated) {
    return showLogin ? (
      <LoginForm onToggleForm={() => setShowLogin(false)} />
    ) : (
      <RegisterForm onToggleForm={() => setShowLogin(true)} />
    );
  }

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'user':
        return <UserDashboard />;
      case 'store_owner':
        return <StoreOwnerDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
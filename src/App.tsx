import React, { useState } from 'react';
import { AuthProvider, useAuth, LoginForm } from './components/AuthWrapper';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InvoiceManager from './components/InvoiceManager';
import UploadManager from './components/UploadManager';
import SKUManager from './components/SKUManager';
import N8NWorkflows from './components/N8NWorkflows';
import UserManager from './components/UserManager';
import Reports from './components/Reports';
import Settings from './components/Settings';
import ErrorManager from './components/ErrorManager';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <InvoiceManager />;
      case 'upload':
        return <UploadManager />;
      case 'sku-manager':
        return <SKUManager />;
      case 'n8n-workflows':
        return <N8NWorkflows />;
      case 'users':
        return <UserManager />;
      case 'errors':
        return <ErrorManager />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
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
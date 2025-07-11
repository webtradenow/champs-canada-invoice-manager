import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Upload, 
  Package, 
  LineChart, 
  Settings, 
  Users,
  User,
  LogOut,
  Workflow,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from './AuthWrapper';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { profile, signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'invoices', icon: FileText, label: 'Invoices' },
    { id: 'upload', icon: Upload, label: 'Upload' },
    { id: 'sku-manager', icon: Package, label: 'SKU Manager' },
    { id: 'n8n-workflows', icon: Workflow, label: 'N8N Workflows' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'errors', icon: AlertTriangle, label: 'Error Management' },
    { id: 'reports', icon: LineChart, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Champs</h1>
            <p className="text-sm text-slate-400">Invoicing</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-slate-800 transition-colors ${
              activeTab === item.id ? 'bg-blue-600 border-r-4 border-blue-400' : ''
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-700 p-2 rounded-full">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-xs text-slate-400">{profile?.email}</p>
            <p className="text-xs text-slate-500 capitalize">{profile?.role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-auto p-1 text-slate-400 hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { 
  FileText, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { 
      title: 'Total Invoices', 
      value: '1,247', 
      icon: FileText, 
      color: 'bg-blue-500',
      iconColor: 'text-blue-500'
    },
    { 
      title: 'Pending Processing', 
      value: '23', 
      icon: Clock, 
      color: 'bg-yellow-500',
      iconColor: 'text-yellow-500'
    },
    { 
      title: 'Monthly Revenue', 
      value: '$156,750', 
      icon: DollarSign, 
      color: 'bg-green-500',
      iconColor: 'text-green-500'
    },
    { 
      title: 'Success Rate', 
      value: '98.5%', 
      icon: TrendingUp, 
      color: 'bg-purple-500',
      iconColor: 'text-purple-500'
    },
  ];

  const processingStats = [
    { label: 'Processed Today', value: '45', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Average Processing Time', value: '2.3 min', icon: Timer, color: 'text-blue-500' },
    { label: 'Error Rate', value: '1.5%', icon: XCircle, color: 'text-red-500' },
    { label: 'Active Webhooks', value: '4/4', icon: AlertCircle, color: 'text-green-500' },
  ];

  const recentActivity = [
    { id: 'INV-2024-001', retailer: 'Bentley\'s', amount: 2450.00, date: '2024-01-15', status: 'success' },
    { id: 'INV-2024-002', retailer: 'Walmart', amount: 1890.50, date: '2024-01-15', status: 'pending' },
    { id: 'INV-2024-003', retailer: 'Target', amount: 3250.75, date: '2024-01-14', status: 'processing' },
    { id: 'INV-2024-004', retailer: 'Champs Canada', amount: 890.25, date: '2024-01-14', status: 'error' },
    { id: 'INV-2024-005', retailer: 'Champs International', amount: 4200.00, date: '2024-01-13', status: 'success' },
  ];

  const chartData = [
    { name: 'Jan', invoices: 4000, revenue: 2400 },
    { name: 'Feb', invoices: 3000, revenue: 1398 },
    { name: 'Mar', invoices: 2000, revenue: 9800 },
    { name: 'Apr', invoices: 2780, revenue: 3908 },
    { name: 'May', invoices: 1890, revenue: 4800 },
    { name: 'Jun', invoices: 2390, revenue: 3800 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'processing': return 'text-blue-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing': return <Timer className="h-4 w-4 text-blue-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your invoice management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-semibold text-gray-900">{activity.id}</p>
                      <p className="text-sm text-gray-600">{activity.retailer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${activity.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Processing Statistics</h2>
          <div className="space-y-4">
            {processingStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Invoice Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="invoices" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
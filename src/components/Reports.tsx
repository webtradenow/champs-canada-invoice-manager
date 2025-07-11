import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, Calendar, Filter, TrendingUp, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('revenue');

  const revenueData = [
    { month: 'Jan', revenue: 125000, invoices: 245 },
    { month: 'Feb', revenue: 142000, invoices: 278 },
    { month: 'Mar', revenue: 118000, invoices: 235 },
    { month: 'Apr', revenue: 165000, invoices: 312 },
    { month: 'May', revenue: 156000, invoices: 289 },
    { month: 'Jun', revenue: 178000, invoices: 334 },
  ];

  const retailerData = [
    { name: 'Bentley\'s', value: 28, color: '#3B82F6' },
    { name: 'Walmart', value: 25, color: '#10B981' },
    { name: 'Target', value: 22, color: '#F59E0B' },
    { name: 'Champs Canada', value: 15, color: '#EF4444' },
    { name: 'Champs International', value: 10, color: '#8B5CF6' },
  ];

  const processingData = [
    { day: 'Mon', processed: 45, errors: 2 },
    { day: 'Tue', processed: 52, errors: 1 },
    { day: 'Wed', processed: 38, errors: 3 },
    { day: 'Thu', processed: 61, errors: 0 },
    { day: 'Fri', processed: 47, errors: 2 },
    { day: 'Sat', processed: 23, errors: 1 },
    { day: 'Sun', processed: 19, errors: 0 },
  ];

  const performanceMetrics = [
    { label: 'Total Revenue', value: '$1,284,750', change: '+12.5%', positive: true },
    { label: 'Avg Processing Time', value: '2.3 min', change: '-8.2%', positive: true },
    { label: 'Success Rate', value: '98.5%', change: '+2.1%', positive: true },
    { label: 'Error Rate', value: '1.5%', change: '-0.3%', positive: true },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into your invoice processing performance</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="revenue">Revenue Report</option>
              <option value="processing">Processing Report</option>
              <option value="retailer">Retailer Report</option>
              <option value="performance">Performance Report</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Calendar className="h-4 w-4" />
              Custom Range
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className={`text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Invoices'
                ]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Invoice Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="invoices" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Retailer Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={retailerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {retailerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Processing</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="processed" fill="#3B82F6" />
              <Bar dataKey="errors" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Revenue Performance</h3>
            <p className="text-gray-600">Monthly revenue growth of 12.5% with consistent invoice processing</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Processing Efficiency</h3>
            <p className="text-gray-600">Average processing time reduced by 8.2% with 98.5% success rate</p>
          </div>
          <div className="text-center">
            <Filter className="h-12 w-12 text-purple-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Quality Metrics</h3>
            <p className="text-gray-600">Error rate maintained at 1.5% with improved data validation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
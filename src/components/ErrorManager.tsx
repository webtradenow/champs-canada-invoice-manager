import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Tag,
  TrendingUp,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import { errorOperations } from '../lib/supabase';
import type { ErrorLog, ErrorCategory, ErrorResolution } from '../types';

const ErrorManager: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [categories, setCategories] = useState<ErrorCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [loading, setLoading] = useState(true);

  const [newError, setNewError] = useState({
    title: '',
    message: '',
    error_code: '',
    risk_level: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    category_id: '',
    priority: 3,
    tags: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [errorsData, categoriesData] = await Promise.all([
        errorOperations.getAllErrors(),
        errorOperations.getCategories()
      ]);
      setErrors(errorsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateError = async () => {
    try {
      await errorOperations.createError(newError);
      setShowAddModal(false);
      setNewError({
        title: '',
        message: '',
        error_code: '',
        risk_level: 'medium',
        category_id: '',
        priority: 3,
        tags: []
      });
      loadData();
    } catch (error) {
      console.error('Error creating error log:', error);
    }
  };

  const handleUpdateStatus = async (errorId: string, status: 'open' | 'in_progress' | 'resolved' | 'ignored') => {
    try {
      await errorOperations.updateError(errorId, { status });
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ignored': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'ignored': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredErrors = errors.filter(error => {
    const matchesSearch = error.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.error_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || error.risk_level === filterRisk;
    const matchesStatus = filterStatus === 'all' || error.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || error.category_id === filterCategory;
    return matchesSearch && matchesRisk && matchesStatus && matchesCategory;
  });

  const errorStats = {
    total: errors.length,
    critical: errors.filter(e => e.risk_level === 'critical').length,
    high: errors.filter(e => e.risk_level === 'high').length,
    open: errors.filter(e => e.status === 'open').length,
    resolved: errors.filter(e => e.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading error logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Error Management</h1>
        <p className="text-gray-600">Monitor, prioritize, and resolve application errors</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Errors</p>
              <p className="text-2xl font-bold text-gray-900">{errorStats.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-600">{errorStats.critical}</p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{errorStats.high}</p>
            </div>
            <Zap className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Open</p>
              <p className="text-2xl font-bold text-red-600">{errorStats.open}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{errorStats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search errors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="ignored">Ignored</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Log Error
          </button>
        </div>
      </div>

      {/* Error Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occurrences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Occurred
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredErrors.map((error) => (
                <tr key={error.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {getRiskIcon(error.risk_level)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{error.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{error.message}</div>
                        {error.error_code && (
                          <div className="text-xs text-gray-400 font-mono">{error.error_code}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(error.risk_level)}`}>
                      {error.risk_level.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(error.status)}`}>
                      {getStatusIcon(error.status)}
                      <span className="ml-1 capitalize">{error.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categories.find(c => c.id === error.category_id)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{error.occurrence_count}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(error.last_occurred).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedError(error);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {error.status === 'open' && (
                        <button 
                          onClick={() => handleUpdateStatus(error.id, 'in_progress')}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Mark In Progress"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      )}
                      {error.status !== 'resolved' && (
                        <button 
                          onClick={() => handleUpdateStatus(error.id, 'resolved')}
                          className="text-green-600 hover:text-green-800"
                          title="Mark Resolved"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Error Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Log New Error</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Error Title
                </label>
                <input
                  type="text"
                  value={newError.title}
                  onChange={(e) => setNewError({...newError, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the error"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Error Message
                </label>
                <textarea
                  value={newError.message}
                  onChange={(e) => setNewError({...newError, message: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed error message"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risk Level
                  </label>
                  <select
                    value={newError.risk_level}
                    onChange={(e) => setNewError({...newError, risk_level: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newError.category_id}
                    onChange={(e) => setNewError({...newError, category_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Error Code (Optional)
                </label>
                <input
                  type="text"
                  value={newError.error_code}
                  onChange={(e) => setNewError({...newError, error_code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., PGRST116, AUTH001"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateError}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Log Error
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Detail Modal */}
      {showDetailModal && selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Error Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(selectedError.risk_level)}`}>
                    {selectedError.risk_level.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedError.status)}`}>
                    {getStatusIcon(selectedError.status)}
                    <span className="ml-1 capitalize">{selectedError.status.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{selectedError.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedError.message}</p>
              </div>
              
              {selectedError.error_code && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Error Code</label>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{selectedError.error_code}</code>
                </div>
              )}
              
              {selectedError.stack_trace && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stack Trace</label>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">{selectedError.stack_trace}</pre>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occurrences</label>
                  <p className="text-gray-900 font-medium">{selectedError.occurrence_count}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <p className="text-gray-900">{selectedError.priority}/5</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Occurred</label>
                  <p className="text-gray-900">{new Date(selectedError.first_occurred).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Occurred</label>
                  <p className="text-gray-900">{new Date(selectedError.last_occurred).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorManager;
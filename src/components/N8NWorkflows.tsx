import React, { useState } from 'react';
import { 
  Workflow, 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Trash2, 
  Plus,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const N8NWorkflows: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflows');

  const workflows = [
    {
      id: 'wf-001',
      name: 'Invoice Processing Automation',
      description: 'Automatically process incoming invoices from all retailers',
      status: 'active',
      lastExecution: '2024-01-15 14:30:00',
      executions: 1247,
      successRate: 98.5,
      avgExecutionTime: '2.3 min',
      triggers: ['Webhook', 'Schedule'],
      nodes: 12
    },
    {
      id: 'wf-002',
      name: 'SKU Mapping Sync',
      description: 'Synchronize SKU mappings across all retailer systems',
      status: 'active',
      lastExecution: '2024-01-15 12:00:00',
      executions: 89,
      successRate: 100,
      avgExecutionTime: '1.8 min',
      triggers: ['Schedule'],
      nodes: 8
    },
    {
      id: 'wf-003',
      name: 'Error Notification System',
      description: 'Send notifications when invoice processing fails',
      status: 'active',
      lastExecution: '2024-01-15 13:45:00',
      executions: 23,
      successRate: 95.7,
      avgExecutionTime: '0.5 min',
      triggers: ['Webhook'],
      nodes: 5
    },
    {
      id: 'wf-004',
      name: 'Daily Revenue Report',
      description: 'Generate and email daily revenue reports',
      status: 'paused',
      lastExecution: '2024-01-14 18:00:00',
      executions: 365,
      successRate: 99.2,
      avgExecutionTime: '3.2 min',
      triggers: ['Schedule'],
      nodes: 15
    },
    {
      id: 'wf-005',
      name: 'Retailer API Health Check',
      description: 'Monitor retailer API endpoints for availability',
      status: 'error',
      lastExecution: '2024-01-15 14:00:00',
      executions: 720,
      successRate: 87.5,
      avgExecutionTime: '1.2 min',
      triggers: ['Schedule'],
      nodes: 6
    },
  ];

  const executions = [
    {
      id: 'exec-001',
      workflowId: 'wf-001',
      workflowName: 'Invoice Processing Automation',
      status: 'success',
      startTime: '2024-01-15 14:30:00',
      endTime: '2024-01-15 14:32:18',
      duration: '2m 18s',
      itemsProcessed: 15
    },
    {
      id: 'exec-002',
      workflowId: 'wf-002',
      workflowName: 'SKU Mapping Sync',
      status: 'success',
      startTime: '2024-01-15 12:00:00',
      endTime: '2024-01-15 12:01:45',
      duration: '1m 45s',
      itemsProcessed: 8
    },
    {
      id: 'exec-003',
      workflowId: 'wf-005',
      workflowName: 'Partner API Health Check',
      status: 'error',
      startTime: '2024-01-15 14:00:00',
      endTime: '2024-01-15 14:01:15',
      duration: '1m 15s',
      itemsProcessed: 0
    },
    {
      id: 'exec-004',
      workflowId: 'wf-003',
      workflowName: 'Error Notification System',
      status: 'success',
      startTime: '2024-01-15 13:45:00',
      endTime: '2024-01-15 13:45:30',
      duration: '30s',
      itemsProcessed: 1
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">N8N Workflows</h1>
        <p className="text-gray-600">Manage your automation workflows and monitor executions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{workflows.length}</p>
            </div>
            <Workflow className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{workflows.filter(w => w.status === 'active').length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">{workflows.reduce((sum, w) => sum + w.executions, 0)}</p>
            </div>
            <Play className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length * 10) / 10}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('workflows')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'workflows'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Workflows
            </button>
            <button
              onClick={() => setActiveTab('executions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'executions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Executions
            </button>
          </nav>
        </div>

        {activeTab === 'workflows' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Workflow Management</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="h-4 w-4" />
                Create Workflow
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Workflow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Execution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Executions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workflows.map((workflow) => (
                    <tr key={workflow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Workflow className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                            <div className="text-sm text-gray-500">{workflow.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                          {getStatusIcon(workflow.status)}
                          <span className="ml-1 capitalize">{workflow.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workflow.lastExecution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workflow.executions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workflow.successRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workflow.avgExecutionTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-800">
                            <Play className="h-4 w-4" />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-800">
                            <Pause className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Settings className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'executions' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Executions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Workflow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items Processed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {executions.map((execution) => (
                    <tr key={execution.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{execution.workflowName}</div>
                            <div className="text-sm text-gray-500">{execution.workflowId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                          {getStatusIcon(execution.status)}
                          <span className="ml-1 capitalize">{execution.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {execution.startTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {execution.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {execution.itemsProcessed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default N8NWorkflows;
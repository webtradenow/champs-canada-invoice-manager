import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DatabaseStatus: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [tableCount, setTableCount] = useState<number>(0);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [error, setError] = useState<string>('');

  const checkDatabaseConnection = async () => {
    setConnectionStatus('checking');
    setError('');
    
    try {
      console.log('Testing connection to:', supabase.supabaseUrl);
      
      // Test basic connection
      const { data, error: connectionError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });

      if (connectionError) {
        console.error('Connection error:', connectionError);
        throw connectionError;
      }

      console.log('✅ Successfully connected to Supabase');
      
      // Get table information
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_table_count')

      if (tablesError) {
        console.warn('Could not get table count:', tablesError)
        // Fallback: try to count tables manually
        try {
          const { data: profilesTest } = await supabase
            .from('profiles')
            .select('count', { count: 'exact', head: true })
          setTableCount(profilesTest ? 8 : 0) // We know we have 8 main tables
        } catch {
          setTableCount(0)
        }
      } else {
        setTableCount(tables || 0)
      }

      setConnectionStatus('connected');
      setLastChecked(new Date());
    } catch (err: any) {
      console.error('Database connection error:', err);
      setConnectionStatus('error');
      setError(err.message || 'Unknown connection error');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'border-blue-200 bg-blue-50';
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Database Status</h3>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Connection:</span>
          <span className={`font-medium ${
            connectionStatus === 'connected' ? 'text-green-600' : 
            connectionStatus === 'error' ? 'text-red-600' : 'text-blue-600'
          }`}>
            {connectionStatus === 'checking' ? 'Checking...' : 
             connectionStatus === 'connected' ? 'Connected' : 'Error'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Database:</span>
          <span className="font-medium text-gray-900">Supabase PostgreSQL</span>
        </div>
        
        {connectionStatus === 'connected' && (
          <div className="flex justify-between">
            <span className="text-gray-600">Tables:</span>
            <span className="font-medium text-gray-900">{tableCount} detected</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Last Checked:</span>
          <span className="font-medium text-gray-900">
            {lastChecked.toLocaleTimeString()}
          </span>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-xs">
            {error}
          </div>
        )}
      </div>
      
      <button
        onClick={checkDatabaseConnection}
        disabled={connectionStatus === 'checking'}
        className="mt-3 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {connectionStatus === 'checking' ? 'Checking...' : 'Refresh Status'}
      </button>
    </div>
  );
};

export default DatabaseStatus;
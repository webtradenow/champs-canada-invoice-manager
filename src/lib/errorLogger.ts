import { errorOperations } from './supabase';

// Global error handler for unhandled JavaScript errors
export const setupGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorOperations.logJavaScriptError(
      new Error(event.reason?.message || 'Unhandled Promise Rejection'),
      {
        type: 'unhandledrejection',
        reason: event.reason,
        url: window.location.href
      }
    );
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    errorOperations.logJavaScriptError(
      new Error(event.message),
      {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        url: window.location.href
      }
    );
  });
};

// Manual error logging utility
export const logError = async (
  title: string,
  message: string,
  options: {
    risk_level?: 'critical' | 'high' | 'medium' | 'low';
    category?: string;
    error_code?: string;
    metadata?: any;
  } = {}
) => {
  try {
    await errorOperations.createError({
      title,
      message,
      risk_level: options.risk_level || 'medium',
      category_id: options.category || '',
      error_code: options.error_code,
      metadata: options.metadata
    });
  } catch (error) {
    console.error('Failed to log error:', error);
  }
};

export default {
  setupGlobalErrorHandler,
  logError
};
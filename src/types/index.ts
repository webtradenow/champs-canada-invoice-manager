export interface Invoice {
  id: string;
  invoice_number: string;
  retailer: string;
  amount: number;
  status: 'pending' | 'processed' | 'error' | 'success';
  date: string;
  created_at: string;
  updated_at: string;
}

export interface SKUMapping {
  id: string;
  retailer_sku: string;
  internal_sku: string;
  retailer: string;
  product_name: string;
  category: string;
  price: number;
  created_at: string;
}

export interface Retailer {
  id: string;
  name: string;
  api_endpoint: string;
  status: 'active' | 'inactive';
  webhook_url: string;
  last_sync: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'admin' | 'user' | 'viewer';
  avatar_url?: string;
  company?: string;
  department?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  ip_address?: string;
  user_agent?: string;
  login_at: string;
  logout_at?: string;
  is_active: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface DashboardStats {
  total_invoices: number;
  pending_processing: number;
  monthly_revenue: number;
  success_rate: number;
  processed_today: number;
  avg_processing_time: number;
  error_rate: number;
  active_webhooks: number;
}

export interface ErrorCategory {
  id: string;
  name: string;
  description?: string;
  default_risk_level: 'critical' | 'high' | 'medium' | 'low';
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ErrorLog {
  id: string;
  title: string;
  message: string;
  error_code?: string;
  stack_trace?: string;
  url?: string;
  user_agent?: string;
  user_id?: string;
  category_id?: string;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'ignored';
  priority: number;
  tags?: string[];
  metadata?: any;
  first_occurred: string;
  last_occurred: string;
  occurrence_count: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  category?: ErrorCategory;
  assigned_user?: User;
}

export interface ErrorResolution {
  id: string;
  error_log_id: string;
  resolved_by?: string;
  resolution_notes: string;
  resolution_type?: string;
  time_to_resolve?: string;
  created_at: string;
  resolver?: User;
}
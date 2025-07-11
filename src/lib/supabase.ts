import { createClient } from '@supabase/supabase-js'
import type { User, UserSession, AuthUser } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bnzijphoaacmvyuptzuf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuemlqcGhvYWFjbXZ5dXB0enVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODkzNzcsImV4cCI6MjA2Nzc2NTM3N30.x_D6kvOQewDy8kEEc0I_snCjLhdy9lYZ9fq9yA3Jwxs'

// Validate Supabase connection
const isValidUrl = supabaseUrl === 'https://bnzijphoaacmvyuptzuf.supabase.co'
const isValidKey = supabaseAnonKey.startsWith('eyJ') && supabaseAnonKey.length > 100

if (!isValidUrl || !isValidKey) {
  console.warn('Supabase connection issue. Checking credentials...')
} else {
  console.log('✅ Connected to Supabase project: bnzijphoaacmvyuptzuf')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Error logging operations
export const errorOperations = {
  async getAllErrors() {
    const { data, error } = await supabase
      .from('error_logs')
      .select(`
        *,
        category:error_categories(name, color),
        assigned_user:profiles!assigned_to(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('error_categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async createError(errorData: {
    title: string;
    message: string;
    error_code?: string;
    stack_trace?: string;
    url?: string;
    user_agent?: string;
    category_id?: string;
    risk_level: 'critical' | 'high' | 'medium' | 'low';
    priority?: number;
    tags?: string[];
    metadata?: any;
  }) {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check if similar error exists (same title and error_code)
    const { data: existingError } = await supabase
      .from('error_logs')
      .select('id, occurrence_count')
      .eq('title', errorData.title)
      .eq('error_code', errorData.error_code || '')
      .eq('status', 'open')
      .single()

    if (existingError) {
      // Update existing error
      const { data, error } = await supabase
        .from('error_logs')
        .update({
          occurrence_count: existingError.occurrence_count + 1,
          last_occurred: new Date().toISOString()
        })
        .eq('id', existingError.id)
        .select()

      if (error) throw error
      return data[0]
    } else {
      // Create new error
      const { data, error } = await supabase
        .from('error_logs')
        .insert([{
          ...errorData,
          user_id: user?.id,
          url: errorData.url || window.location.href,
          user_agent: errorData.user_agent || navigator.userAgent
        }])
        .select()

      if (error) throw error
      return data[0]
    }
  },

  async updateError(id: string, updates: any) {
    const { data, error } = await supabase
      .from('error_logs')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async deleteError(id: string) {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async createResolution(resolutionData: {
    error_log_id: string;
    resolution_notes: string;
    resolution_type?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('error_resolutions')
      .insert([{
        ...resolutionData,
        resolved_by: user?.id
      }])
      .select()

    if (error) throw error

    // Update error status to resolved
    await this.updateError(resolutionData.error_log_id, { status: 'resolved' })

    return data[0]
  },

  // Utility function to automatically log JavaScript errors
  async logJavaScriptError(error: Error, additionalInfo?: any) {
    try {
      // Get category for JavaScript errors
      const { data: categories } = await supabase
        .from('error_categories')
        .select('id')
        .eq('name', 'UI/UX')
        .single()

      await this.createError({
        title: error.name || 'JavaScript Error',
        message: error.message,
        stack_trace: error.stack,
        risk_level: 'medium',
        category_id: categories?.id || '',
        metadata: additionalInfo
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
  },

  // Log Supabase errors
  async logSupabaseError(error: any, context: string) {
    try {
      const { data: categories } = await supabase
        .from('error_categories')
        .select('id')
        .eq('name', 'Database')
        .single()

      const errorCode = error.code || error.error_description || 'UNKNOWN'
      const riskLevel = this.getRiskLevelFromError(error)
      
      await this.createError({
        title: `Supabase Error in ${context}`,
        message: error.message || 'Unknown Supabase error',
        error_code: errorCode,
        risk_level: riskLevel,
        category_id: categories?.id || '',
        metadata: {
          context,
          details: error.details,
          hint: error.hint,
          status: error.status
        }
      })
    } catch (logError) {
      console.error('Failed to log Supabase error:', logError)
    }
  },

  // Determine risk level based on error type
  getRiskLevelFromError(error: any): 'critical' | 'high' | 'medium' | 'low' {
    const errorCode = error.code || ''
    const message = error.message || ''
    
    // Critical errors
    if (errorCode.includes('AUTH') || message.includes('authentication')) {
      return 'critical'
    }
    
    // High priority errors
    if (errorCode.includes('PGRST') || message.includes('database')) {
      return 'high'
    }
    
    // Network errors
    if (message.includes('network') || message.includes('timeout')) {
      return 'medium'
    }
    
    return 'medium'
  }
}

// Authentication operations
export const authOperations = {
  async signUp(email: string, password: string, userData?: { first_name?: string; last_name?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // Log the session
    if (data.user) {
      await this.logUserSession(data.user.id)
    }
    
    return data
  },

  async signOut() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Update session as logged out
      await supabase
        .from('user_sessions')
        .update({ 
          logout_at: new Date().toISOString(),
          is_active: false 
        })
        .eq('user_id', user.id)
        .eq('is_active', true)
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      // Don't throw error for missing auth session - this is expected when not logged in
      if (error.message === 'Auth session missing!') {
        return null
      }
      throw error
    }
    return user
  },

  async logUserSession(userId: string) {
    const { error } = await supabase
      .from('user_sessions')
      .insert([{
        user_id: userId,
        ip_address: null, // Would need to get from request in real implementation
        user_agent: navigator.userAgent,
        login_at: new Date().toISOString(),
        is_active: true
      }])
    
    if (error) console.error('Error logging session:', error)
  },

  async updateLastLogin(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)
    
    if (error) console.error('Error updating last login:', error)
  }
}

// User profile operations
export const userOperations = {
  async getProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - this is expected for new users, don't log as error
          console.log(`No profile found for user ${userId}, this is normal for new users`)
          return null
        }
        
        // Log other errors for tracking
        console.error('Error fetching profile:', error)
        await errorOperations.logSupabaseError(error, 'getProfile')
        throw error
      }
      
      return data
    } catch (error: any) {
      // Handle network errors or other unexpected errors
      if (error.code === 'PGRST116') {
        console.log(`No profile found for user ${userId}, this is normal for new users`)
        return null
      }
      
      console.error('Unexpected error in getProfile:', error)
      throw error
    }
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteUser(userId: string) {
    // First deactivate the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId)
    
    if (profileError) throw profileError
    
    // Note: Actual user deletion from auth.users requires admin privileges
    // This would typically be done via a server-side function
  },

  async getUserSessions(userId: string): Promise<UserSession[]> {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('login_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data || []
  },

  async createUser(userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    role?: 'admin' | 'user' | 'viewer';
    department?: string;
  }) {
    // This would typically be done via a server-side function with admin privileges
    // For now, we'll use the regular signup process
    const { data, error } = await authOperations.signUp(
      userData.email,
      userData.password,
      {
        first_name: userData.first_name,
        last_name: userData.last_name
      }
    )
    
    if (error) throw error
    
    // Update the profile with additional data
    if (data.user) {
      await this.updateProfile(data.user.id, {
        role: userData.role || 'user',
        department: userData.department
      } as Partial<User>)
    }
    
    return data
  }
}

// Database operations
export const invoiceOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async create(invoice: Omit<any, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const skuOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('sku_mappings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async create(mapping: Omit<any, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('sku_mappings')
      .insert([mapping])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('sku_mappings')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('sku_mappings')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
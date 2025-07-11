/*
  # Error Logging System

  1. New Tables
    - `error_logs` - Store all application errors with risk levels
    - `error_categories` - Categorize different types of errors
    - `error_resolutions` - Track error resolution status and actions

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and user access

  3. Features
    - Risk level classification (Critical, High, Medium, Low)
    - Error categorization and tagging
    - Resolution tracking and status updates
    - User assignment for error handling
*/

-- Create error risk level enum
DO $$ BEGIN
    CREATE TYPE error_risk_level AS ENUM ('critical', 'high', 'medium', 'low');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create error status enum
DO $$ BEGIN
    CREATE TYPE error_status AS ENUM ('open', 'in_progress', 'resolved', 'ignored');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Error Categories table
CREATE TABLE IF NOT EXISTS error_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  default_risk_level error_risk_level DEFAULT 'medium',
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Error Logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  error_code text,
  stack_trace text,
  url text,
  user_agent text,
  user_id uuid REFERENCES profiles(id),
  category_id uuid REFERENCES error_categories(id),
  risk_level error_risk_level NOT NULL DEFAULT 'medium',
  status error_status DEFAULT 'open',
  priority integer DEFAULT 3,
  tags text[],
  metadata jsonb,
  first_occurred timestamptz DEFAULT now(),
  last_occurred timestamptz DEFAULT now(),
  occurrence_count integer DEFAULT 1,
  assigned_to uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Error Resolutions table
CREATE TABLE IF NOT EXISTS error_resolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_log_id uuid REFERENCES error_logs(id) ON DELETE CASCADE,
  resolved_by uuid REFERENCES profiles(id),
  resolution_notes text NOT NULL,
  resolution_type text, -- 'fixed', 'workaround', 'duplicate', 'wont_fix'
  time_to_resolve interval,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE error_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_resolutions ENABLE ROW LEVEL SECURITY;

-- Error Categories policies
CREATE POLICY "Authenticated users can view error_categories" ON error_categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage error_categories" ON error_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Error Logs policies
CREATE POLICY "Authenticated users can view error_logs" ON error_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create error_logs" ON error_logs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update assigned error_logs" ON error_logs
  FOR UPDATE TO authenticated USING (
    assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete error_logs" ON error_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Error Resolutions policies
CREATE POLICY "Authenticated users can view error_resolutions" ON error_resolutions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create error_resolutions" ON error_resolutions
  FOR INSERT TO authenticated WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER error_categories_updated_at BEFORE UPDATE ON error_categories
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER error_logs_updated_at BEFORE UPDATE ON error_logs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert default error categories
INSERT INTO error_categories (name, description, default_risk_level, color) VALUES
  ('Authentication', 'User login and authentication errors', 'high', '#EF4444'),
  ('Database', 'Database connection and query errors', 'critical', '#DC2626'),
  ('API', 'External API integration errors', 'medium', '#F59E0B'),
  ('UI/UX', 'Frontend user interface errors', 'low', '#6B7280'),
  ('File Processing', 'File upload and processing errors', 'medium', '#8B5CF6'),
  ('Workflow', 'N8N workflow execution errors', 'high', '#F97316'),
  ('Network', 'Network connectivity and timeout errors', 'medium', '#06B6D4'),
  ('Security', 'Security and permission related errors', 'critical', '#DC2626'),
  ('Performance', 'Performance and optimization issues', 'low', '#10B981'),
  ('Unknown', 'Uncategorized errors', 'medium', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_error_logs_risk_level ON error_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_error_logs_status ON error_logs(status);
CREATE INDEX IF NOT EXISTS idx_error_logs_category_id ON error_logs(category_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_assigned_to ON error_logs(assigned_to);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_resolutions_error_log_id ON error_resolutions(error_log_id);
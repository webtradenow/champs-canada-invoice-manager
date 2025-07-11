/*
  # Initial Database Schema for Champs Invoice Management System

  1. New Tables
    - `profiles` - User profile information extending Supabase auth.users
    - `retailers` - Retailer configuration and API settings
    - `invoices` - Invoice records with processing status
    - `sku_mappings` - Product SKU mappings across retailers
    - `invoice_items` - Individual line items for each invoice
    - `processing_logs` - Audit trail for invoice processing
    - `webhook_logs` - Webhook execution history
    - `user_sessions` - Track user login sessions

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Create admin, user, and viewer roles

  3. Functions
    - Auto-create profile on user signup
    - Update timestamps automatically
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'viewer');
CREATE TYPE invoice_status AS ENUM ('pending', 'processing', 'processed', 'error', 'success');
CREATE TYPE retailer_status AS ENUM ('active', 'inactive', 'maintenance');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  role user_role DEFAULT 'user',
  avatar_url text,
  company text DEFAULT 'Champs Canada Luggage and International',
  department text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Retailers table
CREATE TABLE IF NOT EXISTS retailers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  api_endpoint text,
  api_key text,
  webhook_url text,
  status retailer_status DEFAULT 'active',
  last_sync timestamptz,
  sync_frequency interval DEFAULT '1 hour',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  retailer_id uuid REFERENCES retailers(id) ON DELETE CASCADE,
  retailer text NOT NULL,
  amount decimal(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'CAD',
  status invoice_status DEFAULT 'pending',
  date date NOT NULL,
  due_date date,
  items_count integer DEFAULT 0,
  processing_time interval,
  error_message text,
  file_url text,
  processed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SKU Mappings table
CREATE TABLE IF NOT EXISTS sku_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id uuid REFERENCES retailers(id) ON DELETE CASCADE,
  retailer_sku text NOT NULL,
  internal_sku text NOT NULL,
  retailer text NOT NULL,
  product_name text NOT NULL,
  category text,
  price decimal(10,2) DEFAULT 0,
  cost decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  last_updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(retailer_id, retailer_sku)
);

-- Invoice Items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  sku_mapping_id uuid REFERENCES sku_mappings(id),
  retailer_sku text NOT NULL,
  internal_sku text,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Processing Logs table
CREATE TABLE IF NOT EXISTS processing_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  step text NOT NULL,
  status text NOT NULL,
  message text,
  execution_time interval,
  processed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Webhook Logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id uuid REFERENCES retailers(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL DEFAULT 'POST',
  payload jsonb,
  response_status integer,
  response_body text,
  execution_time interval,
  created_at timestamptz DEFAULT now()
);

-- User Sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address inet,
  user_agent text,
  login_at timestamptz DEFAULT now(),
  logout_at timestamptz,
  is_active boolean DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Retailers policies
CREATE POLICY "Authenticated users can view retailers" ON retailers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage retailers" ON retailers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Invoices policies
CREATE POLICY "Authenticated users can view invoices" ON invoices
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create invoices" ON invoices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update invoices" ON invoices
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete invoices" ON invoices
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- SKU Mappings policies
CREATE POLICY "Authenticated users can view sku_mappings" ON sku_mappings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage sku_mappings" ON sku_mappings
  FOR ALL TO authenticated USING (true);

-- Invoice Items policies
CREATE POLICY "Authenticated users can view invoice_items" ON invoice_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage invoice_items" ON invoice_items
  FOR ALL TO authenticated USING (true);

-- Processing Logs policies
CREATE POLICY "Authenticated users can view processing_logs" ON processing_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert processing_logs" ON processing_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Webhook Logs policies
CREATE POLICY "Admins can view webhook_logs" ON webhook_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert webhook_logs" ON webhook_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- User Sessions policies
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage user_sessions" ON user_sessions
  FOR ALL TO authenticated USING (true);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER retailers_updated_at BEFORE UPDATE ON retailers
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER sku_mappings_updated_at BEFORE UPDATE ON sku_mappings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert default retailers
INSERT INTO retailers (name, code, api_endpoint, status) VALUES
  ('Wholesaler A', 'WA', 'https://api.wholesaler-a.com', 'active'),
  ('Wholesaler B', 'WB', 'https://api.wholesaler-b.com', 'active'),
  ('Wholesaler C', 'WC', 'https://api.wholesaler-c.com', 'active'),
  ('Wholesaler D', 'WD', 'https://api.wholesaler-d.com', 'active')
ON CONFLICT (code) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_retailer_id ON invoices(retailer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date);
CREATE INDEX IF NOT EXISTS idx_sku_mappings_retailer_id ON sku_mappings(retailer_id);
CREATE INDEX IF NOT EXISTS idx_sku_mappings_retailer_sku ON sku_mappings(retailer_sku);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_processing_logs_invoice_id ON processing_logs(invoice_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_retailer_id ON webhook_logs(retailer_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
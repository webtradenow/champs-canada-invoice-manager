/*
  # Fix Profiles RLS Infinite Recursion

  1. Problem
    - RLS policies for profiles table cause infinite recursion
    - Admin policies query profiles table within the policy itself
    - This creates a recursive loop during policy evaluation

  2. Solution
    - Create a SECURITY DEFINER function to check admin role
    - Update admin policies to use this function instead of direct queries
    - Function bypasses RLS when executed, preventing recursion

  3. Changes
    - Add is_admin() function with SECURITY DEFINER
    - Update "Admins can view all profiles" policy
    - Update "Admins can update all profiles" policy
*/

-- Create a security definer function to check if current user is admin
-- This function bypasses RLS when executed, preventing infinite recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the problematic admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Recreate admin policies using the security definer function
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());
/*
  # Disable Email Confirmation for Development

  This migration disables email confirmation requirements to allow
  immediate user registration and login during development/testing.https://supabase.com/dashboard/project/bnzijphoaacmvyuptzuf/auth/users

  Note: This should only be used in development environments.
  For production, email confirmation should be enabled.
*/

-- Update auth configuration to disable email confirmation
-- Note: This requires admin privileges and may need to be done via Supabase Dashboard

-- For now, we'll create a note that this needs to be done manually
-- since auth.config changes require admin access

-- Manual steps required:
-- 1. Go to Supabase Dashboard > Authentication > Settings
-- 2. Under "User Signups" section
-- 3. Disable "Enable email confirmations"
-- 4. Save the changes

-- Alternative: Use Supabase CLI or Admin API if available
-- But for immediate fix, dashboard method is recommended

-- This file serves as documentation of the required change
SELECT 'Email confirmation needs to be disabled in Supabase Dashboard' as instruction;
/*
  # Create Admin User Profile

  1. Purpose
    - Ensure mike@inzinc.ca user has an admin profile
    - Create profile if user exists in auth.users but not in profiles
    - Set admin role and activate account

  2. Security
    - Only creates profile, doesn't create auth user
    - Sets proper admin permissions
    - Ensures user is active
*/

-- Create profile for mike@inzinc.ca if the user exists in auth.users
INSERT INTO profiles (
  id, 
  email, 
  first_name, 
  last_name, 
  role, 
  is_active,
  company,
  department
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'Mike'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'Admin'),
  'admin'::user_role,
  true,
  'Champs Canada Luggage and International',
  'Administration'
FROM auth.users au
WHERE au.email = 'mike@inzinc.ca'
  AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = au.id
  );

-- Update existing profile to admin if it exists but isn't admin
UPDATE profiles 
SET 
  role = 'admin'::user_role,
  is_active = true,
  company = COALESCE(company, 'Champs Canada Luggage and International'),
  department = COALESCE(department, 'Administration'),
  updated_at = now()
WHERE email = 'mike@inzinc.ca' 
  AND role != 'admin';

-- Verify the admin user exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE email = 'mike@inzinc.ca' AND role = 'admin'
  ) THEN
    RAISE NOTICE 'Admin user mike@inzinc.ca not found in auth.users table. User must sign up first.';
  ELSE
    RAISE NOTICE 'Admin user mike@inzinc.ca profile created/updated successfully.';
  END IF;
END $$;
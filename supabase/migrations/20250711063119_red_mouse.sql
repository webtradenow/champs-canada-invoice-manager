/*
  # Add get_table_count function

  1. New Function
    - `get_table_count()` - Returns the count of tables in the public schema

  2. Security
    - Function is accessible to authenticated users
    - Uses SECURITY DEFINER to bypass RLS for system queries
*/

-- Create function to get table count
CREATE OR REPLACE FUNCTION get_table_count()
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_table_count() TO authenticated;
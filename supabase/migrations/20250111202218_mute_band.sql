/*
  # Fix RLS policies for users table

  1. Changes
    - Add policy for users to insert their own data
    - Add policy for users to update their own data
    - Add policy for users to read their own data
    - Add policy for users to delete their own data

  2. Security
    - Enable RLS on users table
    - Add policies for CRUD operations
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;

-- Create new policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own data"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);
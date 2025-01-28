/*
  # Create instances table and policies

  1. New Tables
    - `instances`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `whatsapp` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `instances` table
    - Add policies for authenticated users to:
      - Read their own instances
      - Insert their own instances
      - Update their own instances
      - Delete their own instances
*/

-- Create instances table first
CREATE TABLE IF NOT EXISTS instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  whatsapp text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure RLS is enabled
ALTER TABLE instances ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read own instances" ON instances;
DROP POLICY IF EXISTS "Users can insert own instances" ON instances;
DROP POLICY IF EXISTS "Users can update own instances" ON instances;
DROP POLICY IF EXISTS "Users can delete own instances" ON instances;

-- Recreate policies with proper access controls
CREATE POLICY "Users can read own instances"
  ON instances
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own instances"
  ON instances
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instances"
  ON instances
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own instances"
  ON instances
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure the updated_at trigger exists
DROP TRIGGER IF EXISTS update_instances_updated_at ON instances;
CREATE TRIGGER update_instances_updated_at
  BEFORE UPDATE ON instances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
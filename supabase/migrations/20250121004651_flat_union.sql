/*
  # Fix instances table and policies

  1. Changes
    - Create instances table if it doesn't exist
    - Enable RLS
    - Create policies only if they don't exist
    - Add updated_at trigger
*/

-- Create instances table
CREATE TABLE IF NOT EXISTS instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  whatsapp text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE instances ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'instances' AND policyname = 'Users can read own instances'
  ) THEN
    CREATE POLICY "Users can read own instances"
      ON instances
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'instances' AND policyname = 'Users can insert own instances'
  ) THEN
    CREATE POLICY "Users can insert own instances"
      ON instances
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'instances' AND policyname = 'Users can update own instances'
  ) THEN
    CREATE POLICY "Users can update own instances"
      ON instances
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'instances' AND policyname = 'Users can delete own instances'
  ) THEN
    CREATE POLICY "Users can delete own instances"
      ON instances
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_instances_updated_at'
  ) THEN
    CREATE TRIGGER update_instances_updated_at
      BEFORE UPDATE ON instances
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
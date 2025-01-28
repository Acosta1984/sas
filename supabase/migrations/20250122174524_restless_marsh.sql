/*
  # Add plans table and default plans with checks

  1. Changes
    - Check if plans table exists before creating
    - Check if trigger exists before creating
    - Add default plans with numeric prices
  2. Security
    - Enable RLS
    - Add policy for reading plans
*/

-- Create plans table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'plans') THEN
    CREATE TABLE plans (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      price numeric NOT NULL,
      features text[] NOT NULL DEFAULT '{}',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can read plans" ON plans;

-- Create policy for reading plans
CREATE POLICY "Anyone can read plans"
  ON plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default plans with numeric prices if table is empty
INSERT INTO plans (name, price, features)
SELECT name, price, features
FROM (VALUES
  (
    'Básico',
    49.90,
    ARRAY['1 Instância', 'Suporte básico', 'Recursos essenciais']
  ),
  (
    'Profissional',
    99.90,
    ARRAY['5 Instâncias', 'Suporte prioritário', 'Recursos avançados']
  ),
  (
    'Empresarial',
    199.90,
    ARRAY['Instâncias ilimitadas', 'Suporte 24/7', 'Recursos exclusivos']
  )
) AS new_plans(name, price, features)
WHERE NOT EXISTS (SELECT 1 FROM plans LIMIT 1);

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_plans_updated_at'
  ) THEN
    CREATE TRIGGER update_plans_updated_at
      BEFORE UPDATE ON plans
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
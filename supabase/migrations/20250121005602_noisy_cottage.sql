/*
  # Link tables to user

  1. Changes
    - Add user_id foreign key to all relevant tables
    - Add RLS policies to ensure data isolation
    - Add triggers for automatic user_id assignment
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_plans table to track user subscriptions
CREATE TABLE IF NOT EXISTS user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES plans(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, plan_id)
);

-- Add default plans
INSERT INTO plans (name, price, features) VALUES
  ('Básico', 49.90, ARRAY['1 Instância', 'Suporte básico', 'Recursos essenciais']),
  ('Profissional', 99.90, ARRAY['5 Instâncias', 'Suporte prioritário', 'Recursos avançados']),
  ('Empresarial', 199.90, ARRAY['Instâncias ilimitadas', 'Suporte 24/7', 'Recursos exclusivos'])
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for plans
CREATE POLICY "Everyone can read plans"
  ON plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_plans
CREATE POLICY "Users can read own plans"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create triggers
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON user_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
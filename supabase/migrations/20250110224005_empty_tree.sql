/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - mercado_pago_config
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - access_token (text)
      - public_key (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - leads
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - title (text)
      - full_name (text)
      - email (text)
      - whatsapp (text)
      - address (text)
      - number (text)
      - city (text)
      - state (text)
      - company (text)
      - value (numeric)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - lead_flows
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - title (text)
      - order (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - lead_flow_items
      - id (uuid, primary key)
      - lead_id (uuid, foreign key)
      - flow_id (uuid, foreign key)
      - order (integer)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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

-- Create mercado_pago_config table
CREATE TABLE mercado_pago_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  access_token text NOT NULL,
  public_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mercado_pago_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own mercado pago config"
  ON mercado_pago_config
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mercado pago config"
  ON mercado_pago_config
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mercado pago config"
  ON mercado_pago_config
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create leads table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  whatsapp text NOT NULL,
  address text,
  number text,
  city text,
  state text,
  company text,
  value numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
  ON leads
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create lead_flows table
CREATE TABLE lead_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lead_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own lead flows"
  ON lead_flows
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lead flows"
  ON lead_flows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lead flows"
  ON lead_flows
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lead flows"
  ON lead_flows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create lead_flow_items table
CREATE TABLE lead_flow_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  flow_id uuid REFERENCES lead_flows(id) ON DELETE CASCADE,
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lead_flow_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own lead flow items"
  ON lead_flow_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_flow_items.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own lead flow items"
  ON lead_flow_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_flow_items.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own lead flow items"
  ON lead_flow_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_flow_items.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own lead flow items"
  ON lead_flow_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_flow_items.lead_id
      AND leads.user_id = auth.uid()
    )
  );

-- Create functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mercado_pago_config_updated_at
  BEFORE UPDATE ON mercado_pago_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_flows_updated_at
  BEFORE UPDATE ON lead_flows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_flow_items_updated_at
  BEFORE UPDATE ON lead_flow_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
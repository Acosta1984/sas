/*
  # Add Agent and Connection Tables

  1. New Tables
    - `agents`
      - Links to users and stores agent configuration
      - Stores name and prompt for each agent
    - `agent_connections`
      - Links agents to instances
      - Tracks connection status and history

  2. Changes
    - Added foreign key relationships to users table
    - Added RLS policies for security

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
*/

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  prompt text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agent_connections table
CREATE TABLE IF NOT EXISTS agent_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  instance_id uuid REFERENCES instances(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  last_connected timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, instance_id)
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for agents
CREATE POLICY "Users can read own agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agents"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents"
  ON agents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for agent_connections
CREATE POLICY "Users can read own agent connections"
  ON agent_connections
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_connections.agent_id
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent connections"
  ON agent_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_connections.agent_id
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own agent connections"
  ON agent_connections
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_connections.agent_id
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own agent connections"
  ON agent_connections
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_connections.agent_id
      AND agents.user_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_connections_updated_at
  BEFORE UPDATE ON agent_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
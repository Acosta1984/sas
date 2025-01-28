export interface Instance {
  id?: string;
  user_id: string;
  name: string;
  whatsapp: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  agent_connections?: AgentConnection[];
}

export interface Agent {
  id?: string;
  user_id: string;
  name: string;
  prompt: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  connections?: AgentConnection[];
}

export interface AgentConnection {
  id?: string;
  agent_id: string;
  instance_id: string;
  status?: string;
  last_connected?: string;
  created_at?: string;
  updated_at?: string;
  agent?: Agent;
  instance?: Instance;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  data?: {
    image?: string;
    image_base64?: string;
    image_url?: string;
    [key: string]: any;
  };
}

export interface ConnectionStatus {
  data: {
    profileName: string | null;
    profilePicUrl: string | null;
    number: string;
    connectionStatus: string;
  }[];
}

export interface Lead {
  id: string;
  user_id: string;
  title: string;
  fullName: string;
  email: string;
  whatsapp: string;
  address: string;
  number: string;
  city: string;
  state: string;
  company: string;
  value: number;
  contact: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  leadIds: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: number | string;
  features: string[];
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date?: string;
  plan?: Plan;
}
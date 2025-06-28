export interface Assistant {
  id: 'alice' | 'bob' | 'charlie';
  name: string;
  role: string;
  description: string;
  avatar: string;
  specialties: string[];
  status: 'online' | 'busy' | 'offline';
}

export interface ChatMessage {
  id: string;
  content: string;
  messageType: 'user' | 'assistant';
  timestamp: string;
  toolsUsed?: string[];
  confidence?: number;
  metadata?: {
    contextUsed: boolean;
    fallbackLevel: string;
  };
}

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
  lastActivity: string;
}

export interface NetworkStats {
  tps: number;
  gasUsed: number;
  timestamp: string;
}

export interface GasPrice {
  arbitrum: number;
  ethereum: number;
  timestamp: string;
}

export interface TopContract {
  name: string;
  address: string;
  txCount: number;
  icon: string;
}

export interface WhaleActivity {
  type: string;
  amount: string;
  timestamp: string;
}

export interface ChatResponse {
  response: string;
  toolsUsed: string[];
  sessionId: string;
  confidence: number;
  metadata: {
    contextUsed: boolean;
    fallbackLevel: string;
  };
}

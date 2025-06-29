export interface User {
  id: 'user-001' | 'user-002' | 'user-003';
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  description?: string;
}

export interface ToolUsage {
  name: string;
  arguments?: any;
  result?: any;
}

export interface ChatMessage {
  id: string;
  content: string;
  messageType: 'user' | 'assistant';
  timestamp: string;
  toolsUsed?: (string | ToolUsage)[];
  confidence?: number;
  metadata?: {
    contextUsed: boolean;
    fallbackLevel: string;
    originalError?: string;
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

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  size: number;
  color: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  weight: number;
  color?: string;
}

export interface GraphVisualization {
  nodes: GraphNode[];
  edges: GraphEdge[];
  layout: 'force' | 'hierarchical';
  metadata: {
    totalNodes: number;
    totalEdges: number;
  };
}

export interface GraphInsights {
  userProfile: any;
  topTools: Array<{ tool: string; usage: number }>;
  relationshipStrength: Array<{ target: string; strength: number }>;
  recommendations: string[];
}

export interface SimilarConversation {
  id: string;
  score: number;
  content: string;
}

export interface ContextData {
  contextItems: any[];
  similarQueries: any[];
}

export interface FailsafeStats {
  cachedResponseCount: number;
  topCachedQueries: any[];
}

export interface FailsafeResponse {
  success: boolean;
  response: string;
  fallbackLevel: string;
  confidence: number;
}

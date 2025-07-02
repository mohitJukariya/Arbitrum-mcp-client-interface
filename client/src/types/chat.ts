export interface User {
  id: 'user-001' | 'user-002' | 'user-003';
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  description?: string;
}

// New personality interface
export interface UserPersonality {
  id: string;              // "alice", "bob", "charlie"
  name: string;            // "Alice"
  title: string;           // "DeFi Trader & Gas Optimizer"
  description: string;     // Brief description
  avatar: string;          // "/avatars/alice.png"
  expertise: string[];     // ["gas_optimization", "trading", ...]
  focusAreas: string;      // "Gas prices, trading optimization"
  status: 'online' | 'busy' | 'offline';
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
  personality?: string;  // NEW: personality that generated the response
  metadata?: {
    contextUsed: boolean;
    fallbackLevel: string;
    originalError?: string;
  };
}

export interface ChatResponse {
  response: string;
  toolsUsed: (string | ToolUsage)[];
  sessionId: string;
  confidence: number;
  personality?: string;  // NEW: personality that generated the response
  metadata: {
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

export interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'query' | 'tool' | 'insight' | 'address' | 'pattern' | 'other';
  properties: Record<string, any>;  // NEW: Full properties from backend
  size: number;
  color: string;
}

export interface GraphEdge {
  id: string;                       // NEW: Unique edge ID from backend
  from: string;
  to: string;
  label: string;
  type: 'QUERIES' | 'USED_TOOL' | 'GENERATED_INSIGHT' | 'INVOLVES_ADDRESS' | 'RELATED_TO' | 'LEARNED_PATTERN' | 'HAS_QUERY';
  weight: number;
  color: string;
}

export interface GraphMetadata {
  totalNodes: number;
  totalEdges: number;
  userCount: number;
  toolCount: number;
  queryCount: number;
  insightCount: number;
  addressCount: number;
  generatedAt: string;
  userId: string;
  isFallbackData?: boolean;  // Optional flag to indicate fallback data
}

export interface GraphVisualization {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;          // NEW: Enhanced metadata
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

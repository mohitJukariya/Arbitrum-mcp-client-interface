import { ChatResponse, NetworkStats, GasPrice, TopContract, WhaleActivity, GraphVisualization, GraphInsights, SimilarConversation, ContextData, FailsafeStats, FailsafeResponse } from '@/types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mcpclient-production.up.railway.app';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making API request to:', url);
  console.log('Request options:', options);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new ApiError(response.status, `API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

export const chatApi = {
  sendMessage: async (message: string, userId: string, sessionId?: string): Promise<ChatResponse> => {
    try {
      console.log('Sending chat message:', { message, userId, sessionId });
      const response = await apiRequest<any>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      console.log('Chat API success:', response);

      // Ensure the response has the expected ChatResponse structure
      const normalizedResponse = {
        response: response.response || response.message || "No response received",
        toolsUsed: [],
        sessionId: response.sessionId || sessionId || 'session-' + Date.now(),
        confidence: response.confidence || 0.8,
        metadata: response.metadata || { contextUsed: false, fallbackLevel: 'api-response' }
      };

      // Handle toolsUsed safely - preserve full tool objects
      if (Array.isArray(response.toolsUsed)) {
        normalizedResponse.toolsUsed = response.toolsUsed.map((tool: any) => {
          if (typeof tool === 'string') {
            return tool;
          } else if (tool && typeof tool === 'object' && tool.name) {
            // Return the full tool object with name, arguments, and result
            return {
              name: tool.name,
              arguments: tool.arguments || undefined,
              result: tool.result || undefined
            };
          } else {
            return 'unknown-tool';
          }
        });
      }

      console.log('Normalized response:', normalizedResponse);
      return normalizedResponse;
    } catch (error) {
      console.error('Chat API error details:', error);

      // Check if it's a network error or server error
      if (error instanceof ApiError) {
        console.warn(`Chat API failed with status ${error.status}:`, error.message);
      } else {
        console.warn('Chat API network error:', error);
      }

      // Return a fallback response
      return {
        response: `I'm sorry, I'm having trouble connecting to the backend right now. 

**Connection Details:**
- API URL: ${API_BASE_URL}/api/chat
- Error: ${error instanceof Error ? error.message : 'Unknown error'}

This is a fallback response to ensure the frontend remains functional. Please check that the backend service is running properly.`,
        toolsUsed: ['fallback-system'],
        sessionId: sessionId || 'fallback-session-' + Date.now(),
        confidence: 0.5,
        metadata: {
          contextUsed: false,
          fallbackLevel: 'frontend-fallback',
        }
      };
    }
  },

  getChatHistory: async (sessionId: string) => {
    try {
      return await apiRequest(`/chat/history/${sessionId}`);
    } catch (error) {
      console.warn('Chat history API unavailable:', error);
      return [];
    }
  },
};

export const contextApi = {
  getGraphVisualization: async (userId?: string): Promise<GraphVisualization> => {
    try {
      const endpoint = userId ? `/context/graph/visualization/${userId}` : '/context/graph/visualization';
      return await apiRequest<GraphVisualization>(endpoint);
    } catch (error) {
      console.warn('Using fallback graph data:', error);

      // For user-specific graphs, filter to show only relevant nodes and edges
      if (userId) {
        const filteredNodes = fallbackData.graphVisualization.nodes.filter(node =>
          node.id === userId || node.type !== 'user' // Keep the selected user and all non-user nodes (tools, queries, etc.)
        );

        // Get all node IDs that exist after filtering
        const nodeIds = new Set(filteredNodes.map(node => node.id));

        // Filter edges to only include connections between existing nodes
        const filteredEdges = fallbackData.graphVisualization.edges.filter(edge =>
          nodeIds.has(edge.from) && nodeIds.has(edge.to)
        );

        return {
          ...fallbackData.graphVisualization,
          nodes: filteredNodes,
          edges: filteredEdges,
          metadata: {
            totalNodes: filteredNodes.length,
            totalEdges: filteredEdges.length
          }
        };
      }

      // For global graph, return all data
      return fallbackData.graphVisualization;
    }
  },

  getGraphInsights: async (userId: string): Promise<GraphInsights> => {
    try {
      return await apiRequest<GraphInsights>(`/context/graph/insights/${userId}`);
    } catch (error) {
      console.warn('Using fallback insights data:', error);
      return fallbackData.graphInsights;
    }
  },

  getKVData: async (key: string) => {
    return apiRequest(`/context/storage/kv/${key}`);
  },

  setKVData: async (key: string, value: any) => {
    return apiRequest('/context/storage/kv', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  },

  deleteKVData: async (key: string) => {
    return apiRequest(`/context/storage/kv/${key}`, {
      method: 'DELETE',
    });
  },
};

export const embeddingsApi = {
  searchSimilar: async (query: string, userId?: string, limit?: number): Promise<SimilarConversation[]> => {
    return apiRequest<SimilarConversation[]>('/embeddings/search', {
      method: 'POST',
      body: JSON.stringify({ query, userId, limit }),
    });
  },

  getContext: async (query: string): Promise<ContextData> => {
    return apiRequest<ContextData>(`/embeddings/context/${encodeURIComponent(query)}`);
  },
};

export const failsafeApi = {
  testFallback: async (query: string): Promise<FailsafeResponse> => {
    return apiRequest<FailsafeResponse>(`/failsafe/test-fallback?query=${encodeURIComponent(query)}`);
  },

  getStats: async (): Promise<FailsafeStats> => {
    return apiRequest<FailsafeStats>('/failsafe/stats');
  },
};

export const analyticsApi = {
  getGasPrices: async (): Promise<GasPrice> => {
    return apiRequest<GasPrice>('/analytics/gas-prices');
  },

  getNetworkStats: async (): Promise<NetworkStats> => {
    return apiRequest<NetworkStats>('/analytics/network-stats');
  },

  getTopContracts: async (): Promise<TopContract[]> => {
    return apiRequest<TopContract[]>('/analytics/top-contracts');
  },

  getWhaleActivity: async (): Promise<WhaleActivity[]> => {
    return apiRequest<WhaleActivity[]>('/analytics/whale-activity');
  },

  checkHealth: async () => {
    return apiRequest('/health');
  },
};

// Fallback data for when API is unavailable
export const fallbackData = {
  gasPrice: {
    arbitrum: 0.1,
    ethereum: 25.4,
    timestamp: new Date().toISOString(),
  },
  networkStats: {
    tps: 2847,
    gasUsed: 68.2,
    timestamp: new Date().toISOString(),
  },
  topContracts: [
    { name: 'Uniswap V3', address: '0x1f98...c73e', txCount: 1247, icon: 'cube' },
    { name: '1inch Router', address: '0x1111...567b', txCount: 894, icon: 'exchange-alt' },
    { name: 'Arbitrum Bridge', address: '0x8315...bc21', txCount: 623, icon: 'coins' },
  ],
  whaleActivity: [
    { type: 'Large ETH Transfer', amount: '1,250 ETH', timestamp: new Date().toISOString() },
    { type: 'USDC Swap', amount: '500K USDC', timestamp: new Date().toISOString() },
    { type: 'ARB Accumulation', amount: '2.1M ARB', timestamp: new Date().toISOString() },
  ],
  graphVisualization: {
    nodes: [
      // Users - larger nodes with distinct colors
      { id: 'user-001', label: 'Alice (Trader)', type: 'user', size: 12, color: '#4f46e5' },
      { id: 'user-002', label: 'Bob (Developer)', type: 'user', size: 10, color: '#059669' },
      { id: 'user-003', label: 'Charlie (Analyst)', type: 'user', size: 11, color: '#dc2626' },

      // Tools - medium sized nodes
      { id: 'gas-tool', label: 'Gas Price Tool', type: 'tool', size: 8, color: '#f59e0b' },
      { id: 'contract-tool', label: 'Contract Analyzer', type: 'tool', size: 7, color: '#8b5cf6' },
      { id: 'whale-tracker', label: 'Whale Tracker', type: 'tool', size: 6, color: '#06b6d4' },
      { id: 'defi-tool', label: 'DeFi Analytics', type: 'tool', size: 5, color: '#10b981' },

      // Queries - smaller nodes
      { id: 'query-1', label: 'Gas optimization', type: 'query', size: 4, color: '#64748b' },
      { id: 'query-2', label: 'Contract debugging', type: 'query', size: 4, color: '#64748b' },
      { id: 'query-3', label: 'Whale movements', type: 'query', size: 4, color: '#64748b' },
      { id: 'query-4', label: 'Arbitrage opportunities', type: 'query', size: 3, color: '#64748b' },

      // Data nodes
      { id: 'arbitrum-chain', label: 'Arbitrum Chain', type: 'blockchain', size: 9, color: '#2563eb' },
      { id: 'ethereum-chain', label: 'Ethereum Chain', type: 'blockchain', size: 8, color: '#6366f1' },
    ],
    edges: [
      // User to tool connections
      { from: 'user-001', to: 'gas-tool', label: 'uses frequently', weight: 4, color: '#f59e0b' },
      { from: 'user-001', to: 'defi-tool', label: 'explores', weight: 2, color: '#10b981' },
      { from: 'user-002', to: 'contract-tool', label: 'debugs with', weight: 5, color: '#8b5cf6' },
      { from: 'user-002', to: 'gas-tool', label: 'optimizes', weight: 3, color: '#f59e0b' },
      { from: 'user-003', to: 'whale-tracker', label: 'monitors', weight: 6, color: '#06b6d4' },
      { from: 'user-003', to: 'defi-tool', label: 'analyzes', weight: 3, color: '#10b981' },

      // User to query connections
      { from: 'user-001', to: 'query-1', label: 'asks', weight: 3, color: '#64748b' },
      { from: 'user-001', to: 'query-4', label: 'seeks', weight: 2, color: '#64748b' },
      { from: 'user-002', to: 'query-2', label: 'debugs', weight: 4, color: '#64748b' },
      { from: 'user-003', to: 'query-3', label: 'tracks', weight: 5, color: '#64748b' },

      // Tool to query responses
      { from: 'gas-tool', to: 'query-1', label: 'provides data', weight: 3, color: '#64748b' },
      { from: 'contract-tool', to: 'query-2', label: 'analyzes', weight: 4, color: '#64748b' },
      { from: 'whale-tracker', to: 'query-3', label: 'detects', weight: 5, color: '#64748b' },
      { from: 'defi-tool', to: 'query-4', label: 'identifies', weight: 2, color: '#64748b' },

      // Chain connections
      { from: 'arbitrum-chain', to: 'gas-tool', label: 'feeds', weight: 2, color: '#2563eb' },
      { from: 'arbitrum-chain', to: 'contract-tool', label: 'provides', weight: 3, color: '#2563eb' },
      { from: 'ethereum-chain', to: 'whale-tracker', label: 'monitors', weight: 4, color: '#6366f1' },
      { from: 'ethereum-chain', to: 'defi-tool', label: 'tracks', weight: 2, color: '#6366f1' },

      // Inter-user connections
      { from: 'user-001', to: 'user-002', label: 'collaborates', weight: 2, color: '#94a3b8' },
      { from: 'user-002', to: 'user-003', label: 'shares insights', weight: 3, color: '#94a3b8' },
    ],
    layout: 'force' as const,
    metadata: { totalNodes: 13, totalEdges: 20 }
  },
  graphInsights: {
    userProfile: { experience: 'intermediate', focus: 'trading' },
    topTools: [
      { tool: 'Gas Price Tool', usage: 15 },
      { tool: 'Contract Analyzer', usage: 8 },
      { tool: 'Whale Tracker', usage: 12 }
    ],
    relationshipStrength: [
      { target: 'user-002', strength: 0.7 },
      { target: 'user-003', strength: 0.5 }
    ],
    recommendations: [
      'Try using the DeFi analyzer for better trading insights',
      'Consider exploring cross-chain analysis tools'
    ]
  }
};

import { ChatResponse, NetworkStats, GasPrice, TopContract, WhaleActivity, GraphVisualization, GraphNode, GraphEdge, GraphMetadata, GraphInsights, SimilarConversation, ContextData, FailsafeStats, FailsafeResponse, UserPersonality } from '@/types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mcpclient-production.up.railway.app';

// Helper functions to extract data from chat responses
function extractAddressesFromResponse(response: string): string[] {
  const addressPattern = /0x[a-fA-F0-9]{40}/g;
  const matches = response.match(addressPattern);
  return matches ? Array.from(new Set(matches)) : [];
}

function extractInsightsFromResponse(response: string): Array<{ content: string, confidence: number }> {
  // Simple insight extraction - can be enhanced
  const insights: Array<{ content: string, confidence: number }> = [];

  if (response.toLowerCase().includes('balance')) {
    insights.push({
      content: 'User interested in balance checking',
      confidence: 0.8
    });
  }

  if (response.toLowerCase().includes('gas')) {
    insights.push({
      content: 'User interested in gas optimization',
      confidence: 0.8
    });
  }

  if (response.toLowerCase().includes('transaction')) {
    insights.push({
      content: 'User interested in transaction analysis',
      confidence: 0.7
    });
  }

  return insights;
}

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
  sendMessage: async (message: string, userId: string, sessionId?: string, personalityId?: string): Promise<ChatResponse> => {
    try {
      console.log('Sending chat message:', { message, userId, sessionId, personalityId });
      const requestBody: any = { message };

      // Add optional parameters
      if (sessionId) requestBody.sessionId = sessionId;
      if (userId) requestBody.userId = userId;
      if (personalityId) requestBody.personalityId = personalityId;

      const response = await apiRequest<any>('/api/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      console.log('Chat API success:', response);

      // Ensure the response has the expected ChatResponse structure
      const normalizedResponse = {
        response: response.response || response.message || "No response received",
        toolsUsed: [],
        sessionId: response.sessionId || sessionId || 'session-' + Date.now(),
        confidence: response.confidence || 0.8,
        personality: response.personality, // NEW: Include personality in response
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

      // Store context data to backend after successful chat response
      try {
        console.log('=== STORING CONTEXT DATA ===');
        console.log('User ID:', userId);
        console.log('Query:', message);
        console.log('Tools used:', normalizedResponse.toolsUsed);
        console.log('Addresses:', extractAddressesFromResponse(normalizedResponse.response));
        console.log('Insights:', extractInsightsFromResponse(normalizedResponse.response));

        const contextPayload = {
          query: message,
          toolsUsed: normalizedResponse.toolsUsed || [],
          addressesInvolved: extractAddressesFromResponse(normalizedResponse.response),
          insights: extractInsightsFromResponse(normalizedResponse.response),
          metadata: {
            sessionId: normalizedResponse.sessionId,
            timestamp: new Date().toISOString(),
            confidence: normalizedResponse.confidence,
            personality: normalizedResponse.personality
          }
        };

        console.log('Context payload being sent:', contextPayload);

        const contextResult = await contextApi.storeUserContext(userId, contextPayload);
        console.log('Context storage result:', contextResult);
        console.log('=== CONTEXT STORED SUCCESSFULLY ===');
      } catch (contextError) {
        console.error('=== CONTEXT STORAGE FAILED ===');
        console.error('Error:', contextError);
        console.error('User ID:', userId);
        console.error('Message:', message);
        // Continue anyway - context storage failure shouldn't break chat
      }

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

export const personalityApi = {
  getAllPersonalities: async (): Promise<UserPersonality[]> => {
    try {
      return await apiRequest<UserPersonality[]>('/personalities');
    } catch (error) {
      console.warn('Using fallback personality data:', error);
      // Fallback data that matches the new personality structure
      return [
        {
          id: 'alice',
          name: 'Alice',
          title: 'DeFi Trader & Gas Optimizer',
          description: 'Focuses on gas prices, trading optimization, and DeFi strategies',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=b6e3f4',
          expertise: ['gas_optimization', 'trading', 'defi', 'arbitrage'],
          focusAreas: 'Gas prices, trading optimization',
          status: 'online'
        },
        {
          id: 'bob',
          name: 'Bob',
          title: 'Smart Contract Developer',
          description: 'Expert in contract interactions, debugging, and ABIs',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob&backgroundColor=c084fc',
          expertise: ['smart_contracts', 'debugging', 'abi', 'solidity'],
          focusAreas: 'Contract interactions, debugging, ABIs',
          status: 'online'
        },
        {
          id: 'charlie',
          name: 'Charlie',
          title: 'Blockchain Analyst & Whale Tracker',
          description: 'Specializes in whale tracking and transaction analysis',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=fbbf24',
          expertise: ['whale_tracking', 'transaction_analysis', 'on_chain_analysis'],
          focusAreas: 'Whale tracking, transaction analysis',
          status: 'online'
        }
      ];
    }
  },

  getPersonality: async (id: string): Promise<UserPersonality | null> => {
    try {
      return await apiRequest<UserPersonality>(`/personalities/${id}`);
    } catch (error) {
      console.warn('Personality API unavailable, using fallback:', error);
      const personalities = await personalityApi.getAllPersonalities();
      return personalities.find(p => p.id === id) || null;
    }
  },
};

export const contextApi = {
  getGraphVisualization: async (userId?: string): Promise<GraphVisualization> => {
    try {
      const endpoint = userId
        ? `/api/context/graph/visualization?userId=${userId}`
        : '/api/context/graph/visualization';
      console.log('=== FETCHING GRAPH VISUALIZATION ===');
      console.log('Endpoint:', endpoint);
      console.log('User ID:', userId || 'global');

      const response = await apiRequest<GraphVisualization>(endpoint);
      console.log('=== GRAPH API RESPONSE ===');
      console.log('Response:', response);
      console.log('Nodes:', response.nodes?.length || 0);
      console.log('Edges:', response.edges?.length || 0);
      console.log('Metadata:', response.metadata);
      return response;
    } catch (error) {
      console.warn('=== GRAPH API FAILED, USING FALLBACK ===');
      console.warn('Error:', error);
      console.warn('User ID:', userId || 'global');

      // Enhanced fallback data with backend API structure that differs by user
      const fallbackNodes: GraphNode[] = [];
      const fallbackEdges: GraphEdge[] = [];

      if (userId === 'alice') {
        // Alice-specific graph (DeFi Trader)
        fallbackNodes.push(
          {
            id: "alice",
            label: "Alice (Trader)",
            type: "user",
            properties: {
              id: "alice",
              name: "Alice (Trader)",
              role: "trader",
              lastActivity: new Date().toISOString()
            },
            size: 40,
            color: "#2196F3"
          },
          {
            id: "alice-query-gas",
            label: "What's the current gas price?",
            type: "query",
            properties: {
              id: "alice-query-gas",
              content: "What's the current gas price?",
              timestamp: new Date().toISOString(),
              confidence: 0.9
            },
            size: 25,
            color: "#4CAF50"
          },
          {
            id: "tool-gas-tracker",
            label: "Gas Price Tracker",
            type: "tool",
            properties: {
              id: "tool-gas-tracker",
              name: "Gas Price Tracker",
              category: "defi"
            },
            size: 30,
            color: "#FF5722"
          },
          {
            id: "insight-gas-optimization",
            label: "Gas optimization strategy",
            type: "insight",
            properties: {
              id: "insight-gas-optimization",
              content: "Gas optimization strategy for DeFi trades",
              confidence: 0.85
            },
            size: 20,
            color: "#9C27B0"
          }
        );

        fallbackEdges.push(
          {
            id: "alice-to-query-gas",
            from: "alice",
            to: "alice-query-gas",
            label: "asked",
            type: "QUERIES",
            weight: 1.0,
            color: "#4CAF50"
          },
          {
            id: "query-gas-to-tool",
            from: "alice-query-gas",
            to: "tool-gas-tracker",
            label: "used",
            type: "USED_TOOL",
            weight: 1.0,
            color: "#FF5722"
          },
          {
            id: "query-to-insight",
            from: "alice-query-gas",
            to: "insight-gas-optimization",
            label: "learned",
            type: "GENERATED_INSIGHT",
            weight: 1.0,
            color: "#9C27B0"
          }
        );
      } else if (userId === 'bob') {
        // Bob-specific graph (Smart Contract Developer)
        fallbackNodes.push(
          {
            id: "bob",
            label: "Bob (Developer)",
            type: "user",
            properties: {
              id: "bob",
              name: "Bob (Developer)",
              role: "developer",
              lastActivity: new Date().toISOString()
            },
            size: 40,
            color: "#2196F3"
          },
          {
            id: "bob-query-debug",
            label: "Help me debug this contract",
            type: "query",
            properties: {
              id: "bob-query-debug",
              content: "Help me debug this contract",
              timestamp: new Date().toISOString(),
              confidence: 0.95
            },
            size: 25,
            color: "#4CAF50"
          },
          {
            id: "tool-contract-analyzer",
            label: "Contract Analyzer",
            type: "tool",
            properties: {
              id: "tool-contract-analyzer",
              name: "Contract Analyzer",
              category: "development"
            },
            size: 30,
            color: "#FF5722"
          },
          {
            id: "address-contract-001",
            label: "0x1234...5678",
            type: "address",
            properties: {
              id: "address-contract-001",
              address: "0x1234567890abcdef1234567890abcdef12345678",
              type: "contract"
            },
            size: 15,
            color: "#607D8B"
          }
        );

        fallbackEdges.push(
          {
            id: "bob-to-query-debug",
            from: "bob",
            to: "bob-query-debug",
            label: "asked",
            type: "QUERIES",
            weight: 1.0,
            color: "#4CAF50"
          },
          {
            id: "query-debug-to-tool",
            from: "bob-query-debug",
            to: "tool-contract-analyzer",
            label: "used",
            type: "USED_TOOL",
            weight: 1.0,
            color: "#FF5722"
          },
          {
            id: "query-to-address",
            from: "bob-query-debug",
            to: "address-contract-001",
            label: "involves",
            type: "INVOLVES_ADDRESS",
            weight: 1.0,
            color: "#607D8B"
          }
        );
      } else if (userId === 'charlie') {
        // Charlie-specific graph (Blockchain Analyst)
        fallbackNodes.push(
          {
            id: "charlie",
            label: "Charlie (Analyst)",
            type: "user",
            properties: {
              id: "charlie",
              name: "Charlie (Analyst)",
              role: "analyst",
              lastActivity: new Date().toISOString()
            },
            size: 40,
            color: "#2196F3"
          },
          {
            id: "charlie-query-whale",
            label: "Show me recent whale activity",
            type: "query",
            properties: {
              id: "charlie-query-whale",
              content: "Show me recent whale activity",
              timestamp: new Date().toISOString(),
              confidence: 0.9
            },
            size: 25,
            color: "#4CAF50"
          },
          {
            id: "tool-whale-tracker",
            label: "Whale Tracker",
            type: "tool",
            properties: {
              id: "tool-whale-tracker",
              name: "Whale Tracker",
              category: "analytics"
            },
            size: 30,
            color: "#FF5722"
          },
          {
            id: "pattern-whale-behavior",
            label: "Whale accumulation pattern",
            type: "pattern",
            properties: {
              id: "pattern-whale-behavior",
              content: "Large addresses accumulating tokens",
              confidence: 0.8
            },
            size: 25,
            color: "#FF9800"
          }
        );

        fallbackEdges.push(
          {
            id: "charlie-to-query-whale",
            from: "charlie",
            to: "charlie-query-whale",
            label: "asked",
            type: "QUERIES",
            weight: 1.0,
            color: "#4CAF50"
          },
          {
            id: "query-whale-to-tool",
            from: "charlie-query-whale",
            to: "tool-whale-tracker",
            label: "used",
            type: "USED_TOOL",
            weight: 1.0,
            color: "#FF5722"
          },
          {
            id: "query-to-pattern",
            from: "charlie-query-whale",
            to: "pattern-whale-behavior",
            label: "pattern",
            type: "LEARNED_PATTERN",
            weight: 1.0,
            color: "#FF9800"
          }
        );
      } else {
        // Default fallback for unknown users or global view
        fallbackNodes.push(
          {
            id: "user-001",
            label: "Alice (Trader)",
            type: "user",
            properties: {
              id: "user-001",
              name: "Alice (Trader)",
              role: "trader",
              lastActivity: new Date().toISOString()
            },
            size: 40,
            color: "#2196F3"
          },
          {
            id: "ctx-fallback-query",
            label: "What's the balance of 0x123...?",
            type: "query",
            properties: {
              id: "ctx-fallback-query",
              content: "What's the balance of 0x123...?",
              timestamp: new Date().toISOString(),
              confidence: 0.9
            },
            size: 25,
            color: "#4CAF50"
          },
          {
            id: "tool-getBalance",
            label: "getBalance",
            type: "tool",
            properties: {
              id: "tool-getBalance",
              name: "getBalance",
              category: "balance"
            },
            size: 30,
            color: "#FF5722"
          }
        );

        fallbackEdges.push(
          {
            id: "user-001-ctx-fallback-query",
            from: "user-001",
            to: "ctx-fallback-query",
            label: "asked",
            type: "QUERIES",
            weight: 1.0,
            color: "#4CAF50"
          },
          {
            id: "ctx-fallback-query-tool-getBalance",
            from: "ctx-fallback-query",
            to: "tool-getBalance",
            label: "used",
            type: "USED_TOOL",
            weight: 1.0,
            color: "#FF5722"
          }
        );
      }

      const fallbackMetadata: GraphMetadata = {
        totalNodes: fallbackNodes.length,
        totalEdges: fallbackEdges.length,
        userCount: fallbackNodes.filter(n => n.type === 'user').length,
        toolCount: fallbackNodes.filter(n => n.type === 'tool').length,
        queryCount: fallbackNodes.filter(n => n.type === 'query').length,
        insightCount: fallbackNodes.filter(n => n.type === 'insight').length,
        addressCount: fallbackNodes.filter(n => n.type === 'address').length,
        generatedAt: new Date().toISOString(),
        userId: userId || 'global',
        isFallbackData: true  // Add flag to indicate this is fallback data
      };

      console.log('=== USING FALLBACK DATA ===');
      console.log('User:', userId || 'global');
      console.log('Nodes:', fallbackNodes.length);
      console.log('Edges:', fallbackEdges.length);
      console.log('Fallback nodes:', fallbackNodes.map(n => ({ id: n.id, type: n.type, label: n.label })));

      return {
        nodes: fallbackNodes,
        edges: fallbackEdges,
        metadata: fallbackMetadata
      };
    }
  },

  getGraphInsights: async (userId: string): Promise<GraphInsights> => {
    try {
      return await apiRequest<GraphInsights>(`/api/context/graph/insights/${userId}`);
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

  // Store user context data after chat interactions
  storeUserContext: async (userId: string, contextData: {
    query: string;
    toolsUsed?: Array<{
      name: string;
      parameters?: Record<string, any>;
      result?: any;
    }>;
    addressesInvolved?: string[];
    insights?: Array<{
      content: string;
      confidence: number;
    }>;
    metadata?: Record<string, any>;
  }) => {
    try {
      return await apiRequest(`/api/context/users/${userId}/context`, {
        method: 'POST',
        body: JSON.stringify(contextData),
      });
    } catch (error) {
      console.warn('Failed to store context data:', error);
      throw error;
    }
  },

  // Clear database endpoint
  clearDatabase: async (): Promise<{
    success: boolean;
    message: string;
    stats?: { nodesRemoved: number; relationshipsRemoved: number };
    timestamp: string;
  }> => {
    try {
      console.log('=== CLEARING DATABASE ===');
      const response = await apiRequest<{
        success: boolean;
        message: string;
        stats?: { nodesRemoved: number; relationshipsRemoved: number };
        timestamp: string;
      }>('/api/context/database/clear', {
        method: 'DELETE',
      });
      console.log('=== DATABASE CLEARED SUCCESSFULLY ===');
      console.log('Result:', response);
      return response;
    } catch (error) {
      console.error('=== DATABASE CLEAR FAILED ===');
      console.error('Error:', error);
      throw error;
    }
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

import { ChatResponse, NetworkStats, GasPrice, TopContract, WhaleActivity } from '@/types/chat';

const API_BASE_URL = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`);
  }

  return response.json();
}

export const chatApi = {
  sendMessage: async (message: string, userId: string, sessionId?: string): Promise<ChatResponse> => {
    return apiRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, userId, sessionId }),
    });
  },

  getChatHistory: async (sessionId: string) => {
    return apiRequest(`/chat/history/${sessionId}`);
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
};

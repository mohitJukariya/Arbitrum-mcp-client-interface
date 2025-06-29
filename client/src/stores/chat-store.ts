import { create } from 'zustand';
import { User, ChatMessage, NetworkStats, GasPrice, TopContract, WhaleActivity, GraphVisualization, GraphInsights } from '@/types/chat';
import { contextApi } from '@/lib/api';

interface ChatStore {
  // Selected user
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;

  // Messages
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;

  // Session
  currentSessionId: string | null;
  setCurrentSessionId: (sessionId: string) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;

  // Analytics data (removed for simplicity)
  networkStats: NetworkStats | null;
  setNetworkStats: (stats: NetworkStats) => void;
  gasPrice: GasPrice | null;
  setGasPrice: (price: GasPrice) => void;
  topContracts: TopContract[];
  setTopContracts: (contracts: TopContract[]) => void;
  whaleActivity: WhaleActivity[];
  setWhaleActivity: (activity: WhaleActivity[]) => void;

  // Graph visualization
  graphData: GraphVisualization | null;
  setGraphData: (data: GraphVisualization) => void;
  graphInsights: GraphInsights | null;
  setGraphInsights: (insights: GraphInsights) => void;
  loadingGraph: boolean;
  setLoadingGraph: (loading: boolean) => void;

  // Graph panel visibility
  graphPanelOpen: boolean;
  setGraphPanelOpen: (open: boolean) => void;

  // Actions
  loadUserGraph: (userId: string) => Promise<void>;
  loadGlobalGraph: () => Promise<void>;
}

export const users: User[] = [
  {
    id: 'user-001',
    name: 'Alice (Trader)',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    description: 'Focuses on gas prices, trading optimization'
  },
  {
    id: 'user-002',
    name: 'Bob (Developer)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    description: 'Contract interactions, debugging, ABIs'
  },
  {
    id: 'user-003',
    name: 'Charlie (Analyst)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    description: 'Whale tracking, transaction analysis'
  }
];

export const useChatStore = create<ChatStore>((set, get) => ({
  // Selected user
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Messages
  messages: [],
  addMessage: (message) => set((state) => {
    // Check if message already exists to prevent duplicates
    const messageExists = state.messages.some(existingMessage =>
      existingMessage.id === message.id ||
      (existingMessage.content === message.content &&
        existingMessage.messageType === message.messageType &&
        Math.abs(new Date(existingMessage.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
    );

    if (messageExists) {
      console.log('Duplicate message prevented:', message.content.substring(0, 50));
      return state;
    }

    return { messages: [...state.messages, message] };
  }),
  clearMessages: () => set({ messages: [], currentSessionId: null }),

  // Session
  currentSessionId: null,
  setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isTyping: false,
  setIsTyping: (typing) => set({ isTyping: typing }),

  // Analytics data
  networkStats: null,
  setNetworkStats: (stats) => set({ networkStats: stats }),
  gasPrice: null,
  setGasPrice: (price) => set({ gasPrice: price }),
  topContracts: [],
  setTopContracts: (contracts) => set({ topContracts: contracts }),
  whaleActivity: [],
  setWhaleActivity: (activity) => set({ whaleActivity: activity }),

  // Graph visualization
  graphData: null,
  setGraphData: (data) => set({ graphData: data }),
  graphInsights: null,
  setGraphInsights: (insights) => set({ graphInsights: insights }),
  loadingGraph: false,
  setLoadingGraph: (loading) => set({ loadingGraph: loading }),
  graphPanelOpen: false,
  setGraphPanelOpen: (open) => set({ graphPanelOpen: open }),

  // Graph actions
  loadUserGraph: async (userId: string) => {
    set({ loadingGraph: true });
    try {
      const [graphData, insights] = await Promise.all([
        contextApi.getGraphVisualization(userId),
        contextApi.getGraphInsights(userId)
      ]);
      set({ graphData, graphInsights: insights });
    } catch (error) {
      console.error('Failed to load user graph:', error);
    } finally {
      set({ loadingGraph: false });
    }
  },

  loadGlobalGraph: async () => {
    set({ loadingGraph: true });
    try {
      const graphData = await contextApi.getGraphVisualization();
      set({ graphData });
    } catch (error) {
      console.error('Failed to load global graph:', error);
    } finally {
      set({ loadingGraph: false });
    }
  },
}));

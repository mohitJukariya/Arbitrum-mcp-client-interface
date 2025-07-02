import { create } from 'zustand';
import { User, ChatMessage, NetworkStats, GasPrice, TopContract, WhaleActivity, GraphVisualization, GraphInsights, UserPersonality } from '@/types/chat';
import { contextApi, personalityApi } from '@/lib/api';

interface ChatStore {
  // Selected user (legacy support)
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;

  // NEW: Personality system
  personalities: UserPersonality[];
  selectedPersonality: UserPersonality | null;
  setSelectedPersonality: (personality: UserPersonality | null) => void;
  loadPersonalities: () => Promise<void>;
  loadingPersonalities: boolean;

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
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=b6e3f4',
    status: 'online',
    description: 'Focuses on gas prices, trading optimization'
  },
  {
    id: 'user-002',
    name: 'Bob (Developer)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob&backgroundColor=c084fc',
    status: 'online',
    description: 'Contract interactions, debugging, ABIs'
  },
  {
    id: 'user-003',
    name: 'Charlie (Analyst)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=fbbf24',
    status: 'online',
    description: 'Whale tracking, transaction analysis'
  }
];

export const useChatStore = create<ChatStore>((set, get) => ({
  // Selected user (legacy support)
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),

  // NEW: Personality system
  personalities: [],
  selectedPersonality: null,
  setSelectedPersonality: (personality) => set({ selectedPersonality: personality }),
  loadingPersonalities: false,
  loadPersonalities: async () => {
    set({ loadingPersonalities: true });
    try {
      const personalities = await personalityApi.getAllPersonalities();
      set({ personalities });
    } catch (error) {
      console.error('Failed to load personalities:', error);
    } finally {
      set({ loadingPersonalities: false });
    }
  },

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

  // Graph actions with enhanced API support
  loadUserGraph: async (userId: string) => {
    set({ loadingGraph: true });
    console.log('=== LOADING USER GRAPH ===');
    console.log('User ID:', userId);
    console.log('API URL:', `http://localhost:3000/api/context/graph/visualization?userId=${userId}`);
    try {
      const [graphData, insights] = await Promise.all([
        contextApi.getGraphVisualization(userId),
        contextApi.getGraphInsights(userId)
      ]);
      console.log('=== USER GRAPH DATA LOADED ===');
      console.log('Nodes count:', graphData.nodes.length);
      console.log('Edges count:', graphData.edges.length);
      console.log('Metadata:', graphData.metadata);
      console.log('Full graph data:', graphData);
      console.log('Insights:', insights);
      set({ graphData, graphInsights: insights });
    } catch (error) {
      console.error('=== FAILED TO LOAD USER GRAPH ===');
      console.error('Error:', error);
      console.error('User ID:', userId);
      // Set empty graph data to prevent UI errors
      set({
        graphData: {
          nodes: [],
          edges: [],
          metadata: {
            totalNodes: 0,
            totalEdges: 0,
            userCount: 0,
            toolCount: 0,
            queryCount: 0,
            insightCount: 0,
            addressCount: 0,
            generatedAt: new Date().toISOString(),
            userId: userId
          }
        }
      });
    } finally {
      set({ loadingGraph: false });
    }
  },

  loadGlobalGraph: async () => {
    set({ loadingGraph: true });
    console.log('=== LOADING GLOBAL GRAPH ===');
    console.log('API URL:', `http://localhost:3000/api/context/graph/visualization`);
    try {
      const graphData = await contextApi.getGraphVisualization();
      console.log('=== GLOBAL GRAPH DATA LOADED ===');
      console.log('Nodes count:', graphData.nodes.length);
      console.log('Edges count:', graphData.edges.length);
      console.log('Metadata:', graphData.metadata);
      console.log('Full graph data:', graphData);
      set({ graphData });
    } catch (error) {
      console.error('=== FAILED TO LOAD GLOBAL GRAPH ===');
      console.error('Error:', error);
      // Set empty graph data to prevent UI errors
      set({
        graphData: {
          nodes: [],
          edges: [],
          metadata: {
            totalNodes: 0,
            totalEdges: 0,
            userCount: 0,
            toolCount: 0,
            queryCount: 0,
            insightCount: 0,
            addressCount: 0,
            generatedAt: new Date().toISOString(),
            userId: 'global'
          }
        }
      });
    } finally {
      set({ loadingGraph: false });
    }
  },
}));

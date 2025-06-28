import { create } from 'zustand';
import { User, ChatMessage, NetworkStats, GasPrice, TopContract, WhaleActivity } from '@/types/chat';
import { wsManager } from '@/lib/websocket';

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

  // WebSocket connection
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  initializeWebSocket: () => void;

  // Analytics data (removed for simplicity)
  networkStats: NetworkStats | null;
  setNetworkStats: (stats: NetworkStats) => void;
  gasPrice: GasPrice | null;
  setGasPrice: (price: GasPrice) => void;
  topContracts: TopContract[];
  setTopContracts: (contracts: TopContract[]) => void;
  whaleActivity: WhaleActivity[];
  setWhaleActivity: (activity: WhaleActivity[]) => void;
}

export const users: User[] = [
  {
    id: 'alice',
    name: 'Alice',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'online'
  },
  {
    id: 'bob',
    name: 'Bob',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'online'
  },
  {
    id: 'charlie',
    name: 'Charlie',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'online'
  }
];

export const useChatStore = create<ChatStore>((set, get) => ({
  // Selected user
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Messages
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [], currentSessionId: null }),

  // Session
  currentSessionId: null,
  setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isTyping: false,
  setIsTyping: (typing) => set({ isTyping: typing }),

  // WebSocket connection
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  initializeWebSocket: () => {
    wsManager.connect()
      .then(() => {
        set({ isConnected: true });
        
        // Set up message handlers
        wsManager.onMessage('chat_response', (data) => {
          get().addMessage({
            id: Date.now().toString(),
            content: data.response,
            messageType: 'assistant',
            timestamp: new Date().toISOString(),
            toolsUsed: data.toolsUsed || [],
            confidence: data.confidence || 0.8,
            metadata: data.metadata
          });
          get().setIsTyping(false);
        });

        wsManager.onMessage('typing_indicator', (data) => {
          get().setIsTyping(data.isTyping);
        });
      })
      .catch((error) => {
        console.error('Failed to connect to WebSocket:', error);
        set({ isConnected: false });
      });
  },

  // Analytics data
  networkStats: null,
  setNetworkStats: (stats) => set({ networkStats: stats }),
  gasPrice: null,
  setGasPrice: (price) => set({ gasPrice: price }),
  topContracts: [],
  setTopContracts: (contracts) => set({ topContracts: contracts }),
  whaleActivity: [],
  setWhaleActivity: (activity) => set({ whaleActivity: activity }),
}));

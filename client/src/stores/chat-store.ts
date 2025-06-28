import { create } from 'zustand';
import { Assistant, ChatMessage, NetworkStats, GasPrice, TopContract, WhaleActivity } from '@/types/chat';

interface ChatStore {
  // Selected assistant
  selectedAssistant: Assistant | null;
  setSelectedAssistant: (assistant: Assistant) => void;

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

  // Analytics data
  networkStats: NetworkStats | null;
  setNetworkStats: (stats: NetworkStats) => void;
  gasPrice: GasPrice | null;
  setGasPrice: (price: GasPrice) => void;
  topContracts: TopContract[];
  setTopContracts: (contracts: TopContract[]) => void;
  whaleActivity: WhaleActivity[];
  setWhaleActivity: (activity: WhaleActivity[]) => void;

  // UI state
  isGraphPanelOpen: boolean;
  setGraphPanelOpen: (open: boolean) => void;
}

export const assistants: Assistant[] = [
  {
    id: 'alice',
    name: 'Alice',
    role: 'Trading Assistant',
    description: 'Gas prices & trading optimization',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    specialties: ['gas prices', 'trading optimization', 'MEV protection', 'bridge fees'],
    status: 'online'
  },
  {
    id: 'bob',
    name: 'Bob',
    role: 'Developer Assistant',
    description: 'Contracts, debugging & ABIs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    specialties: ['contract interactions', 'debugging', 'ABIs', 'development tools'],
    status: 'online'
  },
  {
    id: 'charlie',
    name: 'Charlie',
    role: 'Analytics Assistant',
    description: 'Whale tracking & TX analysis',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    specialties: ['whale tracking', 'transaction analysis', 'market trends', 'on-chain data'],
    status: 'online'
  }
];

export const useChatStore = create<ChatStore>((set, get) => ({
  // Selected assistant
  selectedAssistant: assistants[0],
  setSelectedAssistant: (assistant) => set({ selectedAssistant: assistant }),

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

  // Analytics data
  networkStats: null,
  setNetworkStats: (stats) => set({ networkStats: stats }),
  gasPrice: null,
  setGasPrice: (price) => set({ gasPrice: price }),
  topContracts: [],
  setTopContracts: (contracts) => set({ topContracts: contracts }),
  whaleActivity: [],
  setWhaleActivity: (activity) => set({ whaleActivity: activity }),

  // UI state
  isGraphPanelOpen: true,
  setGraphPanelOpen: (open) => set({ isGraphPanelOpen: open }),
}));

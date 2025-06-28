import { useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import Sidebar from '@/components/chat/sidebar';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import MessageInput from '@/components/chat/message-input';
import GraphPanel from '@/components/chat/graph-panel';

export default function ChatPage() {
  const { 
    isGraphPanelOpen,
    setNetworkStats,
    setGasPrice,
    setTopContracts,
    setWhaleActivity
  } = useChatStore();

  // Load analytics data
  const { data: gasPrice } = useQuery({
    queryKey: ['/api/analytics/gas-prices'],
    queryFn: () => analyticsApi.getGasPrices(),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: networkStats } = useQuery({
    queryKey: ['/api/analytics/network-stats'],
    queryFn: () => analyticsApi.getNetworkStats(),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: topContracts } = useQuery({
    queryKey: ['/api/analytics/top-contracts'],
    queryFn: () => analyticsApi.getTopContracts(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: whaleActivity } = useQuery({
    queryKey: ['/api/analytics/whale-activity'],
    queryFn: () => analyticsApi.getWhaleActivity(),
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Update store when data changes
  useEffect(() => {
    if (gasPrice) setGasPrice(gasPrice);
  }, [gasPrice, setGasPrice]);

  useEffect(() => {
    if (networkStats) setNetworkStats(networkStats);
  }, [networkStats, setNetworkStats]);

  useEffect(() => {
    if (topContracts) setTopContracts(topContracts);
  }, [topContracts, setTopContracts]);

  useEffect(() => {
    if (whaleActivity) setWhaleActivity(whaleActivity);
  }, [whaleActivity, setWhaleActivity]);

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'hsl(var(--crypto-dark))' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatMessages />
        <MessageInput />
      </div>

      {/* Graph Panel */}
      {isGraphPanelOpen && <GraphPanel />}
    </div>
  );
}

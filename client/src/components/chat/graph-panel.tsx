import { useChatStore } from '@/stores/chat-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export default function GraphPanel() {
  const { 
    setGraphPanelOpen, 
    networkStats, 
    topContracts, 
    whaleActivity 
  } = useChatStore();

  return (
    <div 
      className="w-96 flex flex-col border-l"
      style={{ 
        backgroundColor: 'hsl(var(--crypto-surface))',
        borderColor: 'hsl(var(--crypto-border))'
      }}
    >
      {/* Panel Header */}
      <div className="p-4 border-b" style={{ borderColor: 'hsl(var(--crypto-border))' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Blockchain Analytics</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white h-6 w-6 p-0"
            onClick={() => setGraphPanelOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-slate-400 mt-1">Real-time network data</p>
      </div>

      {/* Graph Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        {/* Network Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card style={{ backgroundColor: 'hsl(var(--crypto-card))', borderColor: 'hsl(var(--crypto-border))' }}>
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 mb-1">TPS</div>
              <div className="text-lg font-bold" style={{ color: 'hsl(var(--crypto-accent))' }}>
                {networkStats?.tps?.toLocaleString() || '2,847'}
              </div>
              <div className="text-xs flex items-center" style={{ color: 'hsl(var(--crypto-accent))' }}>
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </div>
            </CardContent>
          </Card>
          <Card style={{ backgroundColor: 'hsl(var(--crypto-card))', borderColor: 'hsl(var(--crypto-border))' }}>
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 mb-1">Gas Used</div>
              <div className="text-lg font-bold" style={{ color: 'hsl(var(--crypto-warning))' }}>
                {networkStats?.gasUsed?.toFixed(1) || '68.2'}%
              </div>
              <div className="text-xs flex items-center" style={{ color: 'hsl(var(--crypto-warning))' }}>
                <TrendingDown className="w-3 h-3 mr-1" />
                -5.1%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Volume Chart Placeholder */}
        <Card style={{ backgroundColor: 'hsl(var(--crypto-card))', borderColor: 'hsl(var(--crypto-border))' }}>
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Transaction Volume (24h)</h4>
            <div 
              className="w-full h-32 rounded-lg flex items-center justify-center border-2 border-dashed"
              style={{ borderColor: 'hsl(var(--crypto-border))' }}
            >
              <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-xs text-slate-400">Chart visualization</p>
                <p className="text-xs text-slate-500">Real-time data available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Contracts */}
        <Card style={{ backgroundColor: 'hsl(var(--crypto-card))', borderColor: 'hsl(var(--crypto-border))' }}>
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Top Active Contracts</h4>
            <div className="space-y-3">
              {topContracts.map((contract, index) => (
                <div key={contract.address} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                        index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {contract.icon === 'cube' && (
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        )}
                        {contract.icon === 'exchange-alt' && (
                          <path d="M8 5H6a2 2 0 00-2 2v6a2 2 0 002 2h2m2-6h6m-6 4h6m-6-8h6a2 2 0 012 2v6a2 2 0 01-2 2h-6"/>
                        )}
                        {contract.icon === 'coins' && (
                          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        )}
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">{contract.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{contract.address}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: 'hsl(var(--crypto-accent))' }}>
                      {contract.txCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">txs</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Whale Activity */}
        <Card style={{ backgroundColor: 'hsl(var(--crypto-card))', borderColor: 'hsl(var(--crypto-border))' }}>
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">🐋 Whale Activity</h4>
            <div className="space-y-2">
              {whaleActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{activity.type}</span>
                  <span className="font-mono" style={{ color: 'hsl(var(--crypto-accent))' }}>
                    {activity.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

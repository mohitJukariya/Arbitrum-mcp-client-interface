import { useChatStore, assistants } from '@/stores/chat-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Download } from 'lucide-react';
import { nanoid } from 'nanoid';

export default function Sidebar() {
  const { 
    selectedAssistant, 
    setSelectedAssistant, 
    currentSessionId,
    clearMessages 
  } = useChatStore();

  const sessionId = currentSessionId || `ARB-${nanoid(4).toUpperCase()}`;

  return (
    <div 
      className="w-80 flex flex-col border-r"
      style={{ 
        backgroundColor: 'hsl(var(--crypto-surface))',
        borderColor: 'hsl(var(--crypto-border))'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'hsl(var(--crypto-border))' }}>
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r"
            style={{ 
              background: 'linear-gradient(135deg, hsl(var(--crypto-primary)), hsl(var(--crypto-secondary)))'
            }}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Arbitrum Analytics</h1>
            <p className="text-slate-400 text-sm">AI Chat Interface</p>
          </div>
        </div>
        
        {/* Session Info */}
        <Card style={{ backgroundColor: 'hsl(var(--crypto-card))', borderColor: 'hsl(var(--crypto-border))' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Session: {sessionId}</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: 'hsl(var(--crypto-accent))' }}
                />
                <span className="text-xs" style={{ color: 'hsl(var(--crypto-accent))' }}>Live</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistants */}
      <div className="p-6 flex-1">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
          AI Assistants
        </h3>
        
        <div className="space-y-3">
          {assistants.map((assistant) => (
            <Card
              key={assistant.id}
              className={`cursor-pointer transition-all duration-200 hover:opacity-80 ${
                selectedAssistant?.id === assistant.id
                  ? 'border-2'
                  : 'border'
              }`}
              style={{
                backgroundColor: selectedAssistant?.id === assistant.id 
                  ? 'hsla(var(--crypto-primary), 0.1)' 
                  : 'hsla(var(--crypto-card), 0.5)',
                borderColor: selectedAssistant?.id === assistant.id
                  ? 'hsl(var(--crypto-primary))'
                  : 'hsl(var(--crypto-border))'
              }}
              onClick={() => setSelectedAssistant(assistant)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={assistant.avatar} alt={assistant.name} />
                    <AvatarFallback>{assistant.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-white">{assistant.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{
                          backgroundColor: selectedAssistant?.id === assistant.id
                            ? 'hsl(var(--crypto-primary))'
                            : 'hsl(var(--slate-600))',
                          color: 'white'
                        }}
                      >
                        {assistant.role.split(' ')[0]}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{assistant.description}</p>
                  </div>
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      selectedAssistant?.id === assistant.id 
                        ? 'animate-pulse' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: selectedAssistant?.id === assistant.id
                        ? 'hsl(var(--crypto-primary))'
                        : 'hsl(var(--slate-500))'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Quick Actions
          </h4>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white"
            onClick={clearMessages}
            style={{ backgroundColor: 'hsla(var(--crypto-card), 0.3)' }}
          >
            <Trash2 className="mr-3 h-4 w-4" />
            Clear Chat
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white"
            style={{ backgroundColor: 'hsla(var(--crypto-card), 0.3)' }}
          >
            <Download className="mr-3 h-4 w-4" />
            Export History
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-4 border-t" style={{ borderColor: 'hsl(var(--crypto-border))' }}>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'hsl(var(--crypto-accent))' }}
            />
            <span>API Connected</span>
          </div>
          <span>12ms</span>
        </div>
      </div>
    </div>
  );
}

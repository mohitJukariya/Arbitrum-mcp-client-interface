import { useChatStore } from '@/stores/chat-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { Link } from 'wouter';

export default function GraphPage() {
  const { selectedUser, messages } = useChatStore();

  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Please select a user first</p>
            <Link href="/">
              <Button>Go to Chat</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--crypto-dark))' }}>
      {/* Header */}
      <div 
        className="border-b p-4"
        style={{ 
          backgroundColor: 'hsl(var(--crypto-surface))',
          borderColor: 'hsl(var(--crypto-border))'
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {selectedUser.name}'s Context Graph
                </h1>
                <p className="text-sm text-slate-400">
                  Conversation relationships and context
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Graph Visualization */}
          <div className="lg:col-span-2">
            <Card 
              style={{ 
                backgroundColor: 'hsl(var(--crypto-card))',
                borderColor: 'hsl(var(--crypto-border))'
              }}
            >
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Conversation Network
                </h2>
                
                {/* Graph placeholder */}
                <div 
                  className="w-full h-96 rounded-lg border-2 border-dashed flex items-center justify-center"
                  style={{ borderColor: 'hsl(var(--crypto-border))' }}
                >
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(var(--crypto-primary))' }}
                    >
                      <Share2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Context Graph Visualization
                    </h3>
                    <p className="text-slate-400 max-w-sm">
                      Interactive network showing relationships between conversations, 
                      topics, and context connections for {selectedUser.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            
            {/* User Stats */}
            <Card 
              style={{ 
                backgroundColor: 'hsl(var(--crypto-card))',
                borderColor: 'hsl(var(--crypto-border))'
              }}
            >
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  Session Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Messages</span>
                    <span className="text-white font-semibold">{messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Context Nodes</span>
                    <span className="text-white font-semibold">{Math.max(1, Math.floor(messages.length / 3))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Relationships</span>
                    <span className="text-white font-semibold">{Math.max(0, Math.floor(messages.length / 5))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Context */}
            <Card 
              style={{ 
                backgroundColor: 'hsl(var(--crypto-card))',
                borderColor: 'hsl(var(--crypto-border))'
              }}
            >
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  Recent Context
                </h3>
                <div className="space-y-2">
                  {messages.slice(-3).map((message, index) => (
                    <div 
                      key={message.id}
                      className="p-2 rounded-md"
                      style={{ backgroundColor: 'hsl(var(--crypto-surface))' }}
                    >
                      <div className="text-xs text-slate-400 mb-1">
                        {message.messageType === 'user' ? selectedUser.name : 'Agent'}
                      </div>
                      <div className="text-sm text-slate-200 line-clamp-2">
                        {message.content.substring(0, 80)}...
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-slate-400 text-sm">
                      No messages yet. Start a conversation to see context relationships.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Graph Controls */}
            <Card 
              style={{ 
                backgroundColor: 'hsl(var(--crypto-card))',
                borderColor: 'hsl(var(--crypto-border))'
              }}
            >
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  Graph Controls
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-300 hover:text-white"
                  >
                    Reset View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-300 hover:text-white"
                  >
                    Show Labels
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-300 hover:text-white"
                  >
                    Filter Topics
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
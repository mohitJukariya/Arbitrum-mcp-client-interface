import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bolt, TrendingUp, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';

export default function ChatMessages() {
  const { messages, selectedUser, isTyping } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Welcome message
  const showWelcomeMessage = messages.length === 0 && selectedUser;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ backgroundColor: 'hsl(var(--crypto-dark))' }}>
      {showWelcomeMessage && (
        <div className="animate-fade-in">
          <div className="flex items-start space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold bg-gradient-to-r"
              style={{ 
                background: 'linear-gradient(135deg, hsl(var(--crypto-accent)), hsl(var(--crypto-primary)))'
              }}
            >
              AI
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-white">AI Agent</span>
                <span className="text-xs text-slate-400">{format(new Date(), 'h:mm a')}</span>
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: 'hsla(var(--crypto-accent), 0.2)',
                    color: 'hsl(var(--crypto-accent))'
                  }}
                >
                  Ready
                </Badge>
              </div>
              <Card 
                className="rounded-tl-none border"
                style={{ 
                  backgroundColor: 'hsl(var(--crypto-card))',
                  borderColor: 'hsl(var(--crypto-border))'
                }}
              >
                <CardContent className="p-4">
                  <p className="text-slate-200 mb-3">
                    👋 Hello {selectedUser.name}! I'm your AI assistant for Arbitrum blockchain analytics. 
                    I can help you with:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-300 mb-3">
                    <li>• Gas price analysis and optimization</li>
                    <li>• Contract interactions and debugging</li>
                    <li>• Whale tracking and transaction analysis</li>
                    <li>• Market trends and on-chain data</li>
                  </ul>
                  <p className="text-slate-300">
                    What would you like to explore today?
                  </p>
                  <div className="flex items-center space-x-2 mt-3 text-xs text-slate-400">
                    <Bolt className="w-3 h-3" />
                    <span>AI Analytics ready</span>
                    <span className="mx-2">•</span>
                    <span>Confidence: 100%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Actual messages */}
      {messages.map((message) => (
        <div key={message.id} className="animate-fade-in">
          {message.messageType === 'assistant' ? (
            <div className="flex items-start space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold bg-gradient-to-r"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(var(--crypto-accent)), hsl(var(--crypto-primary)))'
                }}
              >
                AI
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-white">AI Agent</span>
                  <span className="text-xs text-slate-400">
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </span>
                </div>
                <Card 
                  className="rounded-tl-none border"
                  style={{ 
                    backgroundColor: 'hsl(var(--crypto-card))',
                    borderColor: 'hsl(var(--crypto-border))'
                  }}
                >
                  <CardContent className="p-4">
                    <p className="text-slate-200 mb-4">{message.content}</p>
                    


                    {message.toolsUsed && message.toolsUsed.length > 0 && (
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <Bolt className="w-3 h-3" />
                        <span>Bolt used: {message.toolsUsed.join(', ')}</span>
                        {message.confidence && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3 justify-end">
              <div className="flex-1 max-w-lg">
                <div className="flex items-center justify-end space-x-2 mb-2">
                  <span className="text-xs text-slate-400">
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </span>
                  <span className="font-semibold text-white">{selectedUser?.name}</span>
                </div>
                <Card 
                  className="rounded-tr-none"
                  style={{ backgroundColor: 'hsl(var(--crypto-primary))' }}
                >
                  <CardContent className="p-4">
                    <p className="text-white">{message.content}</p>
                  </CardContent>
                </Card>
              </div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold bg-gradient-to-r"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(var(--crypto-primary)), hsl(var(--crypto-secondary)))'
                }}
              >
                U
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="animate-fade-in">
          <div className="flex items-start space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold bg-gradient-to-r"
              style={{ 
                background: 'linear-gradient(135deg, hsl(var(--crypto-accent)), hsl(var(--crypto-primary)))'
              }}
            >
              AI
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-white">AI Agent</span>
                <span className="text-xs text-slate-400">now</span>
              </div>
              <Card 
                className="rounded-tl-none border"
                style={{ 
                  backgroundColor: 'hsl(var(--crypto-card))',
                  borderColor: 'hsl(var(--crypto-border))'
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div 
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'hsl(var(--crypto-primary))',
                          animationDelay: '0s'
                        }}
                      />
                      <div 
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'hsl(var(--crypto-primary))',
                          animationDelay: '0.1s'
                        }}
                      />
                      <div 
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'hsl(var(--crypto-primary))',
                          animationDelay: '0.2s'
                        }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm">Analyzing blockchain data...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

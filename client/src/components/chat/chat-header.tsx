import { useChatStore, users } from '@/stores/chat-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart3, ArrowLeft, User } from 'lucide-react';
import { Link } from 'wouter';

export default function ChatHeader() {
  const { selectedUser, isTyping, setSelectedUser } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div 
      className="border-b p-4"
      style={{ 
        backgroundColor: 'hsl(var(--crypto-surface))',
        borderColor: 'hsl(var(--crypto-border))'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
            <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Chat as {selectedUser.name}
            </h2>
            <div className="flex items-center space-x-2">
              {isTyping ? (
                <>
                  <div className="flex space-x-1">
                    <div 
                      className="w-1 h-1 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: 'hsl(var(--crypto-primary))',
                        animationDelay: '0s'
                      }}
                    />
                    <div 
                      className="w-1 h-1 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: 'hsl(var(--crypto-primary))',
                        animationDelay: '0.2s'
                      }}
                    />
                    <div 
                      className="w-1 h-1 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: 'hsl(var(--crypto-primary))',
                        animationDelay: '0.4s'
                      }}
                    />
                  </div>
                  <span className="text-sm" style={{ color: 'hsl(var(--crypto-primary))' }}>
                    Agent is responding...
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-400">Connected to AI agent</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link href="/graph">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Context Graph
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={() => setSelectedUser(null)}
          >
            <User className="h-4 w-4 mr-2" />
            Switch User
          </Button>
        </div>
      </div>
    </div>
  );
}

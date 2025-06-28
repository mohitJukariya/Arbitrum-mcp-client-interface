import { useChatStore } from '@/stores/chat-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart3, Settings } from 'lucide-react';

export default function ChatHeader() {
  const { selectedAssistant, isTyping, setGraphPanelOpen, isGraphPanelOpen } = useChatStore();

  if (!selectedAssistant) return null;

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
            <AvatarImage src={selectedAssistant.avatar} alt={selectedAssistant.name} />
            <AvatarFallback>{selectedAssistant.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {selectedAssistant.name} - {selectedAssistant.role}
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
                    Analyzing blockchain data...
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-400">Ready to help</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={() => setGraphPanelOpen(!isGraphPanelOpen)}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

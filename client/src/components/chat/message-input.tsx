import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { chatApi } from '@/lib/api';
import { Send } from 'lucide-react';
import { nanoid } from 'nanoid';

export default function MessageInput() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  
  const { 
    selectedAssistant, 
    currentSessionId, 
    setCurrentSessionId,
    addMessage, 
    setIsTyping,
    messages
  } = useChatStore();

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!selectedAssistant) throw new Error('No assistant selected');
      
      return chatApi.sendMessage(messageText, selectedAssistant.id, currentSessionId || undefined);
    },
    onMutate: async (messageText) => {
      // Add user message immediately
      const userMessage = {
        id: nanoid(),
        content: messageText,
        messageType: 'user' as const,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);
      
      // Show typing indicator
      setIsTyping(true);
      
      return { userMessage };
    },
    onSuccess: (response) => {
      // Set session ID if this is the first message
      if (!currentSessionId) {
        setCurrentSessionId(response.sessionId);
      }
      
      // Add assistant response
      const assistantMessage = {
        id: nanoid(),
        content: response.response,
        messageType: 'assistant' as const,
        timestamp: new Date().toISOString(),
        toolsUsed: response.toolsUsed,
        confidence: response.confidence,
        metadata: response.metadata,
      };
      addMessage(assistantMessage);
      
      // Hide typing indicator
      setIsTyping(false);
    },
    onError: (error, messageText, context) => {
      console.error('Failed to send message:', error);
      
      // Add fallback response
      const fallbackMessage = {
        id: nanoid(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        messageType: 'assistant' as const,
        timestamp: new Date().toISOString(),
        toolsUsed: [],
        confidence: 0.5,
        metadata: {
          contextUsed: false,
          fallbackLevel: 'error'
        },
      };
      addMessage(fallbackMessage);
      
      // Hide typing indicator
      setIsTyping(false);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || !selectedAssistant || sendMessageMutation.isPending) return;
    
    const messageText = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    sendMessageMutation.mutate(messageText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  if (!selectedAssistant) return null;

  return (
    <div 
      className="border-t p-4"
      style={{ 
        backgroundColor: 'hsl(var(--crypto-surface))',
        borderColor: 'hsl(var(--crypto-border))'
      }}
    >
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={`Ask ${selectedAssistant.name} about ${selectedAssistant.specialties[0]}, ${selectedAssistant.specialties[1]}, or market analysis...`}
              className="resize-none pr-12 border transition-all focus:ring-2 focus:ring-offset-0"
              style={{ 
                backgroundColor: 'hsl(var(--crypto-card))',
                borderColor: 'hsl(var(--crypto-border))',
                color: 'hsl(var(--slate-200))',
                minHeight: '44px'
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sendMessageMutation.isPending}
            />
            <Button
              size="sm"
              className="absolute right-3 bottom-3 h-8 w-8 p-0 transition-colors"
              style={{ 
                backgroundColor: 'hsl(var(--crypto-primary))',
                color: 'white'
              }}
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{messages.length}/100 messages today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

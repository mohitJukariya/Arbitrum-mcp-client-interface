import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatApi } from "@/lib/api";
import { Send } from "lucide-react";
import { nanoid } from "nanoid";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const {
    selectedUser,
    selectedPersonality, // NEW: Get selected personality
    currentSessionId,
    setCurrentSessionId,
    addMessage,
    setIsTyping,
    messages,
  } = useChatStore();

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      // Use personality if available, fallback to user for backward compatibility
      const currentProfile = selectedPersonality || selectedUser;
      if (!currentProfile) throw new Error("No user or personality selected");

      return chatApi.sendMessage(
        messageText,
        currentProfile.id,
        currentSessionId || undefined,
        selectedPersonality?.id // NEW: Include personalityId if available
      );
    },
    onMutate: async (messageText) => {
      // Add user message immediately
      const userMessage = {
        id: nanoid(),
        content: messageText,
        messageType: "user" as const,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Show typing indicator
      setIsTyping(true);

      return { userMessage };
    },
    onSuccess: (response) => {
      try {
        // Set session ID if this is the first message
        if (!currentSessionId && response?.sessionId) {
          setCurrentSessionId(response.sessionId);
        }

        // Add assistant response with safe fallbacks
        const assistantMessage = {
          id: nanoid(),
          content: response?.response || "No response received",
          messageType: "assistant" as const,
          timestamp: new Date().toISOString(),
          toolsUsed: Array.isArray(response?.toolsUsed)
            ? response.toolsUsed
            : [],
          confidence: response?.confidence || 0.8,
          personality: response?.personality, // NEW: Include personality info
          metadata: response?.metadata || {
            contextUsed: false,
            fallbackLevel: "success-handler",
          },
        };
        addMessage(assistantMessage);

        // Hide typing indicator
        setIsTyping(false);
      } catch (error) {
        console.error("Error processing successful response:", error);
        // Add error message if response processing fails
        const errorMessage = {
          id: nanoid(),
          content:
            "I received a response but had trouble processing it. Please try again.",
          messageType: "assistant" as const,
          timestamp: new Date().toISOString(),
          toolsUsed: [],
          confidence: 0.3,
          metadata: {
            contextUsed: false,
            fallbackLevel: "success-handler-error",
          },
        };
        addMessage(errorMessage);
        setIsTyping(false);
      }
    },
    onError: (error, messageText, context) => {
      console.error("Failed to send message:", error);

      // Add more detailed fallback response
      const fallbackMessage = {
        id: nanoid(),
        content: `I'm sorry, I'm having trouble connecting to the backend service. 

**Error Details:**
- API Endpoint: ${import.meta.env.VITE_API_BASE_URL}/api/chat
- Error: ${error instanceof Error ? error.message : "Unknown error"}

Please check that the backend is running properly. In the meantime, the frontend remains functional with fallback responses.`,
        messageType: "assistant" as const,
        timestamp: new Date().toISOString(),
        toolsUsed: [],
        confidence: 0.5,
        metadata: {
          contextUsed: false,
          fallbackLevel: "error",
        },
      };
      addMessage(fallbackMessage);

      // Hide typing indicator
      setIsTyping(false);
    },
  });

  const handleSendMessage = () => {
    // Use personality if available, fallback to user for backward compatibility
    const currentProfile = selectedPersonality || selectedUser;
    if (!message.trim() || !currentProfile || sendMessageMutation.isPending)
      return;

    const messageText = message.trim();
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Use HTTP API to send message
    sendMessageMutation.mutate(messageText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Don't show input if neither personality nor user is selected
  if (!selectedPersonality && !selectedUser) return null;

  return (
    <div
      className="border-t p-6 backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--crypto-surface)) 0%, hsl(var(--crypto-card)) 100%)",
        borderColor: "hsl(var(--crypto-border))",
        boxShadow: "0 -1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 mb-3">
          {(selectedPersonality || selectedUser) && (
            <div className="flex items-center space-x-2 text-xs">
              <span style={{ color: "#374151", fontWeight: "600" }}>
                Chatting with{" "}
                {selectedPersonality
                  ? selectedPersonality.name
                  : selectedUser?.name}
                {selectedPersonality && (
                  <span style={{ color: "#6b7280", fontWeight: "400" }}>
                    {" "}
                    • {selectedPersonality.title}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="relative group">
              <Textarea
                ref={textareaRef}
                placeholder="Try: 'What's the ETH balance of 0x...?' or 'Get transaction details for 0x...' - Click Tools Guide for all options"
                className="resize-none pr-14 border-2 transition-all focus:ring-2 focus:ring-offset-0 rounded-xl shadow-lg"
                style={{
                  background: "#ffffff",
                  borderColor: "#d1d5db",
                  color: "#111827",
                  minHeight: "56px",
                  maxHeight: "120px",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: "500",
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sendMessageMutation.isPending}
                aria-label="Type your message to the AI agent"
              />
              <Button
                size="sm"
                className="absolute right-3 bottom-3 h-10 w-10 p-0 transition-all hover:scale-105 disabled:hover:scale-100 rounded-lg shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--crypto-primary)) 0%, hsl(var(--crypto-secondary)) 100%)",
                  color: "white",
                  border: "none",
                }}
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                aria-label="Send message"
                type="submit"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs">
              <div className="flex items-center space-x-4">
                <span style={{ color: "#374151", fontWeight: "600" }}>
                  Press{" "}
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-xs text-white">
                    Enter
                  </kbd>{" "}
                  to send,
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-xs ml-1 text-white">
                    Shift+Enter
                  </kbd>{" "}
                  for new line
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span style={{ color: "#374151", fontWeight: "600" }}>
                  {messages.length}/∞ messages
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

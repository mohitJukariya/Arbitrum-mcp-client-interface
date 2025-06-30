import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bolt, TrendingUp, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import "./chat-override.css";

export default function ChatMessages() {
  const { messages, selectedUser, selectedPersonality, isTyping } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Welcome message - show if no messages and either personality or user is selected
  const currentProfile = selectedPersonality || selectedUser;
  const showWelcomeMessage = messages.length === 0 && currentProfile;

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--crypto-dark)) 0%, hsl(var(--crypto-surface)) 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {showWelcomeMessage && (
        <div className="animate-fade-in">
          <div className="flex items-start space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold bg-gradient-to-r"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--crypto-accent)), hsl(var(--crypto-primary)))",
              }}
            >
              AI
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className="font-semibold message-sender"
                  style={{ color: "#111827" }}
                >
                  AI Agent
                </span>
                <span
                  className="text-xs message-timestamp"
                  style={{ color: "#374151" }}
                >
                  {format(new Date(), "h:mm a")}
                </span>
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: "hsla(var(--crypto-accent), 0.2)",
                    color: "hsl(var(--crypto-accent))",
                  }}
                >
                  Ready
                </Badge>
              </div>
              <Card
                className="rounded-tl-none border chat-card"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "hsl(var(--crypto-border))",
                }}
              >
                <CardContent className="p-4">
                  <p
                    className="mb-3 leading-relaxed font-semibold chat-message-content"
                    style={{ color: "#000000" }}
                  >
                    👋 Hello {currentProfile.name}! I'm your AI assistant for
                    Arbitrum blockchain analytics. I can help you with:
                  </p>
                  <ul
                    className="space-y-1 text-sm mb-3 font-semibold"
                    style={{ color: "#000000" }}
                  >
                    <li>• Gas price analysis and optimization</li>
                    <li>• Contract interactions and debugging</li>
                    <li>• Whale tracking and transaction analysis</li>
                    <li>• Market trends and on-chain data</li>
                  </ul>
                  <p className="font-semibold" style={{ color: "#000000" }}>
                    What would you like to explore today?
                  </p>
                  <div
                    className="flex items-center space-x-2 mt-3 text-xs font-medium"
                    style={{ color: "#374151" }}
                  >
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
          {message.messageType === "assistant" ? (
            <div className="flex items-start space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold bg-gradient-to-r"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--crypto-accent)), hsl(var(--crypto-primary)))",
                }}
              >
                AI
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className="font-semibold message-sender"
                    style={{ color: "#111827" }}
                  >
                    AI Agent
                  </span>
                  <span
                    className="text-xs message-timestamp"
                    style={{ color: "#374151" }}
                  >
                    {format(new Date(message.timestamp), "h:mm a")}
                  </span>
                </div>
                <Card
                  className="rounded-tl-none border chat-card"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "hsl(var(--crypto-border))",
                  }}
                >
                  <CardContent className="p-4">
                    <p
                      className="mb-4 leading-relaxed font-semibold text-lg chat-message-content"
                      style={{
                        color: "#000000 !important",
                        fontWeight: "600",
                        textShadow: "none",
                      }}
                    >
                      {message.content}
                    </p>

                    {message.toolsUsed && message.toolsUsed.length > 0 && (
                      <div
                        className="mt-4 p-3 rounded-lg border"
                        style={{
                          backgroundColor: "#f8fafc",
                          borderColor: "#e2e8f0",
                        }}
                      >
                        <div
                          className="flex items-center space-x-2 text-sm mb-2"
                          style={{ color: "#3b82f6" }}
                        >
                          <Bolt className="w-4 h-4" />
                          <span className="font-medium">Tools Used</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {message.toolsUsed.map((tool, index) => {
                            // Handle both string and ToolUsage object formats
                            const toolName =
                              typeof tool === "string" ? tool : tool.name;
                            const toolData =
                              typeof tool === "object" ? tool : null;

                            return (
                              <div
                                key={index}
                                className="inline-flex items-center"
                              >
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-mono"
                                  style={{
                                    backgroundColor: "#dbeafe",
                                    color: "#1e40af",
                                    border: "1px solid #3b82f6",
                                    fontWeight: "600",
                                  }}
                                >
                                  {toolName}
                                </Badge>
                                {toolData &&
                                  (toolData.arguments || toolData.result) && (
                                    <div className="ml-2 text-xs text-gray-600">
                                      {toolData.arguments && (
                                        <span className="italic">
                                          (
                                          {
                                            Object.keys(toolData.arguments)
                                              .length
                                          }{" "}
                                          args)
                                        </span>
                                      )}
                                      {toolData.result && (
                                        <span className="ml-1 text-green-600">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                        {message.confidence && (
                          <div
                            className="flex items-center space-x-2 mt-2 text-xs"
                            style={{ color: "#6b7280" }}
                          >
                            <TrendingUp className="w-3 h-3" />
                            <span>
                              Confidence: {Math.round(message.confidence * 100)}
                              %
                            </span>
                          </div>
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
                  <span
                    className="text-xs message-timestamp"
                    style={{ color: "#374151" }}
                  >
                    {format(new Date(message.timestamp), "h:mm a")}
                  </span>
                  <span
                    className="font-semibold message-sender"
                    style={{ color: "#111827" }}
                  >
                    {currentProfile?.name}
                  </span>
                </div>
                <Card
                  className="rounded-tr-none border user-message-card"
                  style={{
                    background: "#ffffff",
                    borderColor: "#d1d5db",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent className="p-4">
                    <p className="user-message-content font-semibold leading-relaxed text-lg">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold bg-gradient-to-r"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--crypto-primary)), hsl(var(--crypto-secondary)))",
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
                background:
                  "linear-gradient(135deg, hsl(var(--crypto-accent)), hsl(var(--crypto-primary)))",
              }}
            >
              AI
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className="font-semibold"
                  style={{ color: "hsl(210, 40%, 95%)" }}
                >
                  AI Agent
                </span>
                <span
                  className="text-xs"
                  style={{ color: "hsl(215, 20%, 65%)" }}
                >
                  now
                </span>
              </div>
              <Card
                className="rounded-tl-none border"
                style={{
                  backgroundColor: "hsl(var(--crypto-card))",
                  borderColor: "hsl(var(--crypto-border))",
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "hsl(var(--crypto-primary))",
                          animationDelay: "0s",
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "hsl(var(--crypto-primary))",
                          animationDelay: "0.1s",
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "hsl(var(--crypto-primary))",
                          animationDelay: "0.2s",
                        }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm">
                      Analyzing blockchain data...
                    </span>
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

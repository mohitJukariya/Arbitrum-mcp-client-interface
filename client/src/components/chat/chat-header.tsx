import { useChatStore, users } from "@/stores/chat-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ArrowLeft, User, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import HelpModal from "@/components/ui/help-modal";

export default function ChatHeader() {
  const { 
    selectedUser, 
    selectedPersonality,
    isTyping, 
    setSelectedUser,
    setSelectedPersonality 
  } = useChatStore();

  // Use personality if available, fallback to user for backward compatibility
  const currentProfile = selectedPersonality || selectedUser;
  
  if (!currentProfile) return null;

  const getPersonalityColor = (personalityId?: string) => {
    switch (personalityId) {
      case 'alice':
        return '#3b82f6'; // Blue
      case 'bob':
        return '#059669'; // Green
      case 'charlie':
        return '#dc2626'; // Red
      default:
        return 'hsl(var(--crypto-primary))';
    }
  };

  const handleSwitchPersonality = () => {
    setSelectedPersonality(null);
    setSelectedUser(null);
  };

  return (
    <div
      className="border-b p-6 backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--crypto-surface)) 0%, hsl(var(--crypto-card)) 100%)",
        borderColor: "hsl(var(--crypto-border))",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar
            className="w-12 h-12 ring-2 ring-offset-2 ring-offset-transparent"
            style={{ 
              "--tw-ring-color": selectedPersonality 
                ? getPersonalityColor(selectedPersonality.id)
                : "hsl(var(--crypto-primary))" 
            } as React.CSSProperties}
          >
            <AvatarImage
              src={currentProfile.avatar}
              alt={currentProfile.name}
              className="object-cover"
            />
            <AvatarFallback
              className="font-semibold text-lg"
              style={{
                backgroundColor: selectedPersonality 
                  ? getPersonalityColor(selectedPersonality.id)
                  : "hsl(var(--crypto-primary))",
                color: "white",
              }}
            >
              {currentProfile.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {currentProfile.name}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              {selectedPersonality && (
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${getPersonalityColor(selectedPersonality.id)}20`,
                    color: getPersonalityColor(selectedPersonality.id)
                  }}
                >
                  {selectedPersonality.title}
                </Badge>
              )}
              {isTyping ? (
                <>
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "hsl(var(--crypto-accent))",
                        animationDelay: "0s",
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "hsl(var(--crypto-accent))",
                        animationDelay: "0.1s",
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "hsl(var(--crypto-primary))",
                        animationDelay: "0.4s",
                      }}
                    />
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: "hsl(var(--crypto-primary))" }}
                  >
                    Agent is responding...
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-400">
                  {selectedPersonality ? (
                    <>AI Assistant • {selectedPersonality.focusAreas}</>
                  ) : (
                    'Connected to AI agent'
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <HelpModal />
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
            onClick={handleSwitchPersonality}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {selectedPersonality ? 'Switch Assistant' : 'Switch User'}
          </Button>
        </div>
      </div>
    </div>
  );
}

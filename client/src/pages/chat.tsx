import UserSelection from "@/components/chat/user-selection";
import PersonalitySelection from "@/components/chat/personality-selection";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import MessageInput from "@/components/chat/message-input";
import { useChatStore } from "@/stores/chat-store";
import { UserPersonality } from "@/types/chat";

export default function ChatPage() {
  const { selectedUser, selectedPersonality, setSelectedPersonality } = useChatStore();

  const handlePersonalitySelect = (personality: UserPersonality) => {
    setSelectedPersonality(personality);
  };

  // Show personality selection if no personality is selected
  // Use personality system by default, fallback to user selection for backward compatibility
  const shouldShowSelection = !selectedPersonality && !selectedUser;

  return (
    <div
      className="flex h-screen"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--crypto-dark)) 0%, hsl(var(--crypto-surface)) 50%, hsl(var(--crypto-card)) 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {shouldShowSelection ? (
        <PersonalitySelection onPersonalitySelect={handlePersonalitySelect} />
      ) : (
        <>
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <ChatHeader />
            <ChatMessages />
            <MessageInput />
          </div>
        </>
      )}
    </div>
  );
}

import UserSelection from '@/components/chat/user-selection';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import MessageInput from '@/components/chat/message-input';
import { useChatStore } from '@/stores/chat-store';

export default function ChatPage() {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'hsl(var(--crypto-dark))' }}>
      {!selectedUser ? (
        <UserSelection />
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

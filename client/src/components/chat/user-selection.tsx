import { useChatStore, users } from '@/stores/chat-store';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function UserSelection() {
  const { setSelectedUser } = useChatStore();

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="max-w-2xl w-full p-6">
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-r"
            style={{ 
              background: 'linear-gradient(135deg, hsl(var(--crypto-primary)), hsl(var(--crypto-secondary)))'
            }}
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Arbitrum Analytics</h1>
          <p className="text-slate-400">Select your user profile to start chatting with our AI agent</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card
              key={user.id}
              className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: 'hsl(var(--crypto-card))',
                borderColor: 'hsl(var(--crypto-border))'
              }}
              onClick={() => setSelectedUser(user)}
            >
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">{user.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-white mb-2">{user.name}</h3>
                <Badge 
                  variant="secondary"
                  style={{
                    backgroundColor: user.status === 'online' 
                      ? 'hsla(var(--crypto-accent), 0.2)' 
                      : 'hsla(var(--slate-500), 0.2)',
                    color: user.status === 'online' 
                      ? 'hsl(var(--crypto-accent))' 
                      : 'hsl(var(--slate-400))'
                  }}
                >
                  {user.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            Choose a user profile to personalize your experience
          </p>
        </div>
      </div>
    </div>
  );
}
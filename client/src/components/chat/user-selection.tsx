import { useChatStore, users } from "@/stores/chat-store";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { memo } from "react";

const UserSelection = memo(() => {
  const { setSelectedUser } = useChatStore();

  return (
    <div
      className="w-full flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "hsl(var(--crypto-dark))" }}
    >
      <div className="max-w-4xl w-full p-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center crypto-gradient crypto-glow">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1
            id="user-selection-title"
            className="text-4xl font-bold mb-4 crypto-gradient-text"
          >
            Arbitrum Analytics
          </h1>
          <p className="text-xl text-crypto-secondary max-w-2xl mx-auto leading-relaxed">
            Select your user profile to start exploring blockchain analytics
            with our AI-powered assistant
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          role="radiogroup"
          aria-labelledby="user-selection-title"
        >
          {users.map((user) => (
            <Card
              key={user.id}
              className="cursor-pointer crypto-card-hover focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:ring-offset-2 focus:ring-offset-crypto-dark border-2"
              style={{
                backgroundColor: "hsl(var(--crypto-card))",
                borderColor: "hsl(var(--crypto-border))",
              }}
              onClick={() => setSelectedUser(user)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedUser(user);
                }
              }}
              tabIndex={0}
              role="radio"
              aria-checked="false"
              aria-labelledby={`user-${user.id}-name`}
              aria-describedby={`user-${user.id}-description`}
            >
              <CardContent className="p-8 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-6 ring-2 ring-crypto-primary/20">
                  <AvatarImage
                    src={user.avatar}
                    alt={`${user.name} profile picture`}
                  />
                  <AvatarFallback className="text-xl font-semibold crypto-gradient text-white">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <h3
                  id={`user-${user.id}-name`}
                  className="text-xl font-semibold text-crypto-primary mb-3"
                >
                  {user.name}
                </h3>
                {user.description && (
                  <p
                    id={`user-${user.id}-description`}
                    className="text-sm text-slate-400 mb-3"
                  >
                    {user.description}
                  </p>
                )}
                <Badge
                  variant="secondary"
                  aria-label={`Status: ${user.status}`}
                  style={{
                    backgroundColor:
                      user.status === "online"
                        ? "hsla(var(--crypto-accent), 0.2)"
                        : "hsla(var(--slate-500), 0.2)",
                    color:
                      user.status === "online"
                        ? "hsl(var(--crypto-accent))"
                        : "hsl(var(--slate-400))",
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
});

UserSelection.displayName = "UserSelection";

export default UserSelection;

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HelpCircle,
  Keyboard,
  Globe,
  MessageSquare,
  Zap,
  Users,
} from "lucide-react";

export default function HelpModal() {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { keys: ["Ctrl", "1"], description: "Go to Chat page" },
    { keys: ["Ctrl", "2"], description: "Go to Graph page" },
    { keys: ["Ctrl", "/"], description: "Focus message input" },
    { keys: ["Esc"], description: "Close modals/panels" },
    { keys: ["Enter"], description: "Send message" },
    { keys: ["Shift", "Enter"], description: "New line in message" },
  ];

  const features = [
    {
      icon: <MessageSquare className="w-4 h-4" />,
      title: "AI Chat",
      description:
        "Interact with our AI agent for blockchain analytics and insights",
    },
    {
      icon: <Globe className="w-4 h-4" />,
      title: "Graph Visualization",
      description:
        "Explore context relationships in interactive force-directed graphs",
    },
    {
      icon: <Users className="w-4 h-4" />,
      title: "Multi-User Support",
      description:
        "Switch between different user profiles with specialized analytics",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Real-time Data",
      description: "WebSocket connections for live updates with HTTP fallback",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white"
          aria-label="Open help and shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-80 sm:w-96"
        style={{
          backgroundColor: "hsl(var(--crypto-card))",
          borderColor: "hsl(var(--crypto-border))",
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-white">Help & Shortcuts</SheetTitle>
          <SheetDescription className="text-slate-400">
            Learn about features and keyboard shortcuts
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Features</h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-crypto-primary mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {feature.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator style={{ backgroundColor: "hsl(var(--crypto-border))" }} />

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center space-x-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <Badge
                        key={keyIndex}
                        variant="outline"
                        className="text-xs px-1.5 py-0.5"
                        style={{
                          borderColor: "hsl(var(--crypto-border))",
                          backgroundColor: "hsl(var(--crypto-surface))",
                          color: "hsl(var(--slate-300))",
                        }}
                      >
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator style={{ backgroundColor: "hsl(var(--crypto-border))" }} />

          {/* Tips */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Tips</h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Switch users to get specialized AI responses</li>
              <li>• Use the graph view to explore conversation context</li>
              <li>• The app works offline with fallback data</li>
              <li>• Hold Shift+Enter for multi-line messages</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

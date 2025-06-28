import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useChatStore } from "@/stores/chat-store";
import { useEffect } from "react";
import ChatPage from "@/pages/chat";
import GraphPage from "@/pages/graph";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatPage} />
      <Route path="/graph" component={GraphPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const initializeWebSocket = useChatStore((state) => state.initializeWebSocket);

  useEffect(() => {
    // Initialize WebSocket connection when app starts
    initializeWebSocket();
  }, [initializeWebSocket]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

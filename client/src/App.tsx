import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ui/error-boundary";
import useKeyboardShortcuts from "@/hooks/use-keyboard-shortcuts";
import { useNotifications } from "@/hooks/use-notifications";
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
  // Initialize custom hooks
  useKeyboardShortcuts();
  useNotifications();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="dark">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

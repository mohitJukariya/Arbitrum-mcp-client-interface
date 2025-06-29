import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: "hsl(var(--crypto-dark))" }}
        >
          <Card
            className="max-w-md w-full"
            style={{
              backgroundColor: "hsl(var(--crypto-card))",
              borderColor: "hsl(var(--crypto-border))",
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                We encountered an unexpected error. This might be a temporary
                issue.
              </p>
              {this.state.error && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-slate-400 hover:text-slate-300">
                    Error details
                  </summary>
                  <pre className="mt-2 p-2 bg-slate-800 rounded text-xs text-red-300 overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={this.handleReset}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "hsl(var(--crypto-primary))" }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  style={{
                    borderColor: "hsl(var(--crypto-border))",
                    color: "hsl(var(--slate-300))",
                  }}
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

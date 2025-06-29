import { memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: "chat" | "graph" | "list";
  count?: number;
}

const LoadingSkeleton = memo(
  ({ type = "chat", count = 3 }: LoadingSkeletonProps) => {
    const renderChatSkeleton = () => (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Card
                style={{
                  backgroundColor: "hsl(var(--crypto-card))",
                  borderColor: "hsl(var(--crypto-border))",
                }}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    );

    const renderGraphSkeleton = () => (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card
            style={{
              backgroundColor: "hsl(var(--crypto-card))",
              borderColor: "hsl(var(--crypto-border))",
            }}
          >
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card
            style={{
              backgroundColor: "hsl(var(--crypto-card))",
              borderColor: "hsl(var(--crypto-border))",
            }}
          >
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            style={{
              backgroundColor: "hsl(var(--crypto-card))",
              borderColor: "hsl(var(--crypto-border))",
            }}
          >
            <CardHeader>
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );

    const renderListSkeleton = () => (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-3 p-3 border rounded-lg"
            style={{ borderColor: "hsl(var(--crypto-border))" }}
          >
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );

    switch (type) {
      case "graph":
        return renderGraphSkeleton();
      case "list":
        return renderListSkeleton();
      case "chat":
      default:
        return renderChatSkeleton();
    }
  }
);

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;

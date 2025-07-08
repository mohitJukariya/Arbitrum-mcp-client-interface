import { useState, useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Share2,
  Download,
  Globe,
  User,
  Loader2,
  Eye,
  Zap,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Link } from "wouter";
import GraphVisualization from "@/components/ui/graph-visualization";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { GraphNode } from "@/types/chat";
import { contextApi } from "@/lib/api";

export default function GraphPage() {
  const {
    selectedUser,
    selectedPersonality, // NEW: Support personalities
    graphData,
    graphInsights,
    loadingGraph,
    loadUserGraph,
    loadGlobalGraph,
  } = useChatStore();

  const [activeTab, setActiveTab] = useState("user");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  // Use personality if available, fallback to user for backward compatibility
  const currentProfile = selectedPersonality || selectedUser;

  // Determine if we should show the clear database button
  // Show it when there are more than 10 nodes (indicating substantial data)
  const shouldShowClearButton =
    graphData && graphData.nodes && graphData.nodes.length > 10;

  const handleClearDatabase = async () => {
    setIsClearing(true);
    try {
      const result = await contextApi.clearDatabase();
      if (result.success) {
        toast({
          title: "Database Cleared Successfully! 🗑️",
          description: `${result.message} Stats: ${
            result.stats?.nodesRemoved || 0
          } nodes and ${
            result.stats?.relationshipsRemoved || 0
          } relationships removed.`,
          duration: 5000,
        });

        // Refresh the graph data after clearing
        if (activeTab === "user" && currentProfile) {
          loadUserGraph(currentProfile.id);
        } else if (activeTab === "global") {
          loadGlobalGraph();
        }
      } else {
        throw new Error(result.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Failed to clear database:", error);
      toast({
        title: "Failed to Clear Database ❌",
        description: `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    if (currentProfile && activeTab === "user") {
      loadUserGraph(currentProfile.id);
    } else if (activeTab === "global") {
      loadGlobalGraph();
    }
  }, [currentProfile, activeTab, loadUserGraph, loadGlobalGraph]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleNodeHover = (node: GraphNode | null) => {
    setHoveredNode(node);
  };

  if (!currentProfile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(var(--crypto-dark))" }}
      >
        <Card
          style={{
            backgroundColor: "hsl(var(--crypto-card))",
            borderColor: "hsl(var(--crypto-border))",
          }}
        >
          <CardContent className="p-6 text-center">
            <p className="text-slate-400 mb-4">
              Please select an assistant first
            </p>
            <Link href="/">
              <Button>Go to Chat</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(var(--crypto-dark))" }}
    >
      {/* Header */}
      <div
        className="border-b p-4"
        style={{
          backgroundColor: "hsl(var(--crypto-surface))",
          borderColor: "hsl(var(--crypto-border))",
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                />
                <AvatarFallback>{currentProfile.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Context Graph
                </h1>
                <p className="text-sm text-slate-400">
                  {selectedPersonality
                    ? selectedPersonality.title
                    : "Conversation relationships and insights"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Clear Database Button - Show only when there's substantial data */}
            {shouldShowClearButton && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-300/50 hover:bg-red-500/10"
                    disabled={isClearing}
                  >
                    {isClearing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    {isClearing ? "Clearing..." : "Clear Memory"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  style={{
                    backgroundColor: "hsl(var(--crypto-card))",
                    borderColor: "hsl(var(--crypto-border))",
                  }}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-400 flex items-center gap-2">
                      ⚠️ Clear Database Confirmation
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-300">
                      This will permanently delete all stored conversation
                      history, user contexts, and relationship data from the
                      Neo4j database.
                      <br />
                      <br />
                      <strong className="text-red-300">
                        This action cannot be undone.
                      </strong>
                      <br />
                      <br />
                      Current database contains:{" "}
                      <strong>
                        {graphData?.metadata?.totalNodes || 0} nodes
                      </strong>{" "}
                      and{" "}
                      <strong>
                        {graphData?.metadata?.totalEdges || 0} relationships
                      </strong>
                      .
                      <br />
                      <br />
                      Are you sure you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-600 hover:bg-slate-500 text-white border-slate-500">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearDatabase}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={isClearing}
                    >
                      {isClearing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Yes, Clear Database
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              User Graph
            </TabsTrigger>
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Global Graph
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Graph Visualization */}
            <div className="lg:col-span-3">
              <Card
                style={{
                  backgroundColor: "hsl(var(--crypto-card))",
                  borderColor: "hsl(var(--crypto-border))",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    {activeTab === "user"
                      ? `${currentProfile.name}'s Network`
                      : "Global Network"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingGraph ? (
                    <LoadingSkeleton type="graph" count={1} />
                  ) : graphData ? (
                    <div className="relative">
                      <GraphVisualization
                        nodes={graphData.nodes}
                        edges={graphData.edges}
                        metadata={graphData.metadata}
                        onNodeClick={handleNodeClick}
                        onNodeHover={handleNodeHover}
                        width={800}
                        height={500}
                        className="rounded-lg bg-slate-900"
                      />
                      {hoveredNode && (
                        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-sm">
                          <div className="font-semibold">
                            {hoveredNode.label}
                          </div>
                          <div className="text-slate-300">
                            Type: {hoveredNode.type}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                          style={{
                            backgroundColor: "hsl(var(--crypto-primary))",
                          }}
                        >
                          <Share2 className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-white font-semibold mb-2">
                          No graph data available
                        </p>
                        <p className="text-slate-400">
                          Start a conversation to build your context graph
                        </p>
                      </div>
                    </div>
                  )}

                  {graphData && (
                    <div className="mt-4 text-xs text-slate-400 flex justify-between">
                      <span>
                        {graphData.metadata.totalNodes} nodes,{" "}
                        {graphData.metadata.totalEdges} edges
                      </span>
                      <span>
                        Type:{" "}
                        {graphData.metadata.userId === "global"
                          ? "Global View"
                          : "User View"}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Node Info */}
              {selectedNode && (
                <Card
                  style={{
                    backgroundColor: "hsl(var(--crypto-card))",
                    borderColor: "hsl(var(--crypto-border))",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-white text-sm">
                      Selected Node
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-400">Label</div>
                        <div className="text-white font-medium">
                          {selectedNode.label}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Type</div>
                        <Badge variant="secondary" className="capitalize">
                          {selectedNode.type}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">ID</div>
                        <div className="text-white text-xs font-mono">
                          {selectedNode.id}
                        </div>
                      </div>

                      {/* Show node properties from backend */}
                      {selectedNode.properties &&
                        Object.keys(selectedNode.properties).length > 0 && (
                          <div>
                            <div className="text-xs text-slate-400 mb-2">
                              Properties
                            </div>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {Object.entries(selectedNode.properties).map(
                                ([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <span className="text-slate-500">
                                      {key}:
                                    </span>
                                    <span className="text-white ml-2">
                                      {typeof value === "string"
                                        ? value.length > 30
                                          ? value.substring(0, 30) + "..."
                                          : value
                                        : JSON.stringify(value)}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Insights */}
              {activeTab === "user" && graphInsights && (
                <Card
                  style={{
                    backgroundColor: "hsl(var(--crypto-card))",
                    borderColor: "hsl(var(--crypto-border))",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {/* Top Tools */}
                    {graphInsights.topTools.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-400 mb-2">
                          Top Tools
                        </div>
                        <div className="space-y-1">
                          {graphInsights.topTools
                            .slice(0, 3)
                            .map((tool, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-white">{tool.tool}</span>
                                <span className="text-slate-400">
                                  {tool.usage}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {graphInsights.recommendations.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-400 mb-2">
                          Recommendations
                        </div>
                        <div className="space-y-1">
                          {graphInsights.recommendations
                            .slice(0, 2)
                            .map((rec, index) => (
                              <div
                                key={index}
                                className="text-xs text-slate-300 p-2 rounded bg-slate-800"
                              >
                                {rec}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card
                style={{
                  backgroundColor: "hsl(var(--crypto-card))",
                  borderColor: "hsl(var(--crypto-border))",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-400 hover:text-white"
                    onClick={() =>
                      activeTab === "user"
                        ? loadUserGraph(currentProfile.id)
                        : loadGlobalGraph()
                    }
                  >
                    Refresh Graph
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-400 hover:text-white"
                  >
                    Export Data
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-400 hover:text-white"
                  >
                    Reset View
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

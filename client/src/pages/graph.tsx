import { useState, useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { Link } from "wouter";
import GraphVisualization from "@/components/ui/graph-visualization";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { GraphNode } from "@/types/chat";

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

  // Use personality if available, fallback to user for backward compatibility
  const currentProfile = selectedPersonality || selectedUser;

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
            <p className="text-slate-400 mb-4">Please select an assistant first</p>
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
                  {selectedPersonality ? selectedPersonality.title : 'Conversation relationships and insights'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
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
                      <span>Layout: {graphData.layout}</span>
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
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-slate-400">Label</div>
                        <div className="text-white">{selectedNode.label}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Type</div>
                        <Badge variant="secondary">{selectedNode.type}</Badge>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Size</div>
                        <div className="text-white">{selectedNode.size}</div>
                      </div>
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

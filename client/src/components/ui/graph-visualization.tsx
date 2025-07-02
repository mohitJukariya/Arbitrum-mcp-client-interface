import React, { useRef, useEffect, useCallback, memo, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { GraphNode, GraphEdge, GraphMetadata } from "@/types/chat";

// Enhanced node type configurations based on backend API
const nodeTypeConfig = {
  user: { color: "#2196F3", size: 40, icon: "👤" }, // Blue
  query: { color: "#4CAF50", size: 25, icon: "💬" }, // Green
  tool: { color: "#FF5722", size: 30, icon: "🔧" }, // Red-Orange
  insight: { color: "#9C27B0", size: 20, icon: "💡" }, // Purple
  address: { color: "#607D8B", size: 15, icon: "📍" }, // Blue-Grey
  pattern: { color: "#FF9800", size: 25, icon: "🧠" }, // Orange
  other: { color: "#9E9E9E", size: 20, icon: "❓" }, // Grey
};

// Enhanced edge type configurations based on backend API
const edgeTypeConfig = {
  QUERIES: { color: "#4CAF50", width: 2, label: "asked" }, // Green
  HAS_QUERY: { color: "#4CAF50", width: 2, label: "asked" }, // Backward compatibility
  USED_TOOL: { color: "#FF5722", width: 1.5, label: "used" }, // Red-Orange
  GENERATED_INSIGHT: { color: "#9C27B0", width: 1, label: "learned" }, // Purple
  INVOLVES_ADDRESS: { color: "#607D8B", width: 1, label: "involves" }, // Blue-Grey
  RELATED_TO: { color: "#FFC107", width: 1, label: "related" }, // Amber
  LEARNED_PATTERN: { color: "#FF9800", width: 1, label: "pattern" }, // Orange
};

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata?: GraphMetadata; // NEW: Optional metadata from backend
  onNodeClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode | null) => void;
  width?: number;
  height?: number;
  className?: string;
}

const GraphVisualization = memo(
  ({
    nodes,
    edges,
    metadata,
    onNodeClick,
    onNodeHover,
    width = 800,
    height = 600,
    className = "",
  }: GraphVisualizationProps) => {
    const fgRef = useRef<any>();
    const [zoomLevel, setZoomLevel] = useState(1);

    // Helper function to get node configuration
    const getNodeConfig = (nodeType: string) => {
      return (
        nodeTypeConfig[nodeType as keyof typeof nodeTypeConfig] || {
          color: "#9E9E9E",
          size: 20,
          icon: "❓",
        }
      );
    };

    // Helper function to get edge configuration
    const getEdgeConfig = (edgeType: string) => {
      return (
        edgeTypeConfig[edgeType as keyof typeof edgeTypeConfig] || {
          color: "#9E9E9E",
          width: 1,
          label: edgeType.toLowerCase(),
        }
      );
    };

    // Enhanced node labeling function using backend properties
    const getNodeLabel = (node: any) => {
      const props = node.properties || {};

      switch (node.type) {
        case "user":
          return props.name || node.label || node.id;
        case "query":
          const queryContent = props.content || node.label || node.id;
          return queryContent.length > 30
            ? queryContent.substring(0, 30) + "..."
            : queryContent;
        case "tool":
          return props.name || node.label || node.id;
        case "insight":
          const insightContent = props.content || node.label || node.id;
          return insightContent.length > 25
            ? "💡 " + insightContent.substring(0, 25) + "..."
            : "💡 " + insightContent;
        case "address":
          const address = props.address || node.label || node.id;
          return address.length > 12
            ? address.substring(0, 6) +
                "..." +
                address.substring(address.length - 4)
            : address;
        case "pattern":
          const patternContent =
            props.content || props.name || node.label || node.id;
          return patternContent.length > 20
            ? "🧠 " + patternContent.substring(0, 20) + "..."
            : "🧠 " + patternContent;
        default:
          return node.label || node.id;
      }
    };

    // Early return if no nodes to render
    if (!nodes || nodes.length === 0) {
      return (
        <div
          className={`relative ${className} flex items-center justify-center`}
          style={{ width, height }}
        >
          <div className="text-slate-400 text-center">
            <p>No graph data to display</p>
            <p className="text-sm mt-2">
              Try asking questions to build the context graph
            </p>
          </div>
        </div>
      );
    }

    // Transform data for react-force-graph-2d with full backend API support
    const graphData = {
      nodes: nodes.map((node) => {
        const config = getNodeConfig(node.type);
        return {
          id: node.id,
          label: getNodeLabel(node),
          type: node.type,
          size: node.size || config.size,
          color: node.color || config.color,
          val: (node.size || config.size) * 3, // Node size for the graph
          icon: config.icon,
          properties: node.properties || {},
          // Add backend-specific properties for tooltips/interactions
          originalLabel: node.label,
          nodeData: {
            ...node.properties,
            type: node.type,
            generatedLabel: getNodeLabel(node),
          },
        };
      }),
      links: edges.map((edge) => {
        const config = getEdgeConfig(edge.type || "QUERIES");
        return {
          id: edge.id, // Use backend-provided edge ID
          source: edge.from,
          target: edge.to,
          label: edge.label || config.label,
          type: edge.type || "QUERIES",
          weight: edge.weight || 1,
          color: edge.color || config.color,
          width: config.width,
          // Store original edge data for interactions
          edgeData: {
            id: edge.id,
            type: edge.type,
            weight: edge.weight,
          },
        };
      }),
    };

    const handleNodeClick = useCallback(
      (node: any) => {
        if (onNodeClick) {
          onNodeClick({
            id: node.id,
            label: node.label,
            type: node.type,
            size: node.size,
            color: node.color,
            properties: node.properties || {},
          });
        }
      },
      [onNodeClick]
    );

    const handleNodeHover = useCallback(
      (node: any) => {
        if (onNodeHover) {
          onNodeHover(
            node
              ? {
                  id: node.id,
                  label: node.label,
                  type: node.type,
                  size: node.size,
                  color: node.color,
                  properties: node.properties || {},
                }
              : null
          );
        }
      },
      [onNodeHover]
    );

    // Enhanced custom node canvas painting
    const paintNode = useCallback(
      (node: any, ctx: CanvasRenderingContext2D) => {
        const config = getNodeConfig(node.type);
        const baseSize = Math.sqrt(node.val || 1);
        const radius = Math.max(15, baseSize * 5);

        // Draw node circle with enhanced styling based on type
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || config.color;
        ctx.fill();

        // Draw node border with type-specific styling
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = node.type === "user" ? 3 : 2; // Thicker border for users
        ctx.stroke();

        // Draw type icon in the center of the node
        if (zoomLevel > 0.6) {
          const fontSize = Math.max(12, Math.min(24, radius * 0.8));
          ctx.font = `${fontSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(config.icon, node.x, node.y);
        }

        // Draw node label with better positioning for different node types
        if (zoomLevel > 0.4) {
          const fontSize = Math.max(10, Math.min(16, (12 / zoomLevel) * 2));
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Position label further below node to avoid overlap
          const labelY = node.y + radius + 8;
          const label = node.label || node.id;

          // Background for text with better contrast
          const metrics = ctx.measureText(label);
          const padding = 6;
          ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
          ctx.fillRect(
            node.x - metrics.width / 2 - padding,
            labelY - 2,
            metrics.width + padding * 2,
            fontSize + 4
          );

          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, node.x, labelY);
        }
      },
      [zoomLevel]
    );

    // Enhanced custom link canvas painting with new edge types
    const paintLink = useCallback(
      (link: any, ctx: CanvasRenderingContext2D) => {
        const start = link.source;
        const end = link.target;

        if (typeof start !== "object" || typeof end !== "object") return;

        const config = getEdgeConfig(link.type || "QUERIES");

        // Calculate line thickness based on weight and type
        const baseThickness = config.width || 1;
        const thickness = Math.max(
          1,
          baseThickness * Math.sqrt(link.weight || 1)
        );

        // Draw link line with type-specific styling
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = link.color || config.color;
        ctx.lineWidth = thickness;

        // Different line styles for different relationship types
        if (link.type === "RELATED_TO") {
          ctx.setLineDash([5, 5]); // Dashed line for related relationships
        } else {
          ctx.setLineDash([]); // Solid line for direct relationships
        }

        ctx.stroke();

        // Draw arrow head with better positioning
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = Math.min(12, thickness * 3);
        const arrowAngle = Math.PI / 6;

        // Position arrow closer to the end node
        const nodeRadius = 15; // Approximate node radius
        const arrowX = end.x - Math.cos(angle) * nodeRadius;
        const arrowY = end.y - Math.sin(angle) * nodeRadius;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle - arrowAngle),
          arrowY - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle + arrowAngle),
          arrowY - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.closePath();
        ctx.fillStyle = link.color || config.color;
        ctx.fill();

        // Draw link label with enhanced visibility
        if (link.label && zoomLevel > 0.8) {
          const centerX = (start.x + end.x) / 2;
          const centerY = (start.y + end.y) / 2;

          const fontSize = 9;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Enhanced background for label readability
          const metrics = ctx.measureText(link.label);
          const padding = 4;
          ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
          ctx.fillRect(
            centerX - metrics.width / 2 - padding,
            centerY - fontSize / 2 - padding,
            metrics.width + padding * 2,
            fontSize + padding * 2
          );

          ctx.fillStyle = "#ffffff";
          ctx.fillText(link.label, centerX, centerY);
        }

        // Reset line dash
        ctx.setLineDash([]);
      },
      [zoomLevel]
    );

    useEffect(() => {
      if (fgRef.current && nodes.length > 0) {
        // Configure forces for better layout with enhanced support for 80+ nodes
        const fg = fgRef.current;

        // Adjust forces based on number of nodes and node types
        const nodeCount = nodes.length;
        const isSmallGraph = nodeCount < 15;
        const isMediumGraph = nodeCount >= 15 && nodeCount < 50;
        const isLargeGraph = nodeCount >= 50;

        // Enhanced force configurations for different graph sizes
        let chargeStrength, linkDistance, collisionRadius;

        if (isSmallGraph) {
          chargeStrength = -800;
          linkDistance = 200;
          collisionRadius = 40;
        } else if (isMediumGraph) {
          chargeStrength = -600;
          linkDistance = 150;
          collisionRadius = 30;
        } else {
          // Large graph (80+ nodes)
          chargeStrength = -400;
          linkDistance = 120;
          collisionRadius = 25;
        }

        // Set up forces with enhanced configurations
        fg.d3Force("charge")
          .strength(chargeStrength)
          .distanceMax(isLargeGraph ? 600 : 400);
        fg.d3Force("link").distance(linkDistance).strength(0.3);

        // Enhanced collision detection with node type awareness
        const collisionForce = fg.d3Force("collision");
        if (collisionForce) {
          collisionForce
            .radius((node: any) => {
              const baseSize = Math.sqrt(node.val || 1);
              const config = getNodeConfig(node.type);
              const typeMultiplier = node.type === "user" ? 1.2 : 1.0; // Users need more space
              return Math.max(collisionRadius, baseSize * 12 * typeMultiplier);
            })
            .strength(isLargeGraph ? 0.8 : 1.0);
        }

        // Add a center force to prevent drift, stronger for smaller graphs
        const centerStrength = isSmallGraph ? 0.1 : isLargeGraph ? 0.03 : 0.05;
        fg.d3Force("center", fg.d3Force("center")?.strength(centerStrength));

        // Auto-fit to canvas after simulation settles with timing based on graph size
        const settlementTime = isSmallGraph
          ? 2500
          : isMediumGraph
          ? 2000
          : 1500;
        const timer = setTimeout(() => {
          if (fg && fg.zoomToFit) {
            const padding = isSmallGraph ? 80 : isMediumGraph ? 60 : 40;
            fg.zoomToFit(400, padding);
          }
        }, settlementTime);

        return () => clearTimeout(timer);
      }
    }, [nodes, edges]);

    // Handle zoom changes
    const handleZoom = useCallback((transform: any) => {
      if (transform && typeof transform.k === "number") {
        setZoomLevel(transform.k);
      }
    }, []);

    // Handle engine stop to ensure proper initial rendering
    const handleEngineStop = useCallback(() => {
      if (fgRef.current && fgRef.current.zoomToFit) {
        const isSmallGraph = nodes.length < 10;
        const padding = isSmallGraph ? 100 : 50;
        fgRef.current.zoomToFit(400, padding);
      }
    }, [nodes.length]);

    return (
      <div className={`relative ${className}`}>
        {/* Enhanced graph information overlay with backend metadata */}
        <div className="absolute top-2 left-2 bg-black/80 text-white px-4 py-3 rounded-lg text-xs z-10 backdrop-blur-sm border border-white/20">
          <div className="font-semibold text-blue-300 mb-1">
            📊 Context Graph{" "}
            {metadata?.userId === "global" ? "(Global)" : "(User)"}
            {/* Show if using fallback data */}
            {metadata?.isFallbackData ? (
              <span className="text-orange-300 ml-2">(Demo Data)</span>
            ) : (
              ""
            )}
          </div>
          <div className="space-y-1">
            <div>
              Nodes: {metadata?.totalNodes || nodes.length} | Edges:{" "}
              {metadata?.totalEdges || edges.length}
            </div>
            <div className="text-slate-300 text-[10px] space-y-0.5">
              <div className="flex gap-3">
                <span>
                  👤 Users:{" "}
                  {metadata?.userCount ||
                    nodes.filter((n) => n.type === "user").length}
                </span>
                <span>
                  🔧 Tools:{" "}
                  {metadata?.toolCount ||
                    nodes.filter((n) => n.type === "tool").length}
                </span>
              </div>
              <div className="flex gap-3">
                <span>
                  💬 Queries:{" "}
                  {metadata?.queryCount ||
                    nodes.filter((n) => n.type === "query").length}
                </span>
                <span>
                  💡 Insights:{" "}
                  {metadata?.insightCount ||
                    nodes.filter((n) => n.type === "insight").length}
                </span>
              </div>
              <div className="flex gap-3">
                <span>
                  📍 Addresses:{" "}
                  {metadata?.addressCount ||
                    nodes.filter((n) => n.type === "address").length}
                </span>
                {nodes.filter((n) => n.type === "pattern").length > 0 && (
                  <span>
                    🧠 Patterns:{" "}
                    {nodes.filter((n) => n.type === "pattern").length}
                  </span>
                )}
              </div>
            </div>
            {metadata?.generatedAt && (
              <div className="text-slate-400 text-[9px] mt-2 border-t border-white/10 pt-1">
                Updated: {new Date(metadata.generatedAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={width}
          height={height}
          backgroundColor="transparent"
          nodeCanvasObject={paintNode}
          linkCanvasObject={paintLink}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onZoom={handleZoom}
          onEngineStop={handleEngineStop}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          cooldownTicks={
            nodes.length < 15 ? 300 : nodes.length < 50 ? 200 : 150
          }
          cooldownTime={
            nodes.length < 15 ? 3000 : nodes.length < 50 ? 2000 : 1500
          }
          nodeRelSize={1}
          linkWidth={0}
          nodeLabel=""
          minZoom={0.3}
          maxZoom={5}
          d3AlphaDecay={
            nodes.length < 15 ? 0.01 : nodes.length < 50 ? 0.012 : 0.015
          }
          d3VelocityDecay={0.25}
        />
      </div>
    );
  }
);

GraphVisualization.displayName = "GraphVisualization";

export default GraphVisualization;

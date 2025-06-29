import React, { useRef, useEffect, useCallback, memo, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { GraphNode, GraphEdge } from "@/types/chat";

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
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
    onNodeClick,
    onNodeHover,
    width = 800,
    height = 600,
    className = "",
  }: GraphVisualizationProps) => {
    const fgRef = useRef<any>();
    const [zoomLevel, setZoomLevel] = useState(1);

    // Early return if no nodes to render
    if (!nodes || nodes.length === 0) {
      return (
        <div
          className={`relative ${className} flex items-center justify-center`}
          style={{ width, height }}
        >
          <div className="text-slate-400 text-center">
            <p>No graph data to display</p>
          </div>
        </div>
      );
    }

    // Transform data for react-force-graph-2d
    const graphData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        label: node.label,
        type: node.type,
        size: node.size,
        color: node.color,
        val: (node.size || 1) * 3, // Node size for the graph - make nodes bigger
      })),
      links: edges.map((edge) => ({
        source: edge.from,
        target: edge.to,
        label: edge.label,
        weight: edge.weight,
        color: edge.color || "#64748b",
      })),
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
                }
              : null
          );
        }
      },
      [onNodeHover]
    ); // Custom node canvas painting
    const paintNode = useCallback(
      (node: any, ctx: CanvasRenderingContext2D) => {
        const baseSize = Math.sqrt(node.val || 1);
        const radius = Math.max(15, baseSize * 5);

        // Draw node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || "#4f46e5";
        ctx.fill();

        // Draw node border
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw node label with better positioning for small graphs
        if (zoomLevel > 0.4) {
          const fontSize = Math.max(11, Math.min(18, (13 / zoomLevel) * 2));
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Position label further below node to avoid overlap
          const labelY = node.y + radius + 10;
          const label = node.label || node.id;

          // Background for text with more padding
          const metrics = ctx.measureText(label);
          const padding = 4;
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

    // Custom link canvas painting
    const paintLink = useCallback(
      (link: any, ctx: CanvasRenderingContext2D) => {
        const start = link.source;
        const end = link.target;

        if (typeof start !== "object" || typeof end !== "object") return;

        // Calculate line thickness based on weight
        const thickness = Math.max(1, Math.sqrt(link.weight || 1));

        // Draw link line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = link.color || "#64748b";
        ctx.lineWidth = thickness;
        ctx.stroke();

        // Draw arrow head
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = 8;
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
        ctx.fillStyle = link.color || "#64748b";
        ctx.fill();

        // Draw link label if zoom level is sufficient
        if (link.label && zoomLevel > 1) {
          const centerX = (start.x + end.x) / 2;
          const centerY = (start.y + end.y) / 2;

          const fontSize = 10;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Add background for label readability
          const metrics = ctx.measureText(link.label);
          const padding = 3;
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(
            centerX - metrics.width / 2 - padding,
            centerY - fontSize / 2 - padding,
            metrics.width + padding * 2,
            fontSize + padding * 2
          );

          ctx.fillStyle = "#ffffff";
          ctx.fillText(link.label, centerX, centerY);
        }
      },
      [zoomLevel]
    );

    useEffect(() => {
      if (fgRef.current && nodes.length > 0) {
        // Configure forces for better layout
        const fg = fgRef.current;

        // Adjust forces based on number of nodes for better spacing
        const nodeCount = nodes.length;
        const isSmallGraph = nodeCount < 10;

        // Much stronger repulsion for smaller graphs to spread nodes out
        const chargeStrength = isSmallGraph ? -800 : -400;
        const linkDistance = isSmallGraph ? 200 : 120;

        // Set up forces
        fg.d3Force("charge").strength(chargeStrength).distanceMax(400);
        fg.d3Force("link").distance(linkDistance).strength(0.3);

        // Add collision detection with larger radius for small graphs
        const collisionForce = fg.d3Force("collision");
        if (collisionForce) {
          collisionForce
            .radius((node: any) => {
              const baseSize = Math.sqrt(node.val || 1);
              const minRadius = isSmallGraph ? 40 : 25;
              return Math.max(minRadius, baseSize * 12);
            })
            .strength(1.0);
        }

        // Add a center force for small graphs to prevent drift
        if (isSmallGraph) {
          fg.d3Force("center", fg.d3Force("center")?.strength(0.1));
        }

        // Auto-fit to canvas after simulation settles with more time for small graphs
        const timer = setTimeout(
          () => {
            if (fg && fg.zoomToFit) {
              const padding = isSmallGraph ? 80 : 50;
              fg.zoomToFit(400, padding);
            }
          },
          isSmallGraph ? 2500 : 1500
        );

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
          cooldownTicks={nodes.length < 10 ? 300 : 150}
          cooldownTime={nodes.length < 10 ? 3000 : 1500}
          nodeRelSize={1}
          linkWidth={0}
          nodeLabel=""
          minZoom={0.5}
          maxZoom={4}
          d3AlphaDecay={nodes.length < 10 ? 0.01 : 0.015}
          d3VelocityDecay={0.25}
        />
      </div>
    );
  }
);

GraphVisualization.displayName = "GraphVisualization";

export default GraphVisualization;

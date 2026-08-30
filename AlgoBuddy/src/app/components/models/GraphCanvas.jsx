// app/components/models/GraphCanvas.jsx
"use client";
import { useRef, useState, useCallback } from "react";

const NODE_RADIUS = 26;
const COLORS = {
  unvisited: { fill: "#111", stroke: "#22c55e" },
  visiting:  { fill: "#854d0e", stroke: "#f97316" },
  visited:   { fill: "#14532d", stroke: "#22c55e" },
};

function edgeEndpoint(x1, y1, x2, y2, radius) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: x2 - (dx / dist) * (radius + 4),
    y: y2 - (dy / dist) * (radius + 4),
  };
}

function SelfLoop({ cx, cy, color }) {
  return (
    <ellipse
      cx={cx}
      cy={cy - NODE_RADIUS - 14}
      rx={14}
      ry={10}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      markerEnd="url(#arrowhead)"
    />
  );
}

// Renders an editable weight label at the midpoint of an edge
function EdgeWeightLabel({ x1, y1, x2, y2, weight, onWeightChange }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  return (
    <foreignObject x={mx - 16} y={my - 14} width={32} height={24}>
      <input
        xmlns="http://www.w3.org/1999/xhtml"
        type="number"
        value={weight}
        min={1}
        onChange={(e) => onWeightChange(Number(e.target.value) || 1)}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "100%",
          background: "#1f2937",
          color: "#f9fafb",
          border: "1px solid #4b5563",
          borderRadius: 4,
          textAlign: "center",
          fontSize: 11,
          fontFamily: "monospace",
          padding: 0,
          outline: "none",
        }}
      />
    </foreignObject>
  );
}

export default function GraphCanvas({
  nodes,
  edges,
  isDirected,
  isWeighted = false,
  visitedSet,
  currentNode,
  animationState = {},
  interactive = true,
  className = "",
  onAddNode,
  onMoveNode,
  onAddEdge,
  onRemoveNode,
  onRemoveEdge,
  onReverseEdge,
  onUpdateEdgeWeight, // NEW prop — (edgeIdx, newWeight) => void
}) {
  const svgRef = useRef(null);
  const [edgeStart, setEdgeStart] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const getNodeState = (id) => {
    if (animationState.visitingNodes?.has(id) || id === currentNode) return "visiting";
    if (animationState.visitedNodes?.has(id) || visitedSet?.has(id)) return "visited";
    return "unvisited";
  };

  const handleCanvasClick = useCallback(
    (e) => {
      if (!interactive || !onAddNode) return;
      if (e.target !== svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      onAddNode({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setEdgeStart(null);
    },
    [interactive, onAddNode]
  );

  const handleNodeClick = useCallback(
    (e, id) => {
      if (!interactive || !onAddEdge) return;
      e.stopPropagation();
      if (edgeStart === null) {
        setEdgeStart(id);
      } else if (edgeStart === id) {
        setEdgeStart(null);
      } else {
        // When adding an edge in weighted mode, default weight = 1
        onAddEdge({ from: edgeStart, to: id, weight: 1 });
        setEdgeStart(null);
      }
    },
    [edgeStart, interactive, onAddEdge]
  );
  const handleNodeMouseDown = useCallback(
  (e, id) => {
    if (!interactive || !onMoveNode) return;

    e.stopPropagation();

    setDraggingNode(id);
  },
  [interactive, onMoveNode]
);

const handleMouseMove = useCallback(
  (e) => {
    if (!draggingNode || !onMoveNode || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();

    onMoveNode(
      draggingNode,
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  },
  [draggingNode, onMoveNode]
);

const handleMouseUp = useCallback(() => {
  setDraggingNode(null);
}, []);
  const handleNodeRightClick = useCallback(
    (e, id) => {
      if (!interactive || !onRemoveNode) return;
      e.preventDefault();
      onRemoveNode(id);
      setEdgeStart(null);
    },
    [interactive, onRemoveNode]
  );

  const handleEdgeRightClick = useCallback(
    (e, edgeIdx) => {
      if (!interactive || !onRemoveEdge) return;
      e.preventDefault();
      const menu = window.confirm(
        isDirected
          ? "Right-click edge: OK = Reverse direction, Cancel = Delete edge"
          : "Delete this edge?"
      );
      if (menu && isDirected && onReverseEdge) onReverseEdge(edgeIdx);
      else if (!isDirected || !menu) onRemoveEdge(edgeIdx);
    },
    [interactive, isDirected, onRemoveEdge, onReverseEdge]
  );

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const isActiveEdge = (edge) => {
    const active = animationState.activeEdge;
    const mstEdges = animationState.mstEdges || [];

    return (
      (active &&
        ((active.from === edge.from && active.to === edge.to) ||
          (!isDirected && active.from === edge.to && active.to === edge.from))) ||
      mstEdges.some(
        (mstEdge) =>
          (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
          (!isDirected && mstEdge.from === edge.to && mstEdge.to === edge.from),
      )
    );
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      className={className}
      style={{ cursor: interactive && edgeStart !== null ? "crosshair" : "default", minHeight: 420 }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
onMouseUp={handleMouseUp}
onMouseLeave={handleMouseUp}
    >
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        <marker
          id="arrowhead-active"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {edges.map((edge, idx) => {
        const src = nodeMap[edge.from];
        const tgt = nodeMap[edge.to];
        if (!src || !tgt) return null;

        if (edge.from === edge.to) {
          return <SelfLoop key={idx} cx={src.x} cy={src.y} color="#22c55e" />;
        }

        const isActive = isActiveEdge(edge) || currentNode === edge.from || currentNode === edge.to;
        const edgeColor = isActive ? "#f97316" : "#6b7280";
        const markerEnd = edge.directed
          ? isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"
          : undefined;

        const { x: ex, y: ey } = edge.directed
          ? edgeEndpoint(src.x, src.y, tgt.x, tgt.y, NODE_RADIUS)
          : { x: tgt.x, y: tgt.y };

        const labelX = (src.x + tgt.x) / 2;
        const labelY = (src.y + tgt.y) / 2;

        return (
          <g key={idx}>
            <line
              x1={src.x}
              y1={src.y}
              x2={ex}
              y2={ey}
              stroke={edgeColor}
              strokeWidth={isActive ? 2 : 1.5}
              markerEnd={markerEnd}
              style={{ cursor: interactive ? "pointer" : "default" }}
              onContextMenu={(e) => handleEdgeRightClick(e, idx)}
            />
            {isWeighted && (
              <EdgeWeightLabel
                x1={src.x}
                y1={src.y}
                x2={ex}
                y2={ey}
                weight={edge.weight ?? 1}
                onWeightChange={(newWeight) => onUpdateEdgeWeight(idx, newWeight)}
              />
            )}
          </g>
        );
      })}

      {nodes.map((node) => {
        const state = getNodeState(node.id);
        const { fill, stroke } = COLORS[state];
        const isSelected = edgeStart === node.id;

        return (
          <g
            key={node.id}
            onClick={(e) => handleNodeClick(e, node.id)}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onContextMenu={(e) => handleNodeRightClick(e, node.id)}
            style={{ cursor: interactive ? "pointer" : "default" }}
          >
            {isSelected && (
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS + 6}
                fill="none"
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="4 3"
                opacity={0.8}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill={fill}
              stroke={stroke}
              strokeWidth={2.5}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#d1d5db"
              fontSize={14}
              fontWeight={500}
              fontFamily="monospace"
            >
              {node.id}
            </text>
          </g>
        );
      })}

      {nodes.length === 0 && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#4b5563"
          fontSize={14}
        >
          Click anywhere to add a node
        </text>
      )}

      {edgeStart !== null && (
        <text x={12} y={20} fill="#f97316" fontSize={12}>
          Click another node to connect · click same node or press Esc to cancel
        </text>
      )}
    </svg>
  );
}

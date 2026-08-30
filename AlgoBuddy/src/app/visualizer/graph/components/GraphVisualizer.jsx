"use client";

import React, { useState, useMemo, useCallback } from "react";
import { 
  Settings2,
  BarChart3,
  Info
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import GraphCanvas from "@/app/components/models/GraphCanvas";
import AdjacencyPanel from "@/app/components/models/AdjacencyPanel";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { CustomInputPanel } from "@/app/visualizer/components/CustomInputPanel";
import { bfsGenerator } from "@/features/algorithms/graph/bfsLogic";
import { dfsGenerator } from "@/features/algorithms/graph/dfsLogic";
import { dijkstraGenerator } from "@/features/algorithms/graph/dijkstraLogic";
import { bellmanFordGenerator } from "@/features/algorithms/graph/bellmanFordLogic";
import { floydWarshallGenerator } from "@/features/algorithms/graph/floydWarshallLogic";
import { primGenerator } from "@/features/algorithms/graph/primLogic";
import { kruskalGenerator } from "@/features/algorithms/graph/kruskalLogic";
import { topologicalSortGenerator } from "@/features/algorithms/graph/topologicalSortLogic";
import { kosarajuGenerator } from "@/features/algorithms/graph/kosarajuLogic";
import { tarjanGenerator } from "@/features/algorithms/graph/tarjanLogic";
import { 
  adjacencyListFrames,
  adjacencyMatrixFrames
} from "../utils/algorithms";

const weightedAlgorithms = new Set(["dijkstra", "bellman-ford", "floyd-warshall", "prim", "kruskal"]);
const directedAlgorithms = new Set(["dijkstra", "bellman-ford", "floyd-warshall", "topological-sort", "kosaraju", "tarjan"]);

const defaultGraphs = {
  bfs: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 1, directed: false },
    ]
  },
  dfs: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "3", to: "4", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "2", to: "5", weight: 1, directed: false },
    ]
  },
  dijkstra: {
    nodes: [
      { id: "0", x: 100, y: 250, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 300, y: 400, label: "C" },
      { id: "3", x: 500, y: 100, label: "D" },
      { id: "4", x: 500, y: 400, label: "E" },
      { id: "5", x: 700, y: 250, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 4, directed: true },
      { from: "0", to: "2", weight: 2, directed: true },
      { from: "1", to: "3", weight: 5, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "1", weight: 8, directed: true },
      { from: "2", to: "3", weight: 10, directed: true },
      { from: "2", to: "4", weight: 3, directed: true },
      { from: "3", to: "5", weight: 2, directed: true },
      { from: "4", to: "3", weight: 4, directed: true },
      { from: "4", to: "5", weight: 6, directed: true },
    ]
  },
  "floyd-warshall": {
    nodes: [
      { id: "0", x: 120, y: 160, label: "A" },
      { id: "1", x: 340, y: 90, label: "B" },
      { id: "2", x: 560, y: 160, label: "C" },
      { id: "3", x: 250, y: 360, label: "D" },
      { id: "4", x: 520, y: 350, label: "E" },
    ],
    edges: [
      { from: "0", to: "1", weight: 3, directed: true },
      { from: "0", to: "3", weight: 8, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "1", to: "3", weight: 4, directed: true },
      { from: "2", to: "4", weight: 2, directed: true },
      { from: "3", to: "2", weight: 2, directed: true },
      { from: "3", to: "4", weight: 7, directed: true },
      { from: "4", to: "0", weight: 4, directed: true },
    ]
  },
  "bellman-ford": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 300, y: 400, label: "C" },
      { id: "3", x: 500, y: 100, label: "D" },
      { id: "4", x: 500, y: 400, label: "E" },
      { id: "5", x: 700, y: 250, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 4, directed: true },
      { from: "0", to: "2", weight: 2, directed: true },
      { from: "1", to: "3", weight: 5, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "1", weight: 8, directed: true },
      { from: "2", to: "3", weight: 10, directed: true },
      { from: "2", to: "4", weight: 3, directed: true },
      { from: "3", to: "5", weight: 2, directed: true },
      { from: "4", to: "3", weight: -4, directed: true },
      { from: "4", to: "5", weight: 6, directed: true },
    ]
  },
  prim: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 2, directed: false },
      { from: "0", to: "2", weight: 3, directed: false },
      { from: "1", to: "3", weight: 5, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 4, directed: false },
      { from: "4", to: "5", weight: 2, directed: false },
    ]
  },
  kruskal: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 2, directed: false },
      { from: "0", to: "2", weight: 3, directed: false },
      { from: "1", to: "3", weight: 5, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 4, directed: false },
      { from: "4", to: "5", weight: 2, directed: false },
    ]
  },
  "topological-sort": {
    nodes: [
      { id: "0", x: 100, y: 100, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 500, y: 100, label: "C" },
      { id: "3", x: 100, y: 400, label: "D" },
      { id: "4", x: 300, y: 400, label: "E" },
      { id: "5", x: 500, y: 400, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "3", to: "1", weight: 1, directed: true },
      { from: "3", to: "4", weight: 1, directed: true },
      { from: "4", to: "5", weight: 1, directed: true },
      { from: "2", to: "5", weight: 1, directed: true },
    ]
  },
  "kosaraju": {
    nodes: [
      { id: "0", x: 150, y: 150, label: "0" },
      { id: "1", x: 350, y: 100, label: "1" },
      { id: "2", x: 250, y: 300, label: "2" },
      { id: "3", x: 500, y: 300, label: "3" },
      { id: "4", x: 650, y: 150, label: "4" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "0", weight: 1, directed: true },
      { from: "1", to: "3", weight: 1, directed: true },
      { from: "3", to: "4", weight: 1, directed: true },
      { from: "4", to: "3", weight: 1, directed: true },
    ]
  },
  "tarjan": {
    nodes: [
      { id: "0", x: 150, y: 150, label: "0" },
      { id: "1", x: 350, y: 100, label: "1" },
      { id: "2", x: 250, y: 300, label: "2" },
      { id: "3", x: 500, y: 300, label: "3" },
      { id: "4", x: 650, y: 150, label: "4" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "0", weight: 1, directed: true },
      { from: "1", to: "3", weight: 1, directed: true },
      { from: "3", to: "4", weight: 1, directed: true },
      { from: "4", to: "3", weight: 1, directed: true },
    ]
  },
  "adjacency-list": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "0" },
      { id: "1", x: 300, y: 100, label: "1" },
      { id: "2", x: 300, y: 400, label: "2" },
      { id: "3", x: 500, y: 250, label: "3" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "2", to: "3", weight: 1, directed: false },
    ]
  },
  "adjacency-matrix": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "0" },
      { id: "1", x: 300, y: 100, label: "1" },
      { id: "2", x: 300, y: 400, label: "2" },
      { id: "3", x: 500, y: 250, label: "3" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "2", to: "3", weight: 1, directed: false },
    ]
  }
};

const complexityData = {
  bfs: [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  dfs: [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  dijkstra: [
    { name: 'Time', value: 95, label: 'O((V+E)logV)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "floyd-warshall": [
    { name: 'Time', value: 100, label: 'O(V^3)', full: 'Time Complexity' },
    { name: 'Space', value: 90, label: 'O(V^2)', full: 'Space Complexity' },
  ],
  "bellman-ford": [
    { name: 'Time', value: 90, label: 'O(VE)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  prim: [
    { name: 'Time', value: 90, label: 'O(ElogV)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  kruskal: [
    { name: 'Time', value: 90, label: 'O(ElogE)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "topological-sort": [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "kosaraju": [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "tarjan": [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "adjacency-list": [
    { name: 'Space', value: 60, label: 'O(V+E)', full: 'Space Complexity' },
    { name: 'Add Node', value: 10, label: 'O(1)', full: 'Time Complexity' },
  ],
  "adjacency-matrix": [
    { name: 'Space', value: 90, label: 'O(V^2)', full: 'Space Complexity' },
    { name: 'Edge Check', value: 10, label: 'O(1)', full: 'Time Complexity' },
  ],
};

const comparisonData = [
  { name: 'BFS', time: 80, space: 60 },
  { name: 'DFS', time: 80, space: 60 },
  { name: 'Dijkstra', time: 95, space: 65 },
  { name: 'Bellman', time: 90, space: 60 },
  { name: 'Floyd', time: 100, space: 90 },
  { name: 'MST', time: 90, space: 60 },
  { name: 'SCC', time: 80, space: 60 },
];

export default function GraphVisualizer({ algorithm = "bfs", startNode: initialStartNode }) {
  const [nodes, setNodes] = useState(defaultGraphs[algorithm]?.nodes || []);
  const [edges, setEdges] = useState(defaultGraphs[algorithm]?.edges || []);
  const [isEditing, setIsEditing] = useState(true);

  // Derived flags
  const isWeighted = weightedAlgorithms.has(algorithm);
  const isDirected = directedAlgorithms.has(algorithm);

  const frames = useMemo(() => {
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      if (isWeighted) {
        adj[e.from].push({ node: e.to, weight: e.weight ?? 1 });
        if (!e.directed) adj[e.to].push({ node: e.from, weight: e.weight ?? 1 });
      } else {
        adj[e.from].push(e.to);
        if (!e.directed) adj[e.to].push(e.from);
      }
    });

    const startNodeId = initialStartNode || (nodes.length > 0 ? nodes[0].id : null);
    if (algorithm === "bfs") return Array.from(bfsGenerator(adj, startNodeId));
    if (algorithm === "dfs") return Array.from(dfsGenerator(adj, startNodeId));
    if (algorithm === "dijkstra") return Array.from(dijkstraGenerator(adj, startNodeId));
    if (algorithm === "bellman-ford") return Array.from(bellmanFordGenerator(nodes, edges, startNodeId));
    if (algorithm === "floyd-warshall") return Array.from(floydWarshallGenerator(nodes, edges));
    if (algorithm === "prim") return Array.from(primGenerator(adj, startNodeId));
    if (algorithm === "kruskal") return Array.from(kruskalGenerator(nodes, edges));
    if (algorithm === "topological-sort") return Array.from(topologicalSortGenerator(adj, nodes.map(n => n.id)));
    if (algorithm === "kosaraju") return Array.from(kosarajuGenerator(adj, nodes));
    if (algorithm === "tarjan") return Array.from(tarjanGenerator(adj, nodes));
    if (algorithm === "adjacency-list") return adjacencyListFrames(nodes, edges);
    if (algorithm === "adjacency-matrix") return adjacencyMatrixFrames(nodes, edges);
    return [];
  }, [nodes, edges, algorithm, initialStartNode, isWeighted]);

  const onStep = useCallback((step) => {
    // No specific local state needs to be updated here 
    // since the visual representation is fully derived from `frames[engine.currentStep]`.
  }, []);

  const engine = useAnimationEngine({ steps: frames, onStep, initialSpeed: 1000 });

  // Handle edge weight updates from GraphCanvas
  const handleUpdateEdgeWeight = useCallback((edgeIdx, newWeight) => {
    setEdges((prev) =>
      prev.map((e, i) => (i === edgeIdx ? { ...e, weight: newWeight } : e))
    );
    engine.reset();
  }, [engine]);

  // When adding an edge, default weight = 1
  const handleAddEdge = useCallback((edge) => {
    setEdges((prev) => [...prev, { ...edge, weight: 1, directed: isDirected }]);
    engine.reset();
  }, [isDirected, engine]);

  const handleCustomGraphInput = useCallback((parsedEdges) => {
    if (parsedEdges === null) {
      setNodes(defaultGraphs[algorithm]?.nodes || []);
      setEdges(defaultGraphs[algorithm]?.edges || []);
    } else {
      const nodeIds = Array.from(
        new Set(parsedEdges.flatMap(e => [e.source, e.target]))
      ).sort((a, b) => a - b);
      
      const centerX = 400;
      const centerY = 250;
      const radius = 180;
      const numNodes = nodeIds.length;
      
      const newNodes = nodeIds.map((id, idx) => {
        const angle = (idx * 2 * Math.PI) / (numNodes || 1);
        return {
          id: String(id),
          x: Math.round(centerX + radius * Math.cos(angle)),
          y: Math.round(centerY + radius * Math.sin(angle)),
          label: !isNaN(Number(id)) ? String.fromCharCode(65 + (Number(id) % 26)) : String(id)
        };
      });

      const newEdges = parsedEdges.map(e => ({
        from: String(e.source),
        to: String(e.target),
        weight: e.weight,
        directed: isDirected
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    }
    engine.reset();
  }, [algorithm, isDirected, engine]);

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      engine.reset();
      setTimeout(() => engine.play(), 50);
    } else if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
    setIsEditing(false); // If they press play/pause, it shouldn't be in edit mode
  };

  const reset = () => {
    engine.reset();
    setIsEditing(true);
  };

  const stepForward = () => {
    engine.stepForward();
    setIsEditing(false);
  };

  const stepBackward = () => {
    engine.stepBackward();
    setIsEditing(false);
  };

  useVisualizerKeyboard({
    onStart: togglePlay,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: reset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const currentFrameData = frames[engine.currentStep] || {};
  const showFloydMatrix = algorithm === "floyd-warshall" && currentFrameData.matrix;
  const nodeLabelById = Object.fromEntries(nodes.map((node) => [node.id, node.label || node.id]));

  const addNode = ({ x, y }) => {
    const usedIds = new Set(nodes.map((node) => node.id));
    let nextId = `${nodes.length}`;
    let counter = nodes.length;
    while (usedIds.has(nextId)) {
      counter += 1;
      nextId = `${counter}`;
    }

    setNodes((current) => [
      ...current,
      {
        id: nextId,
        x,
        y,
        label: String.fromCharCode(65 + (counter % 26)),
      },
    ]);
    engine.reset();
  };

  const moveNode = (id, x, y) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === id
          ? { ...node, x, y }
          : node
      )
    );
  };

  const removeNode = (id) => {
    setNodes((current) => current.filter((node) => node.id !== id));
    setEdges((current) => current.filter((edge) => edge.from !== id && edge.to !== id));
    engine.reset();
  };

  const removeEdge = (edgeIndex) => {
    setEdges((current) => current.filter((_, index) => index !== edgeIndex));
    engine.reset();
  };

  const reverseEdge = (edgeIndex) => {
    setEdges((current) =>
      current.map((edge, index) =>
        index === edgeIndex ? { ...edge, from: edge.to, to: edge.from } : edge,
      ),
    );
    engine.reset();
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isEditing 
                  ? "bg-primary text-white" 
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300"
              }`}
            >
              <Settings2 className="h-4 w-4" />
              {isEditing ? "Editing Mode" : "Visualization Mode"}
            </button>

            {/* Weighted badge */}
            {isWeighted && (
              <span className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                Weighted
              </span>
            )}

            {/* Directed badge */}
            {isDirected && (
              <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                Directed
              </span>
            )}

            {!isEditing && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                  <Info className="h-4 w-4 text-primary" />
                  {currentFrameData.description || "Ready to start"}
                </div>
                {currentFrameData.queue && currentFrameData.queue.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-primary dark:bg-blue-900/20 dark:text-[#c27cf7]">
                    Queue: [{currentFrameData.queue.join(", ")}]
                  </div>
                )}
                {currentFrameData.stack && currentFrameData.stack.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-600 dark:bg-purple-900/20 dark:text-[#c27cf7]">
                    Stack: [{currentFrameData.stack.join(", ")}]
                  </div>
                )}
                {currentFrameData.distances && (
                  <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Distances: {Object.entries(currentFrameData.distances)
                      .map(([k, v]) => `${k}:${v === Infinity ? "∞" : v}`)
                      .join(", ")}
                  </div>
                )}
                {currentFrameData.intermediate && (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    k: {nodes.find((node) => node.id === currentFrameData.intermediate)?.label || currentFrameData.intermediate}
                  </div>
                )}
                {currentFrameData.result && currentFrameData.result.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
                    Order: {currentFrameData.result.join(" → ")}
                  </div>
                )}
                {currentFrameData.sccs && currentFrameData.sccs.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                    SCCs: {currentFrameData.sccs.map(scc => `[${scc.join(",")}]`).join(" ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onAddNode={addNode}
          onAddEdge={handleAddEdge}
          onRemoveNode={removeNode}
          onRemoveEdge={removeEdge}
          onReverseEdge={reverseEdge}
          onMoveNode={moveNode}
          onUpdateEdgeWeight={handleUpdateEdgeWeight}
          animationState={!isEditing ? currentFrameData : {}}
          interactive={isEditing}
          isWeighted={isWeighted}
          isDirected={isDirected}
          visitedSet={currentFrameData.visitedNodes}
          currentNode={currentFrameData.currentNode}
          className="w-full"
        />

        {/* Controls Bar */}
        <PlaybackControls
          isPlaying={engine.isPlaying}
          onPlayPause={togglePlay}
          speed={engine.speed / 1000}
          onSpeedChange={(s) => engine.setSpeed(s * 1000)}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onReset={reset}
          progressText={`${engine.currentStep + 1} / ${frames.length || 1}`}
          disabled={frames.length === 0}
        />
      </div>

      {/* Info & Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Complexity Card */}
          <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <BarChart3 className="h-5 w-5" />
              <h3 className="font-bold">Complexity Analysis</h3>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complexityData[algorithm]} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="currentColor" className="text-[10px] text-surface-500" />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-surface-200 bg-white p-2 text-xs shadow-lg dark:border-surface-800 dark:bg-surface-950">
                            <p className="font-bold text-primary">{payload[0].payload.full}</p>
                            <p className="font-mono font-bold text-surface-900 dark:text-white">{payload[0].payload.label}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {complexityData[algorithm].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "var(--color-primary)" : "var(--color-success)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Worst Case Time</span>
                <span className="font-mono font-bold text-primary">{complexityData[algorithm][0].label}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Worst Case Space</span>
                <span className="font-mono font-bold text-success">{complexityData[algorithm][1].label}</span>
              </div>
            </div>
          </div>

          {/* Algorithm Comparison */}
          <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <h3 className="mb-4 text-sm font-bold text-surface-900 dark:text-white">Algorithm Comparison</h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-200)" />
                  <XAxis dataKey="name" stroke="currentColor" className="text-[10px] text-surface-500" />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-950)', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="time" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Time Complexity Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[10px] text-surface-500 leading-tight">
              Higher score indicates more operations or complex data structures involved in the worst case.
            </p>
          </div>
        </div>

      {/* Adjacency Representation & Custom Input */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
          <h3 className="mb-4 text-sm font-bold text-surface-900 dark:text-white">Adjacency Representation</h3>
          <AdjacencyPanel
            nodes={nodes}
            edges={edges}
            isDirected={isDirected}
            isWeighted={isWeighted}
          />
          <div className="mt-4 space-y-4">
            {showFloydMatrix && (
              <div>
                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-surface-500">Floyd-Warshall Distance Matrix</h4>
                <div className="overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-[11px] dark:bg-surface-950">
                  <table className="w-full border-collapse text-center">
                    <thead>
                      <tr>
                        <th className="p-1"></th>
                        {currentFrameData.matrixNodes.map((nodeId) => (
                          <th
                            key={nodeId}
                            className={`p-1 ${
                              currentFrameData.intermediate === nodeId
                                ? "text-amber-600 dark:text-amber-300"
                                : "text-primary"
                            }`}
                          >
                            {nodeLabelById[nodeId]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentFrameData.matrixNodes.map((rowId) => (
                        <tr key={rowId}>
                          <td className="p-1 font-bold text-primary">{nodeLabelById[rowId]}</td>
                          {currentFrameData.matrixNodes.map((colId) => {
                            const isFocus = currentFrameData.row === rowId && currentFrameData.col === colId;
                            const isUpdated =
                              currentFrameData.updatedCell?.row === rowId &&
                              currentFrameData.updatedCell?.col === colId;
                            const value = currentFrameData.matrix[rowId][colId];
                            return (
                              <td
                                key={colId}
                                className={`border border-surface-200 p-1 dark:border-surface-800 ${
                                  isUpdated
                                    ? "bg-success/20 text-success"
                                    : isFocus
                                      ? "bg-primary/10 text-primary"
                                      : ""
                                }`}
                              >
                                {value === Infinity ? "INF" : value}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-surface-500">Adjacency List</h4>
              <div className="max-h-64 overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-[11px] dark:bg-surface-950">
                {nodes.map(node => {
                  const neighbors = edges
                    .filter(e => e.from === node.id || (!e.directed && e.to === node.id))
                    .map(e => {
                      const neighbor = e.from === node.id ? e.to : e.from;
                      const label = nodeLabelById[neighbor] || neighbor;
                      return isWeighted ? `${label}(${e.weight})` : label;
                    });
                  return (
                    <div key={node.id} className="mb-1">
                      <span className="text-primary font-bold">{node.label}</span>: [{neighbors.join(", ")}]
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-surface-500">Adjacency Matrix</h4>
              <div className="overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-[11px] dark:bg-surface-950">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr>
                      <th className="p-1"></th>
                      {nodes.map(n => <th key={n.id} className="p-1 text-primary">{n.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map(row => (
                      <tr key={row.id}>
                        <td className="p-1 font-bold text-primary">{row.label}</td>
                        {nodes.map(col => {
                          const edge = edges.find(e => 
                            (e.from === row.id && e.to === col.id) || 
                            (!e.directed && ((e.from === row.id && e.to === col.id) || (e.from === col.id && e.to === row.id)))
                          );
                          return (
                            <td key={col.id} className="border border-surface-200 p-1 dark:border-surface-800">
                              {edge ? (isWeighted ? edge.weight : 1) : 0}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CustomInputPanel
            inputType="graph"
            onApply={handleCustomGraphInput}
            currentData={edges}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

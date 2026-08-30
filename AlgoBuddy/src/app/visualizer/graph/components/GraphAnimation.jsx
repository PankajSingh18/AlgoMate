"use client";
"use client";

import { bellmanFordFrames } from "@/app/visualizer/graph/utils/algorithms";
import { useMemo, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { VisualizerCanvas } from "@/app/visualizer/components/VisualizerCanvas";
import { aStarFrames } from "@/app/visualizer/graph/utils/algorithms";

const nodes = [
  { id: "A", x: 18, y: 32 },
  { id: "B", x: 42, y: 16 },
  { id: "C", x: 70, y: 28 },
  { id: "D", x: 28, y: 72 },
  { id: "E", x: 62, y: 70 },
];

const edges = [
  { from: "A", to: "B", weight: 2 },
  { from: "A", to: "D", weight: 6 },
  { from: "B", to: "C", weight: 3 },
  { from: "B", to: "D", weight: 8 },
  { from: "B", to: "E", weight: 5 },
  { from: "C", to: "E", weight: 7 },
  { from: "D", to: "E", weight: 4 },
];

const sequences = {
  matrix: ["A", "B", "D", "E"],
  list: ["A", "B", "C", "E"],
  bfs: ["A", "B", "D", "C", "E"],
  dfs: ["A", "B", "C", "E", "D"],
  dijkstra: ["A", "B", "C", "E", "D"],
  prim: ["A", "B", "C", "E", "D"],
  kruskal: ["A-B", "B-C", "D-E", "B-E"],
  topological: ["A", "B", "D", "C", "E"],
  "bellman-ford": ["A", "B", "C", "E", "D"],
};

// Algorithms that only make sense on directed graphs
const DIRECTED_ONLY = ["topological", "dijkstra", "bellman-ford"];
  "a-star": ["A", "B", "E"],
};

// Algorithms that only make sense on directed graphs
const DIRECTED_ONLY = ["topological", "dijkstra", "a-star"];

// Algorithms that only make sense on undirected graphs
const UNDIRECTED_ONLY = ["prim", "kruskal"];

// Algorithms that require weighted edges
const WEIGHTED_ONLY = ["dijkstra", "prim", "kruskal", "bellman-ford"];
const WEIGHTED_ONLY = ["dijkstra", "prim", "kruskal", "a-star"];

function getNode(id) {
  return nodes.find((node) => node.id === id);
}

function edgeId(edge) {
  return `${edge.from}-${edge.to}`;
}

function arrowEndpoint(x1, y1, x2, y2, r = 6) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: x2 - (dx / dist) * (r + 1.5),
    y: y2 - (dy / dist) * (r + 1.5),
  };
}

export default function GraphAnimation({ type = "bfs", title = "Graph" }) {
  const [step, setStep] = useState(0);
  const svgRef = useRef(null);

  // A* goal node selector
  const [goalNode, setGoalNode] = useState("E");
  const [startNodeAStar, setStartNodeAStar] = useState("A");

  // Directed toggle
  const canToggleDirected = !DIRECTED_ONLY.includes(type) && !UNDIRECTED_ONLY.includes(type);
  const forceDirected = DIRECTED_ONLY.includes(type);
  const [isDirected, setIsDirected] = useState(forceDirected);
  useVisualizerReset(() => {
    setStep(0);
  });

  // Weighted toggle — auto-lock ON for weight-dependent algorithms
  const forceWeighted = WEIGHTED_ONLY.includes(type);
  const canToggleWeighted = !WEIGHTED_ONLY.includes(type);
  const [isWeighted, setIsWeighted] = useState(forceWeighted);

  // A* frames computed from live start/goal selection
  const aStarData = useMemo(() => {
    if (type !== "a-star") return [];
    return aStarFrames(nodes, edges, startNodeAStar, goalNode);
  }, [type, startNodeAStar, goalNode]);

  const currentAStarFrame = type === "a-star"
    ? aStarData[Math.min(step, aStarData.length - 1)] || null
    : null;

  const sequence = sequences[type] || sequences.bfs;
  const aStarSequenceLength = aStarData.length || 1;
  const effectiveLength = type === "a-star" ? aStarSequenceLength : sequence.length;
  const current = type === "a-star"
    ? (currentAStarFrame?.current || startNodeAStar)
    : sequence[Math.min(step, sequence.length - 1)];

  const activeNodes = useMemo(() => {
    if (type === "kruskal") {
      return new Set(sequence.slice(0, step + 1).flatMap((item) => item.split("-")));
    }
    return new Set(sequence.slice(0, step + 1));
  }, [sequence, step, type]);

  const activeEdges = useMemo(() => {
    if (type === "kruskal") return new Set(sequence.slice(0, step + 1));
    const selected = new Set();
    const active = sequence.slice(0, step + 1);
    for (let i = 1; i < active.length; i += 1) {
      const prev = active[i - 1];
      const next = active[i];
      const direct = `${prev}-${next}`;
      const reverse = `${next}-${prev}`;
      const found = isDirected
        ? edges.find((edge) => edgeId(edge) === direct)
        : edges.find((edge) => edgeId(edge) === direct || edgeId(edge) === reverse);
      if (found) selected.add(edgeId(found));
    }
    return selected;
  }, [sequence, step, type, isDirected]);


  // Bellman-Ford: compute frames when type === "bellman-ford"
  const bellmanFrames = useMemo(() => {
    if (type !== "bellman-ford") return [];
    return bellmanFordFrames(nodes, edges, "A");
  }, [type]);

  const bellmanFrame = type === "bellman-ford"
    ? bellmanFrames[Math.min(step, bellmanFrames.length - 1)]
    : null;

  const totalSteps = type === "bellman-ford" ? bellmanFrames.length : sequence.length;
  const advance = () => setStep((value) => (value + 1) % totalSteps);
  const advance = () => setStep((value) => (value + 1) % effectiveLength);
  const reset = () => setStep(0);

  const handleToggleDirected = () => {
    setIsDirected((d) => !d);
    reset();
  };

  const handleToggleWeighted = () => {
    setIsWeighted((w) => !w);
    reset();
  };

  return (
    <div className="mx-auto my-10 max-w-4xl rounded-2xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Interactive graph view
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            {title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* A* — Start and Goal node selectors */}
          {type === "a-star" && (
            <>
              <div className="flex items-center gap-1">
                <label className="text-xs font-medium text-surface-600 dark:text-surface-400">Start:</label>
                <select
                  value={startNodeAStar}
                  onChange={(e) => { setStartNodeAStar(e.target.value); reset(); }}
                  className="rounded-lg border border-green-400 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  {nodes.filter((n) => n.id !== goalNode).map((n) => (
                    <option key={n.id} value={n.id}>{n.id}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <label className="text-xs font-medium text-surface-600 dark:text-surface-400">Goal:</label>
                <select
                  value={goalNode}
                  onChange={(e) => { setGoalNode(e.target.value); reset(); }}
                  className="rounded-lg border border-red-400 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400"
                >
                  {nodes.filter((n) => n.id !== startNodeAStar).map((n) => (
                    <option key={n.id} value={n.id}>{n.id}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          {/* Directed / Undirected toggle — hidden for prim/kruskal */}
          {!UNDIRECTED_ONLY.includes(type) && (
            <button
              type="button"
              onClick={canToggleDirected ? handleToggleDirected : undefined}
              title={
                forceDirected
                  ? "This algorithm requires a directed graph"
                  : "Toggle directed / undirected"
              }
              className={`btn-base border text-sm transition-colors ${
                isDirected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-surface-300 text-surface-600 hover:border-primary hover:text-primary dark:border-surface-700 dark:text-surface-300"
              } ${!canToggleDirected ? "cursor-default opacity-70" : ""}`}
            >
              {isDirected ? "Directed" : "Undirected"}
            </button>
          )}

          {/* Weighted / Unweighted toggle — locked ON for dijkstra/prim/kruskal */}
          <button
            type="button"
            onClick={canToggleWeighted ? handleToggleWeighted : undefined}
            title={
              forceWeighted
                ? "This algorithm requires a weighted graph"
                : "Toggle weighted / unweighted"
            }
            className={`btn-base border text-sm transition-colors ${
              isWeighted
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                : "border-surface-300 text-surface-600 hover:border-yellow-500 hover:text-yellow-600 dark:border-surface-700 dark:text-surface-300"
            } ${!canToggleWeighted ? "cursor-default opacity-70" : ""}`}
          >
            {isWeighted ? "Weighted" : "Unweighted"}
          </button>

          <button
            type="button"
            onClick={advance}
            className="btn-base bg-primary text-white hover:bg-primary-dark touch-manipulation min-h-[44px] min-w-[44px]"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Next step
          </button>
          <button
            type="button"
            onClick={reset}
            className="btn-base border border-surface-300 text-surface-800 hover:border-primary hover:text-primary dark:border-surface-700 dark:text-surface-200 touch-manipulation min-h-[44px] min-w-[44px]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <VisualizerCanvas
          onSwipeLeft={advance}
          onSwipeRight={() => setStep((s) => Math.max(0, s - 1))}
          watchKey={step}
        >
        <svg
          ref={svgRef}
          viewBox="0 0 100 90"
          role="img"
          aria-label={`${title} graph animation`}
          className="min-h-[280px] w-full rounded-xl bg-surface-50 dark:bg-surface-950"
          style={{ touchAction: "manipulation" }}
        >
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path
                d="M2 1L8 5L2 9"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
            <marker
              id="arrowhead-inactive"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path
                d="M2 1L8 5L2 9"
                fill="none"
                stroke="var(--color-neutral-300)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {edges.map((edge) => {
            const start = getNode(edge.from);
            const end = getNode(edge.to);
            const active = activeEdges.has(edgeId(edge));

            // A* active edge highlight (orange)
            const isAStarActive = type === "a-star" &&
              currentAStarFrame?.activeEdge?.from === edge.from &&
              currentAStarFrame?.activeEdge?.to === edge.to;

            // A* path edge highlight (purple)
            const aStarPath = currentAStarFrame?.path || [];
            const isAStarPath = type === "a-star" && aStarPath.length > 1 &&
              aStarPath.some((n, i) => i < aStarPath.length - 1 &&
                aStarPath[i] === edge.from && aStarPath[i + 1] === edge.to);

            const edgeColor = isAStarActive
              ? "#f97316"
              : isAStarPath
              ? "#a855f7"
              : active
              ? "var(--color-primary)"
              : "var(--color-neutral-300)";

            const { x: ex, y: ey } = isDirected
              ? arrowEndpoint(start.x, start.y, end.x, end.y)
              : { x: end.x, y: end.y };

            return (
              <g key={edgeId(edge)}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={ex}
                  y2={ey}
                  stroke={
                    type === "bellman-ford" && bellmanFrame?.activeEdge?.from === edge.from && bellmanFrame?.activeEdge?.to === edge.to
                      ? "orange"
                      : active
                        ? "var(--color-primary)"
                        : "var(--color-neutral-300)"
                  }
                  strokeWidth={active ? "1.8" : "1"}
                  stroke={edgeColor}
                  strokeWidth={isAStarActive || isAStarPath ? "2" : active ? "1.8" : "1"}
                  markerEnd={
                    isDirected
                      ? active || isAStarActive || isAStarPath
                        ? "url(#arrowhead)"
                        : "url(#arrowhead-inactive)"
                      : undefined
                  }
                />
                {/* Weight label — only shown in weighted mode */}
                {isWeighted && (
                  <text
                    x={(start.x + end.x) / 2}
                    y={(start.y + end.y) / 2 - 1}
                    textAnchor="middle"
                    className="fill-yellow-500 text-[4px] font-bold"
                    fontSize="4"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {nodes.map((node) => {
            const active = activeNodes.has(node.id);

            // A* node color logic
            const aStarPath = currentAStarFrame?.path || [];
            const isAStarStart = type === "a-star" && node.id === startNodeAStar;
            const isAStarGoal = type === "a-star" && node.id === goalNode;
            const isAStarPathNode = type === "a-star" && aStarPath.includes(node.id) && currentAStarFrame?.phase === "found";
            const isAStarOpen = type === "a-star" && currentAStarFrame?.openSet?.has(node.id);
            const isAStarVisited = type === "a-star" && currentAStarFrame?.visited?.has(node.id);

            let nodeFill = active ? "var(--color-primary)" : "white";
            let nodeStroke = active ? "var(--color-primary)" : "var(--color-neutral-300)";
            let textFill = active ? "white" : "var(--color-surface-800)";

            if (type === "a-star") {
              if (isAStarPathNode) {
                nodeFill = "#a855f7"; nodeStroke = "#a855f7"; textFill = "white";
              } else if (isAStarGoal) {
                nodeFill = "#ef4444"; nodeStroke = "#ef4444"; textFill = "white";
              } else if (isAStarStart) {
                nodeFill = "#22c55e"; nodeStroke = "#22c55e"; textFill = "white";
              } else if (isAStarOpen) {
                nodeFill = "#eab308"; nodeStroke = "#eab308"; textFill = "white";
              } else if (isAStarVisited) {
                nodeFill = "#3b82f6"; nodeStroke = "#3b82f6"; textFill = "white";
              } else {
                nodeFill = "white"; nodeStroke = "var(--color-neutral-300)"; textFill = "var(--color-surface-800)";
              }
            }

            // Advance to the step where this node is first visited on tap/click
            const nodeStep = type === "a-star" ? -1 : sequence.indexOf(node.id);
            const isReachable = nodeStep !== -1;
            const handleNodeActivate = isReachable
              ? () => setStep(nodeStep)
              : undefined;

            return (
              <g
                key={node.id}
                onClick={handleNodeActivate}
                onKeyDown={isReachable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNodeActivate(); } } : undefined}
                role={isReachable ? "button" : undefined}
                tabIndex={isReachable ? 0 : undefined}
                aria-label={isReachable ? `Jump to node ${node.id}` : undefined}
                style={{ cursor: isReachable ? "pointer" : "default" }}
              >
                {/* Enlarged invisible hit area for easy touch targeting (44x44 CSS px equivalent) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  fill="transparent"
                  stroke="none"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="6"
                  fill={active ? "var(--color-primary)" : "white"}
                  stroke={
                    type === "bellman-ford" && bellmanFrame?.activeEdge?.from === edge.from && bellmanFrame?.activeEdge?.to === edge.to
                      ? "orange"
                      : active
                        ? "var(--color-primary)"
                        : "var(--color-neutral-300)"
                  }
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth="1.5"
                />
                <text
                  x={node.x}
                  y={node.y + 1.5}
                  textAnchor="middle"
                  style={{ pointerEvents: "none", fill: textFill, fontSize: "5px", fontWeight: "bold" }}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
        </VisualizerCanvas>

        {/* A* Score Table + Banners */}
        {type === "a-star" && currentAStarFrame && (
          <div className="mt-3 space-y-3">
            {/* Color legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>Start</span>
              <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-red-500"></span>Goal</span>
              <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-yellow-400"></span>Frontier</span>
              <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>Visited</span>
              <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-purple-500"></span>Path</span>
              <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-orange-400"></span>Active Edge</span>
            </div>

            {/* Score table */}
            <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950">
                    <th className="px-3 py-2 text-left font-semibold text-surface-700 dark:text-surface-300">Node</th>
                    <th className="px-3 py-2 text-center font-semibold text-surface-700 dark:text-surface-300">g (cost)</th>
                    <th className="px-3 py-2 text-center font-semibold text-surface-700 dark:text-surface-300">h (heuristic)</th>
                    <th className="px-3 py-2 text-center font-semibold text-surface-700 dark:text-surface-300">f = g + h</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((n) => {
                    const g = currentAStarFrame.gScore?.[n.id];
                    const f = currentAStarFrame.fScore?.[n.id];
                    const h = g !== undefined && f !== undefined && g !== Infinity && f !== Infinity
                      ? f - g
                      : null;
                    const isActive = currentAStarFrame.current === n.id;
                    return (
                      <tr key={n.id} className={`border-b border-surface-100 dark:border-surface-800 ${isActive ? "bg-primary/5" : ""}`}>
                        <td className={`px-3 py-2 font-semibold ${isActive ? "text-primary" : "text-surface-800 dark:text-surface-200"}`}>{n.id}</td>
                        <td className="px-3 py-2 text-center text-surface-600 dark:text-surface-400">
                          {g === Infinity || g === undefined ? "∞" : g.toFixed(1)}
                        </td>
                        <td className="px-3 py-2 text-center text-surface-600 dark:text-surface-400">
                          {h === null ? "∞" : h.toFixed(1)}
                        </td>
                        <td className="px-3 py-2 text-center text-surface-600 dark:text-surface-400">
                          {f === Infinity || f === undefined ? "∞" : f.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Phase banners */}
            {currentAStarFrame.phase === "found" && (
              <div className="rounded-xl border border-green-400 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                ✅ Path Found: {(currentAStarFrame.path || []).join(" → ")} (cost: {currentAStarFrame.gScore?.[goalNode]?.toFixed(1)})
              </div>
            )}
            {currentAStarFrame.phase === "no_path" && (
              <div className="rounded-xl border border-red-400 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400">
                ❌ No path exists from {startNodeAStar} to {goalNode}
              </div>
            )}

            {/* Step description */}
            <p className="text-xs text-surface-500 dark:text-surface-400">{currentAStarFrame.description}</p>
          </div>
        )}

        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-800 dark:bg-surface-950">
          <p className="mb-3 text-sm font-semibold text-surface-700 dark:text-surface-300">
            Step {step + 1} of {totalSteps}
            Step {step + 1} of {effectiveLength}
          </p>
          <div className="space-y-2">
            {type === "a-star" ? (
              aStarData.map((frame, index) => (
                <div
                  key={index}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    index === step
                      ? "border-primary bg-primary/10 text-primary"
                      : index < step
                        ? "border-success/40 bg-success/10 text-surface-700 dark:text-surface-200"
                        : "border-surface-200 bg-white text-surface-500 dark:border-surface-800 dark:bg-surface-900"
                  }`}
                >
                  {frame.current ? `Expand ${frame.current}` : frame.phase === "found" ? "Path found!" : "No path"}
                </div>
              ))
            ) : (
              sequence.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    index === step
                      ? "border-primary bg-primary/10 text-primary"
                      : index < step
                        ? "border-success/40 bg-success/10 text-surface-700 dark:text-surface-200"
                        : "border-surface-200 bg-white text-surface-500 dark:border-surface-800 dark:bg-surface-900"
                  }`}
                >
                  {type === "kruskal" ? `Choose edge ${item}` : `Visit vertex ${item}`}
                </div>
              ))
            )}
          </div>

          {/* Mode info badges */}
          <div className="mt-4 flex flex-col gap-2">
            {isDirected && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
                Directed mode — edges have one-way direction
              </div>
            )}
            {isWeighted && (
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-600 dark:text-yellow-400">
                Weighted mode — edge costs are shown
              </div>
            )}
          </div>


          {/* Bellman-Ford: Distance Table */}
          {type === "bellman-ford" && bellmanFrame && (
            <div className="mt-4">
              {/* Negative Cycle Banner */}
              {bellmanFrame.negativeCycle && (
                <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400">
                  ⚠️ Negative Cycle Detected!
                </div>
              )}
              <p className="mb-2 text-sm font-semibold text-surface-700 dark:text-surface-300">
                Distance Table
              </p>
              <div className="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-100 dark:bg-surface-800">
                      <th className="px-3 py-2 text-left font-semibold text-surface-700 dark:text-surface-300">Node</th>
                      <th className="px-3 py-2 text-left font-semibold text-surface-700 dark:text-surface-300">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(bellmanFrame.distances).map(([node, dist]) => (
                      <tr
                        key={node}
                        className={`border-t border-surface-200 dark:border-surface-800 ${
                          bellmanFrame.updatedNode === node
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                            : bellmanFrame.visitingNodes?.has(node)
                              ? "bg-primary/10 text-primary"
                              : ""
                        }`}
                      >
                        <td className="px-3 py-1.5 font-medium">{node}</td>
                        <td className="px-3 py-1.5">
                          {dist === Infinity ? "∞" : dist}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-surface-500 dark:text-surface-400 italic">
                {bellmanFrame.description}
              </p>
            </div>
          )}

          <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">
            Current focus:{" "}
            <span className="font-semibold text-surface-800 dark:text-white">
              {current}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

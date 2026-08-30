"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
  Plus,
  Search
} from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { BTreeManager, T, cloneTree } from "@/features/algorithms/tree/bTreeLogic";

// Logic moved to src/features/algorithms/tree/bTreeLogic.js

// Layout: compute (x, y) positions for rendering
function layoutTree(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];
  const NODE_W = 100;
  const HGAP = 20;
  const VERT_GAP = 100;

  const computeWidth = (node) => {
    if (node.isLeaf || node.children.length === 0) {
      return Math.max(NODE_W, node.keys.length * 28 + 16);
    }
    return node.children.reduce((sum, c) => sum + computeWidth(c) + HGAP, 0) - HGAP;
  };

  const dfs = (node, depth, xStart) => {
    const totalW = computeWidth(node);
    const nodeW = Math.max(NODE_W, node.keys.length * 28 + 16);
    const x = xStart + totalW / 2 - nodeW / 2;
    const y = 50 + depth * VERT_GAP;

    nodes.push({ id: node.id, keys: node.keys, isLeaf: node.isLeaf, x, y, w: nodeW });

    if (!node.isLeaf && node.children.length > 0) {
      let childX = xStart;
      node.children.forEach(child => {
        const cW = computeWidth(child);
        const childNodeW = Math.max(NODE_W, child.keys.length * 28 + 16);
        const childXCenter = childX + cW / 2 - childNodeW / 2;
        const childY = 50 + (depth + 1) * VERT_GAP;
        edges.push({ x1: x + nodeW / 2, y1: y + 24, x2: childXCenter + childNodeW / 2, y2: childY - 8, childId: child.id });
        dfs(child, depth + 1, childX);
        childX += cW + HGAP;
      });
    }
  };

  dfs(root, 0, 40);
  return { nodes, edges };
}

const INITIAL_KEYS = [10, 20, 5, 6, 12, 30, 7, 17];

export default function BTreeAnimation() {
  const managerRef = useRef(null);
  const [displayRoot, setDisplayRoot] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [mode, setMode] = useState("insert");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);
  const [message, setMessage] = useState(`B-Tree pre-loaded (order ${2 * T}, max ${2 * T - 1} keys/node)! Insert or Search keys.`);
  const [highlighted, setHighlighted] = useState({});

  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAnimating(false);
    setMessage("...");
    setSteps([]);
    setCurrentStepIdx(-1);
  });

  // Initialize tree
  useEffect(() => {
    const mgr = new BTreeManager();
    for (const key of INITIAL_KEYS) {
      const gen = mgr.insertGenerator(key);
      for (const step of gen) {} // exhaust generator
    }
    managerRef.current = mgr;
    setDisplayRoot(cloneTree(mgr.root));
  }, []);



  useEffect(() => {
    if (currentStepIdx < 0 || currentStepIdx >= steps.length) return;
    const step = steps[currentStepIdx];
    setDisplayRoot(step.tree);
    setHighlighted(step.highlighted || {});
    setMessage(step.explanation || "");
  }, [currentStepIdx, steps]);

  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;
    if (currentStepIdx >= steps.length - 1) { setIsAnimating(false); return; }
    timerRef.current = setTimeout(() => setCurrentStepIdx(p => p + 1), 1600 / speed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAnimating, currentStepIdx, steps, speed]);

  const pauseVisualizer = () => { setIsAnimating(false); if (timerRef.current) clearTimeout(timerRef.current); };
  const startVisualizer = () => {
    if (steps.length === 0) return;
    setIsAnimating(true);
    const nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };
  const stepForward = () => { setIsAnimating(false); if (currentStepIdx < steps.length - 1) setCurrentStepIdx(p => p + 1); };
  const stepBackward = () => { setIsAnimating(false); if (currentStepIdx > 0) setCurrentStepIdx(p => p - 1); };
  const resetPlayback = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setHighlighted({});
    setDisplayRoot(managerRef.current ? cloneTree(managerRef.current.root) : null);
    setMessage("Playback reset.");
  };

  const handleReset = () => {
    setIsAnimating(false);
    const mgr = new BTreeManager();
    for (const key of INITIAL_KEYS) {
      const gen = mgr.insertGenerator(key);
      for (const step of gen) {} // exhaust generator
    }
    managerRef.current = mgr;
    setDisplayRoot(cloneTree(mgr.root));
    setSteps([]);
    setCurrentStepIdx(-1);
    setHighlighted({});
    setInputValue(""); setSearchValue("");
    setMessage(`Tree reset to default (order ${2 * T}). Insert or search keys.`);
  };

  const triggerInsert = () => {
    const key = parseInt(inputValue);
    if (isNaN(key) || key < 1 || key > 999) { setMessage("⚠️ Enter a valid key (1-999)."); return; }
    setIsAnimating(false);
    setInputValue("");
    
    const gen = managerRef.current.insertGenerator(key);
    const newSteps = Array.from(gen);
    
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  const triggerSearch = () => {
    const key = parseInt(searchValue);
    if (isNaN(key) || key < 1 || key > 999) { setMessage("⚠️ Enter a valid key to search (1-999)."); return; }
    setIsAnimating(false);
    setSearchValue("");
    
    const gen = managerRef.current.searchGenerator(key);
    const newSteps = Array.from(gen);
    
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  useVisualizerKeyboard({
    onStepForward: stepForward,
    onStepBackward: stepBackward,
    onTogglePlay: isAnimating ? pauseVisualizer : startVisualizer,
    onReset: resetPlayback,
    onSpeedChange: setSpeed,
    speed: speed,
    sorting: isAnimating,
    sorted: false,
    enabled: true,
  });

  // Layout
  const { nodes, edges } = layoutTree(displayRoot);
  const svgWidth = nodes.length > 0 ? Math.max(800, Math.max(...nodes.map(n => n.x + n.w)) + 60) : 800;
  const svgHeight = nodes.length > 0 ? Math.max(380, Math.max(...nodes.map(n => n.y)) + 80) : 380;

  const getNodeStyle = (nodeId) => {
    const state = highlighted[nodeId];
    if (state === "visiting") return { fill: "#a435f0", stroke: "#d38cff" };
    if (state === "active")   return { fill: "#10b981", stroke: "#34d399" };
    if (state === "matched")  return { fill: "#f59e0b", stroke: "#fbbf24" };
    if (state === "error")    return { fill: "#ef4444", stroke: "#f87171" };
    return { fill: "var(--background)", stroke: "#64748b" };
  };

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-xl w-fit dark:bg-gray-800">
          {[["insert", "Insert"], ["search", "Search"]].map(([val, label]) => (
            <button key={val} onClick={() => { setMode(val); resetPlayback(); }}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === val ? "bg-[#a435f0] text-white shadow-md" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col sm:flex-row gap-2">
            {mode === "insert" ? (
              <>
                <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Key (1-999)"
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700"
                  disabled={isAnimating} onKeyDown={e => e.key === "Enter" && triggerInsert()} />
                <button onClick={triggerInsert} disabled={isAnimating}
                  className="flex items-center gap-1.5 px-4 py-2 text-white bg-[#a435f0] rounded-lg transition-colors hover:bg-[#8f2cd6] disabled:opacity-50 h-[42px]">
                  <Plus className="w-4 h-4" /> Insert
                </button>
              </>
            ) : (
              <>
                <input type="number" value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Key to search"
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700"
                  disabled={isAnimating} onKeyDown={e => e.key === "Enter" && triggerSearch()} />
                <button onClick={triggerSearch} disabled={isAnimating}
                  className="flex items-center gap-1.5 px-4 py-2 text-white bg-[#a435f0] rounded-lg transition-colors hover:bg-[#8f2cd6] disabled:opacity-50 h-[42px]">
                  <Search className="w-4 h-4" /> Search
                </button>
              </>
            )}
          </div>
          
          <div className="flex justify-end gap-2 items-start">
            <button onClick={handleReset} className="flex items-center gap-1.5 rounded-lg border border-red-500 text-red-500 px-4 py-2 transition-colors hover:bg-red-500 hover:text-white h-[42px]">
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        <div className="mt-6">
          <PlaybackControls 
            isPlaying={isAnimating}
            onPlayPause={isAnimating ? pauseVisualizer : startVisualizer}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={resetPlayback}
            speed={speed}
            onSpeedChange={setSpeed}
            disabled={steps.length === 0}
            showPlayPause={true}
          />
        </div>
      </VisualizerCard>

      <VisualizerCard
        className={
          message.includes("✅") || message.includes("successfully")
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : message.includes("not found") || message.includes("error") || message.includes("⚠️")
              ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              : isAnimating
                ? "border-[#a435f0]/30 bg-[#a435f0]/10 dark:border-[#a435f0]/50 dark:bg-[#a435f0]/20"
                : ""
        }
      >
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>Operation Explanation</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono">Order {2*T} B-Tree (max {2*T-1} keys/node)</span>
            <span className="font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
            </span>
          </div>
        </div>
        <p className="font-medium text-lg min-h-[28px]">{message}</p>
      </VisualizerCard>

      <VisualizerCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">B-Tree Visualization</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { color: "bg-[#a435f0]", label: "Visiting" },
              { color: "bg-emerald-500", label: "Split / Active" },
              { color: "bg-amber-500", label: "Found" },
              { color: "bg-red-500", label: "Not Found" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-auto flex justify-center py-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 relative min-h-[380px]">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="max-w-full h-auto">
            {/* Edges */}
            {edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={highlighted[e.childId] ? "#a435f0" : "currentColor"} strokeWidth={highlighted[e.childId] ? "2.5" : "1.5"}
                className={`transition-all duration-300 ${highlighted[e.childId] ? '' : 'stroke-gray-300 dark:stroke-gray-600'}`} />
            ))}

            {/* Nodes */}
            {nodes.map(node => {
              const style = getNodeStyle(node.id);
              const keyW = node.w / Math.max(node.keys.length, 1);
              
              let fillStyle = style.fill;
              if (fillStyle === "var(--background)") {
                fillStyle = "currentColor";
              }
              
              return (
                <g key={node.id} className="transition-all duration-300">
                  {/* Glow */}
                  {highlighted[node.id] && <rect x={node.x - 4} y={node.y - 12} width={node.w + 8} height={36} rx="10" fill="none" stroke={style.stroke} strokeWidth="1.5" strokeDasharray="4,2" className="opacity-80 animate-pulse" />}

                  {/* Node background */}
                  <rect x={node.x} y={node.y - 8} width={node.w} height={28} rx="6" fill={fillStyle} stroke={style.stroke} strokeWidth="1.5" 
                    className={`transition-all duration-300 ${style.fill === 'var(--background)' ? 'fill-white dark:fill-gray-900' : ''}`} />

                  {/* Key dividers + text */}
                  {node.keys.map((key, ki) => (
                    <g key={ki}>
                      {ki > 0 && <line x1={node.x + ki * keyW} y1={node.y - 8} x2={node.x + ki * keyW} y2={node.y + 20} stroke={style.stroke} strokeWidth="1" className="opacity-50" />}
                      <text 
                        x={node.x + ki * keyW + keyW / 2} y={node.y + 7} 
                        textAnchor="middle" 
                        fill={style.fill === 'var(--background)' ? 'currentColor' : '#ffffff'} 
                        fontSize="11" 
                        fontWeight="bold"
                        className={style.fill === 'var(--background)' ? 'fill-gray-900 dark:fill-gray-100' : ''}
                      >
                        {key}
                      </text>
                    </g>
                  ))}

                  {/* Empty node */}
                  {node.keys.length === 0 && <text x={node.x + node.w / 2} y={node.y + 7} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(empty)</text>}
                </g>
              );
            })}

            {/* Empty state */}
            {nodes.length === 0 && <text x="400" y="180" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="14">Insert keys to build the B-Tree</text>}
          </svg>
          
          {/* B-Tree properties */}
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs space-y-0.5 max-w-xs shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 font-bold mb-1">B-Tree Properties (t={T}):</p>
            <p className="text-gray-500 dark:text-gray-400">Min keys: {T - 1} (root: 1)</p>
            <p className="text-gray-500 dark:text-gray-400">Max keys: {2 * T - 1}</p>
            <p className="text-gray-500 dark:text-gray-400">All leaves at same level</p>
          </div>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

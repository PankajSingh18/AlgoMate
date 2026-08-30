"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Info,
  RefreshCw,
  Plus
} from "lucide-react";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { RBTree, RBNode, RED, BLACK } from "@/features/algorithms/tree/redBlackTreeLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

// Compute tree layout (x, y coordinates for each node)
function computeLayout(tree) {
  const nodes = [];
  const edges = [];
  let leafIndex = 0;

  const dfs = (node, depth) => {
    if (!node || node.id === "NIL") return;
    node._depth = depth;
    const leftChild = node.left?.id !== "NIL" ? node.left : null;
    const rightChild = node.right?.id !== "NIL" ? node.right : null;

    if (!leftChild && !rightChild) {
      node._x = 60 + leafIndex * 80;
      leafIndex++;
    } else {
      if (leftChild) dfs(leftChild, depth + 1);
      if (rightChild) dfs(rightChild, depth + 1);
      const childXs = [];
      if (leftChild) childXs.push(leftChild._x);
      if (rightChild) childXs.push(rightChild._x);
      node._x = childXs.reduce((a, b) => a + b, 0) / childXs.length;
    }
    node._y = 60 + depth * 90;

    nodes.push({ id: node.id, value: node.value, color: node.color, x: node._x, y: node._y });

    if (leftChild) edges.push({ x1: node._x, y1: node._y + 20, x2: leftChild._x, y2: leftChild._y - 20, childId: leftChild.id });
    if (rightChild) edges.push({ x1: node._x, y1: node._y + 20, x2: rightChild._x, y2: rightChild._y - 20, childId: rightChild.id });
  };

  if (tree.root?.id !== "NIL") dfs(tree.root, 0);
  return { nodes, edges };
}

const INITIAL_VALUES = [30, 15, 70, 10, 20, 60, 85];

export default function RedBlackAnimation() {
  const [displayTree, setDisplayTree] = useState(() => {
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    return t;
  });
  const [inputValue, setInputValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("Red-Black Tree pre-loaded! Insert values to observe rotations and recoloring.");
  
  const [visualState, setVisualState] = useState(null);

  const activeTreeRef = useRef(() => {
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    return t;
  });

  useEffect(() => {
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    activeTreeRef.current = t;
  }, []);

  const onStep = useCallback((step, idx) => {
    if (idx === -1) {
      setVisualState(null);
      return;
    }
    setVisualState(step);
    if (step.tree) setDisplayTree(step.tree);
    setMessage(step.explanation || "");
  }, []);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 1 });

  useVisualizerReset(() => {
    engine.reset();
    setMessage("...");
    setSteps([]);
    setVisualState(null);
  });

  const handleReset = () => {
    engine.reset();
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    activeTreeRef.current = t;
    setDisplayTree(t.clone());
    setSteps([]);
    setVisualState(null);
    setInputValue("");
    setMessage("Tree reset to default. Insert values to observe RB tree balancing.");
  };

  const triggerInsert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || val < 1 || val > 999) {
      setMessage("⚠️ Please enter a valid integer (1-999).");
      return;
    }
    setInputValue("");

    engine.reset();
    const gen = activeTreeRef.current.insertGenerator(val);
    const newSteps = Array.from(gen);
    
    setSteps(newSteps);
    if (newSteps.length > 0) {
      setVisualState(newSteps[0]);
      setTimeout(() => {
        engine.play();
      }, 50);
    }
  };

  useVisualizerKeyboard({
    onStepForward: engine.stepForward,
    onStepBackward: engine.stepBackward,
    onTogglePlayPause: engine.isPlaying ? engine.pause : (steps.length > 0 ? engine.play : undefined),
    onReset: engine.reset,
    onSpeedChange: (s) => engine.setSpeed(s * 500),
    speed: engine.speed / 500,
    sorting: engine.isPlaying,
    sorted: engine.currentStep >= steps.length - 1 && steps.length > 0,
    enabled: true,
  });

  const { nodes, edges } = computeLayout(displayTree);
  const svgWidth = Math.max(800, nodes.length > 0 ? Math.max(...nodes.map(n => n.x)) + 100 : 800);
  const svgHeight = Math.max(380, nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) + 60 : 380);

  const highlighted = visualState?.highlighted || {};

  const getNodeStyle = (nodeId, color) => {
    const state = highlighted[nodeId];
    if (state === "visiting") return { fill: "#8b5cf6", stroke: "#c084fc", glow: true };
    if (state === "active")   return { fill: "#10b981", stroke: "#34d399", glow: true };
    if (state === "matched")  return { fill: "#f59e0b", stroke: "#fbbf24", glow: true };
    if (color === "RED")      return { fill: "#dc2626", stroke: "#ef4444", glow: false };
    return { fill: "#0f172a", stroke: "#475569", glow: false }; // BLACK node
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-7xl mx-auto selection:bg-purple-500/30 selection:text-purple-200">

      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col xl:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-center">
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Value (1-999)"
            className="w-full sm:w-36 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#a435f0] transition-colors"
            disabled={engine.isPlaying}
            onKeyDown={e => e.key === "Enter" && triggerInsert()}
          />
          <button onClick={triggerInsert} disabled={engine.isPlaying}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#a435f0] hover:bg-[#8f2cd6] text-white rounded-xl transition-all shadow-md w-full sm:w-auto">
            <Plus className="w-3.5 h-3.5" /> Insert
          </button>
        </div>

        <div className="w-full xl:w-auto flex justify-center xl:justify-end">
          <PlaybackControls 
            isPlaying={engine.isPlaying}
            onPlayPause={engine.isPlaying ? engine.pause : engine.play}
            onStepForward={engine.stepForward}
            onStepBackward={engine.stepBackward}
            onReset={engine.reset}
            onClear={handleReset}
            clearLabel="Clear Tree"
            speed={engine.speed / 500}
            onSpeedChange={(s) => engine.setSpeed(s * 500)}
            disabled={steps.length === 0}
            showPlayPause={true}
          />
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-red-400" /> Insertion Step Explanation</span>
          <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900">Step {engine.currentStep !== -1 ? engine.currentStep + 1 : 0} / {steps.length || 0}</span>
        </div>
        <div className="text-sm font-medium text-red-200/90 leading-relaxed min-h-[40px] flex items-center">{message}</div>
      </div>

      {/* Legend + SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[380px] flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { bg: "bg-red-600 border border-red-400", label: "RED node" },
            { bg: "bg-slate-900 border border-slate-500", label: "BLACK node" },
            { bg: "bg-purple-600", label: "Visiting / Being Fixed" },
            { bg: "bg-emerald-600", label: "Rotated / Active" },
            { bg: "bg-amber-500", label: "Fixed / Root" },
          ].map(({ bg, label }) => (
            <div key={label} className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className={`w-3 h-3 rounded-full ${bg}`} />
              <span className="text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="overflow-auto flex justify-center">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="max-w-full h-auto">
            {edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={highlighted[e.childId] ? "#8b5cf6" : "#334155"} strokeWidth={highlighted[e.childId] ? "2.5" : "2"}
                className="transition-all duration-300" />
            ))}
            {nodes.map(node => {
              const style = getNodeStyle(node.id, node.color);
              return (
                <g key={node.id} className="transition-all duration-300">
                  {style.glow && <circle cx={node.x} cy={node.y} r="28" fill="none" stroke={style.stroke} strokeWidth="1.5" strokeDasharray="4,2" className="opacity-60 animate-pulse" />}
                  <circle cx={node.x} cy={node.y} r="20" fill={style.fill} stroke={style.stroke} strokeWidth="2.5" className="transition-all duration-300 shadow-xl" />
                  <text x={node.x} y={node.y + 4.5} textAnchor="middle" className="fill-white dark:fill-slate-800" fontSize="11" fontWeight="bold">{node.value}</text>
                  <text x={node.x} y={node.y - 26} textAnchor="middle" fill={node.color === "RED" ? "#f87171" : "#64748b"} fontSize="7.5" fontWeight="bold">{node.color}</text>
                </g>
              );
            })}
            {nodes.length === 0 && (
              <text x="400" y="180" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400" fontSize="14">Insert a value to start the Red-Black Tree visualization</text>
            )}
          </svg>
        </div>

        {/* RB Properties Reminder */}
        <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs space-y-0.5 max-w-xs">
          <p className="text-slate-400 font-bold mb-1">RB Tree Rules:</p>
          <p className="text-slate-500">1. Root is always BLACK</p>
          <p className="text-slate-500">2. RED node has BLACK children</p>
          <p className="text-slate-500">3. All paths: equal BLACK height</p>
        </div>
      </div>
    </div>
  );
}

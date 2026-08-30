"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Compass,
  Link2,
  HelpCircle,
  TrendingUp,
  GitBranch,
  Layers,
  Settings
} from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { findGenerator, unionGenerator } from "@/features/algorithms/tree/dsuLogic";

export default function DsuAnimation() {
  const [numElements, setNumElements] = useState(8);
  const [parentArray, setParentArray] = useState([]);
  const [rankArray, setRankArray] = useState([]);
  const [sizeArray, setSizeArray] = useState([]);
  
  // Custom Controls State
  const [findVal, setFindVal] = useState("");
  const [unionValX, setUnionValX] = useState("");
  const [unionValY, setUnionValY] = useState("");
  
  // Optimizations
  const [pathCompression, setPathCompression] = useState(true);
  const [unionByRank, setUnionByRank] = useState(true);
  
  // Visualizer Status & Steps
  const [message, setMessage] = useState("Disjoint Set Union (Union-Find) Visualizer. Adjust toggles or enter an operation!");
  const [isAnimating, setIsAnimating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const { speed, setSpeed } = usePlayback(1);

  const timerRef = useRef(null);

  // Initialize nodes
  useEffect(() => {
    resetDsu(numElements);
  }, [numElements]);

  const resetDsu = (size) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const initialParent = Array.from({ length: size }, (_, i) => i);
    const initialRank = new Array(size).fill(0);
    const initialSize = new Array(size).fill(1);
    
    setParentArray(initialParent);
    setRankArray(initialRank);
    setSizeArray(initialSize);
    
    setSteps([]);
    setCurrentStepIdx(-1);
    setIsAnimating(false);
    setMessage(`DSU initialized with ${size} elements. Every node starts as its own representative root.`);
  };

  useVisualizerReset(() => {
    resetDsu(numElements);
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Compute Tree Layout (Parent pointing up to root)
  const computeTreeLayout = () => {
    // 1. Build adjacency list of children
    const childrenMap = {};
    for (let i = 0; i < numElements; i++) {
      childrenMap[i] = [];
    }
    
    const roots = [];
    for (let i = 0; i < numElements; i++) {
      const p = parentArray[i];
      if (p === i) {
        roots.push(i);
      } else {
        if (!childrenMap[p]) {
          childrenMap[p] = [];
        }
        childrenMap[p].push(i);
      }
    }
    
    // Sort roots for consistent rendering
    roots.sort((a, b) => a - b);
    
    const nodesMap = {};
    const edgesList = [];
    
    // Calculate widths recursively to avoid overlap
    const subtreeWidths = {};
    const getSubtreeWidth = (node) => {
      const children = childrenMap[node] || [];
      if (children.length === 0) {
        subtreeWidths[node] = 70; // min width per leaf
        return 70;
      }
      const sum = children.reduce((acc, c) => acc + getSubtreeWidth(c), 0);
      subtreeWidths[node] = Math.max(70, sum);
      return subtreeWidths[node];
    };
    
    roots.forEach(r => getSubtreeWidth(r));
    
    // Layout DFS
    let currentXOffset = 40;
    const layoutDFS = (node, level = 0, startX = 0) => {
      const width = subtreeWidths[node];
      const children = childrenMap[node] || [];
      
      const y = 80 + level * 80;
      let x = startX + width / 2;
      
      if (children.length > 0) {
        let childOffset = startX;
        children.forEach(c => {
          layoutDFS(c, level + 1, childOffset);
          childOffset += subtreeWidths[c];
        });
        
        // Center parent node exactly above its children
        const firstChildX = nodesMap[children[0]].x;
        const lastChildX = nodesMap[children[children.length - 1]].x;
        x = (firstChildX + lastChildX) / 2;
      }
      
      nodesMap[node] = { id: node, x, y };
    };
    
    roots.forEach(r => {
      layoutDFS(r, 0, currentXOffset);
      currentXOffset += subtreeWidths[r] + 30; // buffer between trees
    });
    
    // Generate Edges: pointer points upwards from child to parent
    for (let i = 0; i < numElements; i++) {
      const p = parentArray[i];
      if (p !== i && nodesMap[i] && nodesMap[p]) {
        edgesList.push({
          from: i,
          to: p,
          x1: nodesMap[i].x,
          y1: nodesMap[i].y - 18,
          x2: nodesMap[p].x,
          y2: nodesMap[p].y + 18,
        });
      }
    }
    
    const nodesList = Object.keys(nodesMap).map(k => ({
      id: Number(k),
      x: nodesMap[k].x,
      y: nodesMap[k].y,
      parent: parentArray[Number(k)],
      rank: rankArray[Number(k)],
      size: sizeArray[Number(k)]
    }));
    
    return { nodesList, edgesList, totalWidth: Math.max(800, currentXOffset + 20) };
  };

  const { nodesList: layoutNodes, edgesList: layoutEdges, totalWidth: canvasWidth } = computeTreeLayout();

  // Playback Step loop
  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;

    if (currentStepIdx >= steps.length) {
      setIsAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIdx];
    setMessage(currentStep.explanation);
    
    if (currentStep.parent) setParentArray(currentStep.parent);
    if (currentStep.rank) setRankArray(currentStep.rank);
    if (currentStep.size) setSizeArray(currentStep.size);

    timerRef.current = setTimeout(() => {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setIsAnimating(false);
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnimating, currentStepIdx, steps, speed]);

  const startVisualizer = () => {
    if (steps.length === 0) return;
    setIsAnimating(true);
    let nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };

  const pauseVisualizer = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const stepForward = () => {
    setIsAnimating(false);
    if (currentStepIdx < steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      const step = steps[nextIdx];
      setMessage(step.explanation);
      if (step.parent) setParentArray(step.parent);
      if (step.rank) setRankArray(step.rank);
      if (step.size) setSizeArray(step.size);
    }
  };

  const stepBackward = () => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      const step = steps[prevIdx];
      setMessage(step.explanation);
      if (step.parent) setParentArray(step.parent);
      if (step.rank) setRankArray(step.rank);
      if (step.size) setSizeArray(step.size);
    }
  };

  const resetPlayback = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    if (steps.length > 0 && steps[0].parentBefore) {
      setParentArray(steps[0].parentBefore);
      setRankArray(steps[0].rankBefore);
      setSizeArray(steps[0].sizeBefore);
    }
    setMessage("Playback reset. Click play to watch step-by-step.");
  };

  // Find Animation Generator
  const runFindAnimation = (targetId) => {
    if (targetId < 0 || targetId >= numElements) {
      setMessage(`⚠️ Node ${targetId} is out of bounds. Element must be 0 to ${numElements - 1}.`);
      return;
    }

    pauseVisualizer();
    
    const gen = findGenerator(targetId, numElements, parentArray, rankArray, sizeArray, pathCompression);
    const newSteps = Array.from(gen);

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // Union Animation Generator
  const runUnionAnimation = (x, y) => {
    if (x < 0 || x >= numElements || y < 0 || y >= numElements) {
      setMessage("⚠️ Out of bounds. Elements must be between 0 and " + (numElements - 1));
      return;
    }

    pauseVisualizer();
    
    const gen = unionGenerator(x, y, numElements, parentArray, rankArray, sizeArray, unionByRank);
    const newSteps = Array.from(gen);

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  const handleMakeSet = () => {
    resetDsu(numElements);
  };

  const currentStep = steps[currentStepIdx] || null;

  return (
    <VisualizerInteractiveLayout>
      {/* 1. Deck Controls */}
      <VisualizerCard>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          
          {/* Operations panel */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Settings className="w-4.5 h-4.5 text-[#a435f0]" /> Operations
            </h3>
            
            {/* Initializer */}
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col">
                <label className="text-[10px] text-gray-500 mb-1">Set Size N (2-12)</label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={numElements}
                  onChange={(e) => setNumElements(Math.min(12, Math.max(2, parseInt(e.target.value) || 2)))}
                  className="rounded-lg border p-2 text-sm dark:bg-gray-700 w-full"
                  disabled={isAnimating}
                />
              </div>
              <button
                onClick={handleMakeSet}
                disabled={isAnimating}
                className="flex items-end justify-center rounded-lg bg-[#a435f0] text-white px-4 py-2 hover:bg-[#8f2cd6] transition-colors font-medium text-sm h-[40px] mt-auto"
              >
                MakeSet(N)
              </button>
            </div>

            {/* Find input */}
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max={numElements - 1}
                value={findVal}
                onChange={(e) => setFindVal(e.target.value)}
                placeholder={`Node (0-${numElements - 1})`}
                className="flex-1 rounded-lg border p-2 text-sm dark:bg-gray-700"
                disabled={isAnimating}
              />
              <button
                onClick={() => runFindAnimation(parseInt(findVal))}
                disabled={isAnimating || findVal === ""}
                className="flex items-center gap-1 border border-[#a435f0] text-[#a435f0] hover:bg-[#a435f0] hover:text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                <Compass className="w-4 h-4" /> Find
              </button>
            </div>

            {/* Union input */}
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max={numElements - 1}
                value={unionValX}
                onChange={(e) => setUnionValX(e.target.value)}
                placeholder="Node X"
                className="flex-1 rounded-lg border p-2 text-sm dark:bg-gray-700"
                disabled={isAnimating}
              />
              <input
                type="number"
                min="0"
                max={numElements - 1}
                value={unionValY}
                onChange={(e) => setUnionValY(e.target.value)}
                placeholder="Node Y"
                className="flex-1 rounded-lg border p-2 text-sm dark:bg-gray-700"
                disabled={isAnimating}
              />
              <button
                onClick={() => runUnionAnimation(parseInt(unionValX), parseInt(unionValY))}
                disabled={isAnimating || unionValX === "" || unionValY === ""}
                className="flex items-center gap-1 bg-[#a435f0] text-white px-4 py-2 rounded-lg hover:bg-[#8f2cd6] transition-colors font-medium text-sm"
              >
                <Link2 className="w-4 h-4" /> Union
              </button>
            </div>
          </div>

          {/* Optimizations toggles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4.5 h-4.5 text-[#a435f0]" /> Optimizations
            </h3>
            
            {/* Path compression */}
            <label className="flex items-center justify-between border dark:border-gray-800 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/20 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 duration-300 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">Path Compression</span>
                <span className="text-[10px] text-gray-500">Flattens paths recursively on Find</span>
              </div>
              <input
                type="checkbox"
                checked={pathCompression}
                onChange={(e) => setPathCompression(e.target.checked)}
                className="w-4.5 h-4.5 accent-[#a435f0] cursor-pointer"
                disabled={isAnimating}
              />
            </label>

            {/* Union by rank */}
            <label className="flex items-center justify-between border dark:border-gray-800 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/20 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 duration-300 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">Union by Rank</span>
                <span className="text-[10px] text-gray-500">Attach shallow tree under deeper root</span>
              </div>
              <input
                type="checkbox"
                checked={unionByRank}
                onChange={(e) => setUnionByRank(e.target.checked)}
                className="w-4.5 h-4.5 accent-[#a435f0] cursor-pointer"
                disabled={isAnimating}
              />
            </label>
          </div>

          {/* Quick presets / Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <HelpCircle className="w-4.5 h-4.5 text-[#a435f0]" /> Quick Presets
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  resetDsu(8);
                  setPathCompression(true);
                  setUnionByRank(true);
                }}
                disabled={isAnimating}
                className="p-2 border.rounded-lg text-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg duration-200 transition-all font-medium"
              >
                Full Optimizations
              </button>
              <button
                onClick={() => {
                  resetDsu(8);
                  setPathCompression(false);
                  setUnionByRank(false);
                }}
                disabled={isAnimating}
                className="p-2 border rounded-lg text-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg duration-200 transition-all font-medium"
              >
                No Optimizations
              </button>
            </div>
            
            <div className="bg-[#faf5ff] dark:bg-[#1a0a2e] p-3 rounded-lg border border-[#e9d5ff] dark:border-[#3b1a6e] text-[11px] text-purple-950 dark:text-purple-300 leading-normal">
              💡 <strong>Pro-Tip:</strong> Try turning optimizations **OFF**, perform several union merges to build a straight chain node tree, and then turn **Path Compression** back **ON** and call `Find` on the leaf node to watch the entire path collapse and flatten live!
            </div>
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

      {/* 2. Visual Explanation Card */}
      <VisualizerCard
        className={
          message.includes("complete") || message.includes("merged") || message.includes("found")
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : message.includes("out of bounds") || message.includes("⚠️")
              ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              : isAnimating
                ? "border-[#a435f0]/30 bg-[#a435f0]/10 dark:border-[#a435f0]/50 dark:bg-[#a435f0]/20"
                : ""
        }
      >
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>Current Steps Explanation</span>
          <span className="font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
          </span>
        </div>
        <p className="text-center font-medium text-lg min-h-[28px]">{message}</p>
      </VisualizerCard>

      {/* 3. Graph Rendering Canvas */}
      <VisualizerCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-1.5">
            <GitBranch className="w-5 h-5 text-[#a435f0]" /> Tree Visuals
          </h2>
          
          <div className="flex flex-wrap gap-2 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-gray-500">Visiting</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-gray-500">Traversed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a435f0]"></span>
              <span className="text-gray-500">Root / Representative</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 min-h-[380px]">
          <div className="relative">
            <svg
              width={canvasWidth}
              height={360}
              viewBox={`0 0 ${canvasWidth} 360`}
              className="mx-auto"
            >
              {/* SVG Markers for custom arrows pointing upward to parent */}
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-400 dark:fill-slate-400 fill-gray-400 dark:fill-gray-600" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-blue-500 dark:fill-blue-400" />
                </marker>
              </defs>

              {/* Render edges */}
              {layoutEdges.map((edge, idx) => {
                const edgeKey = `${edge.from}->${edge.to}`;
                const isActive = currentStep?.highlightedEdges?.[edgeKey] || false;
                
                return (
                  <line
                    key={`edge-${idx}`}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke={isActive ? "#3b82f6" : "#cbd5e1"}
                    strokeWidth={isActive ? "3" : "2"}
                    className="transition-all duration-300 dark:stroke-gray-600"
                    style={{
                      stroke: isActive ? "#3b82f6" : undefined
                    }}
                    markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
                  />
                );
              })}

              {/* Render nodes */}
              {layoutNodes.map((node, idx) => {
                const nodeState = currentStep?.highlightedNodes?.[node.id] || null;
                const isCurr = nodeState === "visiting";
                const isActivePath = nodeState === "active";
                const isMatch = nodeState === "matched";
                
                let nodeClass = "fill-white stroke-gray-400 dark:fill-gray-800 dark:stroke-gray-600";
                let textClass = "fill-gray-800 dark:fill-white";
                let strokeWidth = "2";
                
                if (isCurr) {
                  nodeClass = "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-900/30 dark:stroke-emerald-400";
                  textClass = "fill-emerald-700 dark:fill-emerald-300";
                  strokeWidth = "3";
                } else if (isActivePath) {
                  nodeClass = "fill-blue-50 stroke-blue-500 dark:fill-blue-900/30 dark:stroke-blue-400";
                  textClass = "fill-blue-700 dark:fill-blue-300";
                  strokeWidth = "3";
                } else if (isMatch) {
                  nodeClass = "fill-[#a435f0]/10 stroke-[#a435f0] dark:fill-[#a435f0]/20 dark:stroke-[#d38cff]";
                  textClass = "fill-[#a435f0] dark:fill-[#d38cff]";
                  strokeWidth = "3";
                }

                // If this is a root, add a dashed ring indicating representative status
                const isRoot = node.parent === node.id;

                return (
                  <g key={`node-${idx}`} className="transition-all duration-500">
                    {/* Ring showing root representation status */}
                    {isRoot && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="23"
                        fill="none"
                        className="stroke-[#a435f0]/40 dark:stroke-[#a435f0]/70"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                      />
                    )}

                    {/* Glowing outer active ring */}
                    {(isCurr || isMatch || isActivePath) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="26"
                        fill="none"
                        className={isCurr ? "stroke-emerald-400" : isMatch ? "stroke-[#a435f0]" : "stroke-blue-400"}
                        strokeWidth="1.5"
                        strokeDasharray="4,2"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from={`0 ${node.x} ${node.y}`}
                          to={`360 ${node.x} ${node.y}`}
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      strokeWidth={strokeWidth}
                      className={`shadow-sm transition-all duration-500 ${nodeClass}`}
                    />
                    
                    <text
                      x={node.x}
                      y={node.y + 4.5}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      className={`${textClass}`}
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </VisualizerCard>

      {/* 4. Array Representation Grid */}
      <VisualizerCard>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-1.5">
          <Layers className="w-5 h-5 text-[#a435f0]" /> Array Synchronization
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-800 text-sm text-center">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <th className="border border-gray-200 dark:border-gray-800 p-2 font-semibold">Array</th>
                {Array.from({ length: numElements }).map((_, i) => (
                  <th key={i} className="border border-gray-200 dark:border-gray-800 p-2 font-semibold min-w-[50px]">{i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Parent array */}
              <tr>
                <td className="border border-gray-200 dark:border-gray-800 p-2 font-semibold bg-gray-50 dark:bg-gray-900/50">Parent</td>
                {parentArray.map((p, i) => {
                  const isHighlighted = currentStep?.arrayHighlight === i;
                  return (
                    <td
                      key={i}
                      className={`border border-gray-200 dark:border-gray-800 p-2 font-mono transition-colors duration-500 ${
                        isHighlighted ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold" : ""
                      }`}
                    >
                      {p}
                    </td>
                  );
                })}
              </tr>
              
              {/* Rank array */}
              {unionByRank && (
                <tr>
                  <td className="border border-gray-200 dark:border-gray-800 p-2 font-semibold bg-gray-50 dark:bg-gray-900/50">Rank</td>
                  {rankArray.map((r, i) => {
                    const isHighlighted = currentStep?.arrayHighlight === i && steps[currentStepIdx]?.explanation?.includes("Rank");
                    return (
                      <td
                        key={i}
                        className={`border border-gray-200 dark:border-gray-800 p-2 font-mono transition-colors duration-500 ${
                          isHighlighted ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold" : ""
                        }`}
                      >
                        {r}
                      </td>
                    );
                  })}
                </tr>
              )}

              {/* Size array */}
              {!unionByRank && (
                <tr>
                  <td className="border border-gray-200 dark:border-gray-800 p-2 font-semibold bg-gray-50 dark:bg-gray-900/50">Size</td>
                  {sizeArray.map((s, i) => (
                    <td
                      key={i}
                      className="border border-gray-200 dark:border-gray-800 p-2 font-mono"
                    >
                      {s}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

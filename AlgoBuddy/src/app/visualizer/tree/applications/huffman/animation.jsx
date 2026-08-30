"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Info, RefreshCw } from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

const INITIAL_NODES = [
  { id: "A", val: 5, char: "A", x: 100, y: 250, active: true },
  { id: "B", val: 9, char: "B", x: 250, y: 250, active: true },
  { id: "C", val: 12, char: "C", x: 400, y: 250, active: true },
  { id: "D", val: 13, char: "D", x: 550, y: 250, active: true },
  { id: "E", val: 16, char: "E", x: 700, y: 250, active: true },
];

export default function HuffmanAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Build Tree' to start Huffman Coding.");
  const [treeBuilt, setTreeBuilt] = useState(false);
  
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const { speed, setSpeed } = usePlayback(1);
  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimating(false);
    setMessage("...");
    setTreeBuilt(false);
    setSteps([]);
    setCurrentStepIdx(-1);
  });

  const currentStep = steps[currentStepIdx] || null;
  const nodes = currentStep ? currentStep.nodes : [...INITIAL_NODES];
  const edges = currentStep ? currentStep.edges : [];
  const activeIds = currentStep ? currentStep.activeIds : [];


  useEffect(() => {
    if (currentStep) {
      setMessage(currentStep.message);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!animating || steps.length === 0) return;
    if (currentStepIdx >= steps.length - 1) { 
      setAnimating(false);
      setTreeBuilt(true);
      return; 
    }
    timerRef.current = setTimeout(() => setCurrentStepIdx(p => p + 1), 1600 / speed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [animating, currentStepIdx, steps, speed]);

  const pauseVisualizer = () => { setAnimating(false); if (timerRef.current) clearTimeout(timerRef.current); };
  const startVisualizer = () => {
    if (steps.length === 0) return;
    setAnimating(true);
    const nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };
  const stepForward = () => { setAnimating(false); if (currentStepIdx < steps.length - 1) setCurrentStepIdx(p => p + 1); };
  const stepBackward = () => { setAnimating(false); if (currentStepIdx > 0) setCurrentStepIdx(p => p - 1); };
  const resetPlayback = () => {
    setAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setTreeBuilt(false);
    setMessage("Playback reset.");
  };

  const buildTree = () => {
    setAnimating(false);
    const newSteps = [];
    
    let currentNodes = INITIAL_NODES.map(n => ({...n}));
    let currentEdges = [];
    let idCounter = 1;

    newSteps.push({
      nodes: currentNodes.map(n => ({...n})),
      edges: [...currentEdges],
      activeIds: [],
      message: "Starting to build Huffman Tree..."
    });

    while (currentNodes.filter(n => n.active).length > 1) {
      let activeNodes = currentNodes.filter(n => n.active).sort((a, b) => a.val - b.val);
      
      let left = activeNodes[0];
      let right = activeNodes[1];

      newSteps.push({
        nodes: currentNodes.map(n => ({...n})),
        edges: [...currentEdges],
        activeIds: [left.id, right.id],
        message: `Selecting two nodes with minimum frequencies: ${left.val} (${left.char || '*'}) and ${right.val} (${right.char || '*'})`
      });

      let sum = left.val + right.val;
      let newNodeId = `N${idCounter++}`;
      
      let newX = (left.x + right.x) / 2;
      let newY = Math.min(left.y, right.y) - 60;

      let newNode = { id: newNodeId, val: sum, char: "", x: newX, y: newY, active: true };
      
      let leftIdx = currentNodes.findIndex(n => n.id === left.id);
      let rightIdx = currentNodes.findIndex(n => n.id === right.id);
      currentNodes[leftIdx].active = false;
      currentNodes[rightIdx].active = false;

      currentNodes.push(newNode);
      currentEdges.push({ source: newNode, target: left, label: "0" });
      currentEdges.push({ source: newNode, target: right, label: "1" });

      newSteps.push({
        nodes: currentNodes.map(n => ({...n})),
        edges: [...currentEdges],
        activeIds: [],
        message: `Combined ${left.val} and ${right.val} to form a new node with frequency ${sum}`
      });
    }

    newSteps.push({
      nodes: currentNodes.map(n => ({...n})),
      edges: [...currentEdges],
      activeIds: [],
      message: "Huffman Tree built successfully! Left branches are '0', right branches are '1'."
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setAnimating(true);
    setTreeBuilt(false);
  };

  const handleReset = () => {
    setAnimating(false);
    setSteps([]);
    setCurrentStepIdx(-1);
    setTreeBuilt(false);
    setMessage("Click 'Build Tree' to start Huffman Coding.");
  };

  useVisualizerKeyboard({
    onStepForward: stepForward,
    onStepBackward: stepBackward,
    onTogglePlay: animating ? pauseVisualizer : startVisualizer,
    onReset: resetPlayback,
    onSpeedChange: setSpeed,
    speed: speed,
    sorting: animating,
    sorted: false,
    enabled: true,
  });

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Characters & Frequencies</div>
          <div className="flex items-center gap-3">
            <button 
              onClick={buildTree} 
              disabled={animating || treeBuilt}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
            >
              <Play className="w-4 h-4" /> Build Tree
            </button>
            <button 
              onClick={handleReset} 
              className="px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all border border-red-500/30 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        <PlaybackControls 
          isPlaying={animating}
          onPlayPause={animating ? pauseVisualizer : startVisualizer}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onReset={resetPlayback}
          speed={speed}
          onSpeedChange={setSpeed}
          disabled={steps.length === 0}
          showPlayPause={true}
        />
      </VisualizerCard>

      <VisualizerCard
        className={
          message.includes("successfully") 
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : animating
                ? "border-[#a435f0]/30 bg-[#a435f0]/10 dark:border-[#a435f0]/50 dark:bg-[#a435f0]/20"
                : ""
        }
      >
        <div className="flex items-center text-xs text-gray-500 font-semibold gap-1.5 mb-2">
          <Info className="w-4 h-4 text-[#a435f0]" /> Animation Status
          <span className="ml-auto font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
            Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
          </span>
        </div>
        <div className="text-lg font-medium min-h-[28px]">{message}</div>
      </VisualizerCard>

      <VisualizerCard>
        <div className="overflow-auto flex justify-center py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 relative min-h-[400px]">
          <svg width="800" height="350" viewBox="0 0 800 350" className="max-w-full h-auto drop-shadow-sm">
            {/* Edges */}
            {edges.map((edge, i) => (
              <g key={i}>
                <line 
                  x1={edge.source.x} y1={edge.source.y + 20}
                  x2={edge.target.x} y2={edge.target.y - 20}
                  className="stroke-slate-400 dark:stroke-slate-400" strokeWidth="2"
                  className="transition-all duration-500 dark:stroke-slate-700"
                />
                <text 
                  x={(edge.source.x + edge.target.x) / 2} 
                  y={(edge.source.y + edge.target.y) / 2 - 5} 
                  className="fill-purple-600 dark:fill-purple-500" fontSize="14" fontWeight="bold"
                >
                  {edge.label}
                </text>
              </g>
            ))}

            {/* Nodes */}
            {nodes.map((node, i) => {
              const isActive = activeIds.includes(node.id);
              return (
                <g key={node.id} className="transition-all duration-500">
                  {isActive && <circle cx={node.x} cy={node.y} r="32" fill="none" className="stroke-purple-300 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  <circle 
                    cx={node.x} cy={node.y} r="24" 
                    fill={node.char ? "var(--background)" : "#a435f0"} 
                    stroke={isActive ? "#d38cff" : (node.char ? "#64748b" : "#a435f0")} 
                    strokeWidth="2.5" 
                    className="shadow-sm transition-all duration-500" 
                  />
                  <text 
                    x={node.x} y={node.y + 5} 
                    textAnchor="middle" 
                    fill={node.char ? "var(--foreground)" : "#ffffff"} 
                    fontSize="14" fontWeight="bold"
                  >
                    {node.val}
                  </text>
                  {node.char && (
                    <text x={node.x} y={node.y + 40} textAnchor="middle" className="fill-purple-600 dark:fill-purple-500" fontSize="14" fontWeight="bold">
                      {node.char}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

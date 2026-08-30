"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, RotateCcw, Info, RefreshCw } from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { generateLcaSequence } from "@/features/algorithms/tree/lcaLogic";

const NODES = [
  { id: "3", val: "3", x: 400, y: 60, parent: null },
  { id: "5", val: "5", x: 250, y: 150, parent: "3" },
  { id: "1", val: "1", x: 550, y: 150, parent: "3" },
  { id: "6", val: "6", x: 150, y: 240, parent: "5" },
  { id: "2", val: "2", x: 350, y: 240, parent: "5" },
  { id: "0", val: "0", x: 450, y: 240, parent: "1" },
  { id: "8", val: "8", x: 650, y: 240, parent: "1" },
  { id: "7", val: "7", x: 280, y: 330, parent: "2" },
  { id: "4", val: "4", x: 420, y: 330, parent: "2" },
];

const EDGES = NODES.filter(n => n.parent).map(n => {
  const p = NODES.find(parent => parent.id === n.parent);
  return { id: `${p.id}-${n.id}`, x1: p.x, y1: p.y + 20, x2: n.x, y2: n.y - 20, parent: p.id, child: n.id };
});

export default function LCAAnimation() {
  const [targetP, setTargetP] = useState("5");
  const [targetQ, setTargetQ] = useState("1");
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Select two nodes and click 'Find LCA' to trace the paths.");
  
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const { speed, setSpeed } = usePlayback(1);
  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTargetP("5");
    setTargetQ("1");
    setAnimating(false);
    setMessage("...");
    setSteps([]);
    setCurrentStepIdx(-1);
  });

  const currentStep = steps[currentStepIdx] || null;
  const activeNode = currentStep ? currentStep.activeNode : null;
  const visitedNodes = currentStep ? currentStep.visitedNodes : [];
  const foundNodes = currentStep ? currentStep.foundNodes : [];
  const backtrackingEdges = currentStep ? currentStep.backtrackingEdges : [];
  const lcaNode = currentStep ? currentStep.lcaNode : null;


  useEffect(() => {
    if (currentStep) {
      setMessage(currentStep.message);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!animating || steps.length === 0) return;
    if (currentStepIdx >= steps.length - 1) { setAnimating(false); return; }
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
    setMessage("Playback reset.");
  };



  const handleFindLca = () => {
    if (targetP === targetQ) {
      setMessage("Please select two distinct nodes.");
      return;
    }
    setAnimating(false);

    const sequence = generateLcaSequence("3", targetP, targetQ, EDGES);
    const newSteps = [];
    
    let currentVisited = [];
    let currentFound = [];
    let currentBacktracking = [];
    let currentLca = null;
    let currentActiveNode = null;
    let lcaResolved = false;
    let msg = "";

    for (const event of sequence) {
      switch (event.type) {
        case "VISIT":
          if (!lcaResolved) {
            currentActiveNode = event.node;
            if (!currentVisited.includes(event.node)) {
              currentVisited = [...currentVisited, event.node];
            }
            msg = `Exploring node ${event.node}...`;
          }
          break;
        case "FOUND_TARGET":
          if (!currentFound.includes(event.node)) {
            currentFound = [...currentFound, event.node];
          }
          if (!lcaResolved) {
            msg = `Node ${event.node} matches target!`;
          }
          break;
        case "RETURN_LEFT":
        case "RETURN_RIGHT":
          if (!lcaResolved) {
            currentActiveNode = event.node;
            if (event.val) {
              const edge = `${event.node}-${event.child}`;
              if (!currentBacktracking.includes(edge)) currentBacktracking = [...currentBacktracking, edge];
              msg = `Subtree returned ${event.val}. Propagating up to ${event.node}.`;
            } else {
              msg = `Subtree returned null.`;
            }
          } else if (event.val) {
            const edge = `${event.node}-${event.child}`;
            if (!currentBacktracking.includes(edge)) currentBacktracking = [...currentBacktracking, edge];
          }
          break;
        case "LCA_FOUND":
          lcaResolved = true;
          currentLca = event.node;
          currentActiveNode = null; 
          msg = `Lowest Common Ancestor = ${event.node}`;
          break;
        case "BACKTRACK":
          if (!lcaResolved && event.node !== "3") { 
            if (event.returnValue) {
              msg = `Returning ${event.returnValue} up to parent.`;
            } else {
              msg = `Returning null up to parent.`;
            }
          }
          break;
        case "FINISH":
          currentActiveNode = null;
          if (!lcaResolved) {
              const actualLca = sequence.find(s => s.type === "BACKTRACK" && s.returnValue && s.node === s.returnValue)?.node;
              currentLca = actualLca;
              msg = `Lowest Common Ancestor = ${actualLca}`;
          }
          break;
      }
      
      newSteps.push({
        activeNode: currentActiveNode,
        visitedNodes: [...currentVisited],
        foundNodes: [...currentFound],
        backtrackingEdges: [...currentBacktracking],
        lcaNode: currentLca,
        message: msg
      });
    }

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setAnimating(true);
  };

  const handleReset = () => {
    setAnimating(false);
    setSteps([]);
    setCurrentStepIdx(-1);
    setMessage("Select two nodes and click 'Find LCA' to trace the paths.");
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

  // SVG Helper functions
  const getNodeFill = (nodeId) => {
      if (lcaNode === nodeId) return "var(--background)"; 
      if (foundNodes.includes(nodeId)) return "#fef3c7"; 
      if (activeNode === nodeId) return "#fef3c7";
      return "var(--background)";
  };

  const getNodeStroke = (nodeId) => {
      if (lcaNode === nodeId) return "#f59e0b"; 
      if (foundNodes.includes(nodeId)) return "#f59e0b"; 
      if (activeNode === nodeId) return "#f59e0b"; 
      if (visitedNodes.includes(nodeId)) return "#94a3b8"; 
      return "#94a3b8"; 
  };
  
  const getTextColor = (nodeId) => {
      if (lcaNode === nodeId) return "#f59e0b"; 
      if (foundNodes.includes(nodeId)) return "#d97706"; 
      if (activeNode === nodeId) return "#d97706"; 
      if (visitedNodes.includes(nodeId)) return "var(--foreground)"; 
      return "var(--foreground)"; 
  };

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Node p:</label>
              <select 
                value={targetP} 
                onChange={e => setTargetP(e.target.value)}
                disabled={animating}
                className="bg-gray-50 text-amber-600 font-bold px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:text-amber-500 disabled:opacity-50 transition-colors"
              >
                {NODES.map(n => <option key={`p-${n.id}`} value={n.id}>{n.val}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Node q:</label>
              <select 
                value={targetQ} 
                onChange={e => setTargetQ(e.target.value)}
                disabled={animating}
                className="bg-gray-50 text-amber-600 font-bold px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:text-amber-500 disabled:opacity-50 transition-colors"
              >
                {NODES.map(n => <option key={`q-${n.id}`} value={n.id}>{n.val}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleFindLca} 
              disabled={animating}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
            >
              <Search className="w-4 h-4" /> Find LCA
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
          lcaNode 
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
        <div className="overflow-auto flex justify-center py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 relative min-h-[500px]">
          <svg width="800" height="420" viewBox="0 0 800 420" className="max-w-full h-auto drop-shadow-sm">
            {/* Edges */}
            {EDGES.map(e => {
              const edgeId = `${e.parent}-${e.child}`;
              const isBacktracking = backtrackingEdges.includes(edgeId);
              
              return (
                <line 
                  key={e.id} 
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
                  stroke={isBacktracking ? "#f59e0b" : "#cbd5e1"} 
                  strokeWidth={isBacktracking ? "4" : "2"}
                  strokeDasharray={isBacktracking ? "6,4" : "0"}
                  className={`transition-all duration-500 ${!isBacktracking && 'dark:stroke-slate-700'}`}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const isP = node.id === targetP;
              const isQ = node.id === targetQ;
              const isLCA = node.id === lcaNode;
              const isActive = node.id === activeNode;
              
              let r = isLCA ? "30" : "24";

              return (
                <g key={node.id} className="transition-all duration-500">
                  {/* Active node glow */}
                  {isActive && !isLCA && <circle cx={node.x} cy={node.y} r="32" fill="none" className="stroke-yellow-300 dark:stroke-yellow-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  
                  {/* LCA ultimate glow */}
                  {isLCA && <circle cx={node.x} cy={node.y} r="38" fill="none" className="stroke-yellow-300 dark:stroke-yellow-400" strokeWidth="2" className="opacity-80 animate-ping" />}
                  {isLCA && <circle cx={node.x} cy={node.y} r="45" fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" className="opacity-40 animate-pulse" />}
                  
                  <circle 
                    cx={node.x} cy={node.y} r={r} 
                    fill={getNodeFill(node.id)} 
                    stroke={getNodeStroke(node.id)} 
                    strokeWidth="2.5" 
                    className="shadow-sm transition-all duration-500 dark:stroke-slate-600" 
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill={getTextColor(node.id)} fontSize="14" fontWeight="bold" className="transition-colors">{node.val}</text>
                  
                  {isP && !isLCA && <text x={node.x + 35} y={node.y + 5} className="fill-amber-500 dark:fill-amber-400" fontSize="14" fontWeight="bold">p</text>}
                  {isQ && !isLCA && <text x={node.x + 35} y={node.y + 5} className="fill-amber-500 dark:fill-amber-400" fontSize="14" fontWeight="bold">q</text>}
                  {isLCA && <text x={node.x + 45} y={node.y + 5} className="fill-amber-500 dark:fill-amber-400" fontSize="16" fontWeight="black">LCA</text>}
                </g>
              );
            })}
          </svg>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

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

export default function SyntaxTreesAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Evaluate AST' to evaluate: 3 + (5 * 2)");
  
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const { speed, setSpeed } = usePlayback(1);
  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimating(false);
    setMessage("...");
    setSteps([]);
    setCurrentStepIdx(-1);
  });

  // Derived state from steps
  const currentStep = steps[currentStepIdx] || null;
  const activeNode = currentStep ? currentStep.activeNode : null;
  const activeEdge = currentStep ? currentStep.activeEdge : null;
  const nodeValues = currentStep && currentStep.nodeValues ? currentStep.nodeValues : { N1: "?", N2: "3", N3: "?", N4: "5", N5: "2" };


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

  const evaluateAST = () => {
    setAnimating(false);
    const newSteps = [];
    
    let vals = { N1: "?", N2: "3", N3: "?", N4: "5", N5: "2" };

    newSteps.push({
      activeNode: null, activeEdge: null, nodeValues: { ...vals },
      message: "Starting Post-Order Traversal to evaluate AST..."
    });

    newSteps.push({
      activeNode: "N2", activeEdge: "E1", nodeValues: { ...vals },
      message: "Visiting left leaf node: 3. Return 3."
    });

    newSteps.push({
      activeNode: "N3", activeEdge: "E2", nodeValues: { ...vals },
      message: "Visiting right subtree (*). Must evaluate its children first."
    });

    newSteps.push({
      activeNode: "N4", activeEdge: "E3", nodeValues: { ...vals },
      message: "Visiting left leaf node: 5. Return 5."
    });

    newSteps.push({
      activeNode: "N5", activeEdge: "E4", nodeValues: { ...vals },
      message: "Visiting right leaf node: 2. Return 2."
    });

    vals = { ...vals, N3: "10" };
    newSteps.push({
      activeNode: "N3", activeEdge: null, nodeValues: { ...vals },
      message: "Evaluating Node (*): 5 * 2 = 10."
    });

    vals = { ...vals, N1: "13" };
    newSteps.push({
      activeNode: "N1", activeEdge: null, nodeValues: { ...vals },
      message: "Evaluating Root (+): 3 + 10 = 13."
    });

    newSteps.push({
      activeNode: null, activeEdge: null, nodeValues: { ...vals },
      message: "AST Evaluation Complete. Final Result: 13."
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setAnimating(true);
  };

  const handleReset = () => {
    setAnimating(false);
    setSteps([]);
    setCurrentStepIdx(-1);
    setMessage("Click 'Evaluate AST' to evaluate: 3 + (5 * 2)");
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

  const getNodeFill = (id, isLeaf) => {
    if (activeNode === id) return "#a435f0";
    if (nodeValues[id] !== "?") return "var(--background)";
    return isLeaf ? "var(--background)" : "var(--background)";
  };

  const getStroke = (id) => {
    if (activeNode === id) return "#d38cff";
    if (nodeValues[id] !== "?") return "#a435f0";
    return "#64748b";
  };
  
  const getTextColor = (id) => {
    if (activeNode === id) return "#ffffff";
    return "var(--foreground)";
  };

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Expression: 3 + (5 * 2)</div>
          <div className="flex items-center gap-3">
            <button 
              onClick={evaluateAST} 
              disabled={animating || nodeValues.N1 !== "?"}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
            >
              <Play className="w-4 h-4" /> Evaluate AST
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
          message.includes("Complete") 
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
        <div className="overflow-auto flex justify-center py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 relative min-h-[350px]">
          <svg width="500" height="300" viewBox="0 0 500 300" className="max-w-full h-auto drop-shadow-sm">
            {/* Edges */}
            <g>
              <line x1="250" y1="50" x2="150" y2="120" stroke={activeEdge === "E1" ? "#a435f0" : "#cbd5e1"} strokeWidth={activeEdge === "E1" ? "4" : "2"} className="transition-all duration-500 dark:stroke-slate-700" />
              <line x1="250" y1="50" x2="350" y2="120" stroke={activeEdge === "E2" ? "#a435f0" : "#cbd5e1"} strokeWidth={activeEdge === "E2" ? "4" : "2"} className="transition-all duration-500 dark:stroke-slate-700" />
              <line x1="350" y1="120" x2="280" y2="190" stroke={activeEdge === "E3" ? "#a435f0" : "#cbd5e1"} strokeWidth={activeEdge === "E3" ? "4" : "2"} className="transition-all duration-500 dark:stroke-slate-700" />
              <line x1="350" y1="120" x2="420" y2="190" stroke={activeEdge === "E4" ? "#a435f0" : "#cbd5e1"} strokeWidth={activeEdge === "E4" ? "4" : "2"} className="transition-all duration-500 dark:stroke-slate-700" />
            </g>

            {/* Nodes */}
            <g className="transition-all duration-500">
              {activeNode === "N1" && <circle cx="250" cy="50" r="32" fill="none" className="stroke-purple-300 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="250" cy="50" r="24" fill={getNodeFill("N1", false)} stroke={getStroke("N1")} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="250" y="55" textAnchor="middle" fill={getTextColor("N1")} fontSize="16" fontWeight="bold">+</text>
              <text x="250" y="90" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="12" fontWeight="bold">{nodeValues.N1}</text>
            </g>

            <g className="transition-all duration-500">
              {activeNode === "N2" && <circle cx="150" cy="120" r="32" fill="none" className="stroke-purple-300 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="150" cy="120" r="24" fill={getNodeFill("N2", true)} stroke={getStroke("N2")} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="150" y="125" textAnchor="middle" fill={getTextColor("N2")} fontSize="14" fontWeight="bold">3</text>
            </g>

            <g className="transition-all duration-500">
              {activeNode === "N3" && <circle cx="350" cy="120" r="32" fill="none" className="stroke-purple-300 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="350" cy="120" r="24" fill={getNodeFill("N3", false)} stroke={getStroke("N3")} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="350" y="125" textAnchor="middle" fill={getTextColor("N3")} fontSize="16" fontWeight="bold">*</text>
              <text x="350" y="160" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="12" fontWeight="bold">{nodeValues.N3}</text>
            </g>

            <g className="transition-all duration-500">
              {activeNode === "N4" && <circle cx="280" cy="190" r="32" fill="none" className="stroke-purple-300 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="280" cy="190" r="24" fill={getNodeFill("N4", true)} stroke={getStroke("N4")} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="280" y="195" textAnchor="middle" fill={getTextColor("N4")} fontSize="14" fontWeight="bold">5</text>
            </g>

            <g className="transition-all duration-500">
              {activeNode === "N5" && <circle cx="420" cy="190" r="32" fill="none" className="stroke-purple-300 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <circle cx="420" cy="190" r="24" fill={getNodeFill("N5", true)} stroke={getStroke("N5")} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="420" y="195" textAnchor="middle" fill={getTextColor("N5")} fontSize="14" fontWeight="bold">2</text>
            </g>
          </svg>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

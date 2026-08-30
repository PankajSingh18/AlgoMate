"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Info, Scan, RefreshCw } from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { generateDiameterSteps } from "@/features/algorithms/tree/diameterLogic";

const NODES = [
  { id: "A", x: 400, y: 50, parent: null },
  { id: "B", x: 250, y: 120, parent: "A" },
  { id: "C", x: 550, y: 120, parent: "A" },
  { id: "D", x: 150, y: 210, parent: "B" },
  { id: "E", x: 350, y: 210, parent: "B" },
  { id: "F", x: 100, y: 300, parent: "D" },
  { id: "G", x: 200, y: 300, parent: "D" },
  { id: "H", x: 400, y: 300, parent: "E" },
  { id: "I", x: 450, y: 390, parent: "H" },
];

const EDGES = NODES.filter(n => n.parent).map(n => {
  const p = NODES.find(parent => parent.id === n.parent);
  return { id: `${p.id}-${n.id}`, x1: p.x, y1: p.y + 20, x2: n.x, y2: n.y - 20, parent: p.id, child: n.id };
});

export default function DiameterAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Find Diameter' to calculate subtree heights.");
  
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

  const currentStep = steps[currentStepIdx] || null;
  const activeNodes = currentStep ? currentStep.activeNodes : [];
  const calculatedHeights = currentStep ? currentStep.calculatedHeights : {};
  const maxDiameter = currentStep ? currentStep.maxDiameter : 0;
  const diameterPathEdges = currentStep ? currentStep.diameterPathEdges : [];
  const diameterPathNodes = currentStep ? currentStep.diameterPathNodes : [];


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

  const handleFindDiameter = () => {
    setAnimating(false);

    const newSteps = generateDiameterSteps();

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setAnimating(true);
  };

  const handleReset = () => {
    setAnimating(false);
    setSteps([]);
    setCurrentStepIdx(-1);
    setMessage("Click 'Find Diameter' to calculate subtree heights.");
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
          <div className="flex items-center gap-4 text-cyan-600 dark:text-cyan-400 font-mono bg-cyan-50 dark:bg-cyan-950/30 px-4 py-2 rounded-lg border border-cyan-200 dark:border-cyan-900/50">
            Max Diameter: <span className="text-xl font-bold ml-2 text-cyan-700 dark:text-cyan-300">{maxDiameter}</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleFindDiameter} 
              disabled={animating}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
            >
              <Scan className="w-4 h-4" /> Find Diameter
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
          diameterPathEdges.length > 0
            ? "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30"
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
              const isPath = diameterPathEdges.includes(e.id) || diameterPathEdges.includes(`${e.child}-${e.parent}`);
              
              return (
                <line 
                  key={e.id} 
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
                  stroke={isPath ? "#06b6d4" : "#cbd5e1"} 
                  strokeWidth={isPath ? "5" : "2"}
                  className={`transition-all duration-500 ${!isPath && 'dark:stroke-slate-700'}`}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const isActive = activeNodes.includes(node.id);
              const isPath = diameterPathNodes.includes(node.id);
              const h = calculatedHeights[node.id];
              
              let fill = "var(--background)";
              let stroke = "#94a3b8"; // slate-400
              let r = "20";
              let textFill = "var(--foreground)";

              if (isPath) {
                fill = "#cffafe"; // cyan-100
                stroke = "#06b6d4"; // cyan-500
                r = "26";
                textFill = "#164e63"; // cyan-900
              } else if (isActive) {
                fill = "#ecfeff"; // cyan-50
                stroke = "#06b6d4";
                r = "24";
                textFill = "#164e63";
              } else if (h !== undefined) {
                stroke = "#0891b2"; // cyan-600
              }

              return (
                <g key={node.id} className="transition-all duration-500">
                  {isPath && <circle cx={node.x} cy={node.y} r="32" fill="none" strokeWidth="2" className="stroke-cyan-400 opacity-80 animate-ping dark:stroke-cyan-400" />}
                  {isActive && <circle cx={node.x} cy={node.y} r="30" fill="none" className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  
                  <circle 
                    cx={node.x} cy={node.y} r={r} 
                    fill={fill} stroke={stroke} strokeWidth="2.5" 
                    className="shadow-sm transition-all duration-500 dark:stroke-slate-600" 
                  />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fill={textFill} fontSize="12" fontWeight="bold" className="transition-colors">{node.id}</text>
                  
                  {/* Height Indicator Label */}
                  {h !== undefined && (
                    <text x={node.x + 28} y={node.y + 4} fontSize="12" fontWeight="bold" className="fill-cyan-500 dark:fill-cyan-400">h:{h}</text>
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

"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Info, FileDown, FileUp, RefreshCw } from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { generateSerializationSteps, generateDeserializationSteps } from "@/features/algorithms/tree/serializationLogic";

const NODES = [
  { id: "1", val: "1", x: 400, y: 60, parent: null },
  { id: "2", val: "2", x: 250, y: 150, parent: "1", isLeft: true },
  { id: "3", val: "3", x: 550, y: 150, parent: "1", isLeft: false },
  { id: "4", val: "4", x: 450, y: 240, parent: "3", isLeft: true },
  { id: "5", val: "5", x: 650, y: 240, parent: "3", isLeft: false },
];

const EDGES = NODES.filter(n => n.parent).map(n => {
  const p = NODES.find(parent => parent.id === n.parent);
  return { id: `${p.id}-${n.id}`, x1: p.x, y1: p.y + 20, x2: n.x, y2: n.y - 20, parent: p.id, child: n.id };
});

const SEQUENCE = [
  { type: "node", id: "1", val: "1" },
  { type: "node", id: "2", val: "2" },
  { type: "null", parent: "2", dir: "left" },
  { type: "null", parent: "2", dir: "right" },
  { type: "node", id: "3", val: "3" },
  { type: "node", id: "4", val: "4" },
  { type: "null", parent: "4", dir: "left" },
  { type: "null", parent: "4", dir: "right" },
  { type: "node", id: "5", val: "5" },
  { type: "null", parent: "5", dir: "left" },
  { type: "null", parent: "5", dir: "right" },
];

export default function SerializationAnimation() {
  const [animating, setAnimating] = useState(false);
  const [mode, setMode] = useState("idle"); 
  const [message, setMessage] = useState("Click 'Serialize' to start flattening the tree into a string.");
  
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const { speed, setSpeed } = usePlayback(1);
  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimating(false);
    setMode("idle");
    setMessage("...");
    setSteps([]);
    setCurrentStepIdx(-1);
  });

  const currentStep = steps[currentStepIdx] || null;
  const activeStep = currentStep ? currentStep.activeStep : -1;
  const serializedArray = currentStep ? currentStep.serializedArray : (mode === "deserializing" ? SEQUENCE.map(s => s.val || "N") : []);
  const builtNodes = currentStep ? currentStep.builtNodes : [];
  const builtEdges = currentStep ? currentStep.builtEdges : [];


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

  const handleSerialize = () => {
    setAnimating(false);
    setMode("serializing");
    const newSteps = generateSerializationSteps(SEQUENCE);
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setAnimating(true);
  };

  const handleDeserialize = () => {
    setAnimating(false);
    setMode("deserializing");
    const newSteps = generateDeserializationSteps(SEQUENCE);
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setAnimating(true);
  };

  const handleReset = () => {
    setAnimating(false);
    setMode("idle");
    setSteps([]);
    setCurrentStepIdx(-1);
    setMessage("Click 'Serialize' to start flattening the tree into a string.");
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
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSerialize} 
                disabled={animating || mode === "serializing" || serializedArray.length === SEQUENCE.length}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
              >
                <FileDown className="w-4 h-4" /> Serialize
              </button>
              
              <button 
                onClick={handleDeserialize} 
                disabled={animating || (mode === "idle" && serializedArray.length !== SEQUENCE.length) || mode === "deserializing"}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
              >
                <FileUp className="w-4 h-4" /> Deserialize
              </button>
            </div>
            
            <button 
              onClick={handleReset} 
              className="px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all border border-red-500/30 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-2 overflow-x-auto min-h-[70px] shadow-inner">
              {serializedArray.length === 0 && mode === "idle" && <span className="text-gray-400 dark:text-gray-500 text-sm italic">Serialized string will appear here...</span>}
              {serializedArray.map((val, idx) => (
                  <div key={idx} className={`w-10 h-10 flex items-center justify-center font-mono font-bold rounded-lg shadow-sm text-sm shrink-0 transition-all ${
                      idx === activeStep 
                      ? "bg-amber-500 text-white scale-110 shadow-amber-500/30 shadow-lg" 
                      : val === "N" 
                          ? "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500" 
                          : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50"
                  }`}>
                      {val}
                  </div>
              ))}
              {serializedArray.length > 0 && <span className="text-amber-500 font-mono text-xl ml-2 animate-pulse">_</span>}
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
        <div className="overflow-auto flex justify-center py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 relative min-h-[400px]">
          <svg width="800" height="350" viewBox="0 0 800 350" className="max-w-full h-auto drop-shadow-sm">
            
            {/* Edges */}
            {EDGES.map(e => {
              const isVisible = mode === "serializing" || mode === "idle" || builtEdges.includes(e.id);
              const isActive = mode === "serializing" && activeStep >= 0 && (
                  (SEQUENCE[activeStep].id === e.child) || 
                  (SEQUENCE[activeStep].parent === e.parent && SEQUENCE[activeStep].type === "null")
              );
              
              if (!isVisible) return null;

              return (
                <line 
                  key={e.id} 
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
                  stroke={isActive ? "#f59e0b" : "#cbd5e1"} 
                  strokeWidth={isActive ? "4" : "2"}
                  className={`transition-all duration-500 ${!isActive && 'dark:stroke-slate-700'}`}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const isVisible = mode === "serializing" || mode === "idle" || builtNodes.includes(node.id);
              const isActive = mode === "serializing" && activeStep >= 0 && SEQUENCE[activeStep].id === node.id;
              const isDeserializingActive = mode === "deserializing" && activeStep >= 0 && SEQUENCE[activeStep].id === node.id;
              
              if (!isVisible) return null;

              let stroke = "#94a3b8"; // slate-400
              let fill = "var(--background)";
              let textFill = "var(--foreground)";
              
              if (isActive || isDeserializingActive) {
                stroke = "#f59e0b"; // amber-500
                fill = "#fef3c7"; // amber-50
                textFill = "#92400e"; // amber-800
              } else if (builtNodes.includes(node.id)) {
                 stroke = "#f59e0b"; // amber-500
                 fill = "var(--background)";
              }

              return (
                <g key={node.id} className="transition-all duration-500">
                  {(isActive || isDeserializingActive) && <circle cx={node.x} cy={node.y} r="32" fill="none" className="stroke-yellow-300 dark:stroke-yellow-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  <circle cx={node.x} cy={node.y} r="26" fill={fill} stroke={stroke} strokeWidth="2.5" className="shadow-sm transition-all duration-500 dark:stroke-slate-600" />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill={isActive || isDeserializingActive ? textFill : "var(--foreground)"} fontSize="14" fontWeight="bold" className="transition-all duration-500">{node.val}</text>
                </g>
              );
            })}

            {/* Null pointers visualization (only show active ones) */}
            {activeStep >= 0 && SEQUENCE[activeStep].type === "null" && (
                <g className="transition-all duration-500">
                    {(() => {
                        const parentNode = NODES.find(n => n.id === SEQUENCE[activeStep].parent);
                        const dx = SEQUENCE[activeStep].dir === "left" ? -40 : 40;
                        const dy = 50;
                        return (
                            <>
                                <line x1={parentNode.x} y1={parentNode.y + 20} x2={parentNode.x + dx} y2={parentNode.y + dy} className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse"/>
                                <circle cx={parentNode.x + dx} cy={parentNode.y + dy} r="15" fill="var(--background)" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
                                <text x={parentNode.x + dx} y={parentNode.y + dy + 4} textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="12" fontWeight="bold" fontFamily="monospace">N</text>
                            </>
                        )
                    })()}
                </g>
            )}

          </svg>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

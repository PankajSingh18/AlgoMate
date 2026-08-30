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

export default function DecisionTreeAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Classify' to trace a decision path.");
  const [sample, setSample] = useState({ weather: "Rainy", wind: "Strong" });
  
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const { speed, setSpeed } = usePlayback(1);
  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimating(false);
    setMessage("...");
    setSample({ weather: "Rainy", wind: "Strong" });
    setSteps([]);
    setCurrentStepIdx(-1);
  });

  const currentStep = steps[currentStepIdx] || null;
  const activeNode = currentStep ? currentStep.activeNode : null;
  const activeEdge = currentStep ? currentStep.activeEdge : null;
  const prediction = currentStep ? currentStep.prediction : null;


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

  const classify = () => {
    setAnimating(false);
    const newSteps = [];

    newSteps.push({
      activeNode: null,
      activeEdge: null,
      prediction: null,
      message: `Classifying instance: { Weather: ${sample.weather}, Wind: ${sample.wind} }`
    });

    newSteps.push({
      activeNode: "N1",
      activeEdge: null,
      prediction: null,
      message: "Node N1: What is the Weather?"
    });

    if (sample.weather === "Sunny") {
      newSteps.push({
        activeNode: "N1",
        activeEdge: "E1",
        prediction: null,
        message: "Weather is Sunny -> Go Left"
      });
      
      newSteps.push({
        activeNode: "N2",
        activeEdge: "E1",
        prediction: "Yes",
        message: "Leaf Node N2: Play Tennis = Yes!"
      });
    } else {
      newSteps.push({
        activeNode: "N1",
        activeEdge: "E2",
        prediction: null,
        message: "Weather is Rainy -> Go Right"
      });
      
      newSteps.push({
        activeNode: "N3",
        activeEdge: "E2",
        prediction: null,
        message: "Node N3: What is the Wind?"
      });

      if (sample.wind === "Weak") {
        newSteps.push({
          activeNode: "N3",
          activeEdge: "E3",
          prediction: null,
          message: "Wind is Weak -> Go Left"
        });

        newSteps.push({
          activeNode: "N4",
          activeEdge: "E3",
          prediction: "Yes",
          message: "Leaf Node N4: Play Tennis = Yes!"
        });
      } else {
        newSteps.push({
          activeNode: "N3",
          activeEdge: "E4",
          prediction: null,
          message: "Wind is Strong -> Go Right"
        });

        newSteps.push({
          activeNode: "N5",
          activeEdge: "E4",
          prediction: "No",
          message: "Leaf Node N5: Play Tennis = No!"
        });
      }
    }
    
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setAnimating(true);
  };

  const handleReset = () => {
    setAnimating(false);
    setSteps([]);
    setCurrentStepIdx(-1);
    setMessage("Click 'Classify' to trace a decision path.");
  };

  const toggleSample = () => {
    if (sample.weather === "Sunny") {
      setSample({ weather: "Rainy", wind: "Weak" });
    } else if (sample.weather === "Rainy" && sample.wind === "Weak") {
      setSample({ weather: "Rainy", wind: "Strong" });
    } else {
      setSample({ weather: "Sunny", wind: "Strong" });
    }
    handleReset();
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

  // Node styles
  const getFill = (id, isLeaf) => {
    if (activeNode === id) return "#a435f0";
    if (isLeaf) return "var(--background)";
    return "var(--background)";
  };

  const getStroke = (id, isLeaf, color) => {
    if (activeNode === id) return "#d38cff";
    if (isLeaf) return color || "#64748b";
    return "#a435f0";
  };
  
  const getTextColor = (id, isLeaf, color) => {
    if (activeNode === id) return "#ffffff";
    if (isLeaf) return color || "var(--foreground)";
    return "var(--foreground)";
  };

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Current Sample: </div>
            <button 
              onClick={toggleSample}
              disabled={animating}
              className="px-3 py-1.5 bg-gray-100 text-[#a435f0] border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-[#d38cff] rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Weather: {sample.weather}, Wind: {sample.wind}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={classify} 
              disabled={animating}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
            >
              <Play className="w-4 h-4" /> Classify
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
          prediction === "Yes" 
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : prediction === "No"
              ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
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
          <svg width="600" height="300" viewBox="0 0 600 300" className="max-w-full h-auto drop-shadow-sm">
            {/* Edges */}
            <g>
              <line x1="300" y1="60" x2="150" y2="150" stroke={activeEdge === "E1" ? "#a435f0" : "#cbd5e1"} strokeWidth={activeEdge === "E1" ? "4" : "2"} className="transition-all duration-500 dark:stroke-slate-700" />
              <line x1="300" y1="60" x2="450" y2="150" stroke={activeEdge === "E2" ? "#a435f0" : "#cbd5e1"} strokeWidth={activeEdge === "E2" ? "4" : "2"} className="transition-all duration-500 dark:stroke-slate-700" />
              <line x1="450" y1="150" x2="350" y2="240" stroke={activeEdge === "E3" ? "#a435f0" : "#cbd5e1"} strokeWidth={activeEdge === "E3" ? "4" : "2"} className="transition-all duration-500 dark:stroke-slate-700" />
              <line x1="450" y1="150" x2="550" y2="240" stroke={activeEdge === "E4" ? "#a435f0" : "#cbd5e1"} strokeWidth={activeEdge === "E4" ? "4" : "2"} className="transition-all duration-500 dark:stroke-slate-700" />
              
              <text x="210" y="95" className="fill-gray-500 dark:fill-gray-400" fontSize="12" fontWeight="bold">Sunny</text>
              <text x="390" y="95" className="fill-gray-500 dark:fill-gray-400" fontSize="12" fontWeight="bold">Rainy</text>
              <text x="380" y="190" className="fill-gray-500 dark:fill-gray-400" fontSize="12" fontWeight="bold">Weak</text>
              <text x="510" y="190" className="fill-gray-500 dark:fill-gray-400" fontSize="12" fontWeight="bold">Strong</text>
            </g>

            {/* Nodes */}
            <g className="transition-all duration-500">
              {activeNode === "N1" && <rect x="230" y="40" width="140" height="40" rx="20" fill="none" className="stroke-purple-300 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
              <rect x="240" y="40" width="120" height="40" rx="20" fill={getFill("N1", false)} stroke={getStroke("N1", false)} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="300" y="65" textAnchor="middle" fill={getTextColor("N1", false)} fontSize="14" fontWeight="bold">Weather?</text>
            </g>

            <g className="transition-all duration-500">
              <rect x="100" y="130" width="100" height="40" rx="8" fill={getFill("N2", true)} stroke={getStroke("N2", true, "#10b981")} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="150" y="155" textAnchor="middle" fill={getTextColor("N2", true, "#059669")} fontSize="14" fontWeight="bold">Yes</text>
            </g>

            <g className="transition-all duration-500">
              <rect x="390" y="130" width="120" height="40" rx="20" fill={getFill("N3", false)} stroke={getStroke("N3", false)} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="450" y="155" textAnchor="middle" fill={getTextColor("N3", false)} fontSize="14" fontWeight="bold">Wind?</text>
            </g>

            <g className="transition-all duration-500">
              <rect x="300" y="220" width="100" height="40" rx="8" fill={getFill("N4", true)} stroke={getStroke("N4", true, "#10b981")} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="350" y="245" textAnchor="middle" fill={getTextColor("N4", true, "#059669")} fontSize="14" fontWeight="bold">Yes</text>
            </g>

            <g className="transition-all duration-500">
              <rect x="500" y="220" width="100" height="40" rx="8" fill={getFill("N5", true)} stroke={getStroke("N5", true, "#ef4444")} strokeWidth="2.5" className="shadow-sm transition-all duration-500" />
              <text x="550" y="245" textAnchor="middle" fill={getTextColor("N5", true, "#dc2626")} fontSize="14" fontWeight="bold">No</text>
            </g>
          </svg>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

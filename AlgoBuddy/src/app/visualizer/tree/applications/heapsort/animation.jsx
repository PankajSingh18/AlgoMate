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

const INITIAL_ARRAY = [7, 1, 8, 5, 2];

export default function HeapSortAnimation() {
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Click 'Start Sort' to visualize Heap Sort.");
  
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
  const array = currentStep ? currentStep.array : [...INITIAL_ARRAY];
  const activeIndices = currentStep ? currentStep.activeIndices : [];
  const sortedIndices = currentStep ? currentStep.sortedIndices : [];
  const heapSize = currentStep ? currentStep.heapSize : INITIAL_ARRAY.length;


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

  const startHeapSort = () => {
    setAnimating(false);
    const newSteps = [];
    
    const pushStep = (msg, arr, active, sorted, hs) => {
      newSteps.push({
        message: msg,
        array: [...arr],
        activeIndices: [...active],
        sortedIndices: [...sorted],
        heapSize: hs,
      });
    };

    const heapify = (arr, n, i, sorted, hs) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      pushStep(`Checking node ${arr[i]} at index ${i}`, arr, [i], sorted, hs);

      if (left < n) {
        pushStep(`Comparing ${arr[largest]} with left child ${arr[left]}`, arr, [i, left], sorted, hs);
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < n) {
        pushStep(`Comparing ${arr[largest]} with right child ${arr[right]}`, arr, [largest, right], sorted, hs);
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        pushStep(`Swapping ${arr[i]} and ${arr[largest]}`, arr, [i, largest], sorted, hs);
        
        const temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        
        pushStep(`Swapped`, arr, [i, largest], sorted, hs);
        heapify(arr, n, largest, sorted, hs);
      }
    };

    let arr = [...INITIAL_ARRAY];
    let n = arr.length;
    let sorted = [];

    pushStep("Phase 1: Build Max-Heap", arr, [], [], n);

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, sorted, n);
    }

    pushStep("Max-Heap built successfully!", arr, [], [], n);
    pushStep("Phase 2: Extract max and shrink heap", arr, [], [], n);

    for (let i = n - 1; i > 0; i--) {
      pushStep(`Swapping root (Max: ${arr[0]}) with last heap element ${arr[i]}`, arr, [0, i], sorted, i + 1);

      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;

      sorted.push(i);
      pushStep(`Element ${arr[i]} is now in its sorted position.`, arr, [], sorted, i);

      heapify(arr, i, 0, sorted, i);
    }
    
    sorted.push(0);
    pushStep("Heap Sort complete!", arr, [], sorted, 0);

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setAnimating(true);
  };

  const handleReset = () => {
    setAnimating(false);
    setSteps([]);
    setCurrentStepIdx(-1);
    setMessage("Click 'Start Sort' to visualize Heap Sort.");
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

  // SVG Helper
  const getNodeColor = (index) => {
    if (sortedIndices.includes(index)) return "var(--background)";
    if (activeIndices.includes(index)) return "#a435f0";
    if (index >= heapSize) return "var(--background)";
    return "var(--background)";
  };
  
  const getStrokeColor = (index) => {
    if (sortedIndices.includes(index)) return "#fbbf24"; // yellow/amber for sorted
    if (activeIndices.includes(index)) return "#d38cff";
    return "#64748b";
  };
  
  const getTextColor = (index) => {
    if (activeIndices.includes(index)) return "#ffffff";
    if (sortedIndices.includes(index)) return "#b45309";
    return "var(--foreground)";
  };

  // Node positions for a tree of size 5
  const positions = [
    { x: 400, y: 50 },
    { x: 250, y: 140 },
    { x: 550, y: 140 },
    { x: 150, y: 230 },
    { x: 350, y: 230 }
  ];

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Array: [{INITIAL_ARRAY.join(", ")}]</div>
          <div className="flex items-center gap-3">
            <button 
              onClick={startHeapSort} 
              disabled={animating}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
            >
              <Play className="w-4 h-4" /> Start Sort
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
          message.includes("complete") || message.includes("successfully")
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
        <div className="flex justify-center gap-2 mb-8">
          {array.map((val, idx) => (
            <div 
              key={idx} 
              className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-lg border-2 ${
                sortedIndices.includes(idx) ? "bg-amber-100 border-amber-400 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400" :
                activeIndices.includes(idx) ? "bg-[#a435f0] border-[#d38cff] text-white scale-110 shadow-lg shadow-[#a435f0]/30" :
                "bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              } transition-all duration-300`}
            >
              {val}
            </div>
          ))}
        </div>

        <div className="overflow-auto flex justify-center py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 relative min-h-[350px]">
          <svg width="800" height="300" viewBox="0 0 800 300" className="max-w-full h-auto drop-shadow-sm">
            {/* Edges */}
            {array.map((_, i) => {
              const left = 2 * i + 1;
              const right = 2 * i + 2;
              const edges = [];
              if (left < array.length) {
                edges.push(
                  <line 
                    key={`${i}-${left}`}
                    x1={positions[i].x} y1={positions[i].y + 20}
                    x2={positions[left].x} y2={positions[left].y - 20}
                    stroke={(sortedIndices.includes(left) || sortedIndices.includes(i)) ? "#cbd5e1" : "currentColor"}
                    strokeWidth="2"
                    className={`transition-all duration-500 ${(sortedIndices.includes(left) || sortedIndices.includes(i)) ? 'dark:stroke-gray-800' : 'stroke-gray-400 dark:stroke-gray-600'}`}
                  />
                );
              }
              if (right < array.length) {
                edges.push(
                  <line 
                    key={`${i}-${right}`}
                    x1={positions[i].x} y1={positions[i].y + 20}
                    x2={positions[right].x} y2={positions[right].y - 20}
                    stroke={(sortedIndices.includes(right) || sortedIndices.includes(i)) ? "#cbd5e1" : "currentColor"}
                    strokeWidth="2"
                    className={`transition-all duration-500 ${(sortedIndices.includes(right) || sortedIndices.includes(i)) ? 'dark:stroke-gray-800' : 'stroke-gray-400 dark:stroke-gray-600'}`}
                  />
                );
              }
              return edges;
            })}

            {/* Nodes */}
            {array.map((val, i) => {
              const isSorted = sortedIndices.includes(i);
              return (
                <g key={i} className={`transition-all duration-500 ${isSorted ? "opacity-60" : ""}`}>
                  {activeIndices.includes(i) && <circle cx={positions[i].x} cy={positions[i].y} r="32" fill="none" className="stroke-purple-300 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow opacity-80" />}
                  <circle 
                    cx={positions[i].x} cy={positions[i].y} r="24" 
                    fill={getNodeColor(i)} 
                    stroke={getStrokeColor(i)} 
                    strokeWidth="2.5" 
                    className="shadow-sm transition-all duration-500" 
                  />
                  <text x={positions[i].x} y={positions[i].y + 5} textAnchor="middle" fill={getTextColor(i)} fontSize="14" fontWeight="bold">{val}</text>
                  <text x={positions[i].x + 35} y={positions[i].y + 5} className="fill-gray-500 dark:fill-gray-400" fontSize="12">[{i}]</text>
                </g>
              );
            })}
          </svg>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

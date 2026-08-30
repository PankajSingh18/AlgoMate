"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw
} from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { buildBIT, updateGenerator, queryGenerator } from "@/features/algorithms/tree/fenwickTreeLogic";

const DEFAULT_ARRAY = [0, 5, 3, 7, 2, 6, 4, 8, 1]; // 1-indexed, index 0 unused

export default function FenwickAnimation() {
  const [baseArray, setBaseArray] = useState([...DEFAULT_ARRAY]);
  const [bit, setBit] = useState(() => buildBIT(DEFAULT_ARRAY));
  const [inputIndex, setInputIndex] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [queryL, setQueryL] = useState("");
  const [queryR, setQueryR] = useState("");
  const [mode, setMode] = useState("update"); // "update" | "query"
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);
  const [message, setMessage] = useState("Enter an index & value to perform a point update, or query a range prefix sum.");
  const [highlightedBIT, setHighlightedBIT] = useState({}); // {index: state}
  const [highlightedBase, setHighlightedBase] = useState({});
  const [resultBox, setResultBox] = useState(null);

  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setBaseArray([...DEFAULT_ARRAY]);
    setBit(buildBIT(DEFAULT_ARRAY));
    setInputIndex("");
    setInputValue("");
    setQueryL("");
    setQueryR("");
    setMode("update");
    setSteps([]);
    setCurrentStepIdx(-1);
    setIsAnimating(false);
    setMessage("...");
    setHighlightedBIT({});
    setHighlightedBase({});
    setResultBox(null);
  });
  const n = baseArray.length - 1;


  // Apply current step's highlight state
  useEffect(() => {
    if (currentStepIdx < 0 || currentStepIdx >= steps.length) return;
    const step = steps[currentStepIdx];
    setHighlightedBIT(step.highlightedBIT || {});
    setHighlightedBase(step.highlightedBase || {});
    setMessage(step.explanation || "");
    if (step.result !== undefined) setResultBox(step.result);
  }, [currentStepIdx, steps]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;
    if (currentStepIdx >= steps.length - 1) {
      setIsAnimating(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setCurrentStepIdx(prev => prev + 1);
    }, 1600 / speed);
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
    setHighlightedBIT({});
    setHighlightedBase({});
    setResultBox(null);
    setMessage("Playback reset. Click play to begin.");
  };

  const handleReset = () => {
    setIsAnimating(false);
    setBaseArray([...DEFAULT_ARRAY]);
    setBit(buildBIT(DEFAULT_ARRAY));
    setSteps([]);
    setCurrentStepIdx(-1);
    setHighlightedBIT({});
    setHighlightedBase({});
    setResultBox(null);
    setInputIndex(""); setInputValue(""); setQueryL(""); setQueryR("");
    setMessage("Tree reset to default. Enter values to start a new operation.");
  };

  // === POINT UPDATE ===
  const triggerUpdate = () => {
    const idx = parseInt(inputIndex);
    const delta = parseInt(inputValue);
    
    setIsAnimating(false);
    setResultBox(null);

    const gen = updateGenerator(idx, delta, baseArray, bit, n);
    const newSteps = [];
    
    for (const step of gen) {
      if (step.type === 'error') {
        setMessage(step.message);
        return;
      }
      newSteps.push(step);
      if (step.type === 'complete') {
        setBaseArray(step.newBase);
        setBit(step.newBit);
      }
    }

    setInputIndex(""); setInputValue("");
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // === PREFIX SUM QUERY ===
  const triggerQuery = () => {
    const l = parseInt(queryL);
    const r = parseInt(queryR);
    
    setIsAnimating(false);
    setResultBox(null);

    const gen = queryGenerator(l, r, bit, n);
    const newSteps = [];
    
    for (const step of gen) {
      if (step.type === 'error') {
        setMessage(step.message);
        return;
      }
      newSteps.push(step);
    }

    setQueryL(""); setQueryR("");
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

  // Color helpers
  const getBITColor = (i) => {
    const state = highlightedBIT[i];
    if (state === "active") return { fill: "#10b981", stroke: "#34d399", text: "#fff" };
    if (state === "visiting") return { fill: "#a435f0", stroke: "#d38cff", text: "#fff" };
    if (state === "matched") return { fill: "#f59e0b", stroke: "#fbbf24", text: "#1a1a1a" };
    return { fill: "var(--background)", stroke: "#64748b", text: "var(--foreground)" };
  };

  const getBaseColor = (i) => {
    const state = highlightedBase[i];
    if (state === "active") return "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (state === "visiting") return "border-[#a435f0] bg-[#a435f0]/10 text-[#a435f0] dark:text-[#d38cff]";
    if (state === "matched") return "border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
    return "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  const cellW = 72;
  const svgPaddingX = 30;
  const svgWidth = n * cellW + svgPaddingX * 2 + 20;

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-xl w-fit dark:bg-gray-800">
          <button
            onClick={() => { setMode("update"); resetPlayback(); }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === "update" ? "bg-[#a435f0] text-white shadow-md" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`}
          >
            Point Update
          </button>
          <button
            onClick={() => { setMode("query"); resetPlayback(); }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === "query" ? "bg-[#a435f0] text-white shadow-md" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`}
          >
            Range Query
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col sm:flex-row gap-2">
            {mode === "update" ? (
              <>
                <input
                  type="number"
                  value={inputIndex}
                  onChange={(e) => setInputIndex(e.target.value)}
                  placeholder={`Index (1-${n})`}
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700"
                  disabled={isAnimating}
                />
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Delta (e.g. +3)"
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700"
                  disabled={isAnimating}
                  onKeyDown={(e) => e.key === "Enter" && triggerUpdate()}
                />
                <button
                  onClick={triggerUpdate}
                  disabled={isAnimating}
                  className="rounded-lg bg-[#a435f0] px-4 py-2 text-white transition-colors hover:bg-[#8f2cd6] disabled:opacity-50"
                >
                  Update
                </button>
              </>
            ) : (
              <>
                <input
                  type="number"
                  value={queryL}
                  onChange={(e) => setQueryL(e.target.value)}
                  placeholder={`L (1-${n})`}
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700"
                  disabled={isAnimating}
                />
                <input
                  type="number"
                  value={queryR}
                  onChange={(e) => setQueryR(e.target.value)}
                  placeholder={`R (1-${n})`}
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700"
                  disabled={isAnimating}
                  onKeyDown={(e) => e.key === "Enter" && triggerQuery()}
                />
                <button
                  onClick={triggerQuery}
                  disabled={isAnimating}
                  className="rounded-lg bg-[#a435f0] px-4 py-2 text-white transition-colors hover:bg-[#8f2cd6] disabled:opacity-50"
                >
                  Query Sum
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
          message.includes("complete") || message.includes("✅")
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : message.includes("⚠️") || message.includes("error")
              ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              : isAnimating
                ? "border-[#a435f0]/30 bg-[#a435f0]/10 dark:border-[#a435f0]/50 dark:bg-[#a435f0]/20"
                : ""
        }
      >
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>Step Explanation</span>
          <span className="font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-medium text-lg min-h-[28px]">{message}</p>
          {resultBox && (
            <span className="ml-auto shrink-0 bg-emerald-100 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-xl text-sm font-bold dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-400">
              {resultBox}
            </span>
          )}
        </div>
      </VisualizerCard>

      <VisualizerCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Fenwick Tree (BIT) Visualization</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { color: "bg-[#a435f0]", label: "Visiting" },
              { color: "bg-emerald-500", label: "Processing" },
              { color: "bg-amber-500", label: "Matched" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 overflow-auto items-center py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 min-h-[420px] relative">
          
          {/* Source Array Display */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Source Array (1-indexed)</span>
            <div className="flex gap-1.5">
              {baseArray.slice(1).map((val, i) => {
                const idx = i + 1;
                return (
                  <div key={idx} className="flex flex-col items-center gap-0.5">
                    <div className={`w-14 h-10 flex items-center justify-center border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getBaseColor(idx)}`}>
                      {val}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">[{idx}]</span>
                    <span className="text-[9px] text-gray-400 font-mono">{idx.toString(2).padStart(4, '0')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BIT Array Display as bars + labeled cells */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">BIT Array — Implicit Fenwick Structure</span>
            <div className="overflow-auto">
              <svg width={svgWidth} height={220} viewBox={`0 0 ${svgWidth} 220`} className="max-w-full h-auto">
                {bit.slice(1).map((val, i) => {
                  const idx = i + 1;
                  const lsb = idx & -idx;
                  const barMaxH = 100;
                  const barH = Math.max(12, Math.min(barMaxH, (val / Math.max(...bit.slice(1))) * barMaxH));
                  const x = svgPaddingX + i * cellW;
                  const y = 130 - barH;
                  const colors = getBITColor(idx);

                  let fillStyle = colors.fill;
                  if (fillStyle === "var(--background)") {
                    fillStyle = "currentColor";
                  }

                  return (
                    <g key={idx}>
                      {/* Bar */}
                      <rect
                        x={x + 8}
                        y={y}
                        width={cellW - 16}
                        height={barH}
                        rx="4"
                        fill={fillStyle}
                        stroke={colors.stroke}
                        strokeWidth="1.5"
                        className={`transition-all duration-300 ${colors.fill === 'var(--background)' ? 'fill-white dark:fill-gray-900' : ''}`}
                      />
                      {/* Value inside bar */}
                      <text 
                        x={x + cellW / 2} y={y + barH / 2 + 4} 
                        textAnchor="middle" 
                        fill={colors.text} 
                        fontSize="11" 
                        fontWeight="bold"
                        className={colors.text === 'var(--foreground)' ? 'fill-gray-900 dark:fill-gray-100' : ''}
                      >
                        {val}
                      </text>
                      {/* Index label */}
                      <text x={x + cellW / 2} y="153" textAnchor="middle" className="fill-slate-400 dark:fill-slate-400" fontSize="11" fontWeight="bold">[{idx}]</text>
                      {/* Binary label */}
                      <text x={x + cellW / 2} y="170" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8.5">{idx.toString(2).padStart(4, '0')}</text>
                      {/* LSB label */}
                      <text x={x + cellW / 2} y="185" textAnchor="middle" className="fill-purple-600 dark:fill-purple-500" fontSize="8.5" fontWeight="bold">LSB:{lsb}</text>
                      {/* Range covered */}
                      <text x={x + cellW / 2} y="200" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="7.5">[{idx - lsb + 1}..{idx}]</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
          
          {/* LSB formula reminder */}
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono shadow-sm">
            <span className="text-[#a435f0] font-bold">LSB(i)</span>
            <span className="text-gray-600 dark:text-gray-400"> = i & (-i)</span>
          </div>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

import { generateFactorialFrames } from "@/features/algorithms/recursion/factorialLogic";

const codeLines = [
  { line: 1, code: "function fact(n) {" },
  { line: 2, code: "  if (n <= 1) {" },
  { line: 3, code: "    return 1;" },
  { line: 4, code: "  } else {" },
  { line: 5, code: "    return n * fact(n - 1);" },
  { line: 6, code: "  }" },
  { line: 7, code: "}" },
];

export default function FactorialAnimation() {
  const [nVal, setNVal] = useState("5");
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const frames = useMemo(() => {
    if (!isVisualizing) return [];
    const n = parseInt(nVal, 10);
    if (isNaN(n) || n < 0 || n > 12) return [];
    return Array.from(generateFactorialFrames(n));
  }, [nVal, isVisualizing]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  useVisualizerReset(() => {
    setNVal("5");
    setIsVisualizing(false);
    setErrorMsg("");
    engine.reset();
  });

  const handleGo = (e) => {
    e.preventDefault();
    const n = parseInt(nVal, 10);
    if (isNaN(n) || n < 0) {
      setErrorMsg("Please enter a valid positive integer.");
      return;
    }
    if (n > 12) {
      setErrorMsg("Please enter a number <= 12 to prevent excessive recursion.");
      return;
    }
    setErrorMsg("");
    setIsVisualizing(true);
    engine.reset();
    engine.play();
  };

  const handleReset = () => {
    setIsVisualizing(false);
    setErrorMsg("");
    engine.reset();
  };

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      engine.reset();
      engine.play();
    } else if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
  };

  useVisualizerKeyboard({
    onStart: togglePlay,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: handleReset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const activeFrameData = frames.length > 0 && engine.currentStep >= 0 
    ? frames[engine.currentStep] 
    : {
        stack: [],
        activeLine: 0,
        description: "Click Visualize Go! to watch the recursion unfold.",
      };

  const activeStack = activeFrameData.stack || [];
  const activeLine = activeFrameData.activeLine;

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    base_case: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200",
    waiting: "bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-200 opacity-60",
    calculating: "bg-[#fae8ff] dark:bg-purple-950/30 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    returning: "bg-gray-150 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-700 text-zinc-850 dark:text-zinc-300",
  };

  return (
    <main className="container mx-auto">
      {/* Configuration Header */}
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="grid gap-4 sm:grid-cols-12 items-end">
          <div className="sm:col-span-9">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="nInput">
              Factorial (n!) - Enter n (Max 12)
            </label>
            <input
              type="number"
              id="nInput"
              value={nVal}
              onChange={(e) => {
                setNVal(e.target.value);
                handleReset();
              }}
              min="0"
              max="12"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition duration-300"
              placeholder="e.g. 5"
              disabled={isVisualizing}
            />
          </div>

          <div className="sm:col-span-3 flex gap-2 justify-end">
            <GoButton onClick={handleGo} isAnimating={isVisualizing} disabled={isVisualizing} />
            <ResetButton onReset={handleReset} isAnimating={isVisualizing} />
          </div>
        </div>

        {errorMsg && <p className="text-red-500 dark:text-red-400 text-xs font-semibold mt-2">{errorMsg}</p>}

        {isVisualizing && frames.length > 0 && (
          <div className="mt-4">
            <PlaybackControls
              isPlaying={engine.isPlaying}
              onPlayPause={togglePlay}
              speed={engine.speed / 1000}
              onSpeedChange={(s) => engine.setSpeed(s * 1000)}
              onStepForward={engine.stepForward}
              onStepBackward={engine.stepBackward}
              onReset={() => { engine.reset(); }}
              progressText={`${engine.currentStep + 1} / ${frames.length || 1}`}
              disabled={frames.length === 0}
            />
          </div>
        )}
      </form>

      {/* Narrative Explanation Block */}
      <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl border border-teal-100 bg-teal-50/40 dark:border-teal-900/30 dark:bg-teal-950/10 text-teal-800 dark:text-teal-200">
        <p className="text-center font-medium text-sm leading-relaxed">
          {activeFrameData.description}
        </p>
      </div>

      {/* Visual Workspace Grid */}
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-12 mb-8">
        {/* Left Side: Call Stack */}
        <div className="md:col-span-6 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Active Call Stack
          </h3>
          {activeStack.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Call Stack is Empty</p>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-2 items-center justify-end h-[400px] overflow-y-auto p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/20">
              {activeStack.map((frame, index) => {
                const isTop = index === activeStack.length - 1;
                const statusClass = stackColors[frame.status] || stackColors.returning;

                return (
                  <div
                    key={frame.id}
                    className={`w-full max-w-[340px] p-3 rounded-lg border flex flex-col transition-all duration-300 ${statusClass} ${
                      isTop ? "ring-2 ring-[#a435f0] ring-offset-2 dark:ring-offset-zinc-950 font-semibold shadow-md" : "scale-[0.98]"
                    }`}
                  >
                    <div className="flex justify-between w-full font-mono text-xs mb-1">
                      <span>fact({frame.n})</span>
                      <span className="capitalize text-[10px] tracking-wide font-bold">{frame.status.replace("_", " ")}</span>
                    </div>
                    {frame.subResult !== undefined && (
                       <div className="text-[10px] mt-1 border-t border-black/10 pt-1">
                           subResult = {frame.subResult}
                       </div>
                    )}
                    {frame.retVal !== null && (
                       <div className="text-xs font-bold mt-1 border-t border-black/10 pt-1">
                           Returns: {frame.retVal}
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Code Block Trace */}
        <div className="md:col-span-6 flex flex-col">
          <div className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 font-mono text-xs shadow-inner h-full flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="text-zinc-400 font-semibold">Active Code Trace</span>
            </div>
            <div className="p-4 text-zinc-300 leading-relaxed flex-1">
              {codeLines.map((ln) => {
                // Line 5 mapping because logic returns line 4 but we want line 5 for return n*fact(n-1)
                const isActive = (ln.line === activeLine) || (ln.line === 5 && activeLine === 4);
                return (
                  <div
                    key={ln.line}
                    className={`flex gap-4 px-2 py-1 rounded transition-colors duration-200 ${
                      isActive ? "bg-[#a435f0]/20 border-l-4 border-[#a435f0] text-white font-bold" : "border-l-4 border-transparent"
                    }`}
                  >
                    <span className="text-zinc-600 select-none w-4 text-right">{ln.line}</span>
                    <span className="whitespace-pre">{ln.code}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

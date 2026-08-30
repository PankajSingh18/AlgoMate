"use client";

import React, { useState, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

// Helper to generate the execution states step-by-step
import { generateHanoiFrames } from "@/features/algorithms/recursion/hanoiLogic";
const codeLinesByLanguage = {
  javascript: [
    { line: 1, code: "function hanoi(n, src, dest, aux) {" },
    { line: 2, code: "  if (n === 1) {" },
    { line: 3, code: "    moveDisk(1, src, dest);" },
    { line: 4, code: "    return;" },
    { line: 5, code: "  }" },
    { line: 6, code: "  hanoi(n - 1, src, aux, dest);" },
    { line: 7, code: "  moveDisk(n, src, dest);" },
    { line: 8, code: "  hanoi(n - 1, aux, dest, src);" },
    { line: 9, code: "}" }
  ],
  python: [
    { line: 1, code: "def hanoi(n, src, dest, aux):" },
    { line: 2, code: "    if n == 1:" },
    { line: 3, code: "        move_disk(1, src, dest)" },
    { line: 4, code: "        return" },
    { line: 5, code: "    hanoi(n - 1, src, aux, dest)" },
    { line: 6, code: "    move_disk(n, src, dest)" },
    { line: 7, code: "    hanoi(n - 1, aux, dest, src)" }
  ],
  java: [
    { line: 1, code: "void solveHanoi(int n, char src, char dest, char aux) {" },
    { line: 2, code: "    if (n == 1) {" },
    { line: 3, code: "        moveDisk(1, src, dest);" },
    { line: 4, code: "        return;" },
    { line: 5, code: "    }" },
    { line: 6, code: "    solveHanoi(n - 1, src, aux, dest);" },
    { line: 7, code: "    moveDisk(n, src, dest);" },
    { line: 8, code: "    solveHanoi(n - 1, aux, dest, src);" },
    { line: 9, code: "}" }
  ],
  cpp: [
    { line: 1, code: "void solveHanoi(int n, char src, char dest, char aux) {" },
    { line: 2, code: "    if (n == 1) {" },
    { line: 3, code: "        moveDisk(1, src, dest);" },
    { line: 4, code: "        return;" },
    { line: 5, code: "    }" },
    { line: 6, code: "    solveHanoi(n - 1, src, aux, dest);" },
    { line: 7, code: "    moveDisk(n, src, dest);" },
    { line: 8, code: "    solveHanoi(n - 1, aux, dest, src);" },
    { line: 9, code: "}" }
  ]
};

const lineHighlightMap = {
  javascript: { entry: 1, check: 2, move1: 3, ret1: 4, recurse1: 6, moveN: 7, recurse2: 8 },
  python:     { entry: 1, check: 2, move1: 3, ret1: 4, recurse1: 5, moveN: 6, recurse2: 7 },
  java:       { entry: 1, check: 2, move1: 3, ret1: 4, recurse1: 6, moveN: 7, recurse2: 8 },
  cpp:        { entry: 1, check: 2, move1: 3, ret1: 4, recurse1: 6, moveN: 7, recurse2: 8 }
};

const HanoiAnimation = () => {
  const [nVal, setNVal] = useState("3");
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");

  const frames = useMemo(() => {
    if (!isVisualizing) return [];
    const n = parseInt(nVal, 10);
    if (isNaN(n) || n < 1) return [];
    return Array.from(generateHanoiFrames(n));
  }, [nVal, isVisualizing]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  useVisualizerReset(() => {
    setNVal("3");
    setIsVisualizing(false);
    setErrorMsg("");
    setSelectedLang("javascript");
    engine.reset();
  });

  const handleGo = (e) => {
    e.preventDefault();
    const n = parseInt(nVal, 10);
    if (isNaN(n) || n < 1) {
      setErrorMsg("Please enter an integer >= 1.");
      return;
    }
    if (n > 5) {
      setErrorMsg("Please select N <= 5 to keep the visualization clear and fit for the screen.");
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
        pegs: { A: Array.from({ length: parseInt(nVal, 10) || 3 }, (_, i) => (parseInt(nVal, 10) || 3) - i), B: [], C: [] },
        activeLine: "none",
        description: "Enter N (between 1 and 5) and click Visualize Go!",
        movingDisk: null
      };

  const activeStack = activeFrameData.stack || [];
  const activePegs = activeFrameData.pegs || { A: [], B: [], C: [] };
  const logicalLine = activeFrameData.activeLine;
  const activeLine = lineHighlightMap[selectedLang]?.[logicalLine] || 0;

  const stackColors = {
    calling: "bg-[#e0f2fe] dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-200",
    checking_base: "bg-[#fef3c7] dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200",
    base_case: "bg-[#dcfce7] dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    waiting_1: "bg-[#fae8ff] dark:bg-purple-950/30 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    moving: "bg-[#ffedd5] dark:bg-orange-950/40 border-orange-400 dark:border-orange-700 text-orange-800 dark:text-orange-200",
    waiting_2: "bg-[#f5e0ff] dark:bg-fuchsia-950/30 border-fuchsia-400 dark:border-fuchsia-800 text-fuchsia-700 dark:text-fuchsia-300",
    returning: "bg-[#fee2e2] dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    waiting: "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400",
  };

  return (
    <main className="container mx-auto">
      {/* Configuration Header */}
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="nVal">
              Number of Disks (N)
            </label>
            <input
              type="number"
              id="nVal"
              min="1"
              max="5"
              value={nVal}
              onChange={(e) => {
                setNVal(e.target.value);
                handleReset();
              }}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 transition duration-300 font-semibold"
              placeholder="e.g. 3"
              disabled={isVisualizing}
            />
          </div>

          <div className="flex gap-2">
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
      <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl border border-teal-100 bg-teal-50/40 dark:border-teal-900/30 dark:bg-teal-950/10 text-teal-800 dark:text-teal-200 shadow-sm">
        <p className="text-center font-medium text-sm leading-relaxed">
          {activeFrameData.description}
        </p>
      </div>

      {/* Pegs Animation Workspace */}
      <div className="max-w-4xl mx-auto mb-8 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow flex flex-col items-center">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
          Peg State Representation
        </h3>
        
        <svg viewBox="0 0 600 240" className="w-full max-w-[600px] h-[240px] drop-shadow-sm">
          {/* Definitions for gorgeous disk gradients */}
          <defs>
            <linearGradient id="grad-disk-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <linearGradient id="grad-disk-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="grad-disk-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="grad-disk-4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="grad-disk-5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>

          {/* Peg posts and labels */}
          {[
            { id: "A", name: "Source (A)", x: 100 },
            { id: "B", name: "Auxiliary (B)", x: 300 },
            { id: "C", name: "Destination (C)", x: 500 }
          ].map((peg) => (
            <g key={peg.id}>
              {/* Peg Base */}
              <line
                x1={peg.x - 70}
                y1={210}
                x2={peg.x + 70}
                y2={210}
                stroke="#6b7280"
                strokeWidth="8"
                strokeLinecap="round"
                className="opacity-80 dark:opacity-60"
              />
              {/* Peg Shaft */}
              <line
                x1={peg.x}
                y1={60}
                x2={peg.x}
                y2={210}
                stroke="#9ca3af"
                strokeWidth="10"
                strokeLinecap="round"
                className="opacity-70 dark:opacity-50"
              />
              {/* Peg Title text */}
              <text
                x={peg.x}
                y={232}
                textAnchor="middle"
                className="text-[11px] font-bold fill-gray-500 dark:fill-zinc-400 select-none tracking-wide"
              >
                {peg.name}
              </text>
            </g>
          ))}

          {/* Disks rendering */}
          {Object.entries(activePegs).map(([pegKey, diskList]) => {
            const pegXMap = { A: 100, B: 300, C: 500 };
            const pegX = pegXMap[pegKey];

            return diskList.map((diskVal, index) => {
              const diskW = 45 + diskVal * 20; // Disk width
              const diskH = 18; // Disk height
              // Y calculations: base is at 210, stack starts just above base
              const diskY = 210 - (index + 1) * diskH - index * 2;
              const diskX = pegX - diskW / 2;

              // Determine if this disk is currently active/moving
              const isMoving = activeFrameData.movingDisk === diskVal && activeFrameData.fromPeg === pegKey;
              const targetPegX = activeFrameData.toPeg ? pegXMap[activeFrameData.toPeg] : null;

              return (
                <g key={`disk-${diskVal}`} className="transition-all duration-500 ease-out">
                  <rect
                    x={diskX}
                    y={diskY}
                    width={diskW}
                    height={diskH}
                    rx="6"
                    ry="6"
                    fill={`url(#grad-disk-${diskVal})`}
                    className={`transition-all duration-300 ${
                      isMoving ? "stroke-white dark:stroke-zinc-100 stroke-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] animate-bounce" : ""
                    }`}
                  />
                  <text
                    x={pegX}
                    y={diskY + 12}
                    textAnchor="middle"
                    className="text-[9px] font-black fill-white select-none pointer-events-none drop-shadow"
                  >
                    {diskVal}
                  </text>
                  {/* Arrow helper for movement */}
                  {isMoving && targetPegX !== null && (
                    <path
                      d={`M ${pegX} ${diskY - 15} Q ${(pegX + targetPegX) / 2} ${diskY - 45} ${targetPegX} ${diskY - 15}`}
                      fill="none"
                      stroke="#a435f0"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      className="animate-[dash_1s_linear_infinite]"
                    />
                  )}
                </g>
              );
            });
          })}
        </svg>
      </div>

      {/* Visual Workspace: Call Stack & Code Trace */}
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-12 mb-8">
        
        {/* Left Side: Call Stack */}
        <div className="md:col-span-5 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Active Call Stack
          </h3>
          {activeStack.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow h-80 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Call Stack is Empty</p>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-2 items-center justify-end h-80 overflow-y-auto p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/20">
              {activeStack.map((frame, index) => {
                const isTop = index === activeStack.length - 1;
                const statusClass = stackColors[frame.status] || stackColors.waiting;

                return (
                  <div
                    key={frame.id}
                    className={`w-full max-w-[280px] p-3 rounded-lg border flex flex-col items-center transition-all duration-300 ${statusClass} ${
                      isTop ? "ring-2 ring-[#a435f0] dark:ring-[#a435f0] ring-offset-2 dark:ring-offset-zinc-950 shadow-md" : "scale-[0.98]"
                    }`}
                  >
                    <div className="flex justify-between w-full font-mono text-[10px] font-bold">
                      <span>hanoi(n={frame.n})</span>
                      <span className="capitalize text-[9px]">{frame.status.replace("_", " ")}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-mono w-full flex justify-between border-t border-black/5 dark:border-white/5 pt-1.5 opacity-90">
                      <span>src: {frame.src}</span>
                      <span>dest: {frame.dest}</span>
                      <span>aux: {frame.aux}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Code Block Trace */}
        <div className="md:col-span-7 flex flex-col">
          <div className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 font-mono text-xs shadow-inner flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-semibold">Active Code Trace</span>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-zinc-800 text-zinc-200 text-[11px] px-2 py-0.5 rounded border border-zinc-700 outline-none cursor-pointer hover:bg-zinc-700 focus:ring-1 focus:ring-[#a435f0]/50"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
            </div>
            <div className="p-4 text-zinc-300 leading-relaxed overflow-y-auto flex-grow max-h-[320px]">
              {(codeLinesByLanguage[selectedLang] || []).map((ln) => {
                const isActive = ln.line === activeLine;
                return (
                  <div
                    key={ln.line}
                    className={`flex gap-4 px-2 py-0.5 rounded transition-colors duration-200 ${
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
};

export default HanoiAnimation;

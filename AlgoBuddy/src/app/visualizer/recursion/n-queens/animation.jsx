"use client";

import React, { useState, useMemo } from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

import { generateNQueensFrames } from "@/features/algorithms/recursion/nQueensLogic";

const codeLines = [
  { line: 1, code: "function solve(col) {" },
  { line: 2, code: "  if (col >= N) {" },
  { line: 3, code: "    saveSolution(); return;" },
  { line: 4, code: "  }" },
  { line: 5, code: "  for (let row = 0; row < N; row++) {" },
  { line: 6, code: "    if (isSafe(row, col)) {" },
  { line: 7, code: "      board[col] = row;" },
  { line: 8, code: "      solve(col + 1);" },
  { line: 9, code: "      board[col] = -1; // backtrack" },
  { line: 10, code: "    }" },
  { line: 11, code: "  }" },
  { line: 12, code: "}" },
];

const NQueensAnimation = () => {
  const [isVisualizing, setIsVisualizing] = useState(false);

  const frames = useMemo(() => {
    if (!isVisualizing) return [];
    return Array.from(generateNQueensFrames());
  }, [isVisualizing]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  useVisualizerReset(() => {
    setIsVisualizing(false);
    engine.reset();
  });

  const handleGo = (e) => {
    e.preventDefault();
    setIsVisualizing(true);
    engine.reset();
    engine.play();
  };

  const handleReset = () => {
    setIsVisualizing(false);
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
        board: [-1, -1, -1, -1],
        solutions: [],
        activeCell: null,
        conflictCell: null,
        activeLine: 0,
        description: "Click Visualize Go to see the N-Queens backtracking process!",
      };

  const activeStack = activeFrameData.stack || [];
  const activeLine = activeFrameData.activeLine;
  const board = activeFrameData.board || [-1, -1, -1, -1];
  const activeCell = activeFrameData.activeCell;
  const conflictCell = activeFrameData.conflictCell;
  const solutions = activeFrameData.solutions || [];

  return (
    <main className="container mx-auto">
      {/* Configuration Header */}
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-700 dark:text-gray-300 font-medium text-lg">
            N-Queens Backtracking Visualizer (4x4 Chessboard)
          </div>

          <div className="flex gap-2">
            <GoButton onClick={handleGo} isAnimating={isVisualizing} disabled={isVisualizing} />
            <ResetButton onReset={handleReset} isAnimating={isVisualizing} />
          </div>
        </div>

        {isVisualizing && frames.length > 0 && (
          <div className="mt-6">
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

      {/* Visual Workspace */}
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-12 mb-8">
        {/* Call Stack */}
        <div className="md:col-span-3 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Recursion Stack
          </h3>
          {activeStack.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
              <p className="text-gray-400 dark:text-zinc-500 text-sm">Empty</p>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-2 items-center justify-end h-72 overflow-y-auto p-3 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/20">
              {activeStack.map((frame, index) => {
                const isTop = index === activeStack.length - 1;
                return (
                  <div
                    key={frame.id}
                    className={`w-full p-2.5 rounded-lg border flex flex-col items-center font-mono text-[10px] font-semibold transition-all duration-300 ${
                      isTop
                        ? "bg-sky-100 dark:bg-sky-950/40 border-sky-400 text-sky-800 dark:text-sky-200 ring-2 ring-[#0d9488]"
                        : "bg-gray-100 dark:bg-zinc-800 border-gray-300 text-gray-500 dark:text-zinc-400"
                    }`}
                  >
                    solve(col = {frame.col})
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chessboard visualization */}
        <div className="md:col-span-6 rounded-xl bg-white dark:bg-[#1a1a1a] p-5 shadow border border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-4 uppercase tracking-wider text-center">
            Chessboard
          </h3>
          <div className="grid grid-cols-4 gap-1 p-2 bg-amber-900/80 rounded-xl border border-amber-950 shadow-lg">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex gap-1">
                {[0, 1, 2, 3].map((col) => {
                  const hasQueen = board[col] === row;
                  const isCellActive = activeCell?.row === row && activeCell?.col === col;
                  const isConflict = conflictCell?.row === row && conflictCell?.col === col;
                  const isLightSquare = (row + col) % 2 === 0;

                  let cellColor = isLightSquare ? "bg-amber-100 dark:bg-amber-200" : "bg-amber-700 dark:bg-amber-800";
                  let borderStyle = "border-transparent";

                  if (isCellActive) {
                    borderStyle = "border-teal-500 dark:border-teal-400 scale-105 shadow-md border-2 z-10";
                    cellColor = "bg-teal-100 dark:bg-teal-950";
                  }
                  if (hasQueen) {
                    cellColor = isConflict ? "bg-red-200 dark:bg-red-950/60" : "bg-emerald-100 dark:bg-emerald-950/60";
                  }

                  return (
                    <div
                      key={col}
                      className={`relative w-14 h-14 rounded-lg flex items-center justify-center border-2 transition-all duration-300 font-bold ${cellColor} ${borderStyle}`}
                    >
                      {hasQueen ? (
                        <span
                          className={`text-2xl transition-all duration-300 ${
                            isConflict ? "text-red-600 dark:text-red-400 animate-bounce" : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          👑
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400/40 select-none">
                          {row},{col}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Solutions & Code Trace */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-zinc-950 p-4 font-mono text-[10px] text-emerald-400 min-h-36 shadow-inner flex flex-col">
            <span className="text-zinc-500 font-semibold mb-2 uppercase tracking-wider text-center block text-[9px]">
              Solutions Found
            </span>
            <div className="flex-1 overflow-y-auto max-h-32 flex flex-col gap-2 justify-center items-center">
              {solutions.length === 0 ? (
                <span className="text-zinc-600 text-xs">No solutions yet</span>
              ) : (
                solutions.map((sol, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded p-1 text-center w-full animate-fade-in">
                    Sol #{idx + 1}: [{sol.join(", ")}]
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 font-mono text-[9px] shadow-inner">
            <div className="p-3 text-zinc-300 leading-relaxed">
              {codeLines.map((ln) => {
                const isActive = ln.line === activeLine;
                return (
                  <div
                    key={ln.line}
                    className={`flex gap-3 px-1 py-0.5 rounded transition-colors duration-200 ${
                      isActive ? "bg-[#0d9488]/20 border-l-3 border-[#0d9488] text-white font-bold" : "border-l-3 border-transparent"
                    }`}
                  >
                    <span className="text-zinc-600 select-none w-3 text-right">{ln.line}</span>
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

export default NQueensAnimation;

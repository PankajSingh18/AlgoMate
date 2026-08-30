"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Play, Pause, PenLine, Target, ShieldAlert, Trash2 } from "lucide-react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { loadFromStorage, saveToStorage } from "@/utils/storage";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { astarGenerator } from "@/features/algorithms/ai/astarLogic";

const pointKey = (row, col) => `${row},${col}`;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const clampPoint = (point, size) => ({ row: clamp(point.row, 0, size - 1), col: clamp(point.col, 0, size - 1) });

const AStarAnimation = () => {
  const initialSize = loadFromStorage("astar-grid-size", 10);
  const [gridSize, setGridSize] = useState(initialSize);
  const [heuristic, setHeuristic] = useState(() => loadFromStorage("astar-heuristic", "manhattan"));
  const [editMode, setEditMode] = useState("wall");
  const [start, setStart] = useState({ row: 0, col: 0 });
  const [goal, setGoal] = useState({ row: initialSize - 1, col: initialSize - 1 });
  const [walls, setWalls] = useState(() => new Set());
  
  const [frames, setFrames] = useState([]);

  useEffect(() => saveToStorage("astar-grid-size", gridSize), [gridSize]);
  useEffect(() => saveToStorage("astar-heuristic", heuristic), [heuristic]);

  useEffect(() => {
    setStart((current) => clampPoint(current, gridSize));
    setGoal((current) => {
      const clamped = clampPoint(current, gridSize);
      if (clamped.row === 0 && clamped.col === 0 && gridSize > 1) {
        return { row: gridSize - 1, col: gridSize - 1 };
      }
      return clamped;
    });
    setWalls((current) => {
      const next = new Set();
      current.forEach((cell) => {
        const [row, col] = cell.split(",").map(Number);
        if (row < gridSize && col < gridSize) next.add(cell);
      });
      return next;
    });
  }, [gridSize]);

  const resetBoard = useCallback(() => {
    setFrames([]);
    setStart({ row: 0, col: 0 });
    setGoal({ row: gridSize - 1, col: gridSize - 1 });
    setWalls(new Set());
  }, [gridSize]);

  useVisualizerReset(resetBoard);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const handleGo = useCallback((event) => {
    event.preventDefault();
    if (engine.isPlaying) return;

    const newFrames = Array.from(astarGenerator(start, goal, walls, gridSize, heuristic));
    setFrames(newFrames);
    engine.reset();
    engine.play();
  }, [engine, start, goal, walls, gridSize, heuristic]);

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      engine.reset();
      setTimeout(() => engine.play(), 50);
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
    onReset: () => {
        setFrames([]);
        engine.reset();
    },
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const handleCellClick = useCallback((row, col) => {
    if (engine.isPlaying) return;

    const clickedKey = pointKey(row, col);
    const startKey = pointKey(start.row, start.col);
    const goalKey = pointKey(goal.row, goal.col);

    if (editMode === "wall") {
      if (clickedKey === startKey || clickedKey === goalKey) return;
      setWalls((current) => {
        const next = new Set(current);
        if (next.has(clickedKey)) next.delete(clickedKey);
        else next.add(clickedKey);
        return next;
      });
      return;
    }

    if (editMode === "start") {
      if (clickedKey === goalKey) return;
      setStart({ row, col });
      setWalls((current) => {
        const next = new Set(current);
        next.delete(clickedKey);
        return next;
      });
      return;
    }

    if (clickedKey === startKey) return;
    setGoal({ row, col });
    setWalls((current) => {
      const next = new Set(current);
      next.delete(clickedKey);
      return next;
    });
  }, [editMode, goal.col, goal.row, engine.isPlaying, start.col, start.row]);

  // Derived state for rendering
  const renderedFrame = frames.length > 0 ? frames[engine.currentStep] : {
    open: [pointKey(start.row, start.col)],
    closed: [],
    path: [],
    currentKey: pointKey(start.row, start.col),
    g: 0,
    h: 0, // In original it calculates initial H here, but 0 is fine for idle state
    f: 0,
    goalReached: false,
    message: "Build a maze, choose a heuristic, and press Go.",
    detail: "Choose wall, start, or goal editing mode before running the search."
  };

  const openSet = new Set(renderedFrame.open);
  const closedSet = new Set(renderedFrame.closed);
  const pathSet = new Set(renderedFrame.path);
  const isRunning = engine.isPlaying;
  const isSuccess = renderedFrame.goalReached;
  const isError = renderedFrame.message && renderedFrame.message.startsWith("No path");

  const statusClass =
    isSuccess
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : isError
      ? "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200"
      : isRunning
      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";

  const modeButtons = [
    { id: "wall", label: "Draw Walls", icon: PenLine, className: "bg-primary text-white border-primary" },
    { id: "start", label: "Move Start", icon: Target, className: "bg-emerald-600 text-white border-emerald-600" },
    { id: "goal", label: "Move Goal", icon: ShieldAlert, className: "bg-rose-600 text-white border-rose-600" },
  ];

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-sans mt-6">
        Explore how A* Search blends real path cost with a heuristic estimate to reach the goal efficiently.
      </p>

      <form onSubmit={handleGo} className="max-w-5xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-3 text-sm font-semibold uppercase tracking-wider" htmlFor="gridSize">
              Grid Size: <span className="text-primary font-mono">{gridSize}x{gridSize}</span>
            </label>
            <input
              type="range"
              id="gridSize"
              min="5"
              max="15"
              value={gridSize}
              onChange={(event) => setGridSize(parseInt(event.target.value, 10))}
              disabled={engine.isPlaying}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
              <span>SMALL</span>
              <span>LARGE</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-3 text-sm font-semibold uppercase tracking-wider" htmlFor="heuristic">
              Heuristic: <span className="text-primary font-mono capitalize">{heuristic}</span>
            </label>
            <select
              id="heuristic"
              value={heuristic}
              onChange={(event) => setHeuristic(event.target.value)}
              disabled={engine.isPlaying}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            >
              <option value="manhattan">Manhattan</option>
              <option value="euclidean">Euclidean</option>
              <option value="chebyshev">Chebyshev</option>
            </select>
            <div className="text-[10px] text-gray-400 mt-2 text-right">Choose how aggressively A* estimates the remaining distance</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="flex flex-wrap gap-2">
            {modeButtons.map((button) => {
              const Icon = button.icon;
              const active = editMode === button.id;
              return (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => setEditMode(button.id)}
                  disabled={engine.isPlaying}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${active ? button.className : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"}`}
                >
                  <Icon size={16} />
                  {button.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setWalls(new Set())}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 transition-colors"
              disabled={engine.isPlaying}
            >
              <Trash2 size={16} />
              Clear Walls
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-start xl:justify-end">
            <GoButton onClick={handleGo} isAnimating={engine.isPlaying} disabled={engine.isPlaying} />
            <ResetButton onReset={() => { setFrames([]); resetBoard(); }} isAnimating={engine.isPlaying} />
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
          <PlaybackControls
            isPlaying={engine.isPlaying}
            onPlayPause={togglePlay}
            speed={engine.speed / 1000}
            onSpeedChange={(s) => engine.setSpeed(s * 1000)}
            onStepForward={engine.stepForward}
            onStepBackward={engine.stepBackward}
            onReset={() => { setFrames([]); engine.reset(); }}
            progressText={`${engine.currentStep + 1} / ${frames.length || 1}`}
            disabled={frames.length === 0}
          />
        </div>
      </form>

      {renderedFrame.message && (
        <div className={`max-w-4xl mx-auto mb-8 p-4 rounded-lg ${statusClass} shadow-sm border border-current/10`}>
          <p className="text-center font-medium">{renderedFrame.message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex flex-wrap items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-3 border-b border-[#a435f0]/20">
            <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
            <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">Step Explanation</span>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{engine.isPlaying ? "Search in progress" : "Ready"}</span>
          </div>
          <div className="px-4 py-4">
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-mono">{renderedFrame.detail}</p>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-950 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-[10px] text-gray-500 uppercase font-bold tracking-tight">
            <span><span className="text-blue-500">● Blue</span> = current node</span>
            <span><span className="text-sky-500">● Sky</span> = open set</span>
            <span><span className="text-slate-500">● Slate</span> = closed set</span>
            <span><span className="text-amber-500">● Amber</span> = shortest path</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-1">Visited</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{renderedFrame.closed.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-1">Frontier</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{renderedFrame.open.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-1">Current f</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{renderedFrame.f.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-1">Path Cost</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{renderedFrame.g}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md overflow-x-auto">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center uppercase tracking-[0.2em]">Grid Visualization</h2>
          <div className="mx-auto w-full max-w-4xl">
            <div className="grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
              {Array.from({ length: gridSize }).map((_, row) => {
                return Array.from({ length: gridSize }).map((__, col) => {
                  const cellKey = pointKey(row, col);
                  const isStart = start.row === row && start.col === col;
                  const isGoal = goal.row === row && goal.col === col;
                  const isWall = walls.has(cellKey);
                  const isPath = pathSet.has(cellKey);
                  const isOpen = openSet.has(cellKey);
                  const isClosed = closedSet.has(cellKey);
                  const isCurrent = renderedFrame.currentKey === cellKey;

                  let className = "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300";
                  if (isWall) className = "bg-slate-800 border-slate-900 text-slate-100";
                  else if (isPath) className = "bg-amber-300 border-amber-500 text-amber-900";
                  else if (isCurrent) className = "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-500/20 scale-[1.03]";
                  else if (isStart) className = "bg-emerald-500 border-emerald-700 text-white";
                  else if (isGoal) className = "bg-rose-500 border-rose-700 text-white";
                  else if (isOpen) className = "bg-sky-200 border-sky-400 text-sky-900";
                  else if (isClosed) className = "bg-slate-200 border-slate-400 text-slate-700 dark:bg-slate-700 dark:border-slate-500 dark:text-slate-100";

                  return (
                    <button
                      key={cellKey}
                      type="button"
                      onClick={() => handleCellClick(row, col)}
                      disabled={engine.isPlaying}
                      className={`aspect-square rounded-lg border-2 transition-all duration-300 flex items-center justify-center font-bold text-[10px] sm:text-xs select-none ${className}`}
                      title={`Row ${row + 1}, Column ${col + 1}`}
                    >
                      {isStart ? "S" : isGoal ? "G" : isWall ? "" : isCurrent ? "●" : isPath ? "•" : ""}
                    </button>
                  );
                });
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AStarAnimation;

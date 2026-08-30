"use client";
import React, { useState, useMemo } from "react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { alphaBetaGenerator } from "@/features/algorithms/ai/alphaBetaPruningLogic";

const AlphaBetaPruning = () => {
  const [arrayElements, setArrayElements] = useState("3, 5, 2, 9, 12, 5, 23, 23");
  const [inputNodes, setInputNodes] = useState([]);
  const [message, setMessage] = useState("Enter 8 comma-separated numbers for leaf nodes.");

  const frames = useMemo(() => {
    if (inputNodes.length === 0) return [];
    return Array.from(alphaBetaGenerator(inputNodes));
  }, [inputNodes]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const handleReset = () => {
    setMessage("Enter 8 comma-separated numbers for leaf nodes.");
    setInputNodes([]);
    engine.reset();
  };

  const handleStart = (e) => {
    if (e) e.preventDefault();
    if (engine.isPlaying) return;

    const nums = arrayElements.split(",").map((num) => parseInt(num.trim()));
    if (nums.length !== 8 || nums.some(isNaN)) {
      setMessage("Please enter exactly 8 valid numbers.");
      return;
    }

    const initNodes = Array(15)
      .fill(null)
      .map((_, i) => ({
        id: i,
        val: i >= 7 ? nums[i - 7] : "?",
        alpha: -Infinity,
        beta: Infinity,
      }));

    setInputNodes(initNodes);
    setMessage("Running Alpha-Beta Pruning...");
    engine.reset();
    engine.play();
  };

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
    onReset: handleReset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const currentFrame = frames[engine.currentStep] || {
    treeNodes: inputNodes.length > 0 ? inputNodes : [],
    currentNodeClass: {},
    prunedNodes: {},
    stepExplanation: "",
  };

  const displayMessage = currentFrame.message || message;

  const renderTree = () => {
    if (currentFrame.treeNodes.length === 0) return null;

    const levels = [
      [0],
      [1, 2],
      [3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13, 14],
    ];

    return (
      <div className="flex flex-col items-center space-y-12 w-full max-w-4xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-inner border border-gray-100 dark:border-slate-800/50 overflow-x-auto">
        {levels.map((level, lIdx) => (
          <div key={lIdx} className="flex justify-around w-full min-w-[600px]">
            {level.map((nodeIdx) => {
              const isPruned = currentFrame.prunedNodes[nodeIdx];
              const nodeData = currentFrame.treeNodes[nodeIdx];
              return (
                <div
                  key={nodeIdx}
                  className={`relative flex flex-col items-center transition-all duration-500 ${isPruned ? "opacity-30 grayscale blur-[1px]" : "opacity-100"}`}
                >
                  <div
                    className={`w-14 h-14 md:w-20 md:h-20 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-500 z-10 
                      ${currentFrame.currentNodeClass[nodeIdx] || "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 shadow-sm"}`}
                  >
                    <span className="text-base md:text-xl font-black">
                        {nodeData.val === Infinity ? "∞" : nodeData.val === -Infinity ? "-∞" : nodeData.val}
                    </span>
                    {lIdx < 3 && (
                        <div className="text-[9px] md:text-[11px] font-mono opacity-80 mt-0.5">
                           α:{nodeData.alpha === -Infinity ? "-∞" : nodeData.alpha} β:{nodeData.beta === Infinity ? "∞" : nodeData.beta}
                        </div>
                    )}
                  </div>
                  {lIdx < 3 && (
                    <div className="absolute top-full h-12 flex justify-center w-0">
                         {/* Visual branching indicators */}
                    </div>
                  )}
                  <div className="mt-2 text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                    {lIdx === 0 ? "MAX" : lIdx === 1 ? "MIN" : lIdx === 2 ? "MAX" : "LEAF"}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[600px] bg-white dark:bg-slate-900 md:p-8 p-4 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm mb-12">
      <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <form onSubmit={handleStart} className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"> Leaf Nodes (8 required): </label>
            <input
            type="text"
            className="px-5 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm md:w-[350px]"
            value={arrayElements}
            onChange={(e) => setArrayElements(e.target.value)}
            disabled={engine.isPlaying}
            placeholder="e.g. 3, 5, 2, 9, 12, 5, 23, 23"
            />
        </form>
        
        <div className="flex items-center gap-4">
          <ResetButton onReset={handleReset} />
          <GoButton onClick={handleStart} disabled={engine.isPlaying} />
        </div>
      </div>

      <div className="w-full mb-6 max-w-4xl">
        <PlaybackControls
          isPlaying={engine.isPlaying}
          onPlayPause={togglePlay}
          speed={engine.speed / 1000}
          onSpeedChange={(s) => engine.setSpeed(s * 1000)}
          onStepForward={engine.stepForward}
          onStepBackward={engine.stepBackward}
          onReset={engine.reset}
          progressText={`${engine.currentStep + 1} / ${frames.length || 1}`}
          disabled={frames.length === 0}
        />
      </div>

      <div className="w-full mb-10 min-h-[64px] text-center bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50">
        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{displayMessage}</p>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2 italic">{currentFrame.stepExplanation}</p>
      </div>

      <div className="relative w-full overflow-x-auto pb-10">
        {renderTree()}
      </div>

      <div className="mt-12 pt-8 w-full border-t border-gray-200 dark:border-slate-800/80 flex flex-wrap justify-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-yellow-300 border-2 border-yellow-500 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Node</span>
        </div>
        <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-500 border-2 border-blue-700 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Node</span>
        </div>
        <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-green-500 border-2 border-green-700 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Evaluating Leaf</span>
        </div>
        <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-gray-300 opacity-20 border-2 border-gray-400 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pruned</span>
        </div>
      </div>
    </div>
  );
};

export default AlphaBetaPruning;

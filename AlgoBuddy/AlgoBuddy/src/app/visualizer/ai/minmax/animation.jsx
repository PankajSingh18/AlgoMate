"use client";
import React, { useState, useMemo } from "react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { minmaxGenerator } from "@/features/algorithms/ai/minmaxLogic";

const MinMax = () => {
  const [arrayElements, setArrayElements] = useState("3, 5, 2, 9, 12, 5, 23, 23");
  const [inputNodes, setInputNodes] = useState([]);
  const [message, setMessage] = useState("Enter 8 comma-separated numbers for leaf nodes.");

  const frames = useMemo(() => {
    if (inputNodes.length === 0) return [];
    return Array.from(minmaxGenerator(inputNodes));
  }, [inputNodes]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const handleReset = () => {
    setMessage("Enter 8 comma-separated numbers for leaf nodes.");
    setInputNodes([]);
    engine.reset();
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (engine.isPlaying) return;

    if (!arrayElements.trim()) {
      setMessage("Please enter array elements.");
      return;
    }

    const arr = arrayElements.split(",").map((x) => Number(x.trim()));
    if (arr.some(isNaN) || arr.length !== 8) {
      setMessage("Please enter exactly 8 valid numbers.");
      return;
    }

    const initNodes = new Array(15).fill(null).map((_, i) => ({
      val: i >= 7 ? arr[i - 7] : "?",
      id: i,
    }));
    
    setInputNodes(initNodes);
    setMessage("Running Min Max Algorithm...");
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
    stepExplanation: "",
  };

  const displayMessage = currentFrame.message || message;

  const renderTree = () => {
    if (currentFrame.treeNodes.length === 0) return null;
    
    const getPos = (index) => {
      let x = 0, y = 0;
      if (index === 0) { x = 400; y = 40; }
      else if (index >= 1 && index <= 2) { y = 120; x = 400 + (index - 1.5) * 400; }
      else if (index >= 3 && index <= 6) { y = 200; x = 400 + (index - 4.5) * 200; }
      else if (index >= 7 && index <= 14) { y = 280; x = 50 + (index - 7) * 100; }
      return { x, y };
    };

    const edges = [];
    for (let i = 0; i <= 6; i++) {
        const p1 = getPos(i);
        const p2_left = getPos(2 * i + 1);
        const p2_right = getPos(2 * i + 2);
        edges.push(<line key={`edge-${i}-L`} x1={p1.x} y1={p1.y} x2={p2_left.x} y2={p2_left.y} stroke="#888" strokeWidth="2" />);
        edges.push(<line key={`edge-${i}-R`} x1={p1.x} y1={p1.y} x2={p2_right.x} y2={p2_right.y} stroke="#888" strokeWidth="2" />);
    }

    return (
      <div className="relative w-full max-w-4xl mx-auto overflow-x-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Game Tree Visualization
        </h2>
        <div className="min-w-[800px] h-[340px] relative mx-auto">
          <svg className="absolute w-full h-full left-0 top-0 pointer-events-none">
            {edges}
          </svg>
          
          {currentFrame.treeNodes.map((node, i) => {
            const pos = getPos(i);
            const r = 20;
            const styleClass = currentFrame.currentNodeClass[i] || "bg-white text-gray-800 border-gray-400";
            return (
              <div
                key={i}
                className={`absolute flex justify-center items-center font-bold border-2 rounded-full transition-all duration-300 shadow-sm ${styleClass}`}
                style={{
                  width: `${2*r}px`,
                  height: `${2*r}px`,
                  left: `${pos.x - r}px`,
                  top: `${pos.y - r}px`,
                  zIndex: 10
                }}
              >
                {node.val}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 mt-16 font-sans">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Min Max Visualization
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Observe how the Min Max algorithm discovers the optimal leaf node value!
        </p>
      </div>

      <form onSubmit={handleGo} className="max-w-3xl mx-auto mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="arrayElements" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Array Elements (comma separated - exactly 8 items)
            </label>
            <input
              id="arrayElements"
              type="text"
              value={arrayElements}
              onChange={(e) => setArrayElements(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-800 dark:text-gray-200 font-mono"
              placeholder="e.g., 3, 5, 2, 9, 12, 5, 23, 23"
              disabled={engine.isPlaying}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 self-end sm:w-auto w-full">
            <GoButton onClick={handleGo} isAnimating={engine.isPlaying} disabled={engine.isPlaying} />
            <ResetButton onReset={handleReset} isAnimating={engine.isPlaying} />
          </div>
        </div>

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
      </form>

      {displayMessage && (
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-lg bg-blue-50 dark:bg-gray-800 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-gray-700">
          <p className="text-center font-medium">{displayMessage}</p>
        </div>
      )}

      {currentFrame.stepExplanation && (
        <div className="max-w-4xl mx-auto mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2 border-b border-[#a435f0]/20">
            <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
            <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
              Step Explanation
            </span>
          </div>
          <div className="px-4 py-3">
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-mono">
              {currentFrame.stepExplanation}
            </p>
          </div>
        </div>
      )}

      {renderTree()}
    </main>
  );
};

export default MinMax;

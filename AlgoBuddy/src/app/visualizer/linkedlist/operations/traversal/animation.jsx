"use client";
import React, { useMemo, useState } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import { generateRandomListLogic, traversalGenerator } from "@/features/algorithms/linkedlist/traversalLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const LinkedListTraversal = () => {
  const [list, setList] = useState([]);

  const frames = useMemo(() => {
    if (list.length === 0) return [];
    return Array.from(traversalGenerator(list));
  }, [list]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const generateRandomList = () => {
    if (engine.isPlaying) return;
    const newList = generateRandomListLogic();
    setList(newList);
    engine.reset();
  };

  const animateTraversal = () => {
    if (engine.isPlaying || list.length === 0) return;
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

  const handleReset = () => {
    setList([]);
    engine.reset();
  };

  useVisualizerKeyboard({
    onStart: animateTraversal,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: handleReset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const currentFrame = frames[engine.currentStep] || {
    list: list,
    currentNodeIndex: -1,
    explanation: list.length > 0 ? "Ready to traverse." : "Click \"Generate List\" to create a linked list."
  };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how traversal visits each node in a linked list from head to tail.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={generateRandomList}
            disabled={engine.isPlaying}
            className="flex-1 rounded-lg bg-[#a435f0]/10 px-6 py-3 text-[#a435f0] transition hover:bg-[#a435f0]/20 border border-[#a435f0]/30 disabled:opacity-50"
          >
            Generate List
          </button>
          <button
            onClick={animateTraversal}
            disabled={engine.isPlaying || list.length === 0}
            className="flex-1 rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400"
          >
            {engine.isPlaying ? "Traversing..." : "Animate Traversal"}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
        
        {list.length > 0 && (
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
      </VisualizerCard>

      <div className="w-full mb-6 max-w-4xl mx-auto p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center">
         <p className="text-gray-800 dark:text-gray-200 font-medium">
             {currentFrame.explanation}
         </p>
      </div>

      <VisualizerCard>
        <div className="mb-6 flex flex-wrap justify-center gap-3 text-sm sm:gap-6 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
            <span>Node</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-emerald-500"></div>
            <span>Visited / Current</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-[#c27cf7]"></div>
            <span>Address</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-gray-400"></div>
            <span>Pointer</span>
          </div>
        </div>

        <div className="relative flex min-h-[220px] w-full items-center justify-center overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818]">
          {list.length === 0 ? (
            <div className="w-full py-12 text-center text-gray-500 dark:text-gray-400">
              Click &quot;Generate List&quot; to create a linked list.
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
              {currentFrame.list.map((node, index) => {
                const isVisited = currentFrame.currentNodeIndex >= index && currentFrame.currentNodeIndex !== -1;
                const isCurrent = currentFrame.currentNodeIndex === index;
                
                let nodeClass = "bg-primary";
                let scaleClass = "scale-100";
                
                if (isCurrent) {
                  nodeClass = "bg-emerald-500 shadow-lg shadow-emerald-500/30";
                  scaleClass = "scale-110";
                } else if (isVisited) {
                  nodeClass = "bg-emerald-500";
                }

                let addressClass = "text-gray-500 dark:text-gray-400 font-normal";
                if (isCurrent) {
                  addressClass = "text-blue-600 dark:text-blue-400 font-bold";
                }

                let arrowClass = "text-gray-400 opacity-60";
                if (isVisited && !isCurrent) {
                   arrowClass = "text-blue-500 opacity-100 scale-110";
                }

                return (
                  <React.Fragment key={node.id}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`text-xs font-mono transition-all duration-300 ${addressClass}`}>
                        {node.address}
                      </div>
                      <div
                        className={`flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full text-3xl text-white shadow-md transition-all duration-500 ${nodeClass} ${scaleClass}`}
                      >
                        {node.value}
                      </div>
                      <div className="rounded bg-blue-100 px-2 py-1 text-xs font-mono dark:bg-blue-900 text-gray-700 dark:text-gray-200">
                        Next: {node.next}
                      </div>
                    </div>
                    {index < currentFrame.list.length - 1 && (
                      <svg
                        className={`my-4 h-8 w-8 transition-all duration-300 ${arrowClass}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default LinkedListTraversal;

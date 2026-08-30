"use client";

import React, { useMemo, useState } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import { generateRandomListLogic } from "@/features/algorithms/linkedlist/traversalLogic";
import { reverseGenerator } from "@/features/algorithms/linkedlist/reverseLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const LinkedListReverse = () => {
  const [list, setList] = useState([]);

  const frames = useMemo(() => {
    if (list.length === 0) return [];
    return Array.from(reverseGenerator(list));
  }, [list]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const handleGenerate = () => {
    if (engine.isPlaying) return;
    setList(generateRandomListLogic());
    engine.reset();
  };

  const startReverse = () => {
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

  // When animation finishes naturally
  React.useEffect(() => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0 && !engine.isPlaying) {
        const finalFrame = frames[frames.length - 1];
        if (finalFrame && finalFrame.phase === 'complete') {
            setList(finalFrame.list);
            engine.reset();
        }
    }
  }, [engine.currentStep, frames, engine.isPlaying, engine]);

  useVisualizerKeyboard({
    onStart: startReverse,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: handleReset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const currentFrame = frames.length > 0 && engine.currentStep >= 0
    ? frames[engine.currentStep]
    : {
        phase: 'idle',
        prevIndex: -1,
        currentIndex: -1,
        nextIndex: -1,
        list: list,
        explanation: list.length > 0 ? "Ready to reverse. Click 'Reverse List'." : "Click 'Generate List' to create a linked list."
      };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how reversing a linked list involves carefully updating pointers one node at a time.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGenerate}
            disabled={engine.isPlaying}
            className="w-full rounded-lg bg-[#a435f0]/10 px-6 py-3 text-[#a435f0] transition hover:bg-[#a435f0]/20 border border-[#a435f0]/30 disabled:opacity-50"
          >
            Generate List
          </button>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={startReverse}
              disabled={engine.isPlaying || list.length === 0}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400"
            >
              {engine.isPlaying ? "Reversing..." : "Reverse List"}
            </button>
            <button
              onClick={handleReset}
              className="flex-1 rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
        
        {frames.length > 0 && (
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

      <div className="w-full mb-6 max-w-4xl mx-auto p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center min-h-[60px] flex items-center justify-center">
         <p className="text-gray-800 dark:text-gray-200 font-medium">
             {currentFrame.explanation}
         </p>
      </div>

      <VisualizerCard>
        <div className="mb-6 flex justify-center gap-4 text-sm sm:gap-8 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-emerald-500"></div>
            <span>Previous</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-amber-500"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-blue-500"></div>
            <span>Next</span>
          </div>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818] min-h-[260px]">
          {currentFrame.list.length === 0 ? (
            <div className="w-full py-12 text-center text-gray-500">
              No nodes generated yet.
            </div>
          ) : (
            <div className="flex items-center space-x-4 sm:space-x-8">
              {currentFrame.list.map((node, index) => {
                const isPrev = currentFrame.prevIndex === index;
                const isCurrent = currentFrame.currentIndex === index;
                const isNext = currentFrame.nextIndex === index;
                
                let bgData = "bg-primary";
                let scaleClass = "scale-100";
                
                if (isCurrent) {
                    bgData = "bg-amber-500 shadow-lg";
                    scaleClass = "scale-110 z-10";
                } else if (isPrev) {
                    bgData = "bg-emerald-500";
                } else if (isNext) {
                    bgData = "bg-blue-500";
                }

                // If this node is "reversed" relative to original list (which means it points to the previous index)
                // we can show a reverse arrow. Since this is just a 1D array visualization, 
                // we will just show standard nodes. The 'next' address text shows the reversal.
                const nextAddress = node.next;

                return (
                  <div key={node.id} className="flex items-center">
                    <div className={`node flex flex-col items-center transition-all duration-300 ${scaleClass}`}>
                      <span className="text-[10px] font-mono text-gray-500 mb-1">{node.address}</span>
                      <div className="flex">
                          <div className={`data-part w-16 rounded-l-lg ${bgData} p-3 text-center text-base text-white sm:w-20 sm:p-4 sm:text-lg transition-colors`}>
                          {node.value}
                          </div>
                          <div className="next-part w-16 rounded-r-lg bg-[#c27cf7] p-3 text-center font-mono text-xs dark:bg-primary sm:w-20 sm:p-4 sm:text-base">
                          {nextAddress}
                          </div>
                      </div>
                    </div>
                    {index < currentFrame.list.length - 1 && (
                      <div className="mx-1 text-2xl sm:mx-2 sm:text-3xl text-gray-400">&rarr;</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default LinkedListReverse;

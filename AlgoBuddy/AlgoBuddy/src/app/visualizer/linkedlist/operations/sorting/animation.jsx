"use client";

import React, { useMemo, useState } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import { generateRandomListLogic } from "@/features/algorithms/linkedlist/traversalLogic";
import { sortingGenerator } from "@/features/algorithms/linkedlist/sortingLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const LinkedListSorting = () => {
  const [list, setList] = useState([]);

  const frames = useMemo(() => {
    if (list.length === 0) return [];
    return Array.from(sortingGenerator(list));
  }, [list]);
  console.log("Frames:", frames);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const handleGenerate = () => {
    if (engine.isPlaying) return;
    setList([
  { value: 45 },
  { value: 12 },
  { value: 78 },
  { value: 23 },
  { value: 9 }
]);
    engine.reset();
  };

  const startSort = () => {
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
    onStart: startSort,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: handleReset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const currentFrame = frames.length > 0 && engine.currentStep >= 0
    ? frames[engine.currentStep]
    : {
        phase: "idle",
        leftRange: null,
        rightRange: null,
        list,
        explanation:
          list.length > 0
            ? "Ready to sort. Click 'Sort List'."
            : "Click 'Generate List' to create a list."
      };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
      Visualize how Merge Sort recursively splits the list into smaller parts and then merges them back in sorted order.
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
              onClick={startSort}
              disabled={engine.isPlaying || list.length === 0}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400"
            >
              {engine.isPlaying ? "Sorting..." : "Sort List"}
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
      <div className="text-center mb-4">
      <span className="px-4 py-2 rounded-full bg-primary text-white">
        {currentFrame.phase?.toUpperCase()}
      </span>
    </div>

      <div className="w-full mb-6 max-w-4xl mx-auto p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center min-h-[60px] flex items-center justify-center">
         <p className="text-gray-800 dark:text-gray-200 font-medium">
             {currentFrame.explanation}
         </p>
      </div>

      <VisualizerCard>
        <div className="mb-6 flex justify-center gap-6 flex-wrap">

            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded bg-blue-500"></div>
              <span>Left Half</span>
            </div>

            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded bg-yellow-500"></div>
              <span>Right Half</span>
            </div>

            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded bg-green-500"></div>
              <span>Merged Section</span>
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
                let bgData = "bg-primary";

                const inLeft =
                  currentFrame.leftRange &&
                  index >= currentFrame.leftRange[0] &&
                  index <= currentFrame.leftRange[1];

                const inRight =
                  currentFrame.rightRange &&
                  index >= currentFrame.rightRange[0] &&
                  index <= currentFrame.rightRange[1];

                const isComparing =
                  currentFrame.phase === "compare" &&
                  (
                    index === currentFrame.currentIndex ||
                    index === currentFrame.compareIndex
                  );

                if (currentFrame.phase === "split") {
                  if (inLeft) bgData = "bg-blue-500";
                  if (inRight) bgData = "bg-yellow-500";
                }

                if (currentFrame.phase === "merge") {
                  if (inLeft || inRight) {
                    bgData = "bg-green-500";
                  }
                }

                if (isComparing) {
                  bgData = "bg-red-500";
                }

                return (
              <div key={node.id || index} className="flex items-center">
                <div className={`
                    w-16 h-16
                    rounded-xl
                    ${bgData}
                    flex items-center
                    justify-center
                    text-white
                    font-bold
                    text-xl
                    transition-all
                    duration-300
                  `}
                >
                      {node.value}
                    </div>
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

export default LinkedListSorting;

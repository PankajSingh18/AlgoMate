"use client";

import React, { useMemo, useState } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import { generateRandomListLogic } from "@/features/algorithms/linkedlist/traversalLogic";
import { compareListsGenerator } from "@/features/algorithms/linkedlist/llComparisonLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const LinkedListComparison = () => {
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  
  const frames = useMemo(() => {
    if (list1.length === 0 || list2.length === 0) return [];
    return Array.from(compareListsGenerator(list1, list2));
  }, [list1, list2]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const handleGenerateIdentical = () => {
    if (engine.isPlaying) return;
    const baseList = generateRandomListLogic();
    const listCopy = baseList.map((node) => ({ ...node }));
    setList1(baseList);
    setList2(listCopy);
    engine.reset();
  };

  const handleGenerateDifferent = () => {
    if (engine.isPlaying) return;
    setList1(generateRandomListLogic());
    setList2(generateRandomListLogic());
    engine.reset();
  };

  const startComparison = () => {
    if (engine.isPlaying || list1.length === 0 || list2.length === 0) return;
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
    setList1([]);
    setList2([]);
    engine.reset();
  };

  useVisualizerKeyboard({
    onStart: startComparison,
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
        list1Index: -1,
        list2Index: -1,
        explanation: list1.length > 0 ? "Ready to compare. Click 'Compare Lists'." : "Generate identical or different lists to compare."
      };

  const renderList = (listData, name, activeIndex) => (
    <div className="mb-6 flex flex-col items-center">
      <h3 className="mb-4 text-lg font-bold text-gray-700 dark:text-gray-300">
        {name}
      </h3>
      <div className="relative flex w-full items-start justify-center overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818] min-h-[140px]">
        {listData.length === 0 ? (
          <div className="w-full py-6 text-center text-gray-500">
            Empty List
          </div>
        ) : (
          <div className="flex items-center space-x-4 sm:space-x-8">
            {listData.map((node, index) => {
              const isCurrent = activeIndex === index;
              let bgData = "bg-primary";
              let scaleClass = "scale-100";
              
              if (isCurrent) {
                  if (currentFrame.phase === 'compare') {
                      bgData = "bg-amber-500";
                      scaleClass = "scale-110 shadow-lg";
                  } else if (currentFrame.phase === 'matched' || currentFrame.match === true) {
                      bgData = "bg-emerald-500";
                      scaleClass = "scale-105";
                  } else if (currentFrame.phase === 'complete' && currentFrame.match === false) {
                      bgData = "bg-rose-500";
                      scaleClass = "scale-105";
                  }
              }

              return (
              <div key={node.id} className="flex items-center">
                <div className={`node flex flex-col items-center transition-all duration-300 ${scaleClass}`}>
                  <span className="text-[10px] font-mono text-gray-500 mb-1">{node.address}</span>
                  <div className="flex">
                      <div className={`data-part w-16 rounded-l-lg ${bgData} p-3 text-center text-base text-white sm:w-20 sm:p-4 sm:text-lg transition-colors`}>
                      {node.value}
                      </div>
                      <div className="next-part w-16 rounded-r-lg bg-[#c27cf7] p-3 text-center font-mono text-xs dark:bg-primary sm:w-20 sm:p-4 sm:text-base">
                      {node.next}
                      </div>
                  </div>
                </div>
                {index < listData.length - 1 && (
                  <div className="mx-1 text-2xl sm:mx-2 sm:text-3xl text-gray-400">&rarr;</div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize the parallel traversal required to compare two linked lists.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleGenerateIdentical}
              disabled={engine.isPlaying}
              className="flex-1 rounded-lg bg-[#10b981]/10 px-6 py-3 text-[#10b981] transition hover:bg-[#10b981]/20 border border-[#10b981]/30 disabled:opacity-50"
            >
              Generate Identical
            </button>
            <button
              onClick={handleGenerateDifferent}
              disabled={engine.isPlaying}
              className="flex-1 rounded-lg bg-[#ef4444]/10 px-6 py-3 text-[#ef4444] transition hover:bg-[#ef4444]/20 border border-[#ef4444]/30 disabled:opacity-50"
            >
              Generate Different
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={startComparison}
              disabled={engine.isPlaying || list1.length === 0}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400"
            >
              {engine.isPlaying ? "Comparing..." : "Compare Lists"}
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
            <div className="mr-2 h-4 w-4 rounded-full bg-amber-500"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-emerald-500"></div>
            <span>Match</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-rose-500"></div>
            <span>Mismatch</span>
          </div>
        </div>

        {renderList(list1, "List 1", currentFrame.list1Index)}
        {renderList(list2, "List 2", currentFrame.list2Index)}

      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default LinkedListComparison;

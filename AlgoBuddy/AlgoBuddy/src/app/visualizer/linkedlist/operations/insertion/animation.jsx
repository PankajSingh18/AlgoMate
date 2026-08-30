"use client";
import React, { useMemo, useState } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import { insertionGenerator } from "@/features/algorithms/linkedlist/insertionLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const LinkedListInsertion = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [pendingInsertion, setPendingInsertion] = useState(null);

  const frames = useMemo(() => {
    if (!pendingInsertion) return [];
    return Array.from(insertionGenerator(list, pendingInsertion));
  }, [list, pendingInsertion]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const addNode = () => {
    if (engine.isPlaying || !inputValue) return;
    setPendingInsertion(inputValue);
    engine.reset();
    engine.play();
  };

  const handleReset = () => {
    setInputValue("");
    setList([]);
    setPendingInsertion(null);
    engine.reset();
  };

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.phase === 'complete') {
         setList(finalFrame.list);
      }
      setPendingInsertion(null);
      engine.reset();
    } else if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
  };

  // When animation finishes naturally
  React.useEffect(() => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0 && !engine.isPlaying) {
        const finalFrame = frames[frames.length - 1];
        if (finalFrame && finalFrame.phase === 'complete') {
            setList(finalFrame.list);
            setPendingInsertion(null);
            setInputValue("");
            engine.reset();
        }
    }
  }, [engine.currentStep, frames, engine.isPlaying, engine]);

  useVisualizerKeyboard({
    onStart: addNode,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: handleReset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const currentFrame = frames.length > 0 && engine.currentStep >= 0
    ? frames[engine.currentStep]
    : {
        list: list,
        newNode: null,
        phase: 'idle',
        currentNodeIndex: -1,
        explanation: "Enter a value and click 'Add Node' to insert a new element."
      };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how a new node is appended and linked to the end of a linked list.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-lg border border-gray-400 bg-white p-3 dark:bg-gray-800"
            placeholder="Enter value"
            disabled={engine.isPlaying || pendingInsertion !== null}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addNode}
              disabled={engine.isPlaying || !inputValue || pendingInsertion !== null}
              className="rounded-lg bg-primary px-6 py-3 text-white disabled:bg-gray-400"
            >
              {engine.isPlaying ? "Adding..." : "Add Node"}
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700"
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

      <div className="w-full mb-6 max-w-4xl mx-auto p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center">
         <p className="text-gray-800 dark:text-gray-200 font-medium">
             {currentFrame.explanation}
         </p>
      </div>

      <VisualizerCard>
        <div className="mb-6 flex justify-center gap-4 text-sm sm:gap-8 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
            <span>Data</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-[#c27cf7] dark:bg-primary"></div>
            <span>Next Pointer</span>
          </div>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818] min-h-[300px]">
          {/* New Node Floating */}
          {currentFrame.newNode && (
            <div className={`mb-8 flex transition-all duration-500 ease-in-out ${currentFrame.phase === 'traverse' ? 'translate-x-1/2 opacity-80' : 'translate-x-0 opacity-100 scale-110'}`}>
               <div className="flex items-center flex-col">
                  <span className="text-xs font-mono text-blue-600 mb-1 font-bold">New Node: {currentFrame.newNode.address}</span>
                  <div className="flex shadow-lg shadow-blue-500/30">
                    <div className="w-16 rounded-l-lg bg-emerald-500 p-3 text-center text-base text-white sm:w-20 sm:p-4 sm:text-lg">
                      {currentFrame.newNode.value}
                    </div>
                    <div className="w-16 rounded-r-lg bg-emerald-400 p-3 text-center font-mono text-xs sm:w-20 sm:p-4 sm:text-base">
                      {currentFrame.newNode.next}
                    </div>
                  </div>
               </div>
            </div>
          )}
        
          {currentFrame.list.length === 0 ? (
            <div className="w-full py-12 text-center text-base text-gray-500 sm:py-16 sm:text-lg">
              No nodes added yet.
            </div>
          ) : (
            <div className="flex items-center space-x-4 sm:space-x-8">
              {currentFrame.list.map((node, index) => {
                  const isCurrent = currentFrame.currentNodeIndex === index;
                  const bgData = isCurrent ? "bg-amber-500" : "bg-primary";
                  const scaleClass = isCurrent ? "scale-110 shadow-md z-10" : "scale-100";
                  
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

export default LinkedListInsertion;

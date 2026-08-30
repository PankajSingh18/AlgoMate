"use client";

import React, { useState, useMemo } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import {
  insertGenerator,
  extractMinGenerator,
} from "@/features/algorithms/queue/priorityQueueLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const PriorityQueueVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [queue, setQueue] = useState([]);
  const [pendingOp, setPendingOp] = useState(null); // { type: 'insert', value: string, priority: string } | { type: 'extract_min' }

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    if (pendingOp.type === 'insert') {
      return Array.from(insertGenerator(queue, pendingOp.value, pendingOp.priority));
    } else if (pendingOp.type === 'extract_min') {
      return Array.from(extractMinGenerator(queue));
    }
    return [];
  }, [queue, pendingOp]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 800 });

  const insert = () => {
    if (!inputValue || priorityValue === "" || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'insert', value: inputValue, priority: priorityValue });
    engine.reset();
    engine.play();
  };

  const extractMin = () => {
    if (queue.length === 0 || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'extract_min' });
    engine.reset();
    engine.play();
  };

  const handleReset = () => {
    setInputValue("");
    setPriorityValue("");
    setQueue([]);
    setPendingOp(null);
    engine.reset();
  };

  useVisualizerReset(handleReset);

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.phase === 'complete') {
         setQueue(finalFrame.pq);
      }
      setPendingOp(null);
      engine.reset();
    } else if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
  };

  // Auto-commit on completion
  React.useEffect(() => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0 && !engine.isPlaying) {
        const finalFrame = frames[frames.length - 1];
        if (finalFrame && finalFrame.phase === 'complete') {
            setQueue(finalFrame.pq);
            setPendingOp(null);
            if (pendingOp?.type === 'insert') {
                setInputValue("");
                setPriorityValue("");
            }
            engine.reset();
        }
    }
  }, [engine.currentStep, frames, engine.isPlaying, engine, pendingOp]);

  useVisualizerKeyboard({
    onStart: togglePlay,
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
        pq: queue,
        explanation: "Enter a value and priority, then click 'Insert'. The queue will order elements by priority."
      };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how a Priority Queue sorts elements based on priority (lowest number = highest priority).
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-lg border bg-white p-3 dark:bg-gray-700"
              placeholder="Enter value"
              disabled={engine.isPlaying || pendingOp !== null}
            />
            <input
              type="number"
              value={priorityValue}
              onChange={(e) => setPriorityValue(e.target.value)}
              className="w-full sm:w-32 rounded-lg border bg-white p-3 dark:bg-gray-700"
              placeholder="Priority"
              disabled={engine.isPlaying || pendingOp !== null}
            />
            <button
              onClick={insert}
              disabled={engine.isPlaying || !inputValue || priorityValue === "" || pendingOp !== null}
              className="w-full rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400 sm:w-auto"
            >
              Insert
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={extractMin}
              disabled={engine.isPlaying || queue.length === 0 || pendingOp !== null}
              className="w-full rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 disabled:opacity-50 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:w-1/2"
            >
              Extract Min
            </button>
            <button
              onClick={handleReset}
              disabled={engine.isPlaying && pendingOp === null}
              className="w-full rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:w-1/2"
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
        <div className="mb-6 flex justify-between px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 sm:px-8">
          <div>Highest Priority (Min)</div>
          <div>Lowest Priority</div>
        </div>
        
        <div className="relative flex min-h-[160px] w-full flex-col items-center justify-center overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 dark:border-[#222] dark:bg-[#181818] p-6">
            
            {currentFrame.action === 'extract_min' && currentFrame.extractedNode && currentFrame.phase === 'start' && (
                <div className="absolute left-10 top-0 mb-4 flex flex-col items-center opacity-50 scale-110 translate-y-[-20px] transition-all duration-500">
                    <span className="text-xs font-bold text-rose-500 mb-1">Extracted</span>
                    <div className="flex flex-col items-center justify-center rounded-lg bg-rose-500 p-2 shadow-lg w-20">
                        <div className="text-xs font-semibold text-rose-200">Pri: {currentFrame.extractedNode.pri}</div>
                        <div className="text-xl font-bold text-white">{currentFrame.extractedNode.val}</div>
                    </div>
                </div>
            )}

            {currentFrame.pq.length === 0 ? (
                <div className="py-8 text-center text-gray-500 font-medium">
                Priority Queue is empty
                </div>
            ) : (
                <div className="flex items-center gap-4">
                {currentFrame.pq.map((node, index) => {
                    const isNew = currentFrame.action === 'insert' && currentFrame.phase !== 'start' && node.val === currentFrame.newValue && node.pri === currentFrame.newPri;
                    
                    let bgClass = "bg-primary";
                    let scaleClass = "scale-100";

                    if (isNew) {
                        bgClass = "bg-blue-500";
                        scaleClass = "scale-110 shadow-lg z-10";
                    }
                    
                    return (
                    <div
                        key={node.id}
                        className={`flex flex-col items-center justify-center rounded-lg p-2 shadow-md transition-all duration-500 w-20 ${bgClass} ${scaleClass}`}
                    >
                        <div className="text-xs font-semibold text-white/70">Pri: {node.pri}</div>
                        <div className="text-xl font-bold text-white">{node.val}</div>
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

export default PriorityQueueVisualizer;
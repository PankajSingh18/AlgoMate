"use client";

import React, { useState, useMemo } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import {
  enqueueGenerator,
  dequeueGenerator,
  checkFullGenerator,
} from "@/features/algorithms/queue/queueIsFullLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const QueueIsFullVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [queue, setQueue] = useState([]);
  const [capacity, setCapacity] = useState(5);
  const [pendingOp, setPendingOp] = useState(null);

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    if (pendingOp.type === 'enqueue') {
      return Array.from(enqueueGenerator(queue, pendingOp.value, capacity));
    } else if (pendingOp.type === 'dequeue') {
      return Array.from(dequeueGenerator(queue));
    } else {
      return Array.from(checkFullGenerator(queue, capacity));
    }
  }, [queue, pendingOp, capacity]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 800 });

  const enqueue = () => {
    if (!inputValue || engine.isPlaying || pendingOp) return;
    if (queue.length >= capacity) {
        setPendingOp({ type: 'check' }); // Or maybe an error state
    } else {
        setPendingOp({ type: 'enqueue', value: inputValue });
    }
    engine.reset();
    engine.play();
  };

  const dequeue = () => {
    if (queue.length === 0 || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'dequeue' });
    engine.reset();
    engine.play();
  };

  const checkFull = () => {
    if (engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'check' });
    engine.reset();
    engine.play();
  };

  const handleReset = () => {
    setInputValue("");
    setQueue([]);
    setPendingOp(null);
    engine.reset();
  };

  useVisualizerReset(handleReset);

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.phase === 'complete') {
         if (finalFrame.action !== 'check') {
             setQueue(finalFrame.queue);
         }
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
            if (finalFrame.action !== 'check') {
                setQueue(finalFrame.queue);
            }
            setPendingOp(null);
            if (pendingOp?.type === 'enqueue') setInputValue("");
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
        queue: queue,
        explanation: "Add items or remove them, then click 'Check IsFull' to test the capacity constraint."
      };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how checking if a queue is full compares its length against a maximum capacity.
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
              disabled={engine.isPlaying || pendingOp !== null || queue.length >= capacity}
            />
            <button
              onClick={enqueue}
              disabled={engine.isPlaying || !inputValue || pendingOp !== null || queue.length >= capacity}
              className="w-full rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400 sm:w-auto"
            >
              Enqueue
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={dequeue}
              disabled={engine.isPlaying || queue.length === 0 || pendingOp !== null}
              className="w-full rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 disabled:opacity-50 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:w-1/3"
            >
              Dequeue
            </button>
            <button
              onClick={checkFull}
              disabled={engine.isPlaying || pendingOp !== null}
              className="w-full rounded-lg bg-[#ef4444]/10 px-6 py-3 text-[#ef4444] transition hover:bg-[#ef4444]/20 border border-[#ef4444]/30 disabled:opacity-50 sm:w-1/3"
            >
              Check IsFull
            </button>
            <button
              onClick={handleReset}
              disabled={engine.isPlaying && pendingOp === null}
              className="w-full rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:w-1/3"
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
          <div>Capacity: {capacity}</div>
          <div>Current: {currentFrame.queue.length}</div>
        </div>
        
        <div className={`relative flex min-h-[160px] w-full flex-col items-center justify-center overflow-x-auto rounded-xl border-2 transition-colors duration-500 ${currentFrame.action === 'check' && currentFrame.phase === 'complete' ? (currentFrame.isFull ? 'border-rose-500 bg-rose-500/10' : 'border-emerald-500 bg-emerald-500/10') : 'border-gray-200 bg-gray-50 dark:border-[#222] dark:bg-[#181818]' } p-6`}>
            
            {currentFrame.action === 'check' && currentFrame.phase === 'complete' && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 text-sm font-bold px-4 py-1 rounded-full ${currentFrame.isFull ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {currentFrame.isFull ? "TRUE" : "FALSE"}
                </div>
            )}

            {currentFrame.action === 'enqueue' && currentFrame.newValue && currentFrame.phase === 'start' && (
                <div className="absolute right-10 top-0 mb-4 animate-bounce flex flex-col items-center">
                    <span className="text-xs font-bold text-blue-500 mb-1">New Node</span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500 text-xl font-bold text-white shadow-lg">
                        {currentFrame.newValue}
                    </div>
                </div>
            )}
            
            {currentFrame.action === 'dequeue' && currentFrame.dequeuedNode && currentFrame.phase === 'start' && (
                <div className="absolute left-10 top-0 mb-4 flex flex-col items-center opacity-50 scale-110 translate-y-[-20px] transition-all duration-500">
                    <span className="text-xs font-bold text-rose-500 mb-1">Dequeued</span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-rose-500 text-xl font-bold text-white shadow-lg">
                        {currentFrame.dequeuedNode.value}
                    </div>
                </div>
            )}

            {/* Render empty slots to show capacity */}
            <div className="flex gap-4">
                {Array.from({ length: capacity }).map((_, i) => {
                    const node = currentFrame.queue[i];
                    
                    if (node) {
                        const isNew = currentFrame.action === 'enqueue' && currentFrame.phase === 'complete' && i === currentFrame.queue.length - 1;
                        const scaleClass = isNew ? "scale-110 shadow-lg bg-blue-500" : "scale-100 bg-primary";
                        
                        return (
                            <div
                                key={node.id}
                                className={`flex h-16 w-16 items-center justify-center rounded-lg text-xl font-bold text-white shadow-md transition-all duration-500 ${scaleClass}`}
                            >
                                {node.value}
                            </div>
                        );
                    } else {
                        return (
                            <div key={`empty-${i}`} className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-transparent text-gray-400">
                            </div>
                        );
                    }
                })}
            </div>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default QueueIsFullVisualizer;
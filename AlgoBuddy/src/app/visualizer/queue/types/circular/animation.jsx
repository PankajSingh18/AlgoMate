"use client";

import React, { useState, useMemo } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import {
  enqueueCircularGenerator,
  dequeueCircularGenerator,
} from "@/features/algorithms/queue/circularQueueLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const CircularQueueVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const capacity = 8;
  const [queue, setQueue] = useState(Array(capacity).fill(null));
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(0);
  const [count, setCount] = useState(0);
  const [pendingOp, setPendingOp] = useState(null);

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    if (pendingOp.type === 'enqueue') {
      return Array.from(enqueueCircularGenerator(queue, front, rear, count, capacity, pendingOp.value));
    } else if (pendingOp.type === 'dequeue') {
      return Array.from(dequeueCircularGenerator(queue, front, rear, count, capacity));
    }
    return [];
  }, [queue, front, rear, count, capacity, pendingOp]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 800 });

  const enqueue = () => {
    if (!inputValue || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'enqueue', value: inputValue });
    engine.reset();
    engine.play();
  };

  const dequeue = () => {
    if (count === 0 || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'dequeue' });
    engine.reset();
    engine.play();
  };

  const handleReset = () => {
    setInputValue("");
    setQueue(Array(capacity).fill(null));
    setFront(0);
    setRear(0);
    setCount(0);
    setPendingOp(null);
    engine.reset();
  };

  useVisualizerReset(handleReset);

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.phase === 'complete') {
         setQueue(finalFrame.queue);
         setFront(finalFrame.front);
         setRear(finalFrame.rear);
         setCount(finalFrame.count);
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
            setQueue(finalFrame.queue);
            setFront(finalFrame.front);
            setRear(finalFrame.rear);
            setCount(finalFrame.count);
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
        front: front,
        rear: rear,
        count: count,
        explanation: "Enter a value and click 'Enqueue' to add it to the rear, or 'Dequeue' to remove from the front."
      };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how a circular queue wraps around when it reaches the end of the array.
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
              disabled={engine.isPlaying || pendingOp !== null || count === capacity}
            />
            <button
              onClick={enqueue}
              disabled={engine.isPlaying || !inputValue || pendingOp !== null || count === capacity}
              className="w-full rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400 sm:w-auto"
            >
              Enqueue
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={dequeue}
              disabled={engine.isPlaying || count === 0 || pendingOp !== null}
              className="w-full rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 disabled:opacity-50 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:w-1/2"
            >
              Dequeue
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
          <div>Front: {currentFrame.front}</div>
          <div>Rear: {currentFrame.rear}</div>
          <div>Count: {currentFrame.count} / {capacity}</div>
        </div>
        
        <div className="relative flex min-h-[160px] w-full flex-col items-center justify-center overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-[#222] dark:bg-[#181818]">
            {/* Render array slots */}
            <div className="flex gap-4 mb-8">
                {currentFrame.queue.map((node, i) => {
                    const isFront = currentFrame.front === i && currentFrame.count > 0;
                    const isRear = currentFrame.rear === i && currentFrame.count > 0;
                    
                    let bgClass = "bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400";
                    let scaleClass = "scale-100";
                    
                    if (node !== null) {
                        bgClass = "bg-primary border-none text-white";
                        if (currentFrame.action === 'enqueue' && currentFrame.phase === 'complete' && i === currentFrame.rear) {
                            bgClass = "bg-blue-500";
                            scaleClass = "scale-110 shadow-lg";
                        }
                    }

                    if (currentFrame.action === 'dequeue' && currentFrame.phase === 'start' && i === currentFrame.front) {
                        bgClass = "bg-rose-500 opacity-50";
                        scaleClass = "scale-110 shadow-lg translate-y-[-10px]";
                    }
                    
                    return (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <span className="text-xs font-mono text-gray-500">{i}</span>
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-lg text-xl font-bold shadow-md transition-all duration-500 ${bgClass} ${scaleClass}`}
                            >
                                {node !== null ? node : ""}
                            </div>
                            <div className="flex gap-1 h-4">
                                {isFront && <span className="text-[10px] font-bold text-amber-500">F</span>}
                                {isRear && <span className="text-[10px] font-bold text-emerald-500">R</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1">
                   <div className="w-3 h-3 bg-amber-500 rounded-sm"></div> Front
                </div>
                <div className="flex items-center gap-1">
                   <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Rear
                </div>
            </div>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default CircularQueueVisualizer;

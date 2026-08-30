"use client";

import React, { useState, useMemo } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import {
  enqueueFrontGenerator,
  enqueueRearGenerator,
  dequeueFrontGenerator,
  dequeueRearGenerator
} from "@/features/algorithms/queue/dequeLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const DequeVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [queue, setQueue] = useState([]);
  const [pendingOp, setPendingOp] = useState(null);

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    switch (pendingOp.type) {
      case 'enqueueFront': return Array.from(enqueueFrontGenerator(queue, pendingOp.value));
      case 'enqueueRear': return Array.from(enqueueRearGenerator(queue, pendingOp.value));
      case 'dequeueFront': return Array.from(dequeueFrontGenerator(queue));
      case 'dequeueRear': return Array.from(dequeueRearGenerator(queue));
      default: return [];
    }
  }, [queue, pendingOp]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 800 });

  const enqueueFront = () => {
    if (!inputValue || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'enqueueFront', value: inputValue });
    engine.reset();
    engine.play();
  };

  const enqueueRear = () => {
    if (!inputValue || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'enqueueRear', value: inputValue });
    engine.reset();
    engine.play();
  };

  const dequeueFront = () => {
    if (queue.length === 0 || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'dequeueFront' });
    engine.reset();
    engine.play();
  };

  const dequeueRear = () => {
    if (queue.length === 0 || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'dequeueRear' });
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
         setQueue(finalFrame.deque);
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
            setQueue(finalFrame.deque);
            setPendingOp(null);
            if (pendingOp?.type.startsWith('enqueue')) setInputValue("");
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
        deque: queue,
        explanation: "Enter a value and add/remove from either the front or the rear of the Double-Ended Queue."
      };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how a Deque (Double-Ended Queue) allows insertions and deletions at both ends.
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
            <button
              onClick={enqueueFront}
              disabled={engine.isPlaying || !inputValue || pendingOp !== null}
              className="rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              Enqueue Front
            </button>
            <button
              onClick={enqueueRear}
              disabled={engine.isPlaying || !inputValue || pendingOp !== null}
              className="rounded-lg bg-emerald-600 px-4 py-3 text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              Enqueue Rear
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={dequeueFront}
              disabled={engine.isPlaying || queue.length === 0 || pendingOp !== null}
              className="w-full rounded-lg border border-blue-600 px-4 py-3 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 sm:w-1/3"
            >
              Dequeue Front
            </button>
            <button
              onClick={dequeueRear}
              disabled={engine.isPlaying || queue.length === 0 || pendingOp !== null}
              className="w-full rounded-lg border border-emerald-600 px-4 py-3 text-emerald-600 transition hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50 sm:w-1/3"
            >
              Dequeue Rear
            </button>
            <button
              onClick={handleReset}
              disabled={engine.isPlaying && pendingOp === null}
              className="w-full rounded-lg border border-black px-4 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:w-1/3"
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
          <div>Front</div>
          <div>Rear</div>
        </div>
        
        <div className="relative flex min-h-[160px] w-full flex-col items-center justify-center overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 dark:border-[#222] dark:bg-[#181818] p-6">
            
            {currentFrame.action === 'enqueue_front' && currentFrame.newValue && currentFrame.phase === 'start' && (
                <div className="absolute left-10 top-0 mb-4 animate-bounce flex flex-col items-center">
                    <span className="text-xs font-bold text-blue-500 mb-1">New Front</span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500 text-xl font-bold text-white shadow-lg">
                        {currentFrame.newValue}
                    </div>
                </div>
            )}

            {currentFrame.action === 'enqueue_rear' && currentFrame.newValue && currentFrame.phase === 'start' && (
                <div className="absolute right-10 top-0 mb-4 animate-bounce flex flex-col items-center">
                    <span className="text-xs font-bold text-emerald-500 mb-1">New Rear</span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-500 text-xl font-bold text-white shadow-lg">
                        {currentFrame.newValue}
                    </div>
                </div>
            )}
            
            {currentFrame.action === 'dequeue_front' && currentFrame.dequeuedNode && currentFrame.phase === 'start' && (
                <div className="absolute left-10 top-0 mb-4 flex flex-col items-center opacity-50 scale-110 translate-y-[-20px] transition-all duration-500">
                    <span className="text-xs font-bold text-rose-500 mb-1">Removed</span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-rose-500 text-xl font-bold text-white shadow-lg">
                        {currentFrame.dequeuedNode.value}
                    </div>
                </div>
            )}

            {currentFrame.action === 'dequeue_rear' && currentFrame.dequeuedNode && currentFrame.phase === 'start' && (
                <div className="absolute right-10 top-0 mb-4 flex flex-col items-center opacity-50 scale-110 translate-y-[-20px] transition-all duration-500">
                    <span className="text-xs font-bold text-rose-500 mb-1">Removed</span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-rose-500 text-xl font-bold text-white shadow-lg">
                        {currentFrame.dequeuedNode.value}
                    </div>
                </div>
            )}

            {currentFrame.deque.length === 0 ? (
                <div className="py-8 text-center text-gray-500 font-medium">
                Deque is empty
                </div>
            ) : (
                <div className="flex items-center gap-4">
                {currentFrame.deque.map((node, index) => {
                    const isNewFront = currentFrame.action === 'enqueue_front' && currentFrame.phase === 'complete' && index === 0;
                    const isNewRear = currentFrame.action === 'enqueue_rear' && currentFrame.phase === 'complete' && index === currentFrame.deque.length - 1;
                    
                    let bgClass = "bg-primary";
                    let scaleClass = "scale-100";

                    if (isNewFront) {
                        bgClass = "bg-blue-500";
                        scaleClass = "scale-110 shadow-lg";
                    } else if (isNewRear) {
                        bgClass = "bg-emerald-500";
                        scaleClass = "scale-110 shadow-lg";
                    }
                    
                    return (
                    <div
                        key={node.id}
                        className={`flex h-16 w-16 items-center justify-center rounded-lg text-xl font-bold text-white shadow-md transition-all duration-500 ${bgClass} ${scaleClass}`}
                    >
                        {node.value}
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

export default DequeVisualizer;
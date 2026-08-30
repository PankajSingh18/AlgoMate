"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { pushGenerator, popGenerator, checkEmptyGenerator } from "@/features/algorithms/stack/stackIsEmptyLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import ResetButton from "@/app/components/ui/resetButton";

const StackVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [capacityInput, setCapacityInput] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [stack, setStack] = useState([]);
  const [pendingOp, setPendingOp] = useState(null); // { type: 'push', value: string } | { type: 'pop' } | { type: 'isempty' }
  const [isEmptyStatus, setIsEmptyStatus] = useState(null);

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    if (pendingOp.type === "push") {
      return Array.from(pushGenerator(stack, pendingOp.value, capacity));
    } else if (pendingOp.type === "pop") {
      return Array.from(popGenerator(stack));
    } else if (pendingOp.type === "isempty") {
      return Array.from(checkEmptyGenerator(stack));
    }
    return [];
  }, [stack, pendingOp, capacity]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 800 });

  const push = () => {
    if (!inputValue || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: "push", value: inputValue });
    setIsEmptyStatus(null);
    engine.reset();
    engine.play();
  };

  const pop = () => {
    if (stack.length === 0 || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: "pop" });
    setIsEmptyStatus(null);
    engine.reset();
    engine.play();
  };

  const checkEmpty = () => {
    if (engine.isPlaying || pendingOp) return;
    setPendingOp({ type: "isempty" });
    setIsEmptyStatus(null);
    engine.reset();
    engine.play();
  };

  const handleReset = () => {
    setInputValue("");
    setStack([]);
    setPendingOp(null);
    setCapacity(null);
    setCapacityInput("");
    setIsEmptyStatus(null);
    engine.reset();
  };

  const handleSetCapacity = () => {
    const size = parseInt(capacityInput, 10);
    if (isNaN(size) || size < 1 || size > 10) {
      alert("Please enter a valid capacity between 1 and 10.");
      return;
    }
    setCapacity(size);
    setCapacityInput("");
  };

  useVisualizerReset(handleReset);

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.type === "complete") {
        if (pendingOp?.type === "push" || pendingOp?.type === "pop") {
          setStack(finalFrame.stack);
        } else if (pendingOp?.type === "isempty") {
          setIsEmptyStatus(finalFrame.isEmpty);
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

  useEffect(() => {
    if (
      engine.currentStep === frames.length - 1 &&
      frames.length > 0 &&
      !engine.isPlaying
    ) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.type === "complete") {
        if (pendingOp?.type === "push" || pendingOp?.type === "pop") {
          setStack(finalFrame.stack);
        } else if (pendingOp?.type === "isempty") {
          setIsEmptyStatus(finalFrame.isEmpty);
        }
        setPendingOp(null);
        if (pendingOp?.type === "push") setInputValue("");
        engine.reset();
      } else if (finalFrame && finalFrame.type === "error") {
        setPendingOp(null);
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

  const currentFrame =
    frames.length > 0 && engine.currentStep >= 0
      ? frames[engine.currentStep]
      : {
          type: "idle",
          stack: stack,
          message: capacity === null ? "Please set a valid stack capacity first." : "Ready for operations!",
        };

  const displayStack = currentFrame.stack || stack;

  const slots = [];
  if (capacity !== null) {
    for (let i = capacity - 1; i >= 0; i--) {
      const isFilled = i < displayStack.length;
      const itemValue = isFilled ? displayStack[displayStack.length - 1 - i] : null;
      slots.push({ index: i, isFilled, value: itemValue });
    }
  }

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize Push, Pop, Peek, and IsEmpty operations
      </p>

      <VisualizerCard className="mb-0">
        {capacity === null ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                max="10"
                value={capacityInput}
                onChange={(e) => setCapacityInput(e.target.value)}
                className="flex-1 rounded-lg border p-3 dark:bg-gray-700"
                placeholder="Enter capacity (1-10)..."
                onKeyDown={(e) => e.key === "Enter" && handleSetCapacity()}
              />
              <button
                onClick={handleSetCapacity}
                className="rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark"
              >
                Set Capacity
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-lg border p-3 dark:bg-gray-700"
                placeholder="Enter value"
                disabled={engine.isPlaying || pendingOp !== null || displayStack.length >= capacity}
                onKeyDown={(e) => e.key === "Enter" && push()}
              />
              <button
                onClick={push}
                disabled={engine.isPlaying || !inputValue || pendingOp !== null || displayStack.length >= capacity}
                className={`w-32 rounded-lg px-6 py-3 text-white transition ${
                  engine.isPlaying || !inputValue || pendingOp !== null || displayStack.length >= capacity
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {engine.isPlaying && pendingOp?.type === "push" ? "Pushing..." : "Push"}
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={checkEmpty}
                disabled={engine.isPlaying || pendingOp !== null}
                className="flex-1 rounded-lg border border-[#a435f0] text-[#a435f0] px-6 py-3 transition hover:bg-[#a435f0] hover:text-white disabled:opacity-50 dark:hover:bg-[#a435f0] dark:hover:text-white"
              >
                {engine.isPlaying && pendingOp?.type === "isempty" ? "Checking..." : "IsEmpty"}
              </button>
              <button
                onClick={pop}
                disabled={engine.isPlaying || displayStack.length === 0 || pendingOp !== null}
                className="flex-1 rounded-lg border border-black px-6 py-3 text-black transition hover:bg-gray-100 disabled:opacity-50 dark:border-white dark:text-white dark:hover:bg-gray-700"
              >
                {engine.isPlaying && pendingOp?.type === "pop" ? "Popping..." : "Pop"}
              </button>
              <ResetButton onReset={handleReset} isAnimating={engine.isPlaying && pendingOp === null} />
            </div>
          </div>
        )}

        {frames.length > 0 && (
          <div className="mt-6">
            <PlaybackControls
              isPlaying={engine.isPlaying}
              onPlayPause={togglePlay}
              speed={engine.speed / 1000}
              onSpeedChange={(s) => engine.setSpeed(s * 1000)}
              onStepForward={engine.stepForward}
              onStepBackward={engine.stepBackward}
              onReset={() => {
                engine.reset();
              }}
              progressText={`${engine.currentStep + 1} / ${frames.length || 1}`}
              disabled={frames.length === 0}
            />
          </div>
        )}
      </VisualizerCard>

      <div className="w-full mb-6 max-w-4xl mx-auto p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center min-h-[60px] flex flex-col items-center justify-center">
        <p className={`font-medium ${currentFrame.type === 'error' ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
          {currentFrame.message || currentFrame.operation}
        </p>
        {isEmptyStatus !== null && !engine.isPlaying && (
          <div className={`mt-2 font-bold text-lg ${isEmptyStatus ? 'text-rose-500' : 'text-emerald-500'}`}>
            Result: {isEmptyStatus ? 'True (Empty)' : 'False (Not Empty)'}
          </div>
        )}
      </div>

      <VisualizerCard>
        {capacity === null ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-slate-700/50 rounded-2xl p-8 bg-slate-900/5">
            <span className="text-sm font-semibold text-slate-500 text-center">
              Define stack capacity above to initialize the stack structure
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center min-h-[300px]">
            <div className="mb-6 text-center text-sm font-semibold text-slate-500">
              Stack Status:{" "}
              <span
                className={
                  displayStack.length >= capacity
                    ? "text-rose-500 font-bold"
                    : "text-[#a435f0] font-bold"
                }
              >
                {displayStack.length === 0
                  ? "Empty"
                  : displayStack.length >= capacity
                  ? "Full"
                  : "Active"}
              </span>
              {" | "}Capacity:{" "}
              <span className="text-slate-300 font-bold">{displayStack.length}</span>/
              <span className="text-slate-400 font-bold">{capacity}</span>
            </div>

            <div className="w-full max-w-md space-y-1.5 relative">
              {/* If pushing, animate the new element coming down */}
              {currentFrame.type === "start" && pendingOp?.type === "push" && (
                <div className="absolute left-0 right-0 -top-16 flex items-center justify-center gap-4 animate-bounce">
                  <div className="w-16"></div>
                  <div className="w-48 text-center text-xs font-bold text-[#a435f0]/80">
                    Inserting...
                  </div>
                  <div className="w-20"></div>
                </div>
              )}
              {/* If popping, animate the popped element going up */}
              {currentFrame.type === "start" && pendingOp?.type === "pop" && (
                <div className="absolute left-0 right-0 -top-16 flex items-center justify-center gap-4 opacity-50 scale-110 -translate-y-4 transition-all duration-500">
                   <div className="w-16"></div>
                   <div className="w-48 text-center text-xs font-bold text-rose-500">
                    Removing...
                  </div>
                  <div className="w-20"></div>
                </div>
              )}

              <div className={`transition-all duration-500 rounded-xl ${pendingOp?.type === 'isempty' && currentFrame.type === 'start' ? 'ring-4 ring-[#a435f0] shadow-2xl scale-105' : ''}`}>
              {slots.map((slot) => {
                const isTop = slot.index === displayStack.length - 1;
                
                // Animation states based on engine
                let itemClass = "bg-slate-800/40 border-slate-700 text-slate-300";
                
                if (isTop) {
                   if (currentFrame.type === 'start' && pendingOp?.type === 'pop') {
                       itemClass = "bg-rose-500/20 border-rose-500 text-rose-300 scale-105 shadow-rose-500/20 shadow-lg";
                   } else if (currentFrame.type === 'complete' && pendingOp?.type === 'push') {
                       itemClass = "bg-[#a435f0] border-[#a435f0] text-white scale-110 shadow-[#a435f0]/30 shadow-xl";
                   } else {
                       itemClass = "bg-[#a435f0]/10 border-[#a435f0] text-slate-100 shadow-[#a435f0]/10 shadow-md";
                   }
                }

                return (
                  <div key={slot.index} className="flex items-center gap-4 justify-center">
                    <div className="w-16 text-right text-xs font-bold text-slate-400 dark:text-slate-500">
                      Index [{slot.index}]
                    </div>

                    <div className="w-48 relative">
                      {slot.isFilled ? (
                        <div
                          className={`p-3 border-2 rounded-xl text-center font-medium transition-all duration-300 ${itemClass}`}
                        >
                          <div>{slot.value}</div>
                        </div>
                      ) : (
                        <div className="p-3 border border-dashed border-slate-700/50 rounded-xl text-center text-slate-600 font-medium bg-slate-900/10 dark:bg-slate-950/20 transition-all duration-300">
                          <div className="text-xs uppercase tracking-wider text-slate-600/80">
                            Empty
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-20 text-left">
                      {isTop ? (
                        <span className="text-xs font-extrabold text-[#a435f0] flex items-center gap-1 animate-pulse transition-all duration-300">
                          ← top
                        </span>
                      ) : (
                        <span className="text-xs text-transparent">top</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {displayStack.length === 0 && (
                <div className="flex items-center gap-4 justify-center pt-2">
                  <div className="w-16"></div>
                  <div className="w-48 text-center text-xs font-bold text-[#a435f0]/80">
                    top = -1 (Empty)
                  </div>
                  <div className="w-20"></div>
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default StackVisualizer;

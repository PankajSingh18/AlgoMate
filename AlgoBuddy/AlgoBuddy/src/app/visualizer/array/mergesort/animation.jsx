"use client";
import React, { useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { mergeSortGenerator } from "@/features/algorithms/array/mergeSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const precomputeSteps = (inputArray) => {
  const steps = [];
  const generator = mergeSortGenerator(inputArray);
  
  for (const frame of generator) {
    const { type, payload } = frame;
    
    if (type === 'init') {
      steps.push({
        array: [...inputArray],
        comparisons: 0, swaps: 0, currentStep: 0,
        currentIndices: { left: -1, right: -1, mergeStart: -1, mergeEnd: -1, comparing: [], mid: -1 },
        currentPhase: "", stepExplanation: "Starting Merge Sort...",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'divide') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { 
          left: payload.l, right: payload.r, mid: payload.m, 
          mergeStart: -1, mergeEnd: -1, comparing: [] 
        },
        currentPhase: "Divide Phase",
        stepExplanation: `Splitting array range [${payload.l}, ${payload.r}] into [${payload.l}, ${payload.m}] and [${payload.m + 1}, ${payload.r}].`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'merge_start') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { 
          left: payload.l, right: payload.r, mid: payload.m, 
          mergeStart: payload.l, mergeEnd: payload.r, comparing: [] 
        },
        currentPhase: "Merge Phase",
        stepExplanation: `Merging two sorted subarrays: [${payload.l}, ${payload.m}] and [${payload.m + 1}, ${payload.r}].`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'comparing') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: payload.comparisons,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step,
        currentIndices: { 
          left: payload.l, right: payload.r, mid: payload.m, 
          mergeStart: payload.l, mergeEnd: payload.r, comparing: [payload.leftCompareIdx, payload.rightCompareIdx] 
        },
        currentPhase: "Merge Phase",
        stepExplanation: `Comparing ${payload.LVal} from the left subarray with ${payload.RVal} from the right subarray.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'merged' || type === 'merged_remainder') {
      steps.push({
        array: [...payload.arr],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: payload.merges,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { 
          left: payload.l, right: payload.r, mid: payload.m, 
          mergeStart: payload.l, mergeEnd: payload.r, comparing: [] 
        },
        currentPhase: "Merge Phase",
        stepExplanation: type === 'merged' 
          ? `Moving ${payload.val} from the ${payload.fromLeft ? 'left' : 'right'} subarray into position ${payload.k}.`
          : `Moving remaining element ${payload.val} into position ${payload.k}.`,
        sorted: false, totalSteps: payload.totalSteps,
        isMerged: true,
        mergeK: payload.k
      });
    } else if (type === 'completed') {
      const last = steps[steps.length - 1] || {};
      steps.push({
        array: payload.arr || last.array || [],
        comparisons: last.comparisons || 0,
        swaps: last.swaps || 0,
        currentStep: payload.step || last.currentStep || 0,
        currentIndices: { left: -1, right: -1, mid: -1, mergeStart: -1, mergeEnd: -1, comparing: [] },
        currentPhase: "Completed",
        stepExplanation: "Array is fully sorted.",
        sorted: true, totalSteps: payload.totalSteps || last.totalSteps,
      });
    }
  }
  return steps;
};

const MergeSortVisualizer = () => {
  const [array, setArray] = useState([]);

  const [visualState, setVisualState] = useState({
    comparisons: 0, swaps: 0, 
    currentIndices: { left: -1, right: -1, mid: -1, mergeStart: -1, mergeEnd: -1, comparing: [] },
    currentPhase: "", stepExplanation: "", sorted: false, totalSteps: 0,
  });

  const steps = useMemo(() => {
    if (array.length === 0) return [];
    return precomputeSteps(array);
  }, [array]);

  const onStep = useCallback((step) => {
    setVisualState({
      comparisons: step.comparisons,
      swaps: step.swaps,
      currentIndices: step.currentIndices,
      currentPhase: step.currentPhase,
      stepExplanation: step.stepExplanation,
      sorted: step.sorted,
      totalSteps: step.totalSteps,
    });

    if (step.isMerged && step.mergeK !== undefined) {
      const bars = document.querySelectorAll(".bar");
      const bar = bars[step.mergeK];
      if (bar) {
        gsap.to(bar, { scale: 1.2, duration: 0.1 });
        gsap.to(bar, { scale: 1.0, duration: 0.1, delay: 0.1 });
      }
    }
  }, []);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 500 });
  const currentStepData = steps[engine.currentStep];

  const handleStart = useCallback(() => {
    if (currentStepData?.sorted) {
      engine.reset();
      setTimeout(() => engine.play(), 50);
    } else {
      engine.play();
    }
  }, [engine, currentStepData]);

  const handleReset = useCallback(() => {
    setVisualState({
      comparisons: 0, swaps: 0, 
      currentIndices: { left: -1, right: -1, mid: -1, mergeStart: -1, mergeEnd: -1, comparing: [] },
      currentPhase: "", stepExplanation: "", sorted: false, totalSteps: 0,
    });
    engine.reset();
  }, [engine]);

  useVisualizerKeyboard({
    onStart: handleStart,
    onReset: handleReset,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
    onTogglePlayPause: engine.isPlaying ? engine.pause : handleStart,
    speed: engine.speed / 500,
    sorting: engine.isPlaying,
    sorted: currentStepData?.sorted || false,
  });

  const isInCurrentRange = (index) => index >= visualState.currentIndices.left && index <= visualState.currentIndices.right;
  const isBeingMerged = (index) => index >= visualState.currentIndices.mergeStart && index <= visualState.currentIndices.mergeEnd;

  const handleExplainStep = () => {
    const prompt = `I am currently looking at the Merge Sort algorithm, at step ${engine.currentStep} of ${steps.length}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Current Array State: [${currentStepData?.array?.join(", ") || array.join(", ")}]
Left index: ${visualState.currentIndices.left}, Right index: ${visualState.currentIndices.right}, Mid: ${visualState.currentIndices.mid}
Currently comparing indices: [${visualState.currentIndices.comparing.join(", ")}]
Currently merging indices: ${visualState.currentIndices.mergeStart} to ${visualState.currentIndices.mergeEnd}

Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pt-2 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize the divide-and-conquer approach of Merge Sort with recursive splitting and merging.
      </p>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <ArrayGenerator
                onGenerate={(newArray) => {
                  setArray(newArray);
                  handleReset();
                }}
                disabled={engine.isPlaying}
                isPrimary={array.length === 0}
              />
              <CustomArrayInput
                onUseCustomArray={(newArray) => {
                  setArray(newArray);
                  handleReset();
                }}
                disabled={engine.isPlaying}
                currentArray={array}
                className="mb-4"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleStart}
                disabled={!array.length}
                className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white"
              >
                {engine.isPlaying ? "Sorting..." : currentStepData?.sorted ? "Restart" : "Start Merge Sort"}
              </button>
              <button
                onClick={handleReset}
                disabled={engine.isPlaying}
                className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Reset All
              </button>
            </div>
          </div>

          {engine.isPlaying && (
            <PlaybackControls
              isPlaying={engine.isPlaying}
              onPlayPause={engine.isPlaying ? engine.pause : handleStart}
              speed={engine.speed / 500}
              onSpeedChange={(s) => engine.setSpeed(s * 500)}
              onStepForward={engine.stepForward}
              onStepBackward={engine.stepBackward}
              onReset={engine.reset}
              onExplainStep={handleExplainStep}
              disabled={steps.length === 0}
            />
          )}

          {!engine.isPlaying && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={engine.speed / 500}
                onChange={(e) => engine.setSpeed(parseFloat(e.target.value) * 500)}
                className="w-24 sm:w-32"
              />
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{engine.speed / 500}x</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-2xl">{visualState.comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Merges:</div>
              <div className="text-2xl">{visualState.swaps}</div>
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {visualState.totalSteps > 0 ? `${engine.currentStep + 1} / ${steps.length}` : '—'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {engine.currentStep > 0 && !visualState.sorted
                ? `Merging elements at index ${visualState.currentIndices.mergeStart} to ${visualState.currentIndices.mergeEnd}`
                : visualState.sorted
                ? 'Sorting complete!'
                : 'Start sorting to see steps'}
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Phase:</div>
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
              {visualState.currentPhase || (visualState.sorted ? 'Completed' : 'Ready to start')}
            </div>
            <div className="font-medium mt-2">Explanation:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {visualState.stepExplanation || (visualState.sorted ? 'Array is fully sorted.' : 'Run the algorithm to see educational hints.')}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Main Array</h2>
          {(currentStepData?.array || array).length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {((currentStepData?.array) || array).map((value, index) => {
                const isComparing = visualState.currentIndices.comparing.includes(index);
                const isInRange = isInCurrentRange(index);
                const isMerging = isBeingMerged(index);
                const isSorted = visualState.sorted;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                        ${
                          isComparing
                            ? "bg-red-400 dark:bg-red-400 border-red-600 dark:border-red-600 text-gray-800"
                            : isMerging
                            ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                            : isInRange
                            ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 text-gray-800"
                            : isSorted
                            ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                            : "bg-primary/80 dark:bg-primary border-primary dark:border-primary text-gray-800"
                        }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {index}
                      {isComparing && " (comparing)"}
                      {isMerging && !isComparing && " (merging)"}
                      {isInRange && !isMerging && !isComparing && " (current)"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {engine.isPlaying ? "Sorting..." : "Generate or enter an array to begin"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MergeSortVisualizer;

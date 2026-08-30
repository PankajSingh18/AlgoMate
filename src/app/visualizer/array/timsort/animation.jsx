"use client";
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls"; 
import { timSortGenerator } from "@/features/algorithms/array/timSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-base";
  if (len === 3) return "text-xs";
  return "text-[10px]";
};

const precomputeSteps = (inputArray) => {
    const steps = [];
    if (inputArray.length === 0) return [];
    const generator = timSortGenerator([...inputArray]);

    for (const frame of generator) {
        const { type, payload } = frame;
        const lastStep = steps[steps.length - 1] || { 
            array: [...inputArray], 
            runs: [],
            comparisons: 0, 
            swaps: 0, 
            currentStep: 0, 
            currentIndices: {}, 
            currentPhase: "", 
            stepExplanation: "", 
            sorted: false, 
            totalSteps: 0 
        };

        switch (type) {
            case 'init':
                steps.push({
                    ...lastStep,
                    array: [...inputArray],
                    stepExplanation: "Starting Tim Sort...",
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'find_run':
                steps.push({
                    ...lastStep,
                    array: [...payload.array],
                    currentStep: payload.step,
                    currentIndices: { run: payload.run },
                    currentPhase: `1. Finding Runs`,
                    stepExplanation: `Identified a new run of size ${payload.run.length} starting at index ${payload.run[0]}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'insertion_sort_in_run':
                steps.push({
                    ...lastStep,
                    array: [...payload.array],
                    comparisons: payload.comparisons,
                    swaps: payload.swaps,
                    currentStep: payload.step,
                    currentIndices: { run: payload.run, i: payload.i, j: payload.j },
                    currentPhase: `2. Sorting Runs (Insertion Sort)`,
                    stepExplanation: `Sorting run starting at index ${payload.run[0]}. Comparing elements at indices ${payload.j} and ${payload.j + 1}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'push_run':
                steps.push({
                    ...lastStep,
                    runs: [...payload.runs],
                    currentStep: payload.step,
                    currentPhase: `3. Stacking Runs`,
                    stepExplanation: `Pushed sorted run onto the stack. Stack now has ${payload.runs.length} runs.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'start_merge':
                steps.push({
                    ...lastStep,
                    array: [...payload.array],
                    runs: [...(payload.runs || lastStep.runs || [])],
                    currentStep: payload.step,
                    currentIndices: { merging: [payload.run1, payload.run2] },
                    currentPhase: `4. Merging Runs`,
                    stepExplanation: `Preparing to merge two runs. Run 1 (size ${payload.run1.length}) and Run 2 (size ${payload.run2.length}).`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'merge_compare':
                steps.push({
                    ...lastStep,
                    array: [...payload.array],
                    comparisons: payload.comparisons,
                    currentStep: payload.step,
                    currentIndices: { merging: lastStep.currentIndices.merging, compare: payload.compare },
                    currentPhase: `4. Merging Runs`,
                    stepExplanation: `Comparing ${payload.array[payload.compare[0]]} and ${payload.array[payload.compare[1]]}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'merge_copy':
                steps.push({
                    ...lastStep,
                    array: [...payload.array],
                    swaps: payload.swaps,
                    currentStep: payload.step,
                    currentIndices: { merging: lastStep.currentIndices.merging, write: payload.writeIndex },
                    currentPhase: `4. Merging Runs`,
                    stepExplanation: `Copying smaller element to its correct sorted position at index ${payload.writeIndex}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'merge_complete':
                steps.push({
                    ...lastStep,
                    array: [...payload.array],
                    runs: [...(payload.runs || lastStep.runs || [])],
                    currentStep: payload.step,
                    currentIndices: {},
                    currentPhase: `4. Merging Runs`,
                    stepExplanation: `Merge complete. The resulting sorted run is now on the stack.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'completed':
                steps.push({
                    ...lastStep,
                    array: [...payload.array],
                    currentStep: payload.step,
                    currentIndices: {},
                    currentPhase: "Completed",
                    stepExplanation: "Array is fully sorted.",
                    sorted: true,
                    runs: [],
                    totalSteps: payload.totalSteps,
                });
                break;
            default:
                break;
        }
    }
    const totalSteps = steps.length;
    return steps.map((step, index) => ({
        ...step,
        currentStep: step.currentStep ?? index,
        totalSteps,
    }));
};

const TimSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const replayTimerRef = useRef(null);

  const [visualState, setVisualState] = useState({
    runs: [],
    comparisons: 0, 
    swaps: 0, 
    currentIndices: {},
    currentPhase: "", 
    stepExplanation: "", 
    sorted: false, 
    totalSteps: 0,
  });

  const steps = useMemo(() => {
    return precomputeSteps([...array]);
  }, [array]);

  const onStep = useCallback((step) => {
    setVisualState({
      runs: step.runs,
      comparisons: step.comparisons,
      swaps: step.swaps,
      currentIndices: step.currentIndices,
      currentPhase: step.currentPhase,
      stepExplanation: step.stepExplanation,
      sorted: step.sorted,
      totalSteps: step.totalSteps,
    });
  }, []);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 500 });
  const currentStepData = steps[engine.currentStep];

  const clearReplayTimer = useCallback(() => {
    if (replayTimerRef.current) {
      clearTimeout(replayTimerRef.current);
      replayTimerRef.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    if (currentStepData?.sorted) {
      clearReplayTimer();
      engine.reset();
      replayTimerRef.current = setTimeout(() => {
        replayTimerRef.current = null;
        engine.play();
      }, 50);
    } else {
      engine.play();
    }
  }, [clearReplayTimer, engine, currentStepData]);

  const handleReset = useCallback(() => {
    clearReplayTimer();
    setVisualState({
      runs: [],
      comparisons: 0, swaps: 0, 
      currentIndices: {},
      currentPhase: "", stepExplanation: "", sorted: false, totalSteps: 0,
    });
    engine.reset();
  }, [clearReplayTimer, engine]);

  useEffect(() => clearReplayTimer, [clearReplayTimer]);

  useVisualizerKeyboard({
    onStart: handleStart,
    onReset: handleReset,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
    onTogglePlayPause: engine.isPlaying ? engine.pause : handleStart,
    speed: engine.speed / 500,
    sorting: engine.isPlaying,
    sorted: currentStepData?.sorted || false,
    onStepForward: engine.stepForward,
    onStepBackward: engine.stepBackward,
  });

  const handleExplainStep = () => {
    const prompt = `I am currently looking at the Tim Sort algorithm, at step ${engine.currentStep} of ${steps.length}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Current Array State: [${currentStepData?.array?.join(", ") || array.join(", ")}]
Current Runs on Stack: ${JSON.stringify(visualState.runs)}
Current Indices/Pointers: ${JSON.stringify(visualState.currentIndices)}
Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pt-4 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Tim Sort&apos;s hybrid approach, combining Insertion Sort and Merge Sort.
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
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleStart}
                disabled={!array.length}
                className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white"
              >
                {engine.isPlaying ? "Sorting..." : currentStepData?.sorted ? "Restart" : "Start Tim Sort"}
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
              <div className="font-medium">Swaps:</div>
              <div className="text-2xl">{visualState.swaps}</div>
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {visualState.totalSteps > 0 ? `${engine.currentStep + 1} / ${steps.length}` : "—"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {visualState.currentPhase
                ? visualState.currentPhase
                : visualState.sorted
                ? "Sorting complete!"
                : "Start sorting to see steps"}
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Phase:</div>
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
              {visualState.currentPhase || (visualState.sorted ? "Completed" : "Ready to start")}
            </div>
            <div className="font-medium mt-2">Explanation:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {visualState.stepExplanation || (visualState.sorted ? "Array is fully sorted." : "Run the algorithm to see educational hints.")}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Array Visualization</h2>
          {(currentStepData?.array || array).length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="relative flex flex-wrap gap-2 justify-center">
                {(currentStepData?.array || array).map((value, index) => {
                  const { run, i, j, merging, compare, write } = visualState.currentIndices;
                  const isInRun = run?.includes(index);
                  const isInsertionSorting = (index === i || index === j || index === j + 1) && visualState.currentPhase.includes("Sorting Runs");
                  const isMerging = merging?.some(r => r.includes(index));
                  const isComparing = compare?.includes(index);
                  const isWriting = write === index;

                  let bgColor = "bg-gray-200 dark:bg-gray-700";
                  let borderColor = "border-gray-300 dark:border-gray-600";

                  if (visualState.sorted) {
                    bgColor = "bg-green-400 dark:bg-green-600";
                    borderColor = "border-green-600 dark:border-green-400";
                  } else if (isWriting) {
                    bgColor = "bg-purple-400 dark:bg-purple-600";
                    borderColor = "border-purple-600 dark:border-purple-400";
                  } else if (isComparing) {
                    bgColor = "bg-yellow-400 dark:bg-yellow-600";
                    borderColor = "border-yellow-600 dark:border-yellow-400";
                  } else if (isMerging) {
                    bgColor = "bg-blue-300 dark:bg-blue-800";
                    borderColor = "border-blue-500 dark:border-blue-400";
                  } else if (isInsertionSorting) {
                    bgColor = "bg-orange-300 dark:bg-orange-700";
                    borderColor = "border-orange-500 dark:border-orange-400";
                  } else if (isInRun) {
                    bgColor = "bg-indigo-200 dark:bg-indigo-900";
                    borderColor = "border-indigo-400 dark:border-indigo-500";
                  }

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`array-bar w-12 h-12 flex items-center justify-center rounded-md border-2 transition-all duration-300 ${getFontSize(value)} font-medium ${bgColor} ${borderColor}`}
                      >
                        {value}
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                    </div>
                  );
                })}
              </div>
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

export default TimSortVisualizer;

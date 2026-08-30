"use client";
import React, { useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { quickSortGenerator } from "@/features/algorithms/array/quickSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const precomputeSteps = (inputArray) => {
  const steps = [];
  const generator = quickSortGenerator(inputArray);
  
  for (const frame of generator) {
    const { type, payload } = frame;
    
    if (type === 'init') {
      steps.push({
        array: [...inputArray],
        comparisons: 0, swaps: 0, currentStep: 0,
        currentIndices: { pivot: -1, left: -1, right: -1, partitionIndex: -1, stack: [], partitions: [] },
        currentPhase: "", stepExplanation: "Starting Quick Sort...",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'partition_start') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { 
          ...(steps[steps.length - 1]?.currentIndices || {}),
          partitions: payload.partitions, stack: payload.stack 
        },
        currentPhase: `Partition Step: [${payload.low}, ${payload.high}]`,
        stepExplanation: `Processing partition range [${payload.low}, ${payload.high}] in the current Quick Sort stack.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'pivot_chosen') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { 
          ...(steps[steps.length - 1]?.currentIndices || {}),
          pivot: payload.high, left: payload.low, right: payload.right 
        },
        currentPhase: `Partitioning range [${payload.low}, ${payload.high}]`,
        stepExplanation: `Choosing pivot ${payload.pivot} at index ${payload.high}.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'comparing') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: payload.comparisons,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step,
        currentIndices: { 
          ...(steps[steps.length - 1]?.currentIndices || {}),
          left: payload.j, right: payload.i 
        },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Comparing ${payload.arr[payload.j]} at index ${payload.j} with pivot ${payload.pivot}.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'swap_needed') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: payload.comparisons,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step,
        currentIndices: steps[steps.length - 1]?.currentIndices,
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Since ${payload.arr[payload.j]} < pivot, swapping elements at indices ${payload.i} and ${payload.j}.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'swapped' || type === 'pivot_swapped') {
      steps.push({
        array: [...payload.arr],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: payload.swaps,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: steps[steps.length - 1]?.currentIndices,
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: type === 'swapped' 
          ? `Swapped elements at indices ${payload.i} and ${payload.j}.`
          : `Placed pivot ${payload.pivot} into its correct position at index ${payload.i}.`,
        sorted: false, totalSteps: payload.totalSteps,
        isSwapped: true,
      });
    } else if (type === 'no_swap') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: steps[steps.length - 1]?.currentIndices,
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Since ${payload.arr[payload.j]} >= pivot, leaving ${payload.arr[payload.j]} on the right side.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'pivot_swap_needed') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: steps[steps.length - 1]?.currentIndices,
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Placing pivot ${payload.pivot} into its correct position at index ${payload.i}.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'partition_completed') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { 
          ...(steps[steps.length - 1]?.currentIndices || {}),
          partitionIndex: payload.pi, stack: payload.stack, pivot: -1, left: -1, right: -1 
        },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Partition completed. Pivot is now at index ${payload.pi}.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'stack_updated') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { 
          ...(steps[steps.length - 1]?.currentIndices || {}),
          partitions: payload.partitions 
        },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: steps[steps.length - 1]?.stepExplanation || "",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'completed') {
      const last = steps[steps.length - 1] || {};
      steps.push({
        array: payload.arr || last.array || [],
        comparisons: last.comparisons || 0,
        swaps: last.swaps || 0,
        currentStep: payload.step || last.currentStep || 0,
        currentIndices: { pivot: -1, left: -1, right: -1, partitionIndex: -1, stack: [], partitions: [] },
        currentPhase: "Completed",
        stepExplanation: "Array is fully sorted.",
        sorted: true, totalSteps: payload.totalSteps || last.totalSteps,
      });
    }
  }
  return steps;
};

const QuickSortVisualizer = () => {
  const [array, setArray] = useState([]);

  const [visualState, setVisualState] = useState({
    comparisons: 0, swaps: 0, 
    currentIndices: { pivot: -1, left: -1, right: -1, partitionIndex: -1, stack: [], partitions: [] },
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

    if (step.isSwapped) {
      const bars = document.querySelectorAll(".array-bar");
      if (bars.length > 0) {
        gsap.fromTo(
          bars,
          { scale: 1, opacity: 0.8 },
          { scale: 1.05, opacity: 1, duration: 0.2, stagger: 0.05, yoyo: true, repeat: 1 }
        );
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
      currentIndices: { pivot: -1, left: -1, right: -1, partitionIndex: -1, stack: [], partitions: [] },
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

  const handleExplainStep = () => {
    const prompt = `I am currently looking at the Quick Sort algorithm, at step ${engine.currentStep} of ${steps.length}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Current Array State: [${currentStepData?.array?.join(", ") || array.join(", ")}]
Currently comparing: left = ${visualState.currentIndices.left}, right = ${visualState.currentIndices.right}
Pivot index: ${visualState.currentIndices.pivot}
Partition index: ${visualState.currentIndices.partitionIndex}

Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  const renderPartitions = () => {
    if (visualState.currentIndices.partitions.length === 0) return null;

    return (
      <div className="mt-8">
        <div className="space-y-6">
          {visualState.currentIndices.partitions.map((partition, idx) => {
            const subArray = (currentStepData?.array || array).slice(partition.low, partition.high + 1);
            return (
              <div key={idx} className="bg-gray-100 dark:bg-neutral-900 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Partition {idx + 1}: Indexes {partition.low} to {partition.high}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-primary-dark dark:text-blue-200 px-2 py-1 rounded">
                    {subArray.length} elements
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {subArray.map((value, subIdx) => {
                    const originalIndex = partition.low + subIdx;
                    const isPivot = originalIndex === visualState.currentIndices.pivot;
                    const isLeft = originalIndex === visualState.currentIndices.left;
                    const isRight = originalIndex === visualState.currentIndices.right;

                    return (
                      <div key={originalIndex} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-all duration-300 text-sm font-medium
                              ${
                                isPivot
                                  ? "bg-red-400 dark:bg-red-600 border-red-600 dark:border-red-400"
                                  : isLeft
                                  ? "bg-yellow-400 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-400"
                                  : isRight
                                  ? "bg-primary/80 dark:bg-primary border-primary dark:border-primary/80"
                                  : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                              }`}
                        >
                          {value}
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          [{originalIndex}]
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-6 pt-4 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Quick Sort&apos;s divide-and-conquer approach with interactive partitions
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
                {engine.isPlaying ? "Sorting..." : currentStepData?.sorted ? "Restart" : "Start Quick Sort"}
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
              {engine.currentStep > 0 && !visualState.sorted
                ? `Partitioning around pivot at index ${visualState.currentIndices.pivot}`
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

        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Array Visualization</h2>
          {(currentStepData?.array || array).length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {((currentStepData?.array) || array).map((value, index) => {
                const isPivot = index === visualState.currentIndices.pivot;
                const isLeft = index === visualState.currentIndices.left;
                const isRight = index === visualState.currentIndices.right;
                const isPartition = index === visualState.currentIndices.partitionIndex;
                const isInPartition = visualState.currentIndices.partitions.some(
                  (p) => index >= p.low && index <= p.high
                );

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`array-bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isPivot
                                ? "bg-red-400 dark:bg-red-600 border-red-600 dark:border-red-400"
                                : isLeft
                                ? "bg-yellow-400 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-400"
                                : isRight
                                ? "bg-primary/80 dark:bg-primary border-primary dark:border-primary/80"
                                : isPartition
                                ? "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-400"
                                : isInPartition
                                ? "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700"
                                : visualState.sorted
                                ? "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-400"
                                : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {index}
                      {isPivot && " (pivot)"}
                      {isLeft && " (left)"}
                      {isRight && " (right)"}
                      {isPartition && " (partition)"}
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

        <div className="bg-white mt-8 dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Partition Array</h2>
          {renderPartitions()}
        </div>
      </div>
    </main>
  );
};

export default QuickSortVisualizer;

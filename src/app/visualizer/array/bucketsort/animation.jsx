"use client";
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls"; 
import { bucketSortGenerator } from "@/features/algorithms/array/bucketSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const precomputeSteps = (inputArray) => {
    const steps = [];
    if (inputArray.length === 0) return [];
    const generator = bucketSortGenerator([...inputArray]);

    for (const frame of generator) {
        const { type, payload } = frame;
        const lastStep = steps[steps.length - 1] || { 
            array: [...inputArray], 
            buckets: [],
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
                    stepExplanation: "Starting Bucket Sort...",
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'create_buckets':
                steps.push({
                    ...lastStep,
                    buckets: payload.buckets.map(b => [...b]),
                    currentStep: payload.step,
                    currentPhase: "1. Create Buckets",
                    stepExplanation: `Created ${payload.bucketCount} empty buckets.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'find_range':
                steps.push({
                    ...lastStep,
                    currentStep: payload.step,
                    currentPhase: "1. Find Range",
                    stepExplanation: `Found minimum ${payload.min} and maximum ${payload.max} to map values into buckets.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'bucket_insert':
                steps.push({
                    ...lastStep,
                    buckets: payload.buckets.map(b => [...b]),
                    currentStep: payload.step,
                    currentIndices: { distributingElement: payload.value, toBucket: payload.bucketIndex },
                    currentPhase: "2. Distribute Elements",
                    stepExplanation: `Placing element ${payload.value} into bucket ${payload.bucketIndex}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'bucket_sort_start':
                steps.push({
                    ...lastStep,
                    currentStep: payload.step,
                    currentIndices: { sortingBucket: payload.bucketIndex },
                    currentPhase: `3. Sort Buckets (Bucket ${payload.bucketIndex})`,
                    stepExplanation: `Starting insertion sort inside bucket ${payload.bucketIndex}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'bucket_compare':
                steps.push({
                    ...lastStep,
                    buckets: lastStep.buckets.map((bucket, index) =>
                        index === payload.bucketIndex ? [...payload.bucket] : [...bucket]
                    ),
                    comparisons: payload.comparisons,
                    currentStep: payload.step,
                    currentIndices: {
                        sortingBucket: payload.bucketIndex,
                        j: payload.current,
                        compareTo: payload.next,
                    },
                    currentPhase: `3. Sort Buckets (Bucket ${payload.bucketIndex})`,
                    stepExplanation: `Comparing positions ${payload.current} and ${payload.next} inside bucket ${payload.bucketIndex}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'bucket_shift':
            case 'bucket_insert_sorted':
                steps.push({
                    ...lastStep,
                    buckets: lastStep.buckets.map((bucket, index) =>
                        index === payload.bucketIndex ? [...payload.bucket] : [...bucket]
                    ),
                    currentStep: payload.step,
                    currentIndices: { sortingBucket: payload.bucketIndex },
                    currentPhase: `3. Sort Buckets (Bucket ${payload.bucketIndex})`,
                    stepExplanation:
                        type === "bucket_shift"
                            ? `Shifting a larger value to the right inside bucket ${payload.bucketIndex}.`
                            : `Inserted the key into its sorted position inside bucket ${payload.bucketIndex}.`,
                    swaps: payload.swaps ?? lastStep.swaps,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'merge':
                steps.push({
                    ...lastStep,
                    array: [...payload.arr],
                    currentStep: payload.step,
                    currentIndices: { gathering: true, fromBucket: payload.bucketIndex, toIndex: payload.index },
                    currentPhase: "4. Concatenate Buckets",
                    stepExplanation: `Moving ${payload.value} from bucket ${payload.bucketIndex} back to index ${payload.index}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'completed':
                steps.push({
                    ...lastStep,
                    array: [...payload.arr],
                    currentStep: payload.step,
                    currentIndices: {},
                    currentPhase: "Completed",
                    stepExplanation: "Array is fully sorted.",
                    sorted: true,
                    totalSteps: payload.totalSteps,
                });
                break;
            default:
                break;
        }
    }
    return steps;
};

const BucketSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const replayTimerRef = useRef(null);

  const [visualState, setVisualState] = useState({
    buckets: [],
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
      buckets: step.buckets,
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
      buckets: [],
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
    const prompt = `I am currently looking at the Bucket Sort algorithm, at step ${engine.currentStep} of ${steps.length}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Current Array State: [${currentStepData?.array?.join(", ") || array.join(", ")}]
Current Buckets State: ${JSON.stringify(visualState.buckets)}
Current Indices/Pointers: ${JSON.stringify(visualState.currentIndices)}
Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pt-4 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Bucket Sort&apos;s distribution and conquer approach.
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
                {engine.isPlaying ? "Sorting..." : currentStepData?.sorted ? "Restart" : "Start Bucket Sort"}
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
              {(currentStepData?.array || array).map((value, index) => {
                const { distributingElement, toIndex } = visualState.currentIndices;
                const isDistributing = value === distributingElement && !visualState.currentIndices.gathering;
                const isGathering = index === toIndex;

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`array-bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isDistributing
                                ? "bg-red-400 dark:bg-red-600 border-red-600 dark:border-red-400"
                                : isGathering
                                ? "bg-blue-400 dark:bg-blue-600 border-blue-600 dark:border-blue-400"
                                : visualState.sorted
                                ? "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-400"
                                : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
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

        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Buckets</h2>
          {(visualState.buckets && visualState.buckets.length > 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {visualState.buckets.map((bucket, bucketIndex) => {
                const { sortingBucket, toBucket, fromBucket, key, j } = visualState.currentIndices;
                const isSortingThisBucket = sortingBucket === bucketIndex;
                const isReceiving = toBucket === bucketIndex;
                const isGiving = fromBucket === bucketIndex;

                return (
                  <div key={bucketIndex} className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    isSortingThisBucket ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' : 
                    isReceiving ? 'border-red-500 bg-red-50 dark:bg-red-950' : 
                    isGiving ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 
                    'border-gray-300 dark:border-gray-700'
                  }`}>
                    <h3 className="font-bold text-center mb-2 border-b pb-1">Bucket {bucketIndex}</h3>
                    <div className="flex flex-wrap gap-2 justify-center min-h-[3rem]">
                      {bucket.map((value, itemIndex) => {
                        const isKey = isSortingThisBucket && value === key && itemIndex === j + 1;
                        const isComparing = isSortingThisBucket && itemIndex === j;
                        return (
                          <div key={itemIndex} className={`w-10 h-10 flex items-center justify-center rounded border transition-colors duration-200 ${getFontSize(value)}
                            ${
                              isKey ? 'bg-red-300 dark:bg-red-700 border-red-500' :
                              isComparing ? 'bg-yellow-300 dark:bg-yellow-700 border-yellow-500' :
                              'bg-gray-200 dark:bg-gray-700 border-gray-400'
                            }
                          `}>
                            {value}
                          </div>
                        );
                      })}
                      {bucket.length === 0 && <span className="text-xs text-gray-400">empty</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Buckets will appear here during sorting.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BucketSortVisualizer;

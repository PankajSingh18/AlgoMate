"use client";
import React, { useState, useMemo, useCallback } from "react";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { countingSortGenerator } from "@/features/algorithms/array/countingSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const precomputeSteps = (inputArray) => {
  const steps = [];
  const generator = countingSortGenerator(inputArray);
  
  for (const frame of generator) {
    const { type, payload } = frame;
    
    if (type === 'init') {
      steps.push({
        array: [...inputArray],
        counts: [...payload.count],
        output: [...payload.result],
        comparisons: 0, swaps: 0, currentStep: 0,
        currentIndices: { current: -1, countIndex: -1, outputIndex: -1 },
        currentPhase: "", stepExplanation: "Starting Counting Sort...",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'counting_start') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: steps[steps.length - 1]?.counts || [],
        output: steps[steps.length - 1]?.output || [],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { current: -1, countIndex: -1, outputIndex: -1 },
        currentPhase: "Counting Phase",
        stepExplanation: "Scanning the input array and counting how often each value appears.",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'counting') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: steps[steps.length - 1]?.counts || [],
        output: steps[steps.length - 1]?.output || [],
        comparisons: payload.comparisons,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step,
        currentIndices: { current: payload.current, countIndex: payload.countIndex, outputIndex: -1 },
        currentPhase: "Counting Phase",
        stepExplanation: `Incrementing count for value ${payload.value} at index ${payload.value}.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'counted') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: [...payload.count],
        output: steps[steps.length - 1]?.output || [],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: steps[steps.length - 1]?.currentIndices || { current: -1, countIndex: -1, outputIndex: -1 },
        currentPhase: "Counting Phase",
        stepExplanation: steps[steps.length - 1]?.stepExplanation || "",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'prefix_start') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: steps[steps.length - 1]?.counts || [],
        output: steps[steps.length - 1]?.output || [],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { current: -1, countIndex: -1, outputIndex: -1 },
        currentPhase: "Prefix Sum Phase",
        stepExplanation: "Building cumulative counts to determine final sorted positions.",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'prefix') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: steps[steps.length - 1]?.counts || [],
        output: steps[steps.length - 1]?.output || [],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step,
        currentIndices: { current: -1, countIndex: payload.countIndex, outputIndex: -1 },
        currentPhase: "Prefix Sum Phase",
        stepExplanation: `Computing cumulative count for value ${payload.value} (previous total ${payload.prevTotal}).`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'prefixed') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: [...payload.count],
        output: steps[steps.length - 1]?.output || [],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: steps[steps.length - 1]?.currentIndices || { current: -1, countIndex: -1, outputIndex: -1 },
        currentPhase: "Prefix Sum Phase",
        stepExplanation: steps[steps.length - 1]?.stepExplanation || "",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'placement_start') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: steps[steps.length - 1]?.counts || [],
        output: steps[steps.length - 1]?.output || [],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: { current: -1, countIndex: -1, outputIndex: -1 },
        currentPhase: "Placement Phase",
        stepExplanation: "Placing elements into the output array using the count positions.",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'placement') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: steps[steps.length - 1]?.counts || [],
        output: steps[steps.length - 1]?.output || [],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: steps[steps.length - 1]?.swaps || 0,
        currentStep: payload.step,
        currentIndices: { current: payload.current, countIndex: payload.countIndex, outputIndex: payload.position },
        currentPhase: "Placement Phase",
        stepExplanation: `Placing ${payload.value} into output index ${payload.position}.`,
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'placed') {
      steps.push({
        array: steps[steps.length - 1]?.array || [...inputArray],
        counts: [...payload.count],
        output: [...payload.result],
        comparisons: steps[steps.length - 1]?.comparisons || 0,
        swaps: payload.swaps,
        currentStep: payload.step || steps[steps.length - 1]?.currentStep || 0,
        currentIndices: steps[steps.length - 1]?.currentIndices || { current: -1, countIndex: -1, outputIndex: -1 },
        currentPhase: "Placement Phase",
        stepExplanation: steps[steps.length - 1]?.stepExplanation || "",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'completed') {
      const last = steps[steps.length - 1] || {};
      steps.push({
        array: [...payload.arr],
        counts: last.counts || [],
        output: [...payload.result],
        comparisons: last.comparisons || 0,
        swaps: last.swaps || 0,
        currentStep: payload.step || last.currentStep || 0,
        currentIndices: { current: -1, countIndex: -1, outputIndex: -1 },
        currentPhase: "Completed",
        stepExplanation: "Array is fully sorted using Counting Sort.",
        sorted: true, totalSteps: payload.totalSteps || last.totalSteps,
      });
    }
  }
  return steps;
};

const CountingSortVisualizer = () => {
  const [array, setArray] = useState([]);

  const [visualState, setVisualState] = useState({
    counts: [], output: [], comparisons: 0, swaps: 0, 
    currentIndices: { current: -1, countIndex: -1, outputIndex: -1 },
    currentPhase: "", stepExplanation: "", sorted: false, totalSteps: 0,
  });

  const steps = useMemo(() => {
    if (array.length === 0) return [];
    return precomputeSteps(array);
  }, [array]);

  const onStep = useCallback((step) => {
    setVisualState({
      counts: step.counts,
      output: step.output,
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
      counts: [], output: [], comparisons: 0, swaps: 0, 
      currentIndices: { current: -1, countIndex: -1, outputIndex: -1 },
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
    const prompt = `I am currently looking at the Counting Sort algorithm, at step ${engine.currentStep} of ${steps.length}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Input Array State: [${currentStepData?.array?.join(", ") || array.join(", ")}]
Count Array State: [${visualState.counts.join(", ")}]
Output Array State: [${visualState.output.join(", ")}]
Currently processing index: ${visualState.currentIndices.current}
Count index: ${visualState.currentIndices.countIndex}
Output index: ${visualState.currentIndices.outputIndex}

Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Counting Sort as it counts values and places them into sorted order.
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <ArrayGenerator onGenerate={(newArray) => { setArray(newArray); handleReset(); }} disabled={engine.isPlaying} isPrimary={array.length === 0} />
              <CustomArrayInput onUseCustomArray={(newArray) => { setArray(newArray); handleReset(); }} disabled={engine.isPlaying} className="w-full" currentArray={array} />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button onClick={handleStart} disabled={!array.length} className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white">
                {engine.isPlaying ? "Sorting..." : currentStepData?.sorted ? "Restart" : "Start Counting Sort"}
              </button>
              <button onClick={handleReset} disabled={engine.isPlaying} className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base">
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
              <input type="range" min="0.5" max="5" step="0.5" value={engine.speed / 500} onChange={(e) => engine.setSpeed(parseFloat(e.target.value) * 500)} className="w-24 sm:w-32" />
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{engine.speed / 500}x</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Count Operations:</div>
              <div className="text-2xl">{visualState.comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Placements:</div>
              <div className="text-2xl">{visualState.swaps}</div>
            </div>
          </div>

          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">{visualState.totalSteps > 0 ? `${engine.currentStep + 1} / ${steps.length}` : "—"}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{engine.currentStep > 0 && !visualState.sorted ? `Processing index ${visualState.currentIndices.current}` : visualState.sorted ? "Sorting complete!" : "Start sorting to see steps"}</div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Phase:</div>
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">{visualState.currentPhase || (visualState.sorted ? "Completed" : "Ready to start")}</div>
            <div className="font-medium mt-2">Explanation:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{visualState.stepExplanation || (visualState.sorted ? "Array is fully sorted." : "Run the algorithm to see educational hints.")}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Input Array</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {array.map((value, index) => {
                const isCurrent = index === visualState.currentIndices.current;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${getFontSize(value)} font-bold transition-all duration-300 ${isCurrent ? "bg-yellow-400 border-yellow-600" : "bg-primary/80 border-primary"}`}>
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">{engine.isPlaying ? "Sorting..." : "Generate or enter an array to begin"}</div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Count Array</h2>
          {visualState.counts.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {visualState.counts.map((value, index) => {
                const isCountIndex = index === visualState.currentIndices.countIndex;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${getFontSize(value)} font-bold transition-all duration-300 ${isCountIndex ? "bg-pink-400 border-pink-600" : "bg-gray-100 border-gray-300"}`}>
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Counting array will appear here as the algorithm processes values.</div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Output Array</h2>
          {visualState.output.length > 0 ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {visualState.output.map((value, index) => {
                const isOutputIndex = index === visualState.currentIndices.outputIndex;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${getFontSize(value ?? "") } font-bold transition-all duration-300 ${isOutputIndex ? "bg-green-400 border-green-600" : "bg-gray-100 border-gray-300"}`}>
                      {value ?? ""}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">The output array will populate as values are placed into sorted positions.</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CountingSortVisualizer;

"use client";
import React, { useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import RandomArray from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ChallengeModePanel, {
  createOptions,
  useSortingChallenge,
} from "@/app/visualizer/array/components/ChallengeMode";
import { insertionSortGenerator } from "@/features/algorithms/array/insertionSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const createInsertionKeyQuestion = (arr, index) => {
  const correctLabel = `${arr[index]} (index ${index})`;
  const options = createOptions(correctLabel, [
    index > 0 ? `${arr[index - 1]} (index ${index - 1})` : null,
    index + 1 < arr.length ? `${arr[index + 1]} (index ${index + 1})` : null,
    "The first element",
  ]);

  return {
    prompt: "Which element will be inserted next?",
    options,
    correctOptionId: "correct",
    explanation: `Insertion Sort takes the element at index ${index}, ${arr[index]}, and inserts it into the sorted left side.`,
  };
};

const precomputeSteps = (inputArray) => {
  const steps = [];
  const generator = insertionSortGenerator(inputArray);
  
  for (const frame of generator) {
    const { type, payload } = frame;
    if (type === 'init') {
      steps.push({
        array: [...inputArray],
        comparisons: 0, shifts: 0, currentStep: 0,
        currentIndices: { current: 1, comparing: 0, sortedUpTo: 0 },
        currentPhase: "", stepExplanation: "Starting Insertion Sort...",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'phase_start') {
      steps.push({
        array: [...payload.arr],
        comparisons: payload.comparisons,
        shifts: payload.shifts,
        currentStep: payload.step,
        currentIndices: { current: payload.i, comparing: payload.j, sortedUpTo: payload.i - 1 },
        currentPhase: `Pass ${payload.pass} of ${payload.totalPasses}`,
        stepExplanation: `Inserting ${payload.current} from index ${payload.i} into the sorted portion on the left.`,
        sorted: false,
        totalSteps: payload.totalSteps,
        isChallengeStart: true,
        challengeData: createInsertionKeyQuestion(payload.arr, payload.i)
      });
    } else if (type === 'comparing') {
      steps.push({
        array: [...payload.arr],
        comparisons: payload.comparisons,
        shifts: payload.shifts,
        currentStep: payload.step,
        currentIndices: steps[steps.length - 1]?.currentIndices || { current: -1, comparing: -1, sortedUpTo: -1 },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Comparing ${payload.current} with ${payload.arr[payload.j]} at index ${payload.j}.`,
        sorted: false,
        totalSteps: payload.totalSteps,
      });
    } else if (type === 'shifting') {
      steps.push({
        array: [...payload.arr],
        comparisons: payload.comparisons,
        shifts: payload.shifts,
        currentStep: payload.step,
        currentIndices: { current: payload.i, comparing: payload.j - 1, sortedUpTo: payload.i - 1 },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Since ${payload.arr[payload.j+1]} > ${payload.current}, moving ${payload.arr[payload.j+1]} one position ahead.`,
        sorted: false,
        totalSteps: payload.totalSteps,
        isShift: true,
        shiftJ: payload.j
      });
    } else if (type === 'found_insertion_point') {
      steps.push({
        array: [...payload.arr],
        comparisons: payload.comparisons,
        shifts: payload.shifts,
        currentStep: payload.step,
        currentIndices: steps[steps.length - 1]?.currentIndices || { current: -1, comparing: -1, sortedUpTo: -1 },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: payload.j >= 0 
          ? `Found insertion point for ${payload.current} at index ${payload.j + 1}.`
          : `Reached the beginning of the sorted portion. Inserting ${payload.current} at index ${payload.j + 1}.`,
        sorted: false,
        totalSteps: payload.totalSteps,
      });
    } else if (type === 'inserted') {
      steps.push({
        array: [...payload.arr],
        comparisons: payload.comparisons,
        shifts: payload.shifts,
        currentStep: payload.step,
        currentIndices: steps[steps.length - 1]?.currentIndices || { current: -1, comparing: -1, sortedUpTo: -1 },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Placed ${payload.current} into the sorted portion at index ${payload.j + 1}.`,
        sorted: false,
        totalSteps: payload.totalSteps,
        isInserted: true,
        insertI: payload.i,
        insertJ: payload.j
      });
    } else if (type === 'completed') {
      const last = steps[steps.length - 1] || {};
      steps.push({
        array: payload.arr || last.array || [],
        comparisons: payload.comparisons || last.comparisons,
        shifts: payload.shifts || last.shifts,
        currentStep: payload.step || last.currentStep || 0,
        currentIndices: { current: -1, comparing: -1, sortedUpTo: (payload.arr || []).length - 1 },
        currentPhase: "Completed",
        stepExplanation: "Array is fully sorted.",
        sorted: true,
        totalSteps: payload.totalSteps || last.totalSteps,
      });
    }
  }
  return steps;
};

const InsertionSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [challengeEnabled, setChallengeEnabled] = useState(false);
  const {
    activeQuestion,
    askChallenge,
    resetChallengeStats,
    stats: challengeStats,
    submitAnswer,
  } = useSortingChallenge(challengeEnabled);

  const [visualState, setVisualState] = useState({
    comparisons: 0, shifts: 0, currentIndices: { current: -1, comparing: -1, sortedUpTo: -1 },
    currentPhase: "", stepExplanation: "", sorted: false, totalSteps: 0,
  });

  const steps = useMemo(() => {
    if (array.length === 0) return [];
    return precomputeSteps(array);
  }, [array]);

  const onStep = useCallback((step) => {
    setVisualState({
      comparisons: step.comparisons,
      shifts: step.shifts,
      currentIndices: step.currentIndices,
      currentPhase: step.currentPhase,
      stepExplanation: step.stepExplanation,
      sorted: step.sorted,
      totalSteps: step.totalSteps,
    });

    if (step.isChallengeStart && step.challengeData) {
      askChallenge(step.challengeData);
    }

    if (step.isShift && step.shiftJ !== undefined) {
      const bars = document.querySelectorAll(".bar");
      const movingBar = bars[step.shiftJ + 1];
      if (movingBar) {
        gsap.to(movingBar, { y: -20, duration: 0.1 });
        gsap.to(movingBar, { x: "+=70", duration: 0.2, ease: "power2.inOut", delay: 0.1 });
        gsap.to(movingBar, { y: 0, duration: 0.1, delay: 0.3 });
        setTimeout(() => gsap.set(movingBar, { clearProps: "transform" }), 450);
      }
    }

    if (step.isInserted && step.insertI !== undefined && step.insertJ !== undefined) {
      const bars = document.querySelectorAll(".bar");
      const insertBar = bars[step.insertI];
      if (insertBar) {
        const moveX = (step.insertJ + 1 - step.insertI) * 70;
        gsap.to(insertBar, { y: -20, duration: 0.1 });
        gsap.to(insertBar, { x: moveX, duration: 0.2, ease: "power2.inOut", delay: 0.1 });
        gsap.to(insertBar, { y: 0, duration: 0.1, delay: 0.3 });
        setTimeout(() => gsap.set(insertBar, { clearProps: "transform" }), 450);
      }
    }
  }, [askChallenge]);

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
      comparisons: 0, shifts: 0, currentIndices: { current: -1, comparing: -1, sortedUpTo: -1 },
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
    const prompt = `I am currently looking at the Insertion Sort algorithm, at step ${engine.currentStep} of ${steps.length}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Current Array State: [${currentStepData?.array?.join(", ") || array.join(", ")}]
Currently inserting index: ${visualState.currentIndices.current}
Currently comparing with index: ${visualState.currentIndices.comparing}
Sorted up to index: ${visualState.currentIndices.sortedUpTo}

Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Insertion Sort builds the final sorted array.
      </p>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <RandomArray onGenerate={(newArray) => { setArray(newArray); handleReset(); }} disabled={engine.isPlaying} isPrimary={array.length === 0} />
              <CustomArrayInput 
                onUseCustomArray={(newArray) => { 
                  setArray(newArray); 
                  handleReset(); 
                }} 
                disabled={engine.isPlaying}   
                currentArray={array}  
                className="w-full" />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button onClick={handleStart} disabled={!array.length} className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white">
                {engine.isPlaying ? "Sorting..." : currentStepData?.sorted ? "Restart" : "Start Insertion Sort"}
              </button>
              <button 
                onClick={handleReset} disabled={engine.isPlaying} className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base">
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
          
          <ChallengeModePanel
            activeQuestion={activeQuestion}
            disabled={engine.isPlaying}
            enabled={challengeEnabled}
            onEnabledChange={setChallengeEnabled}
            onResetStats={resetChallengeStats}
            onSubmitAnswer={submitAnswer}
            stats={challengeStats}
          />
          
          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-xl sm:text-2xl">{visualState.comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Shifts:</div>
              <div className="text-xl sm:text-2xl">{visualState.shifts}</div>
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {visualState.totalSteps > 0 ? `${engine.currentStep + 1} / ${steps.length}` : "—"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {engine.currentStep > 0 && !visualState.sorted
                ? `Inserting element at index ${visualState.currentIndices.current}`
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
        
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Array Visualization</h2>
          {(currentStepData?.array || array).length > 0 ? (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {((currentStepData?.array) || array).map((value, index) => {
                const isCurrent = index === visualState.currentIndices.current;
                const isComparing = index === visualState.currentIndices.comparing;
                const isSorted = visualState.sorted || index <= visualState.currentIndices.sortedUpTo;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`bar w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 shadow-md dark:shadow-blue-900 transition-all duration-300 ${getFontSize(value)} font-bold
                            ${
                              isCurrent
                                ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 dark:text-gray-900"
                                : isComparing
                                ? "bg-red-400 dark:bg-red-400 border-red-600 dark:border-red-600 dark:text-gray-900"
                                : isSorted
                                ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 dark:text-gray-900"
                                : "bg-primary/80 dark:bg-primary/80 border-primary dark:border-primary dark:text-gray-900"
                            }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-700 dark:text-[#c27cf7] font-semibold">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">{engine.isPlaying ? "Sorting..." : "Generate or enter an array to begin"}</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default InsertionSortVisualizer;

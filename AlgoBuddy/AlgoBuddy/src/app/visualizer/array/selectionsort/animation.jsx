"use client";
import React, { useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ChallengeModePanel, {
  createOptions,
  useSortingChallenge,
} from "@/app/visualizer/array/components/ChallengeMode";
import { selectionSortGenerator } from "@/features/algorithms/array/selectionSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const createSelectionMinimumQuestion = (arr, minIndex, passIndex) => {
  const correctLabel = `${arr[minIndex]} (index ${minIndex})`;
  const options = createOptions(correctLabel, [
    passIndex !== minIndex ? `${arr[passIndex]} (index ${passIndex})` : null,
    minIndex + 1 < arr.length ? `${arr[minIndex + 1]} (index ${minIndex + 1})` : null,
    passIndex + 1 < arr.length ? `${arr[passIndex + 1]} (index ${passIndex + 1})` : null,
  ]);

  return {
    prompt: "Which element is currently minimum for this pass?",
    options,
    correctOptionId: "correct",
    explanation: `${arr[minIndex]} is the minimum from index ${passIndex} to the end, so it will be placed at index ${passIndex}.`,
  };
};

const SelectionSortVisualizer = () => {
    const [array, setArray] = useState([]);
    const [challengeEnabled, setChallengeEnabled] = useState(false);
    
    const [visualState, setVisualState] = useState({
        comparisons: 0,
        swaps: 0,
        totalSteps: 0,
        currentPhase: "",
        stepExplanation: "",
        currentIndices: { i: -1, j: -1, min: -1 }
    });

    const {
      activeQuestion,
      askChallenge,
      resetChallengeStats,
      stats: challengeStats,
      submitAnswer,
    } = useSortingChallenge(challengeEnabled);

    const steps = useMemo(() => {
        if (array.length === 0) return [];
        return Array.from(selectionSortGenerator(array)).map(frame => ({ type: frame.type, ...frame.payload }));
    }, [array]);

    const onStep = useCallback((step) => {
        setVisualState(prev => {
            let next = { ...prev };
            
            if (step.type === 'init') {
                next.totalSteps = step.totalSteps;
            } else if (step.type === 'phase_start') {
                next.currentPhase = `Pass ${step.pass} of ${step.totalPasses}`;
                next.stepExplanation = `Selecting minimum element from the remaining array starting at index ${step.i}.`;
                next.currentIndices = { i: step.i, j: step.i + 1, min: step.minIndex };
            } else if (step.type === 'comparing') {
                next.currentIndices = { ...next.currentIndices, j: step.j, min: step.minIndex };
                next.comparisons = step.comparisons;
                next.stepExplanation = `Comparing ${step.arr[step.j]} at index ${step.j} with current minimum ${step.arr[step.minIndex]} at index ${step.minIndex}.`;
            } else if (step.type === 'new_min') {
                next.currentIndices = { ...next.currentIndices, min: step.minIndex };
                next.stepExplanation = `Found new minimum ${step.arr[step.j]} at index ${step.j}.`;
            } else if (step.type === 'swap_needed') {
                next.stepExplanation = `Swapping minimum ${step.arr[step.minIndex]} into position ${step.i}.`;
            } else if (step.type === 'swapped') {
                next.swaps = step.swaps;
            } else if (step.type === 'no_swap') {
                next.stepExplanation = `Index ${step.i} already contains the minimum element ${step.arr[step.minIndex]}. No swap needed.`;
            } else if (step.type === 'completed') {
                next.currentPhase = "Completed";
                next.stepExplanation = "Array is fully sorted.";
                next.currentIndices = { i: -1, j: -1, min: -1 };
            }
            return next;
        });

        if (step.type === 'swapped') {
            const bars = document.querySelectorAll(".array-bar");
            const barI = bars[step.i];
            const barMin = bars[step.minIndex];
            if (barI && barMin) {
                gsap.to([barI, barMin], { opacity: 0, scale: 0.5, duration: 0.2, onComplete: () => { gsap.to([barI, barMin], { opacity: 1, scale: 1, duration: 0.2 }); } });
            }
        }
    }, []);

    const engine = useAnimationEngine({ steps, onStep, initialSpeed: 1000 });
    const currentStepData = steps[engine.currentStep];
    const displayArray = currentStepData?.arr || array;
    const sorted = currentStepData?.type === 'completed';
    const isSorting = engine.isPlaying || (engine.currentStep > 0 && !sorted);

    const handleGenerateRandomArray = (newArray) => {
      setArray(newArray);
      engine.reset();
      resetStats();
    };
  
    const handleCustomArray = (newArray) => {
      setArray(newArray);
      engine.reset();
      resetStats();
    };
  
    const resetStats = () => {
      setVisualState({ comparisons: 0, swaps: 0, totalSteps: 0, currentPhase: "", stepExplanation: "", currentIndices: { i: -1, j: -1, min: -1 } });
      resetChallengeStats();
    };

    const startSelectionSort = () => {
        if (!array.length) return;
        if (sorted) {
            engine.reset();
            setTimeout(() => engine.play(), 50);
        } else {
            engine.play();
        }
    };

    const reset = () => {
      engine.reset();
      setArray([]);
      resetStats();
    };
  
    useVisualizerKeyboard({
      onStart: startSelectionSort,
      onReset: reset,
      onSpeedChange: (s) => engine.setSpeed(s * 1000),
      onTogglePlayPause: engine.isPlaying ? engine.pause : startSelectionSort,
      speed: engine.speed / 1000,
      sorting: engine.isPlaying,
      sorted: sorted,
    });
  
    const handleExplainStep = () => {
      const prompt = `I am currently looking at the Selection Sort algorithm, at step ${engine.currentStep} of ${visualState.totalSteps}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Current Array State: [${displayArray.join(", ")}]
Currently at: outer index i = ${visualState.currentIndices.i}, inner index j = ${visualState.currentIndices.j}
Current minimum index: ${visualState.currentIndices.min}

Please explain exactly what is happening in this step in detail.`;
      
      window.dispatchEvent(
        new CustomEvent("chatbot-explain", { detail: { prompt } })
      );
    };

    return (
      <main className="container mx-auto px-6 py-6">
        <p className="text-lg max-w-4xl mx-auto text-center text-gray-600 dark:text-gray-400 mb-8">
            Visualize Selection Sort as it repeatedly selects the smallest
            element and swaps it to its correct position in the array.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <ArrayGenerator
                    onGenerate={handleGenerateRandomArray}
                    disabled={isSorting}
                    isPrimary={array.length === 0}
                    defaultSize={10}
                    minValue={5}
                    maxValue={100}
                  />
                  <CustomArrayInput
                    onUseCustomArray={handleCustomArray}
                    disabled={isSorting}
                    placeholder="e.g. 5, 3, 8, 1, 2"
                    currentArray={array}
                  />
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={startSelectionSort}
                    disabled={!array.length}
                    className="w-full bg-[#a435f0] hover:bg-[#8f2cd6] text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
                  >
                    {engine.isPlaying ? "Sorting..." : sorted ? "Restart Selection Sort" : "Start Selection Sort"}
                  </button>
                  <button
                    onClick={reset}
                    disabled={engine.isPlaying}
                    className="w-full bg-transparent border border-[#a435f0] text-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 mt-4 px-4 py-2 rounded transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </div>

              {engine.isPlaying && (
                <PlaybackControls
                  isPlaying={engine.isPlaying}
                  onPlayPause={engine.isPlaying ? engine.pause : startSelectionSort}
                  speed={engine.speed / 1000}
                  onSpeedChange={(s) => engine.setSpeed(s * 1000)}
                  onStepForward={engine.stepForward}
                  onStepBackward={engine.stepBackward}
                  onReset={engine.reset}
                  onExplainStep={handleExplainStep}
                  disabled={steps.length === 0}
                  progressText={`${Math.max(engine.currentStep + 1, 0)} / ${steps.length}`}
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
                    value={engine.speed / 1000}
                    onChange={(e) => engine.setSpeed(parseFloat(e.target.value) * 1000)}
                    className="w-24 sm:w-32"
                    disabled={isSorting}
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{engine.speed / 1000}x</span>
                </div>
              )}

              <ChallengeModePanel
                activeQuestion={activeQuestion}
                disabled={isSorting}
                enabled={challengeEnabled}
                onEnabledChange={setChallengeEnabled}
                onResetStats={resetChallengeStats}
                onSubmitAnswer={submitAnswer}
                stats={challengeStats}
              />

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
                <div className="text-xl font-bold">{visualState.totalSteps > 0 ? `${currentStepData?.step || 0} / ${visualState.totalSteps}` : '—'}</div>
                <div className="text-xs text-gray-500 mt-1">{engine.currentStep > 0 && !sorted ? `Finding minimum from index ${visualState.currentIndices.i}` : sorted ? 'Sorting complete!' : 'Start sorting to see steps'}</div>
              </div>
              <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
                <div className="font-medium">Phase:</div>
                <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                  {visualState.currentPhase || (sorted ? 'Completed' : 'Ready to start')}
                </div>
                <div className="font-medium mt-2">Explanation:</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {visualState.stepExplanation || (sorted ? 'Array is fully sorted.' : 'Run the algorithm to see educational hints.')}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">
                Array Visualization
              </h2>
              {displayArray.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  {displayArray.map((value, index) => {
                    const isCurrent = index === visualState.currentIndices.j;
                    const isMin = index === visualState.currentIndices.min;
                    const isSorted = sorted || index < visualState.currentIndices.i;

                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`array-bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isCurrent
                                ? "bg-yellow-400 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-400"
                                : isMin
                                ? "bg-pink-400 dark:bg-pink-600 border-pink-600 dark:border-pink-400"
                                : isSorted
                                ? "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-400"
                                : "bg-primary/80 dark:bg-primary border-primary dark:border-primary/80"
                            }`}
                        >
                          {value}
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {index === visualState.currentIndices.i && "i"}
                          {index === visualState.currentIndices.j && "j"}
                          {index === visualState.currentIndices.min && "min"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {engine.isPlaying
                    ? "Sorting..."
                    : "Generate or enter an array to begin"}
                </div>
              )}
            </div>
          </div>
        </main>
    );
  };
  
  export default SelectionSortVisualizer;

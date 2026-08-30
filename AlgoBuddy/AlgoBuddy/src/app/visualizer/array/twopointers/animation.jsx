"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import {
  generateStatesPairSum,
  generateStatesRemoveDuplicates,
  generateStatesContainerWater,
  generateStatesThreeSum,
} from "@/features/algorithms/array/twoPointersLogic";

const PROBLEMS = {
  PAIR_SUM: "pair-sum",
  REMOVE_DUPLICATES: "remove-duplicates",
  CONTAINER_WATER: "container-water",
  THREE_SUM: "three-sum",
};

const Animation = () => {
  const [problemType, setProblemType] = useState(PROBLEMS.PAIR_SUM);
  const [inputData, setInputData] = useState("1, 2, 3, 4, 6");
  const [targetValue, setTargetValue] = useState("6");
  
  const [dataArray, setDataArray] = useState([]);
  const [targetNum, setTargetNum] = useState(0);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [visualState, setVisualState] = useState({
    leftPointer: -1,
    rightPointer: -1,
    fixedIndex: -1,
    bestResult: null,
    currentResult: null,
    stepExplanation: "",
    success: false,
    violation: false,
    done: false
  });

  const steps = useMemo(() => {
    if (dataArray.length === 0) return [];
    if (problemType === PROBLEMS.PAIR_SUM) {
      return Array.from(generateStatesPairSum(dataArray, targetNum));
    } else if (problemType === PROBLEMS.REMOVE_DUPLICATES) {
      return Array.from(generateStatesRemoveDuplicates(dataArray));
    } else if (problemType === PROBLEMS.CONTAINER_WATER) {
      return Array.from(generateStatesContainerWater(dataArray));
    } else if (problemType === PROBLEMS.THREE_SUM) {
      return Array.from(generateStatesThreeSum(dataArray));
    }
    return [];
  }, [dataArray, targetNum, problemType]);

  const onStep = useCallback((step) => {
    setVisualState({
      leftPointer: step.left,
      rightPointer: step.right,
      fixedIndex: step.fixedIndex ?? -1,
      currentResult: step.current,
      bestResult: step.best,
      stepExplanation: step.explanation,
      success: step.success || false,
      violation: step.violation || false,
      done: step.done || false
    });
    
    if (step.done) {
        setMessage("Visualization completed.");
        setMessageType("success");
    } else {
        setMessage("");
        setMessageType("");
    }
  }, []);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 1500 });
  const isAnimating = engine.isPlaying || engine.currentStep > 0;

  const handleReset = () => {
    engine.reset();
    setDataArray([]);
    setVisualState({
      leftPointer: -1, rightPointer: -1, fixedIndex: -1,
      bestResult: null, currentResult: null, stepExplanation: "",
      success: false, violation: false, done: false
    });
    setMessage(""); setMessageType("");
  };

  const needsTarget = problemType === PROBLEMS.PAIR_SUM || problemType === PROBLEMS.THREE_SUM;

  const handleGo = (e) => {
    e.preventDefault();
    handleReset();

    if (!inputData) {
      setMessage("Please provide input data."); setMessageType("warning"); return;
    }

    const parsedArray = inputData.split(",").map((s) => parseInt(s.trim()));
    if (parsedArray.some(isNaN)) {
      setMessage("Invalid input. Please provide comma-separated integers."); setMessageType("warning"); return;
    }

    let tNum = 0;
    if (needsTarget) {
      tNum = parseInt(targetValue);
      if (isNaN(tNum)) {
        setMessage("Please provide a valid integer target."); setMessageType("warning"); return;
      }
    }

    setTargetNum(tNum);
    setDataArray(parsedArray);

    setTimeout(() => {
        engine.play();
    }, 50);
  };

  useVisualizerKeyboard({
    onTogglePlayPause: engine.isPlaying ? engine.pause : () => {
        if (dataArray.length > 0) engine.play();
    },
    onStepForward: engine.stepForward,
    onStepBackward: engine.stepBackward,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
    speed: engine.speed / 1000,
    sorting: engine.isPlaying,
    sorted: engine.currentStep === steps.length - 1 && steps.length > 0,
  });

  const getFontSize = (value) => {
    const len = String(value).length;
    if (len <= 1) return "text-xl font-bold";
    if (len <= 2) return "text-lg font-bold";
    return "text-sm font-semibold";
  };

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  const defaultInputs = {
    [PROBLEMS.PAIR_SUM]: { input: "1, 2, 3, 4, 6", target: "6" },
    [PROBLEMS.REMOVE_DUPLICATES]: { input: "1, 1, 2, 3, 3, 4", target: "" },
    [PROBLEMS.CONTAINER_WATER]: { input: "1, 8, 6, 2, 5, 4, 8, 3, 7", target: "" },
    [PROBLEMS.THREE_SUM]: { input: "-4, -1, -1, 0, 1, 2", target: "" },
  };

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
        Visualize how the Two Pointers technique efficiently solves array problems
        using left and right pointers moving toward or away from each other.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm"
      >
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Select Problem
          </label>
          <select
            value={problemType}
            onChange={(e) => {
              const val = e.target.value;
              setProblemType(val);
              handleReset();
              setInputData(defaultInputs[val].input);
              setTargetValue(defaultInputs[val].target);
            }}
            disabled={isAnimating}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
          >
            <optgroup label="Opposite Direction">
              <option value={PROBLEMS.PAIR_SUM}>Pair Sum (Sorted Array)</option>
              <option value={PROBLEMS.CONTAINER_WATER}>Container With Most Water</option>
              <option value={PROBLEMS.THREE_SUM}>Three Sum</option>
            </optgroup>
            <optgroup label="Same Direction">
              <option value={PROBLEMS.REMOVE_DUPLICATES}>
                Remove Duplicates from Sorted Array
              </option>
            </optgroup>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="inputData"
            >
              Array Elements (comma-separated)
            </label>
            <input
              type="text"
              id="inputData"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300 font-mono"
              placeholder="e.g., 1, 2, 3, 4, 6"
              disabled={isAnimating}
            />
          </div>

          {needsTarget && (
            <div className="w-full md:w-1/3">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="targetValue"
              >
                Target Sum
              </label>
              <input
                type="number"
                id="targetValue"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300 font-mono"
                placeholder="e.g., 6"
                disabled={isAnimating}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
          <ResetButton onReset={handleReset} isAnimating={isAnimating} />
        </div>

        {isAnimating && (
          <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
            <PlaybackControls
                isPlaying={engine.isPlaying}
                onPlayPause={engine.isPlaying ? engine.pause : () => engine.play()}
                speed={engine.speed / 1000}
                onSpeedChange={(s) => engine.setSpeed(s * 1000)}
                onStepForward={engine.stepForward}
                onStepBackward={engine.stepBackward}
                onReset={engine.reset}
                onExplainStep={() => {}}
                disabled={steps.length === 0}
                progressText={`${Math.max(engine.currentStep + 1, 0)} / ${steps.length}`}
            />
          </div>
        )}
      </form>

      {message && (
        <div className={`max-w-4xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {dataArray.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
                <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
                  Current Step
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-mono min-h-[3rem]">
                {visualState.stepExplanation || "Ready to begin..."}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-2 gap-4 text-center">
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Current State
                </h4>
                <div className="text-xl font-bold text-gray-800 dark:text-gray-100 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {visualState.currentResult !== null ? visualState.currentResult : "-"}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Best Result
                </h4>
                <div className="text-xl font-bold text-[#a435f0] dark:text-[#c56eff] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {visualState.bestResult !== null ? visualState.bestResult : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md overflow-x-auto border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-10 text-center">
              Two Pointers Visualization
            </h2>

            <div className="flex gap-2 justify-center min-w-max pb-10 px-4">
              {dataArray.map((element, index) => {
                const isLeft = index === visualState.leftPointer;
                const isRight = index === visualState.rightPointer;
                const isFixed = index === visualState.fixedIndex;
                const isActive = isLeft || isRight || isFixed;

                let bgColor = "bg-[#E5E7EB]";
                let borderColor = "border-[#D1D5DB]";
                let textColor = "text-[#4B5563]";

                if (isFixed) {
                    bgColor = "bg-[#CCFBF1]"; borderColor = "border-[#14B8A6]"; textColor = "text-[#0F766E]";
                } else if (isActive && visualState.success) {
                    bgColor = "bg-[#DCFCE7]"; borderColor = "border-[#22C55E]"; textColor = "text-[#166534]";
                } else if (isActive && visualState.violation) {
                    bgColor = "bg-[#FEE2E2]"; borderColor = "border-[#EF4444]"; textColor = "text-[#991B1B]";
                } else if (isLeft) {
                    bgColor = "bg-[#F3E8FF]"; borderColor = "border-[#A855F7]"; textColor = "text-[#6B21A8]";
                } else if (isRight) {
                    bgColor = "bg-[#E0E7FF]"; borderColor = "border-[#6366F1]"; textColor = "text-[#3730A3]";
                } else if (visualState.done && isActive) {
                    bgColor = "bg-[#F3E8FF]"; borderColor = "border-[#A855F7]"; textColor = "text-[#6B21A8]";
                }

                return (
                  <div key={index} className="flex flex-col items-center relative">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg border-2 transition-colors duration-200 ${getFontSize(element)} shadow-sm ${bgColor} ${borderColor} ${textColor}`}
                    >
                      {element}
                    </div>

                    <div className="mt-2 text-xs text-gray-400 font-mono h-4">
                      {index}
                    </div>

                    <div className="absolute -bottom-10 flex flex-col items-center gap-1 w-full">
                      {isFixed && (
                        <div className="text-teal-600 font-bold text-xs bg-teal-50 px-2 py-0.5 rounded shadow-sm border border-teal-300">
                          i
                        </div>
                      )}
                      {isLeft && !isFixed && (
                        <div className="text-[#a435f0] font-bold text-xs bg-[#a435f0]/10 px-2 py-0.5 rounded shadow-sm border border-[#a435f0]/30 animate-bounce">
                          L
                        </div>
                      )}
                      {isRight && !isFixed && (
                        <div
                          className="text-indigo-600 font-bold text-xs bg-indigo-50 px-2 py-0.5 rounded shadow-sm border border-indigo-300 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        >
                          R
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#F3E8FF] border border-[#A855F7]"></div>
                Left Pointer (L)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#E0E7FF] border border-[#6366F1]"></div>
                Right Pointer (R)
              </div>
              {problemType === PROBLEMS.THREE_SUM && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#CCFBF1] border border-[#14B8A6]"></div>
                  Fixed Element (i)
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#DCFCE7] border border-[#22C55E]"></div>
                Match Found
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#FEE2E2] border border-[#EF4444]"></div>
                Duplicate
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#E5E7EB] border border-[#D1D5DB]"></div>
                Unvisited
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Animation;

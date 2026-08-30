"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import GoButton from "@/app/components/ui/goButton";
import ResetButton from "@/app/components/ui/resetButton";
import { saveToStorage, loadFromStorage, removeFromStorage } from "@/utils/storage";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { binarySearchGenerator } from "@/features/algorithms/array/binarySearchLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const BinarySearch = () => {
  const [arrayElements, setArrayElements] = useState(() =>
    loadFromStorage("binary-array-elements", "")
  );
  const [target, setTarget] = useState(() =>
    loadFromStorage("binary-target", "")
  );
  const [array, setArray] = useState([]);
  const [targetValue, setTargetValue] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [autoSort, setAutoSort] = useState(false);
  const [showAutoSort, setShowAutoSort] = useState(false);

  const [visualState, setVisualState] = useState({
    i: -1,
    j: -1,
    mid: -1,
    foundIndex: -1,
    stepExplanation: "",
    stepCount: 0
  });

  useEffect(() => { saveToStorage("binary-array-elements", arrayElements); }, [arrayElements]);
  useEffect(() => { saveToStorage("binary-target", target); }, [target]);

  const steps = useMemo(() => {
    if (array.length === 0 || targetValue === null) return [];
    return Array.from(binarySearchGenerator(array, targetValue));
  }, [array, targetValue]);

  const onStep = useCallback((step) => {
    let explanation = "";
    let msg = "";
    let msgType = "";
    
    if (step.type === 'checking') {
      explanation = `Step ${step.step}: low=${step.l}, high=${step.h} → mid = ⌊(${step.l} + ${step.h}) / 2⌋ = ${step.m}. Comparing arr[${step.m}] = ${step.arrM} with target ${targetValue}.`;
    } else if (step.type === 'found') {
      explanation = `✓ arr[${step.m}] = ${targetValue} equals target ${targetValue}. Found at index ${step.m} after ${step.step} step${step.step > 1 ? "s" : ""}!`;
      msg = `Element ${targetValue} found at index ${step.m}!`;
      msgType = "success";
    } else if (step.type === 'discard_left') {
      explanation = `arr[${step.m}] < target ${targetValue} → target is in the RIGHT half. Discard left side. New low = ${step.m + 1}.`;
    } else if (step.type === 'discard_right') {
      explanation = `arr[${step.m}] > target ${targetValue} → target is in the LEFT half. Discard right side. New high = ${step.m - 1}.`;
    } else if (step.type === 'not_found') {
      explanation = `Search range exhausted (low > high). The element ${targetValue} does not exist in this array.`;
      msg = `Element ${targetValue} not found in the array.`;
      msgType = "error";
    }

    setVisualState({
      i: step.l !== undefined ? step.l : -1,
      j: step.h !== undefined ? step.h : -1,
      mid: step.m !== undefined ? step.m : -1,
      foundIndex: step.type === 'found' ? step.m : -1,
      stepExplanation: explanation,
      stepCount: step.step || 0
    });
    
    if (msg) setMessage(msg);
    if (msgType) setMessageType(msgType);
  }, [targetValue]);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 1000 });
  const isAnimating = engine.isPlaying || engine.currentStep > 0;

  const handleReset = () => {
    engine.reset();
    removeFromStorage("binary-array-elements");
    removeFromStorage("binary-target");
    setArray([]); setTargetValue(null);
    setMessage(""); setMessageType(""); 
    setVisualState({ i: -1, j: -1, mid: -1, foundIndex: -1, stepExplanation: "", stepCount: 0 });
    setAutoSort(false); setShowAutoSort(false);
    setArrayElements(""); setTarget("");
  };

  const generateRandomArray = () => {
    if (isAnimating) return;
    const size = Math.floor(Math.random() * 6) + 5;
    const elements = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);
    setArrayElements(elements.join(", "));
  };

  const handleGo = (e) => {
    e.preventDefault();
    engine.reset();
    setMessage(""); setMessageType("");
    setVisualState({ i: -1, j: -1, mid: -1, foundIndex: -1, stepExplanation: "", stepCount: 0 });

    if (!arrayElements || !target) {
      setMessage("Please fill in all fields."); setMessageType("warning"); return;
    }
    const rawElements = arrayElements.split(",").map((el) => el.trim());
    if (rawElements.some((el) => el.includes("."))) {
      setMessage("Only integers are supported. Please remove decimal values."); setMessageType("warning"); return;
    }
    const elements = rawElements.map((el) => parseInt(el));
    const targetVal = parseInt(target);
    if (elements.some(isNaN) || isNaN(targetVal)) {
      setMessage("Invalid array elements or target."); setMessageType("warning"); return;
    }
    const isSorted = elements.every((el, idx) => idx === 0 || el >= elements[idx - 1]);
    if (!isSorted && !autoSort) {
      setMessage("Array must be sorted in ascending order."); setMessageType("warning");
      setShowAutoSort(true); return;
    }
    let processedElements = [...elements];
    if (!isSorted && autoSort) {  
      processedElements.sort((a, b) => a - b);
      setArrayElements(processedElements.join(", "));
      setShowAutoSort(false);
    }
    
    setTargetValue(targetVal);
    setArray(processedElements);
    
    setTimeout(() => {
        engine.play();
    }, 50);
  };

  useVisualizerKeyboard({
    onTogglePlayPause: engine.isPlaying ? engine.pause : () => {
        if (array.length > 0) engine.play();
    },
    onStepForward: engine.stepForward,
    onStepBackward: engine.stepBackward,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
    speed: engine.speed / 1000,
    sorting: engine.isPlaying,
    sorted: engine.currentStep === steps.length - 1 && steps.length > 0,
  });

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Binary Search efficiently finds an element in a sorted array.
      </p>
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="arrayElements">
            Sorted Array Elements (comma-separated)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="arrayElements"
              value={arrayElements}
              onChange={(e) => setArrayElements(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="e.g., 1, 3, 4, 6, 8"
              disabled={isAnimating}
            />
            <button
              type="button"
              onClick={generateRandomArray}
              className="px-4 py-2 font-bold bg-[#a435f0] text-white rounded-lg hover:bg-[#8f2cd6] transition-all duration-200"
              disabled={isAnimating}
            >
              Random
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="target">
            Target Element
          </label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input
              type="number"
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="eg. 4"
              disabled={isAnimating}
            />
            <div className="flex gap-2 w-full">
              <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
              <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            </div>
          </div>
        </div>

        {isAnimating && (
          <div className="mt-4">
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
        <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}>
          <p className="text-center font-medium">{message}</p>
          {showAutoSort && (
            <div className="mt-3 flex justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSort}
                  onChange={(e) => setAutoSort(e.target.checked)}
                />
                <span>Auto-sort the array for me</span>
              </label>
            </div>
          )}
        </div>
      )}

      {array.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          {visualState.stepExplanation && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2 border-b border-[#a435f0]/20">
                <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
                <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
                  Step Explanation
                </span>
                {visualState.stepCount > 0 && (
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    Iteration #{visualState.stepCount}
                  </span>
                )}
              </div>
              <div className="px-4 py-3">
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-mono">
                  {visualState.stepExplanation}
                </p>
              </div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span><span className="font-semibold text-yellow-600 dark:text-yellow-400">■ Yellow</span> = mid index</span>
                <span><span className="font-semibold text-primary dark:text-[#c27cf7]">■ Blue</span> = active search range</span>
                <span><span className="font-semibold text-gray-400">■ Gray</span> = eliminated</span>
                <span><span className="font-semibold text-green-500">■ Green</span> = found</span>
              </div>
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Array Visualization
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {array.map((element, index) => {
                const labels = [];
                if (index === visualState.i) labels.push("low");
                if (index === visualState.mid) labels.push("mid");
                if (index === visualState.j) labels.push("high");
                
                let bgColor = "bg-[#E5E7EB] dark:bg-gray-700";
                let borderColor = "border-[#D1D5DB] dark:border-gray-600";
                
                if (index === visualState.foundIndex) {
                  bgColor = "bg-[#22C55E]";
                  borderColor = "border-[#15803D]";
                } else if (index === visualState.mid) {
                  bgColor = "bg-[#EAB308]";
                  borderColor = "border-[#A16207]";
                } else if (visualState.i !== -1 && visualState.j !== -1 && index >= visualState.i && index <= visualState.j) {
                  bgColor = "bg-[#93C5FD]";
                  borderColor = "border-[#3B82F6]";
                }

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(element)} font-medium ${bgColor} ${borderColor}`}
                    >
                      {element}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-center font-mono h-6">
                      {labels.map((label, idx) => (
                        <div
                          key={idx}
                          className={
                            label === "mid"
                              ? "text-yellow-600 dark:text-yellow-400 font-semibold"
                              : label === "low" || label === "high"
                              ? "text-primary dark:text-[#c27cf7] font-semibold"
                              : ""
                          }
                        >
                          {label}
                        </div>
                      ))}
                      <div className="text-gray-400 dark:text-gray-600 text-[10px]">[{index}]</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BinarySearch;
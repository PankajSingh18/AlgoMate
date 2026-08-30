"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import GoButton from "@/app/components/ui/goButton";
import ResetButton from "@/app/components/ui/resetButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { linearSearchGenerator } from "@/features/algorithms/array/linearSearchLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const LinearSearch = () => {
  const [arrayElements, setArrayElements] = useState("");
  const [target, setTarget] = useState("");
  const [array, setArray] = useState([]);
  const [targetValue, setTargetValue] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [visualState, setVisualState] = useState({
    currentIndex: -1,
    foundIndex: -1
  });

  const steps = useMemo(() => {
    if (array.length === 0 || targetValue === null) return [];
    return Array.from(linearSearchGenerator(array, targetValue));
  }, [array, targetValue]);

  const onStep = useCallback((step) => {
    let msg = "";
    let msgType = "";
    
    if (step.type === 'found') {
      msg = `Element ${targetValue} found at index ${step.index}!`;
      msgType = "success";
    } else if (step.type === 'not_found') {
      msg = `Element ${targetValue} not found in the array.`;
      msgType = "error";
    }

    setVisualState({
      currentIndex: step.index !== undefined ? step.index : -1,
      foundIndex: step.type === 'found' ? step.index : -1
    });
    
    if (msg) setMessage(msg);
    if (msgType) setMessageType(msgType);
  }, [targetValue]);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 1000 });
  const isAnimating = engine.isPlaying || engine.currentStep > 0;

  const handleReset = () => {
    engine.reset();
    setArray([]); setTargetValue(null);
    setMessage(""); setMessageType(""); 
    setVisualState({ currentIndex: -1, foundIndex: -1 });
    setArrayElements(""); setTarget("");
  };

  const generateRandomArray = () => {
    if (isAnimating) return;
    const size = Math.floor(Math.random() * 4) + 2;
    const elements = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    );
    setArrayElements(elements.join(", "));
  };

  const handleGo = (e) => {
    e.preventDefault();
    engine.reset();
    setMessage(""); setMessageType("");
    setVisualState({ currentIndex: -1, foundIndex: -1 });

    if (!arrayElements || !target) {
      setMessage("Please fill in all fields."); setMessageType("warning"); return;
    }
    const rawElements = arrayElements.split(",").map((el) => el.trim());
    if (rawElements.some((el) => el.includes("."))) {
      setMessage("Only integers are supported. Please remove decimal values."); setMessageType("warning"); return;
    }
    const elements = rawElements.map((el) => parseInt(el));
    const targetVal = parseInt(target);
    if (target.includes(".") || elements.some(isNaN) || isNaN(targetVal)) {
      setMessage(target.includes(".") ? "Only integers are supported. Please remove decimal values." : "Invalid array elements or target.");
      setMessageType("warning"); return;
    }
    
    setTargetValue(targetVal);
    setArray(elements);
    
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
        Visualize how Linear Search works by sequentially checking each element in an array.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="arrayElements">
            Array Elements (comma-separated)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="arrayElements"
              value={arrayElements}
              onChange={(e) => setArrayElements(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 dark:focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="eg. 3, 1, 4, 1, 5"
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
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 dark:focus:ring-[#a435f0]/30 transition duration-300"
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
        </div>
      )}

      {array.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Array Visualization</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {array.map((element, index) => {
                let bgColor = "bg-gray-200 dark:bg-gray-900";
                let borderColor = "border-gray-300 dark:border-gray-600";
                let textColor = "text-gray-800 dark:text-white";

                if (visualState.foundIndex === index) {
                    bgColor = "bg-green-500 dark:bg-green-600";
                    borderColor = "border-green-700 dark:border-green-400";
                } else if (visualState.currentIndex === index && visualState.foundIndex === -1) {
                    bgColor = "bg-yellow-500 dark:bg-yellow-600";
                    borderColor = "border-yellow-700 dark:border-yellow-400";
                } else if (index < visualState.currentIndex || (visualState.foundIndex === -1 && visualState.currentIndex === -1 && engine.currentStep === steps.length - 1)) {
                    bgColor = "bg-[#c27cf7] dark:bg-blue-700";
                    borderColor = "border-primary dark:border-primary/80";
                }

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(element)} font-medium ${bgColor} ${borderColor} ${textColor}`}
                    >
                      {element}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">[{index}]</div>
                  </div>
                );
            })}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 dark:bg-yellow-600 rounded mr-2"></div>
              <span className="text-sm">Current Element</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded mr-2"></div>
              <span className="text-sm">Found Element</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#c27cf7] dark:bg-blue-700 rounded mr-2"></div>
              <span className="text-sm">Checked Elements</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-900 rounded mr-2"></div>
              <span className="text-sm">Unchecked Elements</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LinearSearch;

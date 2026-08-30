"use client";
import { useState, useEffect, useRef } from "react";
import StackFrame from "./StackFrame";
import ControlPanel from "./ControlPanel";
import { generateSteps } from "../utils/factorialGenerator";

export default function CallStackVisualizer() {
  const [input, setInput] = useState(4);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stack, setStack] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const handleStart = () => {
    const generatedSteps = generateSteps(input);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setStack([]);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (currentStep < 0 || currentStep >= steps.length) return;
    const step = steps[currentStep];

    if (step.type === "call") {
      setStack((prev) => [...prev, step]);
    } else if (step.type === "return") {
      setStack((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            returnValue: step.returnValue,
          };
        }
        return updated;
      });
      setTimeout(() => {
        setStack((prev) => prev.slice(0, -1));
      }, 500);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setStack([]);
      setCurrentStep((p) => p - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setStack([]);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex items-center gap-3">
        <label className="text-gray-300 font-mono">factorial(</label>
        <input
          type="number"
          min={1}
          max={8}
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
          className="w-16 text-center bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
        />
        <label className="text-gray-300 font-mono">)</label>
        <button
          onClick={handleStart}
          className="ml-2 px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded"
        >
          Start
        </button>
      </div>

      {steps.length > 0 && (
        <div className="text-gray-400 text-sm">
          Step {Math.max(currentStep + 1, 0)} / {steps.length} | Stack Depth:{" "}
          {stack.length}
        </div>
      )}

      <div className="flex flex-col-reverse items-center gap-2 min-h-64 border border-dashed border-gray-600 rounded-lg p-4 w-72">
        {stack.map((frame, idx) => (
          <StackFrame
            key={`${frame.fn}-${idx}`}
            frame={frame}
            isActive={idx === stack.length - 1}
          />
        ))}
        {stack.length === 0 && (
          <p className="text-gray-600 text-sm">Stack Empty</p>
        )}
      </div>

      <ControlPanel
        onPrev={handlePrev}
        onNext={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={handleReset}
        isPlaying={isPlaying}
        canNext={currentStep < steps.length - 1}
        canPrev={currentStep > 0}
      />
    </div>
  );
}
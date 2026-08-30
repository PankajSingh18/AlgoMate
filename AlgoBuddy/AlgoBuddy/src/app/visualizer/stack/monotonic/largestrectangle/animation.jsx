"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { largestRectangleGenerator } from "@/features/algorithms/stack/largestRectangleLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const Animation = () => {
  const [inputData, setInputData] = useState("2, 1, 5, 6, 2, 3");
  const [dataArray, setDataArray] = useState([]);
  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const barRefs = useRef([]);

  const [steps, setSteps] = useState([]);
  const [visualState, setVisualState] = useState({
    currentIndex: -1, stack: [], maxArea: 0, currentRect: null,
    explanation: "", done: false
  });

  const onStep = useCallback((state) => {
    setVisualState({
      currentIndex: state.currentIndex,
      stack: state.stack,
      maxArea: state.maxArea,
      currentRect: state.currentRect,
      explanation: state.explanation,
      done: state.done
    });

    barRefs.current.forEach((ref, index) => {
      if (!ref) return;
      if (state.currentRect) {
        if (index >= state.currentRect.leftBoundary && index <= state.currentRect.rightBoundary) {
            gsap.to(ref, { backgroundColor: "#c56eff", borderColor: "#a435f0", duration: 0.2 });
        } else {
            gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", duration: 0.2 });
        }
      } else {
        if (index === state.currentIndex && state.currentIndex < dataArray.length) {
            gsap.to(ref, { backgroundColor: "#FCD34D", borderColor: "#F59E0B", duration: 0.2 });
        } else {
            gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", duration: 0.2 });
        }
      }
    });

    if (state.done) {
      setMessage("Visualization completed.");
      setMessageType("success");
    } else {
      setMessage("");
      setMessageType("");
    }
  }, [dataArray.length]);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 1000 });
  const currentStepData = steps[engine.currentStep];

  const handleReset = useCallback(() => {
    engine.reset();
    setDataArray([]);
    setVisualState({
      currentIndex: -1, stack: [], maxArea: 0, currentRect: null,
      explanation: "", done: false
    });
    setSteps([]);
    setMessage("");
    setMessageType("");
    
    barRefs.current.forEach((ref) => {
      if (ref) {
        gsap.killTweensOf(ref);
        gsap.to(ref, { opacity: 1, backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", duration: 0 });
      }
    });
  }, [engine]);

  const handleGo = (e) => {
    e.preventDefault();
    handleReset();
    
    if (!inputData) {
      setMessage("Please provide input data.");
      setMessageType("warning");
      return;
    }

    const parsedArray = inputData.split(',').map(s => parseInt(s.trim()));
    if (parsedArray.some(isNaN) || parsedArray.some(v => v < 0)) {
      setMessage("Invalid elements. Please provide comma-separated positive integers.");
      setMessageType("warning");
      return;
    }

    setDataArray(parsedArray);
    
    const generatedStates = Array.from(largestRectangleGenerator(parsedArray));
    setSteps(generatedStates);
    setTimeout(() => {
      engine.play();
    }, 50);
  };

  useVisualizerKeyboard({
    onStart: handleGo,
    onReset: handleReset,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
    onTogglePlayPause: engine.isPlaying ? engine.pause : engine.play,
    speed: engine.speed / 500,
    sorting: engine.isPlaying,
    sorted: currentStepData?.done || false,
  });

  const maxVal = dataArray.length > 0 ? Math.max(...dataArray, 1) : 1; 

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
        Visualize how a Monotonic Increasing Stack is used to find the Largest Rectangle in a Histogram in O(N) time.
      </p>
      
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="inputData">
              Histogram Heights (comma-separated)
            </label>
            <input
              type="text"
              id="inputData"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300 font-mono"
              placeholder="e.g., 2, 1, 5, 6, 2, 3"
              disabled={engine.isPlaying || dataArray.length > 0 && !currentStepData?.done}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <GoButton onClick={handleGo} isAnimating={engine.isPlaying || (dataArray.length > 0 && !visualState.done)} disabled={engine.isPlaying} />
          <ResetButton onReset={handleReset} isAnimating={engine.isPlaying || dataArray.length > 0} />
        </div>

        {(engine.isPlaying || dataArray.length > 0) && (
          <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
            <PlaybackControls
              isPlaying={engine.isPlaying}
              onPlayPause={engine.isPlaying ? engine.pause : engine.play}
              speed={engine.speed / 500}
              onSpeedChange={(s) => engine.setSpeed(s * 500)}
              onStepForward={engine.stepForward}
              onStepBackward={engine.stepBackward}
              onReset={handleReset}
              disabled={steps.length === 0}
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
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
                        <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
                        Current Step
                        </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-mono min-h-[3rem]">
                        {visualState.explanation || "Ready to begin..."}
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-3 gap-4 text-center">
                    <div>
                        <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Current Index `i`</h4>
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-mono">
                        {visualState.currentIndex !== -1 && visualState.currentIndex <= dataArray.length ? visualState.currentIndex : "-"}
                        </div>
                    </div>
                    <div className="col-span-2 border-l border-gray-200 dark:border-gray-700 pl-4">
                        <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Max Area Found</h4>
                        <div className="text-2xl font-bold text-[#a435f0] dark:text-[#c56eff] font-mono">
                        {visualState.maxArea}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                <h4 className="text-center font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2 dark:border-gray-700">Monotonic Stack (Indices)</h4>
                <div className="flex-1 flex flex-col-reverse justify-start items-center overflow-y-auto max-h-[250px] gap-2 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded">
                    {visualState.stack.length === 0 ? (
                        <div className="text-gray-400 dark:text-gray-500 text-sm font-mono my-auto">Empty Stack</div>
                    ) : (
                        visualState.stack.map((stackVal, idx) => (
                            <div key={idx} className={`w-full max-w-[120px] p-2 text-center rounded border-2 ${idx === visualState.stack.length - 1 ? 'bg-[#a435f0] text-white border-[#8a2be2]' : 'bg-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white'}`}>
                                <div className="text-xs opacity-75">Index: {stackVal}</div>
                                <div className="font-bold">Height: {dataArray[stackVal]}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 relative">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Histogram Visualization
            </h2>
            
            <div className="flex items-end justify-center gap-1 md:gap-2 h-64 md:h-80 w-full px-4 border-b-2 border-gray-800 dark:border-gray-400 relative">
              {visualState.currentRect && (
                  <div 
                     className="absolute bottom-0 bg-[#a435f0] opacity-30 border-2 border-[#8a2be2] z-10 transition-all duration-300"
                     style={{
                         height: `${(visualState.currentRect.height / maxVal) * 100}%`,
                         left: `calc(${(visualState.currentRect.leftBoundary / dataArray.length) * 100}% + 1rem)`,
                         width: `calc(${(visualState.currentRect.width / dataArray.length) * 100}% - 2rem)`, 
                     }}
                  >
                  </div>
              )}
              
              {dataArray.map((height, index) => {
                const heightPercentage = (height / maxVal) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center justify-end h-full flex-1 max-w-[80px] z-20 group relative">
                    <div className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300 transition-opacity">
                        {height}
                    </div>
                    <div
                      ref={(el) => (barRefs.current[index] = el)}
                      className="w-full rounded-t-sm border-2 shadow-sm transition-all duration-300 relative"
                      style={{ 
                          height: `${Math.max(heightPercentage, 2)}%`,
                          backgroundColor: "#E5E7EB", 
                          borderColor: "#D1D5DB" 
                      }} 
                    >
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-mono">
                      {index}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-12 flex justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium flex-wrap">
               <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#E5E7EB] border border-[#D1D5DB]"></div> Default Bar</div>
               <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#FCD34D] border border-[#F59E0B]"></div> Processing Index</div>
               <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#c56eff] border border-[#a435f0]"></div> Area Included in Pop</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Animation;

"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { 
  generateStatesFixedMax, 
  generateStatesFixedAvg, 
  generateStatesVarLongestSub, 
  generateStatesVarSmallestSub 
} from "@/features/algorithms/array/slidingWindowLogic";

const PROBLEMS = {
  FIXED_MAX: "fixed-max",
  FIXED_AVG: "fixed-avg",
  VAR_LONGEST_SUB: "var-longest-sub",
  VAR_SMALLEST_SUB: "var-smallest-sub",
};

// Define component BEFORE using it
const Animation = () => {
  const [problemType, setProblemType] = useState(PROBLEMS.FIXED_MAX);
  const [inputData, setInputData] = useState("2, 1, 5, 1, 3, 2");
  const [targetValue, setTargetValue] = useState("3");
  
  const [dataArray, setDataArray] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [discussion, setDiscussion] = useState("");

  const elementRefs = useRef([]);
  
  const [isAnimating, setIsAnimating] = useState(false);

  const visualizerRef = useRef(null);
  const animationRef = useRef(null);
  const wasPausedRef = useRef(false);
  const stateQueueRef = useRef([]);
  const currentStateIdxRef = useRef(0);
  
  const [steps, setSteps] = useState([]);
  const [visualState, setVisualState] = useState({
    left: -1, right: -1, current: null, best: null,
    explanation: "", activeWindow: [-1, -1],
    violation: false, success: false, done: false
  });

  // Define callback handlers BEFORE using them
  const handleStep = useCallback((state) => {
    setVisualState({
      left: state.left,
      right: state.right,
      current: state.current,
      best: state.best,
      explanation: state.explanation,
      activeWindow: state.activeWindow,
      violation: state.violation,
      success: state.success,
      done: state.done
    });
  }, []);

  const engine = useAnimationEngine({ steps, onStep: handleStep, initialSpeed: 1000 });
  const currentStepData = steps[engine.currentStep];

  const handleReset = useCallback(() => {
    engine.reset();
    setDataArray([]);
    setVisualState({
      left: -1, right: -1, current: null, best: null,
      explanation: "", activeWindow: [-1, -1],
      violation: false, success: false, done: false
    });
    setSteps([]);
    setMessage("");
    setMessageType("");
    setIsAnimating(false);
    
    elementRefs.current.forEach((ref) => {
      if (ref) {
        gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", color: "#1F2937", duration: 0 });
      }
    });
  }, [engine]);

  // Animate the element background and border colors whenever visualState changes
  useEffect(() => {
    // Call any reset initialization logic here if needed
  }, []);

  const animateStep = useCallback(() => {
    if (currentStateIdxRef.current >= stateQueueRef.current.length) {
      setIsAnimating(false);
      setMessage("Visualization completed.");
      setMessageType("success");
      setShowQuiz(true);
      return;
    }

    const state = stateQueueRef.current[currentStateIdxRef.current];
    const delay = 1500 / 1; // Replace speedRef.current with actual speed value

    elementRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const activeWindow = visualState.activeWindow || [-1, -1];
      const [start, end] = activeWindow;
      
      if (index >= start && index <= end) {
        if (visualState.violation && index === visualState.left) {
          gsap.to(ref, { backgroundColor: "#FEE2E2", borderColor: "#EF4444", color: "#991B1B", duration: 0.2 });
        } else if (visualState.success) {
          gsap.to(ref, { backgroundColor: "#DCFCE7", borderColor: "#22C55E", color: "#166534", duration: 0.2 });
        } else if (visualState.done) {
          gsap.to(ref, { backgroundColor: "#F3E8FF", borderColor: "#A855F7", color: "#6B21A8", duration: 0.2 });
        } else {
          gsap.to(ref, { backgroundColor: "#F3E8FF", borderColor: "#A855F7", color: "#6B21A8", duration: 0.2 });
        }
      } else {
        gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", color: "#4B5563", duration: 0.2 });
      }
    });

    if (visualState.done && engine.isPlaying) {
      setMessage("Visualization completed.");
      setMessageType("success");
      setShowQuiz(true);
    }
  }, [visualState, engine.isPlaying]);

  useEffect(() => {
    const handleDownload = async () => {
      if (!visualizerRef.current) return;
      try {
        const canvas = await html2canvas(visualizerRef.current, {
          backgroundColor: document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
        });
        const link = document.createElement("a");
        link.download = "sliding-window-visualization.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Failed to capture visualization:", err);
      }
    };
    
    window.addEventListener("download-visualization", handleDownload);
    return () => window.removeEventListener("download-visualization", handleDownload);
  }, []);

  const handleGo = (e) => {
    e.preventDefault();
    handleReset();
    
    if (!inputData) {
      setMessage("Please provide input data.");
      setMessageType("warning");
      return;
    }

    let parsedArray = [];
    let targetNum = 0;

    if (problemType === PROBLEMS.VAR_LONGEST_SUB) {
      parsedArray = inputData.split('');
    } else {
      parsedArray = inputData.split(',').map(s => parseInt(s.trim()));
      if (parsedArray.some(isNaN)) {
        setMessage("Invalid array elements. Please provide comma-separated integers.");
        setMessageType("warning");
        return;
      }
    }

    if (problemType !== PROBLEMS.VAR_LONGEST_SUB) {
      targetNum = parseInt(targetValue);
      if (isNaN(targetNum) || targetNum <= 0) {
        setMessage("Please provide a valid positive integer for Window Size / Target.");
        setMessageType("warning");
        return;
      }
      if ((problemType === PROBLEMS.FIXED_MAX || problemType === PROBLEMS.FIXED_AVG) && targetNum > parsedArray.length) {
         setMessage("Window size K cannot be greater than the array length.");
         setMessageType("warning");
         return;
      }
    }

    setDataArray(parsedArray);
    
    let generatedStates = [];
    if (problemType === PROBLEMS.FIXED_MAX) {
      generatedStates = Array.from(generateStatesFixedMax(parsedArray, targetNum));
    } else if (problemType === PROBLEMS.FIXED_AVG) {
      generatedStates = Array.from(generateStatesFixedAvg(parsedArray, targetNum));
    } else if (problemType === PROBLEMS.VAR_LONGEST_SUB) {
      generatedStates = Array.from(generateStatesVarLongestSub(inputData));
    } else if (problemType === PROBLEMS.VAR_SMALLEST_SUB) {
      generatedStates = Array.from(generateStatesVarSmallestSub(parsedArray, targetNum));
    }

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

  const handleExplainStep = () => {
    const prompt = `I am currently looking at the Sliding Window algorithm, at step ${engine.currentStep} of ${steps.length}.
Problem Type: ${problemType}
Explanation on screen: ${visualState.explanation}
Current Input: [${dataArray.join(", ")}]
Left pointer: ${visualState.left}, Right pointer: ${visualState.right}
Current value/sum: ${visualState.current}, Best value/sum: ${visualState.best}
Active window indices: [${visualState.activeWindow.join(", ")}]

Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

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

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
        Visualize how the Sliding Window technique efficiently processes contiguous subsegments of an array or string.
      </p>
      
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm"
      >
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Select Problem</label>
          <select 
            value={problemType}
            onChange={(e) => {
              setProblemType(e.target.value);
              handleReset();
              if (e.target.value === PROBLEMS.VAR_LONGEST_SUB) {
                setInputData("abcabcbb");
              } else if (e.target.value === PROBLEMS.VAR_SMALLEST_SUB) {
                setInputData("2, 3, 1, 2, 4, 3");
                setTargetValue("7");
              } else {
                setInputData("2, 1, 5, 1, 3, 2");
                setTargetValue("3");
              }
            }}
            disabled={engine.isPlaying || dataArray.length > 0 && !currentStepData?.done}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
          >
            <optgroup label="Fixed Window">
              <option value={PROBLEMS.FIXED_MAX}>Maximum Sum Subarray of Size K</option>
              <option value={PROBLEMS.FIXED_AVG}>Average of Subarrays of Size K</option>
            </optgroup>
            <optgroup label="Variable Window">
              <option value={PROBLEMS.VAR_LONGEST_SUB}>Longest Substring Without Repeating Characters</option>
              <option value={PROBLEMS.VAR_SMALLEST_SUB}>Smallest Subarray With Given Sum</option>
            </optgroup>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="inputData">
              {problemType === PROBLEMS.VAR_LONGEST_SUB ? "String Input" : "Array Elements (comma-separated)"}
            </label>
            <input
              type="text"
              id="inputData"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300 font-mono"
              placeholder={problemType === PROBLEMS.VAR_LONGEST_SUB ? "e.g., abcabcbb" : "e.g., 2, 1, 5, 1, 3, 2"}
              disabled={engine.isPlaying || dataArray.length > 0 && !currentStepData?.done}
            />
          </div>
          
          {problemType !== PROBLEMS.VAR_LONGEST_SUB && (
            <div className="w-full md:w-1/3">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="targetValue">
                {(problemType === PROBLEMS.FIXED_MAX || problemType === PROBLEMS.FIXED_AVG) ? "Window Size (K)" : "Target Sum"}
              </label>
              <input
                type="number"
                id="targetValue"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300 font-mono"
                placeholder="e.g., 3"
                disabled={engine.isPlaying || dataArray.length > 0 && !currentStepData?.done}
                min="1"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <GoButton onClick={handleGo} isAnimating={isAnimating || engine.isPlaying || (dataArray.length > 0 && !visualState.done)} disabled={engine.isPlaying} />
          <ResetButton onReset={handleReset} isAnimating={isAnimating || engine.isPlaying || dataArray.length > 0} />
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
              onExplainStep={handleExplainStep}
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

      {showQuiz && (
        <div className="max-w-4xl mx-auto mb-6 bg-white dark:bg-gray-800 p-5 rounded-xl border">
          <h3 className="text-lg font-bold mb-3">🧠 Quick Challenge</h3>
          <p className="mb-3">What is the time complexity of Sliding Window?</p>
          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2 rounded-lg bg-gray-200">O(n²)</button>
            <button className="px-4 py-2 rounded-lg bg-green-500 text-white">O(n)</button>
            <button className="px-4 py-2 rounded-lg bg-gray-200">O(log n)</button>
          </div>
        </div>
      )}

      {showQuiz && (
        <div className="max-w-4xl mx-auto mb-6 bg-white dark:bg-gray-800 p-5 rounded-xl border">
          <h3 className="text-lg font-bold mb-3">💬 Community Discussion</h3>
          <textarea
            value={discussion}
            onChange={(e) => setDiscussion(e.target.value)}
            placeholder="Ask a question or share your explanation..."
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
          <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg">
            Post Discussion
          </button>
        </div>
      )}

      {dataArray.length > 0 && (
         <div ref={animationRef}>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
                <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
                  Current Step
                </span>
              </div>
              <p
  aria-live="polite"
  className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-mono min-h-[3rem]"
>
  {visualState.explanation || "Ready to begin..."}
</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-2 gap-4 text-center">
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Current Window Value</h4>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {visualState.current !== null ? visualState.current : "-"}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Best Result</h4>
                <div className="text-2xl font-bold text-[#a435f0] dark:text-[#c56eff] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {visualState.best !== null ? visualState.best : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md overflow-x-auto border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-10 text-center">
              Window Visualization
            </h2>
            <div className="flex gap-2 justify-center min-w-max pb-8 px-4">
              {dataArray.map((element, index) => {
                const isLeft = index === visualState.left;
                const isRight = index === visualState.right;
                
                return (
                  <div key={index} className="flex flex-col items-center relative">
                    <div
                      ref={(el) => (elementRefs.current[index] = el)}
                      className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg border-2 transition-colors duration-200 ${getFontSize(element)} shadow-sm`}
                      style={{ backgroundColor: "#E5E7EB", borderColor: "#D1D5DB" }}
                    >
                      {element}
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-400 font-mono h-4">
                      {index}
                    </div>

                    <div className="absolute -bottom-10 flex flex-col items-center gap-1 w-full h-8">
                      {isLeft && (
                        <div className="text-[#a435f0] font-bold text-xs bg-[#a435f0]/10 px-2 py-0.5 rounded shadow-sm border border-[#a435f0]/30 animate-bounce">
                          L
                        </div>
                      )}
                      {isRight && (
                        <div className="text-[#a435f0] font-bold text-xs bg-[#a435f0]/10 px-2 py-0.5 rounded shadow-sm border border-[#a435f0]/30 animate-bounce" style={{ animationDelay: '0.1s' }}>
                          R
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#F3E8FF] border border-[#D8B4FE]" />
                <span>Window</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#E5E7EB] border border-gray-300" />
                <span>Normal</span>
              </div>

              {problemType.includes("var") && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#FEE2E2] border border-red-300" />
                    <span>Removed</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#DCFCE7] border border-green-300" />
                    <span>Added</span>
                  </div>
                </>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// Export the component
export default Animation;

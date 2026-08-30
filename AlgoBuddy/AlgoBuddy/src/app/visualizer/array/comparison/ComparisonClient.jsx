"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import ComplexityCard from "@/app/components/ui/ComplexityCard";
import AlgorithmComparator from "@/app/components/ui/AlgorithmComparator";

const ALGORITHMS = {
  bubble: { name: "Bubble Sort", complexity: "O(N²)" },
  selection: { name: "Selection Sort", complexity: "O(N²)" },
  insertion: { name: "Insertion Sort", complexity: "O(N²)" },
  merge: { name: "Merge Sort", complexity: "O(N log N)" },
  quick: { name: "Quick Sort", complexity: "O(N log N)" },
  heap: { name: "Heap Sort", complexity: "O(N log N)" },
};

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-sm sm:text-base";
  if (len === 3) return "text-xs sm:text-sm";
  return "text-[10px] sm:text-xs";
};

const getBarStyles = (index, value, algoKey, currentIndices, isCompleted, maxValue) => {
  const pctHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  // Curated premium pastel color palettes
  let bgClass = "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-900/50";
  
  if (isCompleted) {
    bgClass = "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80";
    return { bgClass, style: { height: `${Math.max(pctHeight, 15)}%` } };
  }

  const {
    comparing = [],
    swapping = [],
    shifting = [],
    writing = [],
    range = [],
    min = -1,
    active = -1,
    key = -1,
    pivot = -1,
    boundary = -1
  } = currentIndices;

  switch (algoKey) {
    case "bubble":
      if (comparing.includes(index)) {
        bgClass = "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-700";
      } else if (swapping.includes(index)) {
        bgClass = "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-700";
      }
      break;
    case "selection":
      if (index === min) {
        bgClass = "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border-pink-400 dark:border-pink-700";
      } else if (comparing.includes(index)) {
        bgClass = "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-700";
      } else if (swapping.includes(index)) {
        bgClass = "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-700";
      } else if (index < active) {
        bgClass = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
      } else if (index === active) {
        bgClass = "bg-violet-200 dark:bg-violet-900 text-violet-800 dark:text-violet-200 border-violet-400 dark:border-violet-700";
      }
      break;
    case "insertion":
      if (index === key) {
        bgClass = "bg-violet-200 dark:bg-violet-900 text-violet-800 dark:text-violet-200 border-violet-400 dark:border-violet-700";
      } else if (comparing.includes(index)) {
        bgClass = "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-700";
      } else if (shifting.includes(index)) {
        bgClass = "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-700";
      } else if (index < key) {
        bgClass = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
      }
      break;
    case "merge":
      if (comparing.includes(index)) {
        bgClass = "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-700 animate-pulse";
      } else if (writing.includes(index)) {
        bgClass = "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-700";
      } else if (range.length === 2 && index >= range[0] && index <= range[1]) {
        bgClass = "bg-indigo-200/50 dark:bg-indigo-900/35 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800/80";
      }
      break;
    case "quick":
      if (index === pivot) {
        bgClass = "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-400 dark:border-red-700";
      } else if (comparing.includes(index)) {
        bgClass = "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-700";
      } else if (swapping.includes(index)) {
        bgClass = "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-700";
      } else if (index === boundary) {
        bgClass = "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-400 dark:border-purple-700";
      }
      break;
    case "heap":
      if (swapping.includes(index)) {
        bgClass = "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-700";
      } else if (comparing.includes(index)) {
        bgClass = "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-700";
      } else if (index === active) {
        bgClass = "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-400 dark:border-purple-700";
      } else if (currentIndices.sortedStart !== undefined && index >= currentIndices.sortedStart) {
        bgClass = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
      } else if (currentIndices.heapSize !== undefined && index >= currentIndices.heapSize) {
        bgClass = "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700";
      }
      break;
    default:
      break;
  }

  return { bgClass, style: { height: `${Math.max(pctHeight, 15)}%` } };
};
const complexityInfo = [
  {
    complexity: "O(1)",
    title: "Constant Time",
    description:
      "Execution time stays the same regardless of dataset size.",
    examples: ["Array access", "Hash lookup"],
  },
  {
    complexity: "O(log N)",
    title: "Logarithmic Time",
    description:
      "Operations shrink the problem space each step.",
    examples: ["Binary Search", "Balanced BST operations"],
  },
  {
    complexity: "O(N)",
    title: "Linear Time",
    description:
      "Runtime grows proportionally with input size.",
    examples: ["Linear Search", "Single array traversal"],
  },
  {
    complexity: "O(N log N)",
    title: "Efficient Sorting",
    description:
      "Best practical complexity for comparison sorting algorithms.",
    examples: ["Merge Sort", "Quick Sort", "Heap Sort"],
  },
  {
    complexity: "O(N²)",
    title: "Quadratic Time",
    description:
      "Performance slows heavily as input size increases.",
    examples: ["Bubble Sort", "Insertion Sort", "Selection Sort"],
  },
  {
    complexity: "O(2^N)",
    title: "Exponential Time",
    description:
      "Execution grows explosively with each added input.",
    examples: ["Recursive brute force", "Subset generation"],
  },
];

const algorithmComparisons = [
  {
    name: "Bubble Sort",
    best: "O(N)",
    average: "O(N²)",
    worst: "O(N²)",
    space: "O(1)",
    stable: true,
  },
  {
    name: "Selection Sort",
    best: "O(N²)",
    average: "O(N²)",
    worst: "O(N²)",
    space: "O(1)",
    stable: false,
  },
  {
    name: "Insertion Sort",
    best: "O(N)",
    average: "O(N²)",
    worst: "O(N²)",
    space: "O(1)",
    stable: true,
  },
  {
    name: "Merge Sort",
    best: "O(N log N)",
    average: "O(N log N)",
    worst: "O(N log N)",
    space: "O(N)",
    stable: true,
  },
  {
    name: "Quick Sort",
    best: "O(N log N)",
    average: "O(N log N)",
    worst: "O(N²)",
    space: "O(log N)",
    stable: false,
  },
  {
    name: "Heap Sort",
    best: "O(N log N)",
    average: "O(N log N)",
    worst: "O(N log N)",
    space: "O(1)",
    stable: false,
  },
];

export default function ComparisonClient() {
  const [arraySize, setArraySize] = useState(10);
  const [baseArray, setBaseArray] = useState([45, 12, 89, 34, 67, 23, 78, 56, 90, 9]);

  // Algorithm selection
  const [algoKeyA, setAlgoKeyA] = useState("bubble");
  const [algoKeyB, setAlgoKeyB] = useState("merge");

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Side A States
  const [arrayA, setArrayA] = useState([]);
  const [comparisonsA, setComparisonsA] = useState(0);
  const [swapsA, setSwapsA] = useState(0);
  const [currentStepA, setCurrentStepA] = useState(0);
  const [totalStepsA, setTotalStepsA] = useState(0);
  const [currentIndicesA, setCurrentIndicesA] = useState({});
  const [completedA, setCompletedA] = useState(false);
  const [completionTimeA, setCompletionTimeA] = useState(0);
  const framesARef = useRef([]);

  // Side B States
  const [arrayB, setArrayB] = useState([]);
  const [comparisonsB, setComparisonsB] = useState(0);
  const [swapsB, setSwapsB] = useState(0);
  const [currentStepB, setCurrentStepB] = useState(0);
  const [totalStepsB, setTotalStepsB] = useState(0);
  const [currentIndicesB, setCurrentIndicesB] = useState({});
  const [completedB, setCompletedB] = useState(false);
  const [completionTimeB, setCompletionTimeB] = useState(0);
  const framesBRef = useRef([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Max value for bar scaling
  const maxValue = useMemo(() => {
    return Math.max(...baseArray, 1);
  }, [baseArray]);

  // Handle array changes
  const resetSorting = useCallback((arr = baseArray) => {
    setIsPlaying(false);
    setIsSorting(false);

    // Reset Side A
    setArrayA([...arr]);
    setComparisonsA(0);
    setSwapsA(0);
    setCurrentStepA(0);
    setTotalStepsA(0);
    setCurrentIndicesA({});
    setCompletedA(false);
    setCompletionTimeA(0);
    framesARef.current = [];

    // Reset Side B
    setArrayB([...arr]);
    setComparisonsB(0);
    setSwapsB(0);
    setCurrentStepB(0);
    setTotalStepsB(0);
    setCurrentIndicesB({});
    setCompletedB(false);
    setCompletionTimeB(0);
    framesBRef.current = [];
  }, [baseArray]);

  useEffect(() => {
    resetSorting();
  }, [algoKeyA, algoKeyB, resetSorting]);

  // Synchronous tick loop
  useEffect(() => {
    if (!isPlaying) return;

    if (!isSorting && !isGenerating) {
      setIsGenerating(true);

      const generateStates = async () => {
        try {
          const worker = new Worker(new URL("@/utils/sortingWorker.js", import.meta.url));
          
          const getFrames = (algo, array, id) => new Promise((resolve) => {
            const listener = (e) => {
              if (e.data.id === id) {
                worker.removeEventListener('message', listener);
                resolve(e.data);
              }
            };
            worker.addEventListener('message', listener);
            worker.postMessage({ algo, array, id });
          });

          const [resultA, resultB] = await Promise.all([
            getFrames(algoKeyA, [...baseArray], 'A'),
            getFrames(algoKeyB, [...baseArray], 'B')
          ]);

          framesARef.current = resultA.frames || [];
          framesBRef.current = resultB.frames || [];
          setTotalStepsA(resultA.steps || 0);
          setTotalStepsB(resultB.steps || 0);
          
          worker.terminate();
          setIsSorting(true);
          setIsGenerating(false);
        } catch (error) {
          console.error("Worker error computing frames", error);
          setIsGenerating(false);
          setIsPlaying(false);
        }
      };
      
      generateStates();
      return; // Wait for generation to complete
    }

    if (isGenerating) return;

    const interval = setInterval(() => {
      let isDoneA = completedA || currentStepA >= framesARef.current.length;
      let isDoneB = completedB || currentStepB >= framesBRef.current.length;

      if (!isDoneA) {
        const nextA = framesARef.current[currentStepA];
        if (nextA) {
          setArrayA(nextA.array);
          setComparisonsA(prev => prev + nextA.comparisons);
          setSwapsA(prev => prev + nextA.swaps);
          setCurrentIndicesA(nextA.currentIndices);
          setCurrentStepA(prev => prev + 1);
        }
      } else if (!completedA) {
        setCompletedA(true);
      }

      if (!isDoneB) {
        const nextB = framesBRef.current[currentStepB];
        if (nextB) {
          setArrayB(nextB.array);
          setComparisonsB(prev => prev + nextB.comparisons);
          setSwapsB(prev => prev + nextB.swaps);
          setCurrentIndicesB(nextB.currentIndices);
          setCurrentStepB(prev => prev + 1);
        }
      } else if (!completedB) {
        setCompletedB(true);
      }

      if (isDoneA && isDoneB) {
        setIsPlaying(false);
      }
    }, 500 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, isSorting, isGenerating, algoKeyA, algoKeyB, baseArray, speed, completedA, completedB, currentStepA, currentStepB]);

  // Precision elapsed timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (!completedA && isSorting) {
        setCompletionTimeA(prev => prev + 0.01);
      }
      if (!completedB && isSorting) {
        setCompletionTimeB(prev => prev + 0.01);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [isPlaying, completedA, completedB, isSorting]);

  const handleGenerate = (newArray) => {
    setBaseArray(newArray);
    setArraySize(newArray.length);
  };

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setArraySize(size);
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * (95)) + 5);
    setBaseArray(newArray);
  };

  const startPause = () => {
    if (!baseArray.length) return;
    setIsPlaying(!isPlaying);
  };

  const winnerMessage = useMemo(() => {
    if (!completedA || !completedB) return null;
    
    const timeA = parseFloat(completionTimeA.toFixed(2));
    const timeB = parseFloat(completionTimeB.toFixed(2));
    
    let winner = "";
    let reason = "";

    if (timeA < timeB) {
      winner = ALGORITHMS[algoKeyA].name;
      reason = `${winner} finished in ${timeA}s compared to ${ALGORITHMS[algoKeyB].name}'s ${timeB}s, saving ${(timeB - timeA).toFixed(2)}s on this dataset.`;
    } else if (timeB < timeA) {
      winner = ALGORITHMS[algoKeyB].name;
      reason = `${winner} finished in ${timeB}s compared to ${ALGORITHMS[algoKeyA].name}'s ${timeA}s, saving ${(timeA - timeB).toFixed(2)}s on this dataset.`;
    } else {
      // Tie breaker by operations
      const totalOpsA = comparisonsA + swapsA;
      const totalOpsB = comparisonsB + swapsB;
      if (totalOpsA < totalOpsB) {
        winner = ALGORITHMS[algoKeyA].name;
        reason = `Both finished in ${timeA}s, but ${winner} performed fewer total operations (${totalOpsA} ops vs ${totalOpsB} ops).`;
      } else if (totalOpsB < totalOpsA) {
        winner = ALGORITHMS[algoKeyB].name;
        reason = `Both finished in ${timeB}s, but ${winner} performed fewer total operations (${totalOpsB} ops vs ${totalOpsA} ops).`;
      } else {
        return {
          title: "It's an exact tie!",
          desc: `Both algorithms completed in ${timeA}s and performed exactly ${totalOpsA} operations. This is a very rare and highly symmetrical dataset state!`,
        };
      }
    }

    return {
      title: `${winner} Wins!`,
      desc: reason,
    };
  }, [completedA, completedB, algoKeyA, algoKeyB, completionTimeA, completionTimeB, comparisonsA, swapsA, comparisonsB, swapsB]);

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Controls Container */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-2xl shadow-sm mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Selector inputs */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Select Algorithms
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 font-medium">Algorithm A (Left)</label>
                <select
                  id="algo-select-a"
                  value={algoKeyA}
                  onChange={(e) => setAlgoKeyA(e.target.value)}
                  disabled={isSorting}
                  className="w-full h-11 px-3 border rounded-xl bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 text-[#1a1a1a] dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition-all cursor-pointer"
                >
                  {Object.entries(ALGORITHMS).map(([key, val]) => (
                    <option key={key} value={key}>{val.name} ({val.complexity})</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 font-medium">Algorithm B (Right)</label>
                <select
                  id="algo-select-b"
                  value={algoKeyB}
                  onChange={(e) => setAlgoKeyB(e.target.value)}
                  disabled={isSorting}
                  className="w-full h-11 px-3 border rounded-xl bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 text-[#1a1a1a] dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition-all cursor-pointer"
                >
                  {Object.entries(ALGORITHMS).map(([key, val]) => (
                    <option key={key} value={key}>{val.name} ({val.complexity})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Column 2: Dataset controls */}
          <div className="space-y-4 border-t lg:border-t-0 lg:border-x border-neutral-200 dark:border-neutral-800 lg:px-6 pt-4 lg:pt-0">
            <h3 className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Dataset Controls
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Array Size</label>
                  <span className="text-xs font-bold text-[#a435f0]">{arraySize} items</span>
                </div>
                <input
                  id="size-slider"
                  type="range"
                  min="5"
                  max="30"
                  value={arraySize}
                  onChange={handleSizeChange}
                  disabled={isSorting}
                  className="w-full accent-[#a435f0] cursor-pointer"
                />
              </div>
              <ArrayGenerator
                onGenerate={handleGenerate}
                disabled={isSorting}
                isPrimary={baseArray.length === 0}
              />
              <CustomArrayInput
                onUseCustomArray={handleGenerate}
                disabled={isSorting}
                className="w-full"
              />
            </div>
          </div>

          {/* Column 3: Playback and Speed */}
          <div className="space-y-4 border-t lg:border-t-0 pt-4 lg:pt-0 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                Playback Controls
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  id="start-comparison-btn"
                  onClick={startPause}
                  disabled={!baseArray.length}
                  className={`flex-1 h-12 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-sm ${
                    isPlaying 
                      ? "bg-amber-500 hover:bg-amber-600" 
                      : "bg-[#a435f0] hover:bg-[#8f2cd6]"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                      </svg>
                      Pause
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {isSorting ? "Resume" : "Start Comparison"}
                    </>
                  )}
                </button>
                <button
                  id="reset-comparison-btn"
                  onClick={() => resetSorting()}
                  className="flex-1 h-12 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center justify-center font-bold transition-all"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-4 lg:mt-0">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Simulation Speed</label>
                <span className="text-xs font-bold text-[#a435f0]">{speed}x</span>
              </div>
              <input
                id="speed-slider"
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#a435f0] cursor-pointer"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Algorithm A */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-950 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-neutral-900 dark:text-white text-lg">
                {ALGORITHMS[algoKeyA].name}
              </h2>
              {currentStepA > currentStepB && (
  <span className="inline-flex mt-2 items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
    Ahead
  </span>
)}
              <p className="text-xs text-neutral-500 font-semibold tracking-wider uppercase">
                Complexity: {ALGORITHMS[algoKeyA].complexity}
              </p>
            </div>
            {completedA && (
              <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-900 animate-bounce">
                Completed
              </span>
            )}
          </div>

          {/* Metrics Panel A */}
          <div className="grid grid-cols-4 border-b border-neutral-100 dark:border-neutral-800 text-center">
            <div className="col-span-4 px-4 pt-4">
  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
    <div
      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-300"
      style={{
        width: `${
          totalStepsB > 0
            ? (currentStepB / totalStepsB) * 100
            : 0
        }%`,
      }}
    />
  </div>
</div>
            <div className="py-3 border-r border-neutral-100 dark:border-neutral-800">
              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Comparisons</span>
              <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{comparisonsA}</span>
            </div>
            <div className="py-3 border-r border-neutral-100 dark:border-neutral-800">
              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Swaps / Writes</span>
              <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{swapsA}</span>
            </div>
            <div className="py-3 border-r border-neutral-100 dark:border-neutral-800">
              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Steps</span>
              <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {totalStepsA > 0 ? `${currentStepA}/${totalStepsA}` : "0"}
              </span>
            </div>
            <div className="py-3">
              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Time</span>
              <span className="text-lg font-bold text-[#a435f0]">{completionTimeA.toFixed(2)}s</span>
            </div>
          </div>

          {/* Viz Box A */}
          <div 
            style={{ minHeight: "260px", minWidth: "100%" }}
            className="p-6 h-[260px] sm:h-[300px] flex items-end justify-center gap-1.5 sm:gap-2 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800"
          >
            {arrayA.length > 0 ? (
              arrayA.map((val, idx) => {
                const { bgClass, style } = getBarStyles(idx, val, algoKeyA, currentIndicesA, completedA, maxValue);
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col justify-end items-center h-full group relative"
                  >
                    {/* Tooltip on Hover */}
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-neutral-900 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none transition-opacity font-bold">
                      {val}
                    </span>
                    <div
                      style={style}
                      className={`w-full rounded-t-lg sm:rounded-t-xl border-t-2 shadow-sm transition-all duration-300 hover:scale-[1.02] flex items-end justify-center pb-2 font-bold animate-in fade-in slide-in-from-bottom-2 ${getFontSize(val)} ${bgClass}`}
                    >
                      <span className="hidden sm:inline">{val}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-bold mt-1.5">
                      {idx}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-neutral-400 text-sm font-semibold">Generate an array to begin</p>
            )}
          </div>
        </div>

        {/* Right Side: Algorithm B */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-950 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-neutral-900 dark:text-white text-lg">
                {ALGORITHMS[algoKeyB].name}
              </h2>
              {currentStepB > currentStepA && (
  <span className="inline-flex mt-2 items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
    Ahead
  </span>
)}
              <p className="text-xs text-neutral-500 font-semibold tracking-wider uppercase">
                Complexity: {ALGORITHMS[algoKeyB].complexity}
              </p>
            </div>
            {completedB && (
              <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-900 animate-bounce">
                Completed
              </span>
            )}
          </div>

          {/* Metrics Panel B */}
          <div className="grid grid-cols-4 border-b border-neutral-100 dark:border-neutral-800 text-center">
            <div className="col-span-4 px-4 pt-4">
  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
    <div
      className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-all duration-300"
      style={{
        width: `${
          totalStepsA > 0
            ? (currentStepA / totalStepsA) * 100
            : 0
        }%`,
      }}
    />
  </div>
</div>
            <div className="py-3 border-r border-neutral-100 dark:border-neutral-800">
              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Comparisons</span>
              <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{comparisonsB}</span>
            </div>
            <div className="py-3 border-r border-neutral-100 dark:border-neutral-800">
              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Swaps / Writes</span>
              <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{swapsB}</span>
            </div>
            <div className="py-3 border-r border-neutral-100 dark:border-neutral-800">
              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Steps</span>
              <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {totalStepsB > 0 ? `${currentStepB}/${totalStepsB}` : "0"}
              </span>
            </div>
            <div className="py-3">
              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Time</span>
              <span className="text-lg font-bold text-[#a435f0]">{completionTimeB.toFixed(2)}s</span>
            </div>
          </div>

          {/* Viz Box B */}
          <div 
            style={{ minHeight: "260px", minWidth: "100%" }}
            className="p-6 h-[260px] sm:h-[300px] flex items-end justify-center gap-1.5 sm:gap-2 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800"
          >
            {arrayB.length > 0 ? (
              arrayB.map((val, idx) => {
                const { bgClass, style } = getBarStyles(idx, val, algoKeyB, currentIndicesB, completedB, maxValue);
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col justify-end items-center h-full group relative"
                  >
                    {/* Tooltip on Hover */}
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-neutral-900 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none transition-opacity font-bold">
                      {val}
                    </span>
                    <div
                      style={style}
                      className={`w-full rounded-t-lg sm:rounded-t-xl border-t-2 shadow-sm transition-all duration-300 hover:scale-[1.02] flex items-end justify-center pb-2 font-bold animate-in fade-in slide-in-from-bottom-2 ${getFontSize(val)} ${bgClass}`}
                    >
                      <span className="hidden sm:inline">{val}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-bold mt-1.5">
                      {idx}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-neutral-400 text-sm font-semibold">Generate an array to begin</p>
            )}
          </div>
        </div>

      </div>

      {/* Winner Summary Panel */}
      {winnerMessage && (
        <div className="mt-8 relative overflow-hidden bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 border border-violet-200 dark:border-neutral-800 p-6 rounded-2xl shadow-xl text-center max-w-2xl mx-auto animate-fade-in">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_40%)]" />
          <div className="relative w-14 h-14 bg-amber-100 dark:bg-amber-900/40 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-300 dark:border-amber-800 shadow-lg animate-pulse">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" className="hidden" />
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.44 1.72 4.48 4 4.88V19h10v-4.12c2.28-.4 4-2.44 4-4.88V7c0-1.1-.9-2-2-2zm-12 5H5V7h2v3zm12 0h-2V7h2v3z" />
            </svg>
          </div>
          <h2 className="relative text-xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">
            {winnerMessage.title}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-semibold">
            {winnerMessage.desc}
          </p>
        </div>
      )}
    </main>
  );
}

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { Info, Layers } from "lucide-react";
import { TrieNode, cloneTrie, insertGenerator, searchGenerator, prefixSearchGenerator } from "@/features/algorithms/tree/trieLogic";

const calculateNodeWidth = (node) => {
  if (!node) return 0;
  const children = Object.values(node.children).sort((a, b) => a.char.localeCompare(b.char));
  if (children.length === 0) return 1;
  let width = 0;
  for (const child of children) {
    width += calculateNodeWidth(child);
  }
  return width;
};

const layoutTrie = (node, x, y, allocatedWidth, nodesList = [], edgesList = [], currentStep) => {
  if (!node) return { nodesList, edgesList };

  const nodeRadius = 24;
  const yOffset = 80;

  const highlightedState = currentStep?.highlightedNodes?.[node.id] || null;

  nodesList.push({
    id: node.id,
    char: node.char || "Root",
    isEndOfWord: node.isEndOfWord,
    x,
    y,
    state: highlightedState,
  });

  const children = Object.values(node.children).sort((a, b) => a.char.localeCompare(b.char));
  if (children.length > 0) {
    let currentXStart = x - (allocatedWidth / 2);
    const widthPerUnit = allocatedWidth / calculateNodeWidth(node);

    for (const child of children) {
      const childWidthUnits = calculateNodeWidth(child);
      const childAllocatedWidth = childWidthUnits * widthPerUnit;
      const childX = currentXStart + (childAllocatedWidth / 2);
      const childY = y + yOffset;

      const edgeState = currentStep?.highlightedEdges?.[`${node.id}->${child.id}`] ? "active" : "default";

      edgesList.push({
        id: `${node.id}->${child.id}`,
        x1: x,
        y1: y + nodeRadius,
        x2: childX,
        y2: childY - nodeRadius,
        state: edgeState
      });

      layoutTrie(child, childX, childY, childAllocatedWidth, nodesList, edgesList, currentStep);
      currentXStart += childAllocatedWidth;
    }
  }

  return { nodesList, edgesList };
};

export default function TrieAnimation() {
  const [mode, setMode] = useState("insertion");
  const [root, setRoot] = useState(null);
  const [targetTrieRoot, setTargetTrieRoot] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("Add words or select a mode to begin.");
  const [nodeIdCounter, setNodeIdCounter] = useState(0);

  const { speed, setSpeed } = usePlayback(1);
  const timerRef = useRef(null);

  const resetPlayback = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setSteps([]);
    setRoot(targetTrieRoot);
    setMessage("Playback reset. Click Start to begin operations.");
  }, [targetTrieRoot]);

  useEffect(() => {
    // Initial Root node setup
    const initialRoot = new TrieNode("", "root");
    setRoot(initialRoot);
    setTargetTrieRoot(initialRoot);
    setNodeIdCounter(0);
  }, []);

  const handleInsert = () => {
    const val = inputValue.trim().toLowerCase();
    if (!val || !/^[a-z]+$/.test(val)) {
      setMessage("⚠️ Please enter a valid lowercase word (a-z)");
      return;
    }

    resetPlayback();
    const generator = insertGenerator(targetTrieRoot, val, nodeIdCounter);
    const preCalculated = [...generator];
    
    setSteps(preCalculated);
    if (preCalculated.length > 0) {
      const finalStep = preCalculated[preCalculated.length - 1];
      setTargetTrieRoot(finalStep.tree);
      setNodeIdCounter(finalStep.newNodeIdCounter);
    }
    
    setCurrentStepIdx(0);
    setIsAnimating(true);
    setInputValue("");
  };

  const handleSearch = () => {
    const val = inputValue.trim().toLowerCase();
    if (!val || !/^[a-z]+$/.test(val)) {
      setMessage("⚠️ Please enter a valid lowercase word (a-z)");
      return;
    }

    resetPlayback();
    const preCalculated = [...searchGenerator(targetTrieRoot, val)];
    setSteps(preCalculated);
    setCurrentStepIdx(0);
    setIsAnimating(true);
    setInputValue("");
  };

  const handlePrefixSearch = () => {
    const val = inputValue.trim().toLowerCase();
    if (!val || !/^[a-z]+$/.test(val)) {
      setMessage("⚠️ Please enter a valid lowercase prefix (a-z)");
      return;
    }

    resetPlayback();
    const preCalculated = [...prefixSearchGenerator(targetTrieRoot, val)];
    setSteps(preCalculated);
    setCurrentStepIdx(0);
    setIsAnimating(true);
    setInputValue("");
  };

  const handleClear = () => {
    const initialRoot = new TrieNode("", "root");
    setRoot(initialRoot);
    setTargetTrieRoot(initialRoot);
    setNodeIdCounter(0);
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setSteps([]);
    setMessage("Trie cleared.");
  };

  const startVisualizer = () => {
    if (steps.length === 0) {
      if (mode === "insertion") handleInsert();
      else if (mode === "searching") handleSearch();
      else handlePrefixSearch();
      return;
    }
    setIsAnimating(true);
    let nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };

  const pauseVisualizer = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const stepForward = () => {
    setIsAnimating(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      if (currentStepIdx === steps.length - 2 && mode === "insertion") {
        setRoot(targetTrieRoot);
      }
    }
  };

  const stepBackward = () => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;

    if (currentStepIdx >= steps.length) {
      setIsAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIdx];
    setMessage(currentStep.explanation);

    timerRef.current = setTimeout(() => {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setIsAnimating(false);
        if (mode === "insertion") {
          setRoot(targetTrieRoot);
        }
        setMessage(currentStep.explanation);
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnimating, currentStepIdx, steps, speed, targetTrieRoot, mode]);

  const currentStep = steps[currentStepIdx] || null;

  const buildTreeRenderData = () => {
    const activeTree = (mode === "insertion" && currentStep && currentStep.tree) ? currentStep.tree : root;
    if (!activeTree) return { renderNodes: [], renderEdges: [] };
    
    const treeWidthUnits = calculateNodeWidth(activeTree);
    const allocatedWidth = Math.max(800, treeWidthUnits * 80);
    return layoutTrie(activeTree, allocatedWidth / 2, 60, allocatedWidth, [], [], currentStep);
  };

  const { renderNodes, renderEdges } = buildTreeRenderData();

  const getSvgDimensions = () => {
    if (renderNodes.length === 0) return { width: 800, height: 400, viewBoxOffset: 0 };
    const xCoords = renderNodes.map(n => n.x);
    const yCoords = renderNodes.map(n => n.y);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const maxY = Math.max(...yCoords);

    const padding = 60;
    const computedWidth = maxX - minX + padding * 2;
    const computedHeight = maxY + padding * 1.5;

    return {
      width: Math.max(800, computedWidth),
      height: Math.max(380, computedHeight),
      viewBoxOffset: minX - padding
    };
  };

  const svgDimensions = getSvgDimensions();

  return (
    <div className="flex flex-col gap-6">
      
      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2">
        {["insertion", "searching", "prefix-search"].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setMode(tab);
              resetPlayback();
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-xl capitalize transition-all ${
              mode === tab
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-slate-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Controls & Playback Dashboard */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={mode === "insertion" ? "Insert word" : mode === "searching" ? "Search exact word" : "Starts with prefix"}
            className="w-full sm:w-40 px-4 py-2.5 text-sm bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isAnimating}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (mode === "insertion") handleInsert();
                else if (mode === "searching") handleSearch();
                else handlePrefixSearch();
              }
            }}
          />
          <button
            onClick={() => {
              if (mode === "insertion") handleInsert();
              else if (mode === "searching") handleSearch();
              else handlePrefixSearch();
            }}
            disabled={isAnimating || !inputValue}
            className="px-5 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:opacity-50 text-white rounded-xl transition-all"
          >
            {mode === "insertion" ? "Insert" : "Search"}
          </button>
        </div>

        <PlaybackControls
          isPlaying={isAnimating}
          onPlayPause={isAnimating ? pauseVisualizer : startVisualizer}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onReset={resetPlayback}
          onClear={handleClear}
          clearLabel="Clear Trie"
          speed={speed}
          onSpeedChange={setSpeed}
          disabled={steps.length === 0 && !isAnimating}
          showPlayPause={true}
          progressText={`Step ${currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / ${steps.length || 0}`}
        />
      </div>

      {/* Explanation Area */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" /> Action Explanation
          </span>
          <span className="text-slate-600 dark:text-slate-400 font-bold bg-gray-100 dark:bg-[#1a1a1a] px-3 py-1 rounded-full border border-gray-300 dark:border-[#333]">
            Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
          </span>
        </div>
        <div className="text-base leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
          {message}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[440px] items-center">
        
        {/* Legend */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-xs hidden sm:flex">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1.5 rounded-xl">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20"></span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Visiting / Traversing</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1.5 rounded-xl">
            <span className="w-3 h-3 rounded-full border-2 border-indigo-500"></span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">End of Word</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1.5 rounded-xl">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/20"></span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Matched Success</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-2.5 py-1.5 rounded-xl">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/20"></span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Error / Not Found</span>
          </div>
        </div>

        <div className="w-full h-full overflow-auto custom-scrollbar flex items-center justify-center pt-16">
          <svg
            width={svgDimensions.width}
            height={svgDimensions.height}
            viewBox={`${svgDimensions.viewBoxOffset} 0 ${svgDimensions.width} ${svgDimensions.height}`}
            className="transition-all duration-300"
          >
            {renderEdges.map((edge) => (
              <line
                key={edge.id}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                strokeWidth={edge.state === "active" ? 4 : 2}
                className={`transition-all duration-300 ${edge.state === "active" ? "stroke-emerald-500" : "stroke-slate-300 dark:stroke-slate-600"}`}
                strokeOpacity={edge.state === "active" ? 1 : 0.3}
              />
            ))}
            {renderNodes.map((node) => {
              let bgClass = "fill-white dark:fill-slate-800";
              let strokeClass = "stroke-slate-300 dark:stroke-slate-600";
              let textClass = "fill-slate-700 dark:fill-slate-200";
              let strokeWidth = 2;

              if (node.state === "visiting" || node.state === "active") {
                bgClass = "fill-emerald-100 dark:fill-emerald-500/20";
                strokeClass = "stroke-emerald-500 dark:stroke-emerald-400";
                textClass = "fill-emerald-700 dark:fill-emerald-400";
              } else if (node.state === "matched") {
                bgClass = "fill-amber-100 dark:fill-amber-500/20";
                strokeClass = "stroke-amber-500 dark:stroke-amber-400";
                textClass = "fill-amber-700 dark:fill-amber-400";
              } else if (node.state === "error") {
                bgClass = "fill-rose-100 dark:fill-rose-500/20";
                strokeClass = "stroke-rose-500 dark:stroke-rose-400";
                textClass = "fill-rose-700 dark:fill-rose-400";
              } else {
                if (node.isEndOfWord) {
                  strokeClass = "stroke-indigo-500 dark:stroke-indigo-400";
                  strokeWidth = 4;
                }
              }

              return (
                <g key={node.id} className="transition-all duration-300">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={24}
                    strokeWidth={strokeWidth}
                    className={`transition-all duration-300 shadow-sm ${bgClass} ${strokeClass}`}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="18px"
                    fontWeight="600"
                    className={`font-sans ${textClass}`}
                  >
                    {node.char}
                  </text>
                  {node.isEndOfWord && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={20}
                      fill="none"
                      strokeWidth={1}
                      strokeDasharray="4 2"
                      opacity={0.5}
                      className={strokeClass}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

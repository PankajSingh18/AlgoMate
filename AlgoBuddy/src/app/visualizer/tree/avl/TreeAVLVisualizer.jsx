"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Footer from "@/app/components/footer";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { insertAVL, deleteAVL } from "./avlUtils";
import { Info, Layers, AlertCircle } from "lucide-react";
import { CustomInputPanel } from "@/app/visualizer/components/CustomInputPanel";

const nodeRadius = 21;

const calculateCoordinates = (node, currentStep, x = 400, y = 60, level = 0, nodesList = [], edgesList = []) => {
  if (!node) return { nodesList, edgesList };

  const xOffset = 260 / Math.pow(2, level);
  const yOffset = 80;

  const highlightedState = currentStep?.highlightedNodes?.[node.value] || null;

  nodesList.push({
    value: node.value,
    x,
    y,
    state: highlightedState,
    isVisited: currentStep?.visited?.includes(node.value) || false,
    height: node.height,
    balanceFactor: node.balanceFactor,
  });

  if (node.left) {
    const leftX = x - xOffset;
    const leftY = y + yOffset;
    edgesList.push({
      x1: x,
      y1: y + nodeRadius,
      x2: leftX,
      y2: leftY - nodeRadius,
    });
    calculateCoordinates(node.left, currentStep, leftX, leftY, level + 1, nodesList, edgesList);
  }

  if (node.right) {
    const rightX = x + xOffset;
    const rightY = y + yOffset;
    edgesList.push({
      x1: x,
      y1: y + nodeRadius,
      x2: rightX,
      y2: rightY - nodeRadius,
    });
    calculateCoordinates(node.right, currentStep, rightX, rightY, level + 1, nodesList, edgesList);
  }

  return { nodesList, edgesList };
};

export default function TreeAVLVisualizer({ initialMode = "avl" }) {
  const mode = initialMode === "avl" ? initialMode : "avl";
  const [root, setRoot] = useState(null);
  const [targetTreeRoot, setTargetTreeRoot] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("Insert nodes to build an AVL tree.");
  const [operationLabel, setOperationLabel] = useState(mode.toUpperCase());
  const timerRef = useRef(null);
  const { speed, setSpeed } = usePlayback(1);

  const resetPlayback = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps([]);
    setCurrentStepIdx(-1);
  }, []);

  const clearTree = useCallback(() => {
    resetPlayback();
    setRoot(null);
    setTargetTreeRoot(null);
    setInputValue("");
    setMessage("AVL tree cleared.");
  }, [resetPlayback]);

  const handleCustomTreeInput = useCallback((parsedArray) => {
    if (parsedArray === null) {
      clearTree();
    } else {
      resetPlayback();
      let newRoot = null;
      parsedArray.forEach(val => {
        const nextSteps = [];
        const result = insertAVL(newRoot, val, nextSteps);
        newRoot = result.root;
      });
      setRoot(newRoot);
      setTargetTreeRoot(newRoot);
      setMessage(`Generated custom AVL tree with ${parsedArray.length} nodes.`);
    }
  }, [clearTree, resetPlayback]);

  const applySteps = useCallback((nextRoot, nextSteps, label) => {
    if (!nextSteps || nextSteps.length === 0) {
      setMessage("No animation steps were generated.");
      return;
    }

    setTargetTreeRoot(nextRoot);
    setSteps(nextSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
    setOperationLabel(label);
  }, []);

  const handleInsert = useCallback(() => {
    const value = parseInt(inputValue, 10);
    if (Number.isNaN(value)) {
      setMessage("Please enter a valid number to insert.");
      return;
    }

    resetPlayback();
    const nextSteps = [];
    const result = insertAVL(root, value, nextSteps);
    setInputValue("");
    setMessage(`Inserting ${value} into the AVL tree...`);
    applySteps(result.root, nextSteps, `Insert ${value}`);
  }, [applySteps, inputValue, resetPlayback, root]);

  const handleDelete = useCallback(() => {
    const value = parseInt(inputValue, 10);
    if (Number.isNaN(value)) {
      setMessage("Please enter a valid number to delete.");
      return;
    }

    if (!root) {
      setMessage("The AVL tree is empty.");
      return;
    }

    resetPlayback();
    const nextSteps = [];
    const result = deleteAVL(root, value, nextSteps);
    setInputValue("");
    setMessage(`Deleting ${value} from the AVL tree...`);
    applySteps(result.root, nextSteps, `Delete ${value}`);
  }, [applySteps, inputValue, resetPlayback, root]);

  const startVisualizer = useCallback(() => {
    if (steps.length === 0) {
      setMessage("Insert or delete a value first to generate an animation.");
      return;
    }
    setIsAnimating(true);
    if (currentStepIdx === -1) setCurrentStepIdx(0);
  }, [currentStepIdx, steps.length]);

  const pauseVisualizer = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const stepForward = useCallback(() => {
    setIsAnimating(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  }, [currentStepIdx, steps.length]);

  const stepBackward = useCallback(() => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  }, [currentStepIdx]);

  const handleResetPlayback = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setSteps([]);
    setMessage("Playback reset.");
  }, []);

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
        setCurrentStepIdx((prev) => prev + 1);
      } else {
        setIsAnimating(false);
        if (targetTreeRoot) {
          setRoot(targetTreeRoot);
        }
        setMessage("Operation completed successfully!");
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStepIdx, isAnimating, speed, steps, targetTreeRoot]);

  const currentStep = steps[currentStepIdx] || null;

  const activeTree = currentStep?.treeSnapshot || root;

  const buildTreeRenderData = useCallback(() => {
    if (!activeTree) return { renderNodes: [], renderEdges: [] };
    const { nodesList, edgesList } = calculateCoordinates(activeTree, currentStep);
    return { renderNodes: nodesList, renderEdges: edgesList };
  }, [activeTree, currentStep]);

  const { renderNodes, renderEdges } = buildTreeRenderData();

  const getNodeColors = (node) => {
    const stepType = currentStep?.stepType;
    const currentNode = currentStep?.currentNode;
    const state = node.state;

    let fillHex = "#0f172a";
    let strokeHex = "#334155";

    if (stepType === "compare" && node.value === currentNode) {
      fillHex = "#3b82f6";
      strokeHex = "#60a5fa";
    } else if (stepType === "insert-node" && node.value === currentNode) {
      fillHex = "#10b981";
      strokeHex = "#34d399";
    } else if (stepType === "imbalance-detected" && node.value === currentNode) {
      fillHex = "#ef4444";
      strokeHex = "#f87171";
    } else if (stepType === "rotation-complete" && node.value === currentNode) {
      fillHex = "#10b981";
      strokeHex = "#34d399";
    } else if (state === "found") {
      fillHex = "#f59e0b";
      strokeHex = "#fbbf24";
    } else if (state === "inserted") {
      fillHex = "#10b981";
      strokeHex = "#34d399";
    } else if (state === "deleted") {
      fillHex = "#ef4444";
      strokeHex = "#f87171";
    } else if (state === "predecessor" || state === "visiting-succ") {
      fillHex = "#a855f7";
      strokeHex = "#c084fc";
    } else if (state === "visiting" || state === "active") {
      fillHex = "#3b82f6";
      strokeHex = "#60a5fa";
    } else if (state === "active-succ") {
      fillHex = "#14b8a6";
      strokeHex = "#5eead4";
    }

    return { fillHex, strokeHex };
  };

  const currentHighlightLine = currentStep ? currentStep.codeLine : -1;
  const showBanner = currentStep && (currentStep.stepType === "imbalance-detected" || currentStep.stepType === "rotation-complete");
  const bannerStyle = currentStep?.stepType === "rotation-complete"
    ? {
        backgroundColor: "color-mix(in srgb, var(--color-success) 12%, var(--color-neutral-950))",
        borderColor: "color-mix(in srgb, var(--color-success) 35%, var(--color-neutral-700))",
        color: "var(--color-success)",
      }
    : {
        backgroundColor: "color-mix(in srgb, var(--color-warning) 12%, var(--color-neutral-950))",
        borderColor: "color-mix(in srgb, var(--color-warning) 35%, var(--color-neutral-700))",
        color: "var(--color-warning)",
      };
  const swapValues = currentStep?.swapValues || null;
  const isSwapPhase = currentStep?.stepType === "swap-values" || currentStep?.stepType === "delete-successor";

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-slate-900 dark:text-slate-100">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col gap-8">
        <div className="w-full">
          <Breadcrumbs paths={createVisualizerPaths("Tree", "AVL", "AVL Tree")} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 px-3 py-1 rounded-full w-fit border border-indigo-100 dark:border-indigo-900/50">
              <Layers className="w-3.5 h-3.5" /> AVL Interactive Operations
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-600 to-indigo-400 dark:from-white dark:via-indigo-200 dark:to-indigo-400">
              AVL Tree
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Insert and delete operations keep the tree height-balanced with rotations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-300 font-semibold">
              {operationLabel}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] backdrop-blur-xl border border-gray-200 dark:border-[#222] p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
            <button
              onClick={handleInsert}
              disabled={isAnimating}
              className="px-4 py-2 text-xs font-bold bg-gray-900 hover:bg-slate-800 dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a] text-white rounded-xl transition-all border border-gray-200 dark:border-[#333] disabled:opacity-40"
            >
              Insert
            </button>
            <button
              onClick={handleDelete}
              disabled={isAnimating}
              className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-xl transition-all border border-gray-200 dark:border-slate-700 disabled:opacity-40"
            >
              Delete
            </button>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full sm:w-32 px-3 py-2 text-xs bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={isAnimating}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInsert();
                }
              }}
            />
          </div>

          <PlaybackControls
            isPlaying={isAnimating}
            onPlayPause={isAnimating ? pauseVisualizer : startVisualizer}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={handleResetPlayback}
            onClear={clearTree}
            clearLabel="Clear Tree"
            speed={speed}
            onSpeedChange={setSpeed}
            disabled={steps.length === 0 && !isAnimating}
            showPlayPause={true}
            progressText={`Step ${currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / ${steps.length || 0}`}
          />
        </div>

        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" /> Action Explanation
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-bold bg-gray-100 dark:bg-[#1a1a1a] px-2.5 py-0.5 rounded-full border border-gray-300 dark:border-[#333]">
              Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
            </span>
          </div>
          <div
            className="text-[14px] leading-relaxed min-h-[24px] text-center text-slate-600 dark:text-slate-400"
          >
            {message}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[440px] items-center">
            {showBanner && (
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-4xl w-[calc(100%-2rem)] border rounded-2xl px-4 py-3 shadow-lg shadow-black/30"
                style={bannerStyle}
              >
                <div className="text-[11px] uppercase tracking-[0.2em] font-bold mb-1">AVL Balance Update</div>
                <div className="text-sm font-semibold leading-relaxed">{currentStep?.explanation}</div>
              </div>
            )}

            {!activeTree ? (
              <div className="flex flex-col items-center gap-2.5 text-slate-400 dark:text-slate-500 py-12">
                <AlertCircle className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Workspace Empty</span>
                <span className="text-xs max-w-xs text-center text-slate-500 dark:text-slate-400">
                  Enter a value and click Insert or Delete to begin.
                </span>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 520"
                  className="overflow-visible"
                  style={{ minHeight: "440px" }}
                >
                  <defs>
                    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.35" />
                    </filter>
                  </defs>

                  {renderEdges.map((edge, idx) => (
                    <line
                      key={`edge-${idx}`}
                      x1={edge.x1}
                      y1={edge.y1}
                      x2={edge.x2}
                      y2={edge.y2}
                      className="stroke-slate-300 dark:stroke-slate-700"
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                    />
                  ))}

                  {renderNodes.map((node, idx) => {
                    const { fillHex, strokeHex } = getNodeColors(node);
                    const displayValue = swapValues && isSwapPhase
                      ? (node.value === swapValues.targetValue
                          ? swapValues.successorValue
                          : node.value === swapValues.successorValue
                            ? swapValues.targetValue
                            : node.value)
                      : node.value;
                    const bfAbs = Math.abs(node.balanceFactor || 0);
                    const bfFill = bfAbs > 1 ? "var(--color-danger)" : bfAbs === 1 ? "var(--color-warning)" : "var(--color-neutral-700)";
                    const bfStroke = bfAbs > 1 ? "var(--color-danger)" : bfAbs === 1 ? "var(--color-warning)" : "var(--color-neutral-500)";
                    const bfText = bfAbs > 1 || bfAbs === 1 ? "var(--color-neutral-950)" : "var(--color-neutral-50)";

                    return (
                      <g key={`node-${idx}`} className="transition-all duration-300">
                        {(node.state === "visiting" || node.state === "found" || node.state === "inserted" || node.state === "deleted" || node.state === "predecessor") && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="28"
                            fill="none"
                            stroke={strokeHex}
                            strokeWidth="1.5"
                            strokeDasharray="4,2"
                            className="opacity-60"
                          />
                        )}

                        <g transform={`translate(${node.x - 18}, ${node.y - 44})`}>
                          <rect width="36" height="18" rx="6" fill={bfFill} stroke={bfStroke} strokeWidth="1" />
                          <text x="18" y="12.5" fill={bfText} fontSize="9" fontWeight="700" textAnchor="middle">
                            BF {node.balanceFactor}
                          </text>
                        </g>

                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="21"
                          fill={fillHex}
                          stroke={strokeHex}
                          strokeWidth="2.5"
                          filter="url(#shadow)"
                          className="transition-all duration-300"
                        />

                        <text
                          x={node.x}
                          y={node.y + 4.5}
                          textAnchor="middle"
                          className="fill-white dark:fill-slate-800"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {displayValue}
                        </text>

                        <text
                          x={node.x}
                          y={node.y + 39}
                          textAnchor="middle"
                          className="fill-slate-400 dark:fill-slate-400"
                          fontSize="9"
                          fontWeight="700"
                        >
                          h {node.height}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <CustomInputPanel
              inputType="array"
              onApply={handleCustomTreeInput}
              currentData={[]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Time Complexity</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
                O(log N)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
              AVL rebalancing keeps the height logarithmic after insertions and deletions.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Space Complexity</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-950/40 text-purple-400 border border-purple-900/50">
                O(log N)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
              Recursive operations use the call stack proportional to the tree height.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

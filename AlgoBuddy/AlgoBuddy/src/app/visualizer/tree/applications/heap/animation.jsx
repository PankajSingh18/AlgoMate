"use client";

import React, { useMemo, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpToLine, Eye, Layers, Repeat, Sparkles } from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";

const INITIAL_HEAP = [20, 35, 40, 55, 60, 75];
const STEP_DELAY = 650;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parentIndex = (i) => Math.floor((i - 1) / 2);
const leftChild = (i) => 2 * i + 1;
const rightChild = (i) => 2 * i + 2;

export default function HeapAnimation() {
  const [heapType, setHeapType] = useState("min");
  const [heap, setHeap] = useState(INITIAL_HEAP);
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState("Ready");
  const [explanation, setExplanation] = useState("Choose a heap type and run an operation to start learning.");
  const [comparisonText, setComparisonText] = useState("");
  const [activeIndices, setActiveIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTokenRef = useRef(0);

  const compare = (a, b, mode = heapType) => (mode === "min" ? a < b : a > b);

  const runFrame = async (frame, token) => {
    if (animationTokenRef.current !== token) return;
    setHeap(frame.heap);
    setOperation(frame.operation);
    setExplanation(frame.explanation);
    setComparisonText(frame.comparison || "");
    setActiveIndices(frame.activeIndices || []);
    setSwappingIndices(frame.swappingIndices || []);
    await wait(STEP_DELAY);
  };

  const playFrames = async (frames) => {
    const token = Date.now();
    animationTokenRef.current = token;
    setIsAnimating(true);
    for (const frame of frames) {
      await runFrame(frame, token);
      if (animationTokenRef.current !== token) return;
    }
    setActiveIndices([]);
    setSwappingIndices([]);
    setComparisonText("");
    setIsAnimating(false);
  };

  const buildHeapFrames = (seedHeap, mode) => {
    const arr = [...seedHeap];
    const frames = [
      {
        heap: [...arr],
        operation: `Switch to ${mode === "min" ? "Min Heap" : "Max Heap"}`,
        explanation: "Rebuilding structure to satisfy the new heap property.",
      },
    ];

    const heapifyDown = (start, size) => {
      let i = start;
      while (true) {
        let target = i;
        const l = leftChild(i);
        const r = rightChild(i);

        if (l < size) {
          frames.push({
            heap: [...arr],
            operation: "Heapify",
            explanation: `${mode === "min" ? "Min" : "Max"} Heap property check in progress.`,
            comparison: `Comparing node ${arr[i]} with left child ${arr[l]}`,
            activeIndices: [i, l],
          });
          if (compare(arr[l], arr[target], mode)) target = l;
        }

        if (r < size) {
          frames.push({
            heap: [...arr],
            operation: "Heapify",
            explanation: `${mode === "min" ? "Min" : "Max"} Heap property check in progress.`,
            comparison: `Comparing node ${arr[target]} with right child ${arr[r]}`,
            activeIndices: [target, r],
          });
          if (compare(arr[r], arr[target], mode)) target = r;
        }

        if (target === i) break;

        frames.push({
          heap: [...arr],
          operation: "Heapify",
          explanation: `Swapping nodes to restore ${mode === "min" ? "Min" : "Max"} Heap property.`,
          comparison: `Swapping ${arr[i]} and ${arr[target]}`,
          swappingIndices: [i, target],
          activeIndices: [i, target],
        });

        [arr[i], arr[target]] = [arr[target], arr[i]];

        frames.push({
          heap: [...arr],
          operation: "Heapify",
          explanation: "Partial heap fixed. Continuing down the tree.",
          activeIndices: [target],
        });

        i = target;
      }
    };

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i -= 1) {
      heapifyDown(i, arr.length);
    }

    frames.push({
      heap: [...arr],
      operation: "Heapify Complete",
      explanation: `${mode === "min" ? "Min" : "Max"} Heap property restored for entire tree.`,
    });

    return frames;
  };

  const insertValue = async () => {
    if (isAnimating) return;
    const parsed = Number(inputValue);
    if (!Number.isFinite(parsed)) {
      setExplanation("Please enter a valid number before inserting.");
      return;
    }

    const arr = [...heap, parsed];
    const frames = [
      {
        heap: [...arr],
        operation: "Insert",
        explanation: `Inserted ${parsed} at the end of the heap (next available position).`,
        activeIndices: [arr.length - 1],
      },
    ];

    let i = arr.length - 1;
    while (i > 0) {
      const p = parentIndex(i);
      frames.push({
        heap: [...arr],
        operation: "Heapify Up",
        explanation: "Checking if child violates heap property with its parent.",
        comparison: `Comparing ${arr[i]} with parent ${arr[p]}`,
        activeIndices: [i, p],
      });

      if (!compare(arr[i], arr[p])) break;

      frames.push({
        heap: [...arr],
        operation: "Heapify Up",
        explanation: `Swapping nodes to maintain ${heapType === "min" ? "Min" : "Max"} Heap property.`,
        comparison: `Swapping ${arr[i]} and ${arr[p]}`,
        swappingIndices: [i, p],
        activeIndices: [i, p],
      });

      [arr[i], arr[p]] = [arr[p], arr[i]];

      frames.push({
        heap: [...arr],
        operation: "Heapify Up",
        explanation: "Node moved up one level.",
        activeIndices: [p],
      });

      i = p;
    }

    frames.push({
      heap: [...arr],
      operation: "Insert Complete",
      explanation: `${parsed} inserted and heap property is satisfied.`,
    });

    await playFrames(frames);
    setInputValue("");
  };

  const extractRoot = async () => {
    if (isAnimating) return;
    if (heap.length === 0) {
      setExplanation("Heap is empty. Nothing to extract.");
      return;
    }

    const arr = [...heap];
    const rootLabel = heapType === "min" ? "Min" : "Max";
    const rootValue = arr[0];
    const frames = [
      {
        heap: [...arr],
        operation: `Extract ${rootLabel}`,
        explanation: `Removing root value ${rootValue}.`,
        activeIndices: [0],
      },
    ];

    if (arr.length === 1) {
      frames.push({
        heap: [],
        operation: `Extract ${rootLabel} Complete`,
        explanation: `Extracted ${rootValue}. Heap is now empty.`,
      });
      await playFrames(frames);
      return;
    }

    const last = arr[arr.length - 1];
    arr[0] = last;
    arr.pop();

    frames.push({
      heap: [...arr],
      operation: "Replace Root",
      explanation: `Replaced root with last node ${last}. Heapify Down begins.`,
      activeIndices: [0],
    });

    let i = 0;
    while (true) {
      let target = i;
      const l = leftChild(i);
      const r = rightChild(i);

      if (l < arr.length) {
        frames.push({
          heap: [...arr],
          operation: "Heapify Down",
          explanation: "Comparing root candidate with children.",
          comparison: `Comparing ${arr[target]} with left child ${arr[l]}`,
          activeIndices: [target, l],
        });
        if (compare(arr[l], arr[target])) target = l;
      }

      if (r < arr.length) {
        frames.push({
          heap: [...arr],
          operation: "Heapify Down",
          explanation: "Choosing best child according to heap type.",
          comparison: `Comparing ${arr[target]} with right child ${arr[r]}`,
          activeIndices: [target, r],
        });
        if (compare(arr[r], arr[target])) target = r;
      }

      if (target === i) break;

      frames.push({
        heap: [...arr],
        operation: "Heapify Down",
        explanation: "Swapping to restore heap property.",
        comparison: `Swapping ${arr[i]} and ${arr[target]}`,
        swappingIndices: [i, target],
        activeIndices: [i, target],
      });

      [arr[i], arr[target]] = [arr[target], arr[i]];

      frames.push({
        heap: [...arr],
        operation: "Heapify Down",
        explanation: "Continuing down toward leaves.",
        activeIndices: [target],
      });

      i = target;
    }

    frames.push({
      heap: [...arr],
      operation: `Extract ${rootLabel} Complete`,
      explanation: `Extracted ${rootValue}. Final heap structure restored.`,
    });

    await playFrames(frames);
  };

  const peekRoot = async () => {
    if (isAnimating) return;
    if (heap.length === 0) {
      setExplanation("Heap is empty. No root to peek.");
      return;
    }

    await playFrames([
      {
        heap: [...heap],
        operation: "Peek",
        explanation: `Root value is ${heap[0]}.`,
        comparison: `${heapType === "min" ? "Min" : "Max"} element always stays at root.`,
        activeIndices: [0],
      },
    ]);
  };

  const manualHeapify = async () => {
    if (isAnimating) return;
    await playFrames(buildHeapFrames(heap, heapType));
  };

  const onHeapTypeChange = async (type) => {
    if (type === heapType || isAnimating) return;
    setHeapType(type);
    await playFrames(buildHeapFrames(heap, type));
  };

  const reset = async () => {
    if (isAnimating) return;
    setHeapType("min");
    await playFrames(buildHeapFrames(INITIAL_HEAP, "min"));
  };

  const nodes = useMemo(() => {
    const levelHeight = 110;
    return heap.map((value, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const levelStart = (1 << level) - 1;
      const positionInLevel = index - levelStart;
      const nodesInLevel = 1 << level;
      const x = ((positionInLevel + 1) * 1000) / (nodesInLevel + 1);
      const y = 70 + level * levelHeight;
      return { index, value, x, y };
    });
  }, [heap]);

  const treeHeight = useMemo(() => {
    const levels = Math.max(1, Math.ceil(Math.log2(heap.length + 1)));
    return 80 + levels * 110;
  }, [heap.length]);

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex flex-wrap items-end gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onHeapTypeChange("min")}
              disabled={isAnimating}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                heapType === "min"
                  ? "bg-[#a435f0] text-white border-[#a435f0]"
                  : "bg-white text-[#6b7280] border-[#d1d5db] dark:bg-[#111] dark:text-[#d1d5db] dark:border-[#333]"
              }`}
            >
              Min Heap
            </button>
            <button
              onClick={() => onHeapTypeChange("max")}
              disabled={isAnimating}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                heapType === "max"
                  ? "bg-[#a435f0] text-white border-[#a435f0]"
                  : "bg-white text-[#6b7280] border-[#d1d5db] dark:bg-[#111] dark:text-[#d1d5db] dark:border-[#333]"
              }`}
            >
              Max Heap
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              disabled={isAnimating}
              className="w-36 rounded-xl border border-[#d1d5db] dark:border-[#333] bg-white dark:bg-[#111] px-3 py-2 text-sm"
            />
            <button onClick={insertValue} disabled={isAnimating} className="px-3 py-2 rounded-xl bg-[#a435f0] text-white text-sm font-semibold inline-flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" /> Insert
            </button>
            <button onClick={extractRoot} disabled={isAnimating} className="px-3 py-2 rounded-xl bg-[#7e22ce] text-white text-sm font-semibold inline-flex items-center gap-2">
              <ArrowUpToLine className="w-4 h-4" /> {heapType === "min" ? "Extract Min" : "Extract Max"}
            </button>
            <button onClick={peekRoot} disabled={isAnimating} className="px-3 py-2 rounded-xl bg-[#9333ea] text-white text-sm font-semibold inline-flex items-center gap-2">
              <Eye className="w-4 h-4" /> Peek
            </button>
            <button onClick={manualHeapify} disabled={isAnimating} className="px-3 py-2 rounded-xl bg-[#6d28d9] text-white text-sm font-semibold inline-flex items-center gap-2">
              <Layers className="w-4 h-4" /> Heapify
            </button>
            <button onClick={reset} disabled={isAnimating} className="px-3 py-2 rounded-xl border border-[#a435f0]/40 text-[#7e22ce] dark:text-[#d8b4fe] text-sm font-semibold inline-flex items-center gap-2">
              <Repeat className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      </VisualizerCard>

      <VisualizerCard className="border-[#a435f0]/20 bg-[#a435f0]/5 dark:bg-[#a435f0]/10">
        <div className="flex items-center justify-between text-xs text-[#6b7280] dark:text-[#c4b5fd] mb-1">
          <span className="inline-flex items-center gap-1 font-semibold"><Sparkles className="w-4 h-4 text-[#a435f0]" /> Current Operation</span>
          <span>{isAnimating ? "Animating" : "Idle"}</span>
        </div>
        <p className="text-lg font-semibold text-[#3b0764] dark:text-[#f5d0fe]">{operation}</p>
        <p className="text-sm text-[#5b21b6] dark:text-[#ddd6fe] mt-1">{explanation}</p>
        <p className="text-sm text-[#6b7280] dark:text-[#c4b5fd] mt-1 min-h-[20px]">{comparisonText}</p>
      </VisualizerCard>

      <VisualizerCard>
        <p className="text-sm font-semibold mb-3 text-[#6b21a8] dark:text-[#d8b4fe]">Tree Representation ({heapType === "min" ? "Min Heap" : "Max Heap"})</p>
        <div className="overflow-x-auto rounded-xl border border-[#ede9fe] dark:border-[#312e81] bg-[#faf5ff] dark:bg-[#0f0a1f]">
          <svg viewBox={`0 0 1000 ${treeHeight}`} className="w-full h-auto min-w-[640px]">
            {nodes.map((node) => {
              const l = leftChild(node.index);
              const r = rightChild(node.index);
              return (
                <g key={`edge-${node.index}`}>
                  {l < nodes.length && (
                    <line
                      x1={node.x}
                      y1={node.y + 25}
                      x2={nodes[l].x}
                      y2={nodes[l].y - 25}
                      className="stroke-violet-500 dark:stroke-violet-400"
                      strokeOpacity="0.45"
                      strokeWidth="2"
                    />
                  )}
                  {r < nodes.length && (
                    <line
                      x1={node.x}
                      y1={node.y + 25}
                      x2={nodes[r].x}
                      y2={nodes[r].y - 25}
                      className="stroke-violet-500 dark:stroke-violet-400"
                      strokeOpacity="0.45"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}

            {nodes.map((node) => {
              const isSwap = swappingIndices.includes(node.index);
              const isActive = activeIndices.includes(node.index);
              return (
                <g key={`node-${node.index}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="28"
                    fill={isSwap ? "#c026d3" : isActive ? "#a855f7" : "#ffffff"}
                    stroke={isSwap ? "#f5d0fe" : isActive ? "#e9d5ff" : "#a78bfa"}
                    strokeWidth="3"
                    className="transition-all duration-500"
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill={isActive || isSwap ? "#fff" : "#4c1d95"} fontSize="15" fontWeight="700">
                    {node.value}
                  </text>
                  <text x={node.x} y={node.y + 42} textAnchor="middle" className="fill-violet-600 dark:fill-violet-500" fontSize="11" fontWeight="600">
                    idx {node.index}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </VisualizerCard>

      <VisualizerCard>
        <p className="text-sm font-semibold mb-3 text-[#6b21a8] dark:text-[#d8b4fe]">Array Representation (Synced)</p>
        <div className="flex flex-wrap gap-2">
          {heap.map((value, index) => {
            const isSwap = swappingIndices.includes(index);
            const isActive = activeIndices.includes(index);
            return (
              <div key={`arr-${index}`} className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500 ${
                isSwap
                  ? "bg-fuchsia-600 border-fuchsia-300 text-white scale-105"
                  : isActive
                    ? "bg-purple-500 border-purple-200 text-white scale-105"
                    : "bg-white dark:bg-[#111] border-purple-200 dark:border-purple-900 text-[#5b21b6] dark:text-[#ddd6fe]"
              }`}>
                <span className="text-base font-bold">{value}</span>
                <span className="text-[10px] opacity-80">[{index}]</span>
              </div>
            );
          })}
          {heap.length === 0 && (
            <div className="text-sm text-[#6b7280] dark:text-[#9ca3af]">Heap is empty.</div>
          )}
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}

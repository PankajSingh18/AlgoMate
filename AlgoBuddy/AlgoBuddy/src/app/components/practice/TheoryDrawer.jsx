"use client";

import React, { useEffect, useState } from "react";
import { X, Play, Clock, ShieldAlert, CheckCircle2, ArrowRight, Layers, Bookmark } from "lucide-react";
import Link from "next/link";
import { useProblemBookmarks } from "@/app/hooks/useProblemBookmarks";

export default function TheoryDrawer({ isOpen, onClose, problem, topicSlug }) {
  const [activeTab, setActiveTab] = useState("concept");
  const [animationStep, setAnimationStep] = useState(0);
  const { isBookmarked, toggleBookmark } = useProblemBookmarks();

  // Reset tab and animation on problem change
  useEffect(() => {
    setActiveTab("concept");
    setAnimationStep(0);
  }, [problem]);

  if (!isOpen || !problem) return null;

  const { name, difficulty, visualizerUrl, theory } = problem;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sliding Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-[9999] w-full max-w-xl bg-white dark:bg-[#1c1d1f] shadow-2xl border-l border-surface-200 dark:border-neutral-800 flex flex-col transition-transform duration-300 transform translate-x-0 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-surface-100 dark:border-neutral-800 bg-purple-50/50 dark:bg-purple-950/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 dark:bg-primary/20 dark:text-purple-300 px-2.5 py-1 rounded-full">
              Theory Module
            </span>
            <h2 className="text-2xl font-black mt-2 text-surface-900 dark:text-white flex items-center gap-2">
              {name}
              <button
                onClick={() => toggleBookmark(problem.id, topicSlug)}
                className={`p-1.5 rounded-lg border transition hover:scale-105 active:scale-95 duration-200 ${
                  isBookmarked(problem.id)
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500 dark:bg-amber-950/20"
                    : "bg-surface-50/20 border-surface-200/50 text-surface-400 hover:text-surface-600 dark:border-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300"
                }`}
                title={isBookmarked(problem.id) ? "Unbookmark problem" : "Bookmark problem"}
              >
                <Bookmark size={14} className={isBookmarked(problem.id) ? "fill-amber-500 text-amber-500" : ""} />
              </button>
            </h2>
            <span className={`inline-block text-[11px] font-bold mt-1 ${
              difficulty === "Easy" ? "text-green-500" :
              difficulty === "Medium" ? "text-yellow-500" : "text-red-500"
            }`}>
              ● {difficulty}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-50 hover:bg-surface-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-surface-100 dark:border-neutral-800 bg-white dark:bg-[#1c1d1f] px-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("concept")}
            className={`py-3.5 px-4 border-b-2 transition-colors ${
              activeTab === "concept"
                ? "border-primary text-primary"
                : "border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white"
            }`}
          >
            Concept
          </button>
          <button
            onClick={() => setActiveTab("walkthrough")}
            className={`py-3.5 px-4 border-b-2 transition-colors ${
              activeTab === "walkthrough"
                ? "border-primary text-primary"
                : "border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white"
            }`}
          >
            Dry Run
          </button>
          <button
            onClick={() => setActiveTab("complexity")}
            className={`py-3.5 px-4 border-b-2 transition-colors ${
              activeTab === "complexity"
                ? "border-primary text-primary"
                : "border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white"
            }`}
          >
            Complexity
          </button>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "concept" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Summary */}
              <div className="bg-surface-50 dark:bg-[#2d2f31] p-5 rounded-2xl border border-surface-200 dark:border-neutral-800">
                <h3 className="text-md font-bold mb-2">Introduction</h3>
                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed font-poppins">
                  {theory.summary}
                </p>
              </div>

              {/* Core Steps */}
              <div className="space-y-3">
                <h3 className="text-md font-bold">Step-by-step Algorithm</h3>
                <ol className="space-y-2">
                  {theory.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-surface-600 dark:text-surface-300 items-start leading-relaxed">
                      <span className="w-5 h-5 flex-shrink-0 bg-primary/10 dark:bg-primary/20 text-primary dark:text-purple-300 text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Pitfalls & Common Mistakes */}
              {theory.pitfalls && (
                <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-500/20 p-4 rounded-xl flex gap-3 text-sm">
                  <ShieldAlert className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1">Common Pitfall</h4>
                    <p className="text-amber-700/80 dark:text-amber-200/80 leading-relaxed text-xs">
                      {theory.pitfalls}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "walkthrough" && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-md font-bold">Interactive Dry Run</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Click through the steps below to watch the conceptual animation of this algorithm in action.
              </p>

              {/* Visual CSS-Animated Representation */}
              <div className="h-44 bg-surface-50 dark:bg-[#2d2f31] rounded-2xl border border-surface-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative p-4">
                
                {/* Binary Search Animation Box */}
                {problem.id === "binary-search" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-2">
                      {[1, 3, 5, 8, 12, 17, 22].map((val, idx) => {
                        let bgClass = "bg-white dark:bg-[#1c1d1f] border-surface-300 dark:border-neutral-700 text-surface-800 dark:text-white";
                        if (animationStep === 1 && idx === 3) bgClass = "bg-primary border-primary text-white scale-105 shadow-md";
                        if (animationStep === 2 && idx >= 4) bgClass = "bg-primary/20 border-primary/40 text-primary dark:text-purple-300 scale-105";
                        if (animationStep === 3 && idx === 5) bgClass = "bg-green-500 border-green-500 text-white scale-105 shadow-md";

                        return (
                          <div
                            key={idx}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${bgClass}`}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Array is sorted. Target = 17."}
                      {animationStep === 1 && "Compare target 17 with mid element at index 3 (val = 8). 8 < 17."}
                      {animationStep === 2 && "Discard left half. Search space is now indices [4 to 6]."}
                      {animationStep === 3 && "Recalculate mid = 5 (val = 17). target 17 == 17. Found!"}
                    </div>
                  </div>
                )}

                {/* Linear Search Animation Box */}
                {problem.id === "linear-search" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-2">
                      {[5, 12, 8, 22, 14].map((val, idx) => {
                        let bgClass = "bg-white dark:bg-[#1c1d1f] border-surface-300 dark:border-neutral-700 text-surface-800 dark:text-white";
                        if (animationStep > 0 && idx === animationStep - 1) bgClass = "bg-primary border-primary text-white scale-105";
                        if (animationStep === 3 && idx === 2) bgClass = "bg-green-500 border-green-500 text-white scale-105 shadow-md animate-bounce";

                        return (
                          <div
                            key={idx}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${bgClass}`}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Target = 8. Start search at index 0."}
                      {animationStep === 1 && "Check index 0: 5 != 8. Move forward."}
                      {animationStep === 2 && "Check index 1: 12 != 8. Move forward."}
                      {animationStep === 3 && "Check index 2: 8 == 8. Found target!"}
                    </div>
                  </div>
                )}

                {/* Reverse Linked List Animation Box */}
                {problem.id === "reverse-list" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-1">
                      {[10, 20, 30].map((val, idx) => {
                        const isReversed = animationStep > idx;
                        return (
                          <React.Fragment key={idx}>
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1c1d1f] border-2 border-surface-300 dark:border-neutral-700 flex items-center justify-center font-bold text-xs">
                              {val}
                            </div>
                            {idx < 2 && (
                              <span className={`text-xl transition-all duration-500 ${isReversed ? 'text-green-500 rotate-180' : 'text-primary'}`}>
                                →
                              </span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Original list: 10 → 20 → 30."}
                      {animationStep === 1 && "Reverse link from 20 back to 10."}
                      {animationStep >= 2 && "Reverse link from 30 back to 20. List reversed!"}
                    </div>
                  </div>
                )}

                {/* Quick Sort Animation Box */}
                {problem.id === "quick-sort" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-2">
                      {[5, 2, 9, 3, 6].map((val, idx) => {
                        let bgClass = "bg-white dark:bg-[#1c1d1f] border-surface-300 dark:border-neutral-700 text-surface-800 dark:text-white";
                        if (idx === 4) bgClass = "border-primary border-dashed font-extrabold text-primary";
                        if (animationStep === 1) {
                          if (idx === 4) bgClass = "bg-primary border-primary text-white";
                          else if (val < 6) bgClass = "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400";
                          else if (val > 6) bgClass = "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400";
                        }
                        if (animationStep === 2) {
                          if (idx === 3) bgClass = "bg-green-500 border-green-500 text-white scale-105 shadow-md animate-bounce";
                          else bgClass = "opacity-40";
                        }

                        return (
                          <div
                            key={idx}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${bgClass}`}
                          >
                            {animationStep === 2 && idx === 3 ? "6" : animationStep === 2 && idx === 4 ? "3" : val}
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Last element 6 is selected as the Pivot."}
                      {animationStep === 1 && "Partition: group elements smaller than 6 (left) and larger (right)."}
                      {animationStep === 2 && "Swap Pivot 6 to index 3. Pivot is now in sorted position!"}
                    </div>
                  </div>
                )}

                {/* Bubble Sort Animation Box */}
                {problem.id === "bubble-sort" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-2">
                      {[4, 1, 3, 2].map((val, idx) => {
                        let bgClass = "bg-white dark:bg-[#1c1d1f] border-surface-300 dark:border-neutral-700 text-surface-800 dark:text-white";
                        if (animationStep === 1 && (idx === 0 || idx === 1)) bgClass = "bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-400 scale-105";
                        if (animationStep === 2 && (idx === 1 || idx === 2)) bgClass = "bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-400 scale-105";
                        if (animationStep === 3 && idx === 3) bgClass = "bg-green-500 border-green-500 text-white scale-105 shadow-md";

                        let displayVal = val;
                        if (animationStep === 1) {
                          if (idx === 0) displayVal = 1;
                          if (idx === 1) displayVal = 4;
                        } else if (animationStep >= 2) {
                          if (idx === 0) displayVal = 1;
                          if (idx === 1) displayVal = 3;
                          if (idx === 2) displayVal = 2;
                          if (idx === 3) displayVal = 4;
                        }

                        return (
                          <div
                            key={idx}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${bgClass}`}
                          >
                            {displayVal}
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Unsorted array: [4, 1, 3, 2]."}
                      {animationStep === 1 && "Compare index 0 and 1: 4 > 1, so swap them. [1, 4, 3, 2]"}
                      {animationStep === 2 && "Compare index 1 and 2: 4 > 3, so swap them. [1, 3, 4, 2]"}
                      {animationStep === 3 && "Final swap puts 4 in the correct rightmost sorted position. [1, 3, 2 | 4]"}
                    </div>
                  </div>
                )}

                {/* Merge Sort Animation Box */}
                {problem.id === "merge-sort" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    {animationStep === 0 && (
                      <div className="flex gap-2">
                        {[8, 3, 2, 9].map((val, idx) => (
                          <div key={idx} className="w-10 h-10 rounded-lg border-2 border-surface-300 dark:border-neutral-700 bg-white dark:bg-[#1c1d1f] flex items-center justify-center font-bold text-sm">
                            {val}
                          </div>
                        ))}
                      </div>
                    )}
                    {animationStep === 1 && (
                      <div className="flex gap-8">
                        <div className="flex gap-2 border border-primary/20 p-1.5 rounded-lg bg-primary/5">
                          {[8, 3].map((val, idx) => (
                            <div key={idx} className="w-8 h-8 rounded bg-white dark:bg-[#1c1d1f] border flex items-center justify-center font-bold text-xs">
                              {val}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 border border-primary/20 p-1.5 rounded-lg bg-primary/5">
                          {[2, 9].map((val, idx) => (
                            <div key={idx} className="w-8 h-8 rounded bg-white dark:bg-[#1c1d1f] border flex items-center justify-center font-bold text-xs">
                              {val}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {animationStep === 2 && (
                      <div className="flex gap-2">
                        {[2, 3, 8, 9].map((val, idx) => (
                          <div key={idx} className="w-10 h-10 rounded-lg border-2 border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 flex items-center justify-center font-bold text-sm scale-105 shadow-md">
                            {val}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Unsorted array: [8, 3, 2, 9]."}
                      {animationStep === 1 && "Divide the array in half recursively into [8, 3] and [2, 9]."}
                      {animationStep === 2 && "Sort sub-arrays and merge them back recursively. Sorted!"}
                    </div>
                  </div>
                )}

                {/* Stack Push Pop Animation Box */}
                {problem.id === "push-pop" && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="w-32 h-20 border-b-4 border-x-4 border-primary rounded-b-xl flex flex-col justify-end p-1 gap-1">
                      {animationStep >= 1 && (
                        <div className="h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">
                          10
                        </div>
                      )}
                      {animationStep === 2 && (
                        <div className="h-6 rounded bg-primary-dark text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">
                          20
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Stack is empty."}
                      {animationStep === 1 && "Push 10 onto the stack. Elements load at top index."}
                      {animationStep === 2 && "Push 20. Top is now 20 (LIFO behavior)."}
                      {animationStep === 3 && "Pop element: retrieved 20 from top index. Stack has [10]."}
                    </div>
                  </div>
                )}

                {/* Queue Enqueue Dequeue Animation Box */}
                {problem.id === "enqueue-dequeue" && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="w-48 h-10 border-y-4 border-primary flex items-center justify-center p-1 gap-2">
                      {animationStep === 1 && (
                        <div className="w-10 h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow animate-slideRight">
                          A
                        </div>
                      )}
                      {animationStep === 2 && (
                        <>
                          <div className="w-10 h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow">
                            A
                          </div>
                          <div className="w-10 h-6 rounded bg-primary-dark text-white text-xs font-bold flex items-center justify-center shadow animate-slideRight">
                            B
                          </div>
                        </>
                      )}
                      {animationStep === 3 && (
                        <div className="w-10 h-6 rounded bg-primary-dark text-white text-xs font-bold flex items-center justify-center shadow">
                          B
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Queue is empty."}
                      {animationStep === 1 && "Enqueue A: Inserted at index 0 (Front = Rear)."}
                      {animationStep === 2 && "Enqueue B: Inserted at rear index 1 (FIFO order)."}
                      {animationStep === 3 && "Dequeue: Removed A from Front index. B shifts forward."}
                    </div>
                  </div>
                )}

                {/* Trees Traversal Animation Box */}
                {problem.id === "inorder-traversal" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-8 relative">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep === 1 ? 'bg-primary border-primary text-white scale-105' : 'bg-white dark:bg-neutral-800'
                      }`}>
                        A
                      </div>
                      <div className={`absolute -bottom-6 -left-4 w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep === 0 ? 'bg-primary border-primary text-white scale-105' : 'bg-white dark:bg-neutral-800'
                      }`}>
                        B
                      </div>
                      <div className={`absolute -bottom-6 -right-4 w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep === 2 ? 'bg-primary border-primary text-white scale-105' : 'bg-white dark:bg-neutral-800'
                      }`}>
                        C
                      </div>
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6 mt-6">
                      {animationStep === 0 && "Step 1: Traverse left subtree. Visit node B."}
                      {animationStep === 1 && "Step 2: Visit root node A."}
                      {animationStep === 2 && "Step 3: Traverse right subtree. Visit node C. Output: [B, A, C]"}
                    </div>
                  </div>
                )}

                {/* HashMap Two Sum Animation Box */}
                {problem.id === "two-sum" && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="flex gap-6 items-center">
                      <div className="flex gap-1.5 border p-1 rounded-lg">
                        <span className="text-[10px] text-surface-400 border-r pr-1.5 font-bold uppercase">Arr</span>
                        <div className="w-8 h-8 rounded bg-primary text-white font-bold flex items-center justify-center text-xs">2</div>
                        <div className="w-8 h-8 rounded bg-green-500 text-white font-bold flex items-center justify-center text-xs scale-105 shadow">7</div>
                        <div className="w-8 h-8 rounded bg-white dark:bg-neutral-800 border flex items-center justify-center text-xs">11</div>
                      </div>
                      <div className="flex flex-col gap-1 border p-1.5 rounded-lg bg-surface-100 dark:bg-neutral-800 text-[10px] font-mono">
                        <span className="font-bold text-[9px] uppercase border-b pb-0.5 mb-0.5">HashMap Keys</span>
                        <span>"2" : index 0</span>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Index 0 (val=2). Complement 9 - 2 = 7 not in map. Store {2: 0}."}
                      {animationStep === 1 && "Index 1 (val=7). Complement 9 - 7 = 2 EXISTS in map! Found pair indices [0, 1]!"}
                    </div>
                  </div>
                )}

                {/* Graph BFS Traversal Animation Box */}
                {problem.id === "bfs-graph" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-8 relative items-center justify-center h-12 w-full">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep >= 0 ? 'bg-primary border-primary text-white' : ''
                      }`}>
                        1
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep >= 1 ? 'bg-green-500 border-green-500 text-white animate-pulse' : 'border-dashed'
                      }`}>
                        2
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep >= 1 ? 'bg-green-500 border-green-500 text-white animate-pulse' : 'border-dashed'
                      }`}>
                        3
                      </div>
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Visit start node 1 and add to visited queue."}
                      {animationStep === 1 && "Dequeue 1 and visit all immediate neighbors level-by-level (nodes 2 and 3)."}
                      {animationStep === 2 && "Queue is empty. Traversal completed! Visited: [1, 2, 3]"}
                    </div>
                  </div>
                )}

                {/* Graph DFS Traversal Animation Box */}
                {problem.id === "dfs-graph" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-8 relative items-center justify-center h-12 w-full">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep >= 0 ? 'bg-primary border-primary text-white' : ''
                      }`}>
                        1
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep >= 1 ? 'bg-green-500 border-green-500 text-white' : 'border-dashed'
                      }`}>
                        2
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        animationStep >= 2 ? 'bg-green-500 border-green-500 text-white animate-bounce' : 'border-dashed'
                      }`}>
                        3
                      </div>
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Start DFS from node 1. Visited: [1]."}
                      {animationStep === 1 && "Explore deep: Visit neighbor 2. Visited: [1, 2]."}
                      {animationStep === 2 && "Continue deep: Visit neighbor 3. Visited: [1, 2, 3]. Complete!"}
                    </div>
                  </div>
                )}

                {/* Basic Recursion Fibonacci Animation Box */}
                {problem.id === "basic-recursion" && (
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="flex flex-col gap-1 w-32 border-x-2 border-b-2 p-1 bg-surface-100 dark:bg-neutral-800 rounded-b">
                      {animationStep >= 0 && (
                        <div className="h-5 rounded bg-primary text-white text-[10px] font-mono flex items-center justify-center shadow animate-slideDown">
                          Fib(3)
                        </div>
                      )}
                      {animationStep >= 1 && (
                        <div className="h-5 rounded bg-primary-dark text-white text-[10px] font-mono flex items-center justify-center shadow animate-slideDown">
                          Fib(2) + Fib(1)
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6 mt-1">
                      {animationStep === 0 && "Initialize recursive call: load frame Fib(3) onto stack."}
                      {animationStep === 1 && "Fib(3) expands to Fib(2) + Fib(1) frames recursively."}
                      {animationStep === 2 && "Base case hit! Fib(1)=1, Fib(0)=0. Returns final computed val = 2."}
                    </div>
                  </div>
                )}

                {/* Singly Linked List Traversal Animation Box */}
                {problem.id === "list-traversal" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-1.5">
                      {[10, 20, 30].map((val, idx) => {
                        let nodeClass = "border-surface-300 dark:border-neutral-700 bg-white dark:bg-[#1c1d1f] text-surface-800 dark:text-white";
                        if (animationStep === idx) {
                          nodeClass = "bg-primary border-primary text-white scale-110 shadow-md ring-2 ring-primary/30";
                        } else if (animationStep > idx) {
                          nodeClass = "bg-purple-100 border-primary/40 text-primary dark:bg-purple-950/30 dark:text-purple-300";
                        }
                        return (
                          <React.Fragment key={idx}>
                            <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${nodeClass}`}>
                              {val}
                            </div>
                            <span className="text-primary font-bold">→</span>
                          </React.Fragment>
                        );
                      })}
                      <div className={`w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        animationStep === 3 ? "bg-primary border-primary text-white scale-110" : "text-surface-400 border-surface-300"
                      }`}>
                        NULL
                      </div>
                    </div>
                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Start: curr = head. Visited val: 10."}
                      {animationStep === 1 && "Advance: curr = curr.next. Visited val: 20."}
                      {animationStep === 2 && "Advance: curr = curr.next. Visited val: 30."}
                      {animationStep === 3 && "Advance: curr = curr.next (NULL). Traversal complete!"}
                    </div>
                  </div>
                )}

                {/* Merge Two Sorted Lists Animation Box */}
                {problem.id === "merge-lists" && (
                  <div className="flex flex-col items-center gap-2 w-full text-xs">
                    <div className="flex flex-col gap-1 items-start w-full px-4">
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-[10px] text-surface-400 w-12 font-bold uppercase">List 1:</span>
                        <span className={`px-2 py-0.5 rounded border ${animationStep >= 1 ? "line-through opacity-40 bg-surface-100" : "bg-white dark:bg-neutral-800 border-primary text-primary"}`}>1</span>
                        <span>→</span>
                        <span className={`px-2 py-0.5 rounded border ${animationStep >= 3 ? "line-through opacity-40 bg-surface-100" : "bg-white dark:bg-neutral-800 border-primary text-primary"}`}>3</span>
                        <span>→</span>
                        <span className="text-surface-400">Ø</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-[10px] text-surface-400 w-12 font-bold uppercase">List 2:</span>
                        <span className={`px-2 py-0.5 rounded border ${animationStep >= 2 ? "line-through opacity-40 bg-surface-100" : "bg-white dark:bg-neutral-800 border-primary text-primary"}`}>2</span>
                        <span>→</span>
                        <span className={`px-2 py-0.5 rounded border ${animationStep >= 4 ? "line-through opacity-40 bg-surface-100" : "bg-white dark:bg-neutral-800 border-primary text-primary"}`}>4</span>
                        <span>→</span>
                        <span className="text-surface-400">Ø</span>
                      </div>
                    </div>
                    
                    <div className="h-[2px] w-full bg-surface-200 dark:bg-neutral-800 my-1" />

                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[10px] text-surface-400 font-bold uppercase">Merged:</span>
                      <div className="px-2 py-1 rounded bg-surface-100 dark:bg-neutral-800 border border-dashed text-[10px] text-surface-500">Dummy</div>
                      {animationStep >= 1 && <span className="text-green-500">→</span>}
                      {animationStep >= 1 && <div className="px-2 py-0.5 rounded bg-green-500 text-white font-bold animate-fadeIn">1</div>}
                      {animationStep >= 2 && <span className="text-green-500">→</span>}
                      {animationStep >= 2 && <div className="px-2 py-0.5 rounded bg-green-500 text-white font-bold animate-fadeIn">2</div>}
                      {animationStep >= 3 && <span className="text-green-500">→</span>}
                      {animationStep >= 3 && <div className="px-2 py-0.5 rounded bg-green-500 text-white font-bold animate-fadeIn">3</div>}
                      {animationStep >= 4 && <span className="text-green-500">→</span>}
                      {animationStep >= 4 && <div className="px-2 py-0.5 rounded bg-green-500 text-white font-bold animate-fadeIn">4</div>}
                    </div>

                    <div className="text-[11px] font-mono text-center text-surface-500 dark:text-surface-400 h-5 mt-1">
                      {animationStep === 0 && "Compare L1 (1) and L2 (2)."}
                      {animationStep === 1 && "1 < 2. Append L1 (1) to merged. L1 moves to 3."}
                      {animationStep === 2 && "Compare L1 (3) and L2 (2). 2 < 3. Append L2 (2). L2 moves to 4."}
                      {animationStep === 3 && "Compare L1 (3) and L2 (4). 3 < 4. Append L1 (3). L1 is empty."}
                      {animationStep === 4 && "L1 is null. Append all remaining elements of L2 (4). Complete!"}
                    </div>
                  </div>
                )}

                {/* Linked List Cycle Detection Animation Box */}
                {problem.id === "list-cycle" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-6 relative justify-center h-16 w-full">
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          animationStep === 0 ? "bg-primary border-primary text-white" : "bg-white dark:bg-neutral-800"
                        }`}>
                          1
                        </div>
                        {animationStep === 0 && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary font-bold">S,F</span>}
                      </div>

                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          animationStep === 1 ? "bg-primary text-white border-primary" : 
                          animationStep === 2 ? "bg-purple-100 text-primary border-primary/50" : "bg-white dark:bg-neutral-800"
                        }`}>
                          2
                        </div>
                        {animationStep === 1 && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary font-bold">S</span>}
                        {animationStep === 2 && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-purple-600 font-bold">F</span>}
                      </div>

                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          animationStep === 1 ? "bg-purple-100 text-primary border-primary/50" :
                          animationStep === 2 ? "bg-primary text-white border-primary" : "bg-white dark:bg-neutral-800"
                        }`}>
                          3
                        </div>
                        {animationStep === 1 && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-purple-600 font-bold">F</span>}
                        {animationStep === 2 && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary font-bold">S</span>}
                      </div>

                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          animationStep === 3 ? "bg-green-500 border-green-500 text-white animate-bounce" : "bg-white dark:bg-neutral-800"
                        }`}>
                          4
                        </div>
                        {animationStep === 3 && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-green-600 font-bold">S=F</span>}
                      </div>

                      <div className="absolute top-10 left-[35%] w-[45%] h-6 border-b-2 border-r-2 border-dashed border-purple-400 rounded-br-2xl pointer-events-none" />
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Slow (S) and Fast (F) pointers start at Node 1."}
                      {animationStep === 1 && "S moves 1 step to Node 2. F moves 2 steps to Node 3."}
                      {animationStep === 2 && "S moves to Node 3. F wraps around the cycle to Node 2."}
                      {animationStep === 3 && "S moves to Node 4. F moves 2 steps to Node 4. S and F MEET! Cycle detected."}
                    </div>
                  </div>
                )}

                {/* Evaluate Reverse Polish Notation Animation Box */}
                {problem.id === "postfix-eval" && (
                  <div className="flex flex-col items-center gap-3 w-full text-xs">
                    <div className="flex gap-1.5 items-center font-mono">
                      <span className="text-[10px] text-surface-400 font-bold">Tokens:</span>
                      {["2", "1", "+", "3", "*"].map((tok, idx) => {
                        let activeTokClass = "border-surface-200 text-surface-600 dark:border-neutral-800";
                        if (animationStep === 0 && idx === 0) activeTokClass = "bg-primary text-white border-primary scale-105 font-bold";
                        if (animationStep === 1 && idx === 1) activeTokClass = "bg-primary text-white border-primary scale-105 font-bold";
                        if (animationStep === 2 && idx === 2) activeTokClass = "bg-purple-500 text-white border-purple-500 scale-105 font-bold";
                        if (animationStep === 3 && idx === 3) activeTokClass = "bg-primary text-white border-primary scale-105 font-bold";
                        if (animationStep === 4 && idx === 4) activeTokClass = "bg-purple-500 text-white border-purple-500 scale-105 font-bold";
                        return (
                          <span key={idx} className={`px-2 py-0.5 rounded border transition-all duration-300 text-xs ${activeTokClass}`}>
                            {tok}
                          </span>
                        );
                      })}
                    </div>

                    <div className="w-24 h-24 border-b-4 border-x-4 border-primary rounded-b-xl flex flex-col justify-end p-1 gap-1">
                      {animationStep === 0 && (
                        <div className="h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">2</div>
                      )}
                      {animationStep === 1 && (
                        <>
                          <div className="h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow">2</div>
                          <div className="h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">1</div>
                        </>
                      )}
                      {animationStep === 2 && (
                        <div className="h-6 rounded bg-green-500 text-white text-xs font-bold flex items-center justify-center shadow animate-bounce">3</div>
                      )}
                      {animationStep === 3 && (
                        <>
                          <div className="h-6 rounded bg-green-500 text-white text-xs font-bold flex items-center justify-center shadow">3</div>
                          <div className="h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">3</div>
                        </>
                      )}
                      {animationStep === 4 && (
                        <div className="h-6 rounded bg-green-600 text-white text-xs font-bold flex items-center justify-center shadow animate-bounce">9</div>
                      )}
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Read operand '2'. Push to stack."}
                      {animationStep === 1 && "Read operand '1'. Push to stack."}
                      {animationStep === 2 && "Read operator '+'. Pop 1 and 2. Evaluate 2 + 1 = 3. Push 3."}
                      {animationStep === 3 && "Read operand '3'. Push to stack."}
                      {animationStep === 4 && "Read operator '*'. Pop 3 and 3. Evaluate 3 * 3 = 9. Final result: 9!"}
                    </div>
                  </div>
                )}

                {/* Min Stack Animation Box */}
                {problem.id === "min-stack" && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="flex gap-8">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-surface-400 uppercase mb-1">Main Stack</span>
                        <div className="w-20 h-24 border-b-4 border-x-4 border-primary rounded-b-xl flex flex-col justify-end p-1 gap-1">
                          {animationStep >= 0 && (
                            <div className="h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow">5</div>
                          )}
                          {animationStep >= 1 && animationStep < 3 && (
                            <div className="h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">2</div>
                          )}
                          {animationStep === 2 && (
                            <div className="h-6 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">6</div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-purple-400 uppercase mb-1">Min Stack</span>
                        <div className="w-20 h-24 border-b-4 border-x-4 border-purple-500 rounded-b-xl flex flex-col justify-end p-1 gap-1">
                          {animationStep >= 0 && (
                            <div className="h-6 rounded bg-purple-500 text-white text-xs font-bold flex items-center justify-center shadow">5</div>
                          )}
                          {animationStep >= 1 && animationStep < 3 && (
                            <div className="h-6 rounded bg-purple-600 text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">2</div>
                          )}
                          {animationStep === 2 && (
                            <div className="h-6 rounded bg-purple-600 text-white text-xs font-bold flex items-center justify-center shadow animate-slideDown">2</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Push 5. MinStack top gets min(5, ∞) = 5. Current Min = 5."}
                      {animationStep === 1 && "Push 2. MinStack top gets min(2, 5) = 2. Current Min = 2."}
                      {animationStep === 2 && "Push 6. MinStack top gets min(6, 2) = 2. Current Min = 2."}
                      {animationStep === 3 && "Pop. Retrieve 6 from Main and 2 from Min. Current Min returns to 2."}
                    </div>
                  </div>
                )}

                {/* Recursive Binary Search Animation Box */}
                {problem.id === "recursive-binary-search" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-1.5 font-mono">
                      {[1, 3, 5, 8, 12, 17, 22].map((val, idx) => {
                        let cellClass = "bg-white dark:bg-[#1c1d1f] border-surface-300 dark:border-neutral-700 text-surface-800 dark:text-white";
                        if (animationStep === 0) {
                          if (idx === 3) cellClass = "bg-primary border-primary text-white scale-105 shadow-md";
                        } else if (animationStep === 1) {
                          if (idx === 5) cellClass = "bg-green-500 border-green-500 text-white scale-105 shadow-md";
                          else if (idx < 4) cellClass = "opacity-30";
                        } else if (animationStep === 2) {
                          if (idx === 5) cellClass = "bg-green-600 border-green-600 text-white scale-110 shadow-lg animate-bounce";
                          else cellClass = "opacity-35";
                        }
                        return (
                          <div key={idx} className={`w-8 h-8 rounded border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${cellClass}`}>
                            {val}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1 w-full max-w-[280px] border border-dashed border-primary/30 p-2 rounded bg-primary/5 font-mono text-[9px] text-primary">
                      <span className="font-bold border-b pb-0.5 mb-1 uppercase tracking-wider text-[8px]">Recursion Call Stack</span>
                      <div className={`p-1 rounded text-center transition-all ${animationStep >= 0 ? "bg-primary text-white" : "opacity-30"}`}>
                        binarySearch(low=0, high=6) [mid = 3, val = 8]
                      </div>
                      {animationStep >= 1 && (
                        <div className={`p-1 rounded text-center transition-all ${animationStep === 1 ? "bg-purple-600 text-white" : "bg-green-600 text-white font-bold"}`}>
                          ↳ binarySearch(low=4, high=6) [mid = 5, val = 17]
                        </div>
                      )}
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Frame 1: low=0, high=6. Mid is 3 (8). 8 < 17. Recurse right half."}
                      {animationStep === 1 && "Frame 2: low=4, high=6. Mid is 5 (17). 17 == 17. Base case match!"}
                      {animationStep === 2 && "Unwind recursion: Return index 5 up the call stack. Search complete!"}
                    </div>
                  </div>
                )}

                {/* N-Queens Backtracking Animation Box */}
                {problem.id === "backtracking" && (
                  <div className="flex flex-col items-center gap-3 w-full text-xs">
                    <div className="grid grid-cols-4 gap-1 w-32 h-32 border border-surface-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                      {Array.from({ length: 16 }).map((_, idx) => {
                        const row = Math.floor(idx / 4);
                        const col = idx % 4;
                        let cellBg = (row + col) % 2 === 0 ? "bg-white dark:bg-neutral-700" : "bg-neutral-200 dark:bg-neutral-600";
                        
                        let hasQueen = false;
                        if (animationStep === 0) {
                          if (row === 0 && col === 0) hasQueen = true;
                        } else if (animationStep === 1) {
                          if (row === 0 && col === 0) hasQueen = true;
                          if (row === 2 && col === 1) hasQueen = true;
                        } else if (animationStep === 2) {
                          if (row === 0 && col === 0) hasQueen = true;
                        } else if (animationStep === 3) {
                          if (row === 1 && col === 0) hasQueen = true;
                          if (row === 3 && col === 1) hasQueen = true;
                          if (row === 0 && col === 2) hasQueen = true;
                          if (row === 2 && col === 3) hasQueen = true;
                        }

                        let conflictClass = "";
                        if (animationStep === 2 && col === 2) {
                          conflictClass = "bg-red-500/20 ring-1 ring-red-500/50";
                        }

                        return (
                          <div key={idx} className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded relative ${cellBg} ${conflictClass}`}>
                            {hasQueen && (
                              <span className="text-purple-600 dark:text-purple-300 font-extrabold animate-scaleIn">♛</span>
                            )}
                            {animationStep === 2 && col === 2 && (
                              <span className="text-red-500 text-[8px] font-mono">✗</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Place Q1 at row 0, col 0."}
                      {animationStep === 1 && "Place Q2 at row 2, col 1 (first safe row in col 1)."}
                      {animationStep === 2 && "Col 2: No safe row exists! BACKTRACK: Remove Q2 and try next row."}
                      {animationStep === 3 && "Q1 moved to row 1. Fully solved backtrack arrangement found!"}
                    </div>
                  </div>
                )}

                {/* Lowest Common Ancestor Animation Box */}
                {problem.id === "lca-tree" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex flex-col items-center gap-2 relative">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                        animationStep === 3 ? "bg-green-500 border-green-500 text-white animate-bounce" : "bg-white dark:bg-neutral-800"
                      }`}>
                        3
                      </div>

                      <div className="flex gap-12 relative">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          animationStep === 2 ? "bg-primary border-primary text-white scale-110 shadow-lg ring-2 ring-primary/30" : "bg-white dark:bg-neutral-800"
                        }`}>
                          5
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-xs">
                          1
                        </div>
                      </div>

                      <div className="flex gap-4 relative pl-2" style={{ marginRight: "3.5rem" }}>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 font-extrabold ${
                          animationStep >= 0 ? "ring-2 ring-purple-500/50" : ""
                        }`}>
                          6
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 font-extrabold ${
                          animationStep >= 1 ? "ring-2 ring-purple-500/50" : ""
                        }`}>
                          2
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Find LCA(6, 2). Traverse left. Find node 6. Returns 6."}
                      {animationStep === 1 && "Traverse right of node 5. Find node 2. Returns 2."}
                      {animationStep === 2 && "Node 5 receives non-null left (6) and right (2). Node 5 is LCA!"}
                      {animationStep === 3 && "Node 5 returns itself up to Root 3. Final LCA of 6 and 2 is 5."}
                    </div>
                  </div>
                )}

                {/* Maximum Depth of Binary Tree Animation Box */}
                {problem.id === "max-depth" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex flex-col items-center gap-2 relative">
                      <div className="w-8 h-8 rounded-full border bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-xs relative">
                        3
                        {animationStep === 3 && <span className="absolute -top-5 text-[9px] bg-green-500 text-white font-bold px-1 rounded">depth = 3</span>}
                      </div>

                      <div className="flex gap-16 relative">
                        <div className="w-8 h-8 rounded-full border bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-xs relative">
                          9
                          {animationStep >= 1 && <span className="absolute -bottom-5 text-[8px] text-primary font-bold">d = 1</span>}
                        </div>
                        <div className="w-8 h-8 rounded-full border bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-xs relative">
                          20
                          {animationStep >= 2 && <span className="absolute -bottom-5 text-[8px] text-primary font-bold">d = 2</span>}
                        </div>
                      </div>

                      <div className="flex gap-4 relative pl-6" style={{ marginLeft: "4.5rem" }}>
                        <div className="w-8 h-8 rounded-full border bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-xs">
                          15
                        </div>
                        <div className="w-8 h-8 rounded-full border bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-xs">
                          7
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6 mt-2">
                      {animationStep === 0 && "Find max depth of root 3. Recurse on Left (9) and Right (20)."}
                      {animationStep === 1 && "Left child 9 is a leaf. Returns max(0, 0) + 1 = 1."}
                      {animationStep === 2 && "Right child 20 has children. Returns max(left=1, right=1) + 1 = 2."}
                      {animationStep === 3 && "At root 3: Return max(left=1, right=2) + 1 = 3. Max depth = 3!"}
                    </div>
                  </div>
                )}

                {/* Dijkstra's Algorithm Animation Box */}
                {problem.id === "dijkstra-graph" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-12 relative items-center justify-center h-16 w-full">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs bg-primary text-white border-primary">
                          A
                        </div>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-primary">Dist: 0</span>
                      </div>

                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          animationStep >= 1 ? "bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-950/30" : "bg-white dark:bg-neutral-800"
                        }`}>
                          B
                        </div>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-purple-600">
                          Dist: {animationStep >= 1 ? "2" : "∞"}
                        </span>
                      </div>

                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          animationStep === 2 ? "bg-green-500 border-green-500 text-white animate-bounce" :
                          animationStep === 1 ? "bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-950/30" : "bg-white dark:bg-neutral-800"
                        }`}>
                          C
                        </div>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-green-600">
                          Dist: {animationStep === 2 ? "5" : animationStep === 1 ? "6" : "∞"}
                        </span>
                      </div>

                      <div className="absolute top-1/2 -translate-y-1/2 left-[20%] text-[10px] font-bold text-primary">-(2)→</div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-[60%] text-[10px] font-bold text-primary">-(3)→</div>
                      <div className="absolute top-0 left-[20%] w-[60%] h-6 border-t-2 border-dashed border-purple-400 rounded-t-xl flex justify-center text-[10px] font-bold text-purple-600 pointer-events-none">
                        (6)
                      </div>
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Initialize: A=0, others=∞. Relax A's neighbors: B becomes 2, C becomes 6."}
                      {animationStep === 1 && "Pop B (dist 2, smallest). Relax C: dist(B)+3 = 2+3 = 5 < 6. Update C to 5."}
                      {animationStep === 2 && "Pop C (dist 5). All paths fully relaxed. Shortest distances confirmed!"}
                    </div>
                  </div>
                )}

                {/* Climbing Stairs Animation Box */}
                {problem.id === "climbing-stairs" && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider">Bottom-Up DP array (Ways to reach step)</span>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((step) => {
                        let val = "?";
                        let bgClass = "bg-white dark:bg-[#1c1d1f] border-surface-300 dark:border-neutral-700 text-surface-800 dark:text-white";
                        
                        if (step === 1) { val = "1"; bgClass = "bg-purple-100 border-primary/40 text-primary dark:bg-purple-950/20 dark:text-purple-300"; }
                        if (step === 2) { val = "2"; bgClass = "bg-purple-100 border-primary/40 text-primary dark:bg-purple-950/20 dark:text-purple-300"; }
                        
                        if (step === 3 && animationStep >= 1) {
                          val = "3";
                          bgClass = animationStep === 1 ? "bg-primary border-primary text-white scale-105 shadow" : "bg-purple-100 border-primary/40 text-primary dark:bg-purple-950/20";
                        }
                        if (step === 4 && animationStep >= 2) {
                          val = "5";
                          bgClass = animationStep === 2 ? "bg-green-500 border-green-500 text-white scale-105 shadow animate-bounce" : "bg-green-100 dark:bg-green-950/20 border-green-500/40 text-green-700 dark:text-green-300";
                        }

                        return (
                          <div key={step} className="flex flex-col items-center">
                            <span className="text-[9px] font-mono text-surface-400">dp[{step}]</span>
                            <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${bgClass}`}>
                              {val}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Base cases: dp[1]=1 (1 way), dp[2]=2 (1+1 or 2 ways)."}
                      {animationStep === 1 && "Compute dp[3]: dp[3] = dp[2] + dp[1] = 2 + 1 = 3 ways."}
                      {animationStep === 2 && "Compute dp[4]: dp[4] = dp[3] + dp[2] = 3 + 2 = 5 ways."}
                      {animationStep === 3 && "Completed: dp[4] = 5. You can climb 4 stairs in 5 distinct ways!"}
                    </div>
                  </div>
                )}

                {/* Coin Change Animation Box */}
                {problem.id === "coin-change" && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider">DP Table: Min Coins for Amount (Coins: [1, 2, 5])</span>
                    <div className="flex gap-1 font-mono">
                      {[0, 1, 2, 3, 4, 5].map((amt) => {
                        let val = "∞";
                        let bgClass = "bg-white dark:bg-[#1c1d1f] border-surface-300 dark:border-neutral-700 text-surface-400";
                        
                        if (amt === 0) { val = "0"; bgClass = "bg-purple-100 border-primary/30 text-primary dark:bg-purple-950/20"; }
                        
                        if (amt === 1 && animationStep >= 1) { val = "1"; bgClass = "bg-purple-100 border-primary/30 text-primary dark:bg-purple-950/20"; }
                        if (amt === 2 && animationStep >= 1) { val = "1"; bgClass = "bg-purple-100 border-primary/30 text-primary dark:bg-purple-950/20"; }
                        
                        if (amt === 3 && animationStep >= 2) {
                          val = "2";
                          bgClass = animationStep === 2 ? "bg-primary border-primary text-white scale-105" : "bg-purple-100 border-primary/30 text-primary dark:bg-purple-950/20";
                        }
                        if (amt === 4 && animationStep >= 2) {
                          val = "2";
                          bgClass = animationStep === 2 ? "bg-primary border-primary text-white scale-105" : "bg-purple-100 border-primary/30 text-primary dark:bg-purple-950/20";
                        }
                        
                        if (amt === 5 && animationStep >= 3) {
                          val = "1";
                          bgClass = animationStep === 3 ? "bg-green-500 border-green-500 text-white scale-105 shadow animate-bounce" : "bg-green-100 dark:bg-green-950/20 border-green-500/30 text-green-700 dark:text-green-300";
                        }

                        return (
                          <div key={amt} className="flex flex-col items-center">
                            <span className="text-[8px] text-surface-400">amt:{amt}</span>
                            <div className={`w-8 h-8 rounded border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${bgClass}`}>
                              {val}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Initialize: dp[0] = 0 (0 coins for amount 0). All others to Infinity."}
                      {animationStep === 1 && "Amounts 1 and 2: coin 1 gives dp[1]=1. coin 2 gives dp[2]=1."}
                      {animationStep === 2 && "Amounts 3 and 4: dp[3] = min(dp[2]+1, dp[1]+1) = 2. dp[4] = 2."}
                      {animationStep === 3 && "Amount 5: dp[5] = min(dp[4]+1, dp[3]+1, dp[0]+1) = 1 (uses coin 5). Complete!"}
                    </div>
                  </div>
                )}

                {/* Longest Common Subsequence Animation Box */}
                {problem.id === "lcs-dp" && (
                  <div className="flex flex-col items-center gap-2 w-full text-xs">
                    <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider">LCS 2D DP Grid ("BAT" vs "CAT")</span>
                    <div className="grid grid-cols-5 gap-1 font-mono text-center bg-surface-50 dark:bg-neutral-800 p-1.5 rounded-lg border">
                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]"></span>
                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]">Ø</span>
                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]">C</span>
                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]">A</span>
                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]">T</span>

                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]">Ø</span>
                      <span className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">0</span>
                      <span className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">0</span>
                      <span className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">0</span>
                      <span className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">0</span>

                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]">B</span>
                      <span className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">0</span>
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${animationStep === 1 ? "bg-primary text-white font-bold animate-pulse" : "bg-neutral-100 dark:bg-neutral-900"}`}>0</span>
                      <span className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[10px]">0</span>
                      <span className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[10px]">0</span>

                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]">A</span>
                      <span className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">0</span>
                      <span className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[10px]">0</span>
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${animationStep === 2 ? "bg-primary text-white font-bold animate-pulse" : animationStep > 2 ? "bg-purple-100 text-primary dark:bg-purple-950/20" : "bg-neutral-100 dark:bg-neutral-900"}`}>1</span>
                      <span className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[10px]">1</span>

                      <span className="w-6 h-6 flex items-center justify-center font-bold text-surface-400 text-[10px]">T</span>
                      <span className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">0</span>
                      <span className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[10px]">0</span>
                      <span className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[10px]">1</span>
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${animationStep >= 3 ? "bg-green-500 text-white font-bold animate-bounce" : "bg-neutral-100 dark:bg-neutral-900"}`}>2</span>
                    </div>

                    <div className="text-xs font-mono text-center text-surface-500 dark:text-surface-400 h-6">
                      {animationStep === 0 && "Initialize: row 0 and col 0 filled with 0. S1 = B-A-T, S2 = C-A-T."}
                      {animationStep === 1 && "Compare 'B' & 'C'. Mismatch. dp[1][1] = max(dp[0][1], dp[1][0]) = 0."}
                      {animationStep === 2 && "Compare 'A' & 'A'. MATCH! Diagonal transition: dp[2][2] = dp[1][1] + 1 = 1."}
                      {animationStep === 3 && "Compare 'T' & 'T'. MATCH! Diagonal transition: dp[3][3] = dp[2][2] + 1 = 2."}
                      {animationStep === 4 && "LCS is length 2 ('AT'). Found in bottom-right grid cell."}
                    </div>
                  </div>
                )}

                {/* General Fallback Animation box */}
                {!["binary-search", "linear-search", "reverse-list", "quick-sort", "bubble-sort", "merge-sort", "push-pop", "enqueue-dequeue", "inorder-traversal", "two-sum", "bfs-graph", "dfs-graph", "basic-recursion", "list-traversal", "merge-lists", "list-cycle", "postfix-eval", "min-stack", "recursive-binary-search", "backtracking", "lca-tree", "max-depth", "dijkstra-graph", "climbing-stairs", "coin-change", "lcs-dp"].includes(problem.id) && (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={36} className="text-primary animate-pulse" />
                    <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">Concept Active: {name}</span>
                    <span className="text-[10px] text-surface-400 text-center">Visual dry run ready. Click step button below.</span>
                  </div>
                )}
              </div>

              {/* Steps Controllers */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setAnimationStep(0)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-100 hover:bg-surface-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    const maxSteps = 
                      problem.id === "binary-search" ? 3 :
                      problem.id === "linear-search" ? 3 :
                      problem.id === "reverse-list" ? 2 :
                      problem.id === "quick-sort" ? 2 :
                      problem.id === "bubble-sort" ? 3 :
                      problem.id === "merge-sort" ? 2 :
                      problem.id === "push-pop" ? 3 :
                      problem.id === "enqueue-dequeue" ? 3 :
                      problem.id === "inorder-traversal" ? 2 :
                      problem.id === "two-sum" ? 1 :
                      problem.id === "bfs-graph" ? 2 :
                      problem.id === "dfs-graph" ? 2 :
                      problem.id === "basic-recursion" ? 2 :
                      problem.id === "list-traversal" ? 3 :
                      problem.id === "merge-lists" ? 4 :
                      problem.id === "list-cycle" ? 3 :
                      problem.id === "postfix-eval" ? 4 :
                      problem.id === "min-stack" ? 3 :
                      problem.id === "recursive-binary-search" ? 2 :
                      problem.id === "backtracking" ? 3 :
                      problem.id === "lca-tree" ? 3 :
                      problem.id === "max-depth" ? 3 :
                      problem.id === "dijkstra-graph" ? 2 :
                      problem.id === "climbing-stairs" ? 3 :
                      problem.id === "coin-change" ? 3 :
                      problem.id === "lcs-dp" ? 4 : 1;
                    setAnimationStep((s) => (s < maxSteps ? s + 1 : 0));
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-primary text-white hover:opacity-90 transition flex items-center gap-2"
                >
                  <Play size={12} fill="white" />
                  Next Step
                </button>
              </div>
            </div>
          )}

          {activeTab === "complexity" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Complexities Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-50 dark:bg-[#2d2f31] p-5 rounded-2xl border border-surface-200 dark:border-neutral-800 flex flex-col items-center text-center">
                  <Clock className="text-primary mb-2" size={24} />
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Time Complexity</span>
                  <span className="text-2xl font-black mt-2 text-primary">{theory.complexity.time}</span>
                </div>
                <div className="bg-surface-50 dark:bg-[#2d2f31] p-5 rounded-2xl border border-surface-200 dark:border-neutral-800 flex flex-col items-center text-center">
                  <Layers className="text-primary mb-2" size={24} />
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Space Complexity</span>
                  <span className="text-2xl font-black mt-2 text-primary">{theory.complexity.space}</span>
                </div>
              </div>

              {/* Interview Tip */}
              {theory.tip && (
                <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-primary/20 p-5 rounded-2xl flex gap-3 text-sm">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-surface-800 dark:text-purple-300 mb-1">Interview Advantage</h4>
                    <p className="text-surface-600/90 dark:text-surface-200/90 leading-relaxed text-xs font-poppins">
                      {theory.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer / CTA Section */}
        {visualizerUrl && (
          <div className="p-6 border-t border-surface-100 dark:border-neutral-800 bg-white dark:bg-[#1c1d1f] flex flex-col">
            <Link
              href={visualizerUrl}
              className="group w-full h-[52px] rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-primary/20 transition-all"
            >
              Open Interactive Visualizer
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
            <p className="text-[10px] text-surface-400 text-center mt-3">
              This launches our fully interactive algorithm step engine with custom parameters.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

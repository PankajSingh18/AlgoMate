"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CONCEPTS = [
  {
    heading: "Concepts\nthat click",
    body: "Step-by-step interactive visualizations make even complex algorithms feel intuitive. See exactly what's happening at every step.",
    cta: { label: "Try Sorting", href: "/visualizer" },
    visual: <SortingVisual />,
    bgClass: "bg-[#f0fdf4] dark:bg-[#161616] transition-colors duration-300", // Green theme
  },
  {
    heading: "Code that\nmakes sense",
    body: "Watch the algorithm execute line by line alongside the visualization. Learn how code maps to real behaviour.",
    cta: { label: "Try Searching", href: "/visualizer" },
    visual: <SearchVisual />,
    bgClass: "bg-[#faf5ff] dark:bg-[#1c1d1f] transition-colors duration-300", // Purple theme
    flip: true,
  },
  {
    heading: "Structures\nyou can touch",
    body: "Manipulate data structures directly — push, pop, enqueue, dequeue — and see the state update in real time.",
    cta: { label: "Try Stack & Queue", href: "/visualizer" },
    visual: <StackVisual />,
    bgClass: "bg-[#eff6ff] dark:bg-[#161616] transition-colors duration-300", // Blue theme
  },
];

/* ── Visual: Sorting bars ── */
/* ── Visual: Sorting bars ── */
function SortingVisual() {
  const bars = [65, 30, 80, 45, 55, 20, 70, 40, 90, 35];
  const active = [2, 6];
  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-[#1e1e1e] shadow-2xl overflow-hidden font-mono text-[13px] leading-[1.7] border border-[#333] transform-gpu will-change-transform transition-all duration-300 ease-in-out">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333] bg-[#1e1e1e]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#28c840] flex-shrink-0" />
        <span className="ml-3 text-[#858585] text-[13px] truncate">bubbleSort.js — step 4</span>
      </div>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-4 font-semibold transition-colors duration-300">Comparing indices 2 & 3</p>
        <div className="flex items-end gap-1.5 h-[80px]">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  active.includes(i) ? "bg-[#22c55e]" : "bg-[#404040]"
                }`}
                style={{ height: `${(h / 90) * 72}px` }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-[#858585] transition-colors duration-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#22c55e] inline-block" /> comparing
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#858585] transition-colors duration-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#404040] inline-block transition-colors duration-300" /> unsorted
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Visual: Binary Search ── */
/* ── Visual: Binary Search ── */
function SearchVisual() {
  const arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72];
  const mid = 4;
  const eliminated = [0, 1, 2, 3];
  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-[#1e1e1e] shadow-2xl overflow-hidden font-mono text-[13px] leading-[1.7] border border-[#333] transform-gpu will-change-transform transition-all duration-300 ease-in-out">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333] bg-[#1e1e1e]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#28c840] flex-shrink-0" />
        <span className="ml-3 text-[#858585] text-[13px] truncate">binarySearch.js — step 2</span>
      </div>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-4 font-semibold transition-colors duration-300">Target: 16 &nbsp;·&nbsp; mid = index 4</p>
        <div className="flex gap-1.5">
          {arr.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-9 rounded-md flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                  i === mid 
                    ? "bg-[#a855f7] text-white" 
                    : eliminated.includes(i) 
                      ? "bg-[#252526] text-[#6b7280]" 
                      : "bg-[#3b2a59] text-[#e9d5ff]"
                }`}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-[#858585] transition-colors duration-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#a855f7] inline-block" /> mid
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#858585] transition-colors duration-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#3b2a59] inline-block transition-colors duration-300" /> active
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#858585] transition-colors duration-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#252526] inline-block transition-colors duration-300" /> eliminated
          </span>
        </div>
      </div>
    </div>
  );
}
/* ── Visual: Stack ── */
/* ── Visual: Stack ── */
function StackVisual() {
  const stack = ["push(42)", "push(17)", "push(8)", "peek → 8"];
  const boxClasses = [
    "bg-[#404040] text-[#d4d4d4]",
    "bg-[#404040] text-[#d4d4d4]",
    "bg-[#525252] text-white",
    "bg-[#3b82f6] text-white shadow-[0_2px_12px_rgba(59,130,246,0.4)]"
  ];
  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-[#1e1e1e] shadow-2xl overflow-hidden font-mono text-[13px] leading-[1.7] border border-[#333] transform-gpu will-change-transform transition-all duration-300 ease-in-out">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333] bg-[#1e1e1e]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#28c840] flex-shrink-0" />
        <span className="ml-3 text-[#858585] text-[13px] truncate">stack.js — operations</span>
      </div>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-4 font-semibold transition-colors duration-300">Stack — top of stack ↑</p>
        <div className="flex flex-col-reverse gap-2">
          {stack.map((item, i) => (
            <div
              key={i}
              className={`w-full h-10 rounded-lg flex items-center px-4 text-[13px] font-semibold transition-all duration-300 ${boxClasses[i]}`}
            >
              {item}
              {i === stack.length - 1 && (
                <span className="ml-auto text-[11px] bg-white/20 rounded px-2 py-0.5">TOP</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Visual: App phone-style mockup ── */
function AppMockup() {
  const steps = [
    { line: 1, tokens: [{ t: "while", c: "#c678dd" }, { t: " gems remain", c: "#d4d4d4" }], active: false },
    { line: 2, tokens: [{ t: "  if", c: "#c678dd" }, { t: " node.visited", c: "#d4d4d4" }], active: false },
    { line: 3, tokens: [{ t: "    mark", c: "#22c55e" }, { t: " node", c: "#d4d4d4" }], active: false },
    { line: 4, tokens: [{ t: "  else", c: "#c678dd" }], active: true },
    { line: 5, tokens: [{ t: "    skip", c: "#22c55e" }, { t: " node", c: "#d4d4d4" }], active: false },
  ];

  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-[#1e1e1e] shadow-2xl overflow-hidden font-mono text-[13px] leading-[1.7] border border-[#333] transform-gpu will-change-transform transition-all duration-300 ease-in-out">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333] bg-[#1e1e1e]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#28c840] flex-shrink-0" />
        <span className="ml-3 text-[#858585] text-[13px] truncate">graphTraversal.js</span>
      </div>

      {/* task label */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-[11px] uppercase tracking-widest text-[#858585] font-semibold">Traverse the graph</p>
      </div>

      {/* grid visual */}
      <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-[#333] bg-[#252526]">
        <div className="grid grid-cols-5 gap-px bg-[#333] p-px">
          {Array.from({ length: 25 }).map((_, i) => {
            const path = [6, 11, 16, 21, 22, 17, 12, 7];
            const gems = [4, 9, 14];
            const robot = 22;
            const isPath = path.includes(i);
            const isGem = gems.includes(i);
            const isRobot = i === robot;
            return (
              <div
                key={i}
                className="aspect-square flex items-center justify-center text-[14px]"
                style={{
                  background: isPath ? "#311b42" : "#1e1e1e",
                  border: isPath ? "1.5px solid #a855f7" : "none",
                }}
              >
                {isRobot ? "🤖" : isGem ? "💎" : isPath ? <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] inline-block" /> : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* pseudocode steps */}
      <div className="mx-5 mb-5 rounded-xl bg-[#252526] border border-[#333] overflow-hidden">
        {steps.map((s) => (
          <div
            key={s.line}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-[#333] last:border-0"
            style={{ background: s.active ? "#311b42" : "transparent" }}
          >
            {s.active ? (
              <span className="w-3 h-3 rounded-full bg-[#a855f7] flex-shrink-0" />
            ) : (
              <span className="w-3 h-3 flex-shrink-0" />
            )}
            <span className="text-[13px] font-mono">
              {s.tokens.map((tk, ti) => (
                <span key={ti} style={{ color: tk.c }}>{tk.t}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConceptsSection() {
  return (
    <section
      className="bg-white dark:bg-surface-900"
    >
     {CONCEPTS.map((c, idx) => (
        <div
          key={idx}
          className={`${c.bgClass} transition-colors duration-300 py-20 px-6`}
        >
          <div
            className={`max-w-[1100px] mx-auto flex flex-col ${
              c.flip ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-16 lg:gap-24`}
          >
            {/* Visual */}
            <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto">
              {c.visual}
            </div>

            {/* Text */}
            <div className="flex-1 flex flex-col gap-5 items-start">
              <h2
                className="text-[2.6rem] sm:text-[3.2rem] font-bold leading-[1.08] tracking-tight text-surface-900 dark:text-surface-50 whitespace-pre-line"
                  style={{
                    fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif',
                  }}
              >
                {c.heading}
              </h2>
              <p className="text-[1.1rem] text-surface-600 dark:text-surface-400 leading-relaxed max-w-[460px]">
                {c.body}
              </p>
              <Link
                href={c.cta.href}
                className="group inline-flex items-center gap-2 h-[52px] min-h-[44px] px-8 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[15px] font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-200"
              >
                {c.cta.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      ))}

     {/* ── "More effective, more fun" block ── */}
      <div className="py-20 px-6 bg-[#f0fdf4] dark:bg-[#1c1d1f] transition-colors duration-300">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Text side */}
          <div className="flex-1 flex flex-col gap-5 items-start">
            <h2
              className="text-[2.6rem] sm:text-[3.2rem] font-bold leading-[1.08] tracking-tight text-surface-900 dark:text-surface-50"
              style={{
                fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif',
              }}
            >
              More effective,{" "}
              <br />
              more fun
            </h2>
            <p className="text-[1.1rem] text-surface-600 dark:text-surface-400 leading-relaxed max-w-[460px]">
              AlgoBuddy&apos;s interactive approach helps you master DSA concepts in less time, with more purpose and joy.
            </p>
            <Link
              href="/visualizer"
              className="group inline-flex items-center gap-2 h-[52px] min-h-[44px] px-8 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[15px] font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-200"
            >
              Start learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Phone mockup */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto">
            <AppMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

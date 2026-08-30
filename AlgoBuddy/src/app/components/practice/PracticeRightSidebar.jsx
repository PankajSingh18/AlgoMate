"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PracticeRightSidebar({
  solved = 28,
  attempted = 16,
  remaining = 75,
  total = 119,
  onViewProgress
}) {
  const percentage = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((solved / total) * 100);
  }, [solved, total]);

  // Circular progress dimensions
  const radius = 38;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <aside className="w-full h-full flex-shrink-0 flex flex-col gap-6 select-none">
      {/* Session Progress Card */}
      <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
        <h3 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest mb-4">
          Session Progress
        </h3>

        <div className="flex items-center gap-6 mb-5">
          {/* Radial Chart */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                stroke="rgba(164, 53, 240, 0.08)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="48"
                cy="48"
              />
              {/* Foreground circle */}
              <circle
                stroke="#a435f0"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="48"
                cy="48"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-black text-slate-800 dark:text-white leading-none">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">
                <strong className="text-slate-800 dark:text-white mr-1">{solved}</strong> Solved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">
                <strong className="text-slate-800 dark:text-white mr-1">{attempted}</strong> Attempted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">
                <strong className="text-slate-800 dark:text-white mr-1">{remaining}</strong> Remaining
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={onViewProgress}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-purple-500/5 hover:bg-purple-500/10 text-primary dark:bg-purple-950/20 dark:hover:bg-purple-950/30 rounded-xl text-xs font-black transition border border-purple-500/10"
        >
          <span>View Detailed Progress</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </aside>
  );
}

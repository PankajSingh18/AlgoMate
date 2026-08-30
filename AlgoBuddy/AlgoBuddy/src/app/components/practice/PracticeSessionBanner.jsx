"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck,
  Play, 
  Users, 
  MoreHorizontal, 
  Clock, 
  HelpCircle, 
  Calendar 
} from "lucide-react";

export default function PracticeSessionBanner({
  title = "DSA Sheet - Most Important Interview Questions",
  description = "All DSA topics covered – from basic to advanced. Perfect for interview preparation.",
  difficulty = "Beginner",
  problemCount = 119,
  duration = "4h 30m",
  lastUpdated = "Last updated 2 days ago",
  isBookmarked = false,
  onBookmarkToggle,
  onStartSession,
  onGroupStudy,
  onBackToSessions
}) {
  const [saved, setSaved] = useState(isBookmarked);

  const handleSaveToggle = () => {
    setSaved(!saved);
    if (onBookmarkToggle) onBookmarkToggle(!saved);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none">
      
      {/* Content Side */}
      <div className="flex-1 space-y-4">

        {/* Title */}
        <div className="flex items-center gap-3.5">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight">
            {title}
          </h1>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {difficulty}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-750 text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
            <HelpCircle size={12} />
            {problemCount} Problems
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-750 text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Clock size={12} />
            {duration}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-750 text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Calendar size={12} />
            {lastUpdated}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-slate-400 dark:text-neutral-500 font-medium leading-relaxed max-w-xl">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onStartSession}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            <Play size={16} />
            Start Practice
          </button>

        </div>

      </div>

      {/* Vector Illustration Side */}
      <div className="w-full md:w-auto flex justify-center md:justify-end flex-shrink-0">
        <svg className="w-32 md:w-40 h-auto max-w-full" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background shapes */}
          <circle cx="120" cy="90" r="80" fill="rgba(164, 53, 240, 0.03)" />
          <circle cx="190" cy="40" r="25" fill="rgba(34, 197, 94, 0.02)" />

          {/* Plant Pot */}
          <path d="M50 145h12l-2 15h-8z" fill="#D1D5DB" />
          <ellipse cx="56" cy="145" rx="6" ry="1.5" fill="#9CA3AF" />
          <path d="M56 145c-4-8-12-10-14-6 0 0-3-12 5-14 3 6 9 10 9 20zM56 145c4-8 12-10 14-6 0 0 3-12-5-14-3 6-9 10-9 20z" fill="#22C55E" />
          <circle cx="56" cy="130" r="3" fill="#4ADE80" />

          {/* Laptop Monitor */}
          <rect x="75" y="45" width="130" height="85" rx="8" fill="#1F2937" stroke="#374151" strokeWidth="4" />
          <rect x="83" y="53" width="114" height="69" rx="4" fill="#111827" />

          {/* Screen Content Lines */}
          <rect x="91" y="61" width="30" height="4" rx="2" fill="#374151" />
          <rect x="91" y="69" width="55" height="4" rx="2" fill="#a435f0" opacity="0.8" />
          <rect x="101" y="77" width="45" height="4" rx="2" fill="#4B5563" />
          <rect x="101" y="85" width="35" height="4" rx="2" fill="#4B5563" />
          <rect x="91" y="93" width="50" height="4" rx="2" fill="#374151" />
          
          {/* Coding block icon on screen */}
          <rect x="156" y="69" width="32" height="32" rx="6" fill="#a435f0" />
          <text x="172" y="89" fill="white" fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle">&lt;/&gt;</text>

          {/* Monitor Stand */}
          <path d="M125 130h30l-5 25h-20z" fill="#4B5563" />
          <ellipse cx="140" cy="155" rx="35" ry="6" fill="#374151" />

          {/* Table Surface */}
          <line x1="20" y1="161" x2="220" y2="161" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" className="dark:stroke-neutral-800" />
        </svg>
      </div>

    </div>
  );
}

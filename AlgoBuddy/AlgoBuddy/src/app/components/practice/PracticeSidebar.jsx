"use client";

import React from "react";
import { 
  ArrowLeft, 
  Layers, 
  ListTodo, 
  GitMerge, 
  Building2, 
  Trophy, 
  Bookmark, 
  History, 
  GraduationCap, 
  Flame, 
  ScrollText,
  ChevronRight,
  NotebookPen
} from "lucide-react";

export default function PracticeSidebar({ 
  activeView, 
  onViewChange, 
  solvedCount = 8, 
  dailySolved = 0,
  weeklySolved = 0,
  monthlySolved = 0,
  dailyGoal = 3,
  weeklyGoal = 10,
  monthlyGoal = 50,
  streakDays = 0,
  bestStreak = 0,
  mySheetCount = 0,
  onBackToPractice
}) {
  const navItems = [
    { id: "problem-list", label: "Problem List", icon: ListTodo },
    { id: "dashboard",    label: "Progress",     icon: Layers },
    { id: "my-sheet",     label: "My Sheet",     icon: ScrollText, badge: mySheetCount > 0 ? mySheetCount : null },
    { id: "topic-wise",   label: "Topic-wise",   icon: GitMerge },
    { id: "company-wise", label: "Company-wise", icon: Building2 },
    { id: "bookmarks",    label: "Bookmarks",    icon: Bookmark },
    { id: "recent-solved",label: "Recent Solved",icon: History },
    { id: "notes",        label: "Notebook",     icon: NotebookPen },
  ];

  const dailyGoalPercentage = Math.min(100, Math.round((dailySolved / dailyGoal) * 100) || 0);
  const weeklyGoalPercentage = Math.min(100, Math.round((weeklySolved / weeklyGoal) * 100) || 0);
  const monthlyGoalPercentage = Math.min(100, Math.round((monthlySolved / monthlyGoal) * 100) || 0);
  const achievementBadges = [
  {
    name: "7 Day Streak",
    icon: "🔥",
    unlocked: streakDays >= 7,
  },
  {
    name: "30 Day Streak",
    icon: "🏆",
    unlocked: streakDays >= 30,
  },
  {
    name: "50 Problems",
    icon: "🎯",
    unlocked: solvedCount >= 50,
  },
  {
    name: "100 Problems",
    icon: "🚀",
    unlocked: solvedCount >= 100,
  },
];

  return (
    <aside className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-6 select-none">
      {/* Back button */}
      <button 
        onClick={onBackToPractice}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-purple-500/10 text-primary dark:bg-purple-950/20 dark:text-purple-400 font-bold text-sm w-fit transition hover:scale-102 active:scale-98"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Navigation List */}
      <nav className="flex flex-col gap-1 bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 dark:shadow-none"
                  : item.id === "my-sheet"
                    ? "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : item.id === "my-sheet" ? "text-purple-500 dark:text-purple-400" : "text-slate-400 dark:text-neutral-500"}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && !isActive && (
                <span className="text-[10px] font-black bg-primary text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

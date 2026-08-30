"use client";

import React, { useMemo } from "react";
import { 
  Flame, 
  Trophy, 
  Target,
  CheckCircle2,
  Clock,
  Activity,
  Award,
  Sun,
  Calendar,
  CalendarDays
} from "lucide-react";

export default function PracticeDashboard({
  dailyChallenge,
  solvedCount = 0,
  dailySolved = 0,
  weeklySolved = 0,
  monthlySolved = 0,
  dailyGoal = 3,
  weeklyGoal = 10,
  monthlyGoal = 50,
  streakDays = 0,
  bestStreak = 0,
  solved = 0,
  attempted = 0,
  remaining = 0,
  total = 0,
  estimatedTime = "0h 0m",
  easyCount = 0,
  mediumCount = 0,
  hardCount = 0,
  totalEasy = 1,
  totalMed = 1,
  totalHard = 1,
  companiesCount = 0,
  activityData = []
}) {

  const achievementBadges = [
    { name: "7 Day Streak", icon: "🔥", unlocked: streakDays >= 7 },
    { name: "30 Day Streak", icon: "🏆", unlocked: streakDays >= 30 },
    { name: "50 Problems", icon: "🎯", unlocked: solvedCount >= 50 },
    { name: "100 Problems", icon: "🚀", unlocked: solvedCount >= 100 },
    { name: "Fast Solver", icon: "⚡", unlocked: false },
    { name: "Bug Squasher", icon: "🐛", unlocked: false },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-300 select-none pb-8">
      
      {/* ======================= */}
      {/* LEFT COLUMN (History)   */}
      {/* ======================= */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        
        {/* Practice History Table Header */}
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
            <Activity className="text-primary" size={24} />
            Practice History
          </h2>
          
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-neutral-900/20 text-xs font-bold text-slate-500 dark:text-neutral-400">
              <div className="col-span-3">Time</div>
              <div className="col-span-6">Problem</div>
              <div className="col-span-3 text-right">Status</div>
            </div>

            <div className="flex flex-col">
              {activityData.length === 0 ? (
                <div className="p-8 text-center text-sm font-bold text-slate-400 dark:text-neutral-600">
                  No recent activity recorded.
                </div>
              ) : (
                activityData.map((act, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-y-2 gap-x-4 p-4 border-b border-slate-50 dark:border-neutral-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors items-center">
                    
                    {/* Time */}
                    <div className="sm:col-span-3 text-xs font-bold text-slate-500 dark:text-neutral-400">
                      {act.time}
                    </div>
                    
                    {/* Problem Name & Difficulty (Extracted from status color logic or just hardcoded for mockup feel) */}
                    <div className="sm:col-span-6 flex flex-col justify-center">
                      <span className="text-sm font-bold text-slate-800 dark:text-neutral-200 line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                        {act.title}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${
                        act.statusColor?.includes('emerald') ? 'text-emerald-500' :
                        act.statusColor?.includes('amber') ? 'text-amber-500' :
                        act.statusColor?.includes('red') ? 'text-red-500' : 'text-primary'
                      }`}>
                        {act.statusColor?.includes('emerald') ? 'Easy' : act.statusColor?.includes('amber') ? 'Medium' : 'Hard'}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-3 sm:text-right flex items-center sm:justify-end gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${act.statusColor || 'bg-slate-300'}`} />
                      <span className={`text-xs font-bold ${
                        act.statusColor?.includes('emerald') ? 'text-slate-700 dark:text-neutral-300' : 'text-slate-500 dark:text-neutral-500'
                      }`}>
                        {act.statusColor?.includes('emerald') ? 'Accepted' : 'Attempted'}
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/* RIGHT COLUMN (Widgets)  */}
      {/* ======================= */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        
        {/* 1. Challenge of the Day (Banner) */}
        {dailyChallenge && (
          <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-center min-h-[140px]">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Target size={16} className="text-purple-200" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-200">
                  Challenge of the Day
                </h3>
              </div>
              <h2 className="text-xl font-black mt-1 mb-1 leading-tight line-clamp-2">
                {dailyChallenge.name}
              </h2>
              <p className="text-xs font-medium text-purple-200">
                {dailyChallenge.difficulty} • {dailyChallenge.topic}
              </p>
              <a
                href={dailyChallenge.practiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-black transition-colors border border-white/20"
              >
                Solve Now
              </a>
            </div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          </div>
        )}

        {/* 2. Total Solved Widget (Session Stats) */}
        <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 block mb-1">Session Solved</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800 dark:text-white leading-none">{solved}</span>
                <span className="text-xs font-bold text-slate-400">/{total}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Time</span>
              <span className="text-sm font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1">
                <Clock size={12} /> {estimatedTime}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Easy Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-emerald-600 dark:text-emerald-400">Easy</span>
                <span className="text-slate-600 dark:text-neutral-300">{easyCount} <span className="text-slate-400">/ {totalEasy}</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(easyCount/totalEasy)*100 || 5}%` }} />
              </div>
            </div>
            {/* Medium Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-amber-600 dark:text-amber-400">Medium</span>
                <span className="text-slate-600 dark:text-neutral-300">{mediumCount} <span className="text-slate-400">/ {totalMed}</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(mediumCount/totalMed)*100 || 5}%` }} />
              </div>
            </div>
            {/* Hard Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-red-600 dark:text-red-400">Hard</span>
                <span className="text-slate-600 dark:text-neutral-300">{hardCount} <span className="text-slate-400">/ {totalHard}</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(hardCount/totalHard)*100 || 5}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Four Square Widgets (Goals / Progress) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Daily Goal */}
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <Sun size={14} className="text-primary" />
              <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">Daily Goal</span>
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white mb-2">{dailySolved}<span className="text-sm text-slate-400">/{dailyGoal}</span></span>
            <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1 rounded-full mt-auto">
              <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (dailySolved/dailyGoal)*100)}%` }} />
            </div>
          </div>
          
          {/* Current Streak */}
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm flex flex-col">
            <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 mb-1">Current Streak</span>
            <div className="flex items-center gap-1 mb-2 text-amber-500">
              <Flame size={20} className="fill-amber-500/20" />
              <span className="text-2xl font-black text-slate-800 dark:text-white">{streakDays}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-auto">Best: {bestStreak} days</span>
          </div>

          {/* Weekly Goal */}
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar size={14} className="text-indigo-500" />
              <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">Weekly Goal</span>
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white mb-2">{weeklySolved}<span className="text-sm text-slate-400">/{weeklyGoal}</span></span>
            <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1 rounded-full mt-auto">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, (weeklySolved/weeklyGoal)*100)}%` }} />
            </div>
          </div>

          {/* Monthly Goal */}
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarDays size={14} className="text-fuchsia-500" />
              <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">Monthly Goal</span>
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white mb-2">{monthlySolved}<span className="text-sm text-slate-400">/{monthlyGoal}</span></span>
            <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1 rounded-full mt-auto">
              <div className="bg-fuchsia-500 h-full rounded-full" style={{ width: `${Math.min(100, (monthlySolved/monthlyGoal)*100)}%` }} />
            </div>
          </div>
        </div>

        {/* 4. Badges (Circular Packing equivalent) */}
        <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Award size={14} className="text-amber-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {achievementBadges.map((badge) => (
              <div
                key={badge.name}
                className={`flex flex-col items-center justify-center aspect-square rounded-xl border transition-all ${
                  badge.unlocked
                    ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30"
                    : "bg-slate-50 dark:bg-neutral-800/50 border-slate-100 dark:border-neutral-800 opacity-50 grayscale"
                }`}
                title={badge.name}
              >
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className="text-[8px] font-black text-slate-600 dark:text-neutral-400 text-center uppercase tracking-tighter leading-tight px-1">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";

export default function UpcomingTournament() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 15,
    minutes: 34,
    seconds: 12,
  });

  useEffect(() => {
    // Target next Sunday at 6:00 PM
    const getNextTargetDate = () => {
      const now = new Date();
      const target = new Date();
      target.setDate(now.getDate() + ((7 - now.getDay()) % 7)); // Next Sunday
      target.setHours(18, 0, 0, 0); // 6:00 PM
      
      // If Sunday 6 PM has passed today, target next Sunday
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 7);
      }
      return target;
    };

    const targetDate = getNextTargetDate();

    const updateTimer = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Upcoming Tournament</h3>
        <Link
          href="/arena#tournaments"
          className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="flex gap-4 items-start p-4 bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-100 dark:border-neutral-800/50 rounded-xl mb-4">
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0 mt-1">
          <Trophy size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-850 dark:text-neutral-100 leading-snug">
            AlgoBuddy Weekly Arena
          </h4>
          
          <div className="mt-3 flex items-center justify-between text-center gap-1.5 border-t border-slate-100 dark:border-neutral-800/60 pt-3">
            <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase tracking-wider text-left font-semibold">
              Starts in
            </span>
            <div className="flex gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-neutral-200">
                  {timeLeft.days}
                </span>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                  Days
                </span>
              </div>
              <span className="text-xs font-bold text-slate-300 dark:text-neutral-700">:</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-neutral-200">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                  Hours
                </span>
              </div>
              <span className="text-xs font-bold text-slate-300 dark:text-neutral-700">:</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-neutral-200">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                  Mins
                </span>
              </div>
              <span className="text-xs font-bold text-slate-300 dark:text-neutral-700">:</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-850 dark:text-neutral-100 animate-pulse">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                  Secs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
          <span>1st Place</span>
          <span className="font-semibold text-primary dark:text-purple-400">500 XP</span>
        </div>
        <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
          <span>2nd Place</span>
          <span className="font-semibold text-primary/80 dark:text-purple-400/80">300 XP</span>
        </div>
        <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
          <span>3rd Place</span>
          <span className="font-semibold text-primary/60 dark:text-purple-400/60">150 XP</span>
        </div>
      </div>
    </div>
  );
}

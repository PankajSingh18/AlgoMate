"use client";

import React, { useMemo, useState } from "react";

function getDateKey(date) {
  return date.toISOString().split("T")[0];
}

function getLevel(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
}

export default function ActivityHeatmap({ progress = {}, problemsMap = {} }) {
  const [hovered, setHovered] = useState(null);

  const { weeks, monthLabels } = useMemo(() => {
    const dayCounts = {};

    Object.entries(progress).forEach(([problemId, entry]) => {
      if (!entry || entry.status !== "Completed" || !entry.updatedAt) return;
      const d = new Date(entry.updatedAt);
      const key = getDateKey(d);
      if (!dayCounts[key]) {
        dayCounts[key] = { count: 0, easy: 0, medium: 0, hard: 0 };
      }
      dayCounts[key].count += 1;
      const difficulty = problemsMap[problemId]?.difficulty;
      if (difficulty === "Easy") dayCounts[key].easy += 1;
      else if (difficulty === "Medium") dayCounts[key].medium += 1;
      else if (difficulty === "Hard") dayCounts[key].hard += 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = 182;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays);
    const startDow = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDow);

    const days = [];
    const cursor = new Date(startDate);
    while (cursor <= today) {
      const key = getDateKey(cursor);
      const info = dayCounts[key] || { count: 0, easy: 0, medium: 0, hard: 0 };
      days.push({ date: new Date(cursor), key, ...info });
      cursor.setDate(cursor.getDate() + 1);
    }

    const weeksArr = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArr.push(days.slice(i, i + 7));
    }

    const labels = [];
    let lastMonth = null;
    weeksArr.forEach((week, idx) => {
      const firstDay = week[0].date;
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        labels.push({ index: idx, label: firstDay.toLocaleString("default", { month: "short" }) });
        lastMonth = month;
      }
    });

    return { weeks: weeksArr, monthLabels: labels };
  }, [progress, problemsMap]);

  const levelColors = [
    "bg-slate-100 dark:bg-neutral-800",
    "bg-emerald-200 dark:bg-emerald-900/40",
    "bg-emerald-400 dark:bg-emerald-700/70",
    "bg-emerald-600 dark:bg-emerald-500",
  ];

  return (
    <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-black text-slate-800 dark:text-neutral-200 mb-4">
        Activity Heatmap
      </h3>

      <div className="relative overflow-x-auto">
        <div className="flex gap-1 mb-1 ml-1 text-[10px] font-bold text-slate-400 dark:text-neutral-500">
          {monthLabels.map((m) => (
            <span key={m.index} style={{ marginLeft: m.index === 0 ? 0 : 12 }}>
              {m.label}
            </span>
          ))}
        </div>

        <div className="flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.key}
                  tabIndex={0}
                  role="button"
                  aria-label={`${day.date.toDateString()}: ${day.count} problem(s) solved`}
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(day)}
                  onBlur={() => setHovered(null)}
                  className={`w-3 h-3 rounded-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none ${levelColors[getLevel(day.count)]}`}
                />
              ))}
            </div>
          ))}
        </div>

        {hovered && (
          <div className="mt-3 text-xs font-bold text-slate-600 dark:text-neutral-300">
            {hovered.date.toDateString()}: {hovered.count} problem{hovered.count !== 1 ? "s" : ""} solved
            {hovered.count > 0 && (
              <span className="text-slate-400 dark:text-neutral-500 font-medium">
                {" "}(Easy: {hovered.easy}, Medium: {hovered.medium}, Hard: {hovered.hard})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

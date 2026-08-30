"use client";

import React from "react";

const topics = [
  { name: "Sorting", progress: 90 },
  { name: "Searching", progress: 75 },
  { name: "Trees & Graphs", progress: 60 },
  { name: "Linked Lists", progress: 80 },
  { name: "Stacks & Queues", progress: 70 },
  { name: "Hash Maps", progress: 50 },
];

export default function ProgressHeatmap() {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">
        Algorithm Learning Heatmap
      </h2>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span>{topic.name}</span>
              <span>{topic.progress}%</span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${topic.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-gray-300">
        Track your strengths and identify topics that need more practice.
      </p>
    </div>
  );
}
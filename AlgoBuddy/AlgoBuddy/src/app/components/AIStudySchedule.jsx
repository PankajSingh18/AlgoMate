"use client";

import React from "react";

const studyPlan = [
  {
    day: "Monday",
    topic: "Sorting Algorithms",
    time: "2 Hours",
    level: "Beginner",
  },
  {
    day: "Tuesday",
    topic: "Binary Search & Searching",
    time: "1.5 Hours",
    level: "Intermediate",
  },
  {
    day: "Wednesday",
    topic: "Trees and Graphs",
    time: "2.5 Hours",
    level: "Advanced",
  },
  {
    day: "Thursday",
    topic: "Linked Lists Revision",
    time: "1 Hour",
    level: "Beginner",
  },
];

export default function AIStudySchedule() {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        AI Personalized Study Schedule
      </h2>

      <p className="text-gray-400 mb-5">
        Schedule generated based on your progress, weak areas, and learning goals.
      </p>

      <div className="space-y-4">
        {studyPlan.map((plan, index) => (
          <div
            key={index}
            className="bg-slate-800 p-4 rounded-lg border border-slate-700"
          >
            <h3 className="font-semibold text-lg">
              {plan.day}
            </h3>

            <p>📚 Topic: {plan.topic}</p>
            <p>⏳ Study Time: {plan.time}</p>
            <p>🎯 Difficulty: {plan.level}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 bg-purple-900/40 p-4 rounded-lg">
        <h4 className="font-semibold">
          AI Recommendation
        </h4>
        <p className="text-sm text-gray-300">
          Spend more time on Trees and Graphs as your completion level is lower.
          Continue regular revision for previously completed topics.
        </p>
      </div>
    </div>
  );
}
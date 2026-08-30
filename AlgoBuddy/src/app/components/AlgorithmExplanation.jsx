"use client";

import React from "react";
import { Sparkles, BookOpen, Clock, Database } from "lucide-react";

export default function AlgorithmExplanation({ explanation }) {
  return (
    <div className="w-full mt-5 rounded-2xl border border-purple-200 dark:border-purple-900 
      bg-white dark:bg-slate-900 shadow-lg overflow-hidden">

      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 flex items-center gap-3">
        <Sparkles className="text-white" size={22} />
        <div>
          <h2 className="text-white font-bold text-lg">
            AI Algorithm Assistant
          </h2>
          <p className="text-purple-100 text-sm">
            Smart explanation for your current algorithm step
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">

        {/* Explanation Card */}
        <div className="rounded-xl border border-purple-200 dark:border-purple-700 
          bg-purple-50 dark:bg-slate-800 p-4">

          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="text-purple-600 dark:text-purple-400" size={18}/>
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Current Step Explanation
            </h3>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300">
            {explanation ||
              "AI is analyzing the algorithm step and generating an easy-to-understand explanation."}
          </p>
        </div>


        {/* Data State Card */}
        <div className="rounded-xl bg-blue-50 dark:bg-slate-800 p-4 
          border border-blue-200 dark:border-blue-700">

          <div className="flex gap-2 items-center mb-2">
            <Database className="text-blue-600" size={18}/>
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Data Structure Insight
            </h3>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300">
            Visualize how values, nodes, and elements are modified during the
            current execution step.
          </p>

        </div>


        {/* Complexity Card */}
        <div className="rounded-xl bg-green-50 dark:bg-slate-800 p-4
          border border-green-200 dark:border-green-700">

          <div className="flex gap-2 items-center mb-2">
            <Clock className="text-green-600" size={18}/>
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Complexity Insight
            </h3>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300">
            Understand how comparisons, swaps, and operations affect the
            algorithm's time and space complexity.
          </p>

        </div>

      </div>
    </div>
  );
}
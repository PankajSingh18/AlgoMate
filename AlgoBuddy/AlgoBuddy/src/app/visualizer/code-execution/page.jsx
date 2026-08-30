"use client";
import CodeExecutionPanel from "@/app/components/CodeExecutionPanel";

export default function CodeExecutionPage() {
  return (
    <div className="min-h-screen p-6 bg-white dark:bg-[#1c1d1f]">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Side-by-Side Code Execution Visualizer
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Learn algorithms by observing the source code and its execution
        visualization together.
      </p>
      <CodeExecutionPanel />
    </div>
  );
}
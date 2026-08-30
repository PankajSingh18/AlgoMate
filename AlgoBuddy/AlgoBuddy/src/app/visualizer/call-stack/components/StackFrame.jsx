"use client";

export default function StackFrame({ frame, isActive }) {
  return (
    <div
      className={`
        w-64 p-3 rounded-lg border-2 text-center font-mono text-sm transition-all duration-300
        ${isActive
          ? "border-blue-500 bg-blue-900/40 text-blue-300 scale-105"
          : "border-gray-600 bg-gray-800/60 text-gray-300"}
      `}
    >
      <div className="font-bold">{frame.fn}</div>
      {frame.returnValue !== undefined && (
        <div className="text-green-400 text-xs mt-1">
          returns → {frame.returnValue}
        </div>
      )}
    </div>
  );
}
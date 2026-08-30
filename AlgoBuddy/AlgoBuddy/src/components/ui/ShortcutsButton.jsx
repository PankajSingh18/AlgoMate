"use client";

import { useState } from "react";

const SHORTCUTS = [
  { keys: ["Space"], label: "Play / Pause" },
  { keys: ["→"], label: "Step forward" },
  { keys: ["R"], label: "Reset All" },
  { keys: ["+", "="], label: "Speed up" },
  { keys: ["-"], label: "Slow down" },
];

export default function ShortcutsButton({ position = "controls" }) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowShortcuts(!showShortcuts)}
        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 shadow-md transition-all duration-200"
      >
        <span>⌨️</span>
        <span>Shortcuts</span>
      </button>

      {showShortcuts && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">⌨️ Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-2">
              {SHORTCUTS.map(({ keys, label }) => (
                <li key={label} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm">{label}</span>
                  <span className="flex gap-1">
                    {keys.map((k) => (
                      <kbd key={k} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">?</kbd> to open this modal
            </div>
          </div>
        </div>
      )}
    </>
  );
}

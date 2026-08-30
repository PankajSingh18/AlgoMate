"use client";

import { useEffect, useState } from "react";

export default function KeyboardShortcuts() {
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Play / Pause
      if (event.code === "Space") {
        event.preventDefault();
        console.log("Play/Pause shortcut triggered");
      }

      // Reset visualization
      if (event.key.toLowerCase() === "r") {
        console.log("Reset shortcut triggered");
      }

      // Next step
      if (event.key === "ArrowRight") {
        console.log("Next step shortcut triggered");
      }

      // Previous step
      if (event.key === "ArrowLeft") {
        console.log("Previous step shortcut triggered");
      }

      // Open search
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        console.log("Search shortcut triggered");
      }

      // Toggle focus mode
      if (event.key.toLowerCase() === "f") {
        setFocusMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-white p-4 rounded-xl shadow-lg text-sm z-50">
      <h3 className="font-bold mb-2">
        ⌨ Keyboard Shortcuts
      </h3>

      <ul className="space-y-1">
        <li><b>Space</b> - Play / Pause</li>
        <li><b>R</b> - Reset Visualization</li>
        <li><b>→</b> - Next Step</li>
        <li><b>←</b> - Previous Step</li>
        <li><b>Ctrl + K</b> - Open Search</li>
        <li><b>F</b> - Focus Mode</li>
      </ul>

      <p className="mt-3 text-xs text-purple-300">
        Focus Mode: {focusMode ? "Enabled" : "Disabled"}
      </p>
    </div>
  );
}
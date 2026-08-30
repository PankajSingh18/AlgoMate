"use client";
import { useState } from "react";

export default function KeyboardShortcutsLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          console.log("Clicked! open =", open);
          setOpen(!open);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {open ? "Close Shortcuts" : "Open Shortcuts"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-[9999] bg-white dark:bg-gray-800 p-4 rounded shadow-lg border">
          <p className="font-bold">Keyboard Shortcuts</p>
          <ul>
            <li>Space: Play/Pause</li>
            <li>R: Reset</li>
            <li>→: Next Step</li>
          </ul>
        </div>
      )}
    </div>
  );
}

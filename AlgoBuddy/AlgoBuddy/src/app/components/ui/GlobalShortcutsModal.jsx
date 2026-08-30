"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const GLOBAL_SHORTCUTS = [
  { keys: ["Ctrl", "K"], label: "Search / Command Palette", altKey: ["/"] },
  { keys: ["Ctrl", "Shift", "K"], label: "Toggle Notifications" },
  { keys: ["Ctrl", "Shift", "A"], label: "Go to Arena" },
  { keys: ["Ctrl", "Shift", "B"], label: "Go to Practice" },
  { keys: ["Ctrl", "Shift", "V"], label: "Go to Visualizer" },
  { keys: ["?"], label: "Show Keyboard Shortcuts" },
  { keys: ["Esc"], label: "Close Modals / Menus" },
  { keys: ["Space"], label: "Play / Pause Visualizer" },
  { keys: ["R"], label: "Reset Visualizer" },
  { keys: ["→", "←"], label: "Next / Previous Step" },
  { keys: ["+", "-"], label: "Speed Up / Slow Down" },
];

export default function GlobalShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleToggle() {
      setIsOpen((prev) => !prev);
    }
    function handleEscape() {
      setIsOpen(false);
    }

    function handleKeyDown(event) {
      const key = event.key.toLowerCase();
      
      const target = event.target;
      const isTyping = target.tagName?.toLowerCase() === "input" || 
                       target.tagName?.toLowerCase() === "textarea" ||
                       target.isContentEditable;
      if (isTyping) return;

      if (key === "?") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (key === "escape" && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    }

    window.addEventListener("toggle-shortcuts-modal", handleToggle);
    window.addEventListener("global-escape", handleEscape);
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("toggle-shortcuts-modal", handleToggle);
      window.removeEventListener("global-escape", handleEscape);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div 
        className="w-full max-w-md rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {GLOBAL_SHORTCUTS.map((shortcut, idx) => (
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-surface-100 dark:border-surface-800 last:border-0"
            >
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                {shortcut.label}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {shortcut.keys.map((key, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="inline-flex items-center justify-center px-2 py-1 min-w-[1.5rem] font-mono text-xs font-semibold text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded shadow-sm"
                  >
                    {key === "Ctrl" ? "⌘ / Ctrl" : key}
                  </kbd>
                ))}
                {shortcut.altKey && (
                  <>
                    <span className="text-xs text-surface-400 mx-1">or</span>
                    {shortcut.altKey.map((key, kIdx) => (
                      <kbd
                        key={`alt-${kIdx}`}
                        className="inline-flex items-center justify-center px-2 py-1 min-w-[1.5rem] font-mono text-xs font-semibold text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded shadow-sm"
                      >
                        {key}
                      </kbd>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-surface-50 dark:bg-surface-800/50 border-t border-surface-200 dark:border-surface-800 text-center">
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-700 font-mono">?</kbd> to open/close this modal
          </p>
        </div>
      </div>
    </div>
  );
}

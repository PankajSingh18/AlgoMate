"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

const SHORTCUTS = [
  { key: "Space", label: "Play/Pause animation" },
  { key: "R", label: "Reset visualization" },
  { key: "N", label: "Next step" },
  { key: "P", label: "Previous step" },
  { key: "Esc", label: "Close modal" },
];

export default function VisualizerShortcutsModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-950 border border-surface-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-surface-200 dark:border-neutral-800">
          <h2 className="text-lg font-black text-slate-900 dark:text-neutral-100">
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-slate-600 dark:text-neutral-300 mb-4">
            Use these controls while the visualizer is running.
          </p>

          <div className="space-y-3">
            {SHORTCUTS.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-surface-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2"
              >
                <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
                  {s.label}
                </span>
                <kbd className="inline-flex items-center justify-center rounded-md border border-surface-300 dark:border-neutral-700 bg-surface-100 dark:bg-neutral-900 px-3 py-1 text-xs font-bold font-mono text-slate-800 dark:text-neutral-100 shadow-sm">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-4 text-[12px] text-slate-500 dark:text-neutral-400">
            Tip: shortcuts are disabled while you’re typing in an input.
          </div>
        </div>
      </div>
    </div>
  );
}


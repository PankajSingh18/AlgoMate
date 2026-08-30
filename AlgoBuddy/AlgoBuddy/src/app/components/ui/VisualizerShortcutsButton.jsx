"use client";

import { useState } from "react";
import { Keyboard } from "lucide-react";
import VisualizerShortcutsModal from "@/app/components/ui/VisualizerShortcutsModal";

export default function VisualizerShortcutsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
      >
        <Keyboard className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Keyboard Shortcuts</span>
        <span className="sm:hidden">Shortcuts</span>
      </button>

      <VisualizerShortcutsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}


"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * ResponsiveControls
 *
 * On large screens this is a plain passthrough wrapper (invisible).
 * On small screens (< lg) it becomes a sticky bottom panel with a
 * "Show / Hide Controls" toggle button so the visualizer canvas is
 * not obscured by controls.
 *
 * Usage:
 *   <ResponsiveControls defaultExpanded>
 *     <PlaybackControls ... />
 *     <SpeedSlider ... />
 *   </ResponsiveControls>
 *
 * @param {object}    props
 * @param {ReactNode} props.children
 * @param {boolean}   [props.defaultExpanded=true]
 */
export function ResponsiveControls({ children, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="lg:static fixed bottom-0 left-0 right-0 z-40 lg:z-auto">
      {/* Toggle button — only visible on mobile / tablet */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls="mobile-visualizer-controls"
        className="
          lg:hidden w-full px-4 py-3
          bg-white dark:bg-neutral-950
          border-t border-gray-200 dark:border-gray-700
          flex items-center justify-center gap-2
          text-sm font-medium text-gray-600 dark:text-gray-300
          focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:ring-inset
          active:bg-gray-50 dark:active:bg-neutral-900
          touch-manipulation
        "
      >
        {isExpanded ? "Hide Controls" : "Show Controls"}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Control panel body */}
      <div
        id="mobile-visualizer-controls"
        className={`
          ${isExpanded ? "block" : "hidden"}
          lg:block
          bg-white dark:bg-neutral-950
          border-t border-gray-200 dark:border-gray-700
          lg:border-t-0
          p-4 lg:p-0
          max-h-[60vh] lg:max-h-none
          overflow-y-auto lg:overflow-y-visible
        `}
      >
        {children}
      </div>
    </div>
  );
}

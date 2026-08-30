"use client";

import { useRef, useEffect, useState } from "react";
import useSwipeGesture from "@/app/hooks/useSwipeGesture";

/**
 * VisualizerCanvas
 *
 * A responsive wrapper for algorithm visualizer canvases / SVG areas.
 * - Listens to window resize and scales down the inner content when it
 *   overflows the container (never scales above 1x).
 * - Attaches swipe-left / swipe-right gestures for step navigation on
 *   touch devices.
 * - Adds `touch-action: manipulation` to prevent the 300 ms tap delay
 *   and disable accidental pinch-zoom on the canvas area.
 *
 * @param {object}    props
 * @param {ReactNode} props.children      - the visualizer SVG / canvas
 * @param {Function}  [props.onSwipeLeft]  - step forward (swipe left)
 * @param {Function}  [props.onSwipeRight] - step back   (swipe right)
 * @param {string}    [props.className]    - extra Tailwind classes
 * @param {*}         [props.watchKey]     - change this value to re-measure
 *                                          (e.g. pass the data array)
 */
export function VisualizerCanvas({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = "",
  watchKey,
}) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Re-measure when container or data changes
  useEffect(() => {
    function measure() {
      const el = wrapperRef.current;
      if (!el) return;
      const containerWidth = el.parentElement?.clientWidth ?? el.clientWidth;
      const contentWidth   = el.scrollWidth;
      if (contentWidth > containerWidth) {
        setScale(containerWidth / contentWidth);
      } else {
        setScale(1);
      }
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchKey]);

  // Swipe gestures for step navigation
  useSwipeGesture(wrapperRef, {
    onSwipeLeft,
    onSwipeRight,
    threshold: 50,
    enabled: !!(onSwipeLeft || onSwipeRight),
  });

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        // Prevent the 300 ms tap delay on all touch devices
        touchAction: "manipulation",
      }}
    >
      {children}

      {/* Mobile swipe hint — shown only on touch devices via Tailwind */}
      {(onSwipeLeft || onSwipeRight) && (
        <p
          className="
            block sm:hidden
            text-center text-[10px] text-surface-400 dark:text-surface-500
            mt-1 select-none pointer-events-none
          "
          aria-hidden="true"
        >
          ← swipe to step →
        </p>
      )}
    </div>
  );
}

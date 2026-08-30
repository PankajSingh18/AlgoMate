"use client";
import { useEffect } from "react";

/**
 * useSwipeGesture
 *
 * Attaches passive touch event listeners to `ref.current` and fires
 * `onSwipeLeft` or `onSwipeRight` when the user swipes more than
 * `threshold` pixels horizontally.
 *
 * Used by algorithm visualizers to allow swipe-right → step back
 * and swipe-left → step forward on mobile / tablet devices.
 *
 * @param {React.RefObject} ref          - ref attached to the swipeable element
 * @param {object}          opts
 * @param {Function}        [opts.onSwipeLeft]   - called when user swipes left  (step forward)
 * @param {Function}        [opts.onSwipeRight]  - called when user swipes right (step back)
 * @param {number}          [opts.threshold=50]  - minimum px distance to count as a swipe
 * @param {boolean}         [opts.enabled=true]  - set false to disable
 */
export default function useSwipeGesture(ref, {
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  enabled = true,
} = {}) {
  useEffect(() => {
    const el = ref?.current;
    if (!el || !enabled) return;

    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      // Only fire if horizontal movement dominates (not a scroll)
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) {
        onSwipeLeft?.();   // swipe left  → step forward
      } else {
        onSwipeRight?.();  // swipe right → step back
      }
    }

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend",   handleTouchEnd,   { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend",   handleTouchEnd);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold, enabled]);
}

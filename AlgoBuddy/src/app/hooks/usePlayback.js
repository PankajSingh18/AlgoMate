import { useState, useRef, useEffect, useCallback } from "react";

export default function usePlayback(initialSpeed = 1) {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  const isPausedRef = useRef(false);
  const speedRef = useRef(initialSpeed);

  // Pause resolution for async/await (Sorting algorithms)
  const pausePromiseRef = useRef(null);
  const pauseResolveRef = useRef(null);

  const internalSetIsPaused = useCallback((nextPaused) => {
    setIsPaused((prev) => {
      const next = typeof nextPaused === "function" ? nextPaused(prev) : nextPaused;
      isPausedRef.current = next;

      if (!next && pauseResolveRef.current && pausePromiseRef.current) {
        pauseResolveRef.current();
        pausePromiseRef.current = null;
        pauseResolveRef.current = null;
      }
      return next;
    });
  }, []);

  const internalSetIsPausedRef = useRef(internalSetIsPaused);
  internalSetIsPausedRef.current = internalSetIsPaused;

  const internalTogglePlayPause = useCallback(() => {
    internalSetIsPaused((prev) => !prev);
  }, [internalSetIsPaused]);

  const internalTogglePlayPauseRef = useRef(internalTogglePlayPause);
  internalTogglePlayPauseRef.current = internalTogglePlayPause;

  const setSpeedRef = useRef(setSpeed);
  setSpeedRef.current = setSpeed;

  const setPausedSync = useCallback((val) => {
    internalSetIsPaused(val);
  }, [internalSetIsPaused]);

  const togglePlayPause = useCallback(() => {
    internalTogglePlayPause();
  }, [internalTogglePlayPause]);

  // Async function for sorting algorithms to await between steps
  const checkPause = async () => {
    if (isPausedRef.current) {
      if (!pausePromiseRef.current) {
        pausePromiseRef.current = new Promise((resolve) => {
          pauseResolveRef.current = resolve;
        });
      }
      await pausePromiseRef.current;
    }
  };

  const increaseSpeed = useCallback(() => {
    setSpeed((s) => Math.min(s + 0.5, 5));
  }, []);

  const decreaseSpeed = useCallback(() => {
    setSpeed((s) => Math.max(s - 0.5, 0.5));
  }, []);

  const setSpeedSync = useCallback((val) => {
    setSpeed((s) => (typeof val === "function" ? val(s) : val));
  }, []);

  // Ensure speed ref is always synced for setTimeout delays
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return {
    isPaused,
    setIsPaused: setPausedSync,
    isPausedRef,
    speed,
    speedRef,
    setSpeed: setSpeedSync,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  };
}

"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_SPEED = 500;

export function useAnimationEngine({ steps, onStep, initialSpeed = DEFAULT_SPEED }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(initialSpeed);

  const rafRef = useRef(null);
  const lastFrameTime = useRef(0);
  const onStepRef = useRef(onStep);
  const isPlayingRef = useRef(false);

  // KEY FIX: speedRef always holds the latest speed value.
  // The rAF loop reads from this ref, so speed changes take effect
  // on the very next frame — no stale closures, no old loops colliding.
  const speedRef = useRef(initialSpeed);

  const stepsLength = steps?.length ?? 0;

  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Stop automatically when the last step is reached.
  useEffect(() => {
    if (isPlaying && stepsLength > 0 && currentStep >= stepsLength - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, stepsLength]);

  // Expose a setSpeed that updates BOTH the ref (instant, for the rAF loop)
  // and the state (for UI re-renders). No loop restart needed.
  const setSpeed = useCallback((newSpeed) => {
    speedRef.current = newSpeed;
    setSpeedState(newSpeed);
  }, []);

  const play = useCallback(() => {
    setCurrentStep((s) => (s >= stepsLength - 1 ? 0 : s));
    lastFrameTime.current = 0;
    setIsPlaying(true);
  }, [stepsLength]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setCurrentStep(0);
    lastFrameTime.current = 0;
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, stepsLength - 1));
  }, [stepsLength]);

  const stepBackward = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(Math.min(Math.max(0, step), stepsLength - 1));
  }, [stepsLength]);

  // Single rAF loop. Only restarts when play state or stepsLength changes —
  // NOT when speed changes, because speed is now read from speedRef.
  useEffect(() => {
    if (!isPlaying || stepsLength === 0) return;

    const animate = (timestamp) => {
      if (!isPlayingRef.current) return;

      if (lastFrameTime.current === 0) {
        lastFrameTime.current = timestamp;
      }

      // Read speedRef.current here — always the latest value, never stale.
      if (timestamp - lastFrameTime.current >= speedRef.current) {
        setCurrentStep((s) => (s < stepsLength - 1 ? s + 1 : s));
        lastFrameTime.current = timestamp;
      }

      if (isPlayingRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, stepsLength]); // speed intentionally excluded — handled by speedRef

  // Call onStep whenever the current step index changes.
  useEffect(() => {
    if (steps && currentStep >= 0 && currentStep < stepsLength) {
      onStepRef.current?.(steps[currentStep], currentStep);
    }
  }, [currentStep, steps, stepsLength]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    goToStep,
  };
}
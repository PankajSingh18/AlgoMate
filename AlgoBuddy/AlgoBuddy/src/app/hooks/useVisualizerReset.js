"use client";
import { useEffect, useRef } from "react";

export default function useVisualizerReset(resetFn) {
  const ref = useRef(resetFn);

  useEffect(() => {
    ref.current = resetFn;
  });

  useEffect(() => {
    return () => {
      ref.current?.();
    };
  }, []);
}

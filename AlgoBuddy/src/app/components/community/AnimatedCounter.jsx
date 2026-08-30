"use client";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ value, label, className = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 800;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <p className="text-xl font-bold text-surface-900 dark:text-white">{count}</p>
      <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

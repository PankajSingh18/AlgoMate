"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function GlobalKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const isCtrl = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      const isOnVisualizer = window.location.pathname.includes('/visualizer');
      
      // Don't trigger if typing in input fields
      const target = event.target;
      const isTyping = target.tagName?.toLowerCase() === "input" || 
                       target.tagName?.toLowerCase() === "textarea" ||
                       target.isContentEditable;
      if (isTyping) return;

      // ? key - toggle shortcuts modal
      if (key === "?") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("toggle-shortcuts-modal"));
        return;
      }

      // Escape - close modal
      if (key === "escape") {
        window.dispatchEvent(new CustomEvent("global-escape"));
        return;
      }

      // Visualizer-specific shortcuts
      if (isOnVisualizer) {
        // Space - Play/Pause
        if (key === ' ' || key === 'spacebar') {
          event.preventDefault();
          document.dispatchEvent(new CustomEvent('visualizer:toggle'));
          toast.success("Play/Pause toggled", { icon: "▶️" });
          return;
        }

        // R - Reset
        if (key === 'r') {
          event.preventDefault();
          document.dispatchEvent(new CustomEvent('visualizer:reset'));
          toast.success("Visualizer reset", { icon: "🔄" });
          return;
        }

        // Arrow keys - Next/Previous step
        if (key === 'arrowright') {
          event.preventDefault();
          document.dispatchEvent(new CustomEvent('visualizer:next'));
          return;
        }
        if (key === 'arrowleft') {
          event.preventDefault();
          document.dispatchEvent(new CustomEvent('visualizer:prev'));
          return;
        }

        // + / = - Speed up
        if (key === '+' || key === '=') {
          event.preventDefault();
          document.dispatchEvent(new CustomEvent('visualizer:increase-speed'));
          toast.success("Speed increased", { icon: "⚡" });
          return;
        }
        // - Speed down
        if (key === '-') {
          event.preventDefault();
          document.dispatchEvent(new CustomEvent('visualizer:decrease-speed'));
          toast.success("Speed decreased", { icon: "🐢" });
          return;
        }
      }

      // Ctrl+Shift+Key navigation shortcuts
      if (!isCtrl || !isShift) return;

      const routes = {
        a: "/arena",
        b: "/practice",
        v: "/visualizer",
      };

      const route = routes[key];
      if (route) {
        event.preventDefault();
        router.push(route);
        toast.success(`Opened ${route}`);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}

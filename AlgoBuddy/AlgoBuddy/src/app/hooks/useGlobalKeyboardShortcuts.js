"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useGlobalKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e) {
      const activeElement = document.activeElement;
      
        const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.isContentEditable;

      if (isTyping && e.key !== "Escape") {
        return;
      }

      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      }
      else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("toggle-notifications"));
      }
      else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/arena");
      }
      else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        router.push("/practice");
      }
      else if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("toggle-shortcuts-modal"));
      }
      else if (e.key === "Escape") {
        window.dispatchEvent(new CustomEvent("global-escape"));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);
}

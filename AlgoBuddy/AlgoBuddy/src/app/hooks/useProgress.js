"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@/features/user/UserContext";

/**
 * useProgress – lightweight hook for the topic sub-pages (/practice/[topic]).
 * Delegates all heavy lifting to the same localStorage key that useSheetProgress
 * manages, ensuring the two pages always stay in sync without redundant network calls.
 *
 * If you need streak data or server sync on the topic page, import
 * useSheetProgress directly instead.
 */

const LOCAL_KEY = "algobuddy_practice_progress";

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocal(data) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch {}
}

function normalizeRaw(raw) {
  const map = {};
  Object.keys(raw).forEach((key) => {
    const val = raw[key];
    map[key] =
      typeof val === "object" && val !== null
        ? val.status || "Not Started"
        : val || "Not Started";
  });
  return map;
}

export function useProgress() {
  const { user } = useUser();
  const [rawProgress, setRawProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const progress = useMemo(() => normalizeRaw(rawProgress), [rawProgress]);

  useEffect(() => {
    // Load from localStorage (always available instantly)
    const local = readLocal();
    setRawProgress(local);
    setLoading(false);
  }, [user]);

  const updateProgress = useCallback(
    async (problemId, status) => {
      const updatedAt = new Date().toISOString();
      const next = { ...rawProgress, [problemId]: { status, updatedAt } };
      setRawProgress(next);
      writeLocal(next);

      // Sync to server via the progress API route (Supabase path)
      // or via Spring Boot if configured
      if (user) {
        try {
          const useSpringBoot =
            process.env.NEXT_PUBLIC_USE_SPRING_BOOT_API === "true";

          if (useSpringBoot) {
            const { supabase } = await import("@/lib/supabase");
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
              const baseUrl =
                process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || "http://localhost:8080";
              await fetch(`${baseUrl}/api/v1/practice/progress`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ problemId, status }),
              });
            }
          } else {
            // Supabase path via Next.js API route
            await fetch("/api/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ problemId, status }),
            });
          }
        } catch (err) {
          console.error("[useProgress] Failed to sync to server:", err);
        }
      }
    },
    [rawProgress, user]
  );

  return { progress, loading, updateProgress };
}

"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useUser } from "@/features/user/UserContext";
import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const LOCAL_KEY = "algobuddy_practice_progress";
const STREAK_KEY = "algobuddy_current_streak";
const BEST_STREAK_KEY = "algobuddy_best_streak";
const LAST_ACTIVE_KEY = "algobuddy_last_active_date";

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

/** Normalize any stored entry to { status, updatedAt } */
function normalizeEntry(val) {
  if (!val) return { status: "Not Started", updatedAt: null };
  if (typeof val === "string") return { status: val, updatedAt: null };
  return {
    status: val.status || "Not Started",
    updatedAt: val.updatedAt || val.updated_at || null,
  };
}

/** Merge server map (wins on conflict by timestamp) into local map */
function mergeProgress(local, serverMap) {
  const merged = { ...local };
  Object.entries(serverMap).forEach(([id, serverEntry]) => {
    const localEntry = local[id];
    const serverTs = serverEntry.updatedAt ? new Date(serverEntry.updatedAt).getTime() : 0;
    const localTs = localEntry?.updatedAt ? new Date(localEntry.updatedAt).getTime() : 0;
    if (serverTs >= localTs) {
      merged[id] = serverEntry;
    }
  });
  return merged;
}

// ---------------------------------------------------------------------------
// API helpers (support Spring Boot OR Next.js/Supabase path)
// ---------------------------------------------------------------------------

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

const isUsingSpringBoot = () =>
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_SPRING_BOOT_API === "true";

function springBootBase() {
  return process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || "http://localhost:8080";
}

/** Fetch all progress for current user */
async function fetchProgressFromServer() {
  if (isUsingSpringBoot()) {
    const headers = await getAuthHeader();
    if (!headers.Authorization) return null;
    const res = await fetch(`${springBootBase()}/api/v1/practice/progress`, { headers });
    if (!res.ok) return null;
    return await res.json(); // ProgressResponse shape
  }

  // Supabase path via Next.js API route
  const res = await fetch("/api/progress");
  if (!res.ok) return null;
  return await res.json(); // { progress: { [id]: { status, updatedAt } } }
}

/** Update a single problem's status */
async function postProgressToServer(problemId, status) {
  if (isUsingSpringBoot()) {
    const headers = await getAuthHeader();
    if (!headers.Authorization) return;
    const res = await fetch(`${springBootBase()}/api/v1/practice/progress`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, status }),
    });
    if (!res.ok) return null;
    return await res.json();
  }

  // Supabase path
  await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problemId, status }),
  });
  return null;
}

/** Bulk-sync items that exist locally but not on the server */
async function bulkSyncToServer(items) {
  if (!items || items.length === 0) return null;

  if (isUsingSpringBoot()) {
    const headers = await getAuthHeader();
    if (!headers.Authorization) return null;
    const res = await fetch(`${springBootBase()}/api/v1/practice/progress/bulk`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) return null;
    return await res.json();
  }

  // Supabase path: sequential POSTs
  for (const item of items) {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: item.problemId, status: item.status }),
    }).catch(() => {});
  }
  return null;
}

// ---------------------------------------------------------------------------
// Streak helpers (local-only for Supabase path; server-driven for Spring Boot)
// ---------------------------------------------------------------------------

function readLocalStreak() {
  const current = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
  const best = parseInt(localStorage.getItem(BEST_STREAK_KEY) || "0", 10);
  return { current, best };
}

function updateLocalStreak(currentStreak) {
  const today = new Date().toDateString();
  const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
  if (lastActive === today) return currentStreak; // already updated today

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let next = lastActive === yesterday ? currentStreak + 1 : 1;
  const best = Math.max(parseInt(localStorage.getItem(BEST_STREAK_KEY) || "0", 10), next);

  localStorage.setItem(STREAK_KEY, String(next));
  localStorage.setItem(BEST_STREAK_KEY, String(best));
  localStorage.setItem(LAST_ACTIVE_KEY, today);
  return next;
}

// ---------------------------------------------------------------------------
// The unified hook
// ---------------------------------------------------------------------------

/**
 * useSheetProgress
 *
 * Manages DSA sheet problem progress with:
 *  - Instant local-first rendering (no flicker)
 *  - Sync from Spring Boot or Supabase on mount
 *  - Optimistic updates on status toggle
 *  - Bulk sync of local guest progress after login
 *  - Streak tracking
 *
 * Returns:
 *  progress       – { [problemId]: { status, updatedAt } }
 *  getStatus(id)  – returns the string status for a problem ID
 *  updateProgress(problemId, newStatus) – update + sync
 *  streakData     – { current, best, dailySolved, weeklySolved, monthlySolved }
 *  loading
 */
export function useSheetProgress() {
  const { user } = useUser();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streakData, setStreakData] = useState({
    current: 0,
    best: 0,
    dailySolved: 0,
    weeklySolved: 0,
    monthlySolved: 0,
  });

  // Track whether we've done the initial server sync to avoid double-syncing
  const syncedRef = useRef(false);

  // ── Load & sync on mount / user change ──────────────────────────────────
  useEffect(() => {
    syncedRef.current = false;
    let cancelled = false;

    const loadAndSync = async () => {
      setLoading(true);

      // 1. Load local immediately for instant UI
      const local = readLocal();
      if (!cancelled) setProgress(local);

      if (!user) {
        // Guest mode: use localStorage streaks
        const localStreak = readLocalStreak();
        if (!cancelled) setStreakData((prev) => ({ ...prev, ...localStreak }));
        setLoading(false);
        return;
      }

      // 2. Fetch server progress
      try {
        const serverData = await fetchProgressFromServer();
        if (cancelled || !serverData) {
          setLoading(false);
          return;
        }

        // Build a normalized server map
        const rawServerMap = serverData.progress || {};
        const serverMap = {};
        Object.entries(rawServerMap).forEach(([id, val]) => {
          serverMap[id] = normalizeEntry(val);
        });

        // 3. Find items in local but not on server → bulk sync them up first
        const toSync = [];
        Object.entries(local).forEach(([id, entry]) => {
          const e = normalizeEntry(entry);
          if (!serverMap[id] && e.status && e.status !== "Not Started") {
            toSync.push({ problemId: id, status: e.status });
          }
        });
        if (toSync.length > 0) {
          const bulkResult = await bulkSyncToServer(toSync);
          // If Spring Boot returned fresh data after bulk sync, use it
          if (bulkResult?.progress) {
            Object.entries(bulkResult.progress).forEach(([id, val]) => {
              serverMap[id] = normalizeEntry(val);
            });
          }
        }

        // 4. DB is authoritative: build final state from serverMap only.
        //    - Server entries are used as-is.
        //    - Local-only entries that were just bulk-synced are also included.
        //    - Local entries that don't exist on server AND weren't synced up
        //      (e.g. "Not Started") are dropped — they reflect deletions from
        //      another browser/device.
        const syncedIds = new Set(toSync.map((i) => i.problemId));
        const authoritative = { ...serverMap };
        // Keep local entries that were just synced (they are now on server)
        syncedIds.forEach((id) => {
          if (!authoritative[id] && local[id]) {
            authoritative[id] = normalizeEntry(local[id]);
          }
        });
        writeLocal(authoritative);
        if (!cancelled) setProgress(authoritative);

        // 5. Update streak state — server is authoritative for authenticated users.
        if (!cancelled) {
          if (serverData.currentStreak !== undefined) {
            // Both Spring Boot and Supabase paths now return currentStreak.
            setStreakData({
              current: serverData.currentStreak || 0,
              best: serverData.longestStreak || 0,
              dailySolved: serverData.dailySolved || 0,
              weeklySolved: serverData.weeklySolved || 0,
              monthlySolved: serverData.monthlySolved || 0,
            });
          } else {
            // Server did not return streak fields — fall back to localStorage
            // only as a last resort (e.g. unexpected API shape change).
            const localStreak = readLocalStreak();
            setStreakData((prev) => ({ ...prev, ...localStreak }));
          }
        }
      } catch (err) {
        console.error("[useSheetProgress] Server sync failed:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load progress");
        }
      }

      if (!cancelled) {
        syncedRef.current = true;
        setLoading(false);
      }
    };

    loadAndSync();
    return () => { cancelled = true; };
  }, [user]);

  // ── Update progress ──────────────────────────────────────────────────────
  const updateProgress = useCallback(
    async (problemId, newStatus) => {
      const updatedAt = new Date().toISOString();
      const updated = {
        ...progress,
        [problemId]: { status: newStatus, updatedAt },
      };
      setProgress(updated);
      writeLocal(updated);

      // Update local streak on completion only for guests.
      // Authenticated users get their streak from the server after the sync
      // below, so updating localStorage here would cause divergence.
      if (newStatus === "Completed" && !user) {
        const next = updateLocalStreak(streakData.current);
        setStreakData((prev) => ({
          ...prev,
          current: next,
          best: Math.max(prev.best, next),
        }));
      }

      // Sync to server asynchronously
      if (user) {
        try {
          const fresh = await postProgressToServer(problemId, newStatus);
          // Use server streak data whenever it is returned (both Spring Boot
          // and Supabase paths now include currentStreak/longestStreak).
          if (fresh && fresh.currentStreak !== undefined) {
            setStreakData({
              current: fresh.currentStreak || 0,
              best: fresh.longestStreak || 0,
              dailySolved: fresh.dailySolved || 0,
              weeklySolved: fresh.weeklySolved || 0,
              monthlySolved: fresh.monthlySolved || 0,
            });
          }
        } catch (err) {
          console.error("[useSheetProgress] Failed to sync progress:", err);
        }
      }
    },
    [progress, user, streakData]
  );

  // ── Convenience getter ───────────────────────────────────────────────────
  const getStatus = useCallback(
    (problemId) => {
      const entry = progress[problemId];
      if (!entry) return "Not Started";
      return typeof entry === "string" ? entry : (entry.status || "Not Started");
    },
    [progress]
  );

  return { progress, getStatus, updateProgress, streakData, loading, error };
}

"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/features/user/UserContext";
import { toast } from "react-hot-toast";
import { persistence } from "@/lib/persistence";

import { supabase } from "@/lib/supabase";

async function apiFetch(url, options = {}) {
  let finalUrl = url;
  const headers = { "Content-Type": "application/json", ...options.headers };

  if (process.env.NEXT_PUBLIC_USE_SPRING_BOOT_API === "true") {
    const baseUrl = process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || "http://localhost:8080";
    finalUrl = baseUrl + url.replace("/api/bookmarks", "/api/v1/bookmarks");
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
  }

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });
  
  // Spring Boot POST/DELETE returns empty body
  if (response.status === 200 && response.headers.get("content-length") === "0") {
    return {};
  }
  
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {}

  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function useProblemBookmarks() {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const syncQueueRef = useRef([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      setLoading(true);

      let localBookmarks = [];
      try {
        const stored = await persistence.get("PROBLEM_BOOKMARKS");
        if (stored) {
          localBookmarks = stored;
          setBookmarks(localBookmarks);
        }
      } catch (e) {
        console.error("Failed to parse local bookmarks:", e);
      }

      if (user) {
        try {
          const data = await apiFetch("/api/bookmarks");
          const dbBookmarks = (data || []).map((row) => ({
            id: row.problem_id || row.problemId,
            topicSlug: row.topic_slug || row.topicSlug,
            createdAt: row.created_at || row.createdAt,
          }));

          // DB is authoritative for logged-in users.
          // Sync any local-only bookmarks (added offline) up to the server first.
          const dbIds = new Set(dbBookmarks.map((b) => b.id));
          const localOnly = localBookmarks.filter((b) => !dbIds.has(b.id));
          for (const b of localOnly) {
            try {
              await apiFetch("/api/bookmarks", {
                method: "POST",
                body: JSON.stringify({ problemId: b.id, topicSlug: b.topicSlug }),
              });
            } catch (_) {}
          }

          // Final state = DB items + any local-only items just synced up.
          // Items deleted in another browser (in local but not DB) are dropped.
          const authoritative = [...dbBookmarks, ...localOnly];
          setBookmarks(authoritative);
          persistence.set("PROBLEM_BOOKMARKS", authoritative);
        } catch (e) {
          console.error("Bookmark fetch failed:", e);
        }
      }
      setLoading(false);
    };

    loadBookmarks();
  }, [user]);

  const toggleBookmark = async (problemId, topicSlug) => {
    if (!problemId || !topicSlug) return;

    const isBookmarkedCurrently = bookmarks.some((b) => b.id === problemId);

    if (isBookmarkedCurrently) {
      const updated = bookmarks.filter((b) => b.id !== problemId);
      setBookmarks(updated);
      persistence.set("PROBLEM_BOOKMARKS", updated);

      if (user) {
        try {
          await apiFetch(`/api/bookmarks?problemId=${encodeURIComponent(problemId)}`, { method: "DELETE" });
          toast.success("Bookmark removed.");
        } catch (e) {
          console.error("Failed to delete bookmark:", e);
        }
      } else {
        toast.success("Bookmark removed (local).");
      }
    } else {
      const newBookmark = { id: problemId, topicSlug, createdAt: new Date().toISOString() };
      const updated = [...bookmarks, newBookmark];
      setBookmarks(updated);
      persistence.set("PROBLEM_BOOKMARKS", updated);

      if (user) {
        try {
          await apiFetch("/api/bookmarks", {
            method: "POST",
            body: JSON.stringify({ problemId, topicSlug }),
          });
          toast.success("Problem bookmarked successfully!");
        } catch (e) {
          console.error("Failed to save bookmark:", e);
          toast.error("Error syncing bookmark.");
        }
      } else {
        toast.custom((t) => (
          <div className="max-w-sm w-full bg-neutral-100 dark:bg-zinc-800 border border-[#a435f0] rounded-lg shadow-xl p-4 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Problem bookmarked! 🔖</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                You are in guest mode. Login/Signup to sync your bookmarks across all your devices.
              </span>
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <button
                onClick={() => { window.location.href = "/login"; toast.dismiss(t.id); }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#a435f0] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition duration-300 shadow-md"
              >
                Login/Signup
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-200 hover:bg-neutral-350 dark:hover:bg-neutral-700 dark:bg-neutral-800 text-black dark:text-white transition duration-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        ));
      }
    }
  };

  const isBookmarked = (problemId) => bookmarks.some((b) => b.id === problemId);

  return { bookmarks, loading, toggleBookmark, isBookmarked };
}

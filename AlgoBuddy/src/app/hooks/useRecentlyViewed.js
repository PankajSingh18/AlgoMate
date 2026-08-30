"use client";
import { useState, useEffect } from "react";
import { persistence } from "@/lib/persistence";

const MAX_RECENT = 6;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    persistence.get('RECENTLY_VIEWED').then((stored) => {
      if (stored) setRecentlyViewed(stored);
    });
  }, []);

  const addRecentlyViewed = (item) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => i.path !== item.path);
      const updated = [item, ...filtered].slice(0, MAX_RECENT);
      persistence.set('RECENTLY_VIEWED', updated);
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    persistence.remove('RECENTLY_VIEWED');
    setRecentlyViewed([]);
  };

  return { recentlyViewed, addRecentlyViewed, clearRecentlyViewed };
}
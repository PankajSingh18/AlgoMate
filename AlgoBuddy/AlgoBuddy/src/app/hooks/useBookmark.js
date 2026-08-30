"use client";
import { useState, useEffect } from "react";
import { persistence } from "@/lib/persistence";

export function useBookmark() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    persistence.get('BOOKMARKS').then((stored) => {
      if (stored) setBookmarks(stored);
    });
  }, []);

  const addBookmark = (item) => {
    setBookmarks((prev) => {
      if (prev.find((i) => i.path === item.path)) return prev;
      const updated = [...prev, item];
      persistence.set('BOOKMARKS', updated);
      return updated;
    });
  };

  const removeBookmark = (path) => {
    setBookmarks((prev) => {
      const updated = prev.filter((i) => i.path !== path);
      persistence.set('BOOKMARKS', updated);
      return updated;
    });
  };

  const isBookmarked = (path) =>
    bookmarks.some((i) => i.path === path);

  const clearBookmarks = () => {
    persistence.remove('BOOKMARKS');
    setBookmarks([]);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks };
}
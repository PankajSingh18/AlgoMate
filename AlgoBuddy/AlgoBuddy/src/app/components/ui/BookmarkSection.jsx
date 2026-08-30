"use client";
import { useBookmark } from "@/app/hooks/useBookmark";
import Link from "next/link";

export default function BookmarkSection() {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmark();

  if (bookmarks.length === 0) return null;

  return (
    <div className="mb-8 px-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">🔖 My Bookmarks</h2>
        <button
          onClick={clearBookmarks}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {bookmarks.map((item) => (
          <div key={item.path} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-[#1c1d1f]">
            <Link href={item.path} className="text-purple-700 dark:text-purple-300 text-sm font-medium hover:underline">
              {item.name}
            </Link>
            <button
              onClick={() => removeBookmark(item.path)}
              className="text-gray-400 hover:text-red-400 ml-1 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
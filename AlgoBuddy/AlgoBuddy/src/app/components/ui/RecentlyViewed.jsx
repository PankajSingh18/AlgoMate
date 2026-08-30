"use client";
import { useRecentlyViewed } from "@/app/hooks/useRecentlyViewed";
import Link from "next/link";

export default function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  if (recentlyViewed.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">🕓 Recently Viewed</h2>
        <button
          onClick={() => {
            if (confirm("Clear all recently viewed items?")) {
              clearRecentlyViewed();
            }
          }}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {recentlyViewed.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="px-4 py-2 rounded-lg border border-purple-300 
            text-purple-700 hover:bg-purple-50 text-sm font-medium"
          >
            {item.name}
            <span className="ml-2 text-xs text-gray-400">{item.category}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
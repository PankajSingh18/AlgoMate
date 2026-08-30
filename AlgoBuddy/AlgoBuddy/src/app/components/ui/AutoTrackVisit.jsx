"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRecentlyViewed } from "@/app/hooks/useRecentlyViewed";

export default function AutoTrackVisit({ title }) {
  const pathname = usePathname();
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    addRecentlyViewed({
      name: title,
      path: pathname,
      category: "Visualizer",
    });
  }, [title, pathname]);

  return null;
}
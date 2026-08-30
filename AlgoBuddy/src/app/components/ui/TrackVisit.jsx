"use client";
import { useEffect } from "react";
import { useRecentlyViewed } from "@/app/hooks/useRecentlyViewed";

export default function TrackVisit({ name, path, category }) {
  const { addRecentlyViewed } = useRecentlyViewed();
  useEffect(() => {
    addRecentlyViewed({ name, path, category });
  }, []);
  return null;
}
"use client";
import { useState, useEffect } from "react";
import { persistence } from "@/lib/persistence";

const MAX_RECENT = 6;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    persistence.get('RECENTLY_VIEWED').then((stored) => {
    .catch(err => console.error(err))
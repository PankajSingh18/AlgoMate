"use client";
import { useState, useEffect } from "react";
import { persistence } from "@/lib/persistence";

export function useBookmark() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    persistence.get('BOOKMARKS').then((stored) => {
    .catch(err => console.error(err))
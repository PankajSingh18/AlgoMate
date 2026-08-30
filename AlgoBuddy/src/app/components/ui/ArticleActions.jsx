"use client";
import { useState } from "react";
import { Copy, Share2, Check } from "lucide-react";

export default function ArticleActions() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed: ", err);
      }
    } else {
      handleCopy();
    }
  };
 
  return null;

}

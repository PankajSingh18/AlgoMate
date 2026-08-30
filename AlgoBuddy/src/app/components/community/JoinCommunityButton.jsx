"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiCheck } from "react-icons/fi";
import { useUser } from "@/features/user/UserContext";

const DISCORD_INVITE = "https://discord.gg/PqnazRxPc";

export default function JoinCommunityButton() {
  const { user } = useUser();
  const [joined, setJoined] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/community/join")
      .then((r) => r.json())
      .then((data) => {
        if (data?.joined_community) setJoined(true);
      })
      .catch(() => {});
  }, [user?.id]);

  const handleClick = async () => {
    if (user?.id && !joined) {
      try {
        await fetch("/api/community/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ joined: true }),
        });
        setJoined(true);
      } catch {}
    }
    window.open(DISCORD_INVITE, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
        joined ? "opacity-90" : ""
      }`}
      initial={mounted ? undefined : { scale: 1 }}
      animate={
        mounted && !joined
          ? {
              scale: [1, 1.02, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut",
              },
            }
          : { scale: 1 }
      }
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {joined ? <FiCheck className="w-4 h-4" /> : <FiUsers className="w-4 h-4" />}
      {joined ? "Community Joined" : "Join Community"}
    </motion.button>
  );
}

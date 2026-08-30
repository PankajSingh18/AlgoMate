"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiUsers, FiUserCheck } from "react-icons/fi";

const contributorsList = [
  { name: "Harsh Patel", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Neha Yadav", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Sarthak Jain", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Muskan Rathi", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Ayush Kumar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Kunal Verma", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Ishika Tiwari", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Ritik Sharma", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Simran Kaur", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Devansh Shah", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Aman Gupta", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Tanmay Joshi", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Riya Singh", avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "Mohit Rawat", avatar: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&w=128&h=128&q=80" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function ContributorsSection() {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-purple-600 dark:text-purple-400">
          <FiUsers className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">Contributors</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Awesome developers who contribute to AlgoBuddy
          </p>
        </div>
      </div>

      {/* Grid of Contributors */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 justify-items-center"
      >
        {contributorsList.map((c) => (
          <motion.div
            key={c.name}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-2"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-neutral-700 bg-slate-50 dark:bg-neutral-800 mb-2">
              <Image
                src={c.avatar}
                alt={`${c.name}'s avatar`}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[11px] font-bold text-slate-850 dark:text-white leading-tight text-center">
              {c.name}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
              Contributor
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <div className="mt-8 text-center">
        <button className="inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-900/50 text-purple-600 dark:text-purple-400 font-semibold px-5 py-2.5 rounded-xl text-xs hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200">
          <FiUserCheck className="w-4 h-4" />
          View All Contributors
        </button>
      </div>
    </div>
  );
}

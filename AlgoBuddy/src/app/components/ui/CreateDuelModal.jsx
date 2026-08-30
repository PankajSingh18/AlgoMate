"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Link2, Play } from "lucide-react";

export default function CreateDuelModal({ isOpen, onClose, onCreateMatch }) {
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Easy");
  const [lobbyCode, setLobbyCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://algobuddy.me/arena/duel/${lobbyCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleStart = () => {
    onCreateMatch({
      lobbyCode,
      topic,
      difficulty,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-neutral-800/80 mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-200">
              Create Friend Duel
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Topic Select */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                DSA Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800/80 text-slate-800 dark:text-neutral-250 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition duration-150"
              >
                <option value="Arrays">Arrays &amp; Strings</option>
                <option value="Sorting">Sorting Algorithms</option>
                <option value="Linked Lists">Linked Lists</option>
                <option value="Trees">Trees &amp; BSTs</option>
                <option value="Graphs">Graphs (BFS/DFS)</option>
                <option value="DP">Dynamic Programming</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                Difficulty
              </label>
              <div className="flex gap-2">
                {["Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition duration-150 ${
                      difficulty === diff
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-neutral-950 dark:border-neutral-800/80 dark:text-neutral-400 dark:hover:bg-neutral-900"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Lobby Link */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                Invite Link
              </label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800/80 rounded-xl px-3 py-2.5">
                <Link2 size={16} className="text-slate-400 shrink-0" />
                <span className="flex-1 text-xs font-mono text-slate-650 dark:text-neutral-400 truncate">
                  https://algobuddy.me/arena/duel/{lobbyCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded-lg text-slate-550 dark:text-neutral-400 transition"
                  title="Copy link"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full mt-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-primary/20"
          >
            <Play size={16} />
            <span>Launch Lobby</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

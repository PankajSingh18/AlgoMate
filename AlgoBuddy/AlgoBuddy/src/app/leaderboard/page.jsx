"use client";
import { useState, useEffect } from "react";
import { FiAward, FiTarget, FiTrendingUp } from "react-icons/fi";
import Footer from "@/app/components/footer";

// Mock data to render gracefully while API isn't fully active on frontend
const MOCK_LEADERBOARDS = {
  streak: [
    { rank: 1, username: "Alex Dev", score: 42, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { rank: 2, username: "CodeNinja", score: 38, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja" },
    { rank: 3, username: "Sarah Script", score: 35, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { rank: 4, username: "ByteMaster", score: 29, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Byte" },
    { rank: 5, username: "AlgoKing", score: 21, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Algo" },
  ],
  arena: [
    { rank: 1, username: "Grandmaster", score: 2450, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=GM" },
    { rank: 2, username: "Alex Dev", score: 2100, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { rank: 3, username: "CodeNinja", score: 1950, avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja" },
  ]
};

export default function LeaderboardPage() {
  const [metric, setMetric] = useState("streak"); // 'streak' or 'arena'
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      // In a real app we'd fetch from /api/v1/leaderboard/global/${metric}
      setData(MOCK_LEADERBOARDS[metric]);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [metric]);

  return (
    <>
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-10 pb-20 text-surface-900 dark:text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          <header className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">Leaderboards</h1>
            <p className="text-surface-500 dark:text-surface-400 text-lg">Compare your progress, streaks, and ELO against the world.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Metrics */}
            <div className="flex bg-surface-200 dark:bg-surface-800 p-1 rounded-xl w-full md:w-auto mx-auto md:mx-0">
              <button 
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${metric === "streak" ? "bg-white dark:bg-surface-950 shadow text-orange-500" : "text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"}`}
                onClick={() => setMetric("streak")}
              >
                <FiTrendingUp className="w-4 h-4" /> Streaks
              </button>
              <button 
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${metric === "arena" ? "bg-white dark:bg-surface-950 shadow text-purple-500" : "text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"}`}
                onClick={() => setMetric("arena")}
              >
                <FiTarget className="w-4 h-4" /> Arena ELO
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[60px_1fr_100px] items-center p-4 border-b border-surface-100 dark:border-surface-800 text-sm font-bold text-surface-500 dark:text-surface-400 bg-surface-50 dark:bg-surface-950">
              <div className="text-center">Rank</div>
              <div>User</div>
              <div className="text-right">{metric === "streak" ? "Streak Days" : "Rating"}</div>
            </div>

            {/* List */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : data.length > 0 ? (
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {data.map((entry, idx) => (
                  <div key={idx} className="grid grid-cols-[60px_1fr_100px] items-center p-4 hover:bg-surface-50 dark:hover:bg-surface-950/50 transition-colors">
                    <div className="flex justify-center">
                      {entry.rank === 1 ? <FiAward className="w-6 h-6 text-yellow-500" /> :
                       entry.rank === 2 ? <FiAward className="w-6 h-6 text-gray-400" /> :
                       entry.rank === 3 ? <FiAward className="w-6 h-6 text-amber-700" /> :
                       <span className="font-bold text-surface-500">{entry.rank}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={entry.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full bg-surface-200" />
                      <span className="font-bold text-base">{entry.username}</span>
                    </div>
                    <div className="text-right font-black text-lg font-mono">
                      {entry.score}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-surface-500">
                No data available for this category yet.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

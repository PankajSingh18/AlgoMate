"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { FiChevronLeft, FiExternalLink, FiVideo, FiBookOpen, FiBookmark } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Footer from "@/app/components/footer";
import TheoryDrawer from "@/app/components/practice/TheoryDrawer";
import CompanyLogos from "@/app/components/practice/CompanyLogos";
import { practiceData } from "@/lib/practiceData";
import { useProblemBookmarks } from "@/app/hooks/useProblemBookmarks";
import { useSheetProgress } from "@/app/hooks/useSheetProgress";
import { useUser } from "@/features/user/UserContext";

export default function TopicPracticeSheet() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const topicSlug = params?.topic;

  const { progress, updateProgress } = useSheetProgress();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const ensureLoggedIn = () => {
    if (!user) {
      toast.error("Please login to use this feature!");
      router.push("/login");
      return false;
    }
    return true;
  };

  const { isBookmarked, toggleBookmark } = useProblemBookmarks();

  // Retrieve topic definition matching param slug
  const topic = useMemo(() => {
    return practiceData.find((t) => t.slug === topicSlug);
  }, [topicSlug]);

  // Specific topic theme mappings
  const TOPIC_THEME = useMemo(() => ({
    array: { color: "#a435f0", bg: "from-purple-50/50 via-white to-purple-50/10", darkBg: "dark:from-purple-950/10 dark:to-[#1c1d1f]", badge: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300" },
    "linked-list": { color: "#d97706", bg: "from-amber-50/50 via-white to-amber-50/10", darkBg: "dark:from-amber-950/10 dark:to-[#1c1d1f]", badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300" },
    "stack-queue": { color: "#2563eb", bg: "from-blue-50/50 via-white to-blue-50/10", darkBg: "dark:from-blue-950/10 dark:to-[#1c1d1f]", badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" },
    recursion: { color: "#0f766e", bg: "from-teal-50/50 via-white to-teal-50/10", darkBg: "dark:from-teal-950/10 dark:to-[#1c1d1f]", badge: "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300" },
    tree: { color: "#7c3aed", bg: "from-violet-50/50 via-white to-violet-50/10", darkBg: "dark:from-violet-950/10 dark:to-[#1c1d1f]", badge: "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300" },
    graph: { color: "#dc2626", bg: "from-red-50/50 via-white to-red-50/10", darkBg: "dark:from-red-950/10 dark:to-[#1c1d1f]", badge: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300" },
    dp: { color: "#db2777", bg: "from-pink-50/50 via-white to-pink-50/10", darkBg: "dark:from-pink-950/10 dark:to-[#1c1d1f]", badge: "bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300" },
  }), []);

  const t = useMemo(() => {
    return TOPIC_THEME[topicSlug] || TOPIC_THEME.array;
  }, [topicSlug, TOPIC_THEME]);

  // Compute specific topic completion stats
  const tStats = useMemo(() => {
    if (!topic) return { total: 0, solved: 0, pct: 0, easy: { total: 0, solved: 0 }, medium: { total: 0, solved: 0 }, hard: { total: 0, solved: 0 } };
    let total = 0;
    let solved = 0;
    let easy = 0, easySolved = 0;
    let medium = 0, mediumSolved = 0;
    let hard = 0, hardSolved = 0;

    topic.subsections.forEach((sub) => {
      sub.items.forEach((item) => {
        total++;
        // progress entries from useSheetProgress are { status, updatedAt } objects
        const entry = progress[item.id];
        const statusStr = entry
          ? (typeof entry === "object" ? entry.status : entry)
          : "Not Started";
        if (statusStr === "Completed") {
          solved++;
        }
        if (item.difficulty === "Easy") {
          easy++;
          if (statusStr === "Completed") easySolved++;
        } else if (item.difficulty === "Medium") {
          medium++;
          if (statusStr === "Completed") mediumSolved++;
        } else if (item.difficulty === "Hard") {
          hard++;
          if (statusStr === "Completed") hardSolved++;
        }
      });
    });

    return {
      total,
      solved,
      pct: total > 0 ? Math.round((solved / total) * 100) : 0,
      easy: { total: easy, solved: easySolved },
      medium: { total: medium, solved: mediumSolved },
      hard: { total: hard, solved: hardSolved },
    };
  }, [topic, progress]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#1c1d1f]">
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-3xl font-black mb-4">Topic Not Found</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">The requested roadmap category does not exist.</p>
          <Link href="/practice" className="px-6 py-3 rounded-full bg-primary text-white font-bold">
            Return to Practice Sheet
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleStatusChange = async (problemId, newStatus) => {
    if (!ensureLoggedIn()) return;
    await updateProgress(problemId, newStatus);
    if (newStatus === "Completed") {
      toast.success("Problem marked as Completed! 🔥", {
        style: { background: "#22c55e", color: "#fff", fontWeight: "bold" },
      });
    } else {
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-surface-900 dark:text-white transition-colors duration-300">

      <main className="max-w-[1100px] mx-auto px-5 py-12">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition"
          >
            <FiChevronLeft size={16} /> Back to Practice Sheet
          </Link>
        </div>

        {/* Topic Header Card */}
        <div className={`p-6 sm:p-8 rounded-3xl border border-surface-200 dark:border-neutral-800 bg-gradient-to-br ${t.bg} ${t.darkBg} shadow-sm mb-10`}>
          <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1.2fr] gap-6 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full ${t.badge}`}>
                  Mastery Roadmap
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-3">{topic.title}</h1>
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed max-w-2xl font-poppins">
                {topic.desc}
              </p>
            </div>

            {/* Completion metrics for the specific topic */}
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-neutral-900/60 border border-surface-200/50 dark:border-neutral-800 backdrop-blur-sm flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-surface-400 dark:text-surface-300 mb-1.5 uppercase tracking-wider">
                  <span>Topic Completion</span>
                  <span>{mounted ? `${tStats.pct}%` : "0%"}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: mounted ? `${tStats.pct}%` : "0%",
                      background: t.color
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-surface-600 dark:text-surface-300 pt-2 border-t border-dashed">
                <span>Solved: <strong className="text-surface-900 dark:text-white">{mounted ? tStats.solved : 0}</strong> / {tStats.total}</span>
                <div className="flex gap-1.5">
                  {tStats.easy.total > 0 && (
                    <span className="px-2 py-0.5 rounded bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-[10px] font-bold">
                      E: {tStats.easy.solved}/{tStats.easy.total}
                    </span>
                  )}
                  {tStats.medium.total > 0 && (
                    <span className="px-2 py-0.5 rounded bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-450 text-[10px] font-bold">
                      M: {tStats.medium.solved}/{tStats.medium.total}
                    </span>
                  )}
                  {tStats.hard.total > 0 && (
                    <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-450 text-[10px] font-bold">
                      H: {tStats.hard.solved}/{tStats.hard.total}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subsection roadmaps and problem tables */}
        <div className="space-y-12">
          {topic.subsections.map((sub, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <div className="flex items-center gap-3.5 mb-2">
                <h2 className="text-xl sm:text-2xl font-black text-surface-900 dark:text-white pl-3.5 border-l-4" style={{ borderColor: t.color }}>
                  {sub.title}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sub.title === "Beginner" ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" :
                    sub.title === "Intermediate" ? "bg-yellow-100 text-yellow-750 dark:bg-yellow-950/30 dark:text-yellow-400" :
                      "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300"
                  }`}>
                  Tier {sub.title === "Beginner" ? "1" : sub.title === "Intermediate" ? "2" : "3"}
                </span>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto bg-white dark:bg-[#2d2f31] border border-surface-200 dark:border-neutral-800 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-surface-50/60 dark:bg-neutral-800/60 text-[10px] font-extrabold uppercase tracking-wider text-surface-500 border-b border-surface-200 dark:border-neutral-800">
                      <th className="py-4 px-6">Problem</th>
                      <th className="py-4 px-6 text-center">Theory</th>
                      <th className="py-4 px-6 text-center">Visualizer</th>
                      <th className="py-4 px-6 text-center">Practice</th>
                      <th className="py-4 px-6 text-center">Difficulty</th>
                      <th className="py-4 px-6 text-center">Companies</th>
                      <th className="py-4 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.items.map((item) => {
                      const entry = progress[item.id];
                      const status = entry
                        ? (typeof entry === "object" ? entry.status : entry)
                        : "Not Started";
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-surface-100 dark:border-neutral-800 hover:bg-surface-50/50 dark:hover:bg-neutral-800/40 transition-colors"
                        >
                          {/* Name */}
                          <td className="py-4 px-6 font-bold text-sm text-surface-900 dark:text-white">
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => {
                                  if (!ensureLoggedIn()) return;
                                  toggleBookmark(item.id, topicSlug);
                                }}
                                className={`p-1.5 rounded-lg border transition hover:scale-105 active:scale-95 duration-200 ${
                                  mounted && isBookmarked(item.id)
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500 dark:bg-amber-950/20"
                                    : "bg-surface-50/20 border-surface-200/50 text-surface-400 hover:text-surface-600 dark:border-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300"
                                }`}
                                title={mounted && isBookmarked(item.id) ? "Unbookmark problem" : "Bookmark problem"}
                              >
                                <FiBookmark size={14} className={mounted && isBookmarked(item.id) ? "fill-amber-500 text-amber-500" : ""} />
                              </button>
                              <span>{item.name}</span>
                            </div>
                          </td>

                          {/* Theory Link */}
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => {
                                setSelectedProblem(item);
                                setIsDrawerOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                              style={{
                                color: t.color,
                                background: `${t.color}0c`,
                                borderColor: `${t.color}25`
                              }}
                            >
                              <FiBookOpen size={13} style={{ stroke: t.color }} />
                              View Theory
                            </button>
                          </td>

                          {/* Visualizer Link */}
                          <td className="py-4 px-6 text-center">
                            {item.visualizerUrl ? (
                              <Link
                                href={item.visualizerUrl}
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                                style={{
                                  color: t.color,
                                  background: `${t.color}0c`,
                                  borderColor: `${t.color}25`
                                }}
                              >
                                <FiVideo size={13} style={{ stroke: t.color }} />
                                Visualizer
                              </Link>
                            ) : (
                              <span className="text-xs text-surface-300 dark:text-neutral-700 font-semibold">N/A</span>
                            )}
                          </td>

                          {/* Practice Link */}
                          <td className="py-4 px-6 text-center">
                            <a
                              href={item.practiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-surface-600 dark:text-surface-300 hover:text-[#ffa116] hover:scale-105 transition-all duration-250"
                            >
                              LeetCode <FiExternalLink size={12} className="opacity-75" />
                            </a>
                          </td>

                          {/* Difficulty */}
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${item.difficulty === "Easy"
                                ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                : item.difficulty === "Medium"
                                  ? "bg-yellow-50 text-yellow-750 dark:bg-yellow-950/30 dark:text-yellow-400"
                                  : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                              }`}>
                              {item.difficulty}
                            </span>
                          </td>

                          {/* Companies */}
                          <td className="py-4 px-6 text-center">
                            <CompanyLogos companies={item.companies} />
                          </td>

                          {/* Progress Status Dropdown */}
                          <td className="py-4 px-6 text-center">
                            <select
                              value={mounted ? status : "Not Started"}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                              style={{
                                background: status === "Completed" ? t.color : status === "In Progress" ? `${t.color}0f` : "transparent",
                                borderColor: status === "Completed" ? t.color : status === "In Progress" ? `${t.color}35` : undefined,
                                color: status === "Completed" ? "#fff" : status === "In Progress" ? t.color : undefined
                              }}
                            >
                              <option value="Not Started" className="text-surface-900 bg-white dark:bg-[#1c1d1f]">Not Started</option>
                              <option value="In Progress" className="text-surface-900 bg-white dark:bg-[#1c1d1f]">In Progress</option>
                              <option value="Completed" className="text-surface-900 bg-white dark:bg-[#1c1d1f]">Completed</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {/* Slide-out Theory Drawer */}
      <TheoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        problem={selectedProblem}
        topicSlug={topicSlug}
      />
    </div>
  );
}

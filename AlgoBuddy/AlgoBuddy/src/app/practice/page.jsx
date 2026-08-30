"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  Search, 
  ChevronDown, 
  Shuffle, 
  Bookmark, 
  CheckCircle2, 
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Play,
  ScrollText,
  History
} from "lucide-react";

import PracticeSidebar from "@/app/components/practice/PracticeSidebar";
import PracticeRightSidebar from "@/app/components/practice/PracticeRightSidebar";
import PracticeSessionBanner from "@/app/components/practice/PracticeSessionBanner";
import PracticeDashboard from "@/app/components/practice/PracticeDashboard";
import PracticeNotebook from "@/app/components/practice/PracticeNotebook";
import CompanyLogos from "@/app/components/practice/CompanyLogos";
import TheoryDrawer from "@/app/components/practice/TheoryDrawer";
import Footer from "@/app/components/footer";

import { practiceData } from "@/lib/practiceData";
import { useUser } from "@/features/user/UserContext";
import { useProblemBookmarks } from "@/app/hooks/useProblemBookmarks";
import { useSheetProgress } from "@/app/hooks/useSheetProgress";
import { useMySheet } from "@/app/hooks/useMySheet";
import { supabase } from "@/lib/supabase";

function isSpringBootApi() {
  return typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_SPRING_BOOT_API === "true";
}

function springBootApiBase() {
  return process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || "http://localhost:8080";
}

export default function PracticePage() {
  const { user,loading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Views: 'dashboard', 'problem-list', 'topic-wise', 'company-wise', 'bookmarks', 'recent-solved'
  const [activeView, setActiveView] = useState("problem-list");
  const [activeTab, setActiveTab] = useState("problems"); // 'problems', 'description', 'resources', 'discussion'
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected problem for Theory Drawer
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Accordion Topic-wise state
  const [expandedTopics, setExpandedTopics] = useState({});

  // Topic-wise view state
  const [selectedTopicWise, setSelectedTopicWise] = useState(practiceData[0]?.title || "Arrays");
  const [isTopicLoading, setIsTopicLoading] = useState(false);

  // Unified progress hook (replaces all inline progress/streak logic)
  const { progress, getStatus, updateProgress, streakData, loading: progressLoading, error: progressError } = useSheetProgress();
  const currentStreak = streakData.current;
  const longestStreak = streakData.best;

  // My Sheet hook
  const { sheet, isInSheet, addToSheet, removeFromSheet, sheetCount } = useMySheet();

  // Bookmarks hook
  const { bookmarks, isBookmarked, toggleBookmark } = useProblemBookmarks();
  const [mounted, setMounted] = useState(false);

  // Mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync activeView and topic with the URL ?view= and ?topic= params so browser Back/Forward works
  useEffect(() => {
    const view = searchParams.get("view") || "problem-list";
    setActiveView(view);
    
    if (view === "topic-wise") {
      const topic = searchParams.get("topic");
      if (topic) {
        setSelectedTopicWise(topic);
      } else {
        setSelectedTopicWise(practiceData[0]?.title || "Arrays");
      }
    }
  }, [searchParams]);

  const ensureLoggedIn = () => {
    if (loading) return false; 
    if (!user) {
      toast.error("Please login to use this feature!");
      router.push("/login");
      return false;
    }
    return true;
  };

  // Dynamically flatten all problems from practiceData (Zero Hardcoding!)
  const allProblems = useMemo(() => {
    const list = [];
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          list.push({
            ...item,
            topic: topic.title,
            topicSlug: topic.slug,
            time: item.difficulty === "Easy" ? "20m" : item.difficulty === "Medium" ? "30m" : "45m"
          });
        });
      });
    });
    return list;
  }, []);

  const nextProblem = useMemo(() => {
    return allProblems.find((p) => getStatus(p.id) !== "Completed") || null;
  }, [allProblems, getStatus]);

  // Compute Session Stats Dynamically from current loaded practiceData
  const stats = useMemo(() => {
    let solved = 0;
    let attempted = 0;
    let easyTotal = 0;
    let mediumTotal = 0;
    let hardTotal = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    const uniqueCompanies = new Set();

    allProblems.forEach((prob) => {
      const status = getStatus(prob.id);
      if (status === "Completed") {
        solved++;
        if (prob.difficulty === "Easy") easySolved++;
        else if (prob.difficulty === "Medium") mediumSolved++;
        else if (prob.difficulty === "Hard") hardSolved++;
      } else if (status === "In Progress") {
        attempted++;
      }

      if (prob.difficulty === "Easy") easyTotal++;
      else if (prob.difficulty === "Medium") mediumTotal++;
      else if (prob.difficulty === "Hard") hardTotal++;

      if (prob.companies) {
        prob.companies.forEach((c) => uniqueCompanies.add(c.toLowerCase()));
      }
    });

    const remaining = allProblems.length - solved - attempted;

    const totalMinutes = allProblems.reduce((acc, p) => {
      if (p.difficulty === "Easy") return acc + 20;
      if (p.difficulty === "Medium") return acc + 30;
      return acc + 45;
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const estimatedTime = `${hours}h ${minutes}m`;

    return {
      solved,
      // Prefer server-computed time-window stats; fall back to 0
      dailySolved: streakData.dailySolved || 0,
      weeklySolved: streakData.weeklySolved || 0,
      monthlySolved: streakData.monthlySolved || 0,
      attempted,
      remaining,
      total: allProblems.length,
      estimatedTime,
      easyTotal,
      mediumTotal,
      hardTotal,
      easySolved,
      mediumSolved,
      hardSolved,
      companiesCount: uniqueCompanies.size
    };
  }, [allProblems, progress, getStatus, streakData]);

  // Compute dynamic list of company badges and problem counts for the company-wise view
  const companiesList = useMemo(() => {
    const counts = {};
    allProblems.forEach((prob) => {
      if (prob.companies) {
        prob.companies.forEach((c) => {
          const name = c.charAt(0).toUpperCase() + c.slice(1);
          counts[name] = (counts[name] || 0) + 1;
        });
      }

    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [allProblems]);

  // Handle status circle toggle (Not Started -> In Progress -> Completed -> Not Started)
  const handleStatusToggle = async (problemId, currentStatus) => {
    if (!ensureLoggedIn()) return;
    let nextStatus = "Not Started";
    if (currentStatus === "Not Started" || !currentStatus) {
      nextStatus = "In Progress";
    } else if (currentStatus === "In Progress") {
      nextStatus = "Completed";
    }

    // Delegate to the unified hook (handles local + server sync + streak)
    await updateProgress(problemId, nextStatus);

    if (nextStatus === "Completed") {
      toast.success("Problem completed! Keep it up! 🏆");
    } else if (nextStatus === "In Progress") {
      toast.success("Problem marked as Attempted. ⏳");
    } else {
      toast.success("Problem status reset.");
    }
  };

  // Compute Activity Feed dynamically from progress updates
  const activityData = useMemo(() => {
    const activities = [];
    Object.entries(progress).forEach(([problemId, entry]) => {
      if (!entry || typeof entry !== "object") return;
      const { status, updatedAt } = entry;
      if (status === "Not Started") return;

      const prob = allProblems.find((p) => p.id === problemId);
      if (!prob) return;

      activities.push({
        problemId,
        title: status === "Completed" ? `Solved ${prob.name}` : `Attempted ${prob.name}`,
        status,
        updatedAt: new Date(updatedAt),
        statusColor: status === "Completed" ? "bg-emerald-500" : "bg-amber-500"
      });
    });

    // Sort by updatedAt descending
    activities.sort((a, b) => b.updatedAt - a.updatedAt);

    // Take top 10
    const topActivities = activities.slice(0, 10);

    const now = new Date();
    return topActivities.map((act) => {
      const diffMs = now - act.updatedAt;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);

      let timeStr = "Just now";
      if (diffMins > 0) {
        if (diffMins < 60) {
          timeStr = `${diffMins}m ago`;
        } else if (diffHrs < 24) {
          timeStr = `${diffHrs}h ago`;
        } else {
          timeStr = `${diffDays}d ago`;
        }
      }

      return {
        title: act.title,
        time: timeStr,
        statusColor: act.statusColor
      };
    });
  }, [progress, allProblems]);

  // Extract unique topics from dynamic list
  const uniqueTopics = useMemo(() => {
    const set = new Set(allProblems.map((p) => p.topic));
    return ["All Topics", ...Array.from(set)];
  }, [allProblems]);

  // Filtered problems list (mockup table/flat table)
  const filteredProblems = useMemo(() => {
    let filtered = allProblems.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = selectedTopic === "All Topics" || p.topic === selectedTopic;
      
      const matchesCompany = selectedCompanyFilter === "All" || 
                             (p.companies && p.companies.some(c => c.toLowerCase() === selectedCompanyFilter.toLowerCase()));

      if (activeView === "bookmarks") {
        return matchesSearch && matchesTopic && matchesCompany && isBookmarked(p.id);
      }
      if (activeView === "recent-solved") {
        return matchesSearch && matchesTopic && matchesCompany && getStatus(p.id) === "Completed";
      }
      return matchesSearch && matchesTopic && matchesCompany;
    });

    if (activeView === "recent-solved") {
      filtered.sort((a, b) => {
        const timeA = progress[a.id]?.updatedAt ? new Date(progress[a.id].updatedAt).getTime() : 0;
        const timeB = progress[b.id]?.updatedAt ? new Date(progress[b.id].updatedAt).getTime() : 0;
        return timeB - timeA;
      });
    } else if (activeView === "bookmarks") {
      filtered.sort((a, b) => {
        const bA = bookmarks.find(x => x.id === a.id);
        const bB = bookmarks.find(x => x.id === b.id);
        const timeA = bA?.createdAt ? new Date(bA.createdAt).getTime() : 0;
        const timeB = bB?.createdAt ? new Date(bB.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    return filtered;
  }, [allProblems, searchQuery, selectedTopic, selectedCompanyFilter, activeView, bookmarks, progress, getStatus, isBookmarked]);

  // Paginated problems
  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProblems, currentPage]);

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const handleShareSheet = async () => {
    if (!ensureLoggedIn()) return;
    if (sheetCount === 0) {
      toast.error("Add problems to your sheet before sharing!");
      return;
    }

    try {
      if (isSpringBootApi()) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          toast.error("Session expired. Please log in again.");
          return;
        }
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const results = await Promise.all(
          Object.keys(sheet).map((problemId) =>
            fetch(
              `${springBootApiBase()}/api/v1/mysheet/${encodeURIComponent(problemId)}/visibility`,
              {
                method: "PATCH",
                headers,
                body: JSON.stringify({ isPublic: true }),
              }
            )
          )
        );
        if (results.some((res) => !res.ok)) {
          throw new Error("Failed to publish sheet");
        }
      } else {
        const res = await fetch("/api/mysheet/share", { method: "POST" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to publish sheet");
        }
      }

      const shareUrl = `${window.location.origin}/practice/shared/${user.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Sheet published and link copied! 📋");
    } catch (err) {
      console.error("Share sheet error:", err);
      toast.error(err.message || "Failed to share sheet. Please try again.");
    }
  };

  // Solve random unsolved problem
  const handleSolveRandom = () => {
    if (!ensureLoggedIn()) return;
    const unsolved = allProblems.filter((p) => getStatus(p.id) !== "Completed");
    if (unsolved.length === 0) {
      toast.error("Wow, you've completed all problems! 🎉");
      return;
    }
    const randomProb = unsolved[Math.floor(Math.random() * unsolved.length)];
    toast.success(`Here is your random challenge: ${randomProb.name}`);
    window.open(randomProb.practiceUrl, "_blank");
  };

  // Accordion toggles for dynamic topic-wise view
  const toggleAccordion = (slug) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // Get current user display name
  const userName = useMemo(() => {
    if (!user) return "Guest User";
    return user.user_metadata?.name || user.email?.split("@")[0] || "Guest User";
  }, [user]);

  const dailyChallenge = useMemo(() => {
    if (allProblems.length === 0) return null;
    const daySeed = Math.floor(new Date().setHours(0,0,0,0) / 86400000);
    return allProblems[daySeed % allProblems.length];
  }, [allProblems]);

  // Seed values if not loaded
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 transition-colors duration-300">
      
      {/* Container holding three-column layout */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-y-8 lg:gap-0">
        
        {/* Left Sidebar */}
        <PracticeSidebar 
          activeView={activeView}
          onViewChange={(view) => {
            if (["my-sheet", "bookmarks", "recent-solved"].includes(view)) {
              if (!ensureLoggedIn()) return;
            }
            setCurrentPage(1); // Reset page on view change
            setSelectedCompanyFilter("All"); // Reset company filter
            // Push to URL so the browser records a history entry;
            // the searchParams useEffect above will sync activeView in response.
            if (view === "topic-wise") {
              router.push(`/practice?view=${view}&topic=${encodeURIComponent(selectedTopicWise)}`);
            } else {
              router.push(`/practice?view=${view}`);
            }
          }}
          solvedCount={stats.solved}
          dailySolved={stats.dailySolved}
          weeklySolved={stats.weeklySolved}
          monthlySolved={stats.monthlySolved}
          dailyGoal={3}
          weeklyGoal={10}
          monthlyGoal={50}
          streakDays={currentStreak}
          bestStreak={longestStreak}
          mySheetCount={sheetCount}
          onBackToPractice={() => router.push("/")}
          onBackToSessions={() => setActiveView("problem-list")}
        />

        {/* Center Content */}
        <div className="flex-1 min-w-0 space-y-6 lg:ml-8">
          
          {/* Main dashboard rendering based on activeView */}
          {activeView === "dashboard" ? (
            <PracticeDashboard
              dailyChallenge={dailyChallenge}
              solvedCount={stats.solved}
              dailySolved={stats.dailySolved}
              weeklySolved={stats.weeklySolved}
              monthlySolved={stats.monthlySolved}
              dailyGoal={3}
              weeklyGoal={10}
              monthlyGoal={50}
              streakDays={currentStreak}
              bestStreak={longestStreak}
              solved={stats.solved}
              attempted={stats.attempted}
              remaining={stats.remaining}
              total={stats.total}
              estimatedTime={stats.estimatedTime}
              easyCount={stats.easySolved}
              mediumCount={stats.mediumSolved}
              hardCount={stats.hardSolved}
              totalEasy={stats.easyTotal}
              totalMed={stats.mediumTotal}
              totalHard={stats.hardTotal}
              companiesCount={stats.companiesCount}
              activityData={activityData}
            />
          ) : activeView === "my-sheet" ? (
            /* ── MY SHEET VIEW ─────────────────────────────────────── */
            <section className="space-y-5">
              {/* Header */}
              <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-purple-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <ScrollText size={16} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-purple-200">Personal Practice List</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black">My Sheet</h2>
                      {user && (
                        <button
                          onClick={handleShareSheet}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/10"
                          title="Share your sheet with others"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                          <span>Share</span>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-purple-200 mt-1">
                      {sheetCount > 0
                        ? `${sheetCount} problem${sheetCount !== 1 ? 's' : ''} curated · ${Object.values(sheet).filter((_,i) => getStatus(Object.keys(sheet)[i]) === 'Completed').length} solved`
                        : 'Add problems from the Problem List using the ＋ button'}
                    </p>
                  </div>
                  {sheetCount > 0 && (
                    <div className="flex gap-3">
                      {['Easy','Medium','Hard'].map(diff => {
                        const c = Object.keys(sheet).filter(id => {
                          const p = allProblems.find(x => x.id === id);
                          return p?.difficulty === diff;
                        }).length;
                        return c > 0 ? (
                          <div key={diff} className="text-center bg-white/15 rounded-2xl px-4 py-2">
                            <div className="text-lg font-black">{c}</div>
                            <div className={`text-[10px] font-black uppercase ${
                              diff === 'Easy' ? 'text-emerald-300' : diff === 'Medium' ? 'text-amber-300' : 'text-red-300'
                            }`}>{diff}</div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              {sheetCount === 0 ? (
                /* Empty state */
                <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                    <ScrollText size={28} className="text-purple-500" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-2">Your sheet is empty</h3>
                  <p className="text-sm text-slate-400 dark:text-neutral-500 max-w-sm mx-auto mb-5">
                    Go to the Problem List and click the <strong>＋</strong> button on any problem to add it to your personal sheet.
                  </p>
                  <button
                    onClick={() => setActiveView('problem-list')}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold transition hover:bg-primary-dark"
                  >
                    Browse Problems →
                  </button>
                </div>
              ) : (
                /* Sheet table */
                <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50/40 dark:bg-neutral-900/10 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800">
                          <th className="py-4 px-5 w-10 text-center">#</th>
                          <th className="py-4 px-5">Problem</th>
                          <th className="py-4 px-5">Topic</th>
                          <th className="py-4 px-5 text-center">Level</th>
                          <th className="py-4 px-5 text-center">Company</th>
                          <th className="py-4 px-5 text-center">Status</th>
                          <th className="py-4 px-5 text-center">Actions</th>
                          <th className="py-4 px-5 text-center">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(sheet).map((problemId, idx) => {
                          const prob = allProblems.find(p => p.id === problemId);
                          if (!prob) return null;
                          const status = getStatus(prob.id);
                          return (
                            <tr key={prob.id} className="border-b border-slate-50 dark:border-neutral-800/80 hover:bg-slate-50/20 dark:hover:bg-neutral-800/10 transition last:border-0">
                              <td className="py-4 px-5 text-center font-bold text-xs text-slate-400">{idx + 1}</td>
                              <td className="py-4 px-5">
                                <div className="font-bold text-xs text-slate-800 dark:text-white">{prob.name}</div>
                              </td>
                              <td className="py-4 px-5 text-xs font-bold text-slate-500 dark:text-neutral-400">{prob.topic}</td>
                              <td className="py-4 px-5 text-center">
                                <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full ${
                                  prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                }`}>{prob.difficulty}</span>
                              </td>
                              <td className="py-4 px-5 text-center">
                                <div className="flex justify-center"><CompanyLogos companies={prob.companies} /></div>
                              </td>
                              <td className="py-4 px-5 text-center">
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => handleStatusToggle(prob.id, status)}
                                    className="focus:outline-none"
                                    title={`Status: ${status}`}
                                  >
                                    {status === 'Completed' ? (
                                      <div className="w-5 h-5 rounded-full border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white">
                                        <CheckCircle2 size={12} className="stroke-[3]" />
                                      </div>
                                    ) : status === 'In Progress' ? (
                                      <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-neutral-700 hover:border-primary transition" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => { setSelectedProblem(prob); setIsDrawerOpen(true); }}
                                    className="text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
                                  >
                                    Theory
                                  </button>
                                  <a
                                    href={prob.practiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold px-2 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                                  >
                                    Solve
                                  </a>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-center">
                                <button
                                  onClick={() => {
                                    if (!ensureLoggedIn()) return;
                                    removeFromSheet(prob.id);
                                    toast.success('Removed from My Sheet');
                                  }}
                                  className="text-slate-300 dark:text-neutral-700 hover:text-red-500 dark:hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                                  title="Remove from My Sheet"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          ) : activeView === "problem-list" ? (
            <>
              {/* Top Row: Banner and Session Progress */}
              <div className="flex flex-col lg:flex-row items-stretch gap-4">
                <div className="flex-1">
                  <PracticeSessionBanner 
                    title="DSA Sheet - Most Important Interview Questions"
                    description="All DSA topics covered – from basic to advanced. Perfect for interview preparation."
                    difficulty="Beginner"
                    problemCount={stats.total}
                    duration={stats.estimatedTime}
                    solved={stats.solved}
                    attempted={stats.attempted}
                    remaining={stats.remaining}
                    total={stats.total}
                  />
                </div>
                {activeView === "problem-list" && (
                  <div className="w-full lg:w-[260px] flex-shrink-0">
                    <PracticeRightSidebar 
                      solved={stats.solved}
                      attempted={stats.attempted}
                      remaining={stats.remaining}
                      total={stats.total}
                      onViewProgress={() => router.push("/practice?view=dashboard")}
                    />
                  </div>
                )}
              </div>

              {/* Tab navigation */}
              <div className="flex border-b border-slate-200 dark:border-neutral-800">
                {[
                  { id: "problems", label: `Problems (${filteredProblems.length})` },
                  { id: "description", label: "Description" },
                  { id: "resources", label: "Resources" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-primary text-primary dark:text-purple-400"
                        : "border-transparent text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab contents */}
              {activeTab === "problems" && (
                <div className="space-y-6">
                  {/* Search and Filters Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-3.5">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-600" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search problems... (Press /)"
                        className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#1a1b1e] text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition shadow-sm"
                      />
                    </div>

                    {/* Topic Filter */}
                    <div className="relative w-full sm:w-48">
                      <select
                        value={selectedTopic}
                        onChange={(e) => {
                          setSelectedTopic(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#1a1b1e] text-xs font-bold text-slate-600 dark:text-neutral-300 focus:outline-none focus:border-primary transition shadow-sm appearance-none cursor-pointer"
                      >
                        {uniqueTopics.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Company specific filter badge indicator */}
                  {selectedCompanyFilter !== "All" && (
                    <div className="flex items-center gap-2 text-xs font-bold bg-purple-500/10 text-primary dark:bg-purple-950/20 dark:text-purple-400 px-3.5 py-1.5 rounded-xl w-fit">
                      <span>Filtering by company: {selectedCompanyFilter}</span>
                      <button 
                        onClick={() => { setSelectedCompanyFilter("All"); setCurrentPage(1); }}
                        className="font-black text-purple-600 dark:text-purple-300 hover:opacity-85 ml-1.5"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}

                  {/* Problem Table */}
                  <div className="overflow-x-auto bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50/40 dark:bg-neutral-900/10 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800">
                          <th className="py-4 px-5 w-12 text-center">#</th>
                          <th className="py-4 px-5">Problem</th>
                          <th className="py-4 px-5">Topic</th>
                          <th className="py-4 px-5 text-center">Level</th>
                          <th className="py-4 px-5 text-center">Time</th>
                          <th className="py-4 px-5 text-center">Company</th>
                          <th className="py-4 px-5 text-center">Status</th>
                          <th className="py-4 px-5 text-center w-12"></th>
                          <th className="py-4 px-5 text-center w-12" title="Add to My Sheet">Sheet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProblems.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="py-8 text-center text-xs font-bold text-slate-400 dark:text-neutral-600">
                              No matching problems found.
                            </td>
                          </tr>
                        ) : (
                          paginatedProblems.map((prob, idx) => {
                            const status = getStatus(prob.id);
                            const isSaved = isBookmarked(prob.id);
                            const indexNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                            return (
                              <tr
                                key={prob.id}
                                className="border-b border-slate-50 dark:border-neutral-800/80 hover:bg-slate-50/20 dark:hover:bg-neutral-800/10 transition last:border-0"
                              >
                                <td className="py-4 px-5 text-center font-bold text-xs text-slate-400">
                                  {indexNumber}
                                </td>
                                <td className="py-4 px-5">
                                  <a
                                    href={prob.practiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-xs text-slate-800 dark:text-white hover:text-primary dark:hover:text-purple-400 hover:underline inline-flex items-center gap-1 transition"
                                  >
                                    <span>{prob.name}</span>
                                    <ExternalLink size={12} className="opacity-50 shrink-0" />
                                  </a>
                                </td>
                                <td className="py-4 px-5 text-xs font-bold text-slate-500 dark:text-neutral-400">
                                  {prob.topic}
                                </td>
                                <td className="py-4 px-5 text-center">
                                  <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full ${
                                    prob.difficulty === "Easy"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : prob.difficulty === "Medium"
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                                  }`}>
                                    {prob.difficulty}
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-center text-xs font-bold text-slate-400 dark:text-neutral-500">
                                  {prob.time}
                                </td>
                                <td className="py-4 px-5 text-center">
                                  <div className="flex justify-center">
                                    <CompanyLogos companies={prob.companies} />
                                  </div>
                                </td>
                                <td className="py-4 px-5 text-center">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => handleStatusToggle(prob.id, status)}
                                      className="focus:outline-none focus-ring rounded-full"
                                      title={`Click to toggle status: currently ${status}`}
                                    >
                                      {status === "Completed" ? (
                                        <div className="w-5 h-5 rounded-full border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white scale-105 transition">
                                          <CheckCircle2 size={12} className="stroke-[3]" />
                                        </div>
                                      ) : status === "In Progress" ? (
                                        <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center scale-105 transition">
                                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                        </div>
                                      ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-neutral-700 hover:border-primary transition" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-4 px-5 text-center">
                                  <button
                                    onClick={() => {
                                      if (!ensureLoggedIn()) return;
                                      toggleBookmark(prob.id, prob.topic.toLowerCase());
                                    }}
                                    className={`focus:outline-none focus-ring rounded-lg p-1.5 transition ${
                                      isSaved 
                                        ? "text-primary bg-primary/10 dark:text-purple-400" 
                                        : "text-slate-300 dark:text-neutral-700 hover:text-slate-500"
                                    }`}
                                  >
                                    <Bookmark size={14} className={isSaved ? "fill-primary dark:fill-purple-400" : ""} />
                                  </button>
                                </td>
                                <td className="py-4 px-5 text-center">
                                  <button
                                    onClick={() => {
                                      if (!ensureLoggedIn()) return;
                                      if (isInSheet(prob.id)) {
                                        removeFromSheet(prob.id);
                                        toast.success('Removed from My Sheet');
                                      } else {
                                        addToSheet(prob.id);
                                        toast.success('Added to My Sheet! ✨');
                                      }
                                    }}
                                    title={isInSheet(prob.id) ? 'Remove from My Sheet' : 'Add to My Sheet'}
                                    className={`focus:outline-none p-1.5 rounded-lg transition ${
                                      isInSheet(prob.id)
                                        ? 'text-purple-500 bg-purple-500/10 dark:text-purple-400'
                                        : 'text-slate-300 dark:text-neutral-700 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20'
                                    }`}
                                  >
                                    <ScrollText size={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer / Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 select-none pt-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-500">
                      Showing {filteredProblems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of {filteredProblems.length} problems
                    </span>

                    {/* Legend circles */}
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 dark:text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200 dark:border-neutral-750" />
                        <span>Not Solved</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-amber-500" />
                        </div>
                        <span>Attempted</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Solved</span>
                      </div>
                    </div>

                    {/* Shuffle / Random & Pagination controls */}
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleSolveRandom}
                        className="flex items-center gap-1.5 px-3 py-2 border border-purple-500/20 hover:bg-primary hover:text-white dark:hover:bg-purple-600 text-primary dark:text-purple-400 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Shuffle size={12} />
                        <span>Solve Random Problem</span>
                      </button>

                      {/* Pagination buttons */}
                      {totalPages > 1 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#1a1b1e] rounded-xl disabled:opacity-40 transition"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button
                            onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#1a1b1e] rounded-xl disabled:opacity-40 transition"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Description Tab Content */}
              {activeTab === "description" && (
                <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-800 dark:text-white">Sheet Overview</h3>
                  <p className="text-xs md:text-sm text-slate-400 dark:text-neutral-500 leading-relaxed">
                    This dynamic study sheet compiles all active problems from the AlgoBuddy platform roadmap categories. Master these questions to gain complete proficiency in major coding test questions.
                  </p>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">Topics Covered:</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-400 dark:text-neutral-500 space-y-2 capitalize">
                    {uniqueTopics.filter(t => t !== "All Topics").map((topic) => (
                      <li key={topic}>{topic.toLowerCase()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources Tab Content */}
              {activeTab === "resources" && (
                <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-800 dark:text-white">Curated Learning Resources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Visualizer Code Lab", desc: "Interactive dry-run panel for tracing stack frames and node memory.", url: "/visualizer" },
                      { title: "AlgoBuddy Roadmaps", desc: "Visual graphs mapping step-by-step topic timelines.", url: "/roadmaps" },
                      { title: "Dynamic Programming Guide", desc: "Tutorial detailing Memoization vs Tabulation optimization patterns.", url: "/tutorials" },
                      { title: "Complexity Cheatsheet", desc: "Quick-reference matrix of time and space complexities for all structures.", url: "/cheatsheets" }
                    ].map((res, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-neutral-800 hover:border-primary transition duration-300">
                        <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
                          <span>{res.title}</span>
                          <ExternalLink size={12} className="text-slate-400" />
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1.5 leading-normal">
                          {res.desc}
                        </p>
                        <button 
                          onClick={() => router.push(res.url)}
                          className="text-[11px] font-black text-primary hover:underline mt-3 block"
                        >
                          Explore Resource →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </>
          ) : activeView === "bookmarks" ? (
            <section className="space-y-5">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-500/20">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <Bookmark size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-purple-200">Your Bookmarks</span>
                  </div>
                  <h3 className="font-black text-2xl">Saved Problems</h3>
                  <p className="text-sm mt-1 text-purple-200">Review your bookmarked problems.</p>
                </div>
              </div>

              {filteredProblems.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                    <Bookmark size={28} className="text-purple-500" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-2">No bookmarks yet</h3>
                  <p className="text-sm text-slate-400 dark:text-neutral-500 max-w-sm mx-auto">
                    Browse the problem list and click the bookmark icon to save problems here for later review.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50/40 dark:bg-neutral-900/10 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800">
                          <th className="py-4 px-5 w-12 text-center">#</th>
                          <th className="py-4 px-5">Problem</th>
                          <th className="py-4 px-5 text-center">Level</th>
                          <th className="py-4 px-5 text-center">Bookmarked On</th>
                          <th className="py-4 px-5 text-center">Status</th>
                          <th className="py-4 px-5 text-center w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProblems.map((prob, idx) => {
                          const status = getStatus(prob.id);
                          const isSaved = isBookmarked(prob.id);
                          const bInfo = bookmarks.find(b => b.id === prob.id);
                          const dateStr = bInfo?.createdAt ? new Date(bInfo.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Recently";
                          return (
                            <tr key={prob.id} className="border-b border-slate-50 dark:border-neutral-800/80 hover:bg-slate-50/20 dark:hover:bg-neutral-800/10 transition last:border-0">
                              <td className="py-4 px-5 text-center font-bold text-xs text-slate-400">{idx + 1}</td>
                              <td className="py-4 px-5">
                                <a href={prob.practiceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-xs text-slate-800 dark:text-white hover:text-primary dark:hover:text-purple-400 hover:underline inline-flex items-center gap-1 transition">
                                  <span>{prob.name}</span>
                                  <ExternalLink size={12} className="opacity-50 shrink-0" />
                                </a>
                              </td>
                              <td className="py-4 px-5 text-center">
                                <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full ${
                                  prob.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : prob.difficulty === "Medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400"
                                }`}>{prob.difficulty}</span>
                              </td>
                              <td className="py-4 px-5 text-center text-xs font-bold text-slate-500 dark:text-neutral-400">{dateStr}</td>
                              <td className="py-4 px-5 text-center">
                                <div className="flex justify-center">
                                  <button onClick={() => handleStatusToggle(prob.id, status)} className="focus:outline-none focus-ring rounded-full" title={`Click to toggle status: currently ${status}`}>
                                    {status === "Completed" ? (
                                      <div className="w-5 h-5 rounded-full border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white scale-105 transition"><CheckCircle2 size={12} className="stroke-[3]" /></div>
                                    ) : status === "In Progress" ? (
                                      <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center scale-105 transition"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /></div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-neutral-700 hover:border-primary transition" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-center">
                                <button
                                  onClick={() => {
                                    if (!ensureLoggedIn()) return;
                                    toggleBookmark(prob.id, prob.topic.toLowerCase());
                                  }}
                                  className={`focus:outline-none focus-ring rounded-lg p-1.5 transition ${
                                    isSaved 
                                      ? "text-primary bg-primary/10 dark:text-purple-400" 
                                      : "text-slate-300 dark:text-neutral-700 hover:text-slate-500"
                                  }`}
                                >
                                  <Bookmark size={14} className={isSaved ? "fill-primary dark:fill-purple-400" : ""} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          ) : activeView === "recent-solved" ? (
            <section className="space-y-5">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-500/20">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <History size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-200">Activity History</span>
                  </div>
                  <h3 className="font-black text-2xl">Recently Solved</h3>
                  <p className="text-sm mt-1 text-emerald-200">Problems you have completed, ordered by most recent.</p>
                </div>
              </div>

              {progressLoading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#1a1b1e] rounded-3xl border border-slate-100 dark:border-neutral-800/80 shadow-sm transition-all duration-300">
                  <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin dark:border-neutral-800 dark:border-t-emerald-400"></div>
                  <p className="mt-4 text-sm font-bold text-slate-400 dark:text-neutral-500 animate-pulse">Loading recently solved problems...</p>
                </div>
              ) : progressError ? (
                <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <History size={28} className="text-red-500" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-2">Error loading progress</h3>
                  <p className="text-sm text-red-400 dark:text-red-500/80 max-w-sm mx-auto">
                    {progressError}. Please refresh the page.
                  </p>
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <History size={28} className="text-emerald-500" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-2">No recently solved problems yet.</h3>
                  <p className="text-sm text-slate-400 dark:text-neutral-500 max-w-sm mx-auto">
                    Your completed problems will appear here. Start practicing!
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50/40 dark:bg-neutral-900/10 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800">
                          <th className="py-4 px-5 w-12 text-center">#</th>
                          <th className="py-4 px-5">Problem</th>
                          <th className="py-4 px-5 text-center">Topic</th>
                          <th className="py-4 px-5 text-center">Level</th>
                          <th className="py-4 px-5 text-center">Completed On</th>
                          <th className="py-4 px-5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProblems.map((prob, idx) => {
                          const status = getStatus(prob.id);
                          const progInfo = progress[prob.id];
                          const dateStr = progInfo?.updatedAt ? new Date(progInfo.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) : "Recently";
                          return (
                            <tr key={prob.id} className="border-b border-slate-50 dark:border-neutral-800/80 hover:bg-slate-50/20 dark:hover:bg-neutral-800/10 transition last:border-0">
                              <td className="py-4 px-5 text-center font-bold text-xs text-slate-400">{idx + 1}</td>
                              <td className="py-4 px-5">
                                <a href={prob.practiceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-xs text-slate-800 dark:text-white hover:text-primary dark:hover:text-emerald-400 hover:underline inline-flex items-center gap-1 transition">
                                  <span>{prob.name}</span>
                                  <ExternalLink size={12} className="opacity-50 shrink-0" />
                                </a>
                              </td>
                              <td className="py-4 px-5 text-center text-xs font-bold text-slate-500 dark:text-neutral-400">
                                {prob.topic}
                              </td>
                              <td className="py-4 px-5 text-center">
                                <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full ${
                                  prob.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : prob.difficulty === "Medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400"
                                }`}>{prob.difficulty}</span>
                              </td>
                              <td className="py-4 px-5 text-center text-xs font-bold text-slate-500 dark:text-neutral-400">{dateStr}</td>
                              <td className="py-4 px-5 text-center">
                                <div className="flex justify-center">
                                  <button onClick={() => handleStatusToggle(prob.id, status)} className="focus:outline-none focus-ring rounded-full" title={`Click to toggle status: currently ${status}`}>
                                    {status === "Completed" ? (
                                      <div className="w-5 h-5 rounded-full border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white scale-105 transition"><CheckCircle2 size={12} className="stroke-[3]" /></div>
                                    ) : status === "In Progress" ? (
                                      <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center scale-105 transition"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /></div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-neutral-700 hover:border-emerald-500 transition" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          ) : activeView === "topic-wise" ? (
            /* Topic-wise Filter View */
            <section className="space-y-5">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-500/20">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <Bookmark size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-purple-200">Topic-wise Practice</span>
                  </div>
                  <h3 className="font-black text-2xl">Master Patterns</h3>
                  <p className="text-sm mt-1 text-purple-200">Select a topic below to focus on specific problem patterns.</p>
                </div>
                <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-200 block mb-1">Selected Topic</span>
                  <p className="text-base font-black truncate max-w-[200px]">{selectedTopicWise}</p>
                </div>
              </div>

              {/* Topics Pill List */}
              <div className="relative">
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {practiceData.map((topic) => {
                    const isSelected = selectedTopicWise === topic.title;
                    return (
                      <button
                        key={topic.slug}
                        onClick={() => {
                          if (selectedTopicWise !== topic.title) {
                            setIsTopicLoading(true);
                            setSelectedTopicWise(topic.title);
                            
                            // Push to URL to maintain history state
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("topic", topic.title);
                            router.push(`/practice?${params.toString()}`);
                            
                            setTimeout(() => setIsTopicLoading(false), 300);
                          }
                        }}
                        className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border flex-shrink-0 ${
                          isSelected 
                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                            : "bg-white dark:bg-[#1a1b1e] text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:border-primary/50 dark:hover:border-purple-500/50"
                        }`}
                      >
                        {topic.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Area */}
              {isTopicLoading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#1a1b1e] rounded-3xl border border-slate-100 dark:border-neutral-800/80 shadow-sm transition-all duration-300">
                  <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin dark:border-neutral-800 dark:border-t-purple-500"></div>
                  <p className="mt-4 text-sm font-bold text-slate-400 dark:text-neutral-500 animate-pulse">Loading {selectedTopicWise} problems...</p>
                </div>
              ) : (
                (() => {
                  const topicData = practiceData.find(t => t.title === selectedTopicWise);
                  const problems = topicData ? topicData.subsections.flatMap(sub => sub.items) : [];
                  
                  if (problems.length === 0) {
                    return (
                      <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl p-12 text-center shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                          <Bookmark size={28} className="text-purple-500" />
                        </div>
                        <h3 className="text-base font-black text-slate-800 dark:text-white mb-2">No problems found</h3>
                        <p className="text-sm text-slate-400 dark:text-neutral-500 max-w-sm mx-auto">
                          There are currently no problems listed under {selectedTopicWise}. Check back later!
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-slate-50/40 dark:bg-neutral-900/10 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800">
                              <th className="py-4 px-5 w-12 text-center">#</th>
                              <th className="py-4 px-5">Problem</th>
                              <th className="py-4 px-5 text-center">Level</th>
                              <th className="py-4 px-5 text-center">Company</th>
                              <th className="py-4 px-5 text-center">Status</th>
                              <th className="py-4 px-5 text-center w-12"></th>
                              <th className="py-4 px-5 text-center w-12" title="Add to My Sheet">Sheet</th>
                            </tr>
                          </thead>
                          <tbody>
                            {problems.map((prob, idx) => {
                              const status = getStatus(prob.id);
                              const isSaved = isBookmarked(prob.id);
                              return (
                                <tr key={prob.id} className="border-b border-slate-50 dark:border-neutral-800/80 hover:bg-slate-50/20 dark:hover:bg-neutral-800/10 transition last:border-0">
                                  <td className="py-4 px-5 text-center font-bold text-xs text-slate-400">{idx + 1}</td>
                                  <td className="py-4 px-5">
                                    <a
                                      href={prob.practiceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-bold text-xs text-slate-800 dark:text-white hover:text-primary dark:hover:text-purple-400 hover:underline inline-flex items-center gap-1 transition"
                                    >
                                      <span>{prob.name}</span>
                                      <ExternalLink size={12} className="opacity-50 shrink-0" />
                                    </a>
                                  </td>
                                  <td className="py-4 px-5 text-center">
                                    <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full ${
                                      prob.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : prob.difficulty === "Medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                                    }`}>{prob.difficulty}</span>
                                  </td>
                                  <td className="py-4 px-5 text-center">
                                    <div className="flex justify-center"><CompanyLogos companies={prob.companies} /></div>
                                  </td>
                                  <td className="py-4 px-5 text-center">
                                    <div className="flex justify-center">
                                      <button onClick={() => handleStatusToggle(prob.id, status)} className="focus:outline-none">
                                        {status === "Completed" ? (
                                          <div className="w-5 h-5 rounded-full border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white scale-105 transition"><CheckCircle2 size={12} className="stroke-[3]" /></div>
                                        ) : status === "In Progress" ? (
                                          <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center scale-105 transition"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /></div>
                                        ) : (
                                          <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-neutral-700 hover:border-primary transition" />
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-4 px-5 text-center">
                                    <button
                                      onClick={() => {
                                        if (!ensureLoggedIn()) return;
                                        toggleBookmark(prob.id, selectedTopicWise.toLowerCase());
                                      }}
                                      className={`focus:outline-none focus-ring rounded-lg p-1.5 transition ${
                                        isSaved 
                                          ? "text-primary bg-primary/10 dark:text-purple-400" 
                                          : "text-slate-300 dark:text-neutral-700 hover:text-slate-500"
                                      }`}
                                    >
                                      <Bookmark size={14} className={isSaved ? "fill-primary dark:fill-purple-400" : ""} />
                                    </button>
                                  </td>
                                  <td className="py-4 px-5 text-center">
                                    <button
                                      onClick={() => {
                                        if (!ensureLoggedIn()) return;
                                        if (isInSheet(prob.id)) {
                                          removeFromSheet(prob.id);
                                          toast.success('Removed from My Sheet');
                                        } else {
                                          addToSheet(prob.id);
                                          toast.success('Added to My Sheet! ✨');
                                        }
                                      }}
                                      title={isInSheet(prob.id) ? 'Remove from My Sheet' : 'Add to My Sheet'}
                                      className={`focus:outline-none p-1.5 rounded-lg transition ${
                                        isInSheet(prob.id)
                                          ? 'text-purple-500 bg-purple-500/10 dark:text-purple-400'
                                          : 'text-slate-300 dark:text-neutral-700 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20'
                                      }`}
                                    >
                                      <ScrollText size={14} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()
              )}
            </section>
          ) : activeView === "notes" ? (
            <PracticeNotebook />
          ) : (
            /* Company-wise View */
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  Company-wise Practice
                </h2>
                <p className="text-xs text-slate-400 dark:text-neutral-500 font-bold mt-1">
                  Select a company to view interview questions frequently asked in their recruitment rounds.
                </p>
              </div>

              {/* Grid of companies dynamically fetched */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {companiesList.map((comp) => (
                  <button
                    key={comp.name}
                    onClick={() => {
                      setSelectedCompanyFilter(comp.name);
                      setActiveView("problem-list");
                      setCurrentPage(1);
                      toast.success(`Filtering problems by: ${comp.name}`);
                    }}
                    className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 shadow-sm hover:border-primary dark:hover:border-purple-500 transition duration-300 text-center select-none"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-neutral-800 mb-3 border border-slate-100 dark:border-neutral-800">
                      {/* Reuse dynamic CompanyLogos logo defs by passing array */}
                      <CompanyLogos companies={[comp.name]} />
                    </div>
                    <span className="text-xs font-black text-slate-850 dark:text-neutral-200">
                      {comp.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold mt-1 block">
                      {comp.count} Questions
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Theory Drawer */}
      <TheoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        problem={selectedProblem}
        topicSlug={selectedProblem ? selectedProblem.topic.toLowerCase() : null}
      />

      <Footer />
    </div>
  );
}

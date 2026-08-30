"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/features/user/UserContext";
import { toast } from "react-hot-toast";
import UpcomingTournament from "@/app/components/ui/UpcomingTournament";
import MatchmakingModal from "@/app/components/ui/MatchmakingModal";
import DuelSimulatorModal from "@/app/components/ui/DuelSimulatorModal";
import SpectatorSimulatorModal from "@/app/components/ui/SpectatorSimulatorModal";
import CreateDuelModal from "@/app/components/ui/CreateDuelModal";
import Footer from "@/app/components/footer";
import {
  Home,
  Swords,
  Trophy,
  Flame,
  Shield,
  Activity,
  Award,
  History,
  User,
  Clock,
  Zap,
  Play,
  ChevronRight,
  TrendingUp,
  Target,
  ChevronLeft,
  Users,
  Calendar
} from "lucide-react";
import { useArenaProfile } from "@/app/hooks/useArenaProfile";
import { useSheetProgress } from "@/app/hooks/useSheetProgress";
import { practiceData } from "@/lib/practiceData";

// Mock live battles feed is removed, we use liveMatches

const ACHIEVEMENT_BADGES = [
  { title: "Module Master", icon: "🏆" },
  { title: "7-Day Streak", icon: "🔥" },
  { title: "Community Helper", icon: "🤝" },
  { title: "Arena Champion", icon: "⚔️" },
];

function calculateLevelProgress(xp) {
  if (!xp) return 0;
  return (xp % 1000) / 10;
}

function getInitials(name) {
  if (!name) return "??";
  const cleanName = name.includes("@") ? name.split("@")[0] : name;
  const parts = cleanName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export default function ArenaPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { profile, leaderboard, matchHistory, dailyChallenge, loadingProfile, loadingLeaderboard } = useArenaProfile(user);
  const { progress, getStatus, streakData } = useSheetProgress();

  const ensureLoggedIn = () => {
    if (loading) return false; 
    if (!user) {
      toast.error("Please login to use this feature!");
      router.push("/login?next=/arena");
      return false;
    }
    return true;
  };

  const [activeTab, setActiveTab] = useState("home"); // home, live, ranked, friend, leaderboard, streak, tournaments, badges, history

  const handleTabChange = (tabId) => {
    if (["ranked", "friend", "streak", "badges", "history"].includes(tabId)) {
      if (!ensureLoggedIn()) return;
    }
    if (typeof window !== "undefined") {
      router.push(tabId === "home" ? "/arena" : `/arena#${tabId}`);
      setActiveTab(tabId);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validTabs = ["home", "live", "ranked", "friend", "leaderboard", "streak", "tournaments", "badges", "history"];
      const protectedTabs = ["ranked", "friend", "streak", "badges", "history"];
      
      if (validTabs.includes(hash)) {
        // Don't redirect while auth session is still resolving — user may be logged in
        if (protectedTabs.includes(hash) && !loading && !user) {
          router.push("/arena");
          setActiveTab("home");
          return;
        }
        setActiveTab(hash);
      } else {
        setActiveTab("home");
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [user, loading, router]);

  // Live Matches polling
  const [liveMatches, setLiveMatches] = useState([]);

  useEffect(() => {
    let timeoutId;
    let isOffline = false;

    const fetchLiveMatches = async () => {
      try {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 
          (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.")
            ? `http://${window.location.hostname}:4000`
            : "https://algobuddy-socket-server.onrender.com");
          
        const res = await fetch(`${socketUrl}/api/matches/active`);
        if (res.ok) {
          const data = await res.json();
          setLiveMatches(data.matches || []);
          if (isOffline) {
            isOffline = false;
            console.log("Live matches server is back online.");
          }
        } else {
          throw new Error(`Server returned status: ${res.status}`);
        }
      } catch (err) {
        if (!isOffline) {
          isOffline = true;
          console.warn("Live matches server is offline. Real-time updates disabled. Retrying less frequently.");
        }
      } finally {
        // Schedule next poll: 5 seconds if online, 60 seconds if offline
        const delay = isOffline ? 60000 : 5000;
        timeoutId = setTimeout(fetchLiveMatches, delay);
      }
    };

    fetchLiveMatches();
    return () => clearTimeout(timeoutId);
  }, []);

  // Modals state
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [createDuelOpen, setCreateDuelOpen] = useState(false);

  // Fix for browser back button from Matchmaking modal (Issue #1333)
  // Fix for browser back button from Create Duel modal (Issue #1336)
  useEffect(() => {
    const handlePopState = (e) => {
      if (matchmakingOpen) {
        setMatchmakingOpen(false);
      } else if (createDuelOpen) {
        setCreateDuelOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [matchmakingOpen, createDuelOpen]);

  const openMatchmakingModal = () => {
    if (!ensureLoggedIn()) return;
    window.history.pushState({ modal: "matchmaking" }, "", window.location.href);
    setMatchmakingOpen(true);
  };

  const closeMatchmakingModal = () => {
    setMatchmakingOpen(false);
    if (window.history.state?.modal === "matchmaking") {
      window.history.back();
    }
  };

  const openCreateDuelModal = () => {
    if (!ensureLoggedIn()) return;
    window.history.pushState({ modal: "createDuel" }, "", window.location.href);
    setCreateDuelOpen(true);
  };

  const closeCreateDuelModal = () => {
    setCreateDuelOpen(false);
    if (window.history.state?.modal === "createDuel") {
      window.history.back();
    }
  };
  const [duelSimulatorOpen, setDuelSimulatorOpen] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [activeDuelProblem, setActiveDuelProblem] = useState("Reverse Linked List");


  const [currentUserStats, setCurrentUserStats] = useState({
    name: "",
    level: 1,
    rating: 1200,
    xp: 0,
    rank: 1,
  });

  useEffect(() => {
    if (!loading && user) {
      setCurrentUserStats({
        userId: user.id,
        name: user.user_metadata?.name || user.email.split("@")[0],
        level: profile?.level || 1,
        rating: profile?.rating || 1200,
        xp: profile?.xp || 0,
        rank: profile?.rank || 1,
      });
    }
  }, [user, loading, profile]);

  const handleMatchFound = (opponent) => {
    setSelectedOpponent(opponent);
    closeMatchmakingModal();
    setActiveDuelProblem("Two Sum");
    setDuelSimulatorOpen(true);
  };

  const handleWatchLive = (matchData) => {
    // Let's store it in state so we can pass it to the SpectatorModal
    setSpectatingMatch(matchData);
    setSpectatorModalOpen(true);
  };

  const [spectatorModalOpen, setSpectatorModalOpen] = useState(false);
  const [spectatingMatch, setSpectatingMatch] = useState(null);

  const handleCreateMatchLaunch = (matchConfig) => {
    setCreateDuelOpen(false);
    setSelectedOpponent({ name: "Opponent", rating: 1600, level: 15, avatar: "OP" });
    setActiveDuelProblem(matchConfig.topic);
    setDuelSimulatorOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="bg-slate-50/50 dark:bg-neutral-900 min-h-screen text-slate-800 dark:text-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 pt-8 pb-16">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">

          {/* ─── Column 1: Left Sidebar ────────────────────────────────────────── */}
          <aside className="space-y-6">
            {/* Navigation Menu */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm">
              <nav className="space-y-1">
                {[
                  { id: "home", label: "Arena Home", icon: Home },
                  { id: "live", label: "Live Battles", icon: Swords },
                  { id: "ranked", label: "Ranked Match", icon: Trophy },
                  { id: "friend", label: "Friend Challenge", icon: User },
                  { id: "leaderboard", label: "Leaderboard", icon: Activity },
                  { id: "streak", label: "Daily Streak", icon: Flame },
                  { id: "tournaments", label: "Tournaments", icon: Trophy },
                  { id: "badges", label: "Badges", icon: Award },
                  { id: "history", label: "Match History", icon: History }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${isActive
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-900/40"
                        }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* XP Progress */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">
                  XP Progress
                </h3>
                <span className="text-xs text-primary dark:text-purple-400 font-bold uppercase tracking-wider">
                  Level {currentUserStats.level}
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-neutral-900 h-2.5 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${calculateLevelProgress(currentUserStats.xp)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500 dark:text-neutral-400">
                <span>{currentUserStats.xp % 1000} / 1000 XP</span>
              </div>
            </div>

          </aside>

          {/* ─── Column 2: Main Panel ───────────────────────────────────────────── */}
          <main className="space-y-6 overflow-hidden">
            {activeTab === "home" && (
              <>
                {/* Hero Podium Card */}
                <div className="bg-gradient-to-br from-[#1c1d2c] to-[#0f0f18] rounded-3xl p-6 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between border border-slate-900">
                  <div className="space-y-4 max-w-sm z-10 text-center md:text-left mb-6 md:mb-0">
                    <span className="text-[10px] bg-primary/20 text-primary-light border border-primary/30 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Welcome to Arena
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Compete. Learn. <span className="text-primary-light">Climb.</span>
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Challenge developers in real-time DSA battles, climb the leaderboard and become the best.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button
                        onClick={() => {
                          openMatchmakingModal();
                        }}
                        className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Zap size={14} />
                        Find Match
                      </button>
                      <button
                        onClick={openCreateDuelModal}
                        className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Swords size={14} />
                        Create Duel
                      </button>
                    </div>
                  </div>

                  {/* Top 3 Avatars Podium Graphic */}
                  <div className="flex gap-4 items-end pr-2 select-none">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center mt-6">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs shadow border-2 border-slate-600 mb-1.5 overflow-hidden">
                        {leaderboard[1]?.avatarUrl ? (
                          <img 
                            src={leaderboard[1].avatarUrl} 
                            alt={leaderboard[1]?.name || "User"} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : leaderboard[1] ? (
                          <div className="w-full h-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center text-xs font-bold">
                            {getInitials(leaderboard[1]?.name || `User ${leaderboard[1]?.userId.substring(0,4)}`)}
                          </div>
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                            -
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 block font-semibold mb-1 truncate max-w-[64px]">
                        {leaderboard[1] ? (leaderboard[1]?.name || `User ${leaderboard[1]?.userId.substring(0,4)}`) : "Unranked"}
                      </span>
                      <span className="text-[9px] text-slate-400 block mb-2">{leaderboard[1] ? `${leaderboard[1].xp} XP` : "-"}</span>
                      <div className="w-14 h-12 bg-slate-800 border-t border-slate-700 rounded-t-lg flex items-center justify-center font-bold text-slate-400 shadow-lg text-lg">
                        2
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center font-bold text-sm shadow-md border-2 border-amber-400 mb-1.5 overflow-hidden">
                        {leaderboard[0]?.avatarUrl ? (
                          <img 
                            src={leaderboard[0].avatarUrl} 
                            alt={leaderboard[0]?.name || "User"} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : leaderboard[0] ? (
                           <div className="w-full h-full text-white flex items-center justify-center text-sm font-bold">
                             {getInitials(leaderboard[0]?.name || `User ${leaderboard[0]?.userId.substring(0,4)}`)}
                           </div>
                        ) : (
                           <div className="w-full h-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500">
                             -
                           </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-200 block font-bold mb-1">{leaderboard[0] ? (leaderboard[0]?.name || `User ${leaderboard[0]?.userId.substring(0,4)}`) : "Unranked"}</span>
                      <span className="text-[9px] text-amber-300 block mb-2">{leaderboard[0] ? `${leaderboard[0].xp} XP` : "-"}</span>
                      <div className="w-16 h-20 bg-primary border-t border-primary-light rounded-t-lg flex items-center justify-center font-extrabold text-white shadow-lg text-2xl">
                        1
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center mt-8">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs shadow border-2 border-purple-500 mb-1.5 overflow-hidden">
                        {leaderboard[2]?.avatarUrl ? (
                          <img 
                            src={leaderboard[2].avatarUrl} 
                            alt={leaderboard[2]?.name || "User"} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : leaderboard[2] ? (
                           <div className="w-full h-full text-white flex items-center justify-center text-xs font-bold">
                             {getInitials(leaderboard[2]?.name || `User ${leaderboard[2]?.userId.substring(0,4)}`)}
                           </div>
                        ) : (
                           <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                             -
                           </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 block font-semibold mb-1">{leaderboard[2] ? (leaderboard[2]?.name || `User ${leaderboard[2]?.userId.substring(0,4)}`) : "Unranked"}</span>
                      <span className="text-[9px] text-slate-400 block mb-2">{leaderboard[2] ? `${leaderboard[2].xp} XP` : "-"}</span>
                      <div className="w-14 h-12 bg-slate-800 border-t border-slate-700 rounded-t-lg flex items-center justify-center font-bold text-slate-400 shadow-lg text-lg">
                        3
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Stats Card */}
                <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200 mb-4">Your Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { label: "Battles Won", value: profile?.battlesWon || 0, icon: Swords, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                      { label: "Win Rate", value: profile?.battlesWon && (profile?.battlesWon + profile?.battlesLost) > 0 ? `${Math.round((profile.battlesWon / (profile.battlesWon + profile.battlesLost)) * 100)}%` : "0%", icon: TrendingUp, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                      { label: "Problems Solved", value: profile?.totalProblemsSolved || 0, icon: Target, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
                      { label: "Current Rating", value: profile?.rating || 1200, icon: Trophy, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                      { label: "Current Rank", value: `#${currentUserStats.rank}`, icon: Shield, color: "text-slate-500 bg-slate-500/10 border-slate-500/20" },
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div key={idx} className="p-3 border border-slate-100 dark:border-neutral-900 bg-slate-50/20 dark:bg-neutral-900/20 rounded-xl text-center">
                          <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center border ${stat.color} mb-2`}>
                            <Icon size={14} />
                          </div>
                          <span className="text-[9px] text-slate-400 dark:text-neutral-500 block truncate font-medium uppercase tracking-wider">{stat.label}</span>
                          <span className="text-sm font-bold text-slate-850 dark:text-neutral-100 block mt-0.5">{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-grid 2: Achievement Showcase & Upcoming Tournament */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Badges Grid */}
                  <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">
                        Achievement Showcase
                      </h3>
                      <span className="text-xs text-primary">
                        {ACHIEVEMENT_BADGES.length} Earned
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {ACHIEVEMENT_BADGES.map((badge, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-xl border border-slate-200 dark:border-neutral-700 text-center"
                        >
                          <div className="text-2xl">{badge.icon}</div>
                          <p className="text-[10px] font-medium mt-1">
                            {badge.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Tournament */}
                  <UpcomingTournament />
                </div>
                <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Recent Battles</h3>
                    <span
                      onClick={() => handleTabChange("history")}
                      className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
                    >
                      View All
                    </span>
                  </div>

                  <div className="space-y-3">
                    {matchHistory && matchHistory.length > 0 ? (
                      matchHistory.map((b) => {
                        const opponentName = b.opponentName;
                        const topic = b.topic;
                        const date = new Date(b.startTime).toLocaleDateString();
                        const result = b.result;
                        const xpAwarded = `+${b.xpAwarded} XP`;
                        const ratingChange = b.ratingChange >= 0 ? `+${b.ratingChange} Rating` : `${b.ratingChange} Rating`;

                        return (
                        <div key={b.id} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-neutral-900/60 bg-slate-50/20 dark:bg-neutral-900/20 rounded-xl gap-4 text-xs">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-700 dark:text-neutral-300 truncate">
                                You vs {opponentName}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${result === "Victory"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : result === "Defeat" ? "bg-red-500/10 text-red-500" : "bg-slate-500/10 text-slate-500"
                                }`}>
                                {result}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-neutral-500">
                              <span>Topic: {topic}</span>
                              <span>{date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right shrink-0">
                              <span className="font-semibold text-primary dark:text-purple-400 block">{xpAwarded}</span>
                              <span className={`text-[10px] font-bold ${ratingChange.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                                {ratingChange}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                if (!ensureLoggedIn()) return;
                                handleWatchLive("You", opponentName, topic);
                              }}
                              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 rounded-xl font-bold transition shrink-0"
                            >
                              Replay
                            </button>
                          </div>
                        </div>
                      )})
                    ) : (
                      <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        No recent battles found.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab !== "home" && (
              <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col justify-center items-center text-center">
                <Swords size={48} className="text-slate-300 dark:text-neutral-750 mb-3 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200 capitalize mb-1">
                  {activeTab.replace("-", " ")} Section
                </h3>
                <p className="text-xs text-slate-400 dark:text-neutral-500 max-w-xs leading-normal mb-6">
                  Access matchmaking controls, leaderboards, or customize your profile values directly from the side panels.
                </p>

                {activeTab === "live" && (
                  <div className="w-full max-w-md space-y-3 text-left">
                    {liveMatches.length > 0 ? liveMatches.map((b) => {
                      const p1 = b.players?.[0]?.name || "Player 1";
                      const p2 = b.players?.[1]?.name || "Player 2";
                      return (
                      <div key={b.matchId} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-neutral-900 rounded-xl text-xs">
                        <div>
                          <div className="font-bold text-slate-700 dark:text-neutral-200 mb-1">{p1} vs {p2}</div>
                          <div className="text-[10px] text-slate-400">{b.topic} • {b.difficulty}</div>
                        </div>
                        <button
                          onClick={() => handleWatchLive(b)}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg font-bold"
                        >
                          Watch Live
                        </button>
                      </div>
                    )}) : (
                      <div className="text-center text-xs text-slate-500">No active battles right now.</div>
                    )}
                  </div>
                )}

                {activeTab === "ranked" && (
                  <div className="w-full text-left space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-200 mb-1">Ranked Matchmaking</h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">Compete against similarly skilled opponents to climb the ranks.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-200 dark:border-neutral-800 flex items-center justify-center shadow-inner bg-white dark:bg-neutral-800 relative z-10">
                          <Trophy size={64} className="text-slate-400" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent border-l-transparent transform rotate-45 z-20"></div>
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest mb-1">Unranked</h3>
                      <p className="text-xs text-slate-500 font-bold mb-6">Play 5 placement matches to reveal your rank</p>

                      <div className="w-full max-w-sm mb-6">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                          <span>Placement Progress</span>
                          <span>0 / 5</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-primary rounded-full transition-all duration-1000"></div>
                        </div>
                      </div>

                      <button
                        onClick={() => openMatchmakingModal()}
                        className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Find Ranked Match
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "friend" && (
                  <div className="w-full text-left space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-200 mb-1">Play with Friends</h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">Create a private lobby and invite your friends to a custom code duel.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Lobby Settings</h5>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Difficulty</label>
                            <div className="flex gap-2">
                              {["Easy", "Medium", "Hard"].map(diff => (
                                <button key={diff} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${diff === "Medium" ? "bg-primary/10 border-primary/30 text-primary" : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-slate-300"}`}>
                                  {diff}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Time Limit</label>
                            <div className="flex gap-2">
                              {["15m", "30m", "60m"].map(time => (
                                <button key={time} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${time === "30m" ? "bg-primary/10 border-primary/30 text-primary" : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-slate-300"}`}>
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 flex flex-col">
                          <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Invite Players</h5>
                          
                          <div className="flex-1 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                            <Users size={32} className="text-slate-300 dark:text-neutral-600" />
                            <p className="text-[10px] text-slate-500 max-w-[150px]">Create the lobby to generate an invite code.</p>
                            <button
                              onClick={openCreateDuelModal}
                              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition"
                            >
                              Generate Invite Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "leaderboard" && (
                  <div className="w-full max-w-md space-y-2 text-left">
                    {leaderboard && leaderboard.length > 0 ? (
                      leaderboard.map((row, idx) => {
                        const rank = row.rank || idx + 1;
                        const name = row.name || (row.userId ? `User ${row.userId.substring(0,4)}` : "Unknown");
                        return (
                          <div key={rank} className="flex justify-between items-center p-2.5 border-b border-slate-50 dark:border-neutral-800 text-xs">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{rank}.</span>
                              {/* Avatar Circle */}
                              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-[9px] text-slate-650 dark:text-neutral-300 overflow-hidden shrink-0">
                                {row.avatarUrl ? (
                                  <img 
                                    src={row.avatarUrl} 
                                    alt={name} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover" 
                                    />
                                ) : (
                                  getInitials(name)
                                )}
                              </div>
                              <span className="font-semibold text-slate-850 dark:text-neutral-200">{name}</span>
                            </div>
                            <span className="font-bold text-primary">{row.rating} Rating</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        Leaderboard is currently empty.
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "history" && (
                  <div className="w-full text-left space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Match History</h4>
                      <input 
                        type="text" 
                        placeholder="Search opponent..." 
                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    {matchHistory && matchHistory.length > 0 ? (
                      <div className="space-y-3">
                        {matchHistory.map((b) => {
                          const opponentName = b.opponentName;
                          const topic = b.topic;
                          const date = new Date(b.startTime).toLocaleDateString();
                          const result = b.result;
                          const xpAwarded = `+${b.xpAwarded} XP`;
                          const ratingChange = b.ratingChange >= 0 ? `+${b.ratingChange} Rating` : `${b.ratingChange} Rating`;

                          return (
                            <div key={b.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 rounded-xl gap-4 text-xs transition hover:border-slate-200 dark:hover:border-neutral-700">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="font-bold text-slate-700 dark:text-neutral-200 text-sm truncate">
                                    You vs {opponentName}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    result === "Victory"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : result === "Defeat" ? "bg-red-500/10 text-red-500" : "bg-slate-500/10 text-slate-500"
                                  }`}>
                                    {result}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-neutral-400">
                                  <span className="flex items-center gap-1.5"><Target size={12} /> {topic}</span>
                                  <span className="flex items-center gap-1.5"><Clock size={12} /> {date}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 justify-between md:justify-end">
                                <div className="text-left md:text-right">
                                  <span className="font-bold text-primary dark:text-purple-400 block">{xpAwarded}</span>
                                  <span className={`text-[11px] font-bold ${ratingChange.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                                    {ratingChange}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (!ensureLoggedIn()) return;
                                    handleWatchLive("You", opponentName, topic);
                                  }}
                                  className="px-4 py-2 bg-white hover:bg-slate-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700 rounded-lg font-bold transition shadow-sm text-slate-700 dark:text-neutral-200"
                                >
                                  Replay
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm font-semibold text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-slate-200 dark:border-neutral-700">
                        No match history available yet.
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "streak" && (
                  <div className="w-full text-left space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-200 mb-1">Daily Streak</h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">Keep your learning momentum going by solving problems every day.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 text-center">
                        <Flame size={32} className="mx-auto mb-2 text-amber-500 animate-pulse" />
                        <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">{streakData?.current || 0}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Current Streak</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 text-center">
                        <Trophy size={32} className="mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">{streakData?.longest || 0}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Longest Streak</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 text-center">
                        <Calendar size={32} className="mx-auto mb-2 text-indigo-500" />
                        <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">14</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Days Active</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5">
                      <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4">Activity Heatmap (Last 30 Days)</h5>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const isActive = Math.random() > 0.4;
                          return (
                            <div 
                              key={i} 
                              className={`aspect-square rounded-lg transition ${isActive ? "bg-amber-400 dark:bg-amber-500" : "bg-slate-200 dark:bg-neutral-800"} hover:scale-110`}
                              title={isActive ? "Active" : "Inactive"}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* ─── Column 3: Right Sidebar ───────────────────────────────────────── */}
          <aside className="space-y-6">
            {/* Daily Streak Card */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Daily Streak</h3>
                <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-semibold cursor-default">
                  Milestone: {Math.max(10, Math.ceil(((streakData?.current || 0) + 1) / 10) * 10)}d
                </span>
              </div>

              <div className="flex items-center gap-3 bg-amber-500/10 p-3.5 border border-amber-500/20 rounded-xl mb-4 text-amber-500">
                <Flame size={28} className={(streakData?.current || 0) > 0 ? "animate-pulse" : "opacity-50"} />
                <div>
                  <div className="text-xl font-black leading-none">{streakData?.current || 0} Days</div>
                  <span className="text-[10px] text-slate-500 dark:text-amber-500/80 block mt-1 font-semibold">
                    Keep it up! Next milestone: {Math.max(10, Math.ceil(((streakData?.current || 0) + 1) / 10) * 10)} days
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-center gap-1 mb-4 border-b border-slate-100 dark:border-neutral-800/60 pb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => {
                  const today = new Date();
                  const currentDay = today.getDay();
                  const diff = idx - currentDay;
                  const dateToCheck = new Date();
                  dateToCheck.setDate(today.getDate() + diff);
                  
                  const isFuture = diff > 0;
                  const isActive = !isFuture && streakData?.isActive && streakData.isActive(dateToCheck);
                  
                  return (
                    <div key={day} className="flex flex-col items-center">
                      <span className={`text-[9px] block mb-1 font-semibold ${diff === 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-400 dark:text-neutral-500"}`}>{day[0]}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive
                          ? "bg-amber-500 text-white shadow-sm"
                          : isFuture ? "bg-slate-50 dark:bg-neutral-900/50 text-slate-300 dark:text-neutral-700" : "bg-slate-100 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600"
                        }`}>
                        {isActive ? "🔥" : "•"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Leaderboard Table */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200">
                    🏆 Global Leaderboard
                  </h3>
                </div>
                <span
                  onClick={() => handleTabChange("leaderboard")}
                  className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
                >
                  View All
                </span>
              </div>

              <div className="space-y-2.5">
                {leaderboard && leaderboard.length > 0 ? (
                  leaderboard.slice(0, 10).map((row, idx) => {
                    const rank = row.rank || idx + 1;
                    const name = row.name || (row.userId ? `User ${row.userId.substring(0, 4)}` : "Unknown");
                    const isCurrentUser = name === currentUserStats.name;
                    return (
                      <div
                        key={rank}
                        className={`flex items-center justify-between 
                        text-xs px-3 py-2.5 rounded-xl transition
                        ${isCurrentUser
                            ? "bg-purple-100 dark:bg-purple-900/30"
                            : "hover:bg-slate-50 dark:hover:bg-neutral-700/50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 text-center font-bold ${rank === 1 ? "text-amber-500" : rank === 2 ? "text-slate-400" : "text-slate-500"
                            }`}>
                            {rank}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-[9px] text-slate-600 dark:text-neutral-300 overflow-hidden shrink-0">
                            {row.avatarUrl ? (
                              <img src={row.avatarUrl} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            ) : (
                              getInitials(name)
                            )}
                          </div>
                          <span className="font-semibold text-slate-850 dark:text-neutral-200">{name}</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-neutral-300">{row.rating}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400">
                    Leaderboard is currently empty.
                  </div>
                )}
              </div>
            </div>

          </aside>

        </div>
      </div>

      <Footer />

      {/* ─── Interactive Modals ────────────────────────────────────────────── */}
      <MatchmakingModal
        isOpen={matchmakingOpen}
        onClose={() => closeMatchmakingModal()}
        onMatchFound={handleMatchFound}
        currentUserStats={currentUserStats}
      />

      <DuelSimulatorModal
        isOpen={duelSimulatorOpen}
        onClose={() => setDuelSimulatorOpen(false)}
        opponent={selectedOpponent}
        currentUserStats={currentUserStats}
        problemName={activeDuelProblem}
      />

      <CreateDuelModal
        isOpen={createDuelOpen}
        onClose={closeCreateDuelModal}
        onLaunch={handleCreateMatchLaunch}
        currentUserStats={currentUserStats}
      />

      <SpectatorSimulatorModal
        isOpen={spectatorModalOpen}
        onClose={() => {
          setSpectatorModalOpen(false);
          setSpectatingMatch(null);
        }}
        matchData={spectatingMatch}
      />
    </section>
  );
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  ScrollText, 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Lock,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

import CompanyLogos from "@/app/components/practice/CompanyLogos";
import Footer from "@/app/components/footer";
import { practiceData } from "@/lib/practiceData";
import { useUser } from "@/features/user/UserContext";
import { supabase } from "@/lib/supabase";

function isSpringBoot() {
  return typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_SPRING_BOOT_API === "true";
}

function apiBase() {
  return process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || "http://localhost:8080";
}

export default function SharedSheetPage() {
  const { sharedUserId } = useParams();
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [sharedItems, setSharedItems] = useState([]);
  const [error, setError] = useState(null);

  // Flatten all problems from practiceData to match metadata
  const allProblems = useMemo(() => {
    const list = [];
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          list.push({
            ...item,
            topic: topic.title,
            topicSlug: topic.slug,
          });
        });
      });
    });
    return list;
  }, []);

  // Fetch shared sheet details from backend
  useEffect(() => {
    async function fetchSharedSheet() {
      try {
        setLoading(true);
        let items = [];
        if (isSpringBoot()) {
          const res = await fetch(`${apiBase()}/api/v1/mysheet/shared/${sharedUserId}`);
          if (!res.ok) throw new Error("Failed to load shared sheet");
          const data = await res.json();
          items = data.items || [];
        } else {
          const res = await fetch(`/api/mysheet/shared/${sharedUserId}`);
          if (!res.ok) throw new Error("Failed to load shared sheet");
          const data = await res.json();
          items = data.items || [];
        }

        setSharedItems(items);
      } catch (err) {
        console.error("Shared sheet fetch error:", err);
        setError("This shared sheet could not be found or is private.");
      } finally {
        setLoading(false);
      }
    }

    if (sharedUserId) {
      fetchSharedSheet();
    }
  }, [sharedUserId]);

  // Map shared item IDs to full problem structures
  const mappedProblems = useMemo(() => {
    return sharedItems
      .map(item => {
        const prob = allProblems.find(p => p.id === item.problemId);
        return prob ? { ...prob, note: item.note } : null;
      })
      .filter(Boolean);
  }, [sharedItems, allProblems]);

  // Clone action
  const handleCloneSheet = async () => {
    if (!user) {
      toast.error("Please login to save this sheet to your profile!");
      router.push(`/login?redirectTo=/practice/shared/${sharedUserId}`);
      return;
    }

    try {
      setCloning(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      if (isSpringBoot()) {
        const res = await fetch(`${apiBase()}/api/v1/mysheet/clone/${sharedUserId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error("Cloning failed");
      } else {
        const res = await fetch(`/api/mysheet/clone/${sharedUserId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error("Cloning failed");
      }

      // Sync local storage on the next reload
      localStorage.removeItem("algobuddy_my_sheet");

      toast.success("Sheet successfully cloned to your profile! ✨");
      router.push("/practice?view=my-sheet");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clone sheet. Please try again.");
    } finally {
      setCloning(false);
    }
  };

  const isOwner = user && user.id === sharedUserId;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 transition-colors duration-300 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 w-full flex-grow">
        
        {/* Navigation */}
        <Link 
          href="/practice" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary dark:text-neutral-400 dark:hover:text-purple-400 transition mb-6"
        >
          <ArrowLeft size={14} />
          <span>Back to Practice</span>
        </Link>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary dark:text-purple-400 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-500">Retrieving shared sheet...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl p-12 text-center shadow-sm">
            <ScrollText className="w-16 h-16 text-slate-350 dark:text-neutral-700 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Sheet Not Found</h3>
            <p className="text-sm text-slate-400 dark:text-neutral-500 max-w-sm mx-auto mb-6">{error}</p>
            <Link 
              href="/practice"
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold transition hover:bg-primary-dark"
            >
              Back to Practice
            </Link>
          </div>
        ) : (
          /* Main Shared Content */
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-purple-500/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <ScrollText size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-purple-200">
                      Shared DSA Practice List
                    </span>
                  </div>
                  <h2 className="text-2xl font-black">Shared Practice Sheet</h2>
                  <p className="text-sm text-purple-200 mt-1">
                    Curated list containing {mappedProblems.length} problem{mappedProblems.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="shrink-0">
                  {isOwner ? (
                    <div className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-bold border border-white/20 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>This is your sheet</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleCloneSheet}
                      disabled={cloning}
                      className="px-5 py-2.5 bg-white text-purple-700 hover:bg-purple-50 disabled:opacity-50 rounded-xl text-sm font-black transition flex items-center gap-2 shadow-md"
                    >
                      {cloning ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user ? (
                        <Download size={15} />
                      ) : (
                        <Lock size={14} />
                      )}
                      <span>{user ? "Save to My Profile" : "Login to Save Sheet"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Problems Table */}
            {mappedProblems.length === 0 ? (
              <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl p-12 text-center shadow-sm">
                <p className="text-sm text-slate-400">This shared sheet has no problems inside it.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50/40 dark:bg-neutral-900/10 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800">
                        <th className="py-4 px-5 w-10 text-center">#</th>
                        <th className="py-4 px-5">Problem</th>
                        <th className="py-4 px-5">Topic</th>
                        <th className="py-4 px-5 text-center">Difficulty</th>
                        <th className="py-4 px-5 text-center">Companies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappedProblems.map((prob, idx) => (
                        <tr 
                          key={prob.id} 
                          className="border-b border-slate-50 dark:border-neutral-800/80 hover:bg-slate-50/20 dark:hover:bg-neutral-800/10 transition last:border-0"
                        >
                          <td className="py-4 px-5 text-center font-bold text-xs text-slate-400">
                            {idx + 1}
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
                              prob.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : prob.difficulty === "Medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}>
                              {prob.difficulty}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <div className="flex justify-center">
                              <CompanyLogos companies={prob.companies} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}



import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Save, X, RefreshCw, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/features/user/UserContext";

function LeetCodeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#f59e0b"
        d="M14.5 4.2 7.1 11.6a1.7 1.7 0 0 0 0 2.4l3.5 3.5a1.7 1.7 0 0 0 2.4 0l2.1-2.1a1.2 1.2 0 1 1 1.7 1.7l-2.1 2.1a4.1 4.1 0 0 1-5.8 0l-3.5-3.5a4.1 4.1 0 0 1 0-5.8l7.4-7.4a1.2 1.2 0 0 1 1.7 1.7Z"
      />
      <path fill="#111827" d="M10.5 12.2h8.1a1.2 1.2 0 1 1 0 2.4h-8.1a1.2 1.2 0 1 1 0-2.4Z" />
    </svg>
  );
}

function CodeforcesIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="10" width="4" height="10" rx="1" fill="#2563eb" />
      <rect x="10" y="5" width="4" height="15" rx="1" fill="#ef4444" />
      <rect x="16" y="8" width="4" height="12" rx="1" fill="#f59e0b" />
    </svg>
  );
}

function CodeChefIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#8b5e34"
        d="M7.1 14.6c-1.3-1.3-1.2-3.5.2-5l3.1-3.1c1.4-1.4 3.6-1.5 5-.2 1.2 1.2 1.2 3.3-.2 4.7l-3.3 3.3c-1.4 1.5-3.5 1.6-4.8.3Z"
      />
      <path
        fill="#f3c17a"
        d="M9.2 16.7a7 7 0 1 0 5.6-12.8 7 7 0 0 0-5.6 12.8Zm2.6-2.4a2.5 2.5 0 1 1 .4-5 2.5 2.5 0 0 1-.4 5Z"
      />
    </svg>
  );
}

const PLATFORMS = [
  {
    key: "leetcode",
    label: "LeetCode",
    usernameField: "leetcode_username",
    statField: "leetcode_solved",
    statLabel: "Solved",
    placeholder: "your-leetcode-username",
    Icon: LeetCodeIcon,
    profileUrl: (u) => `https://leetcode.com/${u}`,
  },
  {
    key: "codeforces",
    label: "Codeforces",
    usernameField: "codeforces_username",
    statField: "codeforces_rating",
    statLabel: "Rating",
    placeholder: "your-cf-handle",
    Icon: CodeforcesIcon,
    profileUrl: (u) => `https://codeforces.com/profile/${u}`,
  },
  {
    key: "codechef",
    label: "CodeChef",
    usernameField: "codechef_username",
    statField: "codechef_stars",
    statLabel: "Stars",
    placeholder: "your-codechef-username",
    Icon: CodeChefIcon,
    profileUrl: (u) => `https://www.codechef.com/users/${u}`,
  },
  {
    key: "github",
    label: "GitHub",
    usernameField: "github_username",
    statField: "github_contributions",
    statLabel: "Public Repos",
    placeholder: "your-github-username",
    Icon: Github,
    iconClass: "h-5 w-5 text-slate-900 dark:text-white",
    profileUrl: (u) => `https://github.com/${u}`,
  },
];

export default function CodingProfilesModal({ isOpen, onClose }) {
  const { user, setUser } = useUser();
  const meta = user?.user_metadata || {};

  // Reset state when modal opens to reflect latest user metadata
  useEffect(() => {
    if (isOpen) {
      setUsernames({
        leetcode_username: meta.leetcode_username || "",
        codeforces_username: meta.codeforces_username || "",
        codechef_username: meta.codechef_username || "",
        github_username: meta.github_username || "",
      });
      setStats({
        leetcode_solved: meta.leetcode_solved || 0,
        codeforces_rating: meta.codeforces_rating || 0,
        codechef_stars: meta.codechef_stars || 0,
        github_contributions: meta.github_contributions || 0,
      });
    }
  }, [isOpen, meta]);

  const [usernames, setUsernames] = useState({
    leetcode_username: meta.leetcode_username || "",
    codeforces_username: meta.codeforces_username || "",
    codechef_username: meta.codechef_username || "",
    github_username: meta.github_username || "",
  });

  const [stats, setStats] = useState({
    leetcode_solved: meta.leetcode_solved || 0,
    codeforces_rating: meta.codeforces_rating || 0,
    codechef_stars: meta.codechef_stars || 0,
    github_contributions: meta.github_contributions || 0,
  });

  const [fetching, setFetching] = useState({});
  const [saving, setSaving] = useState(false);

  const handleUsernameChange = (field, value) => {
    setUsernames((prev) => ({ ...prev, [field]: value }));
  };

  const fetchStats = async (platformKey) => {
    const platform = PLATFORMS.find((p) => p.key === platformKey);
    const username = usernames[platform.usernameField]?.trim();

    if (!username) {
      toast.error(`Enter a ${platform.label} username first`);
      return;
    }

    setFetching((prev) => ({ ...prev, [platformKey]: true }));

    try {
      const res = await fetch(`/api/coding-profiles/fetch?platform=${platformKey}&username=${encodeURIComponent(username)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch stats");

      setStats((prev) => ({ ...prev, [platform.statField]: data.value }));
      toast.success(`${platform.label} stats updated`);
    } catch (err) {
      toast.error(err.message || `Could not fetch ${platform.label} stats`);
    } finally {
      setFetching((prev) => ({ ...prev, [platformKey]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedMeta = { ...meta, ...usernames, ...stats };
      const { data, error } = await supabase.auth.updateUser({ data: updatedMeta });
      if (error) throw error;
      setUser(data.user);
      toast.success("Coding profiles saved");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save coding profiles");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-neutral-800 dark:bg-neutral-900"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-neutral-800">
              <div>
                <h2 className="text-xl font-black text-[#111331] dark:text-white">Coding Profiles</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-neutral-400">
                  Add your usernames and fetch live stats.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Platform rows */}
            <div className="divide-y divide-slate-100 px-6 dark:divide-neutral-800">
              {PLATFORMS.map((platform) => {
                const { key, label, usernameField, statField, statLabel, placeholder, Icon, iconClass, profileUrl } = platform;
                const username = usernames[usernameField];
                const stat = stats[statField];
                const isFetching = fetching[key];

                return (
                  <div key={key} className="py-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={iconClass} />
                        <span className="text-sm font-black text-[#111331] dark:text-white">{label}</span>
                        {stat > 0 && (
                          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-black text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                            {stat} {statLabel}
                          </span>
                        )}
                      </div>
                      {username && (
                        <a
                          href={profileUrl(username)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-violet-600 dark:text-neutral-500 dark:hover:text-violet-300"
                        >
                          View profile <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => handleUsernameChange(usernameField, e.target.value)}
                        placeholder={placeholder}
                        className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60"
                      />
                      <button
                        type="button"
                        onClick={() => fetchStats(key)}
                        disabled={isFetching || !username.trim()}
                        className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
                        {isFetching ? "Fetching..." : "Fetch"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/60">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-200 disabled:opacity-60 dark:bg-violet-500 dark:shadow-none"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Profiles"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
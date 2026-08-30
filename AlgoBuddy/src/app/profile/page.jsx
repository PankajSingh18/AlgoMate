"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {Award,BarChart3,Briefcase,Calendar,CheckCircle2,Code2,Download,Edit3,Eye,Flame,Folder,Github,Linkedin,Link as LinkIcon,MapPin,Medal,Plus,RefreshCw,Save,  ShieldCheck,Trash2,Trophy,User,X,} from "lucide-react";

import { useUser } from "@/features/user/UserContext";
import Footer from "@/app/components/footer";
import { supabase } from "@/lib/supabase";
import { practiceData } from "@/lib/practiceData";
import { useArenaProfile } from "@/app/hooks/useArenaProfile";
import { useRecentlyViewed } from "@/app/hooks/useRecentlyViewed";
import { useSheetProgress } from "@/app/hooks/useSheetProgress";


const heatLevelClass = {
  0: "bg-violet-50 dark:bg-neutral-800",
  1: "bg-violet-100 dark:bg-violet-950/40",
  2: "bg-violet-200 dark:bg-violet-900/60",
  3: "bg-violet-400 dark:bg-violet-700",
  4: "bg-violet-600 dark:bg-violet-500",
};

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;
const MAX_AVATAR_URL_LENGTH = 512;
const MAX_PROFILE_URL_LENGTH = 512;
const MAX_BIO_LENGTH = 300;
const PROFILE_URL_FIELDS = ["resume_link", "github_profile", "linkedin_profile"];
const PRESET_PROJECT_GRADIENTS = [
  "bg-[linear-gradient(135deg,#190f4f,#25116d_45%,#5338f2)]",
  "bg-[linear-gradient(135deg,#064e3b,#0f172a)]",
  "bg-[linear-gradient(135deg,#312e81,#111827)]",
  "bg-[linear-gradient(135deg,#7c2d12,#1c1917)]",
  "bg-[linear-gradient(135deg,#134e4a,#0f172a)]",
  "bg-[linear-gradient(135deg,#1e1b4b,#312e81)]",
];

const EMPTY_PROJECT = {
  title: "",
  subtitle: "",
  tags: "",
  url: "",
  preview: PRESET_PROJECT_GRADIENTS[0],
};

const CODING_PLATFORMS = [
  ["leetcode", "leetcode_username", "LeetCode Username", "leetcode_solved", "Solved"],
  ["codeforces", "codeforces_username", "Codeforces Handle", "codeforces_rating", "Rating"],
  ["codechef", "codechef_username", "CodeChef Username", "codechef_stars", "Stars"],
  ["github", "github_username", "GitHub Username", "github_contributions", "Contributions"],
];

const allPracticeProblems = practiceData.flatMap((topic) =>
  topic.subsections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      topic: topic.title,
      topicSlug: topic.slug,
    }))
  )
);

const getEntryStatus = (entry) => {
  if (!entry) return "Not Started";
  return typeof entry === "string" ? entry : entry.status || "Not Started";
};

const getEntryDate = (entry) => {
  const rawDate = typeof entry === "object" && entry ? entry.updatedAt || entry.updated_at : null;
  const date = rawDate ? new Date(rawDate) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);

const seededRandom = (seed) => {
  const value = Math.sin(seed * 9999) * 10000;
  return value - Math.floor(value);
};

const safeAvatarUrl = (value) => {
  if (typeof value !== "string") return "";
  if (value.startsWith("data:")) return "";
  if (value.length > MAX_AVATAR_URL_LENGTH) return "";
  return value;
};

const safeExternalUrl = (value) => {
  if (typeof value !== "string" || value.length > MAX_PROFILE_URL_LENGTH) return "";
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.toString();
  } catch {
    return "";
  }
};

const sanitizeProfileLinks = (data) => {
  const nextData = { ...data };

  for (const field of PROFILE_URL_FIELDS) {
    if (!nextData[field]) continue;
    const safeUrl = safeExternalUrl(nextData[field]);
    if (!safeUrl) {
      return { error: "Please enter valid http or https URLs for profile links." };
    }
    nextData[field] = safeUrl;
  }

  return { data: nextData };
};

function LeetCodeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#f59e0b"
        d="M14.5 4.2 7.1 11.6a1.7 1.7 0 0 0 0 2.4l3.5 3.5a1.7 1.7 0 0 0 2.4 0l2.1-2.1a1.2 1.2 0 1 1 1.7 1.7l-2.1 2.1a4.1 4.1 0 0 1-5.8 0l-3.5-3.5a4.1 4.1 0 0 1 0-5.8l7.4-7.4a1.2 1.2 0 0 1 1.7 1.7Z"
      />
      <path
        fill="#111827"
        d="M10.5 12.2h8.1a1.2 1.2 0 1 1 0 2.4h-8.1a1.2 1.2 0 1 1 0-2.4Z"
      />
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

export default function ProfilePage() {
  const { user, setUser, loading } = useUser();
  const { progress: sheetProgress, streakData } = useSheetProgress();
  const { profile: arenaProfile, leaderboard, matchHistory } = useArenaProfile(user);
  const { recentlyViewed } = useRecentlyViewed();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState({});
  const [importingRepos, setImportingRepos] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    location: "",
    skills: "",
    resume_link: "",
    github_profile: "",
    linkedin_profile: "",
    email_notifications: true,
    avatar_url: "",
    leetcode_username: "",
    leetcode_solved: 0,
    codeforces_username: "",
    codeforces_rating: 0,
    codechef_username: "",
    codechef_stars: 0,
    github_username: "",
    github_contributions: 0,
    projects: [],
  });
  
  

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const meta = user.user_metadata || {};
      setFormData({
        name: meta.name || "",
        branch: meta.branch || "",
        location: meta.location || meta.address || "",
        skills: (meta.skills || "").slice(0, MAX_BIO_LENGTH),
        resume_link: meta.resume_link || "",
        github_profile: meta.github_profile || "",
        linkedin_profile: meta.linkedin_profile || "",
        email_notifications: meta.email_notifications !== false,
        avatar_url: safeAvatarUrl(meta.avatar_url || meta.picture),
        leetcode_username: meta.leetcode_username || "",
        leetcode_solved: meta.leetcode_solved || 0,
        codeforces_username: meta.codeforces_username || "",
        codeforces_rating: meta.codeforces_rating || 0,
        codechef_username: meta.codechef_username || "",
        codechef_stars: meta.codechef_stars || 0,
        github_username: meta.github_username || "",
        github_contributions: meta.github_contributions || 0,
        projects: Array.isArray(meta.projects) ? meta.projects : [],
      });
    }
  }, [loading, router, user]);

  const progressEntries = useMemo(
    () =>
      Object.entries(sheetProgress || {}).map(([id, entry]) => ({
        id,
        status: getEntryStatus(entry),
        updatedAt: getEntryDate(entry),
      })),
    [sheetProgress]
  );

  const completedEntries = useMemo(
    () => progressEntries.filter((entry) => entry.status === "Completed"),
    [progressEntries]
  );

  const realStats = useMemo(() => {
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const solvedThisMonth = completedEntries.filter(
      (entry) => entry.updatedAt && entry.updatedAt >= monthAgo
    ).length;

    const attemptedCount = progressEntries.filter(
      (entry) => entry.status && entry.status !== "Not Started"
    ).length;

    return {
      solvedCount: completedEntries.length,
      solvedThisMonth: solvedThisMonth || streakData?.monthlySolved || 0,
      attemptedCount,
      totalProblems: allPracticeProblems.length,
    };
  }, [completedEntries, progressEntries, streakData?.monthlySolved]);

  const activitySummary = useMemo(() => {
    const heatmapData = Array.from({ length: 343 }, (_, index) => {
      const wave = Math.sin(index / 9) + Math.cos(index / 17);
      const activityChance = 0.42 + wave * 0.08;
      const activityRoll = seededRandom(index + 1);
      const levelRoll = seededRandom(index + 101);

      if (activityRoll > activityChance) return 0;
      if (levelRoll > 0.74) return 4;
      if (levelRoll > 0.58) return 3;
      if (levelRoll > 0.38) return 2;
      return 1;
    });

    return {
      heatmapData,
      activeDays: heatmapData.filter((level) => level > 0).length,
    };
  }, []);

  const dsaProgress = useMemo(
    () =>
      practiceData.map((topic) => {
        const topicProblems = topic.subsections.flatMap((section) => section.items);
        const solved = topicProblems.filter((problem) =>
          completedEntries.some((entry) => entry.id === problem.id)
        ).length;
        const value = topicProblems.length > 0 ? Math.round((solved / topicProblems.length) * 100) : 0;
        return [topic.title, value];
      }),
    [completedEntries]
  );

  const unlockedBadges = useMemo(
    () => [
      ["First Problem", realStats.solvedCount >= 1],
      ["50 Problems", realStats.solvedCount >= 50],
      ["100 Problems", realStats.solvedCount >= 100],
      ["7 Day Streak", (streakData?.current || 0) >= 7],
      ["30 Day Streak", (streakData?.current || 0) >= 30],
      ["Arena Winner", (arenaProfile?.battlesWon || 0) >= 1],
      ["Top 50 Arena", (arenaProfile?.rank || 999) <= 50],
      ["Explorer", recentlyViewed.length >= 5],
    ],
    [arenaProfile?.battlesWon, arenaProfile?.rank, realStats.solvedCount, recentlyViewed.length, streakData?.current]
  );

  const displayName = formData.name || user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const handle = formData.github_profile
    ? `@${formData.github_profile.replace(/\/$/, "").split("/").pop()}`
    : `@${user?.email?.split('@')[0] || "user"}`;
  const branch = formData.branch || "Add your branch";
  const location = formData.location || "Add your location";
  const bio = formData.skills || "No bio provided.";
  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recently";
  const arenaLevel = arenaProfile?.level || Math.max(1, Math.floor(realStats.solvedCount / 25) + 1);
  const arenaXp = arenaProfile?.xp || realStats.solvedCount * 10;
  const xpStep = 1000;
  const currentLevelXp = arenaXp % xpStep;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / xpStep) * 100));
  const arenaRank = arenaProfile?.rank || leaderboard.find((row) => row.userId === user?.id)?.rank || 0;
  const battlesWon =
    arenaProfile?.battlesWon ??
    matchHistory.filter((match) => match.result === "Victory").length;
  const arenaRating = arenaProfile?.rating || 0;
  const totalBadges = unlockedBadges.filter(([, unlocked]) => unlocked).length;
  const activeProjects = Array.isArray(user?.user_metadata?.projects)
    ? user.user_metadata.projects.length
    : 0;
  const visualizedCount = recentlyViewed.filter((item) =>
    item.path?.includes("/visualizer")
  ).length;

  const stats = [
    {
      icon: Code2,
      value: formatNumber(realStats.solvedCount),
      label: "Solved Problems",
      note: `${formatNumber(realStats.solvedThisMonth)} this month`,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300",
    },
    {
      icon: Eye,
      value: formatNumber(visualizedCount),
      label: "Visualized",
      note: `${recentlyViewed.length} recent views`,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    {
      icon: Medal,
      value: formatNumber(battlesWon),
      label: "Battles Won",
      note: `${matchHistory.length} total matches`,
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300",
    },
    {
      icon: BarChart3,
      value: formatNumber(arenaRating),
      label: "Contest Rating",
      note: arenaRank ? `Rank #${arenaRank}` : "Unranked",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300",
    },
    {
      icon: Folder,
      value: formatNumber(activeProjects),
      label: "Projects",
      note: activeProjects ? "From profile" : "Add projects",
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300",
    },
    {
      icon: Award,
      value: formatNumber(totalBadges),
      label: "Badges",
      note: `${unlockedBadges.length} available`,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300",
    },
  ];

  const badges = unlockedBadges.filter(([, unlocked]) => unlocked).slice(0, 4);
  const visibleBadges = badges.length > 0 ? badges : [["Start Solving", true]];

  const projects = useMemo(
    ()=>
      Array.isArray(user?.user_metadata?.projects)
    ? user.user_metadata.projects.slice(0,3)
    : [],
    [user]
  );

  const profiles = [
    {
      name: "LeetCode",
      value: user?.user_metadata?.leetcode_solved || 0,
      label: "Solved",
      icon: LeetCodeIcon,
      accent: "border-amber-100 bg-amber-50/70 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300",
    },
    {
      name: "Codeforces",
      value: user?.user_metadata?.codeforces_rating || 0,
      label: "Rating",
      icon: CodeforcesIcon,
      accent: "border-blue-100 bg-blue-50/70 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-300",
    },
    {
      name: "CodeChef",
      value: user?.user_metadata?.codechef_stars || 0,
      label: "Stars",
      icon: CodeChefIcon,
      accent: "border-orange-100 bg-orange-50/70 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/20 dark:text-orange-300",
    },
    {
      name: "GitHub",
      value: user?.user_metadata?.github_contributions || 0,
      label: "Contributions",
      icon: Github,
      accent: "border-slate-200 bg-slate-50 text-slate-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
    },
  ];
  const progress = dsaProgress;

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > MAX_AVATAR_FILE_SIZE) {
      event.target.value = "";
      toast.error("Image size should be less than 2MB");
      return;
    }

    const uploadAvatar = async () => {
      setSavingAvatar(true);

      try {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from(AVATAR_BUCKET)
          .getPublicUrl(filePath);

        const avatarUrl = safeAvatarUrl(publicUrlData?.publicUrl);
        if (!avatarUrl) throw new Error("Could not create a compact avatar URL");

        const nextProfileData = { ...formData, avatar_url: avatarUrl };
        setFormData(nextProfileData);

        const { data, error } = await supabase.auth.updateUser({
          data: nextProfileData,
        });

        if (error) throw error;
        setUser(data.user);
        toast.success("Profile photo updated");
      } catch (error) {
        console.error(error);
        toast.error(
          error.message?.includes("Bucket")
            ? "Create a public Supabase Storage bucket named avatars"
            : "Failed to update profile photo"
        );
      } finally {
        setSavingAvatar(false);
        event.target.value = "";
      }
    };

    uploadAvatar();
  };

  const handleChange = (event) => {
    const { name, type, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "skills" ? value.slice(0, MAX_BIO_LENGTH) : type === "number" ? Number(value) : value,
    }));
  };

  const resetProjectForm = () => {
    setProjectForm(EMPTY_PROJECT);
    setEditingProjectIndex(null);
  };

  const handleProjectFormChange = (field, value) => {
    setProjectForm((current) => ({ ...current, [field]: value }));
  };

  const fetchCodingProfileStat = async (platformKey, usernameField, statField, platformLabel) => {
    const username = formData[usernameField]?.trim();

    if (!username) {
      toast.error(`Enter a ${platformLabel} username first`);
      return;
    }

    setFetchingProfile((current) => ({ ...current, [platformKey]: true }));

    try {
      const response = await fetch(
        `/api/coding-profiles/fetch?platform=${platformKey}&username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || `Could not fetch ${platformLabel} stats`);

      setFormData((current) => ({ ...current, [statField]: data.value || 0 }));
      toast.success(`${platformLabel} stats fetched`);
    } catch (error) {
      toast.error(error.message || `Could not fetch ${platformLabel} stats`);
    } finally {
      setFetchingProfile((current) => ({ ...current, [platformKey]: false }));
    }
  };

  const handleAddProject = () => {
    setProjectForm(EMPTY_PROJECT);
    setEditingProjectIndex(-1);
  };

  const handleImportFromGitHub = async () => {
    const username = formData.github_username?.trim();

    if (!username) {
      toast.error("Add your GitHub username in Coding Profiles first");
      return;
    }

    setImportingRepos(true);

    try {
      const response = await fetch(`/api/github-repos?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch GitHub repos");

      setGithubRepos(data.repos || []);
      if (!data.repos?.length) toast.error("No public repositories found");
    } catch (error) {
      toast.error(error.message || "Could not fetch GitHub repos");
    } finally {
      setImportingRepos(false);
    }
  };

  const handleSelectRepo = (repo) => {
    const tags = [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 4);

    setProjectForm({
      title: repo.name || "",
      subtitle: repo.description || "",
      tags: tags.join(", "),
      url: repo.html_url || "",
      preview: PRESET_PROJECT_GRADIENTS[Math.floor(Math.random() * PRESET_PROJECT_GRADIENTS.length)],
    });
    setEditingProjectIndex(-1);
    setGithubRepos([]);
  };

  const handleEditProject = (index) => {
    const project = formData.projects[index];
    setProjectForm({
      title: project.title || "",
      subtitle: project.subtitle || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
      url: project.url || "",
      preview: project.preview || PRESET_PROJECT_GRADIENTS[0],
    });
    setEditingProjectIndex(index);
  };

  const handleSaveProject = () => {
    if (!projectForm.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    const nextProject = {
      title: projectForm.title.trim(),
      subtitle: projectForm.subtitle.trim(),
      tags: projectForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 4),
      url: projectForm.url.trim(),
      preview: projectForm.preview,
    };

    setFormData((current) => {
      const currentProjects = Array.isArray(current.projects) ? current.projects : [];
      const projects =
        editingProjectIndex === -1
          ? [...currentProjects, nextProject]
          : currentProjects.map((project, index) =>
              index === editingProjectIndex ? nextProject : project
            );

      return { ...current, projects };
    });
    resetProjectForm();
  };

  const handleDeleteProject = (index) => {
    setFormData((current) => ({
      ...current,
      projects: current.projects.filter((_, projectIndex) => projectIndex !== index),
    }));
    if (editingProjectIndex === index) resetProjectForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sanitized = sanitizeProfileLinks(formData);
    if (sanitized.error) {
      toast.error(sanitized.error);
      return;
    }

    setSaving(true);

    try {
      const nextProfileData = {
        ...sanitized.data,
        leetcode_solved: Number(sanitized.data.leetcode_solved) || 0,
        codeforces_rating: Number(sanitized.data.codeforces_rating) || 0,
        codechef_stars: Number(sanitized.data.codechef_stars) || 0,
        github_contributions: Number(sanitized.data.github_contributions) || 0,
        projects: Array.isArray(sanitized.data.projects) ? sanitized.data.projects : [],
      };

      const { data, error } = await supabase.auth.updateUser({ data: nextProfileData });

      if (error) throw error;

      setUser(data.user);
      setFormData(nextProfileData);
      setIsEditOpen(false);
      resetProjectForm();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-100 border-t-violet-600 dark:border-neutral-800 dark:border-t-violet-400" />
      </div>
    );
  }

  return (
    <>
    <main className="min-h-screen bg-white px-4 pb-8 pt-2 text-[#141a3a] transition-colors dark:bg-neutral-950 dark:text-neutral-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:p-8">
          <div className="relative flex flex-col gap-6">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-600 text-white shadow-sm shadow-purple-500/20 transition hover:bg-purple-800 dark:border-purple-400/30 dark:bg-purple-700 dark:hover:bg-purple-900"
              aria-label="Edit profile"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="mx-auto flex shrink-0 flex-col items-center sm:mx-0">
                <div className="relative h-32 w-32 sm:h-36 sm:w-36">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full w-full overflow-hidden rounded-full border-[6px] border-slate-100 bg-slate-100 shadow-inner dark:border-neutral-800 dark:bg-neutral-800"
                    aria-label="Change profile photo"
                  >
                    {formData.avatar_url ? (
                      <img
                        src={formData.avatar_url}
                        alt={displayName}
                        width={144}
                        height={144}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-violet-100 text-4xl font-black text-violet-700 dark:bg-violet-950/50 dark:text-violet-200">
                        {initials}
                      </span>
                    )}
                    {savingAvatar && (
                      <span className="absolute inset-0 flex items-center justify-center bg-slate-950/50 text-xs font-black text-white">
                        Saving
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/40 bg-purple-600 text-white shadow-md shadow-purple-500/20 transition hover:bg-purple-800 dark:border-purple-400/30 dark:bg-purple-700 dark:hover:bg-purple-900"
                    aria-label="Upload avatar"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                {[
                  [Github, safeExternalUrl(formData.github_profile), "GitHub"],
                  [LinkIcon, safeExternalUrl(formData.resume_link), "Resume"],
                  [Linkedin, safeExternalUrl(formData.linkedin_profile), "LinkedIn"],
                ].some(([, href]) => href) && (
                  <div className="mt-6 flex justify-center gap-2">
                    {[
                      [Github, safeExternalUrl(formData.github_profile), "GitHub"],
                      [LinkIcon, safeExternalUrl(formData.resume_link), "Resume"],
                      [Linkedin, safeExternalUrl(formData.linkedin_profile), "LinkedIn"],
                    ].filter(([, href]) => href).map(([Icon, href, label]) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-600 text-white shadow-sm shadow-purple-500/20 transition hover:bg-purple-800 dark:border-purple-400/30 dark:bg-purple-700 dark:hover:bg-purple-900"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-center pt-4 text-center sm:items-start sm:pt-0 sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-3xl font-black tracking-tight text-[#111331] dark:text-white sm:text-4xl">
                  {displayName}
                </h1>
                <CheckCircle2 className="h-6 w-6 fill-violet-600 text-white" />
              </div>
              <p className="mt-1 text-base font-bold text-violet-600 dark:text-violet-300">{handle}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-500 dark:text-neutral-400 sm:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  {branch}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Joined {joinedDate}
                </span>
              </div>

              <p className="mt-4 max-w-xl text-[15px] font-semibold leading-7 text-slate-600 dark:text-neutral-300">
                {bio}
              </p>

              </div>
            </div>

              <div className="w-full">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.name}
                      className="group flex min-h-[82px] items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-violet-900/70 dark:hover:bg-neutral-800 dark:hover:shadow-none"
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${profile.accent}`}>
                        <profile.icon
                          className={
                            profile.name === "GitHub"
                              ? "h-5 w-5"
                              : "h-6 w-6"
                          }
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-center">
                        <p className="text-sm font-black leading-tight text-[#111331] dark:text-white">
                          {profile.name}
                        </p>
                        <p className="mt-1 text-[11px] font-bold leading-tight text-slate-500 dark:text-neutral-400">
                          {profile.label}
                        </p>
                        <p className="mt-2 text-2xl font-black leading-none text-[#111331] dark:text-white">
                          {formatNumber(profile.value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>

          <div className="space-y-6 border-t border-slate-100 pt-6 dark:border-neutral-800 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700 ring-8 ring-violet-50 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-950/30">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-black">Level {arenaLevel}</p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-violet-600 dark:bg-violet-400"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-xs font-bold text-slate-500 dark:text-neutral-400">
                  {formatNumber(currentLevelXp)} / {formatNumber(xpStep)} XP
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-100 rounded-xl border border-slate-100 py-4 dark:divide-neutral-800 dark:border-neutral-800">
              <div className="flex items-center justify-center gap-3">
                <Flame className="h-7 w-7 rounded-lg bg-orange-50 p-1.5 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300" />
                <div>
                  <p className="text-xl font-black">{streakData?.current || 0}</p>
                  <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">Day Streak</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Trophy className="h-7 w-7 rounded-lg bg-amber-50 p-1.5 text-amber-500 dark:bg-amber-950/40 dark:text-amber-300" />
                <div>
                  <p className="text-xl font-black">{arenaRank ? `#${arenaRank}` : "--"}</p>
                  <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">Arena Rank</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black">Top Badges</h2>
              </div>
              <div className="mt-4 flex min-h-[110px] items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 text-center dark:border-violet-900/60 dark:bg-violet-950/20">
              <div>
                <Award className="mx-auto h-7 w-7 text-violet-600 dark:text-violet-300" />
                <p className="mt-2 text-sm font-black text-violet-700 dark:text-violet-200">
                  Coming Soon
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                  Badges will appear here after achievements are live.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#111331] dark:text-white">{item.value}</p>
                  <p className="text-xs font-bold text-slate-600 dark:text-neutral-300">{item.label}</p>
                  <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">{item.note}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-black">Consistency</h2>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-neutral-700 dark:text-neutral-300">
              Last 365 days
            </button>
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_190px]">
            <div className="min-w-0 pb-1">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="mt-7 grid shrink-0 grid-rows-7 gap-1 text-[10px] font-bold leading-3 text-slate-500 dark:text-neutral-400 sm:gap-1.5 sm:text-xs sm:leading-4">
                  {["Mon", "", "Tue", "", "Wed", "", "Sun"].map((day, index) => (
                    <span key={`${day}-${index}`} className="flex h-2.5 items-center sm:h-3">
                      {day}
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700">
                  <div className="w-max">
                    <div className="mb-2 grid grid-cols-7 text-xs font-bold text-slate-400 dark:text-neutral-500">
                      {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                        <span key={month} className="text-center">
                          {month}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-flow-col grid-rows-7 gap-1 sm:gap-1.5">
                      {activitySummary.heatmapData.map((level, index) => (
                        <span
                          key={index}
                          className={`h-2.5 w-2.5 rounded-[3px] sm:h-3 sm:w-3 sm:rounded-[4px] ${heatLevelClass[level]}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid content-center gap-4 border-t border-slate-100 pt-4 dark:border-neutral-800 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              {[
                [Code2, formatNumber(realStats.solvedCount), "Solved Problems", "text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300"],
                [Flame, `${streakData?.best || 0} days`, "Longest Streak", "text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300"],
                [Calendar, formatNumber(activitySummary.activeDays), "Active Days", "text-slate-700 bg-slate-50 dark:bg-neutral-800 dark:text-neutral-200"],
              ].map(([Icon, value, label, color]) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className={`h-9 w-9 rounded-lg p-2 ${color}`} />
                  <div>
                    <p className="text-lg font-black">{value}</p>
                    <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[1.35fr_0.75fr_1fr]">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-black">My Projects</h2>
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="text-xs font-black text-violet-600 dark:text-violet-300 hover:underline"
              >
                Manage Projects -&gt;
              </button>
            </div>
            {projects.length == 0 ? (
              <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 text-center dark:border-violet-900/60 dark:bg-violet-950/20">
                <div>
                  <p className="text-sm font-black text-violet-700 dark:text-violet-200">No projects yet</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                    CLick Manage Projects to add yours
                  </p>
                </div>
              </div>
            ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className={`relative h-24 ${project.preview}`}>
                    {project.url &&(
                       <a
                       href={project.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-slate-700 shadow-sm dark:bg-neutral-900/90 dark:text-neutral-200"
                       aria-label={`Open ${project.title}`}
                     >
                       <LinkIcon className="h-3.5 w-3.5" />
                     </a>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="truncate text-sm font-black text-[#111331] dark:text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                      {project.subtitle}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-violet-50 px-1.5 py-1 text-[10px] font-black text-violet-600 dark:bg-violet-950/40 dark:text-violet-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-black">DSA Progress</h2>
              <button onClick={() => router.push("/roadmaps")} className="text-xs font-black text-violet-600 dark:text-violet-300">View Full Roadmap -&gt;</button>
            </div>
            <div className="space-y-3">
              {progress.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr_38px] items-center gap-3">
                  <span className="text-xs font-bold text-slate-600 dark:text-neutral-300">{label}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800">
                    <div className="h-full rounded-full bg-violet-600 dark:bg-violet-400" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-right text-xs font-black text-slate-600 dark:text-neutral-300">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsEditOpen(false);
              resetProjectForm();
            }}
          >
            <motion.form
              onSubmit={handleSubmit}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-neutral-800 dark:bg-neutral-900"
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-neutral-800">
                <div>
                  <h2 className="text-xl font-black text-[#111331] dark:text-white">Edit Profile</h2>
                  <p className="text-sm font-semibold text-slate-500 dark:text-neutral-400">Update the details shown on your profile.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    resetProjectForm();
                  }}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                  aria-label="Close edit profile"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["name", "Full Name", "John Doe", User],
                    ["branch", "Branch", "Computer Science", ShieldCheck],
                    ["location", "Location", "City, Country", MapPin],
                    ["skills", "Bio", "Software Engineer passionate about...", Code2],
                    ["github_profile", "GitHub URL", "https://github.com/...", Github],
                    ["linkedin_profile", "LinkedIn URL", "https://linkedin.com/in/...", Linkedin],
                    ["resume_link", "Resume URL", "https://drive.google.com/...", Briefcase],
                  ].map(([name, label, placeholder, Icon]) => (
                    <label key={name} className={name === "skills" ? "sm:col-span-2" : undefined}>
                      <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-neutral-400">
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                          {label}
                        </span>
                        {name === "skills" && (
                          <span className="normal-case tracking-normal text-slate-400 dark:text-neutral-500">
                            {formData.skills.length}/{MAX_BIO_LENGTH}
                          </span>
                        )}
                      </span>
                      <input
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        maxLength={name === "skills" ? MAX_BIO_LENGTH : undefined}
                        placeholder={placeholder}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5 dark:border-neutral-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#111331] dark:text-white">Coding Profiles</h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        Usernames and stats shown on your profile.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {CODING_PLATFORMS.map(([platformKey, usernameField, usernameLabel, statField, statLabel]) => (
                      <div key={usernameField} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-950/60">
                        <label>
                          <span className="mb-1.5 block text-xs font-black text-slate-500 dark:text-neutral-400">
                            {usernameLabel}
                          </span>
                          <div className="flex gap-2">
                            <input
                              name={usernameField}
                              value={formData[usernameField]}
                              onChange={handleChange}
                              placeholder="username"
                              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                fetchCodingProfileStat(
                                  platformKey,
                                  usernameField,
                                  statField,
                                  usernameLabel.replace(" Username", "").replace(" Handle", "")
                                )
                              }
                              disabled={fetchingProfile[platformKey] || !formData[usernameField]?.trim()}
                              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${fetchingProfile[platformKey] ? "animate-spin" : ""}`} />
                              Fetch
                            </button>
                          </div>
                        </label>
                        <div className="mt-3 rounded-lg border border-slate-100 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
                          <span className="text-[11px] font-black text-slate-500 dark:text-neutral-400">
                            {statLabel}
                          </span>
                          <p className="mt-1 text-lg font-black text-[#111331] dark:text-white">
                            {formatNumber(formData[statField])}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5 dark:border-neutral-800">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-[#111331] dark:text-white">Projects</h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        Add up to the projects shown on your profile.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleImportFromGitHub}
                        disabled={importingRepos}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
                      >
                        <Github className="h-3.5 w-3.5" />
                        {importingRepos ? "Fetching..." : "Import GitHub"}
                        {!importingRepos && <Download className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 text-xs font-black text-violet-700 transition hover:bg-violet-100 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </button>
                    </div>
                  </div>

                  {githubRepos.length > 0 && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-700">
                      <p className="border-b border-slate-100 px-3 py-2 text-xs font-black text-slate-500 dark:border-neutral-800 dark:text-neutral-400">
                        Select a GitHub repo
                      </p>
                      <div className="max-h-44 overflow-y-auto">
                        {githubRepos.map((repo) => (
                          <button
                            key={repo.name}
                            type="button"
                            onClick={() => handleSelectRepo(repo)}
                            className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-violet-50 dark:hover:bg-violet-950/30"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-[#111331] dark:text-white">{repo.name}</p>
                              {repo.description && (
                                <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                                  {repo.description}
                                </p>
                              )}
                            </div>
                            {repo.language && (
                              <span className="shrink-0 rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-black text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                                {repo.language}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingProjectIndex !== null && (
                    <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-900/60 dark:bg-violet-950/20">
                      <p className="mb-3 text-xs font-black uppercase tracking-wide text-violet-600 dark:text-violet-300">
                        {editingProjectIndex === -1 ? "New Project" : "Edit Project"}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          ["title", "Project title", "Portfolio Website"],
                          ["subtitle", "Short description", "React app with animations"],
                          ["tags", "Tags", "React, Tailwind, API"],
                          ["url", "Project URL", "https://..."],
                        ].map(([field, label, placeholder]) => (
                          <label key={field}>
                            <span className="mb-1.5 block text-xs font-black text-slate-500 dark:text-neutral-400">
                              {label}
                            </span>
                            <input
                              value={projectForm[field]}
                              onChange={(event) => handleProjectFormChange(field, event.target.value)}
                              placeholder={placeholder}
                              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60"
                            />
                          </label>
                        ))}
                      </div>
                      <div className="mt-3">
                        <p className="mb-2 text-xs font-black text-slate-500 dark:text-neutral-400">Preview color</p>
                        <div className="flex flex-wrap gap-2">
                          {PRESET_PROJECT_GRADIENTS.map((gradient) => (
                            <button
                              key={gradient}
                              type="button"
                              onClick={() => handleProjectFormChange("preview", gradient)}
                              className={`h-8 w-8 rounded-lg ${gradient} ${
                                projectForm.preview === gradient
                                  ? "ring-2 ring-violet-600 ring-offset-2 dark:ring-violet-400 dark:ring-offset-neutral-900"
                                  : ""
                              }`}
                              aria-label="Select project preview color"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={resetProjectForm}
                          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 dark:border-neutral-700 dark:text-neutral-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveProject}
                          className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white dark:bg-violet-500"
                        >
                          {editingProjectIndex === -1 ? "Add Project" : "Update Project"}
                        </button>
                      </div>
                    </div>
                  )}

                  {formData.projects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/50 px-4 py-5 text-center text-sm font-bold text-slate-500 dark:border-violet-900/60 dark:bg-violet-950/20 dark:text-neutral-400">
                      No projects yet.
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {formData.projects.map((project, index) => (
                        <div key={`${project.title}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                          <div className={`h-10 w-10 shrink-0 rounded-lg ${project.preview}`} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-[#111331] dark:text-white">{project.title}</p>
                            <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">{project.subtitle}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleEditProject(index)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-black text-slate-600 hover:border-violet-300 hover:text-violet-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-violet-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(index)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 dark:border-neutral-700 dark:text-neutral-500 dark:hover:text-red-400"
                            aria-label="Delete project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    resetProjectForm();
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-200 disabled:opacity-60 dark:bg-violet-500 dark:shadow-none"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    <Footer />
    </>
  );
}

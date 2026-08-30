import { supabase } from "@/lib/supabase";
import { api } from "./apiClient";

const trackActivity = async (type = "site_visit") => {
  try {
    await api.request("/api/activity", {
      method: "POST",
      body: { type, localDate: getLocalISODate() },
    });
    return { success: true };
  } catch (e) {
    console.error("trackActivity failed:", e);
    return { success: false, error: e };
  }
};

const getLocalISODate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const computeStreak = (activities) => {
  if (!activities || activities.length === 0) return 0;

  const dates = activities
    .filter(Boolean)
    .map((a) => {
      const d = new Date(a.activity_date || a.created_at);
      return d.toISOString().split("T")[0];
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a));

  if (dates.length === 0) return 0;

  const uniqueDates = [...new Set(dates)];
  let streak = 1;
  const today = getLocalISODate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // Only count streak if most recent activity is today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterdayStr) return 0;

  for (let i = 1; i < uniqueDates.length; i++) {
    const curr = new Date(uniqueDates[i - 1]);
    const prev = new Date(uniqueDates[i]);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const getStreakData = async (userId, days = 30) => {
  if (!userId) return { streak: 0, activities: [] };

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString();

  try {
    const { data, error } = await supabase
      .from("user_activity")
      .select("activity_date, created_at")
      .eq("user_id", userId)
      .gte("created_at", sinceStr)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getStreakData error:", error);
      return { streak: 0, activities: [] };
    }

    return {
      streak: computeStreak(data || []),
      activities: data || [],
    };
  } catch (e) {
    console.error("getStreakData exception:", e);
    return { streak: 0, activities: [] };
  }
};

export { trackActivity, getStreakData, computeStreak };

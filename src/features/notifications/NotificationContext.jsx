"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@/features/user/UserContext";
import { useSheetProgress } from "@/app/hooks/useSheetProgress";
import { api } from "@/lib/apiClient";
const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];
const SOLVED_MILESTONES = [10, 25, 50, 100, 200];

const FIRED_MILESTONES_KEY = "algobuddy_fired_milestones";

function readFiredMilestones() {
  try {
    const raw = localStorage.getItem(FIRED_MILESTONES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markMilestoneFired(id) {
  try {
    const fired = readFiredMilestones();
    fired.add(id);
    localStorage.setItem(FIRED_MILESTONES_KEY, JSON.stringify([...fired]));
  } catch {}
}

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useUser();
  const { streakData, progress } = useSheetProgress();
  const [notifications, setNotifications] = useState([]);
  const [mounted, setMounted] = useState(false);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      return [notification, ...prev];
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("algobuddy_notifications");
      if (saved) {
        // New accounts (no saved key yet) correctly start with an empty
        // list instead of being seeded with fake achievement/streak data.
        setNotifications(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading notifications:", e);
    }
  }, []);

  // Fire real streak-milestone notifications based on actual streakData,
  // not hardcoded content. Each milestone notifies exactly once per
  // account, even across deletes/reloads.
  useEffect(() => {
    if (!mounted) return;
    const fired = readFiredMilestones();

    STREAK_MILESTONES.forEach((milestone) => {
      const id = `streak-${milestone}`;
      if (streakData.current >= milestone && !fired.has(id)) {
        addNotification({
          id,
          category: "Streak",
          title: `🔥 ${milestone} Day Streak Achieved`,
          message: `You've practiced for ${milestone} days in a row. Keep it up!`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: "high",
          actionUrl: "/arena",
        });
        markMilestoneFired(id);
      }
    });
  }, [mounted, streakData.current, addNotification]);

  useEffect(() => {
    if (!mounted) return;
    const solvedCount = Object.values(progress).filter(
      (entry) => (typeof entry === "string" ? entry : entry?.status) === "Completed"
    ).length;
    const fired = readFiredMilestones();

    SOLVED_MILESTONES.forEach((milestone) => {
      const id = `solved-${milestone}`;
      if (solvedCount >= milestone && !fired.has(id)) {
        addNotification({
          id,
          category: "Achievement",
          title: "🏆 Achievement Unlocked",
          message: `You have completed ${milestone} algorithms! Keep up the momentum.`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: "high",
          actionUrl: "/profile",
        });
        markMilestoneFired(id);
      }
    });
  }, [mounted, progress, addNotification]);

  useEffect(() => {
    if (!mounted || !user) return;

    const jobIds = new Set();

    async function fetchJobNotifications() {
      try {
        const res = await fetch("/api/notifications?limit=20");
        if (!res.ok) return;
        const data = await res.json();
        (data.notifications || []).forEach((n) => {
          const notifId = `job-${n.id}`;
          jobIds.add(n.id);
          addNotification({
            id: notifId,
            category: n.type === "application_status_update" ? "Job Application" : "Job Alert",
            title: n.type === "application_status_update" ? "Application Status Update" : "New Job Posted",
            message: n.message,
            timestamp: n.created_at,
            read: n.read,
            priority: "medium",
            actionUrl: n.type === "application_status_update" ? "/my-applications" : "/student-jobs",
          });
        });
      } catch (e) {
        console.error("Error fetching job notifications:", e);
      }
    }

    fetchJobNotifications();
  }, [mounted, user, addNotification]);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("algobuddy_notifications", JSON.stringify(notifications));
      } catch (e) {
        console.error("Error saving notifications:", e);
      }
    }
  }, [notifications, mounted]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );

    if (id.startsWith("job-")) {
      const realId = id.replace("job-", "");
      api.request("/api/notifications", {
        method: "PATCH",
        body: { notificationIds: [realId] },
      }).catch(() => {});
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const jobNotifIds = notifications
      .filter(n => n.id.startsWith("job-") && !n.read)
      .map(n => n.id.replace("job-", ""));
    if (jobNotifIds.length > 0) {
      api.request("/api/notifications", {
        method: "PATCH",
        body: { notificationIds: jobNotifIds },
      }).catch(() => {});
    }
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    try {
      localStorage.removeItem("algobuddy_notifications");
    } catch {}
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

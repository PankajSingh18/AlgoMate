"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@/features/user/UserContext";

const initialMockNotifications = [
  {
    id: "1",
    category: "Streak",
    title: "🔥 7 Day Streak Achieved",
    message: "You've practiced for 7 days in a row. Keep it up!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    priority: "high",
    actionUrl: "/arena",
  },
  {
    id: "2",
    category: "Achievement",
    title: "🏆 Achievement Unlocked",
    message: "You have completed 50 algorithms! You earned the 'Algorithmic Master' badge.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    priority: "high",
    actionUrl: "/profile",
  },
  {
    id: "3",
    category: "Practice",
    title: "📝 Daily Practice Challenge",
    message: "New dynamic programming challenges have been added to your curriculum.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    priority: "medium",
    actionUrl: "/practice",
  },
  {
    id: "4",
    category: "Blog",
    title: "📚 New Blog Available",
    message: "Check out our latest post: 'Understanding Graphs and Tree Traversals'.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    read: true,
    priority: "low",
    actionUrl: "/blog",
  },
  {
    id: "5",
    category: "System",
    title: "🎯 Goal Completed",
    message: "You successfully completed your weekly target of 10 problems.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    read: true,
    priority: "medium",
    actionUrl: "/profile",
  },
  {
    id: "6",
    category: "Community",
    title: "💬 New Reply",
    message: "Someone replied to your comment in the 'Two Sum' discussion.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    read: true,
    priority: "low",
    actionUrl: "/community",
  },
  {
    id: "7",
    category: "Announcement",
    title: "🚀 Platform Update",
    message: "AlgoBuddy v2.0 is live! Explore the new notification panel and more.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    read: false,
    priority: "high",
    actionUrl: "/",
  }
];

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
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications(initialMockNotifications);
      }
    } catch (e) {
      console.error("Error loading notifications:", e);
      setNotifications(initialMockNotifications);
    }
  }, []);

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
      fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [realId] }),
      }).catch(() => {});
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const jobNotifIds = notifications
      .filter(n => n.id.startsWith("job-") && !n.read)
      .map(n => n.id.replace("job-", ""));
    if (jobNotifIds.length > 0) {
      fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: jobNotifIds }),
      }).catch(() => {});
    }
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem("algobuddy_notifications");
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

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useNotifications } from "@/features/notifications/NotificationContext";
import NotificationCard from "@/app/components/notifications/NotificationCard";
import { Bell, CheckSquare, Trash2, ArrowLeft } from "lucide-react";

const CATEGORIES = ["All", "Unread", "Achievement", "Practice", "System", "Blog", "Community", "Announcement", "Streak"];

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-udemy-dark-bg py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
                <Bell className="w-8 h-8 text-primary" />
                Notifications
              </h1>
              <p className="text-surface-600 dark:text-surface-400 mt-2">
                Stay updated on your AlgoBuddy progress and community activity.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 rounded-lg transition-colors"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-danger bg-danger/10 hover:bg-danger/20 dark:bg-danger/20 dark:hover:bg-danger/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr] gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="sticky top-24 bg-white dark:bg-[#14141A] rounded-xl border border-surface-200 dark:border-[#2A2A35] p-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-4 px-3">
              Filters
            </h2>
            <nav className="space-y-1">
              {CATEGORIES.map(category => {
                const count = category === "All" 
                  ? notifications.length 
                  : category === "Unread"
                    ? unreadCount
                    : notifications.filter(n => n.category === category).length;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeFilter === category 
                        ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20" 
                        : "text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-udemy-dark-surface"
                    }`}
                  >
                    <span>{category}</span>
                    {count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeFilter === category
                          ? "bg-primary/20 text-primary-dark dark:text-primary-light"
                          : "bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Notifications List */}
          <div className="bg-white dark:bg-[#14141A] rounded-xl border border-surface-200 dark:border-[#2A2A35] shadow-sm overflow-hidden">
            {filteredNotifications.length > 0 ? (
              <div className="flex flex-col">
                {filteredNotifications.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-surface-400" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                  No notifications found
                </h3>
                <p className="text-surface-600 dark:text-surface-400 max-w-sm">
                  {activeFilter === "All" 
                    ? "You're all caught up! There are no notifications to show."
                    : `You don't have any notifications in the "${activeFilter}" category.`}
                </p>
                {activeFilter !== "All" && (
                  <button
                    onClick={() => setActiveFilter("All")}
                    className="mt-6 px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors"
                  >
                    View all notifications
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

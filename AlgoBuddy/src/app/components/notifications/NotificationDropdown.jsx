"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";
import { useNotifications } from "@/features/notifications/NotificationContext";
import NotificationCard from "./NotificationCard";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const dropdownRef = useRef(null);
  
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleToggleNotifications = () => {
      setIsOpen((open) => !open);
    };
    const handleGlobalEscape = () => {
      setIsOpen(false);
    };

    window.addEventListener("toggle-notifications", handleToggleNotifications);
    window.addEventListener("global-escape", handleGlobalEscape);

    return () => {
      window.removeEventListener("toggle-notifications", handleToggleNotifications);
      window.removeEventListener("global-escape", handleGlobalEscape);
    };
  }, []);

  const filteredNotifications = activeTab === "unread" 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-udemy-dark-surface transition-colors"
      >
        <Bell className="w-5 h-5 text-surface-600 dark:text-surface-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-udemy-dark-surface border border-surface-200 dark:border-surface-700 shadow-xl rounded-xl z-[9999] overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <h3 className="font-bold text-surface-900 dark:text-white">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-surface-200 dark:border-surface-700">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "all" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex-1 py-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "unread" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin max-h-[60vh]">
            {filteredNotifications.length > 0 ? (
              <div className="flex flex-col">
                {filteredNotifications.slice(0, 10).map((notification) => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                    isDropdown={true}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-surface-400" />
                </div>
                <p className="text-surface-600 dark:text-surface-400 font-medium">
                  {activeTab === "unread" ? "No unread notifications" : "No notifications yet"}
                </p>
                <p className="text-sm text-surface-500 mt-1">
                  We'll notify you when something arrives.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-[#1A1A24]">
            <Link 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              View all notifications
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

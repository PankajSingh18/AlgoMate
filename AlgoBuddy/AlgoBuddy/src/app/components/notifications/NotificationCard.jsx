import React from "react";
import Link from "next/link";
import { useNotifications } from "@/features/notifications/NotificationContext";
import { 
  Trophy, 
  PenTool, 
  BookOpen, 
  Settings, 
  Flame, 
  MessageSquare, 
  Megaphone,
  Check,
  Trash2,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";

const getCategoryIcon = (category, message) => {
  if (category === "Job Application") {
    const lower = (message || "").toLowerCase();
    if (lower.includes("accepted")) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (lower.includes("rejected")) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <Briefcase className="w-5 h-5 text-purple-500" />;
  }
  switch (category) {
    case "Achievement": return <Trophy className="w-5 h-5 text-yellow-500" />;
    case "Practice": return <PenTool className="w-5 h-5 text-blue-500" />;
    case "Blog": return <BookOpen className="w-5 h-5 text-green-500" />;
    case "System": return <Settings className="w-5 h-5 text-gray-500" />;
    case "Streak": return <Flame className="w-5 h-5 text-orange-500" />;
    case "Community": return <MessageSquare className="w-5 h-5 text-purple-500" />;
    case "Announcement": return <Megaphone className="w-5 h-5 text-red-500" />;
    case "Job Alert": return <Briefcase className="w-5 h-5 text-blue-500" />;
    default: return <Megaphone className="w-5 h-5 text-primary" />;
  }
};

const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  
  return date.toLocaleDateString();
};

export default function NotificationCard({ notification, isDropdown = false }) {
  const { markAsRead, deleteNotification } = useNotifications();
  const { id, category, title, message, timestamp, read, actionUrl } = notification;

  const handleMarkAsRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(id);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotification(id);
  };

  const CardWrapper = actionUrl ? Link : "div";
  const wrapperProps = actionUrl ? { href: actionUrl } : {};
  
  return (
    <CardWrapper 
      {...wrapperProps}
      onClick={() => {
        if (!read) markAsRead(id);
      }}
      className={`group relative flex items-start gap-4 p-4 transition-all duration-200 border-b border-surface-200 dark:border-udemy-dark-border last:border-0 hover:bg-surface-50 dark:hover:bg-udemy-dark-surface/50 ${
        !read ? "bg-primary/5 dark:bg-primary/10" : ""
      }`}
    >
      {/* Read Indicator */}
      {!read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#1A1A24] border border-surface-200 dark:border-surface-700 shadow-sm ${!read ? 'ring-2 ring-primary/20' : ''}`}>
        {getCategoryIcon(category, message)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm truncate ${!read ? "font-bold text-surface-900 dark:text-white" : "font-semibold text-surface-700 dark:text-surface-300"}`}>
            {title}
          </p>
          <span className="text-xs text-surface-500 whitespace-nowrap ml-2">
            {formatTimeAgo(timestamp)}
          </span>
        </div>
        <p className={`text-sm line-clamp-2 ${!read ? "text-surface-700 dark:text-surface-300" : "text-surface-500 dark:text-surface-500"}`}>
          {message}
        </p>
      </div>

      {/* Actions (Hover) */}
      <div className={`absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-[#1A1A24] p-1 rounded-md shadow-sm border border-surface-200 dark:border-surface-700 ${isDropdown ? 'hidden sm:flex' : 'flex'}`}>
        {!read && (
          <button 
            onClick={handleMarkAsRead}
            className="p-1.5 text-surface-500 hover:text-primary dark:hover:text-primary rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={handleDelete}
          className="p-1.5 text-surface-500 hover:text-danger dark:hover:text-danger rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </CardWrapper>
  );
}

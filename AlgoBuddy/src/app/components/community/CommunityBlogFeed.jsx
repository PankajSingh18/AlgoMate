"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, ArrowRight, Clock, CalendarDays } from "lucide-react";
import React, { useState, useEffect } from "react";

const CATEGORIES = ["All", "Tutorial", "Experience", "Release", "Guide"];

const MOCK_POSTS = [
  { id: 1, title: "Getting Started with Sorting Algorithms", excerpt: "A beginner-friendly guide to understanding bubble sort, merge sort, and quick sort with visual examples.", category: "Tutorial", author: { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" }, date: "2026-05-28", readTime: "5 min", color: "#a435f0" },
  { id: 2, title: "My Journey Contributing to Open Source", excerpt: "How contributing to AlgoBuddy transformed my understanding of data structures and helped me grow as a developer.", category: "Experience", author: { name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" }, date: "2026-05-25", readTime: "7 min", color: "#059669" },
  { id: 3, title: "AlgoBuddy v2.0: What's New", excerpt: "We're excited to announce the latest release with new visualizers, improved performance, and community features.", category: "Release", author: { name: "AlgoBuddy Team", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=team" }, date: "2026-05-20", readTime: "4 min", color: "#2563eb" },
  { id: 4, title: "Mastering Dynamic Programming", excerpt: "A step-by-step guide to recognizing DP patterns and solving problems from easy to hard.", category: "Guide", author: { name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" }, date: "2026-05-18", readTime: "10 min", color: "#d97706" },
  { id: 5, title: "How I Used AlgoBuddy to Ace My Technical Interview", excerpt: "My personal experience using interactive visualizations to prepare for FAANG-style coding interviews.", category: "Experience", author: { name: "James Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james" }, date: "2026-05-15", readTime: "6 min", color: "#059669" },
  { id: 6, title: "Understanding Graph Traversal Algorithms", excerpt: "A visual deep-dive into BFS and DFS with real-world applications and complexity analysis.", category: "Tutorial", author: { name: "Maria Garcia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria" }, date: "2026-05-12", readTime: "8 min", color: "#a435f0" },
];

const handleReadPost = (post) => {
  const updated = [
    post,
    ...readingHistory.filter((p) => p.id !== post.id),
  ].slice(0, 5);

  setReadingHistory(updated);

  localStorage.setItem(
    "blog-reading-history",
    JSON.stringify(updated)
  );
};

useEffect(() => {
  const saved = JSON.parse(
    localStorage.getItem("blog-reading-history") || "[]"
  );

  setReadingHistory(saved);
}, []);

function BlogSkeleton() {
  return (
    <div className="card-surface flex flex-col overflow-hidden">
      <div className="flex-1 p-5 space-y-3">
        <div className="skeleton-shimmer h-5 w-20 rounded-full" />
        <div className="skeleton-shimmer h-5 w-full" />
        <div className="skeleton-shimmer h-4 w-3/4" />
        <div className="skeleton-shimmer h-4 w-full" />
        <div className="skeleton-shimmer h-4 w-2/3" />
      </div>
      <div className="flex items-center gap-3 border-t border-[var(--color-border)] px-5 py-3">
        <div className="skeleton-shimmer h-7 w-7 rounded-full" />
        <div className="flex-1 space-y-1">
          <div className="skeleton-shimmer h-3 w-24" />
          <div className="skeleton-shimmer h-2 w-32" />
        </div>
      </div>
    </div>
  );
}

function BlogCard({ post }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="card-surface flex flex-col overflow-hidden transition-shadow duration-[var(--motion-fast)] hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex-1 p-5">
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: `${post.color}18`, color: post.color }}
        >
          {post.category}
        </span>
        <h3 className="mt-3 text-base font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-3">
          {post.excerpt}
        </p>
      </div>
      <div className="flex items-center gap-3 border-t border-[var(--color-border)] px-5 py-3">
        <Image
          src={post.author.avatar}
          alt={`${post.author.name}'s avatar`}
          width={28}
          height={28}
          unoptimized
          className="h-7 w-7 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="truncate text-xs font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
            {post.author.name}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-0.5"><CalendarDays size={11} /> {post.date}</span>
            <span className="inline-flex items-center gap-0.5"><Clock size={11} /> {post.readTime}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

<div className="mb-8">
  <h3 className="text-lg font-bold mb-3">
    Recommended For You
  </h3>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {recommendedPosts.slice(0, 3).map((post) => (
      <BlogCard key={post.id} post={post} />
    ))}
  </div>
</div>

export default function CommunityBlogFeed({ loading = false }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [readingHistory, setReadingHistory] = useState([]);

  const filtered = activeCategory === "All"
    ? MOCK_POSTS
    : MOCK_POSTS.filter((p) => p.category === activeCategory);

  const categoryId = "blog-category-tablist";
  const recommendedPosts =
  readingHistory.length > 0
    ? MOCK_POSTS.filter(
        (post) =>
          post.category === readingHistory[0].category
      )
    : MOCK_POSTS.slice(0, 3);

  return (
    <section className="section-app">
      <div className="container-app">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
              From Our Community
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              
              Tutorials, guides, and stories from the AlgoBuddy community
            </p>
          </div>
          
          <a
            href="https://discord.gg/PqnazRxPc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Write a blog post on Discord"
            className="btn-base bg-[var(--udemy-purple)] text-white hover:bg-[var(--udemy-purple-dark)]"
          >
            <PenLine size={16} />
            Write a Blog
          </a>
        </div>

        <div role="tablist" aria-label="Blog categories" className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              aria-controls={categoryId}
              onClick={() => setActiveCategory(cat)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-[var(--motion-fast)] focus-visible:ring-2 focus-visible:ring-primary focus:outline-none ${
                activeCategory === cat
                  ? "text-[var(--udemy-purple)]"
                  : "text-[var(--color-muted)] hover:text-[var(--udemy-text)] dark:hover:text-[var(--udemy-dark-text)]"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-[var(--udemy-purple)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div id={categoryId} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              id={categoryId}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((post) => (
                <div
  key={post.id}
  onClick={() => handleReadPost(post)}
>
  <BlogCard post={post} />
</div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-[var(--color-muted)]">
            No posts found in this category.
          </p>
        )}

        <div className="mt-8 text-center">
          <a
            href="/blogs"
            aria-label="View all blog posts"
            className="btn-base border border-[var(--color-border)] text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] hover:bg-[var(--color-neutral-100)] dark:hover:bg-[var(--color-neutral-800)] focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
          >
            View All Blogs
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

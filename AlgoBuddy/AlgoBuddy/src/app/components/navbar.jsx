"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/features/user/UserContext";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Swords,
  LogOut,
  Bell,
} from "lucide-react";

import { NAV_LINKS } from "./navLinks";
import NotificationDropdown from "./notifications/NotificationDropdown";
import ProfileProgress from "./ui/ProfileProgress";
import BottomNav from "./BottomNav";

const MAX_AVATAR_URL_LENGTH = 512;

function getStoredTheme() {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;

  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function applyTheme(nextTheme) {
  document.documentElement.classList.toggle(
    "dark",
    nextTheme === "dark"
  );
  window.localStorage.setItem("theme", nextTheme);
}

function getInitials(name) {
  if (!name) return "??";
  const cleanName = name.includes("@") ? name.split("@")[0] : name;
  const parts = cleanName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function safeAvatarUrl(value) {
  if (typeof value !== "string") return "";
  if (value.startsWith("data:")) return "";
  if (value.length > MAX_AVATAR_URL_LENGTH) return "";
  return value;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  const [themeMounted, setThemeMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
 
  const { user, setUser } = useUser();
  const userRef = useRef(null);
  const avatarSrc = safeAvatarUrl(
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  );
  const displayName = user?.user_metadata?.name || "AlgoBuddy User";

  useEffect(() => {
    const currentTheme = getStoredTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);
    setThemeMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const resolvedTheme = themeMounted
        ? currentTheme
        : getStoredTheme();

      const nextTheme =
        resolvedTheme === "light" ? "dark" : "light";

      applyTheme(nextTheme);
      setThemeMounted(true);

      return nextTheme;
    });
  };

  useEffect(() => {
    const handleScroll = () =>
      setScrolled(window.scrollY > 4);

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (
        userRef.current &&
        !userRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", fn);

    return () =>
      document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape
      );
  }, []);

  useEffect(() => {
    const handleGlobalEscape = () => {
      setUserMenuOpen(false);
      setMenuOpen(false);
    };

    window.addEventListener("global-escape", handleGlobalEscape);

    return () => {
      window.removeEventListener("global-escape", handleGlobalEscape);
    };
  }, []);

  // FIX: Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("algobuddy_practice_progress");
      localStorage.removeItem("algobuddy_current_streak");
      localStorage.removeItem("algobuddy_best_streak");
      localStorage.removeItem("algobuddy_last_active_date");
      localStorage.removeItem("PROBLEM_BOOKMARKS");
    }
    setMenuOpen(false);
    window.location.href = "/";
  };

  const isActive = (href) => {
    if (!pathname) return false;
    if (href.startsWith("http")) return false;

    if (href.startsWith("/#")) {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(href + "/")
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9998] h-[72px] bg-white dark:bg-udemy-dark-bg flex items-center transition-all duration-200 ${scrolled
            ? "border-b border-surface-200 dark:border-udemy-dark-border shadow-sm"
            : "border-b border-transparent"
          }`}
      >
        <div className="w-full max-w-[1200px] mx-auto px-8 flex items-center justify-between h-full">
          <Link
            href="/"
            className="brand-logo font-black text-[26px] text-surface-900 dark:text-white hover:opacity-75 transition-opacity focus-ring"
          >
            Algo<span className="text-primary font-black">Buddy</span>
          </Link>

          {/* Desktop Links with Auth Interception */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => {
              const dynamicHref = l.href;

              return (
                <Link
                  key={l.href}
                  href={dynamicHref}
                  data-text={l.label}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`relative pb-2 text-[15px] flex flex-col items-center justify-center border-b-2 transition-colors duration-150 focus-ring ${isActive(l.href)
                      ? "border-primary text-primary dark:text-primary font-semibold"
                      : "border-transparent text-surface-600 dark:text-surface-400 font-medium hover:text-surface-900 dark:hover:text-white hover:border-surface-300 dark:hover:border-surface-600"
                    }`}
                >
                  {l.label}
                  {l.label === "Community" && process.env.NEXT_PUBLIC_SHOW_COMMUNITY_BADGE === "true" && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-purple-600 rounded">NEW</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <NotificationDropdown />

            {user ? (
              <div
                ref={userRef}
                className="relative"
              >
                <button
                  onClick={() =>
                    setUserMenuOpen((o) => !o)
                  }
                  className="flex items-center gap-2 rounded-full px-2 py-1.5 text-surface-700 dark:text-surface-200 hover:text-primary dark:hover:text-primary-light hover:bg-surface-100 dark:hover:bg-udemy-dark-surface transition-colors focus-ring"
                  aria-label="Open account menu"
                  aria-expanded={userMenuOpen}
                >
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt="avatar"
                      width={28}
                      height={28}
                      unoptimized
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center text-[11px] font-bold">
                      {getInitials(displayName || user.email)}
                    </div>
                  )}

                  <span className="max-w-28 truncate text-sm font-semibold">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-surface-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white/95 dark:bg-udemy-dark-surface/95 backdrop-blur-md border border-surface-200/80 dark:border-surface-700/80 shadow-elevated rounded-2xl z-[9999] overflow-hidden transition-all duration-200 ease-out origin-top-right">
                    <Link
                      href="/profile"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                      className="group mx-2 mt-2 mb-1 px-3 py-3 rounded-xl bg-surface-50/50 dark:bg-neutral-900/30 flex items-center gap-3 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-150 focus-ring"
                      aria-label="Go to profile"
                    >
                      {avatarSrc ? (
                        <Image
                          src={avatarSrc}
                          alt="avatar"
                          width={36}
                          height={36}
                          unoptimized
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center text-xs font-bold ring-2 ring-primary/10">
                          {getInitials(displayName || user.email)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-[#9e9e9e] truncate">
                          {user.email}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0 text-surface-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-hover:text-primary dark:group-hover:text-primary-light transition-all duration-150" />
                    </Link>

                    <ProfileProgress compact={true} />

                    <div className="py-1.5 px-1.5 flex flex-col gap-0.5">
                      <Link
                        href="/arena"
                        onClick={() =>
                          setUserMenuOpen(false)
                        }
                        className="group flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-surface-700 dark:text-[#f5f5f5] rounded-lg hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-150 focus-ring"
                      >
                        <Swords className="w-4 h-4 text-surface-400 group-hover:text-primary dark:group-hover:text-primary-light group-hover:scale-105 transition-all duration-150" />
                        Arena
                      </Link>
                    </div>

                    <div className="border-t border-surface-100 dark:border-udemy-dark-border px-1.5 py-1.5">
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="group w-full flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150 focus-ring"
                      >
                        <LogOut className="w-4 h-4 text-red-500 group-hover:scale-105 transition-all duration-150" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="h-[42px] px-7 flex items-center text-[15px] font-bold text-white bg-surface-900 dark:bg-white dark:text-surface-900 rounded-full hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all duration-150 focus-ring"
              >
                Sign in
              </Link>
            )}

            <button
              onClick={toggleTheme}
              aria-label={
                themeMounted
                  ? `Switch to ${theme === "light"
                    ? "dark"
                    : "light"
                  } mode`
                  : "Toggle theme"
              }
              className="w-9 h-9 flex items-center justify-center rounded-full text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-udemy-dark-surface transition-colors focus-ring"
            >
              {!themeMounted ||
                theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              aria-label="Search site"
              className="w-10 h-10 flex items-center justify-center text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-udemy-dark-surface transition-colors focus-ring"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              aria-label={
                themeMounted
                  ? `Switch to ${theme === "light" ? "dark" : "light"} mode`
                  : "Toggle theme"
              }
              className="w-10 h-10 flex items-center justify-center text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-udemy-dark-surface transition-colors focus-ring"
            >
              {!themeMounted || theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() =>
                setMenuOpen((o) => !o)
              }
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="hidden"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Links with Auth Interception */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed top-[72px] left-0 right-0 bottom-0 z-[9997] bg-white dark:bg-surface-900 overflow-y-auto border-t border-surface-200 dark:border-surface-700"
        >
          <div className="py-2">
            {NAV_LINKS.map((l) => {
              const dynamicHref = l.href;

              return (
                <Link
                  key={l.href}
                  href={dynamicHref}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  aria-current={
                    isActive(l.href)
                      ? "page"
                      : undefined
                  }
                  className={`block px-6 py-3.5 text-[16px] font-medium transition-colors focus-ring ${isActive(l.href)
                      ? "text-primary bg-primary/5 dark:bg-primary/10"
                      : "text-surface-700 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-udemy-dark-surface hover:text-surface-900 dark:hover:text-white"
                    }`}
                >
                  {l.label}
                  {l.label === "Community" && process.env.NEXT_PUBLIC_SHOW_COMMUNITY_BADGE === "true" && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-purple-600 rounded">NEW</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-700">
            <button
              type="button"
              onClick={toggleTheme}
              className="mb-3 h-[44px] w-full flex items-center justify-center gap-2 text-[15px] font-semibold text-surface-900 dark:text-white border border-surface-300 dark:border-udemy-dark-border rounded-full hover:border-primary hover:text-primary transition-all focus-ring"
              aria-label={
                themeMounted
                  ? `Switch to ${theme === "light"
                    ? "dark"
                    : "light"
                  } mode`
                  : "Toggle theme"
              }
            >
              {!themeMounted ||
                theme === "light" ? (
                <>
                  <Moon className="w-4 h-4" />
                  Dark mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  Light mode
                </>
              )}
            </button>

            {user ? (
              <div className="flex flex-col gap-2">
                <p className="text-[13px] text-surface-500 dark:text-[#737373] truncate pb-1">
                  {user.email}
                </p>

                <Link
                  href="/profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="h-[44px] flex items-center justify-center text-[15px] font-semibold border border-surface-300 dark:border-udemy-dark-border rounded-full text-surface-900 dark:text-white hover:border-primary hover:text-primary transition-all focus-ring"
                >
                  Profile
                </Link>

                <Link
                  href="/arena"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="h-[44px] flex items-center justify-center text-[15px] font-semibold border border-surface-300 dark:border-udemy-dark-border rounded-full text-surface-900 dark:text-white hover:border-primary hover:text-primary transition-all focus-ring"
                >
                  Arena
                </Link>

                <button
                  onClick={handleLogout}
                  className="h-[44px] text-[15px] font-semibold text-danger border border-danger/30 rounded-full hover:bg-danger/10 transition-all focus-ring"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="h-[44px] flex items-center justify-center text-[15px] font-semibold text-surface-900 dark:text-white border border-surface-300 dark:border-udemy-dark-border rounded-full hover:border-primary hover:text-primary transition-all focus-ring"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}

      <BottomNav />
      <div className="h-[72px]" />
    </>
  );
}
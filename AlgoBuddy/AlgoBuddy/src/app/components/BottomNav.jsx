"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlayCircle, Dumbbell, Swords } from "lucide-react";

const BOTTOM_NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/visualizer", label: "Visualizer", icon: PlayCircle },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/arena", label: "Arena", icon: Swords },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9998] md:hidden bg-white dark:bg-udemy-dark-bg border-t border-surface-200 dark:border-udemy-dark-border"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-stretch h-[60px]">
        {BOTTOM_NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-semibold transition-colors duration-150 focus-ring ${
                active
                  ? "text-primary"
                  : "text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${active ? "scale-110" : ""}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for phones with home indicator (iOS etc.) */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

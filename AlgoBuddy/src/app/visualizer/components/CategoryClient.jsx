"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";

const DS_THEME = {
  Array: {
    color: "#a435f0",
    bg: "#faf5ff",
    border: "#e9d5ff",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="4" height="18" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="5" width="4" height="16" rx="1" />
      </svg>
    ),
  },
  Stack: {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="4" y="2" width="16" height="5" rx="1.5" /><rect x="4" y="9" width="16" height="5" rx="1.5" /><rect x="4" y="16" width="16" height="5" rx="1.5" />
      </svg>
    ),
  },
  Queue: {
    color: "#059669",
    bg: "#f0fdf4",
    border: "#d1fae5",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="2" y="7" width="5" height="10" rx="1.5" /><rect x="9.5" y="7" width="5" height="10" rx="1.5" /><rect x="17" y="7" width="5" height="10" rx="1.5" /><path d="M22 12h-1" /><path d="M3 12H2" />
      </svg>
    ),
  },
  "Linked List": {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><path d="M8 12h8" /><path d="M14 9l3 3-3 3" />
      </svg>
    ),
  },
  Tree: {
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="5" r="2.5" /><circle cx="6" cy="15" r="2.5" /><circle cx="18" cy="15" r="2.5" /><path d="M10.2 7.2L7.5 12.5" /><path d="M13.8 7.2l2.7 5.3" />
      </svg>
    ),
  },
  Graph: {
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="6" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 6h9" /><path d="M5 8.5v7" /><path d="M19 8.5v7" /><path d="M7.5 18h9" /><path d="M7 8l10 8" />
      </svg>
    ),
  },
  HashMap: {
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  Recursion: {
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#ccfbf1",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
  },
  "AI Algorithms": {
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#c5eaf0",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M12 2A4 4 0 0 0 8 6v1H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
        <rect x="9" y="13" width="2" height="2" />
        <rect x="13" y="13" width="2" height="2" />
      </svg>
    ),
  },
  "Dynamic Programming": {
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
};

const getTheme = (t) =>
  DS_THEME[t] || {
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 8v8" /><path d="M8 12h8" />
      </svg>
    ),
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
  };

export default function CategoryClient({ section }) {
  const router = useRouter();
  const theme = getTheme(section.title);
  const count = section.subsections
    ? section.subsections.reduce((a, s) => a + s.items.length, 0)
    : 0;

  return (
    <div>
      <style>{`
        .dark [data-theme-card="Code Lab"] { background: #2d2f31 !important; border-color: #4b5563 !important; }
        .dark [data-theme-card="Array"] { background: #1a0e2d !important; border-color: #5b21b6 !important; }
        .dark [data-theme-card="Stack"] { background: #111d33 !important; border-color: #1e3a8a !important; }
        .dark [data-theme-card="Queue"] { background: #122b19 !important; border-color: #166534 !important; }
        .dark [data-theme-card="Linked List"] { background: #2b1a08 !important; border-color: #92400e !important; }
        .dark [data-theme-card="Tree"] { background: #1a0e2d !important; border-color: #5b21b6 !important; }
        .dark [data-theme-card="Graph"] { background: #2c1215 !important; border-color: #991b1b !important; }
        .dark [data-theme-card="HashMap"] { background: #2e1022 !important; border-color: #9d174d !important; }
        .dark [data-theme-card="Recursion"] { background: #0c231e !important; border-color: #115e59 !important; }
        .dark [data-theme-card="AI Algorithms"] { background: #062d35 !important; border-color: #0891b2 !important; }
        .dark [data-theme-card="Dynamic Programming"] { background: #082f49 !important; border-color: #0284c7 !important; }

        .dark [data-theme-header="Code Lab"] { background: #3e4143 !important; border-color: #4b5563 !important; }
        .dark [data-theme-header="Array"] { background: #23133d !important; border-color: #5b21b6 !important; }
        .dark [data-theme-header="Stack"] { background: #182847 !important; border-color: #1e3a8a !important; }
        .dark [data-theme-header="Queue"] { background: #173820 !important; border-color: #166534 !important; }
        .dark [data-theme-header="Linked List"] { background: #3d240a !important; border-color: #92400e !important; }
        .dark [data-theme-header="Tree"] { background: #23133d !important; border-color: #5b21b6 !important; }
        .dark [data-theme-header="Graph"] { background: #3d171b !important; border-color: #991b1b !important; }
        .dark [data-theme-header="HashMap"] { background: #3b132b !important; border-color: #9d174d !important; }
        .dark [data-theme-header="Recursion"] { background: #0f3129 !important; border-color: #115e59 !important; }
        .dark [data-theme-header="AI Algorithms"] { background: #0a3d47 !important; border-color: #0891b2 !important; }
        .dark [data-theme-header="Dynamic Programming"] { background: #0c4a6e !important; border-color: #0284c7 !important; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header Card */}
        <div className="mb-8 transition-colors duration-300">


          <div className="flex items-center gap-5">
            {theme.icon && (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center p-3 flex-shrink-0 transition-colors duration-300"
                style={{ background: theme.bg }}
                data-theme-header={section.title || "Code Lab"}
              >
                {theme.icon(theme.color)}
              </div>
            )}
            <div>
              <h1
                className="text-[2.2rem] sm:text-[3rem] font-black leading-[1.1] tracking-tighter"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em", color: theme.color }}
              >
                {section.title}
              </h1>

            </div>
          </div>
        </div>

        {/* Algorithm Subsections */}
        <div className="space-y-8">
          {section.subsections?.map((sub, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: si * 0.08 }}
            >
              <h4
                className="text-[13px] font-bold uppercase tracking-wider mb-4 pl-1"
                style={{ color: theme.color }}
              >
                {sub.title}
              </h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sub.items.map((item, ii) => (
                  <Link
                    key={ii}
                    href={item.path}
                    className="group/item flex items-center justify-between p-4 rounded-xl border
                      bg-white dark:bg-[#2d2f31] dark:border-[#4b5563] hover:shadow-md transition-all duration-200"
                    style={{ borderColor: theme.border }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] font-bold"
                        style={{ background: theme.color + "15", color: theme.color }}
                      >
                        {ii + 1}
                      </div>
                      <span className="text-[14px] font-semibold text-surface-900 dark:text-white group-hover/item:text-primary transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <FiChevronRight
                      className="w-4 h-4 group-hover/item:translate-x-1 transition-all duration-200"
                      style={{ color: theme.color + "60" }}
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

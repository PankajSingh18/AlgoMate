import { ChevronRight, Clock, Layers } from "lucide-react";
import Link from "next/link";

const difficultyColors = {
  beginner:"bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50",
  intermediate:"bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700/50",
  advanced:"bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50",
};

export default function CheatsheetCard({ cheatsheet }) {
  const { id, title, category, difficulty, timeComplexity, spaceComplexity, whenToUse } = cheatsheet;

  return (
    <Link
      href={`/cheatsheets/${id}`}
      className="group block p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/40
      hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:border-[#a435f0]/40 hover:ring-1 hover:ring-[#a435f0]/30 transition-all shadow-lg hover:shadow-[#a435f0]/5"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#c084fc] transition-colors">
          {title}
        </h3>
        {difficulty && (
          <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColors[difficulty] || ""}`}>
            {difficulty}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {timeComplexity.average}
        </span>
        <span className="flex items-center gap-1">
          <Layers size={12} />
          {spaceComplexity}
        </span>
      </div>

      {whenToUse && (
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{whenToUse}</p>
      )}

      <div className="flex items-center text-xs font-semibold text-[#a435f0] group-hover:text-[#c084fc] transition-colors">
        View Cheatsheet <ChevronRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}

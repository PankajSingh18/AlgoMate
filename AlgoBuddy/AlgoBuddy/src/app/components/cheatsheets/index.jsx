"use client";
import { useState, useMemo } from "react";
import { Search, Zap, Filter } from "lucide-react";
import CheatsheetCard from "./CheatsheetCard";
import { allCheatsheets, categories } from "./data";

const difficulties = ["beginner", "intermediate", "advanced"];

export default function CheatsheetsIndex() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const filtered = useMemo(() => {
    return allCheatsheets.filter((c) => {
      if (selectedCategory && c.category !== selectedCategory) return false;
      if (selectedDifficulty && c.difficulty !== selectedDifficulty) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.whenToUse && c.whenToUse.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const activeCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-[#a435f0] text-sm font-bold tracking-wider uppercase mb-4">
          <Zap className="w-4 h-4 animate-pulse" />
          Quick Reference
        </span>
        <h1 className="text-4xl md:text-5xl font-black font-serif text-slate-900 dark:text-white mb-6">
          DSA{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a435f0] to-[#c084fc]">
            Cheatsheets
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Comprehensive cheatsheets for all DSA topics — complexity, code snippets, and key insights
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search cheatsheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-[#a435f0] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#a435f0] transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={selectedDifficulty || ""}
            onChange={(e) => setSelectedDifficulty(e.target.value || null)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#a435f0] transition-colors"
          >
            <option value="">All Levels</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category description */}
      {activeCategory && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-700/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{activeCategory.name}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{activeCategory.description}</p>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CheatsheetCard key={c.id} cheatsheet={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Filter size={40} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">No cheatsheets match your filters.</p>
          <button
            onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedDifficulty(null); }}
            className="mt-4 text-sm text-[#a435f0] hover:text-[#c084fc] transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

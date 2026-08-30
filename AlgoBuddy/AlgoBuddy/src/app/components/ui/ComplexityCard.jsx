"use client";

export default function ComplexityCard({
  complexity,
  title,
  description,
  examples = [],
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-indigo-500/5" />

      {/* Complexity Badge */}
      <div className="relative inline-flex items-center rounded-full border border-violet-300 dark:border-violet-800 bg-violet-100 dark:bg-violet-950/40 px-3 py-1 text-xs font-black tracking-wider text-violet-700 dark:text-violet-300">
        {complexity}
      </div>

      {/* Title */}
      <h3 className="relative mt-4 text-lg font-black text-neutral-900 dark:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="relative mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
        {description}
      </p>

      {/* Examples */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        {examples.map((example) => (
          <span
            key={example}
            className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-bold text-neutral-700 dark:text-neutral-300"
          >
            {example}
          </span>
        ))}
      </div>
    </div>
  );
}
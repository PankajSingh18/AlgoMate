export default function ComplexityCard({
  complexity,
  title,
  description,
  examples,
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-violet-300 dark:hover:border-violet-700 transition-all">
      
      <div className="mb-4">
        <span className="inline-flex px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-[#a435f0] text-xs font-black border border-violet-200 dark:border-violet-800">
          {complexity}
        </span>
      </div>

      <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium mb-4">
        {description}
      </p>

      <div>
        <p className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-500 mb-2">
          Common Examples
        </p>

        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <span
              key={example}
              className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              {example}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
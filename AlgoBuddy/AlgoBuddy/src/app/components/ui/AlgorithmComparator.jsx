"use client";

export default function AlgorithmComparator({ algorithms = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
      <table className="w-full border-collapse">
        <thead className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Algorithm
            </th>
            <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Best
            </th>
            <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Average
            </th>
            <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Worst
            </th>
            <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Space
            </th>
            <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Stable
            </th>
          </tr>
        </thead>

        <tbody>
          {algorithms.map((algo, index) => (
            <tr
              key={algo.name}
              className={`border-t border-neutral-200 dark:border-neutral-800 transition-all hover:bg-violet-50/60 dark:hover:bg-neutral-800/60 ${
                index % 2 === 0
                  ? "bg-white dark:bg-neutral-900"
                  : "bg-neutral-50/50 dark:bg-neutral-950/40"
              }`}
            >
              <td className="px-4 py-4 font-bold text-neutral-900 dark:text-white">
                {algo.name}
              </td>

              <td className="px-4 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {algo.best}
              </td>

              <td className="px-4 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                {algo.average}
              </td>

              <td className="px-4 py-4 text-sm font-semibold text-rose-600 dark:text-rose-400">
                {algo.worst}
              </td>

              <td className="px-4 py-4 text-sm font-semibold text-violet-600 dark:text-violet-400">
                {algo.space}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border ${
                    algo.stable
                      ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                  }`}
                >
                  {algo.stable ? "Stable" : "Unstable"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
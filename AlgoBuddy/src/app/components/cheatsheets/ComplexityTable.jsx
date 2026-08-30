function getBadgeColor(val) {
  if (!val) return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/40";
  const s = String(val);
  if (s === "O(1)" || s === "O(log n)" || s === "Yes") {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/40";
  }
  if (s.startsWith("O(n)") && s !== "O(n log n)" && s !== "O(n²)") {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/40";
  }
  if (s === "O(n log n)") {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40";
  }
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/40";
}

export default function ComplexityTable({ cheatsheet }) {
  const { timeComplexity, spaceComplexity, stable, inPlace } = cheatsheet;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/60">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/80 border-b border-slate-700">
            <th className="p-3 text-xs font-bold text-slate-300 uppercase tracking-wider">Metric</th>
            <th className="p-3 text-xs font-bold text-slate-300 uppercase tracking-wider text-center">Best</th>
            <th className="p-3 text-xs font-bold text-slate-300 uppercase tracking-wider text-center">Average</th>
            <th className="p-3 text-xs font-bold text-slate-300 uppercase tracking-wider text-center">Worst</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          <tr className="hover:bg-slate-800/40 transition-colors">
            <td className="p-3 text-sm font-semibold text-slate-200">Time</td>
            <td className="p-3 text-center"><Badge value={timeComplexity.best} /></td>
            <td className="p-3 text-center"><Badge value={timeComplexity.average} /></td>
            <td className="p-3 text-center"><Badge value={timeComplexity.worst} /></td>
          </tr>
          <tr className="hover:bg-slate-800/40 transition-colors">
            <td className="p-3 text-sm font-semibold text-slate-200">Space</td>
            <td className="p-3 text-center" colSpan={3}><Badge value={spaceComplexity} /></td>
          </tr>
          {stable !== undefined && (
            <tr className="hover:bg-slate-800/40 transition-colors">
              <td className="p-3 text-sm font-semibold text-slate-200">Stable</td>
              <td className="p-3 text-center" colSpan={3}><Badge value={stable ? "Yes" : "No"} /></td>
            </tr>
          )}
          {inPlace !== undefined && (
            <tr className="hover:bg-slate-800/40 transition-colors">
              <td className="p-3 text-sm font-semibold text-slate-200">In-Place</td>
              <td className="p-3 text-center" colSpan={3}><Badge value={inPlace ? "Yes" : "No"} /></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ value }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${getBadgeColor(value)}`}>
      {value}
    </span>
  );
}

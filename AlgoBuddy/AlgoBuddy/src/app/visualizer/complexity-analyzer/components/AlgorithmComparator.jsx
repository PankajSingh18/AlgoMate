export default function AlgorithmComparator({
  algorithms,
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
      
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
          Algorithm Complexity Playground
        </h2>

        <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
          Compare common algorithms and their efficiency characteristics.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          
          <thead className="bg-neutral-50 dark:bg-neutral-800/50">
            <tr>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-black">
                Algorithm
              </th>

              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-black">
                Time Complexity
              </th>

              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-black">
                Space Complexity
              </th>
            </tr>
          </thead>

          <tbody>
            {algorithms.map((algorithm, index) => (
              <tr
                key={algorithm.name}
                className={`border-t border-neutral-200 dark:border-neutral-800 ${
                  index % 2 === 0
                    ? "bg-white dark:bg-neutral-900"
                    : "bg-neutral-50/50 dark:bg-neutral-800/20"
                }`}
              >
                <td className="px-6 py-5">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {algorithm.name}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="inline-flex px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-[#a435f0] text-sm font-black border border-violet-200 dark:border-violet-800">
                    {algorithm.time}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="inline-flex px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-black border border-indigo-200 dark:border-indigo-800">
                    {algorithm.space}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
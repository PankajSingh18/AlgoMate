export default function PlayerTestProgress({ passed, total, failedAttempts, status }) {
  if (status !== "Testing Code..." && passed === 0 && total === 1 && failedAttempts === 0) {
    return null; // Hasn't tested yet
  }

  const percentage = Math.round((passed / total) * 100) || 0;
  
  return (
    <div className="mt-4 w-full max-w-[200px] flex flex-col items-center bg-white dark:bg-[#111116] border border-slate-200 dark:border-neutral-800 p-3 rounded-xl shadow-sm">
      <div className="flex justify-between w-full text-[10px] font-bold text-slate-500 mb-1">
        <span>Tests</span>
        <span className={percentage === 100 ? "text-emerald-500" : "text-amber-500"}>
          {passed}/{total}
        </span>
      </div>
      
      <div className="h-2 w-full bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full transition-all duration-500 ${percentage === 100 ? "bg-emerald-500" : "bg-amber-500"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {failedAttempts > 0 && (
        <div className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
          Failed Attempts: {failedAttempts}
        </div>
      )}
    </div>
  );
}

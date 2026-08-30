export default function PlayerSpeedometer({ cpm = 0 }) {
  // max speed approx 400 cpm
  const percentage = Math.min((cpm / 400) * 100, 100);
  
  return (
    <div className="mt-4 w-full max-w-[200px] flex flex-col items-center">
      <div className="flex justify-between w-full text-[10px] font-bold text-slate-500 mb-1">
        <span>Speed</span>
        <span className="text-primary">{cpm} CPM</span>
      </div>
      <div className="h-2 w-full bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

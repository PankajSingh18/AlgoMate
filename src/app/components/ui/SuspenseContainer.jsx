export function Spinner({ size = "md", className = "" }) {
  const sizeClasses = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <svg
        className={`animate-spin ${sizeClasses[size] || sizeClasses.md} text-neutral-400`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function Skeleton({ width = "100%", height = "1rem", className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700 ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-8" aria-label="Page loading">
      <Skeleton height="2rem" width="40%" />
      <Skeleton height="1rem" />
      <Skeleton height="1rem" width="80%" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <Skeleton height="12rem" />
        <Skeleton height="12rem" />
      </div>
      <Skeleton height="20rem" />
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Cards loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-3">
          <Skeleton height="1.5rem" width="60%" />
          <Skeleton height="1rem" />
          <Skeleton height="1rem" width="40%" />
          <Skeleton height="4rem" />
        </div>
      ))}
    </div>
  );
}

export function LeadsSkeleton() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-3 border-b border-border bg-surface px-4 py-4 md:flex-row md:items-center md:gap-4 md:px-6">
        <div className="h-10 w-full animate-pulse rounded-md bg-border/70 md:flex-1" />
        <div className="flex gap-3">
          <div className="h-10 flex-1 animate-pulse rounded-md bg-border/70 md:w-44" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-border/70" />
        </div>
      </div>

      <div className="md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-border px-4 py-4"
          >
            <div className="h-4 w-2/5 animate-pulse rounded bg-border/70" />
            <div className="mt-2 h-3 w-3/5 animate-pulse rounded bg-border/50" />
            <div className="mt-4 flex justify-between">
              <div className="h-5 w-20 animate-pulse rounded-full bg-border/60" />
              <div className="h-7 w-7 animate-pulse rounded-full bg-border/60" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden border-y border-border bg-surface md:block">
        <div className="border-b border-border bg-bg px-4 py-3">
          <div className="h-3 w-full max-w-3xl animate-pulse rounded bg-border/60" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-border/70" />
            <div className="h-4 w-40 animate-pulse rounded bg-border/50" />
            <div className="h-4 w-28 animate-pulse rounded bg-border/50" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-border/60" />
            <div className="h-4 w-20 animate-pulse rounded bg-border/40" />
            <div className="h-4 w-24 animate-pulse rounded bg-border/40" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading enquiries…</span>
    </div>
  );
}

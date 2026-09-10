type PaginationProps = {
  showing: number;
  total: number;
  loading?: boolean;
  error?: string | null;
  onLoadMore: () => void;
};

export function Pagination({
  showing,
  total,
  loading = false,
  error = null,
  onLoadMore,
}: PaginationProps) {
  if (showing >= total && !error) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div className="flex items-center justify-center gap-4">
        <p className="text-sm text-ink-soft">
          Showing {showing} of {total}
        </p>
        {showing < total ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            aria-busy={loading}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent border-t-transparent"
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-status-lost">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type EmptyStateProps = {
  onNewEnquiry: () => void;
};

export function EmptyState({ onNewEnquiry }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <svg
        width="120"
        height="88"
        viewBox="0 0 120 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-accent"
      >
        <rect
          x="18"
          y="14"
          width="84"
          height="60"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M18 28h84"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="30" cy="21" r="2" fill="currentColor" />
        <circle cx="40" cy="21" r="2" fill="currentColor" />
        <path
          d="M34 42h36M34 52h24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M78 58l8-18 8 18h-16z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M82 50h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <h2 className="mt-6 font-heading text-xl font-semibold tracking-tight text-ink">
        No enquiries yet
      </h2>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        Capture your first enquiry to start tracking conversations, owners, and
        status changes in one place.
      </p>
      <button
        type="button"
        onClick={onNewEnquiry}
        className="mt-6 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        New Enquiry
      </button>
    </div>
  );
}

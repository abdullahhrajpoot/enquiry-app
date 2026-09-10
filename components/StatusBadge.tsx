import type { LeadStatus } from "@/types/lead";

const STATUS_STYLES: Record<
  LeadStatus,
  { text: string; soft: string }
> = {
  New: {
    text: "text-status-new",
    soft: "bg-status-new-soft",
  },
  Contacted: {
    text: "text-status-contacted",
    soft: "bg-status-contacted-soft",
  },
  Qualified: {
    text: "text-status-qualified",
    soft: "bg-status-qualified-soft",
  },
  Won: {
    text: "text-status-won",
    soft: "bg-status-won-soft",
  },
  Lost: {
    text: "text-status-lost",
    soft: "bg-status-lost-soft",
  },
};

const DOT_COLORS: Record<LeadStatus, string> = {
  New: "bg-status-new",
  Contacted: "bg-status-contacted",
  Qualified: "bg-status-qualified",
  Won: "bg-status-won",
  Lost: "bg-status-lost",
};

type StatusBadgeProps = {
  status: LeadStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles.soft} ${styles.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[status]}`} />
      {status}
    </span>
  );
}

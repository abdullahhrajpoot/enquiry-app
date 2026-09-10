import { OwnerAvatar } from "@/components/OwnerAvatar";
import { StatusBadge } from "@/components/StatusBadge";

export function DashboardMockup() {
  return (
    <div
      className="relative mx-auto w-full max-w-3xl"
      aria-hidden="true"
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-accent/8 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_24px_rgba(28,27,26,0.08),0_32px_64px_rgba(28,27,26,0.12)]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-status-lost/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-status-contacted/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-status-won/70" />
          </div>
          <span className="font-heading text-xs font-semibold tracking-tight text-ink-soft">
            Dashboard
          </span>
          <span className="w-10" />
        </div>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="h-9 flex-1 rounded-md border border-border bg-bg shadow-[inset_0_1px_2px_rgba(28,27,26,0.06)]" />
          <div className="hidden h-9 w-28 rounded-md border border-border bg-surface sm:block" />
          <div className="h-9 w-24 rounded-md bg-accent" />
        </div>
        <div className="hidden sm:block">
          <div className="grid grid-cols-6 gap-3 border-b border-border bg-[color-mix(in_srgb,var(--color-bg)_82%,var(--color-accent-soft)_18%)] px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
            <span>Name</span>
            <span>Email</span>
            <span>Owner</span>
            <span>Status</span>
            <span>Source</span>
            <span>Created</span>
          </div>
          <MockRow
            name="Priya Shah"
            email="priya@northline.io"
            owner="Alex Morgan"
            ownerId="mock-alex"
            status="Qualified"
            source="Website"
            date="4 Sep"
            highlight
          />
          <MockRow
            name="James Cole"
            email="james@harbor.co"
            owner={null}
            ownerId={null}
            status="New"
            source="Referral"
            date="8 Sep"
          />
          <MockRow
            name="Maya Chen"
            email="maya@lumen.app"
            owner="Sam Reed"
            ownerId="mock-sam"
            status="Won"
            source="LinkedIn"
            date="1 Sep"
          />
        </div>
        <div className="space-y-0 sm:hidden">
          <MobileMockCard
            name="Priya Shah"
            email="priya@northline.io"
            status="Qualified"
          />
          <MobileMockCard
            name="James Cole"
            email="james@harbor.co"
            status="New"
          />
        </div>
      </div>
    </div>
  );
}

export function PipelineMockup() {
  return (
    <div
      className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(28,27,26,0.06)]"
      aria-hidden="true"
    >
      <p className="font-heading text-sm font-semibold text-ink">Status pipeline</p>
      <p className="mt-1 text-xs text-ink-soft">
        Move an enquiry from first contact to won — without losing the thread.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <StatusBadge status="New" />
        <span className="text-ink-soft">→</span>
        <StatusBadge status="Contacted" />
        <span className="text-ink-soft">→</span>
        <StatusBadge status="Qualified" />
        <span className="text-ink-soft">→</span>
        <StatusBadge status="Won" />
      </div>
    </div>
  );
}

export function ActivityMockup() {
  return (
    <div
      className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(28,27,26,0.06)]"
      aria-hidden="true"
    >
      <p className="font-heading text-sm font-semibold text-ink">Activity</p>
      <ol className="relative mt-4 border-l border-border pl-4">
        <li className="relative pb-4">
          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
          <p className="text-sm text-ink">Alex changed status to Qualified</p>
          <p className="mt-0.5 text-xs text-ink-soft">2 hours ago</p>
        </li>
        <li className="relative">
          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
          <p className="text-sm text-ink">Sam assigned this enquiry</p>
          <p className="mt-0.5 text-xs text-ink-soft">Yesterday</p>
        </li>
      </ol>
    </div>
  );
}

function MockRow({
  name,
  email,
  owner,
  ownerId,
  status,
  source,
  date,
  highlight = false,
}: {
  name: string;
  email: string;
  owner: string | null;
  ownerId: string | null;
  status: "New" | "Qualified" | "Won";
  source: string;
  date: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-6 items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 ${
        highlight ? "bg-accent-soft/50" : ""
      }`}
    >
      <span className="truncate text-sm font-medium text-ink">{name}</span>
      <span className="truncate text-sm text-ink-soft">{email}</span>
      <span className="flex min-w-0 items-center gap-2">
        <OwnerAvatar fullName={owner} ownerId={ownerId} />
        <span className="truncate text-sm text-ink">{owner ?? "Unassigned"}</span>
      </span>
      <StatusBadge status={status} />
      <span className="text-sm text-ink-soft">{source}</span>
      <span className="text-sm text-ink-soft">{date}</span>
    </div>
  );
}

function MobileMockCard({
  name,
  email,
  status,
}: {
  name: string;
  email: string;
  status: "New" | "Qualified" | "Won";
}) {
  return (
    <div className="border-b border-border px-4 py-4 last:border-b-0">
      <p className="font-heading text-sm font-semibold text-ink">{name}</p>
      <p className="mt-0.5 text-xs text-ink-soft">{email}</p>
      <div className="mt-3">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

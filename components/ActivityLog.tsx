import { formatRelativeTime } from "@/lib/format";
import type { LeadActivity, Profile } from "@/types/lead";

type ActivityLogProps = {
  activities: LeadActivity[];
  profiles: Profile[];
};

function resolveOwnerLabel(
  value: string | null,
  profiles: Profile[],
): string {
  if (!value) return "Unassigned";
  return profiles.find((p) => p.id === value)?.fullName ?? "Unknown owner";
}

function describeActivity(
  activity: LeadActivity,
  profiles: Profile[],
): string {
  const actor = activity.changedByName ?? "Someone";

  if (activity.fieldChanged === "created") {
    return `${actor} created this enquiry`;
  }

  if (activity.fieldChanged === "status") {
    return `${actor} changed status from ${activity.oldValue ?? "—"} to ${activity.newValue ?? "—"}`;
  }

  if (activity.fieldChanged === "owner_id") {
    const from = resolveOwnerLabel(activity.oldValue, profiles);
    const to = resolveOwnerLabel(activity.newValue, profiles);
    return `${actor} changed owner from ${from} to ${to}`;
  }

  return `${actor} updated ${activity.fieldChanged}`;
}

export function ActivityLog({ activities, profiles }: ActivityLogProps) {
  if (activities.length === 0) {
    return (
      <p className="py-4 text-sm text-ink-soft">No activity yet</p>
    );
  }

  return (
    <ol className="relative space-y-0 border-l border-border pl-4">
      {activities.map((activity) => (
        <li key={activity.id} className="relative pb-5 last:pb-0">
          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
          <p className="text-sm text-ink">
            {describeActivity(activity, profiles)}
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">
            {formatRelativeTime(activity.createdAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}

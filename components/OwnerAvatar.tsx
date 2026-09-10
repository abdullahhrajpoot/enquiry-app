import { UserPlus } from "lucide-react";
import { getInitials, nameToHue } from "@/lib/format";

type OwnerAvatarProps = {
  fullName?: string | null;
  ownerId?: string | null;
  size?: "sm" | "md";
};

export function OwnerAvatar({
  fullName,
  ownerId,
  size = "sm",
}: OwnerAvatarProps) {
  const dimension = size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-[11px]";

  if (!ownerId || !fullName) {
    return (
      <span
        className={`inline-flex ${dimension} items-center justify-center rounded-full border border-dashed border-border text-ink-soft`}
        aria-label="Unassigned"
        title="Unassigned"
      >
        <UserPlus className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      </span>
    );
  }

  const hue = nameToHue(fullName);
  const initials = getInitials(fullName);

  return (
    <span
      className={`inline-flex ${dimension} items-center justify-center rounded-full font-medium`}
      style={{
        backgroundColor: `hsl(${hue} 42% 88%)`,
        color: `hsl(${hue} 38% 28%)`,
      }}
      aria-label={fullName}
      title={fullName}
    >
      {initials}
    </span>
  );
}

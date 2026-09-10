"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TopBarProps = {
  fullName: string;
};

export function TopBar({ fullName }: TopBarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <span className="font-heading text-base font-semibold tracking-tight text-ink">
        Enquiries
      </span>
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <span className="truncate text-sm text-ink-soft" title={fullName}>
          {fullName}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </header>
  );
}

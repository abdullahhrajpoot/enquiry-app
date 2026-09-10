"use client";

import Link from "next/link";
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
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 shadow-[0_1px_8px_-2px_rgba(28,27,26,0.08)] md:px-6">
      <Link
        href="/dashboard"
        className="font-heading text-base font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Enquiries
      </Link>
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <span className="truncate text-sm text-ink-soft" title={fullName}>
          {fullName}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn-ghost shrink-0 px-3 py-1.5"
        >
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </header>
  );
}

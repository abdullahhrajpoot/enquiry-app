import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type SiteHeaderProps = {
  variant?: "marketing" | "login" | "signup";
};

export async function SiteHeader({ variant = "marketing" }: SiteHeaderProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
            <svg
              viewBox="0 0 32 32"
              className="h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="7"
                y="8"
                width="18"
                height="16"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path d="M7 12.5h18" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M11 17h10M11 20.5h6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="font-heading text-base font-semibold tracking-tight text-ink">
            Enquiries
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link href="/dashboard" className="btn-primary">
              Open dashboard
            </Link>
          ) : (
            <>
              {variant !== "login" ? (
                <Link
                  href="/login"
                  className={`btn-ghost px-3 py-1.5 ${
                    variant === "marketing" ? "hidden sm:inline-flex" : ""
                  }`}
                >
                  Log in
                </Link>
              ) : null}
              {variant !== "signup" ? (
                <Link href="/signup" className="btn-primary px-3 py-1.5 sm:px-4">
                  Get started
                </Link>
              ) : null}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

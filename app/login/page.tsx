"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

function safeNextPath(value: string | null) {
  if (value && value.startsWith("/dashboard")) return value;
  return "/dashboard";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1fr_24rem] lg:items-center">
      <div className="hidden lg:block">
        <p className="text-sm font-medium text-accent">Welcome back</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-ink">
          Pick up the list where you left it.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
          Log in to see owners, status, and the activity trail — then keep
          moving enquiries forward.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border bg-surface p-7 shadow-[0_4px_12px_rgba(28,27,26,0.06),0_16px_32px_rgba(28,27,26,0.08)] sm:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Log in
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Sign in to manage enquiries.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field w-full"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-md bg-status-lost-soft px-3 py-2 text-sm text-status-lost"
            >
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={loading} className="btn-primary py-2.5">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent-soft),transparent_58%)]" />
      <div className="relative w-full">
        <div className="mx-auto flex justify-center">
          <Suspense
            fallback={
              <div className="h-80 w-full max-w-md animate-pulse rounded-2xl border border-border bg-surface" />
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

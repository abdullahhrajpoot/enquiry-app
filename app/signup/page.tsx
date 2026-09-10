"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (!data.user) {
      setLoading(false);
      setError("Sign up failed. Please try again.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      email,
    });

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setLoading(false);
        setError(signInError.message);
        return;
      }
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent-soft),transparent_58%)]" />
      <div className="relative grid w-full max-w-5xl gap-10 lg:grid-cols-[1fr_24rem] lg:items-center">
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-accent">Create an account</p>
          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-ink">
            Get the shared list standing in minutes.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
            Sign up, invite the team later, and start logging enquiries with
            owners and status from day one.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-border bg-surface p-7 shadow-[0_4px_12px_rgba(28,27,26,0.06),0_16px_32px_rgba(28,27,26,0.08)] sm:p-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink">
            Sign up
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Create an account to start managing enquiries.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="full_name" className="text-sm font-medium text-ink">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="field w-full"
              />
            </div>

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
                autoComplete="new-password"
                required
                minLength={6}
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

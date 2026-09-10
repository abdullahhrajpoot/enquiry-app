"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type LoadErrorProps = {
  message?: string;
};

export function LoadError({
  message = "We couldn’t load your enquiries. Please try again.",
}: LoadErrorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-ink">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-ink-soft" role="alert">
        {message}
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => router.refresh())}
        className="mt-6 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Retrying..." : "Try again"}
      </button>
    </div>
  );
}

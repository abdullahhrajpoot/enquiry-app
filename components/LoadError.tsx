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
        className="btn-primary mt-6"
      >
        {pending ? "Retrying..." : "Try again"}
      </button>
    </div>
  );
}

import Link from "next/link";
import {
  ActivityMockup,
  DashboardMockup,
  PipelineMockup,
} from "@/components/ProductMockups";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryHref = user ? "/dashboard" : "/signup";
  const primaryLabel = user ? "Open dashboard" : "Start tracking";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-bg">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,var(--color-accent-soft),transparent_62%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-accent">
                Enquiry tracking for sales and ops
              </p>
              <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
                Every inbound lead, in one calm workspace.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
                Capture enquiries, assign owners, and follow status changes
                without standing up a full CRM. Built for teams that just need
                to know who is handling what.
              </p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Link href={primaryHref} className="btn-primary px-5 py-2.5 text-center">
                  {primaryLabel}
                </Link>
                {user ? null : (
                  <Link href="/login" className="btn-ghost px-5 py-2.5 text-center">
                    Log in
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-14 md:mt-16">
              <DashboardMockup />
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
            <PipelineMockup />
            <ActivityMockup />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink">
              What it actually does
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              Enquiries is a shared list with just enough structure: contact
              details, an owner, a status, and a history of who changed what.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Capture in seconds"
              body="Name and email are required. Phone, source, owner, and notes are there when you need them — not in the way when you don’t."
            />
            <Feature
              title="See who owns it"
              body="Assign a teammate or leave it unassigned. Avatars and names stay visible on desktop and mobile so nothing sits in limbo."
            />
            <Feature
              title="Status with a trail"
              body="New, Contacted, Qualified, Won, Lost. Every status or owner change is written to the activity log automatically."
            />
          </div>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink">
              How a lead moves through
            </h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              <Step
                n="1"
                title="Someone reaches out"
                body="Log the enquiry from a form, call, or inbox. It lands on the shared list as New."
              />
              <Step
                n="2"
                title="Someone owns it"
                body="Pick an owner, add a note, and move it to Contacted or Qualified when you’ve actually spoken."
              />
              <Step
                n="3"
                title="The team can see why"
                body="Won or lost, the activity log still shows who changed status and when — no Slack archaeology."
              />
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="rounded-2xl border border-border bg-[color-mix(in_srgb,var(--color-accent-soft)_55%,var(--color-surface))] px-6 py-12 text-center md:px-12">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink">
              Stop losing enquiries in inboxes.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-ink-soft">
              {user
                ? "You’re signed in. Jump back to the list and pick up where the team left off."
                : "Create an account and start with an empty list — or log in if your team already set this up."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={primaryHref} className="btn-primary px-5 py-2.5">
                {primaryLabel}
              </Link>
              {user ? null : (
                <Link href="/login" className="btn-ghost px-5 py-2.5">
                  Log in
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-ink-soft sm:flex-row sm:items-center md:px-6">
          <p>Enquiries — lightweight tracking for inbound leads.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-accent">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-accent">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_4px_16px_rgba(28,27,26,0.04)]">
      <h3 className="font-heading text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <li className="rounded-2xl border border-border bg-bg p-5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft font-heading text-sm font-semibold text-accent">
        {n}
      </span>
      <h3 className="mt-4 font-heading text-base font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </li>
  );
}

import { LeadsSkeleton } from "@/components/LeadsSkeleton";

export default function DashboardLoading() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <LeadsSkeleton />
    </main>
  );
}

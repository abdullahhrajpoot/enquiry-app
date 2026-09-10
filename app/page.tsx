import { EnquiryTracker } from "@/components/EnquiryTracker";
import { LoadError } from "@/components/LoadError";
import { getLeads, getProfiles, LEADS_PAGE_SIZE } from "@/lib/leads";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  try {
    const [{ leads, total }, profiles] = await Promise.all([
      getLeads({ limit: LEADS_PAGE_SIZE, offset: 0 }),
      getProfiles(),
    ]);

    return (
      <main className="flex flex-1 flex-col">
        <EnquiryTracker
          initialLeads={leads}
          initialTotal={total}
          profiles={profiles}
        />
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We couldn’t load your enquiries. Please try again.";

    return (
      <main className="flex flex-1 flex-col">
        <LoadError message={message} />
      </main>
    );
  }
}

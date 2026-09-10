import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "Account";

  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      displayName = user.email || "Account";
    } else {
      displayName = profile?.full_name?.trim() || user.email || "Account";
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <TopBar fullName={displayName} />
      {children}
    </div>
  );
}

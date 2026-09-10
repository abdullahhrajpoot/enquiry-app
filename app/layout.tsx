import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { TopBar } from "@/components/TopBar";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Enquiries",
    template: "%s · Enquiries",
  },
  description: "Track sales enquiries, owners, and status changes in one place.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;

  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      displayName = user.email || "Account";
    } else {
      displayName =
        profile?.full_name?.trim() || user.email || "Account";
    }
  }

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col overflow-hidden font-sans text-ink bg-bg">
        {user ? <TopBar fullName={displayName ?? user.email ?? "Account"} /> : null}
        {children}
      </body>
    </html>
  );
}

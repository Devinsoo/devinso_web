import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { MemberProfile } from "@/components/Profile/MemberProfile";
import { getMemberProfile } from "@/components/Profile/data";
import { loadMemberProfile } from "@/lib/content/members";
import { DEVINSO_COOKIE, type DevinsoLanguage } from "@/lib/preferences";

type PageProps = {
  params: Promise<{ username: string }>;
};

/**
 * Live profile first, bundled profile second.
 *
 * The API answers with null when it is unreachable — which locally it often is
 * — so the bundled record keeps the page rendering during frontend-only work.
 * A member the API does not know and the bundle has no record of is a real 404.
 */
async function resolveProfile(username: string) {
  return (await loadMemberProfile(username)) ?? getMemberProfile(username);
}

async function readLanguage(): Promise<DevinsoLanguage> {
  const cookieStore = await cookies();
  return cookieStore.get(DEVINSO_COOKIE.language)?.value === "fa" ? "fa" : "en";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const [data, language] = await Promise.all([resolveProfile(username), readLanguage()]);

  // The root layout's title template appends "· Devinso", so titles here are
  // bare names — adding the brand again printed it twice in the tab.
  if (!data) {
    return { title: language === "fa" ? "عضو پیدا نشد" : "Member not found" };
  }

  const fa = language === "fa";
  return {
    title: (fa && data.profile.fullNameFa) || data.profile.fullName,
    description: (fa && data.profile.bioFa) || data.profile.bio,
  };
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { username } = await params;
  const [data, language] = await Promise.all([resolveProfile(username), readLanguage()]);

  if (!data) {
    notFound();
  }

  return <MemberProfile data={data} initialLanguage={language} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberProfile } from "@/components/Profile/MemberProfile";
import { getMemberProfile } from "@/components/Profile/data";
import { loadMemberProfile } from "@/lib/content/members";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await resolveProfile(username);

  if (!data) {
    return { title: "Member not found · Devinso" };
  }

  return {
    title: `${data.profile.fullName} · Devinso`,
    description: data.profile.bio,
  };
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await resolveProfile(username);

  if (!data) {
    notFound();
  }

  return <MemberProfile data={data} language="en" />;
}

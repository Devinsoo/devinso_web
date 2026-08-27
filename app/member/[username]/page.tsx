import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberProfile } from "@/components/Profile/MemberProfile";
import { getMemberProfile } from "@/components/Profile/data";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = getMemberProfile(username);

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
  const data = getMemberProfile(username);

  if (!data) {
    notFound();
  }

  return <MemberProfile data={data} language="en" />;
}

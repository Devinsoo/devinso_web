import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ProjectsPage } from "@/components/Projects/ProjectsPage";
import {
  DEVINSO_COOKIE,
  type DevinsoLanguage,
  type DevinsoTheme,
} from "@/lib/preferences";

export const metadata: Metadata = {
  title: "Project Archive | Devinso",
  description:
    "Selected product, identity, and interaction work from Devinso.",
};

export default async function Projects() {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get(DEVINSO_COOKIE.theme)?.value;
  const rawLanguage = cookieStore.get(DEVINSO_COOKIE.language)?.value;
  const initialTheme: DevinsoTheme = rawTheme === "light" ? "light" : "dark";
  const initialLanguage: DevinsoLanguage = rawLanguage === "fa" ? "fa" : "en";

  return <ProjectsPage initialTheme={initialTheme} initialLanguage={initialLanguage} />;
}

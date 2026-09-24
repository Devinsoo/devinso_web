import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell/AppShell";
import { fetchSiteSettings } from "@/lib/api/devinso";
import { loadRoster } from "@/lib/content/members";
import { loadSelectedWork } from "@/lib/content/work";
import {
  DEVINSO_COOKIE,
  type DevinsoLanguage,
  type DevinsoTheme,
} from "@/lib/preferences";

/**
 * Compatibility entry component.
 * Keeps older page.tsx files that import @/components/ScrollExperience working,
 * while delegating the actual UI to the refactored AppShell.
 */
export async function ScrollExperience() {
  const cookieStore = await cookies();

  const rawTheme = cookieStore.get(DEVINSO_COOKIE.theme)?.value;
  const rawLanguage = cookieStore.get(DEVINSO_COOKIE.language)?.value;

  const initialTheme: DevinsoTheme | undefined =
    rawTheme === "dark" || rawTheme === "light" ? rawTheme : undefined;

  const initialLanguage: DevinsoLanguage | undefined =
    rawLanguage === "en" || rawLanguage === "fa" ? rawLanguage : undefined;

  // Fetched here rather than in the sections themselves: both live inside
  // client components, and this is the last server boundary above them. The
  // two calls are independent, so they go out together.
  const [members, work, settings] = await Promise.all([
    loadRoster(),
    loadSelectedWork(),
    fetchSiteSettings(),
  ]);

  return (
    <AppShell
      members={members}
      work={work ?? undefined}
      settings={settings}
      initialTheme={initialTheme}
      initialLanguage={initialLanguage}
    />
  );
}

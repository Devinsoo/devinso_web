import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell/AppShell";
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
  const entryComplete = cookieStore.get(DEVINSO_COOKIE.entry)?.value === "1";

  const initialTheme: DevinsoTheme | undefined =
    rawTheme === "dark" || rawTheme === "light" ? rawTheme : undefined;

  const initialLanguage: DevinsoLanguage | undefined =
    rawLanguage === "en" || rawLanguage === "fa" ? rawLanguage : undefined;

  return (
    <AppShell
      initialEntryComplete={entryComplete}
      initialTheme={initialTheme}
      initialLanguage={initialLanguage}
    />
  );
}

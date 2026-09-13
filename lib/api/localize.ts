import type { DevinsoLanguage } from "@/lib/preferences";

/**
 * Picks the value for the current language, falling back to English.
 *
 * The API returns both languages at once and leaves the Persian side null until
 * someone translates it, so a half-translated profile still renders rather than
 * showing blanks.
 */
export function pickLanguage(
  language: DevinsoLanguage,
  english: string | undefined | null,
  persian: string | undefined | null,
): string {
  if (language === "fa" && persian && persian.trim().length > 0) return persian;
  return english ?? "";
}

/** The same choice, but preserving "there is nothing here" as undefined. */
export function pickOptional(
  language: DevinsoLanguage,
  english: string | undefined | null,
  persian: string | undefined | null,
): string | undefined {
  const value = pickLanguage(language, english, persian);
  return value.length > 0 ? value : undefined;
}

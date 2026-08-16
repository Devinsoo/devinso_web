export type DevinsoTheme = "dark" | "light";
export type DevinsoLanguage = "en" | "fa";

export const DEVINSO_COOKIE = {
  theme: "devinso_theme",
  language: "devinso_language",
  entry: "devinso_entry",
} as const;

const ONE_YEAR = 60 * 60 * 24 * 365;

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const prefix = `${encodeURIComponent(name)}=`;
  const item = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!item) return undefined;

  try {
    return decodeURIComponent(item.slice(prefix.length));
  } catch {
    return item.slice(prefix.length);
  }
}

export function setCookie(name: string, value: string, maxAge = ONE_YEAR): void {
  if (typeof document === "undefined") return;

  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function getSavedTheme(): DevinsoTheme | undefined {
  const value = getCookie(DEVINSO_COOKIE.theme);
  return value === "dark" || value === "light" ? value : undefined;
}

export function getSavedLanguage(): DevinsoLanguage | undefined {
  const value = getCookie(DEVINSO_COOKIE.language);
  return value === "en" || value === "fa" ? value : undefined;
}

export function isEntryComplete(): boolean {
  return getCookie(DEVINSO_COOKIE.entry) === "1";
}

export function savePreferences(theme: DevinsoTheme, language: DevinsoLanguage): void {
  setCookie(DEVINSO_COOKIE.theme, theme);
  setCookie(DEVINSO_COOKIE.language, language);
}

export function markEntryComplete(): void {
  setCookie(DEVINSO_COOKIE.entry, "1");
}

export const SITE_SETTINGS = {
  defaults: {
    language: "en" as const,
    theme: "dark" as const,

    // Developer-only control for the moving light through the background grid.
    // This is intentionally NOT exposed to visitors.
    // Suggested range: 0.10 (very subtle) → 0.45 (strong).
    gridLightIntensity: 0.20,
  },
  storageKeys: {
    language: "devinso-language",
    theme: "devinso-theme",
  },
} as const;

export type SiteLanguage = "en" | "fa";
export type SiteTheme = "dark" | "light";

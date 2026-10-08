import { ACCENTS, ACCENT_KEYS } from "@/lib/accents";

// A member's theme slug maps to the two accent RGB triplets that drive every
// glow, ring, and highlight on the profile — so two members with different
// themes visibly differ while the page shell (grid, layout, typography) stays
// identical to the rest of Devinso.
//
// Live profiles use their accent colour's key ("red", "blue", ...) as the
// slug; the named themes below remain for the bundled fixtures.

export type ThemeAccent = {
  slug: string;
  label: string;
  /** "R,G,B" — plugged into rgba(var(--accent-a), alpha) */
  a: string;
  /** "R,G,B" secondary tone for gradients */
  b: string;
  /** solid hex for text that needs to stay legible */
  solid: string;
};

const ACCENT_THEMES: Record<string, ThemeAccent> = Object.fromEntries(
  ACCENT_KEYS.map((key) => [
    key,
    { slug: key, label: ACCENTS[key].label, a: ACCENTS[key].rgb, b: ACCENTS[key].rgbB, solid: ACCENTS[key].strong },
  ]),
);

export const THEME_ACCENTS: Record<string, ThemeAccent> = {
  ...ACCENT_THEMES,
  "aurora-dark": { slug: "aurora-dark", label: "Aurora Dark", a: "110,188,255", b: "169,128,255", solid: "#9fd4ff" },
  "verdant-signal": { slug: "verdant-signal", label: "Verdant Signal", a: "110,238,180", b: "89,225,238", solid: "#8ff5c9" },
  "crimson-forge": { slug: "crimson-forge", label: "Crimson Forge", a: "255,120,110", b: "255,190,90", solid: "#ffb199" },
};

export const DEFAULT_THEME_ACCENT = THEME_ACCENTS["aurora-dark"];

export function getThemeAccent(slug?: string): ThemeAccent {
  if (!slug) return DEFAULT_THEME_ACCENT;
  return THEME_ACCENTS[slug] ?? DEFAULT_THEME_ACCENT;
}

export function accentCssVars(accent: ThemeAccent): React.CSSProperties {
  return {
    ["--accent-a" as string]: accent.a,
    ["--accent-b" as string]: accent.b,
  } as React.CSSProperties;
}

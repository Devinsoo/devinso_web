// The six accent colours a member or a project can be themed with. The admin
// panel stores one per record (`AccentColor` in the API) and every surface on
// the site — the member registry, the work rail, the project page and the
// profile — reads its tones from here, so a colour looks the same wherever it
// appears.

export const ACCENT_KEYS = ["red", "blue", "purple", "orange", "pink", "green"] as const;

export type AccentKey = (typeof ACCENT_KEYS)[number];

export type AccentPalette = {
  /** English label, as the API names it. */
  label: string;
  /** Persian label. */
  labelFa: string;
  /**
   * Solid 6-digit hex for text, dots and borders. Callers append a two-digit
   * alpha (`${strong}55`), so it must stay in #rrggbb form.
   */
  strong: string;
  /**
   * Darker twin of `strong` for text and dots on the light theme, where the
   * bright tones wash out. Same #rrggbb form.
   */
  deep: string;
  /** Faint tint for large shadows and backgrounds. */
  soft: string;
  /** Brighter tint for ambient glows. */
  glow: string;
  /** Diagonal wash behind a cover that has no image. */
  wash: string;
  /** "R,G,B" of `strong`, for `rgba(var(--accent-a), alpha)`. */
  rgb: string;
  /** "R,G,B" of a neighbouring hue, for two-tone gradients. */
  rgbB: string;
};

export const ACCENTS: Record<AccentKey, AccentPalette> = {
  red: {
    label: "Red",
    labelFa: "قرمز",
    strong: "#ff566f",
    deep: "#d92d4c",
    soft: "rgba(255,86,111,.12)",
    glow: "rgba(255,65,92,.18)",
    wash: "linear-gradient(135deg, rgba(110,6,18,.20), rgba(255,86,111,.08))",
    rgb: "255,86,111",
    rgbB: "255,160,110",
  },
  blue: {
    label: "Blue",
    labelFa: "آبی",
    strong: "#5fa2ff",
    deep: "#2563d6",
    soft: "rgba(95,162,255,.12)",
    glow: "rgba(80,150,255,.20)",
    wash: "linear-gradient(135deg, rgba(30,70,160,.20), rgba(95,162,255,.07))",
    rgb: "95,162,255",
    rgbB: "110,220,255",
  },
  purple: {
    label: "Purple",
    labelFa: "بنفش",
    strong: "#a996ff",
    deep: "#6a4fe0",
    soft: "rgba(169,150,255,.12)",
    glow: "rgba(145,122,255,.20)",
    wash: "linear-gradient(135deg, rgba(76,44,160,.18), rgba(169,150,255,.06))",
    rgb: "169,150,255",
    rgbB: "110,170,255",
  },
  orange: {
    label: "Orange",
    labelFa: "نارنجی",
    strong: "#ff9440",
    deep: "#cc5a0a",
    soft: "rgba(255,148,64,.12)",
    glow: "rgba(255,140,50,.19)",
    wash: "linear-gradient(135deg, rgba(140,60,8,.20), rgba(255,148,64,.07))",
    rgb: "255,148,64",
    rgbB: "255,206,90",
  },
  pink: {
    label: "Pink",
    labelFa: "صورتی",
    strong: "#ff66c4",
    deep: "#cf2f93",
    soft: "rgba(255,102,196,.12)",
    glow: "rgba(255,90,190,.19)",
    wash: "linear-gradient(135deg, rgba(140,20,95,.20), rgba(255,102,196,.07))",
    rgb: "255,102,196",
    rgbB: "190,130,255",
  },
  green: {
    label: "Green",
    labelFa: "سبز",
    strong: "#3ddc97",
    deep: "#13915b",
    soft: "rgba(61,220,151,.12)",
    glow: "rgba(50,210,140,.18)",
    wash: "linear-gradient(135deg, rgba(10,100,60,.20), rgba(61,220,151,.07))",
    rgb: "61,220,151",
    rgbB: "89,225,238",
  },
};

export const DEFAULT_ACCENT: AccentKey = "red";

// Names an older API (and older bundled data) used before the palette grew to
// six. They were persisted as the same numbers as red, purple and blue.
const LEGACY_ACCENTS: Record<string, AccentKey> = {
  crimson: "red",
  violet: "purple",
  ice: "blue",
};

function isAccentKey(value: string): value is AccentKey {
  return (ACCENT_KEYS as readonly string[]).includes(value);
}

/**
 * Normalises whatever the API sends ("Red", "red", or a legacy "Crimson") to a
 * palette key. Anything unrecognised falls back to red rather than breaking a
 * card.
 */
export function toAccentKey(value: string | null | undefined): AccentKey {
  if (!value) return DEFAULT_ACCENT;
  const key = value.trim().toLowerCase();
  if (isAccentKey(key)) return key;
  return LEGACY_ACCENTS[key] ?? DEFAULT_ACCENT;
}

/**
 * The palette for a key, with `strong` swapped for the deeper tone on the light
 * theme so accent text stays legible there.
 */
export function accentFor(key: AccentKey, light: boolean): AccentPalette {
  const palette = ACCENTS[key];
  return light ? { ...palette, strong: palette.deep } : palette;
}

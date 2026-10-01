// The labels drawn around the logo are technical readouts, not UI copy: they
// stay in English (and LTR) in every language.
const STAGE_GRID = { axis: "AXIS 639.43", original: "ORIGINAL CONSTRUCTION", guide: "GUIDE / 01" };

// The formation notes cycle through these states: security → backend → frontend.
const STAGE_NOTES = [
  { topA: "Pentest status", topB: "passed", bottomA: "Vulnerability", bottomB: "exploited", rightA: "CVSS score", rightB: "9.8" },
  { topA: "API gateway", topB: "connected", bottomA: "Dev branch", bottomB: "merged", rightA: "Server load", rightB: "12.4%" },
  { topA: "DOM tree", topB: "mounted", bottomA: "UI components", bottomB: "rendered", rightA: "Render time", rightB: "14.2ms" },
];

export const UI_COPY = {
  en: {
    studioTagline: "Digital product team",
    nav: { work: "Work", team: "Team", contact: "Contact", settings: "Settings", aria: "Primary navigation" },
    settings: {
      eyebrow: "Interface",
      title: "Preferences",
      theme: "Theme",
      themeHint: "Preserves motion, glass and grid effects",
      language: "Language",
      languageHint: "Switches UI copy and mirrors the layout for Persian",
      themeLight: "Light",
      themeDark: "Dark",
      stateLight: "LIGHT",
      stateDark: "DARK",
      english: "EN",
      persian: "FA",
      displayAria: "Display settings",
    },
    ambient: { leftA: "signal.field", leftB: "grid / live", rightA: "construction.flow", rightB: "status = active" },
    stage: {
      label: "IDENTITY CONSTRUCTION",
      subtitle: "Design × Development × Interaction",
      description:
        "At DEVINSO, we think beyond just a beautiful user interface. Our focus is on developing digital products that, alongside modern design, are built on solid software architecture, robust security, and optimized code.",
      primaryAction: "Explore work",
      secondaryAction: "Start a project",
      services: ["Product", "Brand", "Creative dev"],
      capabilitiesAria: "Capabilities",
      buildStatus: "construction resolved",
      coords: "GRID // 1285.46 × 807.55 · AXIS 639.43",
      scroll: "SCROLL TO EXPLORE",
      footerTag: "DEVINSO / ORIGINAL CONSTRUCTION SYSTEM",
      loader: {
        status: "INITIALIZING EXPERIENCE",
        complete: "SYSTEM READY",
        lines: [
          "boot.sequence // start",
          "loading design.system",
          "binding motion.engine",
          "syncing interface.layer",
        ],
      },
    },
    dial: { title: "CONSTRUCTION DIAL", subtitle: "AXIS / GUIDE / RESOLVE" },
    code: {
      leftLabel: "identity.ts",
      leftLines: [
        'const studio = defineStudio();',
        'studio.add("design");',
        'studio.add("code");',
        'studio.add("motion");',
        'export const devinso = studio.compile();',
      ],
      rightLabel: "construction.grid",
      rightLines: [
        'guides.load(original);',
        'axis.lock(639.43);',
        'mark.align(guides);',
        'stroke.resolve();',
        'identity.commit();',
      ],
      bottomLabel: "system / ready",
      bottomLines: [
        ['</>', 'type Identity = "DEVINSO";'],
        ['//', 'source: original-grid · alignment: preserved'],
      ],
    },
    grid: STAGE_GRID,
    notes: STAGE_NOTES,
    workIntro: {
      meta: "01 / SELECTED WORK",
      titleA: "SELECTED",
      titleB: "WORK",
      tagline: "Design, technology and interaction — resolved into shipped work.",
    },
  },
  fa: {
    studioTagline: "تیم طراحی محصول دیجیتال",
    nav: { work: "نمونه‌کار", team: "تیم", contact: "تماس", settings: "تنظیمات", aria: "ناوبری اصلی" },
    settings: {
      eyebrow: "رابط",
      title: "تنظیمات",
      theme: "تم",
      themeHint: "حرکت، شیشه و افکت‌های گرید حفظ می‌شوند",
      language: "زبان",
      languageHint: "رابط را فارسی می‌کند و چیدمان را قرینه می‌سازد",
      themeLight: "روشن",
      themeDark: "تاریک",
      stateLight: "روشن",
      stateDark: "تاریک",
      english: "EN",
      persian: "فا",
      displayAria: "تنظیمات نمایش",
    },
    ambient: { leftA: "signal.field", leftB: "grid / live", rightA: "construction.flow", rightB: "status = active" },
    stage: {
      label: "ساخت هویت",
      subtitle: "طراحی × توسعه × تعامل",
      description:
        "در DEVINSO، فراتر از یک رابط کاربری زیبا فکر می‌کنیم. تمرکز ما توسعه محصولات دیجیتالی است که در کنار طراحی مدرن، بر پایه معماری نرم‌افزاری مستحکم، امنیت بالا و کدی بهینه ساخته می‌شوند.",
      primaryAction: "مشاهده نمونه‌کارها",
      secondaryAction: "شروع پروژه",
      services: ["محصول", "برند", "توسعه خلاق"],
      capabilitiesAria: "توانمندی‌ها",
      buildStatus: "ساختار هویت آماده است",
      coords: "GRID // 1285.46 × 807.55 · AXIS 639.43",
      scroll: "برای ادامه اسکرول کنید",
      footerTag: "DEVINSO / سیستم ساخت اصلی",
      loader: {
        // Loader text stays English in both languages.
        status: "INITIALIZING EXPERIENCE",
        complete: "SYSTEM READY",
        lines: [
          "boot.sequence // start",
          "loading design.system",
          "binding motion.engine",
          "syncing interface.layer",
        ],
      },
    },
    dial: { title: "دایال ساخت", subtitle: "محور / گاید / نهایی‌سازی" },
    code: {
      leftLabel: "identity.fa",
      leftLines: [
        'const studio = defineStudio();',
        'studio.add("طراحی");',
        'studio.add("کد");',
        'studio.add("موشن");',
        'export const devinso = studio.compile();',
      ],
      rightLabel: "construction.fa",
      rightLines: [
        'guides.load(original);',
        'axis.lock(639.43);',
        'mark.align(guides);',
        'stroke.resolve();',
        'identity.commit();',
      ],
      bottomLabel: "سیستم / آماده",
      bottomLines: [
        ['</>', 'type Identity = "DEVINSO";'],
        ['//', 'منبع: گرید اصلی · هم‌ترازی: حفظ شده'],
      ],
    },
    grid: STAGE_GRID,
    notes: STAGE_NOTES,
    workIntro: {
      meta: "01 / نمونه‌کارهای منتخب",
      titleA: "نمونه‌کارهای",
      titleB: "منتخب",
      tagline: "طراحی، تکنولوژی و تعامل — تبدیل‌شده به محصولاتی که منتشر شده‌اند.",
    },
  },
} as const;

export type HeroCopy = (typeof UI_COPY)[keyof typeof UI_COPY];

export type ProfileCopy = {
  boot: { lines: string[]; status: string; ready: string; skip: string };
  eyebrow: string;
  roleLabel: Record<"ADMIN" | "MEMBER", string>;
  statusLabel: Record<"ACTIVE" | "INACTIVE" | "BLOCKED", string>;
  availabilityLabel: Record<"AVAILABLE" | "LIMITED" | "UNAVAILABLE", string>;
  meta: { joined: string; projects: string; skills: string; theme: string };
  contact: {
    website: string;
    github: string;
    linkedin: string;
    phone: string;
    location: string;
    message: string;
    resume: string;
    currentFocus: string;
  };
  experienceSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    current: string;
  };
  skillsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    levelLabels: Record<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT", string>;
  };
  signalsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    languages: string;
    tools: string;
    collaboration: string;
    personalSignals: string;
    proficiencyLabels: Record<"NATIVE" | "PROFESSIONAL" | "CONVERSATIONAL" | "BASIC", string>;
  };
  projectsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    typeLabel: Record<"PERSONAL" | "TEAM", string>;
    statusLabel: Record<"DRAFT" | "PUBLISHED" | "ARCHIVED", string>;
    role: string;
    stack: string;
    outcome: string;
    featured: string;
    viewProject: string;
    viewSource: string;
    empty: string;
  };
  footer: { tag: string; cta: string; resume: string };
};

export const PROFILE_COPY: Record<"en" | "fa", ProfileCopy> = {
  en: {
    boot: {
      lines: [
        "record.fetch(users)",
        "record.join(member_profiles)",
        "record.join(member_skills)",
        "record.join(projects)",
        "record.compile() // ok",
      ],
      status: "COMPILING MEMBER RECORD",
      ready: "RECORD READY",
      skip: "SKIP INTRO",
    },
    eyebrow: "MEMBER RECORD",
    roleLabel: { ADMIN: "ADMIN", MEMBER: "MEMBER" },
    statusLabel: { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE", BLOCKED: "BLOCKED" },
    availabilityLabel: { AVAILABLE: "AVAILABLE FOR SELECT PROJECTS", LIMITED: "LIMITED AVAILABILITY", UNAVAILABLE: "CURRENTLY UNAVAILABLE" },
    meta: {
      joined: "JOINED",
      projects: "PROJECTS",
      skills: "SKILLS",
      theme: "THEME",
    },
    contact: {
      website: "SITE",
      github: "GITHUB",
      linkedin: "LINKEDIN",
      phone: "CALL",
      location: "BASE",
      message: "START A CONVERSATION",
      resume: "VIEW CV",
      currentFocus: "CURRENT FOCUS",
    },
    experienceSection: {
      eyebrow: "02 / EXPERIENCE LOG",
      title: "SELECTED ROLES",
      subtitle: "A short record of the teams, responsibilities and systems that shaped the work.",
      current: "CURRENT",
    },
    skillsSection: {
      eyebrow: "03 / SKILL MATRIX",
      title: "SKILLS",
      subtitle: "Sourced from member_skills — grouped by category, leveled BEGINNER → EXPERT.",
      levelLabels: {
        BEGINNER: "BEGINNER",
        INTERMEDIATE: "INTERMEDIATE",
        ADVANCED: "ADVANCED",
        EXPERT: "EXPERT",
      },
    },
    signalsSection: {
      eyebrow: "04 / WORKING SIGNAL",
      title: "LANGUAGE & TOOLCHAIN",
      subtitle: "The communication range, tools and collaboration modes behind the output.",
      languages: "SPOKEN LANGUAGES",
      tools: "CORE TOOLCHAIN",
      collaboration: "COLLABORATION AREAS",
      personalSignals: "WORKING PROTOCOL",
      proficiencyLabels: {
        NATIVE: "NATIVE",
        PROFESSIONAL: "PROFESSIONAL",
        CONVERSATIONAL: "CONVERSATIONAL",
        BASIC: "BASIC",
      },
    },
    projectsSection: {
      eyebrow: "05 / PROJECT LOG",
      title: "PROJECTS",
      subtitle: "Every row is a projects × project_members join — role first, output second.",
      typeLabel: { PERSONAL: "PERSONAL", TEAM: "TEAM" },
      statusLabel: { DRAFT: "DRAFT", PUBLISHED: "LIVE", ARCHIVED: "ARCHIVED" },
      role: "ROLE",
      stack: "STACK",
      outcome: "IMPACT",
      featured: "FEATURED",
      viewProject: "VIEW PROJECT",
      viewSource: "SOURCE",
      empty: "No shipped projects on this record yet.",
    },
    footer: {
      tag: "DEVINSO / MEMBER RECORD SYSTEM",
      cta: "Start a project with this member",
      resume: "View CV",
    },
  },
  fa: {
    boot: {
      lines: [
        "record.fetch(users)",
        "record.join(member_profiles)",
        "record.join(member_skills)",
        "record.join(projects)",
        "record.compile() // ok",
      ],
      status: "در حال کامپایل رکورد عضو",
      ready: "رکورد آماده است",
      skip: "رد کردن مقدمه",
    },
    eyebrow: "رکورد عضو",
    roleLabel: { ADMIN: "مدیر", MEMBER: "عضو" },
    statusLabel: { ACTIVE: "فعال", INACTIVE: "غیرفعال", BLOCKED: "مسدود" },
    availabilityLabel: { AVAILABLE: "آماده همکاری در پروژه‌های منتخب", LIMITED: "ظرفیت همکاری محدود", UNAVAILABLE: "فعلاً آماده همکاری نیست" },
    meta: {
      joined: "تاریخ عضویت",
      projects: "پروژه‌ها",
      skills: "مهارت‌ها",
      theme: "تم",
    },
    contact: {
      website: "وبسایت",
      github: "گیت‌هاب",
      linkedin: "لینکدین",
      phone: "تماس",
      location: "محل",
      message: "شروع گفتگو",
      resume: "مشاهده رزومه",
      currentFocus: "تمرکز فعلی",
    },
    experienceSection: {
      eyebrow: "۰۲ / سوابق حرفه‌ای",
      title: "نقش‌های منتخب",
      subtitle: "مروری کوتاه بر تیم‌ها، مسئولیت‌ها و سیستم‌هایی که مسیر کاری را ساخته‌اند.",
      current: "فعلی",
    },
    skillsSection: {
      eyebrow: "۰۳ / ماتریس مهارت",
      title: "مهارت‌ها",
      subtitle: "برگرفته از member_skills — گروه‌بندی‌شده بر اساس دسته، با سطح از مبتدی تا خبره.",
      levelLabels: {
        BEGINNER: "مبتدی",
        INTERMEDIATE: "متوسط",
        ADVANCED: "پیشرفته",
        EXPERT: "خبره",
      },
    },
    signalsSection: {
      eyebrow: "۰۴ / سیگنال کاری",
      title: "زبان‌ها و ابزارها",
      subtitle: "زبان‌های گفتاری، ابزارها و شیوه‌های همکاری پشت خروجی نهایی.",
      languages: "زبان‌های گفتاری",
      tools: "ابزارهای اصلی",
      collaboration: "حوزه‌های همکاری",
      personalSignals: "پروتکل کاری",
      proficiencyLabels: {
        NATIVE: "زبان مادری",
        PROFESSIONAL: "حرفه‌ای",
        CONVERSATIONAL: "مکالمه",
        BASIC: "مقدماتی",
      },
    },
    projectsSection: {
      eyebrow: "۰۵ / سوابق پروژه",
      title: "پروژه‌ها",
      subtitle: "هر ردیف یک اتصال projects × project_members است — نقش، سپس خروجی.",
      typeLabel: { PERSONAL: "شخصی", TEAM: "تیمی" },
      statusLabel: { DRAFT: "پیش‌نویس", PUBLISHED: "منتشرشده", ARCHIVED: "بایگانی" },
      role: "نقش",
      stack: "تکنولوژی",
      outcome: "نتیجه",
      featured: "منتخب",
      viewProject: "مشاهده پروژه",
      viewSource: "سورس",
      empty: "هنوز پروژه‌ای در این رکورد ثبت نشده است.",
    },
    footer: {
      tag: "DEVINSO / سیستم رکورد اعضا",
      cta: "شروع پروژه با این عضو",
      resume: "مشاهده رزومه",
    },
  },
};

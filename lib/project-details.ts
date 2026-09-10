export type ProjectType = "PERSONAL" | "TEAM";
export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ProjectPreviewKind = "allixro" | "automation" | "identity";
export type ProjectMemberRole =
  | "LEAD"
  | "DEVELOPER"
  | "DESIGNER"
  | "STRATEGY"
  | "CONTRIBUTOR";

export type ProjectContentBlock =
  | { type: "heading"; text: string; textFa: string }
  | { type: "paragraph"; text: string; textFa: string }
  | { type: "image"; src: string; alt: string; altFa: string; caption?: string; captionFa?: string }
  | { type: "gallery"; images: Array<{ src: string; alt: string; altFa: string; caption?: string; captionFa?: string }> }
  | { type: "quote"; text: string; textFa: string; byline?: string; bylineFa?: string }
  | { type: "video"; src: string | null; poster?: string; caption?: string; captionFa?: string }
  | { type: "embed"; label: string; labelFa: string; url: string | null };

export type ProjectMember = {
  id: number;
  fullName: string;
  /** Structured role used for the badge on the member card. */
  roleType: ProjectMemberRole;
  /** Free-text job title shown under the member name. */
  role: string;
  description: string | null;
  avatar: string | null;
  joinedAt: string | null;
};

export type ProjectDetail = {
  id: number;
  slug: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  content: ProjectContentBlock[];
  coverImage: string | null;
  coverAlt: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  techStack: string[];
  type: ProjectType;
  status: ProjectStatus;
  createdBy: {
    id: number;
    fullName: string;
  };
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
  accent: string;
  accentSoft: string;
  preview: ProjectPreviewKind;
};

const ARMAN: ProjectMember = {
  id: 1,
  fullName: "Arman Kian",
  roleType: "LEAD",
  role: "Creative Full-Stack Engineer",
  description: "Product architecture, interaction development, and implementation.",
  avatar: null,
  joinedAt: "2026-01-18",
};

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    id: 1,
    slug: "allixro-red-profile",
    title: "ALLIXRO / RED PROFILE",
    titleFa: "الیکسرو / پروفایل قرمز",
    description:
      "A character-led visual cover system built around a sharp red portrait direction. The fixed 16:9 frame keeps every future cover recognisable while allowing the subject, crop, and content to change.",
    descriptionFa:
      "یک سیستم کاور بصری شخصیت‌محور با محوریت پرتره قرمز. قاب ثابت ۱۶:۹ باعث می‌شود کاورهای آینده با وجود تغییر سوژه، کراپ و محتوا همچنان قابل تشخیص باقی بمانند.",
    content: [
      { type: "heading", text: "FROM PORTRAIT TO REPEATABLE SYSTEM", textFa: "از پرتره تا یک سیستم تکرارپذیر" },
      {
        type: "paragraph",
        text: "Allixro started with a simple brief: build a red, character-led cover that feels immediate in a feed but still has enough structure to grow into a family of covers. The visual direction had to stay recognisable when the subject, crop, and supporting text changed.",
        textFa: "آلیکسرو با یک بریف ساده شروع شد: ساخت یک کاور قرمز و شخصیت‌محور که در فید سریع دیده شود و در عین حال آن‌قدر ساختار داشته باشد که به خانواده‌ای از کاورها گسترش پیدا کند. این جهت بصری باید با تغییر سوژه، کراپ و متن همراه همچنان قابل تشخیص بماند.",
      },
      {
        type: "image",
        src: "/projects/allixro-cover-1920x1080.jpg",
        alt: "Allixro red portrait cover system",
        altFa: "سیستم کاور پرتره قرمز آلیکسرو",
        caption: "Primary visual / portrait, crop, and red field",
        captionFa: "تصویر اصلی / پرتره، کراپ و میدان قرمز",
      },
      {
        type: "paragraph",
        text: "The solution is a fixed 16:9 frame with a clear reading order: the portrait owns the first glance, the red field creates the signal, and typography carries only the information needed to identify the piece. Keeping those rules stable means a new cover can be produced quickly without looking like a separate design.",
        textFa: "راه‌حل یک قاب ثابت ۱۶:۹ با ترتیب خوانش روشن است: پرتره نگاه اول را می‌گیرد، میدان قرمز سیگنال بصری را می‌سازد و تایپوگرافی فقط اطلاعات لازم برای شناسایی قطعه را حمل می‌کند. ثابت ماندن این قواعد باعث می‌شود کاور جدید سریع ساخته شود، بدون اینکه شبیه طرحی جداگانه به نظر برسد.",
      },
      {
        type: "heading",
        text: "WHAT THE FINAL SYSTEM CONTAINS",
        textFa: "سیستم نهایی شامل چه چیزهایی است",
      },
      {
        type: "paragraph",
        text: "The final handoff is more than one image. It includes the cover template, spacing and type rules, the motion behavior for digital use, and a small set of usage constraints so future variations keep the same tone.",
        textFa: "تحویل نهایی فقط یک تصویر نیست. قالب کاور، قواعد فاصله‌گذاری و تایپوگرافی، رفتار حرکتی برای استفاده دیجیتال و چند محدودیت کاربردی را شامل می‌شود تا نسخه‌های آینده همان لحن را حفظ کنند.",
      },
    ],
    coverImage: "/projects/allixro-cover-1920x1080.jpg",
    coverAlt: "Allixro red profile project cover",
    projectUrl: null,
    githubUrl: null,
    techStack: ["Cover Design", "Motion", "UI System"],
    type: "PERSONAL",
    status: "PUBLISHED",
    createdBy: { id: 1, fullName: "Arman Kian" },
    members: [ARMAN],
    createdAt: "2026-01-18",
    updatedAt: "2026-08-20",
    accent: "#ff5147",
    accentSoft: "rgba(255,81,71,.16)",
    preview: "allixro",
  },
  {
    id: 2,
    slug: "automation-platform",
    title: "AUTOMATION PLATFORM",
    titleFa: "پلتفرم اتوماسیون",
    description:
      "A modular operations workspace for building automation flows, monitoring nodes, and understanding live system state without turning the interface into a wall of diagnostics.",
    descriptionFa:
      "یک فضای عملیاتی ماژولار برای ساخت جریان‌های اتوماسیون، مانیتور نودها و درک وضعیت زنده سیستم؛ بدون تبدیل رابط به دیواری از اطلاعات تشخیصی.",
    content: [
      { type: "heading", text: "MAKE COMPLEXITY LEGIBLE", textFa: "پیچیدگی را خوانا کن" },
      {
        type: "paragraph",
        text: "This is where the complete project narrative can be assembled: decisions, screenshots, implementation notes, and links to the shipped product. Each block remains independently editable for a future admin editor.",
        textFa: "اینجا جایی است که روایت کامل پروژه جمع می‌شود: تصمیم‌ها، اسکرین‌شات‌ها، یادداشت‌های پیاده‌سازی و لینک محصول نهایی. هر بلوک برای یک ادیتور مدیریتی آینده جداگانه قابل ویرایش می‌ماند.",
      },
      { type: "embed", label: "PRODUCT WALKTHROUGH", labelFa: "نمایش محصول", url: null },
    ],
    coverImage: null,
    coverAlt: null,
    projectUrl: null,
    githubUrl: null,
    techStack: ["React", "REST API", "Realtime", "Design System"],
    type: "TEAM",
    status: "PUBLISHED",
    createdBy: { id: 1, fullName: "Arman Kian" },
    members: [
      { ...ARMAN, roleType: "DEVELOPER", role: "System Design + Development" },
    ],
    createdAt: "2026-02-06",
    updatedAt: "2026-08-18",
    accent: "#8d7dff",
    accentSoft: "rgba(141,125,255,.16)",
    preview: "automation",
  },
  {
    id: 3,
    slug: "identity-system",
    title: "IDENTITY SYSTEM",
    titleFa: "سیستم هویت",
    description:
      "A responsive identity where geometry, typography, and motion follow one shared set of rules. The system moves from a compact mark to complete interactive surfaces without losing recognition.",
    descriptionFa:
      "یک هویت واکنش‌گرا که هندسه، تایپوگرافی و موشن در آن از قوانین مشترک پیروی می‌کنند. سیستم از یک نشانه کوچک تا سطوح تعاملی کامل گسترش پیدا می‌کند، بدون اینکه تشخیص خود را از دست بدهد.",
    content: [
      { type: "heading", text: "A GRAMMAR FOR EVERY STATE", textFa: "یک دستور زبان برای هر وضعیت" },
      {
        type: "paragraph",
        text: "Use this flexible canvas for the detailed project write-up. A team can add context first, then follow with a gallery, quote, video, or an embedded prototype as the project grows.",
        textFa: "این بوم منعطف برای توضیحات کامل پروژه است. تیم می‌تواند ابتدا زمینه را اضافه کند و بعد با گالری، نقل‌قول، ویدئو یا پروتوتایپ جاسازی‌شده پروژه را کامل‌تر کند.",
      },
      {
        type: "gallery",
        images: [
          { src: "/projects/allixro-cover-1920x1080.jpg", alt: "Identity system visual study", altFa: "مطالعه بصری سیستم هویت", caption: "Reference frame / 01", captionFa: "قاب مرجع / ۰۱" },
        ],
      },
    ],
    coverImage: null,
    coverAlt: null,
    projectUrl: null,
    githubUrl: null,
    techStack: ["Brand System", "GSAP", "Web", "Typography"],
    type: "PERSONAL",
    status: "PUBLISHED",
    createdBy: { id: 1, fullName: "Arman Kian" },
    members: [
      { ...ARMAN, roleType: "DESIGNER", role: "Identity + Creative Development" },
    ],
    createdAt: "2026-03-12",
    updatedAt: "2026-08-22",
    accent: "#8be7ff",
    accentSoft: "rgba(139,231,255,.14)",
    preview: "identity",
  },
];

export function getProjectDetail(slug: string) {
  return PROJECT_DETAILS.find((project) => project.slug === slug);
}

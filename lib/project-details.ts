export type ProjectType = "PERSONAL" | "TEAM";
export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ProjectPreviewKind = "allixro" | "automation" | "identity";

export type ProjectMember = {
  id: number;
  fullName: string;
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
    coverImage: null,
    coverAlt: null,
    projectUrl: null,
    githubUrl: null,
    techStack: ["React", "REST API", "Realtime", "Design System"],
    type: "TEAM",
    status: "PUBLISHED",
    createdBy: { id: 1, fullName: "Arman Kian" },
    members: [
      { ...ARMAN, role: "System Design + Development" },
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
    coverImage: null,
    coverAlt: null,
    projectUrl: null,
    githubUrl: null,
    techStack: ["Brand System", "GSAP", "Web", "Typography"],
    type: "PERSONAL",
    status: "PUBLISHED",
    createdBy: { id: 1, fullName: "Arman Kian" },
    members: [
      { ...ARMAN, role: "Identity + Creative Development" },
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

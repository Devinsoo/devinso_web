"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowUpRight, Languages, Moon, Sun } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DEVINSO_COOKIE,
  setCookie,
  type DevinsoLanguage,
  type DevinsoTheme,
} from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger);

type Category = "product" | "identity" | "experiment";
type Filter = "all" | Category;
type Preview = "allixro" | "automation" | "identity" | "product" | "realtime" | "motion";

type Project = {
  id: string;
  index: string;
  title: string;
  category: Category;
  year: string;
  status: "shipped" | "lab";
  role: string;
  roleFa: string;
  description: string;
  descriptionFa: string;
  tags: string[];
  accent: string;
  preview: Preview;
  featured?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: "allixro",
    index: "01",
    title: "ALLIXRO / RED PROFILE",
    category: "identity",
    year: "2026",
    status: "shipped",
    role: "Art direction + cover system",
    roleFa: "آرت‌دایرکشن و سیستم کاور",
    description: "A character-led visual identity built around a sharp red portrait system and a repeatable cover language.",
    descriptionFa: "یک هویت بصری شخصیت‌محور با سیستم پرتره قرمز و زبان کاور قابل توسعه.",
    tags: ["IDENTITY", "MOTION", "UI"],
    accent: "#ff5147",
    preview: "allixro",
    featured: true,
  },
  {
    id: "automation-platform",
    index: "02",
    title: "AUTOMATION PLATFORM",
    category: "product",
    year: "2026",
    status: "shipped",
    role: "System design + development",
    roleFa: "طراحی سیستم و توسعه",
    description: "A modular operations workspace that turns complex automation flows into a calm, legible control surface.",
    descriptionFa: "یک فضای عملیاتی ماژولار که جریان‌های پیچیده اتوماسیون را به سطح کنترلی ساده و خوانا تبدیل می‌کند.",
    tags: ["REACT", "API", "REALTIME"],
    accent: "#8d7dff",
    preview: "automation",
  },
  {
    id: "identity-system",
    index: "03",
    title: "IDENTITY SYSTEM",
    category: "identity",
    year: "2026",
    status: "shipped",
    role: "Identity + creative development",
    roleFa: "هویت بصری و توسعه خلاق",
    description: "A responsive identity kit where typography, motion, and layout rules behave as one connected system.",
    descriptionFa: "یک کیت هویت واکنش‌گرا که تایپوگرافی، حرکت و قواعد چیدمان را در یک سیستم واحد کنار هم می‌آورد.",
    tags: ["BRAND", "GSAP", "WEB"],
    accent: "#8be7ff",
    preview: "identity",
  },
  {
    id: "product-window",
    index: "04",
    title: "PRODUCT WINDOW",
    category: "product",
    year: "2026",
    status: "lab",
    role: "Product UI exploration",
    roleFa: "اکتشاف رابط محصول",
    description: "A compact interface study for dense product data, focused on hierarchy, scanning speed, and useful motion.",
    descriptionFa: "مطالعه‌ای فشرده برای نمایش داده‌های متراکم محصول با تمرکز بر سلسله‌مراتب، سرعت اسکن و حرکت کاربردی.",
    tags: ["PRODUCT", "UI", "PROTOTYPE"],
    accent: "#d7ff5f",
    preview: "product",
  },
  {
    id: "realtime-board",
    index: "05",
    title: "REALTIME BOARD",
    category: "experiment",
    year: "2026",
    status: "lab",
    role: "Interaction experiment",
    roleFa: "آزمایش تعامل",
    description: "A collaborative board concept exploring presence, live state, and spatial feedback without visual noise.",
    descriptionFa: "کانسپت یک برد تیمی برای بررسی حضور کاربران، وضعیت زنده و بازخورد فضایی بدون شلوغی بصری.",
    tags: ["REALTIME", "UX", "SYSTEM"],
    accent: "#68a8ff",
    preview: "realtime",
  },
  {
    id: "motion-lab",
    index: "06",
    title: "MOTION LAB / 01",
    category: "experiment",
    year: "2026",
    status: "lab",
    role: "Motion direction",
    roleFa: "طراحی حرکت",
    description: "A motion sandbox for testing orbit, rhythm, depth, and transitions before they enter production interfaces.",
    descriptionFa: "یک محیط آزمایشی برای تست مدار، ریتم، عمق و ترنزیشن‌ها پیش از ورود به رابط‌های واقعی.",
    tags: ["MOTION", "GSAP", "R&D"],
    accent: "#ffbd69",
    preview: "motion",
  },
];

const COPY = {
  en: {
    archive: "PROJECT ARCHIVE", index: "INDEX / 2026", back: "BACK HOME",
    eyebrow: "SELECTED SYSTEMS / INTERFACES / IDENTITIES", titleA: "PROJECT", titleB: "ARCHIVE",
    intro: "A working index of shipped projects and ongoing experiments across product design, identity, and creative development.",
    filterLabel: "FILTER PROJECTS",
    filters: { all: "ALL", product: "PRODUCT", identity: "IDENTITY", experiment: "EXPERIMENT" },
    role: "ROLE", status: "STATUS", shipped: "SHIPPED", lab: "LAB / CONCEPT",
    projectCount: "PROJECTS", disciplineCount: "DISCIPLINES", current: "CURRENT INDEX", showing: "SHOWING",
    footer: "End of archive / New work is added as it ships.", home: "RETURN TO HOME",
  },
  fa: {
    archive: "آرشیو پروژه‌ها", index: "فهرست / ۲۰۲۶", back: "بازگشت به خانه",
    eyebrow: "سیستم‌ها / رابط‌ها / هویت‌های منتخب", titleA: "PROJECT", titleB: "ARCHIVE",
    intro: "فهرستی زنده از پروژه‌های منتشرشده و تجربه‌های در حال توسعه در طراحی محصول، هویت بصری و توسعه خلاق.",
    filterLabel: "فیلتر پروژه‌ها",
    filters: { all: "همه", product: "محصول", identity: "هویت", experiment: "تجربی" },
    role: "نقش", status: "وضعیت", shipped: "منتشرشده", lab: "آزمایش / کانسپت",
    projectCount: "پروژه", disciplineCount: "حوزه", current: "فهرست فعلی", showing: "در حال نمایش",
    footer: "پایان آرشیو / کارهای تازه بعد از انتشار اضافه می‌شوند.", home: "بازگشت به صفحه اصلی",
  },
} as const;

function AutomationPreview({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-[9%] overflow-hidden rounded-[18px] border border-white/10 bg-[#090b12] shadow-[0_30px_80px_rgba(0,0,0,.45)]">
      <div className="flex h-10 items-center justify-between border-b border-white/[.07] px-4">
        <div className="flex gap-1.5">{[0, 1, 2].map((dot) => <i key={dot} className="h-1.5 w-1.5 rounded-full bg-white/20" />)}</div>
        <span className="font-mono text-[7px] tracking-[.16em] text-white/30">FLOW / ACTIVE</span>
      </div>
      <div className="grid h-[calc(100%_-_40px)] grid-cols-[25%_1fr]">
        <div className="border-r border-white/[.06] p-3">
          <i className="block h-2 w-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 16px ${accent}` }} />
          <div className="mt-5 space-y-2">{[72, 54, 64, 42].map((width) => <i key={width} className="block h-1 rounded-full bg-white/[.09]" style={{ width: `${width}%` }} />)}</div>
        </div>
        <div className="relative p-4">
          <div className="grid grid-cols-3 gap-2">
            {["01", "12", "84"].map((value, index) => (
              <div key={value} className="rounded-lg border border-white/[.07] bg-white/[.025] p-2.5">
                <span className="font-mono text-[7px] text-white/25">0{index + 1}</span><b className="mt-2 block text-[clamp(15px,2vw,24px)] font-medium text-white/80">{value}</b>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-4 bottom-4 top-[52%] overflow-hidden rounded-lg border border-white/[.07] bg-white/[.018]">
            <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="project-flow-line absolute left-[8%] top-1/2 h-px w-[84%]" style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
            {[18, 48, 78].map((left) => <i key={left} className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white/30 bg-[#10131d]" style={{ left: `${left}%`, boxShadow: `0 0 14px ${accent}55` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentityPreview({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <div className="project-orbit absolute aspect-square h-[72%] rounded-full border border-white/[.08]" />
      <div className="absolute aspect-square h-[48%] rotate-45 border border-white/[.08]" />
      <span className="absolute left-[8%] top-[11%] font-mono text-[8px] tracking-[.18em] text-white/30">IDENTITY / GRID 03</span>
      <div className="relative flex items-end gap-[clamp(5px,1vw,12px)] text-[clamp(54px,12vw,150px)] font-[650] leading-none tracking-[-.13em] text-white/[.92]"><span>D</span><span className="text-white/14">/</span><span style={{ color: accent }}>S</span></div>
      <div className="absolute bottom-[10%] left-[9%] right-[9%] flex justify-between border-t border-white/10 pt-3 font-mono text-[7px] tracking-[.16em] text-white/30"><span>FORM / SYSTEM</span><span>RESPONSIVE MARK</span></div>
    </div>
  );
}

function ProductPreview({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-[8%] overflow-hidden rounded-xl border border-white/10 bg-[#080b0d]">
      <div className="flex h-full">
        <div className="w-[18%] border-r border-white/[.07] p-[6%_3%]">
          <i className="block h-5 w-5 rounded-md" style={{ backgroundColor: accent }} />
          <div className="mt-7 space-y-3">{[64, 82, 48, 70].map((width) => <i key={width} className="block h-1 rounded bg-white/10" style={{ width: `${width}%` }} />)}</div>
        </div>
        <div className="min-w-0 flex-1 p-[5%]">
          <div className="flex items-center justify-between"><div><i className="block h-1.5 w-16 rounded bg-white/30" /><i className="mt-2 block h-1 w-24 rounded bg-white/10" /></div><i className="h-6 w-14 rounded-full" style={{ backgroundColor: `${accent}22`, border: `1px solid ${accent}55` }} /></div>
          <div className="mt-[8%] grid grid-cols-2 gap-[4%]">
            {[0, 1, 2, 3].map((card) => <div key={card} className="relative aspect-[2/1] overflow-hidden rounded-lg border border-white/[.07] bg-white/[.025] p-3"><i className="block h-1 w-1/3 rounded bg-white/15" /><i className="absolute bottom-0 left-0 h-[2px]" style={{ width: `${42 + card * 13}%`, backgroundColor: accent }} /></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function RealtimePreview({ accent }: { accent: string }) {
  const cards = [
    { left: "10%", top: "18%", transform: "rotate(-4deg)" },
    { left: "38%", top: "34%", transform: "rotate(2deg)" },
    { left: "66%", top: "15%", transform: "rotate(5deg)" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:22px_22px]" />
      <svg className="absolute inset-0 h-full w-full opacity-55" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M18 45 C 34 62, 56 35, 82 48" fill="none" stroke={accent} strokeWidth="0.45" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" /></svg>
      {cards.map((card, index) => (
        <div key={card.left} className="project-board-card absolute w-[25%] rounded-[12px] border border-white/10 bg-[#111723]/95 p-[4%] shadow-[0_20px_50px_rgba(0,0,0,.28)]" style={card}>
          <div className="flex items-center justify-between"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: index === 1 ? accent : "rgba(255,255,255,.25)" }} /><span className="font-mono text-[6px] text-white/25">0{index + 1}</span></div>
          <i className="mt-5 block h-1 w-[78%] rounded bg-white/20" /><i className="mt-2 block h-1 w-[52%] rounded bg-white/10" />
        </div>
      ))}
      <span className="absolute bottom-[9%] right-[8%] flex items-center gap-2 font-mono text-[7px] tracking-[.15em] text-white/35"><i className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }} />03 ONLINE</span>
    </div>
  );
}

function MotionPreview({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <div className="project-motion-orbit relative aspect-square h-[66%] rounded-full border border-white/10">
        <i className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 26px ${accent}` }} />
        <div className="absolute inset-[16%] rounded-full border border-dashed border-white/10" />
        <div className="absolute inset-[33%] grid place-items-center rounded-full border border-white/[.08] bg-white/[.025]"><i className="h-2 w-2 rounded-full bg-white/60" /></div>
      </div>
      <div className="project-scan absolute left-0 top-1/2 h-px w-full" style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
      <span className="absolute left-[8%] top-[10%] font-mono text-[7px] tracking-[.18em] text-white/30">ORBIT / RHYTHM / DEPTH</span>
    </div>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  if (project.preview === "allixro") return <><Image src="/projects/allixro-cover-1920x1080.jpg" alt="Allixro red profile project cover" fill sizes="(max-width: 900px) 100vw, 66vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" priority /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(4,5,8,.45))]" /></>;
  if (project.preview === "automation") return <AutomationPreview accent={project.accent} />;
  if (project.preview === "identity") return <IdentityPreview accent={project.accent} />;
  if (project.preview === "product") return <ProductPreview accent={project.accent} />;
  if (project.preview === "realtime") return <RealtimePreview accent={project.accent} />;
  return <MotionPreview accent={project.accent} />;
}

function ProjectCard({ project, language, theme }: { project: Project; language: DevinsoLanguage; theme: DevinsoTheme }) {
  const copy = COPY[language];
  const light = theme === "light";
  const rtl = language === "fa";

  return (
    <article data-project-card className={`group relative overflow-hidden rounded-[22px] border ${project.featured ? "lg:col-span-2" : ""} ${light ? "border-[#203650]/10 bg-white/58 shadow-[0_28px_70px_rgba(34,51,75,.07)]" : "border-white/[.08] bg-white/[.018] shadow-[0_30px_90px_rgba(0,0,0,.18)]"}`} style={{ "--project-accent": project.accent } as CSSProperties}>
      <div className={`relative overflow-hidden border-b ${project.featured ? "aspect-[16/7] max-md:aspect-[4/3]" : "aspect-[16/11]"} ${light ? "border-[#203650]/10 bg-[#dfe6ef]" : "border-white/[.08] bg-[#090b10]"}`}>
        <ProjectPreview project={project} />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 font-mono text-[8px] tracking-[.16em] text-white/75 backdrop-blur-xl"><i className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.accent, boxShadow: `0 0 12px ${project.accent}` }} />{project.index} / {project.category.toUpperCase()}</div>
        <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/30 px-3 py-2 font-mono text-[7px] tracking-[.14em] text-white/55 backdrop-blur-xl">16:9 / VISUAL</span>
      </div>

      <div className={`grid gap-7 p-[clamp(20px,3vw,34px)] ${project.featured ? "lg:grid-cols-[1.35fr_.65fr]" : ""} ${rtl ? "text-right [direction:rtl]" : "text-left"}`}>
        <div>
          <div className="flex items-start justify-between gap-5 [direction:ltr]"><h2 className={`max-w-[15ch] text-[clamp(24px,3.2vw,46px)] font-[560] leading-[.92] tracking-[-.055em] ${light ? "text-[#17253a]" : "text-white/92"}`}>{project.title}</h2><ArrowUpRight className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 ${light ? "text-[#294368]/30" : "text-white/25"}`} strokeWidth={1.4} /></div>
          <p className={`mt-5 max-w-[62ch] text-[13px] leading-7 ${light ? "text-[#243b59]/60" : "text-white/52"}`}>{rtl ? project.descriptionFa : project.description}</p>
        </div>

        <dl className={`grid content-start gap-3 ${project.featured ? "sm:grid-cols-2 lg:grid-cols-1" : "sm:grid-cols-2"}`}>
          <div className={`rounded-xl border p-3.5 ${light ? "border-[#203650]/10 bg-white/55" : "border-white/[.07] bg-white/[.02]"}`}><dt className={`font-mono text-[7px] uppercase tracking-[.17em] ${light ? "text-[#294368]/38" : "text-white/30"}`}>{copy.role}</dt><dd className={`mt-2 text-[11px] leading-5 ${light ? "text-[#17253a]/72" : "text-white/68"}`}>{rtl ? project.roleFa : project.role}</dd></div>
          <div className={`rounded-xl border p-3.5 ${light ? "border-[#203650]/10 bg-white/55" : "border-white/[.07] bg-white/[.02]"}`}><dt className={`font-mono text-[7px] uppercase tracking-[.17em] ${light ? "text-[#294368]/38" : "text-white/30"}`}>{copy.status}</dt><dd className="mt-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.1em] [direction:ltr]" style={{ color: project.accent }}><i className="h-1.5 w-1.5 rounded-full bg-current" />{project.status === "shipped" ? copy.shipped : copy.lab}</dd></div>
        </dl>

        <div className={`flex flex-wrap gap-2 ${project.featured ? "lg:col-span-2" : ""} [direction:ltr]`}>
          {project.tags.map((tag) => <span key={tag} className={`rounded-full border px-3 py-2 font-mono text-[7px] tracking-[.15em] ${light ? "border-[#203650]/10 text-[#294368]/55" : "border-white/[.08] text-white/42"}`}>{tag}</span>)}
          <span className={`ml-auto px-1 py-2 font-mono text-[8px] tracking-[.16em] ${light ? "text-[#294368]/35" : "text-white/28"}`}>{project.year}</span>
        </div>
      </div>
    </article>
  );
}

type ProjectsPageProps = {
  initialTheme: DevinsoTheme;
  initialLanguage: DevinsoLanguage;
};

export function ProjectsPage({ initialTheme, initialLanguage }: ProjectsPageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<DevinsoTheme>(initialTheme);
  const [language, setLanguage] = useState<DevinsoLanguage>(initialLanguage);
  const [filter, setFilter] = useState<Filter>("all");
  const copy = COPY[language];
  const light = theme === "light";
  const rtl = language === "fa";

  const filteredProjects = useMemo(() => filter === "all" ? PROJECTS : PROJECTS.filter((project) => project.category === filter), [filter]);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
  }, [language, theme]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(rootRef.current.querySelectorAll("[data-project-card], [data-project-reveal]"), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo("[data-project-reveal]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.055, ease: "power2.out" });
      gsap.utils.toArray<HTMLElement>("[data-project-card]").forEach((card) => {
        const reveal = gsap.fromTo(card, { opacity: 0, y: 54 }, { opacity: 1, y: 0, duration: 0.82, paused: true, ease: "power3.out" });
        ScrollTrigger.create({ trigger: card, start: "top 88%", end: "bottom 10%", onEnter: () => reveal.restart(), onEnterBack: () => reveal.restart(), onLeaveBack: () => reveal.reverse() });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [filter]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setCookie(DEVINSO_COOKIE.theme, nextTheme);
  };
  const toggleLanguage = () => {
    const nextLanguage = language === "en" ? "fa" : "en";
    setLanguage(nextLanguage);
    setCookie(DEVINSO_COOKIE.language, nextLanguage);
  };

  return (
    <main ref={rootRef} className={`project-archive relative min-h-screen overflow-hidden transition-colors duration-500 ${light ? "bg-[#eef3f8] text-[#17253a]" : "bg-[#050508] text-[#f3f5fa]"}`}>
      <div className={`pointer-events-none fixed inset-0 opacity-70 ${light ? "[background-image:linear-gradient(rgba(43,66,97,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(43,66,97,.045)_1px,transparent_1px)]" : "[background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)]"} [background-size:48px_48px]`} />
      <div className={`pointer-events-none absolute -right-[18vw] top-[-14vw] h-[56vw] w-[56vw] rounded-full blur-3xl ${light ? "bg-[#5794d4]/[.09]" : "bg-[#6d7dff]/[.055]"}`} />

      <header className={`sticky top-0 z-50 border-b backdrop-blur-2xl ${light ? "border-[#203650]/10 bg-[#eef3f8]/78" : "border-white/[.065] bg-[#050508]/78"}`}>
        <div className="mx-auto flex h-[74px] w-[min(1440px,calc(100%_-_clamp(28px,6vw,96px)))] items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.17em]"><i className="h-[7px] w-[7px] rounded-full bg-[#6fe2ef] shadow-[0_0_18px_rgba(111,226,239,.6)]" /><span>DEVINSO</span><span className={`hidden font-mono text-[8px] font-normal sm:inline ${light ? "text-[#294368]/38" : "text-white/25"}`}>{copy.archive}</span></Link>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleLanguage} className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 font-mono text-[8px] tracking-[.16em] transition-transform hover:-translate-y-0.5 ${light ? "border-[#203650]/10 bg-white/50 text-[#17253a]/70" : "border-white/[.08] bg-white/[.03] text-white/65"}`} aria-label="Change language"><Languages className="h-3.5 w-3.5" strokeWidth={1.5} />{language === "en" ? "FA" : "EN"}</button>
            <button type="button" onClick={toggleTheme} className={`grid h-10 w-10 place-items-center rounded-full border transition-transform hover:-translate-y-0.5 ${light ? "border-[#203650]/10 bg-white/50 text-[#17253a]/70" : "border-white/[.08] bg-white/[.03] text-white/65"}`} aria-label="Toggle color theme">{light ? <Moon className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />}</button>
            <Link href="/" className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[8px] font-medium uppercase tracking-[.14em] transition-transform hover:-translate-y-0.5 max-sm:px-3 ${light ? "border-[#203650]/10 bg-[#17253a] text-white" : "border-white/[.1] bg-white/[.075] text-white/80"}`}><ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /><span className="max-sm:hidden">{copy.back}</span></Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-[min(1440px,calc(100%_-_clamp(28px,6vw,96px)))] pb-12 pt-[clamp(72px,10vw,142px)]">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div className={rtl ? "text-right [direction:rtl]" : "text-left"}>
            <p data-project-reveal className={`font-mono text-[9px] uppercase tracking-[.22em] ${light ? "text-[#294368]/45" : "text-white/34"}`}>{copy.eyebrow}</p>
            <h1 data-project-reveal className="mt-7 text-[clamp(62px,10vw,142px)] font-[570] leading-[.76] tracking-[-.085em] [direction:ltr]"><span className="block">{copy.titleA}</span><span className={`mt-[.12em] block ${light ? "text-[#294368]/15" : "text-white/11"}`}>{copy.titleB}</span></h1>
          </div>
          <div data-project-reveal className={rtl ? "text-right [direction:rtl]" : "text-left"}>
            <p className={`max-w-[58ch] text-[13px] leading-7 ${light ? "text-[#243b59]/58" : "text-white/48"}`}>{copy.intro}</p>
            <div className={`mt-8 grid grid-cols-3 border-y ${light ? "border-[#203650]/10" : "border-white/[.07]"}`}>
              {[["06", copy.projectCount], ["03", copy.disciplineCount], ["2026", copy.current]].map(([value, label], index) => <div key={label} className={`py-4 ${index ? `border-l ${light ? "border-[#203650]/10" : "border-white/[.07]"}` : ""} ${rtl ? "px-2 text-center [direction:rtl]" : "px-3"}`}><b className="block text-[15px] font-medium">{value}</b><span className={`mt-1 block font-mono text-[6px] uppercase tracking-[.15em] ${light ? "text-[#294368]/35" : "text-white/27"}`}>{label}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-[min(1440px,calc(100%_-_clamp(28px,6vw,96px)))] pb-[clamp(84px,11vw,160px)]">
        <div data-project-reveal className={`sticky top-[74px] z-40 -mx-2 mb-8 flex flex-wrap items-center justify-between gap-4 border-y px-2 py-4 backdrop-blur-2xl ${light ? "border-[#203650]/10 bg-[#eef3f8]/82" : "border-white/[.07] bg-[#050508]/82"}`}>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={copy.filterLabel}>
            {(Object.keys(copy.filters) as Filter[]).map((item) => {
              const active = filter === item;
              return <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={active} className={`rounded-full border px-4 py-2.5 font-mono text-[8px] uppercase tracking-[.15em] transition-all ${active ? light ? "border-[#17253a] bg-[#17253a] text-white" : "border-white/75 bg-white text-[#090b10]" : light ? "border-[#203650]/10 text-[#294368]/55 hover:border-[#203650]/25" : "border-white/[.08] text-white/38 hover:border-white/20 hover:text-white/65"}`}>{copy.filters[item]}</button>;
            })}
          </div>
          <div className={`font-mono text-[7px] uppercase tracking-[.16em] ${light ? "text-[#294368]/38" : "text-white/28"}`} aria-live="polite">{copy.showing} / {String(filteredProjects.length).padStart(2, "0")}</div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project} language={language} theme={theme} />)}</div>
      </section>

      <footer className={`relative z-10 border-t ${light ? "border-[#203650]/10" : "border-white/[.07]"}`}>
        <div className="mx-auto flex min-h-[190px] w-[min(1440px,calc(100%_-_clamp(28px,6vw,96px)))] flex-col justify-between gap-8 py-10 sm:flex-row sm:items-end">
          <div className={rtl ? "text-right [direction:rtl]" : "text-left"}><span className={`font-mono text-[8px] uppercase tracking-[.18em] ${light ? "text-[#294368]/36" : "text-white/28"}`}>{copy.index}</span><p className={`mt-3 text-[12px] ${light ? "text-[#294368]/55" : "text-white/45"}`}>{copy.footer}</p></div>
          <Link href="/" className="group inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.15em]"><span>{copy.home}</span><ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} /></Link>
        </div>
      </footer>
    </main>
  );
}

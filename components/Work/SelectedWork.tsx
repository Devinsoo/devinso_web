"use client";

import { useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger);

type SelectedWorkProps = {
  theme: DevinsoTheme;
  language: DevinsoLanguage;
};

type MorphMode = "expand" | "split" | "depth";

type WorkProject = {
  id: string;
  number: string;
  title: string;
  titleFa: string;
  category: string;
  categoryFa: string;
  description: string;
  descriptionFa: string;
  role: string;
  roleFa: string;
  stack: string[];
  year: string;
  accent: "crimson" | "violet" | "ice";
  morph: MorphMode;
  preview?: "automation" | "identity";
  coverImage?: string;
  coverAlt?: string;
  layout: "media-right" | "media-left" | "stacked";
};

const PROJECTS: WorkProject[] = [
  {
    id: "dark-zero-returns",
    number: "01",
    title: "ALLIXRO / RED PROFILE",
    titleFa: "الیکسرو / پروفایل قرمز",
    category: "Visual cover / Character study",
    categoryFa: "کاور بصری / مطالعه شخصیت",
    description:
      "A real image-based project cover. The frame is intentionally built around a fixed 16:9 media area so members can replace the cover freely later with a standard 1920×1080 asset.",
    descriptionFa:
      "این یک کاور واقعی مبتنی بر تصویر است. قاب عمداً روی یک ناحیه ثابت 16:9 ساخته شده تا اعضا بعداً بتوانند با استاندارد 1920×1080 هر کاوری را خیلی راحت جایگزین کنند.",
    role: "Art direction + Cover system",
    roleFa: "آرت دایرکشن + سیستم کاور",
    stack: ["Cover", "Motion", "UI"],
    year: "2026",
    accent: "crimson",
    morph: "expand",
    coverImage: "/projects/allixro-cover-1920x1080.jpg",
    coverAlt: "Allixro red profile project cover",
    layout: "media-right",
  },
  {
    id: "automation-platform",
    number: "02",
    title: "AUTOMATION PLATFORM",
    titleFa: "پلتفرم اتوماسیون",
    category: "SaaS / Automation system",
    categoryFa: "SaaS / سیستم اتوماسیون",
    description:
      "A modular control surface for orchestrating flows, monitoring nodes and reducing visual noise while keeping technical clarity intact.",
    descriptionFa:
      "یک سطح کنترل ماژولار برای مدیریت جریان‌ها، مانیتور نودها و کاهش شلوغی بصری بدون از بین رفتن وضوح فنی.",
    role: "System design + Development",
    roleFa: "طراحی سیستم + توسعه",
    stack: ["React", "API", "Realtime"],
    year: "2026",
    accent: "violet",
    morph: "split",
    preview: "automation",
    layout: "media-left",
  },
  {
    id: "identity-system",
    number: "03",
    title: "IDENTITY SYSTEM",
    titleFa: "سیستم هویت",
    category: "Brand system / Interactive identity",
    categoryFa: "هویت برند / هویت تعاملی",
    description:
      "A visual system where geometry, typography and motion share the same rules — turning one persistent frame into multiple states instead of separate disconnected sections.",
    descriptionFa:
      "یک سیستم بصری که در آن هندسه، تایپوگرافی و موشن از قوانین مشترک پیروی می‌کنند؛ یعنی یک قاب ثابت به چند وضعیت مختلف تبدیل می‌شود، نه چند سکشن جدا از هم.",
    role: "Identity + Creative development",
    roleFa: "هویت بصری + توسعه خلاق",
    stack: ["Brand", "GSAP", "Web"],
    year: "2026",
    accent: "ice",
    morph: "depth",
    preview: "identity",
    layout: "stacked",
  },
];

const COPY = {
  en: {
    eyebrow: "SELECTED WORK / 01—03",
    titleA: "SELECTED",
    titleB: "WORK",
    intro: "A continuous project rail where each cover morphs with a different behavior to keep the section alive and non-repetitive.",
    project: "PROJECT",
    role: "ROLE",
    stack: "STACK",
    year: "YEAR",
    morph: "MORPH",
    viewCase: "VIEW CASE",
    viewAll: "VIEW ALL PROJECTS",
    signal: "CURATED / RECENT / TEAM",
    coverSpec: "COVER SPEC / 1920 × 1080 / 16:9",
    mode: {
      expand: "EXPAND",
      split: "SPLIT",
      depth: "DEPTH",
    },
  },
  fa: {
    eyebrow: "نمونه‌کارهای منتخب / ۰۱—۰۳",
    titleA: "SELECTED",
    titleB: "WORK",
    intro: "یک ریل پروژه‌ای پیوسته که هر کاور با رفتاری متفاوت مورف می‌شود تا سکشن زنده بماند و تکراری نشود.",
    project: "پروژه",
    role: "نقش",
    stack: "تکنولوژی",
    year: "سال",
    morph: "مورف",
    viewCase: "مشاهده پروژه",
    viewAll: "مشاهده همه پروژه‌ها",
    signal: "منتخب / جدید / تیمی",
    coverSpec: "استاندارد کاور / 1920 × 1080 / 16:9",
    mode: {
      expand: "EXPAND",
      split: "SPLIT",
      depth: "DEPTH",
    },
  },
} as const;

const ACCENTS = {
  crimson: {
    glow: "rgba(255,65,92,.18)",
    strong: "#ff566f",
    soft: "rgba(255,86,111,.12)",
    wash: "linear-gradient(135deg, rgba(110,6,18,.20), rgba(255,86,111,.08))",
  },
  violet: {
    glow: "rgba(145,122,255,.20)",
    strong: "#a996ff",
    soft: "rgba(169,150,255,.12)",
    wash: "linear-gradient(135deg, rgba(76,44,160,.18), rgba(169,150,255,.06))",
  },
  ice: {
    glow: "rgba(150,195,255,.18)",
    strong: "#a7ceff",
    soft: "rgba(167,206,255,.11)",
    wash: "linear-gradient(135deg, rgba(63,108,187,.16), rgba(167,206,255,.06))",
  },
} as const;

function AutomationPreview({ light }: { light: boolean }) {
  return (
    <div className="absolute inset-[7%] overflow-hidden rounded-[24px]">
      <div className={`absolute inset-0 rounded-[24px] border ${light ? "border-[#4f4180]/10 bg-[#f9f8ff]" : "border-white/[.08] bg-[#090810]"}`} />
      <div className={`absolute inset-0 opacity-70 ${light ? "[background-image:linear-gradient(rgba(80,63,126,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(80,63,126,.06)_1px,transparent_1px)]" : "[background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)]"} [background-size:32px_32px]`} />
      <div className="absolute inset-[8%] grid grid-cols-2 gap-4">
        {["SOURCE", "ROUTER", "FILTER", "OUTPUT"].map((item, index) => (
          <div key={item} className={`rounded-2xl border p-4 ${light ? "border-[#695c96]/10 bg-white/88" : "border-white/[.075] bg-[#12111a]/88"}`}>
            <div className="flex items-center gap-2">
              <i className={`h-2 w-2 rounded-full ${index === 3 ? (light ? "bg-[#725bc2]" : "bg-[#a996ff] shadow-[0_0_12px_rgba(169,150,255,.55)]") : light ? "bg-[#6d5b9d]/25" : "bg-white/14"}`} />
              <span className={`text-[8px] font-[650] tracking-[.17em] ${light ? "text-[#433760]/55" : "text-white/45"}`}>{item}</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className={`h-2 rounded-full ${light ? "bg-[#59467b]/10" : "bg-white/[.07]"}`} />
              <div className={`h-2 w-[72%] rounded-full ${light ? "bg-[#59467b]/[.07]" : "bg-white/[.045]"}`} />
            </div>
          </div>
        ))}
      </div>
      <div className={`absolute bottom-[7%] left-[7%] rounded-full border px-3 py-2 text-[8px] uppercase tracking-[.16em] ${light ? "border-[#695c96]/10 bg-white/75 text-[#433760]/40" : "border-white/[.07] bg-white/[.025] text-white/30"}`}>
        4 NODES / LIVE FLOW / READY
      </div>
    </div>
  );
}

function IdentityPreview({ light }: { light: boolean }) {
  return (
    <div className="absolute inset-[7%] overflow-hidden rounded-[24px]">
      <div className={`absolute inset-0 rounded-[24px] border ${light ? "border-[#34527c]/10 bg-[#f8fbff]" : "border-white/[.075] bg-[#080b10]"}`} />
      <div className={`absolute inset-0 ${light ? "[background-image:linear-gradient(rgba(54,82,124,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(54,82,124,.055)_1px,transparent_1px)]" : "[background-image:linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]"} [background-size:46px_46px]`} />
      <div className="absolute inset-[9%] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className={`text-[8px] uppercase tracking-[.2em] ${light ? "text-[#314a6e]/35" : "text-white/28"}`}>DEVINSO / IDENTITY</span>
          <span className={`font-mono text-[8px] tracking-[.13em] ${light ? "text-[#314a6e]/25" : "text-white/20"}`}>639.43 / AXIS</span>
        </div>
        <div className="relative py-10">
          <div className={`absolute left-1/2 top-0 h-full w-px ${light ? "bg-[#49668f]/10" : "bg-white/[.055]"}`} />
          <div className={`absolute left-0 top-1/2 h-px w-full ${light ? "bg-[#49668f]/10" : "bg-white/[.055]"}`} />
          <div className={`relative text-center text-[clamp(44px,8vw,118px)] font-[560] leading-none tracking-[-.085em] ${light ? "bg-[linear-gradient(110deg,#182641,#486a9a_70%,#6c60a2)] bg-clip-text text-transparent" : "bg-[linear-gradient(110deg,#fff,#a7ceff_68%,#c9b8ff)] bg-clip-text text-transparent"}`}>
            DEVINSO
          </div>
          <div className={`mx-auto mt-5 h-px w-[44%] ${light ? "bg-[linear-gradient(90deg,transparent,#45668f40,transparent)]" : "bg-[linear-gradient(90deg,transparent,#a7ceff44,transparent)]"}`} />
          <div className={`mt-4 text-center text-[8px] uppercase tracking-[.34em] ${light ? "text-[#314a6e]/35" : "text-white/28"}`}>DESIGN × DEVELOPMENT × INTERACTION</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["GEOMETRY", "TYPE", "MOTION"].map((item, index) => (
            <div key={item} className={`border-t pt-3 ${light ? "border-[#314a6e]/10" : "border-white/[.06]"}`}>
              <div className={`font-mono text-[8px] ${light ? "text-[#314a6e]/25" : "text-white/20"}`}>0{index + 1}</div>
              <div className={`mt-1.5 text-[8px] tracking-[.18em] ${light ? "text-[#233b5f]/45" : "text-white/38"}`}>{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectPreview({ project, light }: { project: WorkProject; light: boolean }) {
  if (project.coverImage) {
    return (
      <div className={`absolute inset-[3.2%] overflow-hidden rounded-[22px] border ${light ? "border-[#294368]/10 bg-[#e8eef6]" : "border-white/[.075] bg-[#080a0f]"}`}>
        <img
          data-project-image
          src={project.coverImage}
          alt={project.coverAlt ?? project.title}
          className="h-full w-full scale-[1.08] object-cover object-center [will-change:transform,filter,opacity]"
          draggable={false}
        />
        <div className={`pointer-events-none absolute inset-0 ${light ? "bg-[linear-gradient(180deg,rgba(6,17,34,.08),transparent_30%,rgba(11,25,45,.18)_100%)]" : "bg-[linear-gradient(180deg,rgba(2,4,8,.14),transparent_32%,rgba(2,4,8,.34)_100%)]"}`} />
      </div>
    );
  }

  if (project.preview === "automation") return <AutomationPreview light={light} />;
  return <IdentityPreview light={light} />;
}

function SceneChrome({ project, light }: { project: WorkProject; light: boolean }) {
  const accent = ACCENTS[project.accent];
  return (
    <>
      <div data-project-ambient className="pointer-events-none absolute inset-[-8%] opacity-0" style={{ background: `radial-gradient(circle at 50% 50%, ${accent.glow} 0%, transparent 62%)` }} />
      <div data-shutter-left className={`pointer-events-none absolute left-[3.2%] top-[3.2%] z-[2] h-[93.6%] w-[46.8%] rounded-l-[22px] ${light ? "bg-[#f7f9fd]" : "bg-[#05070c]"}`} />
      <div data-shutter-right className={`pointer-events-none absolute right-[3.2%] top-[3.2%] z-[2] h-[93.6%] w-[46.8%] rounded-r-[22px] ${light ? "bg-[#f7f9fd]" : "bg-[#05070c]"}`} />
      <div data-depth-ghost className={`pointer-events-none absolute inset-[5.8%] rounded-[22px] border opacity-0 ${light ? "border-[#36537f]/10 bg-[#edf3fa]" : "border-white/[.06] bg-white/[.025]"}`}>
        <div className={`absolute inset-0 rounded-[22px] ${light ? "bg-[linear-gradient(135deg,rgba(33,74,132,.06),transparent_60%)]" : "bg-[linear-gradient(135deg,rgba(167,206,255,.08),transparent_58%)]"}`} />
      </div>
    </>
  );
}

function ProjectScene({ project, theme, language, index }: { project: WorkProject; theme: DevinsoTheme; language: DevinsoLanguage; index: number }) {
  const light = theme === "light";
  const rtl = language === "fa";
  const copy = COPY[language];
  const accent = ACCENTS[project.accent];
  const isStacked = project.layout === "stacked";
  const mediaFirst = project.layout === "media-left";

  return (
    <article
      data-project-scene
      data-morph-mode={project.morph}
      className={`group relative isolate mt-16 first:mt-0 rounded-[34px] border px-[clamp(18px,2vw,28px)] py-[clamp(18px,2vw,28px)] ${light ? "border-[#294368]/8 bg-white/[.52]" : "border-white/[.055] bg-white/[.018]"}`}
      style={{ boxShadow: `0 32px 120px ${accent.soft}` }}
    >
      <div className={`pointer-events-none absolute inset-0 rounded-[34px] ${light ? "bg-[linear-gradient(180deg,rgba(255,255,255,.55),rgba(244,248,252,.68))]" : "bg-[linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,.012))]"}`} />
      <div className="relative z-[1]">
        <div className={`mb-5 flex items-center justify-between gap-4 ${rtl ? "text-right" : "text-left"}`}>
          <div>
            <div data-project-detail className={`font-mono text-[10px] uppercase tracking-[.22em] ${light ? "text-[#294368]/35" : "text-white/26"}`}>
              {copy.project} / {project.number}
            </div>
            <div data-project-detail className={`mt-2 text-[clamp(28px,4vw,58px)] font-[560] leading-[.96] tracking-[-.06em] ${light ? "text-[#16253d]" : "text-white/[.94]"}`}>
              {language === "fa" ? project.titleFa : project.title}
            </div>
          </div>
          <div data-project-detail className={`hidden rounded-full border px-3 py-2 text-[9px] uppercase tracking-[.18em] md:flex ${light ? "border-[#294368]/10 bg-white/80 text-[#294368]/45" : "border-white/[.07] bg-white/[.025] text-white/35"}`}>
            {copy.morph} / {copy.mode[project.morph]}
          </div>
        </div>

        <div className={`grid gap-8 ${isStacked ? "grid-cols-1" : mediaFirst ? "lg:grid-cols-[1.22fr_.86fr]" : "lg:grid-cols-[.86fr_1.22fr]"} items-center`}>
          {!mediaFirst && !isStacked && (
            <div className={`${rtl ? "lg:order-2" : ""}`}>
              <SceneText project={project} theme={theme} language={language} />
            </div>
          )}

          <div className={`${isStacked ? "order-1" : mediaFirst ? "lg:order-1" : "lg:order-2"}`}>
            <div
              data-project-visual
              className={`relative aspect-[16/9] overflow-hidden rounded-[28px] border ${light ? "border-[#294368]/10 bg-[#f5f8fc]" : "border-white/[.08] bg-[#06080d]"}`}
            >
              <div className="absolute inset-0 opacity-70" style={{ background: accent.wash }} />
              <div className={`absolute inset-0 ${light ? "[background-image:linear-gradient(rgba(38,63,99,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(38,63,99,.05)_1px,transparent_1px)]" : "[background-image:linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]"} [background-size:36px_36px]`} />
              <SceneChrome project={project} light={light} />
              <div data-project-media className="absolute inset-0 [will-change:transform]">
                <ProjectPreview project={project} light={light} />
              </div>
              <div data-project-scan className="pointer-events-none absolute inset-x-[3.2%] top-[3.2%] h-[22%] rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0))] opacity-0 mix-blend-screen blur-[14px]" />
              <div data-project-asset className={`absolute bottom-5 ${rtl ? "right-5" : "left-5"} rounded-full border px-3 py-2 text-[8px] uppercase tracking-[.18em] ${light ? "border-[#294368]/10 bg-white/78 text-[#294368]/45" : "border-white/[.08] bg-black/28 text-white/40"}`}>
                {index === 0 ? copy.coverSpec : `ASSET / COVER_0${index + 1}`}
              </div>
              <div className={`absolute ${rtl ? "left-5" : "right-5"} top-5 rounded-full border px-3 py-2 text-[8px] uppercase tracking-[.18em] ${light ? "border-[#294368]/10 bg-white/74 text-[#294368]/45" : "border-white/[.08] bg-black/24 text-white/36"}`}>
                {copy.mode[project.morph]}
              </div>
            </div>
          </div>

          {(mediaFirst || isStacked) && (
            <div className={`${mediaFirst ? "lg:order-2" : "order-2"}`}>
              <SceneText project={project} theme={theme} language={language} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function SceneText({ project, theme, language }: { project: WorkProject; theme: DevinsoTheme; language: DevinsoLanguage }) {
  const light = theme === "light";
  const rtl = language === "fa";
  const copy = COPY[language];
  const accent = ACCENTS[project.accent];
  return (
    <div className={`space-y-5 ${rtl ? "text-right" : "text-left"}`}>
      <div data-project-detail className={`text-[13px] ${light ? "text-[#294368]/55" : "text-white/54"}`}>
        {language === "fa" ? project.categoryFa : project.category}
      </div>
      <p data-project-detail className={`max-w-[58ch] text-[14px] leading-7 ${light ? "text-[#213654]/68" : "text-white/58"}`}>
        {language === "fa" ? project.descriptionFa : project.description}
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <InfoBox label={copy.role} value={language === "fa" ? project.roleFa : project.role} theme={theme} accent={accent.strong} />
        <InfoBox label={copy.stack} value={project.stack.join(" / ")} theme={theme} accent={accent.strong} />
        <InfoBox label={copy.year} value={project.year} theme={theme} accent={accent.strong} />
      </div>
      <div data-project-detail className="flex flex-wrap items-center gap-3 pt-1">
        <a href="#" className={`inline-flex min-h-[46px] items-center gap-2 rounded-full border px-5 text-[11px] font-[650] uppercase tracking-[.16em] transition-transform duration-300 hover:-translate-y-0.5 ${light ? "border-[#294368]/12 bg-white text-[#17263d]" : "border-white/[.085] bg-white/[.03] text-white/88"}`}>
          {copy.viewCase}
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><path d="M2.2 9.8 9.6 2.4M4 2.4h5.6V8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <div className={`inline-flex items-center gap-2 text-[9px] uppercase tracking-[.18em] ${light ? "text-[#294368]/35" : "text-white/30"}`}>
          <i className="h-2 w-2 rounded-full" style={{ backgroundColor: accent.strong, boxShadow: `0 0 16px ${accent.strong}` }} />
          {copy.signal}
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, theme, accent }: { label: string; value: string; theme: DevinsoTheme; accent: string }) {
  const light = theme === "light";
  return (
    <div data-project-detail className={`rounded-2xl border p-4 ${light ? "border-[#294368]/10 bg-white/75" : "border-white/[.065] bg-white/[.02]"}`}>
      <div className={`text-[8px] uppercase tracking-[.18em] ${light ? "text-[#294368]/35" : "text-white/28"}`}>{label}</div>
      <div className={`mt-3 text-[13px] leading-6 ${light ? "text-[#17263d]" : "text-white/84"}`}>{value}</div>
      <div className="mt-4 h-px w-full" style={{ background: `linear-gradient(90deg, ${accent}33, transparent)` }} />
    </div>
  );
}

export function SelectedWork({ theme, language }: SelectedWorkProps) {
  const rootRef = useRef<HTMLElement>(null);
  const light = theme === "light";
  const rtl = language === "fa";
  const copy = COPY[language];

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const bridge = rootRef.current!.querySelector<HTMLElement>("[data-work-bridge]");
      const dock = rootRef.current!.querySelector<HTMLElement>("[data-work-dock]");
      const dockLabel = rootRef.current!.querySelector<HTMLElement>("[data-work-dock-label]");
      const dockTitle = rootRef.current!.querySelector<HTMLElement>("[data-work-dock-title]");
      const dockCopy = rootRef.current!.querySelector<HTMLElement>("[data-work-dock-copy]");
      const lineH = rootRef.current!.querySelector<HTMLElement>("[data-work-bridge-line-h]");
      const lineV = rootRef.current!.querySelector<HTMLElement>("[data-work-bridge-line-v]");
      const bridgeNode = rootRef.current!.querySelector<HTMLElement>("[data-work-bridge-node]");
      const bridgeMeta = rootRef.current!.querySelector<HTMLElement>("[data-work-bridge-meta]");
      const scenes = gsap.utils.toArray<HTMLElement>("[data-project-scene]");
      const firstScene = scenes[0];

      if (bridge && dock && dockTitle && firstScene) {
        gsap.set(dock, { y: -14 });
        gsap.set(dockLabel, { y: 8, opacity: 0 });
        gsap.set(dockTitle, {
          y: -34,
          scale: 1.34,
          transformOrigin: "left top",
          opacity: 0.88,
          filter: "blur(2px)",
        });
        gsap.set(dockCopy, { y: 14, opacity: 0, filter: "blur(5px)" });
        gsap.set(lineH, { scaleX: 0, transformOrigin: "left center", opacity: 0.4 });
        gsap.set(lineV, { scaleY: 0, transformOrigin: "top center", opacity: 0.4 });
        gsap.set(bridgeNode, { scale: 0, opacity: 0 });
        gsap.set(bridgeMeta, { x: -8, opacity: 0 });
        gsap.set(firstScene, { y: 58, scale: 0.988, opacity: 0.78 });

        const bridgeTimeline = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
        bridgeTimeline
          .to(dock, { y: 0, duration: 0.72, ease: "power3.out" }, 0)
          .to(dockTitle, {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.82,
            ease: "expo.out",
          }, 0)
          .to(dockLabel, { y: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, 0.16)
          .to(dockCopy, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }, 0.24)
          .to(lineH, { scaleX: 1, opacity: 1, duration: 0.78, ease: "power3.inOut" }, 0.18)
          .to(bridgeNode, { scale: 1, opacity: 1, duration: 0.26, ease: "back.out(2)" }, 0.62)
          .to(lineV, { scaleY: 1, opacity: 1, duration: 0.46, ease: "power2.inOut" }, 0.58)
          .to(bridgeMeta, { x: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, 0.56)
          .to(firstScene, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.82,
            ease: "power3.out",
          }, 0.48);

        const resetBridge = () => bridgeTimeline.pause(0);

        ScrollTrigger.create({
          trigger: bridge,
          start: "top 84%",
          end: "bottom 18%",
          onEnter: () => bridgeTimeline.restart(),
          onEnterBack: () => bridgeTimeline.restart(),
          onLeaveBack: resetBridge,
        });
      }

      scenes.forEach((scene, index) => {
        const mode = scene.dataset.morphMode as MorphMode;
        const visual = scene.querySelector<HTMLElement>("[data-project-visual]");
        const media = scene.querySelector<HTMLElement>("[data-project-media]");
        const image = scene.querySelector<HTMLElement>("[data-project-image]");
        const scan = scene.querySelector<HTMLElement>("[data-project-scan]");
        const asset = scene.querySelector<HTMLElement>("[data-project-asset]");
        const ambient = scene.querySelector<HTMLElement>("[data-project-ambient]");
        const details = scene.querySelectorAll<HTMLElement>("[data-project-detail]");
        const shutterLeft = scene.querySelector<HTMLElement>("[data-shutter-left]");
        const shutterRight = scene.querySelector<HTMLElement>("[data-shutter-right]");
        const depthGhost = scene.querySelector<HTMLElement>("[data-depth-ghost]");

        if (!visual) return;

        const clipStart = mode === "expand"
          ? "inset(100% 0% 0% 0% round 28px)"
          : mode === "split"
            ? "inset(0% 100% 0% 0% round 28px)"
            : "inset(18% 16% 18% 16% round 28px)";

        const detailOffset = mode === "split" ? 18 : mode === "depth" ? 36 : 28;

        const setInitialState = () => {
          gsap.set(visual, {
            clipPath: clipStart,
            scale: mode === "depth" ? 0.9 : 0.985,
            opacity: 1,
            filter: mode === "depth" ? "blur(6px)" : "blur(2px)",
            transformOrigin: "50% 50%",
          });
          if (media) gsap.set(media, { scale: mode === "depth" ? 1.04 : 1.06, xPercent: mode === "split" ? 1.5 : 0, yPercent: mode === "expand" ? 1.8 : mode === "depth" ? -1.6 : 0 });
          if (image) gsap.set(image, { scale: mode === "depth" ? 1.16 : 1.12, filter: mode === "expand" ? "blur(10px) brightness(.72)" : mode === "split" ? "blur(7px) brightness(.82)" : "blur(12px) brightness(.68)", opacity: mode === "depth" ? 0.46 : 0.58 });
          if (scan) gsap.set(scan, { yPercent: -150, opacity: 0 });
          if (asset) gsap.set(asset, { y: 12, opacity: 0, filter: "blur(5px)" });
          if (ambient) gsap.set(ambient, { opacity: 0, scale: mode === "depth" ? 0.82 : 0.72 });
          if (details.length) gsap.set(details, { y: detailOffset, opacity: 0, filter: "blur(7px)" });
          if (shutterLeft) gsap.set(shutterLeft, { xPercent: 0, opacity: mode === "split" ? 1 : 0 });
          if (shutterRight) gsap.set(shutterRight, { xPercent: 0, opacity: mode === "split" ? 1 : 0 });
          if (depthGhost) gsap.set(depthGhost, { opacity: mode === "depth" ? 0.38 : 0, scale: mode === "depth" ? 1.05 : 1, yPercent: mode === "depth" ? -3 : 0 });
        };

        const tl = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
        tl.to(visual, {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          scale: 1,
          filter: "blur(0px)",
          duration: mode === "expand" ? 0.9 : mode === "split" ? 0.75 : 0.88,
          ease: "expo.out",
        }, 0)
          .to(ambient, { opacity: 1, scale: 1, duration: 1.0, ease: "power3.out" }, 0.05)
          .to(media, { scale: 1, xPercent: 0, yPercent: 0, duration: 1.05, ease: "power3.out" }, 0.04)
          .to(image, {
            scale: mode === "depth" ? 1.02 : 1.04,
            filter: "blur(0px) brightness(1)",
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
          }, 0.1)
          .to(details, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.62, stagger: 0.055, ease: "power3.out" }, mode === "split" ? 0.16 : 0.22)
          .to(asset, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.48, ease: "power2.out" }, 0.4)
          .fromTo(scan, { yPercent: -150, opacity: 0 }, { yPercent: 150, opacity: 0.82, duration: 0.72, ease: "power2.inOut" }, 0.36)
          .to(scan, { opacity: 0, duration: 0.18 }, 0.98);

        if (mode === "split") {
          tl.to(shutterLeft, { xPercent: -102, duration: 0.78, ease: "power3.inOut" }, 0)
            .to(shutterRight, { xPercent: 102, duration: 0.78, ease: "power3.inOut" }, 0);
        }

        if (mode === "depth") {
          tl.to(depthGhost, { opacity: 0, scale: 0.92, yPercent: 6, duration: 0.95, ease: "power3.out" }, 0.04);
        }

        const reset = () => {
          tl.pause(0);
          setInitialState();
        };

        setInitialState();

        ScrollTrigger.create({
          trigger: scene,
          start: "top 74%",
          end: "bottom 12%",
          onEnter: () => tl.restart(),
          onEnterBack: () => tl.restart(),
          onLeave: reset,
          onLeaveBack: reset,
        });

        if (media) {
          gsap.fromTo(media, { yPercent: index % 2 === 0 ? -3.2 : 3.2 }, {
            yPercent: index % 2 === 0 ? 3.2 : -3.2,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          });
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, [theme, language]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const target = event.currentTarget;
    const cursor = target.querySelector<HTMLElement>("[data-work-cursor]");
    if (!cursor) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1)`;
    cursor.style.opacity = "1";
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    const cursor = event.currentTarget.querySelector<HTMLElement>("[data-work-cursor]");
    if (!cursor) return;
    cursor.style.opacity = "0";
    cursor.style.transform = "translate3d(50%, 50%, 0) translate(-50%, -50%) scale(.82)";
  };

  return (
    <section ref={rootRef} id="work" className="relative isolate overflow-hidden px-5 pb-20 pt-8 sm:px-6 lg:px-10">
      {/* Soft cross-fade at the Hero → Work seam. The Work atmosphere starts transparent
          and reaches full strength over ~160px, so the section boundary never reads as a hard line. */}
      <div
        className={`pointer-events-none absolute inset-0 ${light ? "bg-[radial-gradient(circle_at_30%_10%,rgba(111,144,255,.08),transparent_38%),radial-gradient(circle_at_70%_20%,rgba(255,94,94,.06),transparent_34%)]" : "bg-[radial-gradient(circle_at_30%_10%,rgba(114,229,238,.08),transparent_34%),radial-gradient(circle_at_78%_22%,rgba(255,84,111,.08),transparent_34%)]"}`}
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,.15) 36px, rgba(0,0,0,.58) 96px, #000 168px)",
          maskImage: "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,.15) 36px, rgba(0,0,0,.58) 96px, #000 168px)",
        }}
      />
      <div
        className={`pointer-events-none absolute inset-0 ${light ? "[background-image:linear-gradient(rgba(50,77,119,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(50,77,119,.05)_1px,transparent_1px)]" : "[background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)]"} [background-size:60px_60px] opacity-40`}
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,.08) 48px, rgba(0,0,0,.42) 112px, #000 190px)",
          maskImage: "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,.08) 48px, rgba(0,0,0,.42) 112px, #000 190px)",
        }}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[190px] ${
          light
            ? "bg-[linear-gradient(180deg,rgba(248,251,255,0),rgba(248,251,255,.018)_34%,rgba(239,245,252,.035)_68%,transparent)]"
            : "bg-[linear-gradient(180deg,rgba(3,5,9,0),rgba(9,13,21,.028)_34%,rgba(13,18,28,.045)_68%,transparent)]"
        }`}
      />

      <div className="mx-auto max-w-[1440px]">
        <div data-work-bridge className="relative pb-8 pt-[clamp(10px,2vw,24px)] sm:pb-10">
          <div className="grid items-end gap-5 lg:grid-cols-[minmax(300px,.78fr)_minmax(340px,1.22fr)] lg:gap-8">
            <div data-work-dock className={`${rtl ? "text-right" : "text-left"}`}>
              <div
                data-work-dock-label
                className={`font-mono text-[10px] uppercase tracking-[.22em] ${light ? "text-[#294368]/38" : "text-white/30"}`}
              >
                {copy.eyebrow}
              </div>
              <div
                data-work-dock-title
                className={`mt-3 inline-flex flex-wrap items-baseline gap-x-3 text-[clamp(34px,5.6vw,78px)] font-[560] leading-[.9] tracking-[-.075em] ${light ? "text-[#16253d]" : "text-white/[.94]"}`}
              >
                <span>{copy.titleA}</span>
                <span className={light ? "text-[#345783]/28" : "text-white/16"}>{copy.titleB}</span>
              </div>
              <p
                data-work-dock-copy
                className={`mt-4 max-w-[48ch] text-[12px] leading-6 ${light ? "text-[#223857]/52" : "text-white/42"}`}
              >
                {copy.intro}
              </p>
            </div>

            <div className="relative min-h-[74px] self-end pb-4 lg:pb-1">
              <div className="absolute left-0 right-0 top-[32px] flex items-start">
                <div
                  data-work-bridge-line-h
                  className={`h-px flex-1 ${light ? "bg-[linear-gradient(90deg,rgba(63,95,140,.34),rgba(63,95,140,.11))]" : "bg-[linear-gradient(90deg,rgba(160,202,255,.34),rgba(255,255,255,.07))]"}`}
                />
                <div className="relative h-[58px] w-[18px] shrink-0">
                  <i
                    data-work-bridge-node
                    className={`absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border ${light ? "border-[#55749e]/25 bg-[#f7faff] shadow-[0_0_0_5px_rgba(73,111,162,.05)]" : "border-[#a7ceff]/24 bg-[#0a0d14] shadow-[0_0_0_5px_rgba(167,206,255,.05)]"}`}
                  />
                  <i
                    data-work-bridge-line-v
                    className={`absolute left-1/2 top-0 h-[58px] w-px -translate-x-1/2 ${light ? "bg-[linear-gradient(180deg,rgba(63,95,140,.28),rgba(63,95,140,.06))]" : "bg-[linear-gradient(180deg,rgba(167,206,255,.28),rgba(255,255,255,.04))]"}`}
                  />
                </div>
              </div>
              <div
                data-work-bridge-meta
                className={`absolute right-0 top-0 font-mono text-[9px] uppercase tracking-[.19em] ${light ? "text-[#294368]/34" : "text-white/28"}`}
              >
                HANDOFF / PROJECT_01
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
          <div data-work-cursor className={`pointer-events-none fixed left-0 top-0 z-50 hidden min-h-[74px] min-w-[74px] -translate-x-1/2 -translate-y-1/2 scale-[.82] items-center justify-center rounded-full border px-4 text-center text-[9px] uppercase tracking-[.16em] opacity-0 transition-opacity duration-200 md:flex ${light ? "border-[#294368]/12 bg-white/92 text-[#17263d] shadow-[0_18px_40px_rgba(18,31,53,.12)]" : "border-white/[.12] bg-[#090d14]/92 text-white/82 shadow-[0_18px_50px_rgba(0,0,0,.35)]"}`}>
            {copy.viewCase}
          </div>
          {PROJECTS.map((project, index) => (
            <ProjectScene key={project.id} project={project} theme={theme} language={language} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

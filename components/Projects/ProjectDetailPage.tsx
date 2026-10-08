"use client";

import Image from "next/image";
import { FitTitle } from "@/components/Projects/FitTitle";
import { RichText } from "@/components/Projects/RichText";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Code,
  Globe,
  UserRound,
  UsersRound,
} from "lucide-react";
import { SubpageHeader } from "@/components/Brand/SubpageHeader";
import { MemberPhoto } from "@/components/Brand/MemberPhoto";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type {
  ProjectContentBlock,
  ProjectDetail,
  ProjectMemberRole,
  ProjectStatus,
  ProjectType,
} from "@/lib/project-details";
import {
  DEVINSO_COOKIE,
  setCookie,
  type DevinsoLanguage,
  type DevinsoTheme,
} from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger);

const COPY = {
  en: {
    page: "PROJECT DETAIL",
    back: "BACK TO WORK",
    about: "ABOUT THE PROJECT",
    fullDescription: "FULL PROJECT DESCRIPTION",
    contentEmpty: "PROJECT CONTENT WILL APPEAR HERE",
    videoPlaceholder: "VIDEO / MEDIA BLOCK",
    embedPlaceholder: "EMBED / INTERACTIVE BLOCK",
    techStack: "TECH STACK",
    links: "PROJECT LINKS",
    liveProject: "LIVE PROJECT",
    sourceCode: "GITHUB REPOSITORY",
    unavailable: "NOT PUBLISHED YET",
    team: "PROJECT MEMBERS",
    teamIntro: "People attached to this project and the role each member owns.",
    roles: {
      LEAD: "PROJECT LEAD",
      DEVELOPER: "DEVELOPER",
      DESIGNER: "DESIGNER",
      STRATEGY: "STRATEGY",
      CONTRIBUTOR: "CONTRIBUTOR",
    },
    createdBy: "CREATED BY",
    type: "PROJECT TYPE",
    status: "STATUS",
    createdAt: "CREATED",
    updatedAt: "LAST UPDATED",
    joinedAt: "JOINED",
    next: "NEXT PROJECT",
    viewNext: "OPEN PROJECT",
    personal: "PERSONAL",
    teamType: "TEAM",
    draft: "DRAFT",
    published: "PUBLISHED",
    archived: "ARCHIVED",
    sections: { about: "01 / ABOUT", content: "02 / CONTENT", stack: "03 / STACK", links: "04 / URLS", members: "05 / MEMBERS" },
    block: "BLOCK",
    blockKinds: { heading: "HEADING", text: "TEXT", image: "IMAGE", gallery: "GALLERY", quote: "QUOTE", embed: "EMBED" },
    items: "ITEMS",
    blocks: "BLOCKS",
    blockTypes: "TEXT / IMAGE / MEDIA",
    urlAvailable: "URL / AVAILABLE",
    urlNull: "URL / NULL",
    coverLoaded: "COVER / LOADED",
    coverGenerated: "COVER / GENERATED PREVIEW",
    project: "PROJECT",
    id: "ID",
    viewProfile: "VIEW PROFILE",
  },
  fa: {
    page: "جزئیات پروژه",
    back: "بازگشت به پروژه‌ها",
    about: "درباره پروژه",
    fullDescription: "توضیحات کامل پروژه",
    contentEmpty: "محتوای پروژه اینجا نمایش داده می‌شود",
    videoPlaceholder: "ویدئو / بلوک رسانه",
    embedPlaceholder: "امبد / بلوک تعاملی",
    techStack: "تکنولوژی‌ها",
    links: "لینک‌های پروژه",
    liveProject: "مشاهده پروژه",
    sourceCode: "مخزن گیت‌هاب",
    unavailable: "هنوز منتشر نشده",
    team: "اعضای پروژه",
    teamIntro: "افرادی که در این پروژه حضور دارند و مسئولیت هر عضو.",
    roles: {
      LEAD: "سرپرست پروژه",
      DEVELOPER: "توسعه‌دهنده",
      DESIGNER: "طراح",
      STRATEGY: "استراتژی",
      CONTRIBUTOR: "همکار",
    },
    createdBy: "ایجادکننده",
    type: "نوع پروژه",
    status: "وضعیت",
    createdAt: "تاریخ ایجاد",
    updatedAt: "آخرین بروزرسانی",
    joinedAt: "تاریخ عضویت",
    next: "پروژه بعدی",
    viewNext: "باز کردن پروژه",
    personal: "شخصی",
    teamType: "تیمی",
    draft: "پیش‌نویس",
    published: "منتشرشده",
    archived: "آرشیوشده",
    sections: { about: "01 / درباره", content: "02 / محتوا", stack: "03 / تکنولوژی", links: "04 / لینک‌ها", members: "05 / اعضا" },
    block: "بلوک",
    blockKinds: { heading: "تیتر", text: "متن", image: "تصویر", gallery: "گالری", quote: "نقل‌قول", embed: "امبد" },
    items: "مورد",
    blocks: "بلوک",
    blockTypes: "متن / تصویر / رسانه",
    urlAvailable: "لینک / فعال",
    urlNull: "لینک / ثبت نشده",
    coverLoaded: "کاور / بارگذاری‌شده",
    coverGenerated: "کاور / پیش‌نمایش تولیدی",
    project: "پروژه",
    id: "شناسه",
    viewProfile: "مشاهده پروفایل",
  },
} as const;

function formatDate(date: string, language: DevinsoLanguage) {
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(`${date}T00:00:00`));
}

function AutomationVisual({ accent }: { accent: string }) {
  return (
    <div lang="en" dir="ltr" className="absolute inset-[6%] overflow-hidden rounded-[20px] border border-white/10 bg-[#090b12] shadow-[0_34px_100px_rgba(0,0,0,.52)]">
      <div className="flex h-12 items-center justify-between border-b border-white/[.07] px-5">
        <div className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 16px ${accent}` }} /><span className="font-mono text-[8px] tracking-[.16em] text-white/38">AUTOMATION / LIVE</span></div>
        <div className="flex gap-1.5">{[0, 1, 2].map((dot) => <i key={dot} className="h-1.5 w-1.5 rounded-full bg-white/20" />)}</div>
      </div>
      <div className="grid h-[calc(100%_-_48px)] grid-cols-[20%_1fr]">
        <div className="border-r border-white/[.06] p-[12%]">
          <i className="block h-7 w-7 rounded-lg" style={{ background: `linear-gradient(135deg,${accent},${accent}55)` }} />
          <div className="mt-8 space-y-4">{[72, 52, 84, 64, 44].map((width) => <i key={width} className="block h-1 rounded-full bg-white/10" style={{ width: `${width}%` }} />)}</div>
        </div>
        <div className="relative p-[5%]">
          <div className="grid grid-cols-3 gap-3">{["12", "84", "06"].map((value, index) => <div key={value} className="rounded-xl border border-white/[.07] bg-white/[.025] p-[9%]"><span className="font-mono text-[7px] text-white/25">NODE / 0{index + 1}</span><b className="mt-3 block text-[clamp(18px,3vw,40px)] font-medium text-white/80">{value}</b></div>)}</div>
          <div className="absolute inset-x-[5%] bottom-[7%] top-[48%] overflow-hidden rounded-xl border border-white/[.07] bg-white/[.018]">
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="case-flow-line absolute left-[9%] top-1/2 h-px w-[82%]" style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
            {[17, 49, 81].map((left) => <i key={left} className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-white/30 bg-[#10131d]" style={{ left: `${left}%`, boxShadow: `0 0 18px ${accent}66` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentityVisual({ accent }: { accent: string }) {
  return (
    <div lang="en" dir="ltr" className="absolute inset-0 grid place-items-center overflow-hidden">
      <div className="case-orbit absolute aspect-square h-[72%] rounded-full border border-white/10"><i className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 24px ${accent}` }} /></div>
      <div className="absolute aspect-square h-[48%] rotate-45 border border-white/[.08]" />
      <span className="absolute left-[6%] top-[8%] font-mono text-[8px] tracking-[.18em] text-white/30">IDENTITY / RESPONSIVE GRID</span>
      <div className="relative flex items-end gap-[clamp(8px,1vw,16px)] text-[clamp(86px,18vw,240px)] font-[650] leading-none tracking-[-.14em] text-white/[.92]"><span>D</span><span className="text-white/12">/</span><span style={{ color: accent }}>S</span></div>
      <div className="absolute bottom-[8%] left-[6%] right-[6%] flex justify-between border-t border-white/10 pt-4 font-mono text-[7px] tracking-[.18em] text-white/30"><span>FORM / MOTION</span><span>STATE / 03</span></div>
    </div>
  );
}

function ProjectCover({ project, language }: { project: ProjectDetail; language: DevinsoLanguage }) {
  if (project.coverImage) {
    const alt = language === "fa"
      ? project.coverAltFa ?? project.coverAlt ?? project.titleFa
      : project.coverAlt ?? project.title;
    // Mobile: render at the image's natural ratio so nothing is cropped. md+: fill the framed cover box.
    return <><Image src={project.coverImage} alt={alt} width={0} height={0} priority sizes="100vw" className="block h-auto w-full md:absolute md:inset-0 md:h-full md:object-cover" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(2,3,7,.38))]" /></>;
  }
  if (project.preview === "automation") return <AutomationVisual accent={project.accent} />;
  return <IdentityVisual accent={project.accent} />;
}

function statusLabel(status: ProjectStatus, language: DevinsoLanguage) {
  const copy = COPY[language];
  return status === "DRAFT" ? copy.draft : status === "ARCHIVED" ? copy.archived : copy.published;
}

function typeLabel(type: ProjectType, language: DevinsoLanguage) {
  return type === "TEAM" ? COPY[language].teamType : COPY[language].personal;
}

function MetaItem({ label, value, icon, light }: { label: string; value: string; icon: ReactNode; light: boolean }) {
  return (
    <div className={`project-interactive-card rounded-2xl border p-4 ${light ? "border-[#294368]/10 bg-white/55" : "border-white/[.07] bg-white/[.02]"}`}>
      <div className="flex items-center gap-2">{icon}<dt className={`font-mono text-[7px] uppercase tracking-[.18em] ${light ? "text-[#294368]/38" : "text-white/28"}`}>{label}</dt></div>
      <dd className={`mt-3 text-[12px] leading-6 ${light ? "text-[#17263d]/80" : "text-white/72"}`}>{value}</dd>
    </div>
  );
}

function MemberRoleBadge({ roleType, label, accent, light }: { roleType: ProjectMemberRole; label: string; accent: string; light: boolean }) {
  const lead = roleType === "LEAD";
  const style: CSSProperties | undefined = lead
    ? { borderColor: `${accent}66`, backgroundColor: `${accent}1f`, color: accent }
    : undefined;
  const fallback = light ? "border-[#294368]/14 bg-[#294368]/[.045] text-[#294368]/60" : "border-white/[.10] bg-white/[.04] text-white/50";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[7px] uppercase tracking-[.18em] ${lead ? "" : fallback}`}
      style={style}
    >
      <i className="h-1 w-1 rounded-full" style={{ backgroundColor: lead ? accent : "currentColor" }} />
      {label}
    </span>
  );
}

function ProjectLinkCard({ href, label, unavailable, icon, accent, light, availableTag, nullTag }: { href: string | null; label: string; unavailable: string; icon: ReactNode; accent: string; light: boolean; availableTag: string; nullTag: string }) {
  const className = `project-interactive-card group relative flex min-h-[148px] items-end justify-between overflow-hidden rounded-[22px] border p-5 ${light ? "border-[#294368]/10 bg-white/55" : "border-white/[.07] bg-white/[.018]"}`;
  const content = <><div className="absolute end-5 top-5 opacity-55">{icon}</div><div><span className={`font-mono text-[7px] uppercase tracking-[.18em] ${light ? "text-[#294368]/36" : "text-white/28"}`}>{href ? availableTag : nullTag}</span><strong className={`mt-3 block text-[14px] font-medium ${href ? "" : light ? "text-[#17263d]/38" : "text-white/34"}`}>{href ? label : unavailable}</strong></div>{href && <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={1.4} />}<i className="absolute bottom-0 start-0 h-[2px] w-1/3 transition-[width] duration-500 group-hover:w-full" style={{ backgroundColor: accent }} /></>;
  return href ? <a href={href} target="_blank" rel="noreferrer" className={className}>{content}</a> : <div className={className}>{content}</div>;
}

function SectionAtmosphere({ accent, light, variant }: { accent: string; light: boolean; variant: "about" | "content" | "stack" | "links" | "members" }) {
  const faint = light ? "18" : "28";
  const strong = light ? "42" : "72";

  if (variant === "about") {
    return <>
      <div className={`case-section-sweep case-section-sweep-${variant} pointer-events-none absolute -right-[8%] top-[-30%] h-[160%] w-[48%] rotate-[15deg] opacity-80`} style={{ background: `linear-gradient(135deg, transparent 0%, ${accent}${faint} 48%, transparent 70%)`, clipPath: "polygon(24% 0,100% 0,76% 100%,0 100%)" }} />
      <div className="case-shape-line pointer-events-none absolute left-[12%] top-[18%] h-px w-[34%] rotate-[-14deg]" style={{ background: `linear-gradient(90deg, transparent, ${accent}${strong}, transparent)` }} />
    </>;
  }

  if (variant === "content") {
    return <>
      <div className={`case-section-sweep case-section-sweep-${variant} pointer-events-none absolute -left-[14%] top-[8%] h-[76%] w-[58%] -rotate-[9deg] opacity-70`} style={{ background: `linear-gradient(90deg, transparent, ${accent}${faint}, transparent 76%)`, clipPath: "polygon(0 18%,100% 0,78% 82%,0 100%)" }} />
      <div className="case-shape-frame pointer-events-none absolute right-[12%] top-[22%] h-32 w-32 border-b border-r rotate-[-18deg]" style={{ borderColor: `${accent}${strong}` }} />
    </>;
  }

  if (variant === "stack") {
    return <>
      <div className={`case-section-sweep case-section-sweep-${variant} pointer-events-none absolute right-[8%] top-[-18%] h-[138%] w-[28%] rotate-[24deg] opacity-75`} style={{ background: `linear-gradient(180deg, transparent, ${accent}${faint}, transparent)`, clipPath: "polygon(34% 0,100% 0,66% 100%,0 100%)" }} />
      <div className="case-shape-block pointer-events-none absolute bottom-[16%] left-[12%] h-20 w-20 border" style={{ borderColor: `${accent}${strong}` }} />
    </>;
  }

  if (variant === "links") {
    return <>
      <div className={`case-section-sweep case-section-sweep-${variant} pointer-events-none absolute left-[18%] top-[-36%] h-[170%] w-[22%] rotate-[48deg] opacity-65`} style={{ background: `linear-gradient(180deg, transparent, ${accent}${faint}, transparent)`, clipPath: "polygon(44% 0,100% 0,56% 100%,0 100%)" }} />
      <div className="case-shape-ring pointer-events-none absolute bottom-[18%] right-[12%] h-28 w-28 rounded-full border" style={{ borderColor: `${accent}${strong}` }} />
    </>;
  }

  return <>
    <div className={`case-section-sweep case-section-sweep-${variant} pointer-events-none absolute -right-[10%] top-[5%] h-[120%] w-[44%] -rotate-[28deg] opacity-65`} style={{ background: `linear-gradient(135deg, transparent, ${accent}${faint}, transparent 72%)`, clipPath: "polygon(28% 0,100% 14%,72% 100%,0 86%)" }} />
    <div className="case-shape-frame pointer-events-none absolute left-[10%] bottom-[20%] h-24 w-24 rotate-45 border" style={{ borderColor: `${accent}${strong}` }} />
  </>;
}

function ProjectContent({ blocks, language, light, accent }: { blocks: ProjectContentBlock[]; language: DevinsoLanguage; light: boolean; accent: string }) {
  const copy = COPY[language];
  const rtl = language === "fa";
  const text = (en: string, fa: string) => language === "fa" ? fa : en;
  const tag = (number: string, kind: keyof typeof copy.blockKinds) => `${copy.block} / ${number} / ${copy.blockKinds[kind]}`;

  if (!blocks.length) {
    return <div className={`rounded-[22px] border border-dashed p-8 text-center font-mono text-[9px] uppercase tracking-[.16em] ${light ? "border-[#294368]/20 text-[#294368]/40" : "border-white/[.12] text-white/30"}`}>{copy.contentEmpty}</div>;
  }

  return <div className="space-y-8">
    {blocks.map((block, index) => {
      const blockNumber = String(index + 1).padStart(2, "0");
      if (block.type === "heading") {
        return <div key={`${block.type}-${index}`} data-project-item className={`border-t pt-5 ${light ? "border-[#294368]/12" : "border-white/[.09]"} text-start`}><span className={`font-mono text-[7px] uppercase tracking-[.18em] ${light ? "text-[#294368]/35" : "text-white/27"}`}>{tag(blockNumber, "heading")}</span><h3 className={`mt-5 max-w-[18ch] text-[clamp(25px,3.8vw,48px)] font-[560] ${rtl ? "leading-[1.3]" : "leading-[.95] tracking-[-.03em]"}`}>{text(block.text, block.textFa)}</h3></div>;
      }
      if (block.type === "paragraph") {
        return <div key={`${block.type}-${index}`} data-project-item className={`border-s ps-5 text-start ${light ? "border-[#294368]/12" : "border-white/[.09]"}`}><span className={`mb-3 block font-mono text-[7px] uppercase tracking-[.18em] ${light ? "text-[#294368]/30" : "text-white/24"}`}>{tag(blockNumber, "text")}</span><RichText html={text(block.text, block.textFa)} className={`max-w-[68ch] text-[clamp(14px,1.35vw,18px)] leading-[1.95] ${light ? "text-[#243b59]/64" : "text-white/55"}`} /></div>;
      }
      if (block.type === "image") {
        return <figure key={`${block.type}-${index}`} data-project-item className={`mx-auto w-full max-w-[920px] overflow-hidden rounded-[24px] border ${light ? "border-[#294368]/10 bg-white/45" : "border-white/[.07] bg-white/[.018]"}`}><div className="relative aspect-[16/9] overflow-hidden"><Image src={block.src} alt={language === "fa" ? block.altFa : block.alt} fill sizes="(max-width: 900px) 100vw, 900px" className="object-cover transition-transform duration-700 hover:scale-[1.02]" /></div><figcaption className={`flex items-center justify-between gap-4 border-t px-5 py-3 font-mono text-[8px] uppercase tracking-[.14em] ${light ? "border-[#294368]/10 text-[#294368]/42" : "border-white/[.07] text-white/30"} text-start`}><span>{text(block.caption ?? `IMAGE / ${blockNumber}`, block.captionFa ?? block.caption ?? `تصویر / ${blockNumber}`)}</span><span className="shrink-0 opacity-60">{copy.blockKinds.image} / {blockNumber}</span></figcaption></figure>;
      }
      if (block.type === "gallery") {
        return <div key={`${block.type}-${index}`} data-project-item className={`grid gap-4 ${block.images.length > 1 ? "sm:grid-cols-2" : ""}`}><div className={`sm:col-span-full border-b pb-3 font-mono text-[7px] uppercase tracking-[.18em] ${light ? "border-[#294368]/10 text-[#294368]/35" : "border-white/[.08] text-white/26"} text-start`}>{tag(blockNumber, "gallery")} / {String(block.images.length).padStart(2, "0")} {copy.items}</div>{block.images.map((image, imageIndex) => <figure key={`${image.src}-${imageIndex}`} className={`overflow-hidden rounded-[20px] border ${light ? "border-[#294368]/10 bg-white/45" : "border-white/[.07] bg-white/[.018]"}`}><div className="relative aspect-[4/3] overflow-hidden"><Image src={image.src} alt={language === "fa" ? image.altFa : image.alt} fill sizes="(max-width: 900px) 100vw, 600px" className="object-cover transition-transform duration-700 hover:scale-[1.02]" /></div>{(image.caption || image.captionFa) && <figcaption className={`border-t px-4 py-3 font-mono text-[8px] uppercase tracking-[.14em] ${light ? "border-[#294368]/10 text-[#294368]/42" : "border-white/[.07] text-white/30"} text-start`}>{text(image.caption ?? "", image.captionFa ?? image.caption ?? "")}</figcaption>}</figure>)}</div>;
      }
      if (block.type === "quote") {
        return <blockquote key={`${block.type}-${index}`} data-project-item className={`relative overflow-hidden rounded-[22px] border p-[clamp(24px,4vw,42px)] ${light ? "border-[#294368]/10 bg-white/52" : "border-white/[.07] bg-white/[.018]"} text-start`}><i className="absolute start-0 top-0 h-full w-1" style={{ backgroundColor: accent }} /><span className={`mb-6 block font-mono text-[7px] uppercase tracking-[.18em] ${light ? "text-[#294368]/32" : "text-white/25"}`}>{tag(blockNumber, "quote")}</span><p className={`max-w-[48ch] text-[clamp(20px,2.7vw,34px)] font-[520] ${rtl ? "leading-[1.6]" : "leading-[1.12] tracking-[-.035em]"}`}>{rtl ? `«${block.textFa}»` : `“${block.text}”`}</p>{(block.byline || block.bylineFa) && <cite className={`mt-6 block font-mono text-[8px] uppercase tracking-[.17em] not-italic ${light ? "text-[#294368]/40" : "text-white/30"}`}>{text(block.byline ?? "", block.bylineFa ?? block.byline ?? "")}</cite>}</blockquote>;
      }
      if (block.type === "video") {
        return block.src ? <figure key={`${block.type}-${index}`} data-project-item className={`overflow-hidden rounded-[24px] border ${light ? "border-[#294368]/10 bg-white/45" : "border-white/[.07] bg-white/[.018]"}`}><video src={block.src} poster={block.poster} controls className="aspect-video w-full object-cover" />{(block.caption || block.captionFa) && <figcaption className={`border-t px-5 py-3 font-mono text-[8px] uppercase tracking-[.14em] ${light ? "border-[#294368]/10 text-[#294368]/42" : "border-white/[.07] text-white/30"}`}>{text(block.caption ?? "", block.captionFa ?? block.caption ?? "")}</figcaption>}</figure> : <div key={`${block.type}-${index}`} data-project-item className={`flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed p-8 text-center ${light ? "border-[#294368]/20 text-[#294368]/40" : "border-white/[.12] text-white/30"}`}><span className="font-mono text-[9px] uppercase tracking-[.16em]">{copy.videoPlaceholder}</span><span className={`mt-3 max-w-[30ch] text-[11px] leading-6 ${light ? "text-[#294368]/50" : "text-white/38"}`}>{copy.contentEmpty}</span></div>;
      }
      return block.url ? <a key={`${block.type}-${index}`} data-project-item href={block.url} target="_blank" rel="noreferrer" className={`group flex min-h-[110px] items-center justify-between rounded-[22px] border px-5 transition-transform hover:-translate-y-1 ${light ? "border-[#294368]/10 bg-white/52" : "border-white/[.07] bg-white/[.018]"}`}><div><span className={`block font-mono text-[7px] uppercase tracking-[.18em] ${light ? "text-[#294368]/35" : "text-white/27"}`}>{tag(blockNumber, "embed")}</span><span className="mt-3 block text-[13px] font-medium">{text(block.label, block.labelFa)}</span></div><ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={1.4} /></a> : <div key={`${block.type}-${index}`} data-project-item className={`flex min-h-[110px] flex-col items-center justify-center rounded-[22px] border border-dashed p-6 text-center ${light ? "border-[#294368]/20 text-[#294368]/40" : "border-white/[.12] text-white/30"}`}><span className="font-mono text-[9px] uppercase tracking-[.16em]">{copy.embedPlaceholder}</span><span className={`mt-3 text-[11px] ${light ? "text-[#294368]/50" : "text-white/38"}`}>{copy.contentEmpty}</span></div>;
    })}
  </div>;
}

type ProjectDetailPageProps = {
  project: ProjectDetail;
  nextProject: ProjectDetail;
  initialTheme: DevinsoTheme;
  initialLanguage: DevinsoLanguage;
};

export function ProjectDetailPage({ project, nextProject, initialTheme, initialLanguage }: ProjectDetailPageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<DevinsoTheme>(initialTheme);
  const [language, setLanguage] = useState<DevinsoLanguage>(initialLanguage);
  const copy = COPY[language];
  const light = theme === "light";
  // Bright accents wash out on the light theme, so text there uses the deeper tone.
  const accent = light ? project.accentDeep ?? project.accent : project.accent;
  const nextAccent = light ? nextProject.accentDeep ?? nextProject.accent : nextProject.accent;
  const rtl = language === "fa";

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.dataset.language = language;
  }, [language, theme, rtl]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const introItems = rootRef.current.querySelectorAll<HTMLElement>("[data-project-intro]");
    // An ancestor with opacity < 1 forms a backdrop root, which blanks out the
    // backdrop-filter on any glass card inside it until the tween lands. So fade
    // the cards themselves rather than their wrapper, and keep the original
    // rhythm by staggering on the wrapper index instead of the element index.
    const revealTargets = (scope: ParentNode, selector: string) => {
      const targets: HTMLElement[] = [];
      const groupOf = new Map<HTMLElement, number>();
      Array.from(scope.querySelectorAll<HTMLElement>(selector)).forEach((item, groupIndex) => {
        const cards = Array.from(item.querySelectorAll<HTMLElement>(".project-interactive-card"));
        (cards.length ? cards : [item]).forEach((node) => {
          targets.push(node);
          groupOf.set(node, groupIndex);
        });
      });
      return { targets, groupOf };
    };
    const revealItems = revealTargets(rootRef.current, "[data-project-reveal] [data-project-item]").targets;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(rootRef.current.querySelectorAll("[data-project-intro], [data-project-reveal], [data-project-item], .project-interactive-card"), { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.set(introItems, { autoAlpha: 0, y: 18 });
    gsap.set(revealItems, { autoAlpha: 0, y: 34 });
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-project-intro]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .9, stagger: .08, immediateRender: false, ease: "power2.out" });
      gsap.utils.toArray<HTMLElement>("[data-project-reveal]").forEach((element) => {
        const { targets: items, groupOf } = revealTargets(element, "[data-project-item]");
        if (!items.length) return;
        const reveal = gsap.fromTo(items, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1.15, stagger: (_index, target: HTMLElement) => (groupOf.get(target) ?? 0) * 0.18, paused: true, immediateRender: false, ease: "power3.out" });
        ScrollTrigger.create({
          trigger: element,
          start: "top 82%",
          end: "bottom 22%",
          toggleActions: "play reverse play reverse",
          animation: reveal,
          invalidateOnRefresh: true,
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [language]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setCookie(DEVINSO_COOKIE.theme, nextTheme);
  };
  const changeLanguage = (nextLanguage: DevinsoLanguage) => {
    setLanguage(nextLanguage);
    setCookie(DEVINSO_COOKIE.language, nextLanguage);
  };

  const pick = (en: string, fa: string | null | undefined) => (rtl && fa ? fa : en);
  const title = pick(project.title, project.titleFa);
  const createdBy = pick(project.createdBy.fullName, project.createdBy.fullNameFa);
  // API projects carry no numeric id (it maps to 0); a "0" label is noise.
  const projectNumber = project.id > 0 ? String(project.id).padStart(2, "0") : null;
  const sectionLabel = `font-mono text-[8px] uppercase tracking-[.2em] ${light ? "text-[#294368]/40" : "text-white/30"}`;
  // Persian headings: the Latin display leading (.95) and negative tracking
  // clip and crowd the script.
  const display = rtl ? "leading-[1.25]" : "leading-[.95] tracking-[-.03em]";

  // The server sets the tab title from the cookie; keep it in step with the
  // in-page language switch, which does not reload.
  useEffect(() => {
    document.title = `${title} · Devinso`;
  }, [title]);

  return (
    <main
      ref={rootRef}
      lang={language}
      dir={rtl ? "rtl" : "ltr"}
      data-locale={language}
      // overflow-clip, not overflow-hidden: hidden makes <main> a scroll
      // container and the sticky header stops sticking to the viewport.
      className={`relative min-h-screen overflow-clip transition-colors duration-500 ${light ? "bg-[#f4efe7] text-[#1c1a1b]" : "bg-[#101114] text-[#f1ede7]"}`} style={{ "--project-accent": accent } as CSSProperties}>
      <div aria-hidden className={`project-backdrop-grid pointer-events-none fixed inset-0 z-0 ${light ? "opacity-[.52] [background-image:linear-gradient(rgba(74,61,53,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(74,61,53,.055)_1px,transparent_1px)]" : "opacity-[.62] [background-image:linear-gradient(rgba(255,255,255,.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.028)_1px,transparent_1px)]"} [background-size:48px_48px]`} />
      <div className="pointer-events-none absolute -end-[20vw] top-[-18vw] h-[58vw] w-[58vw] rounded-full blur-3xl" style={{ backgroundColor: project.accentSoft }} />

      <SubpageHeader
        theme={theme}
        language={language}
        onLanguageChange={changeLanguage}
        onToggleTheme={toggleTheme}
        context={projectNumber ? `${copy.page} / ${projectNumber}` : copy.page}
        backHref="/#work"
        backLabel={copy.back}
      />

      <article className="relative z-10">
        <section className="mx-auto grid w-[min(1440px,calc(100%_-_clamp(28px,6vw,96px)))] gap-12 pb-[clamp(48px,7vw,96px)] pt-[clamp(68px,9vw,130px)] lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div className="min-w-0 text-start">
            <div data-project-intro className="flex items-center gap-3"><span className="rounded-full border px-3 py-2 font-mono text-[7px] tracking-[.16em]" style={{ borderColor: `${accent}55`, color: accent }}>{statusLabel(project.status, language)}</span><span className={`font-mono text-[8px] uppercase tracking-[.18em] ${light ? "text-[#294368]/40" : "text-white/30"}`}>{typeLabel(project.type, language)}{projectNumber ? ` / ${copy.id} ${projectNumber}` : ""}</span></div>
            <FitTitle data-project-intro text={title} min={34} max={122} maxLines={3} leading={rtl ? 1.2 : 0.86} className={`mt-7 font-[570] ${rtl ? "" : "tracking-[-.03em]"}`} />
          </div>
          <div data-project-intro className="text-start">
            <p className={`max-w-[58ch] ${rtl ? "text-[15px] leading-[2.1]" : "text-[14px] leading-8"} ${light ? "text-[#243b59]/62" : "text-white/52"}`}>{language === "fa" ? project.descriptionFa : project.description}</p>
            <div className={`mt-8 flex items-center justify-between border-t pt-4 font-mono text-[7px] uppercase tracking-[.16em] ${light ? "border-[#294368]/10 text-[#294368]/38" : "border-white/[.08] text-white/28"}`}><span>{copy.createdBy} / {createdBy}</span><span>{project.techStack.length} / {copy.techStack}</span></div>
          </div>
        </section>

        <section data-project-intro className="mx-auto w-[min(1560px,calc(100%_-_clamp(20px,4vw,64px)))]">
          <div className={`relative aspect-[16/8.1] overflow-hidden rounded-[clamp(20px,3vw,40px)] border md:min-h-[360px] ${project.coverImage ? "max-md:aspect-auto" : "min-h-[360px] max-md:aspect-[4/3]"} ${light ? "border-[#294368]/10 bg-[#dfe7f0] shadow-[0_40px_110px_rgba(34,50,76,.13)]" : "border-white/[.08] bg-[#080a0f] shadow-[0_44px_130px_rgba(0,0,0,.48)]"}`}>
            <ProjectCover project={project} language={language} />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[7px] tracking-[.16em] text-white/38"><span>{projectNumber ? `${copy.project} / ${projectNumber}` : copy.project}</span><span>{project.coverImage ? copy.coverLoaded : copy.coverGenerated}</span></div>
          </div>
        </section>

        <section data-project-reveal className={`relative overflow-hidden border-y ${light ? "border-[#4a3d35]/16 bg-[#fff9ef]/92" : "border-white/[.09] bg-[#19181a]/96"}`}>
          <SectionAtmosphere accent={accent} light={light} variant="about" />
          <div className="relative z-10 mx-auto grid w-[min(1240px,calc(100%_-_clamp(28px,8vw,128px)))] gap-10 py-[clamp(90px,12vw,170px)] lg:grid-cols-[.34fr_1fr]">
          <div data-project-item><span className={sectionLabel}>{copy.sections.about}</span></div>
          <div className="text-start">
            <h2 data-project-item className={`text-[clamp(32px,5vw,68px)] font-[560] ${display}`}>{copy.about}</h2>
            <p data-project-item className={`mt-8 max-w-[65ch] text-[clamp(15px,1.5vw,19px)] leading-[1.9] ${light ? "text-[#243b59]/64" : "text-white/55"}`}>{language === "fa" ? project.descriptionFa : project.description}</p>
            <dl data-project-item className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetaItem label={copy.createdBy} value={createdBy} icon={<UserRound className="h-3.5 w-3.5" strokeWidth={1.5} />} light={light} />
              <MetaItem label={copy.type} value={typeLabel(project.type, language)} icon={project.type === "TEAM" ? <UsersRound className="h-3.5 w-3.5" strokeWidth={1.5} /> : <UserRound className="h-3.5 w-3.5" strokeWidth={1.5} />} light={light} />
              <MetaItem label={copy.createdAt} value={formatDate(project.createdAt, language)} icon={<CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />} light={light} />
              <MetaItem label={copy.updatedAt} value={formatDate(project.updatedAt, language)} icon={<CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />} light={light} />
            </dl>
          </div>
          </div>
        </section>

        <section data-project-reveal className={`relative overflow-hidden border-b ${light ? "border-[#4a3d35]/14 bg-[#eee8df]/86" : "border-white/[.07] bg-[#121315]/96"}`}>
          <SectionAtmosphere accent={accent} light={light} variant="content" />
          <div className="relative z-10 mx-auto grid w-[min(1240px,calc(100%_-_clamp(28px,8vw,128px)))] gap-10 py-[clamp(90px,12vw,170px)] lg:grid-cols-[.34fr_1fr]">
          <aside data-project-item className="self-start lg:sticky lg:top-[112px]"><span className={`font-mono text-[8px] uppercase tracking-[.2em] ${light ? "text-[#294368]/40" : "text-white/30"}`}>{copy.sections.content}</span><div className={`mt-5 rounded-[18px] border p-4 ${light ? "border-[#294368]/10 bg-white/50" : "border-white/[.07] bg-white/[.018]"}`}><div className="flex items-end justify-between gap-3"><strong className="text-3xl font-[560] tracking-[-.03em]">{String(project.content.length).padStart(2, "0")}</strong><span className={`font-mono text-[7px] uppercase tracking-[.15em] ${light ? "text-[#294368]/38" : "text-white/28"}`}>{copy.blocks}</span></div><div className={`mt-4 h-px ${light ? "bg-[#294368]/10" : "bg-white/[.08]"}`} /><div className={`mt-3 font-mono text-[7px] uppercase leading-6 tracking-[.12em] ${light ? "text-[#294368]/40" : "text-white/28"}`}>{copy.blockTypes}</div></div></aside>
          <div className="text-start">
            <h2 data-project-item className={`text-[clamp(32px,5vw,68px)] font-[560] ${display}`}>{copy.fullDescription}</h2>
            <div className="mt-9"><ProjectContent blocks={project.content} language={language} light={light} accent={accent} /></div>
          </div>
          </div>
        </section>

        <section data-project-reveal className={`relative overflow-hidden border-y ${light ? "border-[#4a3d35]/14 bg-[#e3dbd1]/66" : "border-white/[.08] bg-[#202125]/96"}`}>
          <SectionAtmosphere accent={accent} light={light} variant="stack" />
          <div className="relative z-10 mx-auto grid w-[min(1240px,calc(100%_-_clamp(28px,8vw,128px)))] gap-12 py-[clamp(72px,9vw,126px)] lg:grid-cols-[.72fr_1.28fr]">
            <div data-project-item className="text-start"><span className={sectionLabel}>{copy.sections.stack}</span><h2 className={`mt-5 text-[clamp(34px,5vw,62px)] font-[560] ${display}`}>{copy.techStack}</h2></div>
            <div data-project-item className="grid content-start gap-3 sm:grid-cols-2">{project.techStack.map((technology, index) => <div key={technology} className={`project-interactive-card flex min-h-[82px] items-center justify-between rounded-2xl border px-5 ${light ? "border-[#294368]/10 bg-white/55" : "border-white/[.07] bg-white/[.02]"}`}><span lang="en" className="text-[13px] font-medium">{technology}</span><span className="font-mono text-[8px]" style={{ color: accent }}>0{index + 1}</span></div>)}</div>
          </div>
        </section>

        <section data-project-reveal className={`relative overflow-hidden border-y ${light ? "border-[#4a3d35]/14 bg-[#f9f3eb]/92" : "border-white/[.08] bg-[#1a191c]/96"}`}>
          <SectionAtmosphere accent={accent} light={light} variant="links" />
          <div className="relative z-10 mx-auto w-[min(1240px,calc(100%_-_clamp(28px,8vw,128px)))] py-[clamp(90px,11vw,150px)]">
            <div data-project-item className="text-start"><span className={sectionLabel}>{copy.sections.links}</span><h2 className={`mt-5 text-[clamp(34px,5vw,62px)] font-[560] ${display}`}>{copy.links}</h2></div>
            <div data-project-item className="mt-8 grid gap-4 md:grid-cols-2"><ProjectLinkCard href={project.projectUrl} label={copy.liveProject} unavailable={copy.unavailable} availableTag={copy.urlAvailable} nullTag={copy.urlNull} icon={<Globe className="h-5 w-5" strokeWidth={1.3} />} accent={accent} light={light} /><ProjectLinkCard href={project.githubUrl} label={copy.sourceCode} unavailable={copy.unavailable} availableTag={copy.urlAvailable} nullTag={copy.urlNull} icon={<Code className="h-5 w-5" strokeWidth={1.3} />} accent={accent} light={light} /></div>
          </div>
        </section>

        <section data-project-reveal className={`relative overflow-hidden border-y ${light ? "border-[#4a3d35]/14 bg-[#dfd7ce]/64" : "border-white/[.08] bg-[#111214]/96"}`}>
          <SectionAtmosphere accent={accent} light={light} variant="members" />
          <div className="relative z-10 mx-auto w-[min(1240px,calc(100%_-_clamp(28px,8vw,128px)))] py-[clamp(80px,10vw,140px)]">
            <div data-project-item className={`flex flex-col justify-between gap-5 border-b pb-7 md:flex-row md:items-end ${light ? "border-[#294368]/10" : "border-white/[.08]"} text-start`}><div><span className={sectionLabel}>{copy.sections.members}</span><h2 className={`mt-5 text-[clamp(34px,5vw,62px)] font-[560] ${display}`}>{copy.team}</h2></div><p className={`max-w-[44ch] text-[13px] leading-7 ${light ? "text-[#243b59]/55" : "text-white/45"}`}>{copy.teamIntro}</p></div>
            <div data-project-item className="mt-7 grid gap-4 md:grid-cols-2">{project.members.map((member) => {
              const name = pick(member.fullName, member.fullNameFa);
              const role = pick(member.role, member.roleFa);
              const description = member.description ? pick(member.description, member.descriptionFa) : null;
              const initials = member.fullName.split(" ").filter(Boolean).map((part) => part[0].toUpperCase()).join("").slice(0, 2);
              const card = <><div className="flex items-start gap-4"><div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border font-mono text-[12px]" style={{ borderColor: `${accent}55`, backgroundColor: `${accent}18`, color: accent }}><span lang="en">{initials}</span><MemberPhoto src={member.avatar} alt={name} size={56} /></div><div className="min-w-0 flex-1 text-start"><h3 className={`font-[560] ${rtl ? "text-[17px]" : "text-[16px]"}`}>{name}</h3>{role && <p className={`mt-1 uppercase ${rtl ? "text-[12px]" : "text-[10px] tracking-[.12em]"}`} style={{ color: accent }}>{role}</p>}<div className="mt-2.5"><MemberRoleBadge roleType={member.roleType} label={copy.roles[member.roleType]} accent={accent} light={light} /></div></div>{member.username && <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 transition-[opacity,translate] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-90 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" strokeWidth={1.4} />}</div>{description && <p className={`mt-6 leading-7 ${rtl ? "text-[13px]" : "text-[12px]"} ${light ? "text-[#243b59]/58" : "text-white/48"}`}>{description}</p>}<div className={`mt-6 flex items-center justify-between border-t pt-4 font-mono text-[7px] uppercase tracking-[.14em] ${light ? "border-[#294368]/10 text-[#294368]/36" : "border-white/[.08] text-white/28"}`}><span>{member.username ? copy.viewProfile : copy.joinedAt}</span><span>{member.joinedAt ? formatDate(member.joinedAt, language) : "—"}</span></div></>;
              const cardClass = `project-interactive-card group block rounded-[22px] border p-5 ${light ? "border-[#294368]/10 bg-white/55" : "border-white/[.07] bg-white/[.018]"}`;
              // A member with a public profile opens it; others stay a static card.
              return member.username
                ? <Link key={member.id} href={`/member/${member.username}`} className={`${cardClass} outline-none transition-colors hover:border-[var(--project-accent)] focus-visible:ring-2 focus-visible:ring-[var(--project-accent)]`}>{card}</Link>
                : <article key={member.id} className={cardClass}>{card}</article>;
            })}</div>
          </div>
        </section>

        <section data-project-reveal>
          <Link href={`/projects/${nextProject.slug}`} className="group mx-auto flex min-h-[330px] w-[min(1440px,calc(100%_-_clamp(28px,6vw,96px)))] flex-col justify-center py-16">
            <span className={`font-mono text-[8px] uppercase tracking-[.2em] ${light ? "text-[#294368]/38" : "text-white/28"}`}>{nextProject.id > 0 ? `${copy.next} / ${String(nextProject.id).padStart(2, "0")}` : copy.next}</span>
            <div className="mt-6 flex items-end justify-between gap-6"><h2 className={`max-w-[13ch] text-[clamp(42px,7vw,102px)] font-[560] ${rtl ? "leading-[1.15]" : "leading-[.84] tracking-[-.03em]"}`}>{pick(nextProject.title, nextProject.titleFa)}</h2><ArrowUpRight className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 rtl:-scale-x-100 rtl:group-hover:-translate-x-2" strokeWidth={1.2} /></div>
            <span className="mt-8 text-[10px] uppercase tracking-[.15em]" style={{ color: nextAccent }}>{copy.viewNext}</span>
          </Link>
        </section>
      </article>
    </main>
  );
}

"use client";

import { useLayoutEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { GithubMark } from "@/components/Profile/BrandIcons";
import type { MemberProject } from "@/components/Profile/types";
import type { ProfileCopy } from "@/components/Profile/copy";

gsap.registerPlugin(ScrollTrigger);

type ProjectsRailProps = {
  projects: MemberProject[];
  copy: ProfileCopy;
  language: "en" | "fa";
};

const TYPE_ACCENT: Record<MemberProject["type"], { glow: string; text: string; border: string; wash: string }> = {
  TEAM: {
    glow: "rgba(169,128,255,.24)",
    text: "text-[#c9b8ff]",
    border: "border-[rgba(169,128,255,.28)]",
    wash: "linear-gradient(135deg, rgba(169,128,255,.14), rgba(110,188,255,.05))",
  },
  PERSONAL: {
    glow: "rgba(110,188,255,.24)",
    text: "text-[#9fd4ff]",
    border: "border-[rgba(110,188,255,.28)]",
    wash: "linear-gradient(135deg, rgba(110,188,255,.14), rgba(89,225,238,.05))",
  },
};

function ProjectCover({
  project,
  index,
  glow,
  wash,
}: {
  project: MemberProject;
  index: number;
  glow: string;
  wash: string;
}) {
  if (project.coverImage) {
    return (
      <div className="project-cover relative aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-white/[.07]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="project-cover-image h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(2,4,8,.55))]" />
        <div className="project-cover-scan pointer-events-none absolute left-0 top-0 h-[24%] w-full -translate-y-[140%] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.28),rgba(110,188,255,.1),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    );
  }

  return (
    <div
      className="project-cover relative aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-white/[.07]"
      style={{ background: wash }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 320 200" preserveAspectRatio="none">
        <line x1="0" y1="200" x2="320" y2="0" stroke={glow} strokeWidth="1" />
        <line x1="0" y1="140" x2="260" y2="0" stroke={glow} strokeWidth="1" />
        <line x1="60" y1="200" x2="320" y2="60" stroke={glow} strokeWidth="1" />
      </svg>
      <span className="absolute -bottom-3 right-2 select-none font-mono text-[64px] font-bold leading-none text-white/[.06]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="project-cover-scan pointer-events-none absolute left-0 top-0 h-[30%] w-full -translate-y-[140%] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.14),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

function ProjectCard({
  project,
  copy,
  isRTL,
  index,
}: {
  project: MemberProject;
  copy: ProfileCopy;
  isRTL: boolean;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accent = TYPE_ACCENT[project.type];
  const description = isRTL && project.descriptionFa ? project.descriptionFa : project.description;
  const outcome = isRTL && project.outcomeFa ? project.outcomeFa : project.outcome;
  const role = isRTL && project.membership.roleFa ? project.membership.roleFa : project.membership.role;
  const year = new Date(project.createdAt).getFullYear();

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || event.pointerType === "touch") return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotationY: px * 5,
      rotationX: py * -5,
      duration: 0.5,
      ease: "power3.out",
      transformPerspective: 900,
    });
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power3.out" });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ "--project-accent": accent.glow } as CSSProperties}
      className="project-card group relative flex flex-col overflow-hidden rounded-[22px] border border-white/[.08] bg-white/[.02] p-4 [transform-style:preserve-3d] transition-colors duration-300 hover:border-[var(--project-accent)]"
    >
      <ProjectCover project={project} index={index} glow={accent.glow} wash={accent.wash} />

      <div className="relative flex flex-1 flex-col px-2 pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className={`font-mono text-[9px] uppercase tracking-[.18em] ${accent.text}`}>
              {copy.projectsSection.typeLabel[project.type]}
            </span>
            {project.featured ? (
              <span className="rounded-full border border-[rgba(var(--accent-a),.2)] bg-[rgba(var(--accent-a),.06)] px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[.14em] text-[rgba(var(--accent-a),.8)]">
                {copy.projectsSection.featured}
              </span>
            ) : null}
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[.16em] text-white/30">
            {copy.projectsSection.statusLabel[project.status]} / {year}
          </span>
        </div>

        <h3 className="mt-4 text-[19px] font-[560] leading-tight tracking-[-.01em] text-[#f4f6fb]">{project.title}</h3>
        <p className="mt-3 text-[12px] leading-[1.75] text-white/45">{description}</p>

        <div className="mt-4 font-mono text-[9px] uppercase tracking-[.15em] text-white/30">
          {copy.projectsSection.role} / <span className="text-white/55">{role}</span>
        </div>

        {outcome ? (
          <div className="mt-4 border-s border-[rgba(var(--accent-a),.3)] ps-3">
            <div className="font-mono text-[8px] uppercase tracking-[.15em] text-[rgba(var(--accent-a),.55)]">{copy.projectsSection.outcome}</div>
            <p className="mt-1.5 text-[10.5px] leading-[1.65] text-white/42">{outcome}</p>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/[.08] bg-white/[.02] px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[.1em] text-white/40"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="relative mt-5 flex flex-1 items-end gap-4 border-t border-white/[.07] pt-4">
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-sm font-mono text-[9.5px] uppercase tracking-[.14em] text-white/60 outline-none transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent-a),.3)]"
            >
              {copy.projectsSection.viewProject}
              <ArrowUpRight size={12} strokeWidth={1.75} />
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-sm font-mono text-[9.5px] uppercase tracking-[.14em] text-white/40 outline-none transition-colors duration-300 hover:text-white/80 focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent-a),.3)]"
            >
              <GithubMark size={12} />
              {copy.projectsSection.viewSource}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ProjectsRail({ projects, copy, language }: ProjectsRailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isRTL = language === "fa";

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(cards, { opacity: 0, y: 26 });

      const showCards = (batch: Element[]) => {
        gsap.killTweensOf(batch);
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: true });
      };
      const resetCards = (batch: Element[], y: number) => {
        gsap.killTweensOf(batch);
        gsap.set(batch, { opacity: 0, y, rotationX: 0, rotationY: 0 });
      };

      ScrollTrigger.batch(cards, {
        start: "top 90%",
        end: "bottom 10%",
        onEnter: showCards,
        onEnterBack: showCards,
        onLeave: (batch) => resetCards(batch, -20),
        onLeaveBack: (batch) => resetCards(batch, 26),
      });
    }, rootRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      ref={rootRef}
      dir={isRTL ? "rtl" : "ltr"}
      data-profile-section
      className="relative z-10 mx-auto mt-[clamp(74px,10vw,124px)] w-[min(1180px,calc(100%-40px))] pb-[clamp(90px,12vw,140px)] sm:w-[min(1180px,calc(100%-56px))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[clamp(30px,5.5vw,58px)] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-mono text-[clamp(70px,11vw,150px)] font-bold tracking-[-.04em] text-white/[.03]"
      >
        PROJECT LOG
      </div>

      <div data-section-reveal className="relative flex items-end justify-between gap-6 border-b border-white/[.08] pb-5 max-[640px]:flex-col max-[640px]:items-start">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.2em] text-white/40">{copy.projectsSection.eyebrow}</div>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,40px)] font-[560] tracking-[-.02em] text-[#f4f6fb]">
            {copy.projectsSection.title}
          </h2>
        </div>
        <p className="max-w-[360px] text-[12px] leading-[1.75] text-white/45">{copy.projectsSection.subtitle}</p>
      </div>

      {projects.length ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} copy={copy} isRTL={isRTL} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[18px] border border-white/[.08] bg-white/[.015] p-8 text-center font-mono text-[11px] uppercase tracking-[.12em] text-white/35">
          {copy.projectsSection.empty}
        </div>
      )}
    </section>
  );
}

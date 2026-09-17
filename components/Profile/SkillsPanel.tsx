"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MemberSkill } from "@/components/Profile/types";
import type { ProfileCopy } from "@/components/Profile/copy";

gsap.registerPlugin(ScrollTrigger);

const LEVEL_STEPS: Record<MemberSkill["level"], number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

type SkillsPanelProps = {
  skills: MemberSkill[];
  copy: ProfileCopy;
  language: "en" | "fa";
};

export function SkillsPanel({ skills, copy, language }: SkillsPanelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isRTL = language === "fa";

  const grouped = useMemo(() => {
    const byCategory = new Map<string, MemberSkill[]>();
    skills.forEach((entry) => {
      const list = byCategory.get(entry.skill.category) ?? [];
      list.push(entry);
      byCategory.set(entry.skill.category, list);
    });
    return Array.from(byCategory.entries());
  }, [skills]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".skill-row");
      const segments = gsap.utils.toArray<HTMLElement>(".skill-segment");

      if (reducedMotion) {
        gsap.set(rows, { opacity: 1, y: 0 });
        gsap.set(segments, { opacity: (index, target) => (target.dataset.filled === "1" ? 1 : 0.14) });
        return;
      }

      gsap.set(rows, { opacity: 0, y: 16 });
      gsap.set(segments, { opacity: 0.08 });

      const showRows = (batch: Element[]) => {
        gsap.killTweensOf(batch);
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out", overwrite: true });
        batch.forEach((row) => {
          const rowSegments = row.querySelectorAll<HTMLElement>(".skill-segment");
          gsap.killTweensOf(rowSegments);
          gsap.to(rowSegments, {
            opacity: (index, target) => (target.dataset.filled === "1" ? 1 : 0.14),
            duration: 0.5,
            stagger: 0.05,
            delay: 0.08,
            ease: "power2.out",
            overwrite: true,
          });
        });
      };
      const resetRows = (batch: Element[], y: number) => {
        gsap.killTweensOf(batch);
        gsap.set(batch, { opacity: 0, y });
        batch.forEach((row) => gsap.set(row.querySelectorAll(".skill-segment"), { opacity: 0.08 }));
      };

      ScrollTrigger.batch(rows, {
        start: "top 88%",
        end: "bottom 12%",
        onEnter: showRows,
        onEnterBack: showRows,
        onLeave: (batch) => resetRows(batch, -14),
        onLeaveBack: (batch) => resetRows(batch, 16),
      });
    }, rootRef);

    return () => ctx.revert();
  }, [skills]);

  return (
    <section
      ref={rootRef}
      dir={isRTL ? "rtl" : "ltr"}
      data-profile-section
      className="relative z-10 mx-auto mt-[clamp(74px,10vw,124px)] w-[min(1180px,calc(100%-40px))] sm:w-[min(1180px,calc(100%-56px))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[clamp(28px,5vw,54px)] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-mono text-[clamp(70px,11vw,150px)] font-bold tracking-[-.04em] text-white/[.03]"
      >
        MATRIX
      </div>

      <div data-section-reveal className="relative flex items-end justify-between gap-6 border-b border-white/[.08] pb-5 max-[640px]:flex-col max-[640px]:items-start">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.2em] text-white/40">{copy.skillsSection.eyebrow}</div>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,40px)] font-[560] tracking-[-.02em] text-[#f4f6fb]">
            {copy.skillsSection.title}
          </h2>
        </div>
        <p className="max-w-[360px] text-[12px] leading-[1.75] text-white/45">{copy.skillsSection.subtitle}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.map(([category, entries]) => (
          <div key={category}>
            <div className="font-mono text-[10px] uppercase tracking-[.18em] text-[rgba(var(--accent-a),.72)]">{category}</div>
            <div className="mt-4 flex flex-col gap-3.5">
              {entries.map((entry) => {
                const step = LEVEL_STEPS[entry.level];
                return (
                  <div key={entry.id} className="skill-row group rounded-lg px-1 py-0.5 transition-colors hover:bg-white/[.018]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] text-white/75">{entry.skill.name}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[.14em] text-white/36">
                        {copy.skillsSection.levelLabels[entry.level]}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      {[1, 2, 3, 4].map((segment) => (
                        <span
                          key={segment}
                          data-filled={segment <= step ? "1" : "0"}
                          className={`skill-segment h-[3px] flex-1 rounded-full ${
                            segment <= step
                              ? "bg-[rgba(var(--accent-a),.85)] shadow-[0_0_10px_rgba(var(--accent-a),.35)]"
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, Languages, Wrench } from "lucide-react";
import type { MemberEducation, MemberTool, ProfileSignal, SpokenLanguage } from "@/components/Profile/types";
import type { ProfileCopy } from "@/components/Profile/copy";

gsap.registerPlugin(ScrollTrigger);

const LANGUAGE_WIDTH: Record<SpokenLanguage["proficiency"], number> = {
  NATIVE: 100,
  PROFESSIONAL: 84,
  CONVERSATIONAL: 64,
  BASIC: 38,
};

type ProfileSignalsProps = {
  languages: SpokenLanguage[];
  tools: MemberTool[];
  education: MemberEducation[];
  signals: ProfileSignal[];
  copy: ProfileCopy;
  language: "en" | "fa";
};

function PanelLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[.18em] text-white/42">
      <span className="text-[rgba(var(--accent-a),.72)]">{icon}</span>
      {children}
    </div>
  );
}

export function ProfileSignals({ languages, tools, education, signals, copy, language }: ProfileSignalsProps) {
  const rootRef = useRef<HTMLElement>(null);
  const isRTL = language === "fa";

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".signal-panel");
      const chips = gsap.utils.toArray<HTMLElement>(".tool-chip");

      if (reducedMotion) {
        gsap.set([...panels, ...chips], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(panels, { opacity: 0, y: 24 });
      gsap.set(chips, { opacity: 0, y: 12, scale: 0.96 });

      const showPanels = (batch: Element[]) => {
        gsap.killTweensOf(batch);
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: true });
      };
      const resetPanels = (batch: Element[], y: number) => {
        gsap.killTweensOf(batch);
        gsap.set(batch, { opacity: 0, y });
      };
      const showChips = (batch: Element[]) => {
        gsap.killTweensOf(batch);
        gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.045, ease: "back.out(1.6)", overwrite: true });
      };
      const resetChips = (batch: Element[], y: number) => {
        gsap.killTweensOf(batch);
        gsap.set(batch, { opacity: 0, y, scale: 0.96 });
      };

      ScrollTrigger.batch(panels, {
        start: "top 88%",
        end: "bottom 12%",
        onEnter: showPanels,
        onEnterBack: showPanels,
        onLeave: (batch) => resetPanels(batch, -18),
        onLeaveBack: (batch) => resetPanels(batch, 24),
      });
      ScrollTrigger.batch(chips, {
        start: "top 90%",
        end: "bottom 10%",
        onEnter: showChips,
        onEnterBack: showChips,
        onLeave: (batch) => resetChips(batch, -10),
        onLeaveBack: (batch) => resetChips(batch, 12),
      });
    }, rootRef);

    return () => ctx.revert();
  }, [languages, tools, education, signals]);

  return (
    <section
      ref={rootRef}
      data-profile-section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative z-10 mx-auto mt-[clamp(74px,10vw,124px)] w-[min(1180px,calc(100%-40px))] sm:w-[min(1180px,calc(100%-56px))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[clamp(30px,5vw,58px)] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-mono text-[clamp(60px,10vw,138px)] font-bold tracking-[-.05em] text-white/[.028]"
      >
        SIGNAL
      </div>

      <div data-section-reveal className="relative flex items-end justify-between gap-6 border-b border-white/[.08] pb-5 max-[640px]:flex-col max-[640px]:items-start">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.2em] text-white/40">{copy.signalsSection.eyebrow}</div>
          <h2 className="mt-3 text-[clamp(28px,3.4vw,40px)] font-[560] tracking-[-.02em] text-[#f4f6fb]">{copy.signalsSection.title}</h2>
        </div>
        <p className="max-w-[360px] text-[12px] leading-[1.75] text-white/45">{copy.signalsSection.subtitle}</p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[.82fr_1.18fr]">
        <div className="signal-panel rounded-[22px] border border-white/[.08] bg-white/[.018] p-6 sm:p-7">
          <PanelLabel icon={<Languages size={15} strokeWidth={1.6} />}>{copy.signalsSection.languages}</PanelLabel>
          <div className="mt-6 space-y-5">
            {languages.map((item) => {
              const name = isRTL && item.nameFa ? item.nameFa : item.name;
              return (
                <div key={item.id} className="group">
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-[15px] text-white/80">{name}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[.13em] text-white/35">
                      {copy.signalsSection.proficiencyLabels[item.proficiency]}
                    </span>
                  </div>
                  <div className="mt-2.5 h-px overflow-hidden bg-white/[.07]">
                    <span
                      className="block h-full origin-left bg-[linear-gradient(90deg,rgba(var(--accent-a),.8),rgba(var(--accent-b),.38))] transition-transform duration-700 group-hover:scale-x-105"
                      style={{ width: `${LANGUAGE_WIDTH[item.proficiency]}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="signal-panel relative overflow-hidden rounded-[22px] border border-white/[.08] bg-white/[.018] p-6 sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[rgba(var(--accent-a),.08)] blur-[65px]" />
          <PanelLabel icon={<Wrench size={15} strokeWidth={1.6} />}>{copy.signalsSection.tools}</PanelLabel>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                tabIndex={0}
                className="tool-chip group relative overflow-hidden rounded-[14px] border border-white/[.08] bg-black/15 px-3 py-4 outline-none transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-[rgba(var(--accent-a),.34)] hover:bg-[rgba(var(--accent-a),.045)] focus-visible:border-[rgba(var(--accent-a),.7)] focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent-a),.18)]"
              >
                <span className="absolute right-2 top-1.5 font-mono text-[8px] text-white/12">{String(index + 1).padStart(2, "0")}</span>
                <div className="font-mono text-[8px] uppercase tracking-[.15em] text-[rgba(var(--accent-a),.58)]">{tool.category}</div>
                <div className="mt-2 text-[13px] font-medium text-white/76 transition-colors group-hover:text-white">{tool.name}</div>
                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[rgba(var(--accent-a),.72)] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="signal-panel rounded-[22px] border border-white/[.08] bg-white/[.018] p-6 sm:p-7">
          <PanelLabel icon={<GraduationCap size={15} strokeWidth={1.6} />}>{copy.signalsSection.education}</PanelLabel>
          <div className="mt-6 space-y-3">
            {education.map((item, index) => {
              const institution = isRTL && item.institutionFa ? item.institutionFa : item.institution;
              const degree = isRTL && item.degreeFa ? item.degreeFa : item.degree;
              const field = isRTL && item.fieldFa ? item.fieldFa : item.field;
              const period = isRTL && item.periodFa ? item.periodFa : item.period;
              return (
                <article key={item.id} className="group rounded-[16px] border border-white/[.07] bg-black/10 p-4 transition-colors hover:border-[rgba(var(--accent-a),.25)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-mono text-[9px] tracking-[.16em] text-white/24">0{index + 1}</div>
                    <span className="font-mono text-[9px] uppercase tracking-[.13em] text-[rgba(var(--accent-a),.7)]">{period}</span>
                  </div>
                  <h3 className="mt-4 text-[13px] font-medium text-white/78 transition-colors group-hover:text-white">{institution}</h3>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[.1em] text-white/48">{degree}</p>
                  <p className="mt-1.5 text-[11px] leading-[1.7] text-white/38">{field}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="signal-panel rounded-[22px] border border-white/[.08] bg-white/[.018] p-6 sm:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[.18em] text-white/42">{copy.signalsSection.personalSignals}</div>
          <div className="mt-6 divide-y divide-white/[.07]">
            {signals.map((signal) => {
              const label = isRTL && signal.labelFa ? signal.labelFa : signal.label;
              const value = isRTL && signal.valueFa ? signal.valueFa : signal.value;
              return (
                <div key={signal.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="font-mono text-[8.5px] uppercase tracking-[.16em] text-white/28">{label}</div>
                  <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[.12em] text-[rgba(var(--accent-a),.72)]">{value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

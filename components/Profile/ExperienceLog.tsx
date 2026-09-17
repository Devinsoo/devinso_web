"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MemberExperience } from "@/components/Profile/types";
import type { ProfileCopy } from "@/components/Profile/copy";

gsap.registerPlugin(ScrollTrigger);

type ExperienceLogProps = {
  experiences: MemberExperience[];
  copy: ProfileCopy;
  language: "en" | "fa";
};

export function ExperienceLog({ experiences, copy, language }: ExperienceLogProps) {
  const rootRef = useRef<HTMLElement>(null);
  const isRTL = language === "fa";

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const entries = gsap.utils.toArray<HTMLElement>(".experience-entry");
      const fill = rootRef.current?.querySelector<HTMLElement>(".experience-line-fill");

      if (reducedMotion) {
        gsap.set(entries, { opacity: 1, y: 0 });
        if (fill) gsap.set(fill, { scaleY: 1 });
        return;
      }

      gsap.set(entries, { opacity: 0, y: 28 });
      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0, transformOrigin: "top" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 72%",
              end: "bottom 68%",
              scrub: 0.7,
            },
          },
        );
      }

      const showEntries = (batch: Element[]) => {
        gsap.killTweensOf(batch);
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.72, stagger: 0.1, ease: "power3.out", overwrite: true });
      };
      const resetEntries = (batch: Element[], y: number) => {
        gsap.killTweensOf(batch);
        gsap.set(batch, { opacity: 0, y });
      };

      ScrollTrigger.batch(entries, {
        start: "top 86%",
        end: "bottom 14%",
        onEnter: showEntries,
        onEnterBack: showEntries,
        onLeave: (batch) => resetEntries(batch, -20),
        onLeaveBack: (batch) => resetEntries(batch, 28),
      });
    }, rootRef);

    return () => ctx.revert();
  }, [experiences]);

  return (
    <section
      id="experience"
      ref={rootRef}
      data-profile-section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative z-10 mx-auto mt-[clamp(74px,10vw,124px)] w-[min(1180px,calc(100%-40px))] sm:w-[min(1180px,calc(100%-56px))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[clamp(30px,5vw,58px)] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-mono text-[clamp(64px,10vw,140px)] font-bold tracking-[-.05em] text-white/[.028]"
      >
        EXPERIENCE
      </div>

      <div data-section-reveal className="relative flex items-end justify-between gap-6 border-b border-white/[.08] pb-5 max-[640px]:flex-col max-[640px]:items-start">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.2em] text-white/40">{copy.experienceSection.eyebrow}</div>
          <h2 className="mt-3 text-[clamp(28px,3.4vw,40px)] font-[560] tracking-[-.02em] text-[#f4f6fb]">
            {copy.experienceSection.title}
          </h2>
        </div>
        <p className="max-w-[360px] text-[12px] leading-[1.75] text-white/45">{copy.experienceSection.subtitle}</p>
      </div>

      <div className="relative mt-10">
        <div className={`absolute bottom-3 top-3 w-px bg-white/[.07] ${isRTL ? "right-[7px]" : "left-[7px]"}`}>
          <span className="experience-line-fill absolute inset-0 block bg-[linear-gradient(180deg,rgba(var(--accent-a),.9),rgba(var(--accent-b),.32),transparent)] shadow-[0_0_14px_rgba(var(--accent-a),.34)]" />
        </div>

        <div className="space-y-5">
          {experiences.map((experience, index) => {
            const role = isRTL && experience.roleFa ? experience.roleFa : experience.role;
            const period = isRTL && experience.periodFa ? experience.periodFa : experience.period;
            const description = isRTL && experience.descriptionFa ? experience.descriptionFa : experience.description;

            return (
              <article
                key={experience.id}
                className={`experience-entry relative grid gap-4 ${isRTL ? "pr-10" : "pl-10"} md:grid-cols-[150px_1fr] md:gap-8`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-6 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-[rgba(var(--accent-a),.5)] bg-[#050508] shadow-[0_0_16px_rgba(var(--accent-a),.2)] ${isRTL ? "right-0" : "left-0"}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${experience.current ? "bg-[rgba(var(--accent-a),.95)]" : "bg-white/25"}`} />
                </span>

                <div className="pt-5 font-mono">
                  <div className="text-[10px] uppercase tracking-[.17em] text-[rgba(var(--accent-a),.72)]">{period}</div>
                  <div className="mt-2 text-[9px] uppercase tracking-[.16em] text-white/30">LOG / {String(index + 1).padStart(2, "0")}</div>
                </div>

                <div className="group relative overflow-hidden rounded-[20px] border border-white/[.08] bg-white/[.018] p-6 transition-colors duration-500 hover:border-[rgba(var(--accent-a),.3)] sm:p-7">
                  <div className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-[rgba(var(--accent-a),.8)] transition-transform duration-500 group-hover:scale-y-100" />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[.2em] text-white/38">{experience.company}</span>
                    {experience.current ? (
                      <span className="rounded-full border border-[rgba(var(--accent-a),.2)] bg-[rgba(var(--accent-a),.06)] px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[.16em] text-[rgba(var(--accent-a),.82)]">
                        {copy.experienceSection.current}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-[clamp(18px,2.1vw,24px)] font-[540] tracking-[-.015em] text-white/90">{role}</h3>
                  <p className="mt-3 max-w-[700px] text-[12.5px] leading-[1.8] text-white/48">{description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

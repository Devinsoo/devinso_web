"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProfileBackground } from "@/components/Profile/ProfileBackground";
import { ProfileTerminal } from "@/components/Profile/ProfileTerminal";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ExperienceLog } from "@/components/Profile/ExperienceLog";
import { SkillsPanel } from "@/components/Profile/SkillsPanel";
import { ProfileSignals } from "@/components/Profile/ProfileSignals";
import { ProjectsRail } from "@/components/Profile/ProjectsRail";
import { PROFILE_COPY } from "@/components/Profile/copy";
import { SubpageHeader } from "@/components/Brand/SubpageHeader";
import { DEVINSO_COOKIE, setCookie, type DevinsoLanguage } from "@/lib/preferences";
import { getThemeAccent, accentCssVars } from "@/components/Profile/theme";
import type { MemberProfileData } from "@/components/Profile/types";

gsap.registerPlugin(ScrollTrigger);

type MemberProfileProps = {
  data: MemberProfileData;
  /** From the language cookie, read on the server so the first paint is right. */
  initialLanguage?: DevinsoLanguage;
};

export function MemberProfile({ data, initialLanguage = "en" }: MemberProfileProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);
  const [language, setLanguage] = useState<DevinsoLanguage>(initialLanguage);
  const copy = PROFILE_COPY[language];
  const rtl = language === "fa";
  const accent = getThemeAccent(data.profile.theme?.slug);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.dataset.language = language;
  }, [language, rtl]);

  // Persian text wraps to different heights, so every scroll trigger below the
  // header has moved; re-measure rather than rebuild.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [language]);

  // The server sets the tab title from the cookie; keep it in step with the
  // in-page language switch, which does not reload.
  const pageTitle = (rtl && data.profile.fullNameFa) || data.profile.fullName;
  useEffect(() => {
    document.title = `${pageTitle} · Devinso`;
  }, [pageTitle]);

  const changeLanguage = (next: DevinsoLanguage) => {
    setLanguage(next);
    setCookie(DEVINSO_COOKIE.language, next);
  };

  useLayoutEffect(() => {
    if (!booted || !rootRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.set("[data-hero-reveal]", { y: 18, opacity: 0 });
      gsap.set(".identity-frame-line", { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to("[data-hero-reveal]", { y: 0, opacity: 1, duration: 0.75, stagger: 0.055 });
      tl.to(".identity-frame-line", { opacity: 1, duration: 0.6, stagger: 0.05 }, "-=0.5");

      const sectionReveals = gsap.utils.toArray<HTMLElement>("[data-section-reveal]");
      if (reducedMotion) {
        gsap.set(sectionReveals, { opacity: 1, y: 0 });
        gsap.set(".profile-scroll-line", { scaleY: 1 });
      } else {
        gsap.set(sectionReveals, { opacity: 0, y: 22 });

        const showSection = (batch: Element[]) => {
          gsap.killTweensOf(batch);
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: true });
        };
        const resetSectionBelow = (batch: Element[]) => {
          gsap.killTweensOf(batch);
          gsap.set(batch, { opacity: 0, y: 22 });
        };
        const resetSectionAbove = (batch: Element[]) => {
          gsap.killTweensOf(batch);
          gsap.set(batch, { opacity: 0, y: -18 });
        };

        ScrollTrigger.batch(sectionReveals, {
          start: "top 88%",
          end: "bottom 12%",
          onEnter: showSection,
          onEnterBack: showSection,
          onLeave: resetSectionAbove,
          onLeaveBack: resetSectionBelow,
        });
        gsap.fromTo(
          ".profile-scroll-line",
          { scaleY: 0, transformOrigin: "top" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
            },
          },
        );
      }

      if (!reducedMotion) {
        gsap.to(".profile-orb-a", {
          x: -18,
          y: 14,
          scale: 1.05,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".profile-orb-b", {
          x: 16,
          y: -12,
          scale: 1.06,
          duration: 11,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".hero-status-dot", {
          scale: 1.12,
          duration: 1.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.fromTo(
          ".profile-grid-light",
          { maskPosition: "-52% 0", opacity: 0.16 },
          {
            maskPosition: "152% 0",
            opacity: 0.72,
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );

        const orbit = rootRef.current?.querySelector<SVGGElement>(".profile-orbit-spinner");
        if (orbit) {
          const orbitState = { angle: 0 };
          gsap.to(orbitState, {
            angle: 360,
            duration: 16,
            repeat: -1,
            ease: "none",
            onUpdate: () => orbit.setAttribute("transform", `rotate(${orbitState.angle} 110 110)`),
          });
        }

        const hero = rootRef.current?.querySelector<HTMLElement>("[data-profile-hero]");
        const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]");
        if (hero) {
          ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            end: "bottom 8%",
            onLeave: () => {
              gsap.killTweensOf(heroItems);
              gsap.set(heroItems, { opacity: 0, y: -16 });
            },
            onEnterBack: () => {
              gsap.killTweensOf(heroItems);
              gsap.to(heroItems, {
                opacity: 1,
                y: 0,
                duration: 0.68,
                stagger: 0.05,
                ease: "power3.out",
                overwrite: true,
              });
            },
          });
        }
      }
    }, rootRef);

    return () => ctx.revert();
  }, [booted]);

  return (
    <main
      ref={rootRef}
      lang={language}
      dir={rtl ? "rtl" : "ltr"}
      data-locale={language}
      style={accentCssVars(accent)}
      // overflow-clip, not overflow-hidden: hidden makes <main> a scroll
      // container, and the sticky header would then stick to it instead of
      // the viewport.
      className="profile-page relative min-h-screen overflow-clip bg-[#050508] text-[#f2f0ec] [background:radial-gradient(circle_at_50%_18%,rgba(150,195,255,.07),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.012),rgba(255,255,255,0)),#050508]"
    >
      <ProfileBackground />

      <div aria-hidden="true" className="fixed bottom-10 start-5 top-24 z-30 hidden w-px bg-white/[.06] xl:block">
        <span className="profile-scroll-line absolute inset-0 block bg-[linear-gradient(180deg,rgba(var(--accent-a),.95),rgba(var(--accent-b),.5),rgba(var(--accent-a),.2))] shadow-[0_0_14px_rgba(var(--accent-a),.32)]" />
        <span className="absolute -start-[3px] top-0 h-[7px] w-[7px] rounded-full bg-[rgba(var(--accent-a),.9)] shadow-[0_0_12px_rgba(var(--accent-a),.65)]" />
      </div>

      {!booted ? (
        <ProfileTerminal
          // The boot sequence is a terminal readout, English in both languages.
          lines={PROFILE_COPY.en.boot.lines}
          status={PROFILE_COPY.en.boot.status}
          ready={PROFILE_COPY.en.boot.ready}
          skip={PROFILE_COPY.en.boot.skip}
          username={data.profile.username}
          onComplete={() => setBooted(true)}
        />
      ) : null}

      <SubpageHeader
        theme="dark"
        language={language}
        onLanguageChange={changeLanguage}
        context={`${copy.eyebrow} / ${data.profile.username}`}
        backHref="/#members"
        backLabel={copy.back}
      />

      <ProfileHeader data={data} copy={copy} language={language} />
      <ExperienceLog experiences={data.experiences} copy={copy} language={language} />
      <SkillsPanel skills={data.skills} copy={copy} language={language} />
      <ProfileSignals
        languages={data.languages}
        tools={data.tools}
        education={data.education}
        signals={data.signals}
        copy={copy}
        language={language}
      />
      <ProjectsRail projects={data.projects} copy={copy} language={language} />

      <footer data-profile-section className="relative z-10 mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col items-center border-t border-white/[.07] py-10 text-center sm:w-[min(1180px,calc(100%-56px))]">
        <span className="font-mono text-[9px] uppercase tracking-[.2em] text-white/30">{copy.footer.tag}</span>
      </footer>
    </main>
  );
}

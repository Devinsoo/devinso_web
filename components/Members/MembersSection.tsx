"use client";

import Link from "next/link";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TEAM_ROSTER, initialsOf, type TeamAccent, type TeamMember } from "@/lib/team";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger);

type MembersSectionProps = {
  theme: DevinsoTheme;
  language: DevinsoLanguage;
};

const COPY = {
  en: {
    eyebrow: "MEMBERS / 01—04",
    titleA: "TEAM",
    titleB: "MEMBERS",
    intro:
      "The people behind the work, and the seats still open. Each active member links through to a full profile.",
    focus: "FOCUS",
    viewProfile: "VIEW PROFILE",
    openSlot: "OPEN SLOT",
    joining: "ACCEPTING APPLICATIONS",
    active: "ACTIVE",
    signal: "ROSTER / LIVE",
  },
  fa: {
    eyebrow: "اعضا / ۰۱—۰۴",
    titleA: "TEAM",
    titleB: "MEMBERS",
    intro:
      "افرادی که پشت این کارها هستند و جایگاه‌هایی که هنوز خالی‌اند. هر عضو فعال به پروفایل کامل خود متصل است.",
    focus: "تمرکز",
    viewProfile: "مشاهده پروفایل",
    openSlot: "جایگاه خالی",
    joining: "پذیرش عضو جدید",
    active: "فعال",
    signal: "فهرست اعضا / زنده",
  },
} as const;

const ACCENTS: Record<TeamAccent, { strong: string; soft: string; glow: string }> = {
  crimson: { strong: "#ff566f", soft: "rgba(255,86,111,.12)", glow: "rgba(255,65,92,.18)" },
  violet: { strong: "#a996ff", soft: "rgba(169,150,255,.12)", glow: "rgba(145,122,255,.20)" },
  ice: { strong: "#a7ceff", soft: "rgba(167,206,255,.11)", glow: "rgba(150,195,255,.18)" },
};

function MemberCard({
  member,
  theme,
  language,
}: {
  member: TeamMember;
  theme: DevinsoTheme;
  language: DevinsoLanguage;
}) {
  const light = theme === "light";
  const rtl = language === "fa";
  const copy = COPY[language];
  const accent = ACCENTS[member.accent];
  const open = member.status === "OPEN";
  const name = rtl ? member.fullNameFa : member.fullName;
  const title = rtl ? member.titleFa : member.title;
  const focus = rtl ? member.focusFa : member.focus;

  const shell = open
    ? `border-dashed ${light ? "border-[#294368]/16 bg-white/[.28]" : "border-white/[.09] bg-white/[.012]"}`
    : `${light ? "border-[#294368]/10 bg-white/[.56]" : "border-white/[.07] bg-white/[.02]"}`;

  const body = (
    <>
      <div className={`flex items-start justify-between gap-3 ${rtl ? "flex-row-reverse" : ""}`}>
        <div
          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border font-mono text-[12px]"
          style={
            open
              ? {
                  borderColor: light ? "rgba(41,67,104,.16)" : "rgba(255,255,255,.10)",
                  color: light ? "rgba(41,67,104,.34)" : "rgba(255,255,255,.26)",
                }
              : { borderColor: `${accent.strong}55`, backgroundColor: `${accent.strong}18`, color: accent.strong }
          }
        >
          {member.avatar ? (
            <Image src={member.avatar} alt={name} width={56} height={56} className="h-full w-full object-cover" />
          ) : open ? (
            "—"
          ) : (
            initialsOf(member.fullName)
          )}
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[7px] uppercase tracking-[.16em] ${
            open
              ? light
                ? "border-[#294368]/12 text-[#294368]/40"
                : "border-white/[.09] text-white/28"
              : ""
          }`}
          style={
            open
              ? undefined
              : { borderColor: `${accent.strong}55`, backgroundColor: `${accent.strong}14`, color: accent.strong }
          }
        >
          {open ? copy.openSlot : copy.active}
        </span>
      </div>

      <div className={`mt-6 ${rtl ? "text-right [direction:rtl]" : "text-left"}`}>
        <h3
          className={`text-[17px] font-[560] leading-tight tracking-[-.03em] ${
            open ? (light ? "text-[#17263d]/44" : "text-white/34") : ""
          }`}
        >
          {name}
        </h3>
        <p
          className="mt-2 text-[10px] uppercase tracking-[.14em]"
          style={{ color: open ? undefined : accent.strong }}
        >
          <span className={open ? (light ? "text-[#294368]/34" : "text-white/24") : ""}>{title}</span>
        </p>
      </div>

      {focus.length > 0 && (
        <div className={`mt-6 ${rtl ? "text-right [direction:rtl]" : "text-left"}`}>
          <span
            className={`font-mono text-[7px] uppercase tracking-[.18em] ${
              light ? "text-[#294368]/34" : "text-white/26"
            }`}
          >
            {copy.focus}
          </span>
          <div className={`mt-3 flex flex-wrap gap-2 ${rtl ? "justify-end" : ""}`}>
            {focus.map((item) => (
              <span
                key={item}
                className={`rounded-full border px-2.5 py-1 text-[10px] ${
                  light ? "border-[#294368]/10 bg-white/60 text-[#243b59]/62" : "border-white/[.07] bg-white/[.03] text-white/52"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className={`mt-auto flex items-center justify-between gap-3 border-t pt-4 font-mono text-[7px] uppercase tracking-[.15em] ${
          light ? "border-[#294368]/10 text-[#294368]/38" : "border-white/[.08] text-white/28"
        }`}
      >
        <span>MEMBER / {member.slot}</span>
        {open ? (
          <span>{copy.joining}</span>
        ) : (
          <span className="inline-flex items-center gap-1.5" style={{ color: accent.strong }}>
            {copy.viewProfile}
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.6}
            />
          </span>
        )}
      </div>
    </>
  );

  const shared = `member-card group relative flex min-h-[290px] flex-col rounded-[22px] border p-5 ${shell}`;

  if (open || !member.username) {
    return (
      <div data-member-card className={shared}>
        {body}
      </div>
    );
  }

  return (
    <Link
      data-member-card
      href={`/member/${member.username}`}
      aria-label={`${copy.viewProfile}: ${name}`}
      className={`${shared} transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8be7ff]`}
      style={{ boxShadow: `0 26px 80px ${accent.soft}` }}
    >
      {body}
    </Link>
  );
}

export function MembersSection({ theme, language }: MembersSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const light = theme === "light";
  const rtl = language === "fa";
  const copy = COPY[language];

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    // Fade the cards themselves, never a wrapper: an ancestor with opacity < 1
    // forms a backdrop root and blanks out the card's backdrop-filter until the
    // tween lands, which reads as the glass popping in late.
    const cards = rootRef.current.querySelectorAll<HTMLElement>("[data-member-card]");
    const heading = rootRef.current.querySelectorAll<HTMLElement>("[data-members-heading]");
    const targets = [...heading, ...cards];
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { autoAlpha: 0, y: 28 });
      const reveal = gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        stagger: 0.09,
        paused: true,
        ease: "power3.out",
      });
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 82%",
        end: "bottom 18%",
        toggleActions: "play reverse play reverse",
        animation: reveal,
        invalidateOnRefresh: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [theme, language]);

  return (
    <section
      ref={rootRef}
      id="members"
      className="relative isolate overflow-hidden px-5 pb-24 pt-10 sm:px-6 lg:px-10"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${
          light
            ? "bg-[radial-gradient(circle_at_18%_12%,rgba(255,94,94,.05),transparent_34%),radial-gradient(circle_at_82%_26%,rgba(111,144,255,.06),transparent_36%)]"
            : "bg-[radial-gradient(circle_at_18%_12%,rgba(255,84,111,.07),transparent_32%),radial-gradient(circle_at_84%_28%,rgba(145,122,255,.07),transparent_34%)]"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 opacity-40 ${
          light
            ? "[background-image:linear-gradient(rgba(50,77,119,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(50,77,119,.05)_1px,transparent_1px)]"
            : "[background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)]"
        } [background-size:60px_60px]`}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid items-end gap-5 pb-9 lg:grid-cols-[minmax(300px,.78fr)_minmax(340px,1.22fr)] lg:gap-8">
          <div data-members-heading className={rtl ? "text-right [direction:rtl]" : "text-left"}>
            <div
              className={`font-mono text-[10px] uppercase tracking-[.22em] ${
                light ? "text-[#294368]/38" : "text-white/30"
              }`}
            >
              {copy.eyebrow}
            </div>
            <div
              className={`mt-3 inline-flex flex-wrap items-baseline gap-x-3 text-[clamp(34px,5.6vw,78px)] font-[560] leading-[.9] tracking-[-.075em] ${
                light ? "text-[#16253d]" : "text-white/[.94]"
              }`}
            >
              <span>{copy.titleA}</span>
              <span className={light ? "text-[#345783]/28" : "text-white/16"}>{copy.titleB}</span>
            </div>
          </div>

          <div data-members-heading className={rtl ? "text-right [direction:rtl]" : "text-left"}>
            <p className={`max-w-[52ch] text-[12px] leading-6 ${light ? "text-[#223857]/52" : "text-white/42"}`}>
              {copy.intro}
            </p>
            <div
              className={`mt-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.19em] ${
                light ? "text-[#294368]/34" : "text-white/28"
              } ${rtl ? "flex-row-reverse" : ""}`}
            >
              <i className={`h-px w-10 ${light ? "bg-[#294368]/18" : "bg-white/14"}`} />
              {copy.signal}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TEAM_ROSTER.map((member) => (
            <MemberCard key={member.id} member={member} theme={theme} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}

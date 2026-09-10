"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TEAM_ROSTER, initialsOf, type TeamAccent } from "@/lib/team";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger);

type MembersSectionProps = {
  theme: DevinsoTheme;
  language: DevinsoLanguage;
};

const AUTO_ADVANCE_MS = 5200;

const COPY = {
  en: {
    eyebrow: "MEMBERS / REGISTRY",
    titleA: "TEAM",
    titleB: "MEMBERS",
    intro:
      "One frame, every seat. Step through the registry to read each member — or the vacancy waiting to be filled.",
    registry: "REGISTRY",
    of: "OF",
    status: "STATUS",
    focus: "FOCUS",
    since: "SINCE",
    availability: "AVAIL",
    openProfile: "OPEN PROFILE",
    slotAvailable: "SLOT AVAILABLE",
    openSlot: "OPEN SLOT",
    active: "ACTIVE",
    joining: "ACCEPTING APPLICATIONS",
    vacantLead: "This seat is unassigned.",
    vacantBody: "The registry keeps the slot visible so the shape of the team stays honest.",
    indexLabel: "Member registry",
    rowHint: "Select a member to load their record",
    availabilityLabels: {
      AVAILABLE: "AVAILABLE",
      LIMITED: "LIMITED",
      UNAVAILABLE: "UNAVAILABLE",
    },
  },
  fa: {
    eyebrow: "اعضا / فهرست",
    titleA: "TEAM",
    titleB: "MEMBERS",
    intro:
      "یک قاب، همه جایگاه‌ها. در فهرست حرکت کنید تا هر عضو را بخوانید — یا جایگاهی که هنوز خالی است.",
    registry: "فهرست",
    of: "از",
    status: "وضعیت",
    focus: "تمرکز",
    since: "از سال",
    availability: "دسترس",
    openProfile: "مشاهده پروفایل",
    slotAvailable: "جایگاه خالی",
    openSlot: "جایگاه خالی",
    active: "فعال",
    joining: "پذیرش عضو جدید",
    vacantLead: "این جایگاه هنوز واگذار نشده است.",
    vacantBody: "فهرست این جایگاه را نمایش می‌دهد تا شکل واقعی تیم روشن بماند.",
    indexLabel: "فهرست اعضا",
    rowHint: "برای دیدن رکورد هر عضو انتخاب کنید",
    availabilityLabels: {
      AVAILABLE: "آماده همکاری",
      LIMITED: "محدود",
      UNAVAILABLE: "در دسترس نیست",
    },
  },
} as const;

const ACCENTS: Record<TeamAccent, { strong: string; soft: string; glow: string }> = {
  crimson: { strong: "#ff566f", soft: "rgba(255,86,111,.13)", glow: "rgba(255,65,92,.20)" },
  violet: { strong: "#a996ff", soft: "rgba(169,150,255,.13)", glow: "rgba(145,122,255,.20)" },
  ice: { strong: "#a7ceff", soft: "rgba(167,206,255,.12)", glow: "rgba(150,195,255,.18)" },
};

export function MembersSection({ theme, language }: MembersSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const recordRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);

  const light = theme === "light";
  const rtl = language === "fa";
  const copy = COPY[language];

  const member = TEAM_ROSTER[active];
  const accent = ACCENTS[member.accent];
  const open = member.status === "OPEN";
  const name = rtl ? member.fullNameFa : member.fullName;
  const title = rtl ? member.titleFa : member.title;
  const focus = rtl ? member.focusFa : member.focus;

  const select = useCallback((index: number) => {
    setLocked(true);
    setActive(index);
  }, []);

  // Idle auto-advance keeps the frame alive until the visitor takes over.
  useEffect(() => {
    if (locked) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((current) => (current + 1) % TEAM_ROSTER.length),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [locked]);

  // On-enter reveal. Targets leaf elements rather than a wrapper: an ancestor
  // with opacity < 1 forms a backdrop root and would blank out the glass blur
  // on the frame until the tween landed.
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const targets = rootRef.current.querySelectorAll<HTMLElement>("[data-registry-reveal]");
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      revealedRef.current = true;
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { autoAlpha: 0, y: 30 });
      const reveal = gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        stagger: 0.07,
        paused: true,
        ease: "power3.out",
        onStart: () => {
          revealedRef.current = true;
        },
      });
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 84%",
        end: "bottom 16%",
        toggleActions: "play reverse play reverse",
        animation: reveal,
        invalidateOnRefresh: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [theme, language]);

  // Transition choreography when the active slot changes: a scan line wipes the
  // frame, the monogram blurs through, the record lines stagger back in.
  useEffect(() => {
    if (!revealedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (scanRef.current) {
        gsap.fromTo(
          scanRef.current,
          { yPercent: -120, autoAlpha: 0 },
          { yPercent: 120, autoAlpha: 1, duration: 0.82, ease: "power2.inOut" },
        );
      }
      if (monogramRef.current) {
        gsap.fromTo(
          monogramRef.current,
          { autoAlpha: 0, scale: 0.82, filter: "blur(14px)", rotate: -6 },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", rotate: 0, duration: 0.9, ease: "power3.out" },
        );
      }
      if (ringRef.current) {
        gsap.fromTo(ringRef.current, { scale: 1.14, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: "power3.out" });
      }
      if (recordRef.current) {
        gsap.fromTo(
          recordRef.current.querySelectorAll("[data-record-line]"),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power2.out", delay: 0.12 },
        );
      }
    });

    return () => ctx.revert();
  }, [active]);

  const onIndexKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    if (event.key === "ArrowDown" || event.key === forward) {
      event.preventDefault();
      select((active + 1) % TEAM_ROSTER.length);
    } else if (event.key === "ArrowUp" || event.key === back) {
      event.preventDefault();
      select((active - 1 + TEAM_ROSTER.length) % TEAM_ROSTER.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0);
    } else if (event.key === "End") {
      event.preventDefault();
      select(TEAM_ROSTER.length - 1);
    }
  };

  const frameChrome = `font-mono text-[7.5px] uppercase tracking-[.18em] ${light ? "text-[#294368]/40" : "text-white/30"}`;
  const hairline = light ? "bg-[#294368]/12" : "bg-white/[.09]";

  return (
    <section
      ref={rootRef}
      id="members"
      className="relative isolate overflow-hidden px-5 pb-24 pt-12 sm:px-6 lg:px-10"
      style={{ ["--registry-accent" as string]: accent.strong }}
    >
      {/* Ambient wash tinted by the active slot, so the whole section shifts hue on change. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(circle at 22% 14%, ${accent.glow} 0%, transparent 38%), radial-gradient(circle at 84% 30%, ${accent.soft} 0%, transparent 34%)`,
        }}
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
        {/* Header */}
        <div className={`pb-10 ${rtl ? "text-right [direction:rtl]" : "text-left"}`}>
          <div
            data-registry-reveal
            className={`font-mono text-[10px] uppercase tracking-[.22em] ${light ? "text-[#294368]/38" : "text-white/30"}`}
          >
            {copy.eyebrow}
          </div>
          <div
            data-registry-reveal
            className={`mt-3 inline-flex flex-wrap items-baseline gap-x-3 text-[clamp(34px,5.6vw,78px)] font-[560] leading-[.9] tracking-[-.075em] ${
              light ? "text-[#16253d]" : "text-white/[.94]"
            }`}
          >
            <span>{copy.titleA}</span>
            <span className={light ? "text-[#345783]/28" : "text-white/16"}>{copy.titleB}</span>
          </div>
          <p
            data-registry-reveal
            className={`mt-5 max-w-[54ch] text-[12px] leading-6 ${light ? "text-[#223857]/52" : "text-white/42"}`}
          >
            {copy.intro}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(300px,.82fr)_minmax(420px,1.18fr)] lg:gap-8">
          {/* ---------------- Index rail ---------------- */}
          <div
            data-registry-reveal
            className={`registry-surface relative overflow-hidden rounded-[24px] border p-3 ${
              light ? "border-[#294368]/10 bg-white/[.5]" : "border-white/[.07] bg-white/[.018]"
            }`}
          >
            <div
              className={`flex items-center justify-between px-2.5 pb-3 pt-1.5 ${frameChrome} ${
                rtl ? "flex-row-reverse" : ""
              }`}
            >
              <span>{copy.indexLabel}</span>
              <span style={{ color: accent.strong }}>
                {member.slot} {copy.of} {String(TEAM_ROSTER.length).padStart(2, "0")}
              </span>
            </div>
            <div className={`mx-2.5 h-px ${hairline}`} />

            <div
              role="tablist"
              aria-label={copy.indexLabel}
              aria-orientation="vertical"
              onKeyDown={onIndexKeyDown}
              className="mt-2 flex flex-col"
            >
              {TEAM_ROSTER.map((row, index) => {
                const rowAccent = ACCENTS[row.accent];
                const isActive = index === active;
                const rowOpen = row.status === "OPEN";
                return (
                  <button
                    key={row.id}
                    type="button"
                    role="tab"
                    id={`registry-tab-${row.slot}`}
                    aria-selected={isActive}
                    aria-controls="registry-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(index)}
                    onMouseEnter={() => select(index)}
                    className={`registry-row group relative flex items-center gap-4 rounded-[16px] px-3 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8be7ff] ${
                      rtl ? "flex-row-reverse text-right [direction:rtl]" : ""
                    } ${isActive ? "" : "opacity-[.52] hover:opacity-90"}`}
                    style={{
                      transform: isActive ? `translateX(${rtl ? "-" : ""}6px)` : undefined,
                      backgroundColor: isActive ? (light ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.035)") : undefined,
                    }}
                  >
                    {/* Active marker bar */}
                    <i
                      aria-hidden="true"
                      className={`absolute top-1/2 h-[62%] w-[2px] -translate-y-1/2 rounded-full transition-opacity duration-300 ${
                        rtl ? "right-0" : "left-0"
                      } ${isActive ? "opacity-100" : "opacity-0"}`}
                      style={{ backgroundColor: rowAccent.strong }}
                    />
                    <span
                      className="font-mono text-[10px] tabular-nums tracking-[.14em]"
                      style={{ color: isActive ? rowAccent.strong : undefined }}
                    >
                      <span className={isActive ? "" : light ? "text-[#294368]/45" : "text-white/32"}>{row.slot}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[13px] font-[540] tracking-[-.01em] ${
                          rowOpen ? (light ? "text-[#17263d]/48" : "text-white/38") : light ? "text-[#16253d]" : "text-white/[.9]"
                        }`}
                      >
                        {rtl ? row.fullNameFa : row.fullName}
                      </span>
                      <span
                        className={`mt-1 block truncate font-mono text-[8px] uppercase tracking-[.16em] ${
                          light ? "text-[#294368]/38" : "text-white/28"
                        }`}
                      >
                        {rowOpen ? copy.openSlot : rtl ? row.titleFa : row.title}
                      </span>
                    </span>
                    <i
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${rowOpen ? "" : "registry-vacancy"}`}
                      style={{
                        backgroundColor: rowOpen ? (light ? "rgba(41,67,104,.2)" : "rgba(255,255,255,.16)") : rowAccent.strong,
                        boxShadow: rowOpen ? undefined : `0 0 10px ${rowAccent.strong}`,
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className={`mx-2.5 mt-2 h-px ${hairline}`} />
            <div className={`px-2.5 pb-1.5 pt-3 ${frameChrome}`}>{copy.rowHint}</div>
          </div>

          {/* ---------------- Identity frame ---------------- */}
          <div
            data-registry-reveal
            id="registry-panel"
            role="tabpanel"
            aria-labelledby={`registry-tab-${member.slot}`}
            className={`registry-frame relative isolate overflow-hidden rounded-[28px] border ${
              open ? "border-dashed" : ""
            } ${light ? "border-[#294368]/12 bg-white/[.44]" : "border-white/[.08] bg-white/[.014]"}`}
            style={{ boxShadow: open ? undefined : `0 34px 110px ${accent.soft}` }}
          >
            {/* Crosshair axes */}
            <div aria-hidden="true" className={`pointer-events-none absolute left-1/2 top-0 h-full w-px ${hairline} opacity-60`} />
            <div aria-hidden="true" className={`pointer-events-none absolute left-0 top-1/2 h-px w-full ${hairline} opacity-60`} />

            {/* Scan line, driven on every slot change */}
            <div
              ref={scanRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-20 h-[22%] w-full opacity-0"
              style={{
                background: `linear-gradient(180deg, transparent, ${accent.strong}22, ${accent.strong}55, ${accent.strong}22, transparent)`,
              }}
            />

            <div className="relative grid min-h-[420px] gap-6 p-6 sm:p-8 lg:min-h-[460px] lg:grid-cols-[1.05fr_.95fr]">
              {/* Monogram stage */}
              <div className="relative grid min-h-[220px] place-items-center">
                <div ref={ringRef} className="absolute inset-0 grid place-items-center">
                  <div
                    className={`registry-orbit absolute aspect-square w-[74%] rounded-full border ${
                      light ? "border-[#294368]/14" : "border-white/[.10]"
                    }`}
                  >
                    <i
                      aria-hidden="true"
                      className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ backgroundColor: accent.strong, boxShadow: `0 0 20px ${accent.strong}` }}
                    />
                  </div>
                  <div
                    className={`registry-orbit-reverse absolute aspect-square w-[92%] rounded-full border ${
                      light ? "border-[#294368]/[.08]" : "border-white/[.055]"
                    }`}
                  >
                    <i
                      aria-hidden="true"
                      className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ backgroundColor: accent.strong, opacity: 0.5 }}
                    />
                  </div>
                  <div className={`absolute aspect-square w-[52%] rotate-45 border ${light ? "border-[#294368]/[.08]" : "border-white/[.05]"}`} />
                </div>

                <div ref={monogramRef} className="relative grid place-items-center">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={name}
                      width={168}
                      height={168}
                      className="h-[clamp(96px,14vw,168px)] w-[clamp(96px,14vw,168px)] rounded-full object-cover"
                    />
                  ) : open ? (
                    <div
                      className={`registry-vacancy grid h-[clamp(88px,12vw,140px)] w-[clamp(88px,12vw,140px)] place-items-center rounded-full border border-dashed ${
                        light ? "border-[#294368]/22 text-[#294368]/30" : "border-white/[.14] text-white/22"
                      }`}
                    >
                      <span className="font-mono text-[11px] tracking-[.2em]">{member.slot}</span>
                    </div>
                  ) : (
                    <span
                      className="text-[clamp(64px,11vw,132px)] font-[600] leading-none tracking-[-.09em]"
                      style={{ color: accent.strong }}
                    >
                      {initialsOf(member.fullName)}
                    </span>
                  )}
                </div>

                <span
                  className={`absolute bottom-0 left-0 ${frameChrome}`}
                  style={rtl ? { left: "auto", right: 0 } : undefined}
                >
                  {copy.registry} / {member.slot} {copy.of} {String(TEAM_ROSTER.length).padStart(2, "0")}
                </span>
              </div>

              {/* Record */}
              <div ref={recordRef} className={`flex flex-col ${rtl ? "text-right [direction:rtl]" : "text-left"}`}>
                <div data-record-line className={`flex items-center gap-2.5 ${rtl ? "flex-row-reverse" : ""}`}>
                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[7px] uppercase tracking-[.16em]"
                    style={
                      open
                        ? {
                            borderColor: light ? "rgba(41,67,104,.14)" : "rgba(255,255,255,.10)",
                            color: light ? "rgba(41,67,104,.42)" : "rgba(255,255,255,.3)",
                          }
                        : { borderColor: `${accent.strong}55`, backgroundColor: `${accent.strong}14`, color: accent.strong }
                    }
                  >
                    {open ? copy.slotAvailable : copy.active}
                  </span>
                  {member.availability && (
                    <span className={frameChrome}>
                      {copy.availability} / {copy.availabilityLabels[member.availability]}
                    </span>
                  )}
                </div>

                <h3
                  data-record-line
                  className={`mt-5 text-[clamp(26px,3.4vw,42px)] font-[560] leading-[1.02] tracking-[-.05em] ${
                    open ? (light ? "text-[#17263d]/44" : "text-white/34") : light ? "text-[#16253d]" : "text-white/[.94]"
                  }`}
                >
                  {name}
                </h3>

                <p
                  data-record-line
                  className="mt-3 text-[10.5px] uppercase tracking-[.15em]"
                  style={{ color: open ? undefined : accent.strong }}
                >
                  <span className={open ? (light ? "text-[#294368]/34" : "text-white/24") : ""}>{title}</span>
                </p>

                {open ? (
                  <div data-record-line className={`mt-7 max-w-[38ch] text-[12px] leading-7 ${light ? "text-[#243b59]/54" : "text-white/44"}`}>
                    <span className={`block font-[540] ${light ? "text-[#17263d]/70" : "text-white/62"}`}>{copy.vacantLead}</span>
                    <span className="mt-2 block">{copy.vacantBody}</span>
                  </div>
                ) : (
                  <div data-record-line className="mt-7">
                    <span className={frameChrome}>{copy.focus}</span>
                    <div className={`mt-3 flex flex-wrap gap-2 ${rtl ? "justify-end" : ""}`}>
                      {focus.map((item) => (
                        <span
                          key={item}
                          className={`rounded-full border px-3 py-1.5 text-[10.5px] ${
                            light
                              ? "border-[#294368]/10 bg-white/64 text-[#243b59]/64"
                              : "border-white/[.07] bg-white/[.03] text-white/54"
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  data-record-line
                  className={`mt-auto flex items-center justify-between gap-3 border-t pt-5 ${
                    light ? "border-[#294368]/10" : "border-white/[.08]"
                  } ${rtl ? "flex-row-reverse" : ""}`}
                >
                  <span className={frameChrome}>
                    {member.since ? `${copy.since} / ${member.since}` : copy.joining}
                  </span>
                  {open || !member.username ? (
                    <span className={frameChrome}>—</span>
                  ) : (
                    <Link
                      href={`/member/${member.username}`}
                      className="group inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.18em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8be7ff]"
                      style={{ color: accent.strong }}
                    >
                      {copy.openProfile}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.6}
                      />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Frame corner ticks */}
            {(
              [
                "left-4 top-4 border-l border-t",
                "right-4 top-4 border-r border-t",
                "left-4 bottom-4 border-b border-l",
                "right-4 bottom-4 border-b border-r",
              ] as const
            ).map((position) => (
              <i
                key={position}
                aria-hidden="true"
                className={`pointer-events-none absolute h-3 w-3 ${position} ${
                  light ? "border-[#294368]/18" : "border-white/[.12]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

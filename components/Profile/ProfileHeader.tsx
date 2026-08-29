"use client";

import { useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { FileText, Globe, MapPin, Phone } from "lucide-react";
import { GithubMark, LinkedinMark } from "@/components/Profile/BrandIcons";
import type { MemberProfileData } from "@/components/Profile/types";
import { ProfileIdentityFrame } from "@/components/Profile/ProfileIdentityFrame";
import type { ProfileCopy } from "@/components/Profile/copy";

type ProfileHeaderProps = {
  data: MemberProfileData;
  copy: ProfileCopy;
  language: "en" | "fa";
};

const STATUS_TOKENS: Record<string, { dot: string; ring: string; text: string }> = {
  ACTIVE: { dot: "bg-[#6ee5ee]", ring: "shadow-[0_0_0_3px_rgba(110,229,238,.14)]", text: "text-[#9fefff]" },
  INACTIVE: { dot: "bg-white/40", ring: "shadow-[0_0_0_3px_rgba(255,255,255,.08)]", text: "text-white/50" },
  BLOCKED: { dot: "bg-[#ff566f]", ring: "shadow-[0_0_0_3px_rgba(255,86,111,.14)]", text: "text-[#ff9aa8]" },
};

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function MagneticLink({ href, children, external = true }: { href: string; children: React.ReactNode; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!ref.current || event.pointerType === "touch") return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * 0.28, y: y * 0.32, duration: 0.4, ease: "power3.out" });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="group relative inline-flex h-10 items-center gap-2 rounded-full border border-white/[.1] bg-white/[.03] px-3.5 font-mono text-[10px] uppercase tracking-[.15em] text-white/60 outline-none transition-colors duration-300 hover:border-[rgba(var(--accent-a),.4)] hover:text-white focus-visible:border-[rgba(var(--accent-a),.75)] focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent-a),.18)]"
    >
      {children}
    </a>
  );
}

export function ProfileHeader({ data, copy, language }: ProfileHeaderProps) {
  const { user, profile, skills, projects } = data;
  const frameRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const isRTL = language === "fa";

  const displayName = isRTL && profile.fullNameFa ? profile.fullNameFa : profile.fullName;
  const title = isRTL && profile.titleFa ? profile.titleFa : profile.title;
  const bio = isRTL && profile.bioFa ? profile.bioFa : profile.bio;
  const location = isRTL && profile.locationFa ? profile.locationFa : profile.location;
  const currentFocus = isRTL && profile.currentFocusFa ? profile.currentFocusFa : profile.currentFocus;
  const status = STATUS_TOKENS[user.status] ?? STATUS_TOKENS.ACTIVE;

  useLayoutEffect(() => {
    if (!frameRef.current || !coreRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const frame = frameRef.current;
    const core = coreRef.current;

    const moveX = gsap.quickTo(core, "rotationY", { duration: 0.7, ease: "power3.out" });
    const moveY = gsap.quickTo(core, "rotationX", { duration: 0.7, ease: "power3.out" });
    const shiftX = gsap.quickTo(core, "x", { duration: 0.8, ease: "power3.out" });
    const shiftY = gsap.quickTo(core, "y", { duration: 0.8, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = frame.getBoundingClientRect();
      const px = gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width - 0.5) * 2);
      const py = gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height - 0.5) * 2);
      moveX(px * 10);
      moveY(py * -10);
      shiftX(px * 4);
      shiftY(py * 4);
    };

    const handleLeave = () => {
      moveX(0);
      moveY(0);
      shiftX(0);
      shiftY(0);
    };

    frame.addEventListener("pointermove", handleMove);
    frame.addEventListener("pointerleave", handleLeave);
    return () => {
      frame.removeEventListener("pointermove", handleMove);
      frame.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  const joinedYear = new Date(profile ? user.createdAt : user.createdAt).getFullYear();
  const recordId = String(user.id).padStart(4, "0");

  return (
    <div
      data-profile-hero
      data-profile-section
      className={`relative z-10 mx-auto grid w-[min(1180px,calc(100%-40px))] grid-cols-[auto_1fr] items-start gap-[clamp(24px,4vw,56px)] pt-[clamp(120px,14vw,168px)] sm:w-[min(1180px,calc(100%-56px))] max-[760px]:grid-cols-1 max-[760px]:justify-items-center max-[760px]:text-center ${isRTL ? "direction-rtl" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[clamp(60px,10vw,96px)] select-none font-mono text-[clamp(90px,13vw,190px)] font-bold leading-none tracking-[-.04em] text-white/[.035] max-[760px]:hidden"
      >
        №{recordId}
      </div>

      <div
        data-hero-reveal
        ref={frameRef}
        className="relative [perspective:900px]"
        style={{ perspective: "900px" }}
      >
        <ProfileIdentityFrame recordId={recordId} />
        <div
          ref={coreRef}
          className={`relative flex h-[132px] w-[132px] items-center justify-center rounded-[26px] border border-white/[.1] bg-white/[.03] font-mono text-[34px] font-semibold tracking-tight text-white/85 shadow-[0_30px_70px_rgba(0,0,0,.55)] backdrop-blur-sm [transform-style:preserve-3d] max-[520px]:h-[104px] max-[520px]:w-[104px] max-[520px]:text-[26px]`}
        >
          <div className="absolute inset-0 rounded-[26px] opacity-70 [background:radial-gradient(circle_at_30%_20%,rgba(var(--accent-a),.16),transparent_60%)]" />
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt={displayName} className="absolute inset-0 h-full w-full rounded-[26px] object-cover" />
          ) : (
            <span className="relative">{initialsFrom(displayName)}</span>
          )}
          <span
            className={`hero-status-dot absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#050508] ${status.ring}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <div data-hero-reveal className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-white/38 max-[760px]:justify-center">
          <span>{copy.eyebrow}</span>
          <span className="text-white/15">/</span>
          <span>{copy.roleLabel[user.role]}</span>
          <span className="text-white/15">/</span>
          <span className="inline-flex items-center gap-2 text-[rgba(var(--accent-a),.82)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--accent-a),.95)] shadow-[0_0_10px_rgba(var(--accent-a),.6)]" />
            {copy.availabilityLabel[profile.availability]}
          </span>
        </div>

        <h1
          data-hero-reveal
          className="mt-4 text-[clamp(34px,4.6vw,58px)] font-[560] leading-[.96] tracking-[-.03em] text-[#f4f6fb]"
        >
          {displayName}
        </h1>

        <p
          data-hero-reveal
          className="mt-3 font-mono text-[clamp(14px,1.6vw,18px)] font-semibold uppercase tracking-[.13em]"
          style={{
            color: "rgb(var(--accent-a))",
            textShadow: "0 0 22px rgba(var(--accent-a),.32)",
          }}
        >
          {title}
        </p>

        <p data-hero-reveal className="mt-5 max-w-[600px] text-[13.5px] leading-[1.85] text-white/52 max-[760px]:mx-auto">
          {bio}
        </p>

        <div data-hero-reveal className="mt-5 max-w-[680px] rounded-[15px] border border-white/[.07] bg-white/[.018] px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 max-[760px]:justify-center">
            <span className="font-mono text-[8.5px] uppercase tracking-[.17em] text-white/28">{copy.contact.currentFocus}</span>
            <span className="h-1 w-1 rounded-full bg-[rgba(var(--accent-a),.65)] max-[520px]:hidden" />
            {currentFocus.map((focus) => (
              <span key={focus} className="focus-token font-mono text-[9.5px] uppercase tracking-[.13em] text-white/58">
                {focus}
              </span>
            ))}
          </div>
        </div>

        <div
          data-hero-reveal
          className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9.5px] uppercase tracking-[.17em] text-white/38 max-[760px]:justify-center"
        >
          <span>
            {copy.meta.joined} / {joinedYear}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>
            {copy.meta.projects} / {String(projects.length).padStart(2, "0")}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>
            {copy.meta.skills} / {String(skills.length).padStart(2, "0")}
          </span>
          {profile.theme ? (
            <>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>
                {copy.meta.theme} / {profile.theme.slug}
              </span>
            </>
          ) : null}
        </div>

        <div data-hero-reveal className="mt-7 flex flex-wrap items-center gap-2.5 max-[760px]:justify-center">
          {profile.resumeUrl ? (
            <MagneticLink href={profile.resumeUrl}>
              <FileText size={13} strokeWidth={1.75} />
              {copy.contact.resume}
            </MagneticLink>
          ) : null}
          {profile.website ? (
            <MagneticLink href={profile.website}>
              <Globe size={13} strokeWidth={1.75} />
              {copy.contact.website}
            </MagneticLink>
          ) : null}
          {profile.github ? (
            <MagneticLink href={profile.github}>
              <GithubMark size={13} />
              {copy.contact.github}
            </MagneticLink>
          ) : null}
          {profile.linkedin ? (
            <MagneticLink href={profile.linkedin}>
              <LinkedinMark size={13} />
              {copy.contact.linkedin}
            </MagneticLink>
          ) : null}
          {profile.phone ? (
            <MagneticLink href={`tel:${profile.phone.replace(/\s+/g, "")}`} external={false}>
              <Phone size={13} strokeWidth={1.75} />
              {copy.contact.phone}
            </MagneticLink>
          ) : null}
          {location ? (
            <span className="inline-flex h-9 items-center gap-2 rounded-full border border-white/[.08] bg-white/[.015] px-3.5 font-mono text-[10px] uppercase tracking-[.15em] text-white/40">
              <MapPin size={13} strokeWidth={1.75} />
              {location}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

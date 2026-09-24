"use client";

import type { ApiSiteSettings } from "@/lib/api/types";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";

type SiteFooterProps = {
  theme: DevinsoTheme;
  language: DevinsoLanguage;
  /**
   * Site settings from the API. Every field is optional there, so a column
   * renders only when it has something in it — an unfilled panel leaves no
   * labelled-but-empty hole in the layout.
   */
  settings?: ApiSiteSettings | null;
};

const COPY = {
  en: {
    tagline: "Digital Product Studio",
    navTitle: "Navigate",
    work: "Selected work",
    team: "Team members",
    contactTitle: "Contact",
    socialTitle: "Elsewhere",
    cta: "Start a project",
    rights: "All rights reserved.",
    backToTop: "Back to top",
    signature: "DEVINSO / ORIGINAL CONSTRUCTION SYSTEM",
  },
  fa: {
    tagline: "تیم طراحی محصول دیجیتال",
    navTitle: "پیمایش",
    work: "نمونه‌کارها",
    team: "اعضای تیم",
    contactTitle: "تماس",
    socialTitle: "شبکه‌ها",
    cta: "شروع یک پروژه",
    rights: "تمامی حقوق محفوظ است.",
    backToTop: "بازگشت به بالا",
    signature: "DEVINSO / سیستم ساخت اصلی",
  },
} as const;

/** Label per platform key; the order here is the order they render in. */
const SOCIAL_LABELS: Array<[keyof ApiSiteSettings["social"], string]> = [
  ["instagram", "Instagram"],
  ["linkedIn", "LinkedIn"],
  ["gitHub", "GitHub"],
  ["telegram", "Telegram"],
  ["whatsApp", "WhatsApp"],
];

export function SiteFooter({ theme, language, settings }: SiteFooterProps) {
  const light = theme === "light";
  const rtl = language === "fa";
  const copy = COPY[language];

  const name = settings?.identity?.name?.trim() || "DEVINSO";
  const description = settings?.identity?.description?.trim() || copy.tagline;
  const note = settings?.hero?.footerText?.trim();

  const email = settings?.contact?.email?.trim();
  const phone = settings?.contact?.phone?.trim();
  const address = settings?.contact?.address?.trim();
  const hasContact = Boolean(email || phone || address);

  const socials: Array<{ key: string; label: string; url: string }> = [];
  for (const [key, label] of SOCIAL_LABELS) {
    const url = settings?.social?.[key]?.trim();
    if (url) socials.push({ key, label, url });
  }

  const labelClass = `font-mono text-[9px] uppercase tracking-[.26em] ${light ? "text-[#253a5a]/45" : "text-white/32"}`;
  const linkClass = `text-[12.5px] leading-[2.05] transition-colors ${
    light ? "text-[#2b3953]/70 hover:text-[#172238]" : "text-white/55 hover:text-white"
  }`;
  const ruleClass = light ? "border-[#294368]/12" : "border-white/[.08]";

  return (
    <footer
      className={`relative z-10 border-t ${ruleClass} ${light ? "bg-[#eff3f8] text-[#172238]" : "bg-[#050508] text-[#f2f0ec]"} ${rtl ? "[direction:rtl]" : ""}`}
    >
      <div className="mx-auto w-[min(1440px,calc(100%_-_clamp(32px,7vw,112px)))] py-[clamp(48px,6vw,84px)]">
        {/* Flex rather than a fixed grid: columns come and go with the panel
            data, and a grid with empty tracks would leave visible gaps. */}
        <div className="flex flex-wrap justify-between gap-x-[clamp(32px,5vw,96px)] gap-y-[clamp(32px,4vw,52px)]">
          {/* brand */}
          <div className="min-w-[240px] max-w-[340px] flex-1">
            <div className="text-[22px] font-[560] tracking-[-.04em]">{name}</div>
            <p className={`mt-3 text-[12.5px] leading-[1.85] ${light ? "text-[#2b3953]/60" : "text-white/45"}`}>
              {description}
            </p>
            {note && (
              <p className={`mt-4 text-[11.5px] leading-[1.8] ${light ? "text-[#2b3953]/45" : "text-white/30"}`}>
                {note}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-x-[clamp(32px,5vw,90px)] gap-y-[clamp(28px,3vw,44px)]">
            {/* navigation — only anchors that actually exist on the page */}
            <div className="min-w-[130px]">
              <div className={labelClass}>{copy.navTitle}</div>
              <nav className="mt-4 flex flex-col">
                <a href="#work" className={linkClass}>{copy.work}</a>
                <a href="#members" className={linkClass}>{copy.team}</a>
              </nav>
            </div>

            {hasContact && (
              <div className="min-w-[180px] max-w-[280px]">
                <div className={labelClass}>{copy.contactTitle}</div>
                <div className="mt-4 flex flex-col gap-2">
                  {email && (
                    <a href={`mailto:${email}`} className={`block truncate ${linkClass}`} dir="ltr">
                      {email}
                    </a>
                  )}
                  {phone && (
                    <a href={`tel:${phone.replace(/\s+/g, "")}`} className={`block truncate ${linkClass}`} dir="ltr">
                      {phone}
                    </a>
                  )}
                  {address && (
                    <div className={`text-[12.5px] leading-[1.8] ${light ? "text-[#2b3953]/60" : "text-white/45"}`}>
                      {address}
                    </div>
                  )}
                </div>

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className={`mt-5 inline-flex items-center rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[.18em] transition-colors ${
                      light
                        ? "border-[#294368]/20 text-[#172238]/75 hover:border-[#294368]/45 hover:text-[#172238]"
                        : "border-white/15 text-white/70 hover:border-white/35 hover:text-white"
                    }`}
                  >
                    {copy.cta}
                  </a>
                )}
              </div>
            )}

            {socials.length > 0 && (
              <div className="min-w-[130px]">
                <div className={labelClass}>{copy.socialTitle}</div>
                <div className="mt-4 flex flex-col">
                  {socials.map((entry) => (
                    <a
                      key={entry.key}
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={linkClass}
                      dir="ltr"
                    >
                      {entry.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* bottom bar */}
        <div className={`mt-[clamp(36px,4.5vw,64px)] flex items-center justify-between gap-6 border-t pt-6 ${ruleClass} max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4`}>
          <div className={`font-mono text-[10px] uppercase tracking-[.16em] ${light ? "text-[#213550]/40" : "text-white/30"}`}>
            © {new Date().getFullYear()} {name} — {copy.rights}
          </div>

          <div className="flex items-center gap-6">
            <span className={`font-mono text-[9px] uppercase tracking-[.18em] max-[960px]:hidden ${light ? "text-[#213550]/28" : "text-white/18"}`}>
              {copy.signature}
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] transition-colors ${
                light ? "text-[#213550]/45 hover:text-[#172238]" : "text-white/35 hover:text-white"
              }`}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              {copy.backToTop}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

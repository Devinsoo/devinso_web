"use client";

import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { BrandMark } from "@/components/Brand/BrandMark";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";

type SubpageHeaderProps = {
  theme: DevinsoTheme;
  language: DevinsoLanguage;
  onLanguageChange: (language: DevinsoLanguage) => void;
  /** Omit on pages that only ship one theme (the member profile is dark-only). */
  onToggleTheme?: () => void;
  /** Small mono label beside the wordmark, e.g. "PROJECT DETAIL / 01". */
  context?: string;
  backHref: string;
  backLabel: string;
};

const LABELS = {
  en: { language: "Language", theme: "Toggle color theme", home: "DEVINSO home" },
  fa: { language: "زبان", theme: "تغییر تم", home: "صفحه اصلی DEVINSO" },
} as const;

/**
 * The bar shared by the project and member pages: brand home link on the
 * reading-start side, language / theme / back on the other. Direction comes
 * from the page, so it mirrors itself in Persian without any manual flipping.
 */
export function SubpageHeader({ theme, language, onLanguageChange, onToggleTheme, context, backHref, backLabel }: SubpageHeaderProps) {
  const light = theme === "light";
  const labels = LABELS[language];
  const control = light
    ? "border-[#294368]/10 bg-white/55 text-[#17263d]/70 hover:text-[#17263d]"
    : "border-white/[.08] bg-white/[.03] text-white/65 hover:text-white";

  return (
    <header
      className={`project-glass-header sticky top-0 z-[999] border-b ${
        light ? "border-[#294368]/10 bg-[#eef3f8]/70" : "border-white/[.08] bg-[#08090c]/62"
      }`}
    >
      <div className="mx-auto flex h-[68px] w-[min(1440px,calc(100%_-_clamp(28px,6vw,96px)))] items-center justify-between gap-4">
        <Link href="/" aria-label={labels.home} className="studio-mark inline-flex min-w-0 items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#8be7ff]/50">
          <BrandMark light={light} />
          <b lang="en" className="text-[10px] font-[580] uppercase leading-none tracking-[.17em]">DEVINSO</b>
          {context ? (
            <span className={`hidden truncate font-mono text-[8px] uppercase tracking-[.16em] sm:inline ${light ? "text-[#294368]/40" : "text-white/28"}`}>
              {context}
            </span>
          ) : null}
        </Link>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label={labels.language}
            className={`inline-flex h-10 items-center gap-0.5 rounded-full border p-1 ${light ? "border-[#294368]/10 bg-white/55" : "border-white/[.08] bg-white/[.03]"}`}
          >
            {(["en", "fa"] as const).map((code) => {
              const active = code === language;
              return (
                <button
                  key={code}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onLanguageChange(code)}
                  className={`h-8 min-w-9 rounded-full px-2.5 font-mono text-[9px] tracking-[.14em] transition-colors duration-300 ${
                    active
                      ? light
                        ? "bg-[#17263d] text-white"
                        : "bg-white/[.12] text-white"
                      : light
                        ? "text-[#17263d]/55 hover:text-[#17263d]"
                        : "text-white/45 hover:text-white/85"
                  }`}
                >
                  {code === "en" ? "EN" : "فا"}
                </button>
              );
            })}
          </div>

          {onToggleTheme ? (
            <button type="button" onClick={onToggleTheme} aria-label={labels.theme} className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${control}`}>
              {light ? <Moon className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />}
            </button>
          ) : null}

          <Link
            href={backHref}
            className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[9px] font-medium uppercase tracking-[.14em] transition-colors max-sm:px-3 rtl:text-[11px] rtl:tracking-normal ${
              light ? "border-[#294368]/10 bg-[#17263d] text-white" : "border-white/[.1] bg-white/[.075] text-white/80 hover:text-white"
            }`}
          >
            {/* Points back toward the reading start: left in English, right in Persian. */}
            <ArrowLeft className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={1.5} />
            <span className="max-sm:hidden">{backLabel}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

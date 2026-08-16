import type { RefObject } from "react";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";
import type { HeroCopy } from "@/components/Hero/copy";

type HeroHeaderProps = {
  copy: HeroCopy;
  theme: DevinsoTheme;
  language: DevinsoLanguage;
  settingsOpen: boolean;
  settingsRef: RefObject<HTMLDivElement | null>;
  onToggleSettings: () => void;
  onToggleTheme: () => void;
  onLanguageChange: (language: DevinsoLanguage) => void;
};

export function HeroHeader({ copy, theme, language, settingsOpen, settingsRef, onToggleSettings, onToggleTheme, onLanguageChange }: HeroHeaderProps) {
  const light = theme === "light";
  const rtl = language === "fa";

  const navGlass = light
    ? "border-white/70 [background:linear-gradient(180deg,rgba(255,255,255,.58),rgba(255,255,255,.27))] text-[#1f2a41]/60 shadow-[0_14px_34px_rgba(59,75,103,.075),inset_0_1px_0_rgba(255,255,255,.92)]"
    : "border-white/[.06] [background:rgba(8,8,12,.42)] text-white/45 shadow-[0_14px_40px_rgba(0,0,0,.18),inset_0_1px_rgba(255,255,255,.025)]";

  const trigger = light
    ? "border-[#475c80]/10 [background:linear-gradient(180deg,rgba(255,255,255,.68),rgba(255,255,255,.28))] text-[#1d283f]/80 shadow-[inset_0_1px_rgba(255,255,255,.88)] hover:border-[#2791bc]/20 hover:text-[#121d31] hover:shadow-[0_10px_26px_rgba(63,83,115,.09),inset_0_1px_rgba(255,255,255,.95)]"
    : "border-white/[.08] [background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.04))] text-white/85 hover:border-[#6ebcff]/25 hover:text-white hover:shadow-[0_0_24px_rgba(110,188,255,.06),inset_0_1px_rgba(255,255,255,.06)]";

  return (
    <header className="hero-topline absolute left-[clamp(22px,4vw,56px)] right-[clamp(22px,4vw,56px)] top-[clamp(22px,4vw,42px)] z-20 flex items-center justify-between gap-4 max-[760px]:left-4 max-[760px]:right-4 max-[760px]:top-4 max-[540px]:left-3.5 max-[540px]:right-3.5 max-[540px]:min-h-10">
      <div
        className={`studio-mark inline-flex items-center gap-3.5 text-[10px] font-semibold uppercase tracking-[.16em] max-[540px]:gap-2 max-[540px]:text-[9px] max-[540px]:tracking-[.12em] ${
          light
            ? "rounded-full border border-white/80 [background:linear-gradient(180deg,rgba(255,255,255,.78),rgba(255,255,255,.36))] px-3.5 py-2.5 text-[#152238]/90 shadow-[0_18px_36px_rgba(63,80,111,.08),inset_0_1px_0_rgba(255,255,255,.95)] backdrop-blur-2xl"
            : "text-white/95"
        }`}
        data-reveal
      >
        <i className={`h-[7px] w-[7px] shrink-0 rounded-full not-italic ${light ? "bg-[#2397bb] shadow-[0_0_16px_rgba(35,151,187,.32)]" : "bg-[#59e1ee] shadow-[0_0_18px_rgba(89,225,238,.58)]"}`} />
        <b className="font-[580]">DEVINSO</b>
        <span className={`text-[8px] font-normal tracking-[.14em] max-[760px]:hidden ${light ? "text-[#263653]/45" : "text-white/25"}`}>{copy.studioTagline}</span>
      </div>

      <nav
        className={`hero-nav flex items-center gap-[clamp(14px,2vw,24px)] rounded-full border px-4 py-2 text-[10px] uppercase tracking-[.16em] backdrop-blur-2xl transition-colors max-[760px]:gap-3 max-[760px]:text-[9px] max-[540px]:gap-0 max-[540px]:p-[5px] ${navGlass}`}
        data-reveal
        aria-label={copy.nav.aria}
      >
        {[copy.nav.work, copy.nav.studio, copy.nav.contact].map((label, index) => (
          <a
            key={label}
            href={index === 0 ? "#work" : index === 1 ? "#studio" : "#contact"}
            className={`relative transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 max-[540px]:hidden ${
              light ? "hover:text-[#172238] after:bg-[#2397bb]/55" : "hover:text-white/85 after:bg-[#96c3ff]/65"
            }`}
          >
            {label}
          </a>
        ))}

        <div className="settings-shell relative flex items-center" ref={settingsRef}>
          <button
            type="button"
            className={`settings-trigger relative inline-flex min-h-8 items-center gap-2.5 rounded-full border px-3 py-[7px] transition-all duration-300 max-[540px]:min-h-8 max-[540px]:px-2.5 ${trigger}`}
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
            onClick={onToggleSettings}
          >
            <span>{copy.nav.settings}</span>
            <i
              className={`settings-trigger-dot h-[5px] w-[5px] rounded-full not-italic transition-transform duration-300 ${
                light ? "bg-[#2397bb] shadow-[0_0_10px_rgba(35,151,187,.3)]" : "bg-[#6ebcff] shadow-[0_0_10px_rgba(110,188,255,.35)]"
              } ${settingsOpen ? "scale-125" : ""}`}
              aria-hidden="true"
            />
          </button>

          {settingsOpen && (
            <div
              className={`settings-popover absolute right-0 top-[calc(100%_+_12px)] z-40 w-[min(330px,calc(100vw_-_32px))] rounded-[18px] border p-4 normal-case tracking-normal backdrop-blur-[30px] [backdrop-filter:blur(30px)_saturate(145%)] max-[760px]:right-[-2px] max-[760px]:w-[min(310px,calc(100vw_-_28px))] max-[540px]:fixed max-[540px]:right-3.5 max-[540px]:top-[66px] max-[540px]:w-[min(320px,calc(100vw_-_28px))] max-[390px]:right-1.5 max-[390px]:w-[min(304px,calc(100vw_-_12px))] max-[390px]:p-3 ${
                rtl ? "text-right [direction:rtl]" : "text-left [direction:ltr]"
              } ${
                light
                  ? "border-white/80 [background:radial-gradient(circle_at_88%_8%,rgba(38,151,190,.09),transparent_32%),linear-gradient(145deg,rgba(255,255,255,.72),rgba(244,248,253,.43)),rgba(221,229,240,.52)] text-[#182235] shadow-[0_30px_72px_rgba(50,67,96,.16),inset_0_1px_0_rgba(255,255,255,.96)]"
                  : "border-white/[.09] [background:radial-gradient(circle_at_88%_8%,rgba(110,188,255,.09),transparent_34%),linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025)),rgba(8,10,16,.84)] text-white/95 shadow-[0_28px_70px_rgba(0,0,0,.42),0_0_50px_rgba(110,188,255,.05),inset_0_1px_rgba(255,255,255,.06)]"
              }`}
              role="dialog"
              aria-label={copy.settings.displayAria}
            >
              <div className={`settings-popover-head flex items-center justify-between gap-[18px] border-b pb-3.5 ${light ? "border-[#485f89]/10" : "border-white/[.07]"}`}>
                <div className="grid gap-1">
                  <span className={`settings-eyebrow font-mono text-[8px] uppercase tracking-[.16em] ${light ? "text-[#226c9a]/65" : "text-[#6ebcff]/65"}`}>{copy.settings.eyebrow}</span>
                  <strong className="text-[13px] font-[560] tracking-[.015em]">{copy.settings.title}</strong>
                </div>
                <span className={`settings-theme-state rounded-[7px] border px-[7px] py-[5px] font-mono text-[8px] uppercase tracking-[.14em] ${light ? "border-[#2397bb]/15 bg-[#2397bb]/[.06] text-[#226c9a]/75" : "border-[#6ebcff]/15 bg-[#6ebcff]/[.05] text-[#6ebcff]/75"}`}>{theme === "light" ? copy.settings.stateLight : copy.settings.stateDark}</span>
              </div>

              <div className="settings-row flex items-center justify-between gap-[18px] py-[15px] max-[390px]:gap-2">
                <div className="settings-copy grid min-w-0 gap-1">
                  <span className={`text-[11px] ${light ? "text-[#1f2c46]/85" : "text-white/80"}`}>{copy.settings.theme}</span>
                  <small className={`max-w-40 font-mono text-[8px] leading-6 tracking-[.01em] max-[540px]:max-w-[142px] max-[390px]:max-w-[124px] max-[390px]:text-[7px] ${light ? "text-[#2b3953]/45" : "text-white/30"}`}>{copy.settings.themeHint}</small>
                </div>
                <button type="button" className="theme-switch grid cursor-pointer justify-items-end gap-[5px] border-0 bg-transparent p-0" role="switch" aria-checked={theme === "light"} aria-label={copy.settings.theme} onClick={onToggleTheme}>
                  <span className={`theme-switch-track relative h-6 w-11 rounded-full border transition-all duration-300 max-[390px]:w-[42px] ${light ? "border-[#2397bb]/30 [background:linear-gradient(90deg,rgba(35,151,187,.18),rgba(87,111,191,.16))] shadow-[inset_0_1px_rgba(255,255,255,.5),0_0_16px_rgba(35,151,187,.07)]" : "border-white/10 bg-white/[.055] shadow-[inset_0_2px_8px_rgba(0,0,0,.2)]"}`}>
                    <i className={`theme-switch-thumb absolute left-[3px] top-[3px] h-4 w-4 rounded-full transition-transform duration-300 ${light ? "translate-x-5 [background:linear-gradient(145deg,#fffdf5,#ffd991)] shadow-[0_2px_9px_rgba(0,0,0,.22),0_0_14px_rgba(255,205,95,.28)]" : "[background:linear-gradient(145deg,#f8fbff,#9fb9d9)] shadow-[0_2px_8px_rgba(0,0,0,.28),0_0_12px_rgba(110,188,255,.15)]"}`} />
                  </span>
                  <span className={`theme-switch-label text-[8px] uppercase tracking-[.12em] ${light ? "text-[#2b3953]/45" : "text-white/35"}`}>{theme === "light" ? copy.settings.themeLight : copy.settings.themeDark}</span>
                </button>
              </div>

              <div className="settings-row settings-row-language flex items-center justify-between gap-[18px] border-t border-white/[.04] py-[15px] max-[390px]:gap-2">
                <div className="settings-copy grid min-w-0 gap-1">
                  <span className={`text-[11px] ${light ? "text-[#1f2c46]/85" : "text-white/80"}`}>{copy.settings.language}</span>
                  <small className={`max-w-40 font-mono text-[8px] leading-6 tracking-[.01em] max-[540px]:max-w-[142px] ${light ? "text-[#2b3953]/45" : "text-white/30"}`}>{copy.settings.languageHint}</small>
                </div>
                <div className={`language-switch inline-flex items-center gap-1 rounded-xl border p-1 ${light ? "border-white/80 [background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(255,255,255,.28))] shadow-[inset_0_1px_rgba(255,255,255,.96)]" : "border-white/[.08] [background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025))] shadow-[inset_0_1px_rgba(255,255,255,.04)]"}`} role="group" aria-label={copy.settings.language}>
                  {(["en", "fa"] as const).map((code) => {
                    const active = language === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        className={`language-pill h-8 min-w-[42px] rounded-[9px] border-0 px-2.5 font-mono text-[10px] tracking-[.14em] transition-all duration-300 max-[390px]:min-w-[34px] max-[390px]:px-[7px] ${
                          active
                            ? light
                              ? "[background:linear-gradient(135deg,rgba(255,255,255,.9),rgba(192,212,239,.7))] text-[#142138]/90 shadow-[inset_0_1px_rgba(255,255,255,.9),0_8px_18px_rgba(60,80,115,.1)]"
                              : "[background:linear-gradient(135deg,rgba(110,188,255,.22),rgba(255,255,255,.06))] text-white/95 shadow-[inset_0_1px_rgba(255,255,255,.08),0_8px_18px_rgba(0,0,0,.16)]"
                            : light
                              ? "bg-transparent text-[#1f2c44]/55 hover:text-[#18263e]/85"
                              : "bg-transparent text-white/55 hover:text-white/80"
                        }`}
                        aria-pressed={active}
                        onClick={() => onLanguageChange(code)}
                      >
                        {code === "en" ? copy.settings.english : copy.settings.persian}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`settings-theme-preview relative h-[58px] overflow-hidden rounded-xl border max-[540px]:h-12 ${light ? "border-white/75 [background:linear-gradient(rgba(46,66,102,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(46,66,102,.04)_1px,transparent_1px),radial-gradient(circle_at_75%_40%,rgba(35,151,187,.08),transparent_34%),rgba(255,255,255,.28)] [background-size:16px_16px,16px_16px,auto,auto]" : "border-white/[.065] [background:linear-gradient(rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px),radial-gradient(circle_at_75%_40%,rgba(110,188,255,.08),transparent_34%),rgba(255,255,255,.018)] [background-size:16px_16px,16px_16px,auto,auto]"}`} aria-hidden="true">
                <span className={`settings-preview-dot absolute left-[18px] top-[17px] h-1.5 w-1.5 rounded-full ${light ? "bg-[#2397bb] shadow-[0_0_12px_rgba(35,151,187,.28)]" : "bg-[#6ebcff] shadow-[0_0_12px_rgba(110,188,255,.38)]"}`} />
                <span className={`settings-preview-line settings-preview-line-a absolute left-[34px] top-[19px] h-px w-[88px] rounded-full ${light ? "bg-[#304564]/20" : "bg-white/20"}`} />
                <span className={`settings-preview-line settings-preview-line-b absolute left-[34px] top-[31px] h-px w-[54px] rounded-full opacity-60 ${light ? "bg-[#304564]/20" : "bg-white/20"}`} />
                <span className={`settings-preview-glow absolute right-[18px] top-1/2 h-[72px] w-[72px] -translate-y-1/2 rounded-full blur-lg ${light ? "[background:radial-gradient(circle,rgba(35,151,187,.13),transparent_66%)]" : "[background:radial-gradient(circle,rgba(110,188,255,.13),transparent_66%)]"}`} />
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

import type { ReactNode } from "react";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";
import { ENTRY_COPY } from "@/components/Entry/copy";

type EntryGateProps = {
  theme: DevinsoTheme;
  language: DevinsoLanguage;
  onThemeChange: (theme: DevinsoTheme) => void;
  onLanguageChange: (language: DevinsoLanguage) => void;
  onEnter: () => void;
  onUseSystem: () => void;
};

function Choice({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 flex-1 rounded-xl border px-4 text-[11px] font-medium tracking-[.08em] transition-all duration-200 ${
        active
          ? "border-white/20 bg-white/10 text-white shadow-[inset_0_1px_rgba(255,255,255,.08)]"
          : "border-white/7 bg-white/[.025] text-white/45 hover:border-white/14 hover:bg-white/[.05] hover:text-white/75"
      }`}
    >
      {children}
    </button>
  );
}

export function EntryGate({ theme, language, onThemeChange, onLanguageChange, onEnter, onUseSystem }: EntryGateProps) {
  const copy = ENTRY_COPY[language];
  const light = theme === "light";

  return (
    <main
      data-theme={theme}
      data-language={language}
      className={`relative grid min-h-svh place-items-center overflow-hidden px-5 py-10 transition-colors duration-300 ${light ? "bg-[#eef2f7] text-[#10131a]" : "bg-[#06070a] text-white"}`}
    >
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 opacity-40 [background-size:56px_56px] ${light ? "[background-image:linear-gradient(rgba(15,23,42,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.05)_1px,transparent_1px)]" : "[background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)]"}`} />
      <div aria-hidden="true" className="pointer-events-none absolute left-[12%] top-[18%] h-72 w-72 rounded-full bg-sky-400/10 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[8%] right-[12%] h-80 w-80 rounded-full bg-violet-400/10 blur-[120px]" />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-title"
        dir={language === "fa" ? "rtl" : "ltr"}
        className={`relative z-10 w-full max-w-[560px] overflow-hidden rounded-[28px] border p-1 shadow-2xl backdrop-blur-2xl ${light ? "border-black/10 bg-white/60 shadow-black/10" : "border-white/10 bg-white/[.035] shadow-black/40"}`}
      >
        <div className={`rounded-[24px] border p-6 sm:p-8 ${light ? "border-white/80 bg-white/55" : "border-white/[.055] bg-black/20"}`}>
          <header className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[.2em]">
              <span className={`h-2 w-2 rounded-full ${light ? "bg-sky-500 shadow-[0_0_18px_rgba(14,165,233,.4)]" : "bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,.5)]"}`} />
              <span>DEVINSO</span>
            </div>
            <span className={`rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[.18em] ${light ? "border-black/8 bg-black/[.025] text-black/45" : "border-white/8 bg-white/[.035] text-white/40"}`}>{copy.eyebrow}</span>
          </header>

          <div className={language === "fa" ? "text-right" : "text-left"}>
            <h1 id="entry-title" className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.title}</h1>
            <p className={`mt-3 max-w-[470px] text-sm leading-7 ${light ? "text-black/50" : "text-white/45"}`}>{copy.description}</p>
          </div>

          <div className="mt-8 grid gap-6">
            <div>
              <span className={`mb-2.5 block text-[10px] font-medium uppercase tracking-[.16em] ${light ? "text-black/40" : "text-white/35"}`}>{copy.language}</span>
              <div className="flex gap-2" dir="ltr">
                <Choice active={language === "en"} onClick={() => onLanguageChange("en")}>English</Choice>
                <Choice active={language === "fa"} onClick={() => onLanguageChange("fa")}>فارسی</Choice>
              </div>
            </div>
            <div>
              <span className={`mb-2.5 block text-[10px] font-medium uppercase tracking-[.16em] ${light ? "text-black/40" : "text-white/35"}`}>{copy.theme}</span>
              <div className="flex gap-2">
                <Choice active={theme === "dark"} onClick={() => onThemeChange("dark")}>{copy.dark}</Choice>
                <Choice active={theme === "light"} onClick={() => onThemeChange("light")}>{copy.light}</Choice>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={onUseSystem} className={`min-h-12 rounded-xl border px-4 text-[11px] font-medium transition ${light ? "border-black/10 bg-black/[.025] text-black/55 hover:bg-black/[.05]" : "border-white/8 bg-white/[.025] text-white/48 hover:bg-white/[.05]"}`}>{copy.system}</button>
            <button type="button" onClick={onEnter} className={`min-h-12 rounded-xl border px-4 text-[11px] font-semibold transition hover:-translate-y-0.5 ${light ? "border-black/10 bg-[#111827] text-white shadow-lg shadow-black/10" : "border-white/60 bg-white text-black shadow-lg shadow-white/5"}`}>{copy.enter}</button>
          </div>
          <p className={`mt-4 text-center text-[9px] tracking-[.08em] ${light ? "text-black/35" : "text-white/25"}`}>{copy.saved}</p>
        </div>
      </section>
    </main>
  );
}

import type { HeroCopy } from "@/components/Hero/copy";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";

type HeroFooterProps = {
  copy: HeroCopy;
  theme: DevinsoTheme;
  language: DevinsoLanguage;
};

export function HeroFooter({ copy, theme, language }: HeroFooterProps) {
  const light = theme === "light";
  const rtl = language === "fa";

  return (
    <footer className="hero-footer absolute bottom-[clamp(20px,3vw,34px)] left-[clamp(22px,4vw,56px)] right-[clamp(22px,4vw,56px)] z-20 flex items-center justify-between max-[760px]:left-4 max-[760px]:right-4 max-[540px]:relative max-[540px]:bottom-auto max-[540px]:left-auto max-[540px]:right-auto max-[540px]:mx-auto max-[540px]:mt-[30px] max-[540px]:min-h-[22px] max-[540px]:w-[calc(100%_-_28px)] max-[390px]:mt-7">
      <div
        className={`scroll-cue flex items-center gap-2.5 text-[10px] uppercase tracking-[.16em] max-[540px]:ml-auto max-[540px]:text-[7.5px] max-[540px]:tracking-[.1em] ${
          rtl ? "max-[540px]:[direction:ltr]" : ""
        } ${light ? "text-[#273551]/35" : "text-white/35"}`}
        data-reveal
      >
        <span>{copy.stage.scroll}</span>
        <i className={`relative h-px w-10 overflow-hidden not-italic ${light ? "bg-[#2f4666]/10" : "bg-white/10"}`}>
          <b className={`scroll-cue-flow absolute inset-0 block translate-x-[-100%] ${light ? "[background:linear-gradient(90deg,#2397bb,#5770bf)] shadow-[0_0_12px_rgba(35,151,187,.18)]" : "[background:linear-gradient(90deg,#59e1ee,#7187ff)] shadow-[0_0_14px_rgba(113,135,255,.35)]"}`} />
        </i>
      </div>
      <div className={`hero-footer-tag text-[10px] uppercase tracking-[.16em] max-[760px]:hidden max-[540px]:hidden ${light ? "text-[#273551]/25" : "text-white/20"}`} data-reveal>{copy.stage.footerTag}</div>
    </footer>
  );
}

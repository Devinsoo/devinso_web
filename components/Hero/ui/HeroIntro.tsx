import type { HeroCopy } from "@/components/Hero/copy";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";

type HeroIntroProps = {
  copy: HeroCopy;
  theme: DevinsoTheme;
  language: DevinsoLanguage;
};

export function HeroIntro({ copy, theme, language }: HeroIntroProps) {
  const light = theme === "light";
  const rtl = language === "fa";

  return (
    <div
      className={`hero-copy relative z-30 min-w-0 pt-[clamp(70px,9vh,110px)] max-[960px]:mx-auto max-[960px]:w-[min(680px,100%)] max-[960px]:pt-0 max-[960px]:text-center max-[540px]:mx-auto max-[540px]:w-[min(100%,370px)] max-[540px]:p-0 max-[390px]:w-[min(100%,344px)] ${
        rtl ? "min-[961px]:order-2 min-[961px]:text-right [direction:rtl]" : "min-[961px]:order-1 [direction:ltr]"
      }`}
    >
      <h1
        className={`hero-title relative z-[1] m-0 w-max max-w-none overflow-visible whitespace-nowrap text-[clamp(64px,8.8vw,132px)] font-[560] leading-[.9] tracking-[-.08em] [direction:ltr] [unicode-bidi:isolate] max-[1240px]:text-[clamp(58px,7.2vw,94px)] max-[960px]:mx-auto max-[540px]:block max-[540px]:w-full max-[540px]:max-w-full max-[540px]:text-center max-[540px]:text-[clamp(50px,14.7vw,60px)] max-[540px]:leading-[.98] max-[540px]:tracking-[-.055em] max-[390px]:text-[clamp(47px,14.2vw,55px)] ${
          rtl ? "min-[961px]:ml-auto min-[961px]:mr-0" : ""
        } ${
          light
            ? "[filter:drop-shadow(0_12px_28px_rgba(61,79,111,.075))]"
            : "[filter:drop-shadow(0_10px_28px_rgba(113,135,255,.08))]"
        }`}
        data-reveal
      >
        <span
          className={`inline-block overflow-visible bg-clip-text pr-[.08em] mr-[-.08em] text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] ${
            light
              ? "bg-[linear-gradient(115deg,#172238_0%,#293d66_42%,#4d6fa9_72%,#6c5fa3_100%)]"
              : "bg-[linear-gradient(116deg,#fff_0%,#f0f3ff_35%,#96c3ff_72%,#c6b4ff_100%)]"
          }`}
        >
          DEVINSO
        </span>
      </h1>

      <p
        className={`hero-subtitle mt-[18px] max-w-full whitespace-nowrap text-[clamp(11px,1.15vw,17px)] uppercase leading-[1.35] tracking-[.12em] max-[960px]:mx-auto max-[720px]:text-[clamp(9px,2.55vw,12px)] max-[720px]:tracking-[.08em] max-[540px]:mt-3 max-[540px]:max-w-[350px] max-[540px]:whitespace-normal max-[540px]:text-[11px] max-[540px]:leading-[1.55] max-[540px]:tracking-[.07em] max-[540px]:[text-wrap:balance] max-[390px]:text-[10px] ${
          rtl ? "[direction:rtl]" : "[direction:ltr]"
        } ${light ? "text-[#1e2a42]/80" : "text-white/85"}`}
        data-reveal
      >
        {copy.stage.subtitle}
      </p>

      <p
        className={`hero-description mt-[26px] max-w-[440px] text-[12.5px] leading-[1.85] max-[1240px]:max-w-[390px] max-[960px]:mx-auto max-[960px]:max-w-[560px] max-[540px]:mt-[18px] max-[540px]:w-[min(100%,350px)] max-[540px]:text-center max-[540px]:text-xs max-[540px]:leading-[1.85] max-[390px]:w-[min(100%,330px)] max-[390px]:text-[11.5px] ${
          rtl ? "[direction:rtl]" : "[direction:ltr]"
        } ${light ? "text-[#2b3953]/60" : "text-[#e1e4ef]/50"}`}
        data-reveal
      >
        {copy.stage.description}
      </p>

      <div
        className={`hero-actions mt-[30px] flex items-center gap-2.5 max-[960px]:justify-center max-[540px]:mx-auto max-[540px]:mt-[22px] max-[540px]:grid max-[540px]:w-[min(100%,350px)] max-[540px]:grid-cols-2 max-[390px]:w-[min(100%,330px)] max-[390px]:gap-2 ${rtl ? "max-[540px]:[direction:ltr]" : ""}`}
        data-reveal
      >
        <a
          className={`hero-action hero-action-primary inline-flex min-h-[42px] items-center justify-center gap-2.5 rounded-xl border px-4 text-[11px] font-[650] tracking-[.04em] transition-all duration-300 hover:-translate-y-0.5 max-[540px]:min-h-12 max-[540px]:w-full max-[540px]:min-w-0 max-[540px]:px-3 max-[540px]:text-[10.5px] max-[390px]:min-h-[46px] max-[390px]:text-[10px] ${
            rtl ? "[direction:rtl]" : ""
          } ${
            light
              ? "border-[#324c7c]/20 [background:linear-gradient(135deg,rgba(30,43,69,.98),rgba(61,85,136,.95)_58%,rgba(91,77,151,.92))] text-white shadow-[0_14px_34px_rgba(50,70,113,.20),inset_0_1px_rgba(255,255,255,.23)] hover:shadow-[0_18px_38px_rgba(50,70,113,.25)]"
              : "border-white/75 [background:linear-gradient(135deg,#f8fbff_0%,#cedcff_55%,#c9baff_100%)] text-[#090a0e] shadow-[0_10px_30px_rgba(113,135,255,.16),inset_0_1px_rgba(255,255,255,.75)] hover:shadow-[0_14px_34px_rgba(113,135,255,.26),inset_0_1px_rgba(255,255,255,.8)]"
          }`}
          href="#work"
        >
          <span>{copy.stage.primaryAction}</span>
          <i className="text-sm not-italic" aria-hidden="true">↗</i>
        </a>

        <a
          className={`hero-action hero-action-ghost inline-flex min-h-[42px] items-center justify-center gap-2.5 rounded-xl border px-4 text-[11px] tracking-[.04em] transition-all duration-300 hover:-translate-y-0.5 max-[540px]:min-h-12 max-[540px]:w-full max-[540px]:min-w-0 max-[540px]:px-3 max-[540px]:text-[10.5px] max-[390px]:min-h-[46px] max-[390px]:text-[10px] ${
            rtl ? "[direction:rtl]" : ""
          } ${
            light
              ? "border-white/75 [background:linear-gradient(180deg,rgba(255,255,255,.58),rgba(255,255,255,.24))] text-[#1f2c46]/70 shadow-[inset_0_1px_rgba(255,255,255,.94),0_10px_24px_rgba(63,81,111,.05)] backdrop-blur-xl hover:text-[#18263e]"
              : "border-white/[.08] bg-white/[.025] text-white/60 hover:border-[#96c3ff]/25 hover:bg-[#7187ff]/[.05] hover:text-white/90"
          }`}
          href="#contact"
        >
          {copy.stage.secondaryAction}
        </a>
      </div>

      <div
        className={`hero-services mt-5 flex items-center gap-2.5 text-[9px] uppercase tracking-[.15em] max-[960px]:justify-center max-[540px]:hidden ${light ? "text-[#2b3953]/35" : "text-white/25"}`}
        data-reveal
        aria-label={copy.stage.capabilitiesAria}
      >
        {copy.stage.services.flatMap((service, index) => [
          index > 0 ? <i className={`h-[3px] w-[3px] rounded-full not-italic ${light ? "bg-[#2397bb]/45 shadow-[0_0_8px_rgba(35,151,187,.18)]" : "bg-[#96c3ff]/45 shadow-[0_0_10px_rgba(150,195,255,.28)]"}`} key={`divider-${service}`} /> : null,
          <span key={service}>{service}</span>,
        ])}
      </div>

      <div
        className={`hero-meta mt-[22px] grid gap-3.5 border-t pt-[18px] max-[960px]:mx-auto max-[960px]:w-[min(560px,100%)] max-[960px]:justify-items-center max-[540px]:mt-[18px] max-[540px]:w-[min(100%,350px)] max-[540px]:gap-0 max-[540px]:pt-3.5 max-[390px]:w-[min(100%,330px)] ${
          rtl ? "[direction:rtl]" : ""
        } ${light ? "border-[#344963]/10" : "border-white/[.055]"}`}
        data-reveal
      >
        <div className={`build-status inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[.16em] max-[540px]:tracking-[.11em] ${light ? "text-[#2b3953]/50" : "text-white/35"}`}>
          <span className={`hero-status-dot h-[7px] w-[7px] rounded-full ${light ? "bg-[#2397bb] shadow-[0_0_8px_rgba(35,151,187,.72),0_0_22px_rgba(35,151,187,.24)]" : "bg-[#59e1ee] shadow-[0_0_8px_rgba(89,225,238,.85),0_0_24px_rgba(89,225,238,.3)]"}`} />
          {copy.stage.buildStatus}
        </div>
        <div className={`hero-coords text-[10px] uppercase tracking-[.16em] max-[540px]:hidden ${light ? "text-[#2b3953]/25" : "text-white/20"}`}>{copy.stage.coords}</div>
      </div>
    </div>
  );
}

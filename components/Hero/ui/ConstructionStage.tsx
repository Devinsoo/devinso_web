import type { CSSProperties, RefObject } from "react";
import type { HeroCopy } from "@/components/Hero/copy";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";
import {
  CONSTRUCTION_SETTINGS,
  GRID_CENTER_X,
  GRID_CENTER_Y,
  GRID_LINES,
  LOGO_PATH_A,
  LOGO_PATH_B,
} from "@/components/Hero/construction";

type ConstructionStageProps = {
  copy: HeroCopy;
  theme: DevinsoTheme;
  language: DevinsoLanguage;
  stageRef: RefObject<HTMLDivElement | null>;
  coreRef: RefObject<HTMLDivElement | null>;
  logoDirectionalLightRef: RefObject<SVGLinearGradientElement | null>;
  logoReflectionRef: RefObject<SVGLinearGradientElement | null>;
  logoFresnelRef: RefObject<SVGLinearGradientElement | null>;
};

const technicalLine = "fill-none [vector-effect:non-scaling-stroke] [stroke-linecap:round]";
const mono = "font-mono";

export function ConstructionStage({
  copy,
  theme,
  language,
  stageRef,
  coreRef,
  logoDirectionalLightRef,
  logoReflectionRef,
  logoFresnelRef,
}: ConstructionStageProps) {
  const light = theme === "light";
  const rtl = language === "fa";
  const logoTransform = `translate(${CONSTRUCTION_SETTINGS.logo.x} ${CONSTRUCTION_SETTINGS.logo.y}) scale(${CONSTRUCTION_SETTINGS.logo.scale}) translate(-498.28 -285.13)`;
  const logoDepthTransform = `translate(${CONSTRUCTION_SETTINGS.logo.x + CONSTRUCTION_SETTINGS.depth.logoShadowX} ${CONSTRUCTION_SETTINGS.logo.y + CONSTRUCTION_SETTINGS.depth.logoShadowY}) scale(${CONSTRUCTION_SETTINGS.logo.scale}) translate(-498.28 -285.13)`;
  const gridTransform = `translate(${CONSTRUCTION_SETTINGS.grid.x} ${CONSTRUCTION_SETTINGS.grid.y}) translate(${GRID_CENTER_X} ${GRID_CENTER_Y}) scale(${CONSTRUCTION_SETTINGS.grid.scale}) translate(${-GRID_CENTER_X} ${-GRID_CENTER_Y})`;
  const constructionStyle = {
    "--construction-width": `${CONSTRUCTION_SETTINGS.compositionWidth}px`,
    "--logo-glass-opacity": CONSTRUCTION_SETTINGS.material.glassOpacity,
    "--logo-glass-edge-opacity": CONSTRUCTION_SETTINGS.material.edgeOpacity,
    "--logo-directional-light-opacity": CONSTRUCTION_SETTINGS.material.lightOpacity,
    "--logo-reflection-opacity": CONSTRUCTION_SETTINGS.material.reflectionOpacity,
  } as CSSProperties;

  const panelClass = `code-panel absolute grid gap-2 rounded-[14px] border px-4 py-3.5 font-mono backdrop-blur-xl [will-change:transform] max-[720px]:rounded-xl max-[720px]:p-3 ${
    light
      ? "border-white/75 [background:linear-gradient(145deg,rgba(74,120,199,.055),transparent_48%),linear-gradient(180deg,rgba(255,255,255,.54),rgba(255,255,255,.22)),rgba(215,225,239,.24)] shadow-[0_24px_54px_rgba(53,70,100,.105),inset_0_1px_rgba(255,255,255,.96)]"
      : "border-[#96c3ff]/10 [background:linear-gradient(145deg,rgba(113,135,255,.045),transparent_46%),linear-gradient(180deg,rgba(255,255,255,.042),rgba(255,255,255,.012)),rgba(8,9,14,.48)] shadow-[0_26px_54px_rgba(0,0,0,.3),0_0_36px_rgba(113,135,255,.035),inset_0_1px_rgba(255,255,255,.035)]"
  }`;

  const lineClass = `code-line relative z-[1] grid grid-cols-[20px_1fr] items-start gap-2.5 text-[11px] leading-[1.5] max-[720px]:grid-cols-[16px_1fr] max-[720px]:gap-[7px] max-[720px]:text-[10px] max-[540px]:grid-cols-[18px_minmax(0,1fr)] max-[540px]:gap-2 max-[540px]:text-[9.5px] max-[540px]:leading-[1.7] ${light ? "text-[#26344f]/50" : "text-[#e1e6f2]/35"}`;

  const gridLineClass = `${technicalLine} construction-grid-line [stroke-width:1] ${light ? "stroke-[rgba(52,70,103,.30)] [filter:drop-shadow(0_0_5px_rgba(47,106,157,.035))]" : "stroke-[rgba(197,210,234,.34)] [filter:drop-shadow(0_0_6px_rgba(255,255,255,.04))]"}`;
  const primaryGridClass = light ? "construction-grid-primary stroke-[rgba(29,120,169,.46)] [stroke-width:1.05]" : "construction-grid-primary stroke-[rgba(150,195,255,.48)] [stroke-width:1.05]";
  const formationLineClass = `${technicalLine} formation-line [stroke-width:1.15] ${light ? "stroke-[rgba(25,132,179,.46)] [filter:drop-shadow(0_0_6px_rgba(31,137,182,.10))]" : "stroke-[rgba(150,195,255,.64)] [filter:drop-shadow(0_0_7px_rgba(113,135,255,.28))]"}`;
  const noteClass = `formation-note formation-caption absolute grid gap-[5px] rounded-xl border px-3.5 py-3 text-[10px] uppercase tracking-[.16em] opacity-0 backdrop-blur-xl [transform:translateY(12px)_translateZ(38px)] [will-change:transform] ${
    rtl ? "[direction:rtl] text-right" : "[direction:ltr] text-left"
  } ${
    light
      ? "border-white/75 [background:linear-gradient(145deg,rgba(76,121,194,.055),transparent_58%),linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.22)),rgba(217,227,240,.24)] text-[#2a3954]/50 shadow-[0_18px_40px_rgba(55,73,103,.10),inset_0_1px_rgba(255,255,255,.96)]"
      : "border-[#96c3ff]/10 [background:linear-gradient(145deg,rgba(113,135,255,.07),transparent_58%),rgba(12,13,19,.62)] text-white/35 shadow-[0_20px_42px_rgba(0,0,0,.3),0_0_30px_rgba(113,135,255,.035)]"
  } max-[540px]:hidden`;

  return (
    <div
      ref={stageRef}
      className={`hero-logo-stage relative z-10 grid min-h-[620px] ${rtl ? "min-[961px]:order-1" : "min-[961px]:order-2"} min-w-0 place-items-center [perspective:1600px] [isolation:isolate] max-[1240px]:min-h-[560px] max-[960px]:w-full max-[960px]:min-h-[clamp(480px,64vw,560px)] max-[540px]:mt-3 max-[540px]:flex max-[540px]:min-h-0 max-[540px]:flex-col max-[540px]:items-center max-[540px]:justify-start max-[540px]:gap-4 max-[540px]:overflow-visible max-[540px]:[perspective:none] max-[390px]:mt-2.5 max-[390px]:gap-3.5`}
      data-reveal
    >
      {light && (
        <>
          <div className="hero-light-mesh pointer-events-none absolute inset-0 z-0 overflow-hidden max-[720px]:opacity-70" aria-hidden="true">
            <span className="hero-light-mesh-blob hero-light-mesh-blob-a absolute left-[12%] top-[20%] h-[340px] w-[340px] rounded-full [background:radial-gradient(circle_at_32%_30%,rgba(255,255,255,.88),rgba(89,152,231,.26)_42%,transparent_75%)] opacity-[.78] blur-xl motion-safe:animate-pulse" />
            <span className="hero-light-mesh-blob hero-light-mesh-blob-b absolute right-[8%] top-[10%] h-[410px] w-[410px] rounded-full [background:radial-gradient(circle_at_44%_32%,rgba(255,255,255,.8),rgba(116,102,214,.22)_42%,transparent_76%)] opacity-[.7] blur-xl motion-safe:animate-pulse max-[720px]:hidden" />
            <span className="hero-light-mesh-blob hero-light-mesh-blob-c absolute bottom-[6%] left-[36%] h-[300px] w-[300px] rounded-full [background:radial-gradient(circle_at_42%_38%,rgba(255,255,255,.78),rgba(31,166,197,.18)_40%,transparent_74%)] opacity-[.68] blur-xl motion-safe:animate-pulse" />
          </div>

          <div className="hero-light-crystal-shell pointer-events-none absolute inset-0 z-[1] grid place-items-center max-[540px]:hidden" aria-hidden="true">
            <span className="hero-light-crystal-shell-inner absolute aspect-square w-[min(620px,78%)] rotate-[-11deg] translate-y-[-10px] rounded-[30%] border border-white/50 [background:linear-gradient(145deg,rgba(255,255,255,.48),rgba(255,255,255,.08)_34%,rgba(126,168,228,.07)_66%,rgba(255,255,255,.18)),radial-gradient(circle_at_50%_50%,rgba(255,255,255,.26),transparent_60%)] opacity-90 shadow-[0_24px_64px_rgba(69,88,122,.12),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-lg" />
            <span className="hero-light-crystal-shell-edge absolute aspect-square w-[min(690px,85%)] rotate-[7deg] rounded-[32%] border border-[#7190cf]/15 [background:conic-gradient(from_180deg,transparent_0_26%,rgba(84,126,221,.08)_35%,transparent_48%_64%,rgba(124,100,212,.07)_74%,transparent_88%)] opacity-[.78] shadow-[0_0_80px_rgba(89,129,208,.10),inset_0_0_54px_rgba(255,255,255,.12)] max-[720px]:opacity-50" />
          </div>

          <div className="hero-light-caustics pointer-events-none absolute inset-0 z-[2] overflow-hidden mix-blend-screen max-[720px]:hidden" aria-hidden="true">
            <span className="hero-light-caustic hero-light-caustic-a absolute left-[20%] top-[34%] h-[2px] w-[420px] rotate-[-16deg] rounded-full [background:linear-gradient(90deg,transparent,rgba(255,255,255,.8),rgba(114,176,230,.55),transparent)] opacity-[.58] blur-lg" />
            <span className="hero-light-caustic hero-light-caustic-b absolute right-[17%] top-[44%] h-[2px] w-[380px] rotate-[19deg] rounded-full [background:linear-gradient(90deg,transparent,rgba(255,255,255,.8),rgba(114,176,230,.55),transparent)] opacity-[.5] blur-lg" />
            <span className="hero-light-caustic hero-light-caustic-c absolute bottom-[24%] left-[38%] h-[2px] w-[300px] rotate-[-6deg] rounded-full [background:linear-gradient(90deg,transparent,rgba(255,255,255,.8),rgba(114,176,230,.55),transparent)] opacity-[.48] blur-lg" />
          </div>
        </>
      )}

      <div className="construction-dial pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[min(40vw,470px)] -translate-x-1/2 -translate-y-1/2 opacity-[.28] [will-change:transform,opacity] max-[940px]:w-[min(50vw,420px)] max-[720px]:w-[min(58vw,360px)] max-[720px]:opacity-[.22] max-[540px]:top-[118px] max-[540px]:w-[min(104vw,420px)] max-[540px]:opacity-[.62] max-[390px]:top-28 max-[390px]:w-[min(106vw,400px)]" aria-hidden="true">
        <svg className="construction-dial-svg h-full w-full overflow-visible [filter:drop-shadow(0_0_34px_rgba(110,188,255,.05))]" viewBox="0 0 640 640">
          <circle cx="320" cy="320" r="214" className={`${technicalLine} dial-ring dial-ring-outer [stroke-width:1] ${light ? "stroke-[rgba(46,66,99,.105)]" : "stroke-[rgba(255,255,255,.07)]"}`} />
          <circle cx="320" cy="320" r="184" className={`${technicalLine} dial-ring dial-ring-mid hidden`} />
          <circle cx="320" cy="320" r="146" className={`${technicalLine} dial-ring dial-ring-inner [stroke-width:1] ${light ? "stroke-[rgba(46,66,99,.072)]" : "stroke-[rgba(255,255,255,.045)]"}`} />
          <circle cx="320" cy="320" r="110" className={`${technicalLine} dial-ring dial-ring-core [stroke-width:1] ${light ? "stroke-[rgba(26,132,177,.13)]" : "stroke-[rgba(110,188,255,.065)]"}`} />
          <g className="dial-crosshair">
            <line x1="320" y1="86" x2="320" y2="554" className={`${technicalLine} dial-crosshair-line [stroke-width:1] ${light ? "stroke-[rgba(50,69,101,.055)]" : "stroke-[rgba(255,255,255,.03)]"}`} />
            <line x1="86" y1="320" x2="554" y2="320" className={`${technicalLine} dial-crosshair-line [stroke-width:1] ${light ? "stroke-[rgba(50,69,101,.055)]" : "stroke-[rgba(255,255,255,.03)]"}`} />
          </g>
          <g className="dial-rotor dial-rotor-slow hidden"><path d="M320 106 A214 214 0 0 1 488 186" /><path d="M154 188 A214 214 0 0 1 320 106" /><path d="M454 488 A196 196 0 0 1 238 486" /></g>
          <g className="dial-rotor dial-rotor-reverse hidden"><path d="M438 206 A166 166 0 0 1 498 320" /><path d="M204 432 A156 156 0 0 1 144 320" /></g>
          <g className="dial-guides hidden"><path d="M220 176 L270 176" /><path d="M370 176 L420 176" /><path d="M176 220 L176 270" /><path d="M464 370 L464 420" /></g>
          <text x="428" y="144" className="dial-label hidden">{copy.dial.title}</text>
          <text x="410" y="520" className="dial-label dial-label-soft hidden">{copy.dial.subtitle}</text>
        </svg>
      </div>

      <div className="code-atmosphere pointer-events-none absolute inset-0 z-[1] min-w-0 max-[540px]:relative max-[540px]:order-2 max-[540px]:inset-auto max-[540px]:h-auto max-[540px]:w-full">
        <div className={`${panelClass} code-panel-left left-[-2%] top-[13%] w-[min(310px,34vw)] max-[1240px]:w-[min(245px,25vw)] max-[960px]:left-[3%] max-[960px]:top-[7%] max-[960px]:w-[min(250px,38vw)] max-[540px]:relative max-[540px]:left-auto max-[540px]:top-auto max-[540px]:mx-auto max-[540px]:w-[min(100%,350px)] max-[540px]:max-w-none max-[540px]:rounded-2xl max-[540px]:px-4 max-[540px]:py-[15px] max-[540px]:[transform:none] max-[390px]:w-[min(100%,330px)] max-[390px]:p-3.5`}>
          <span className={`code-panel-label mb-0 text-[8px] uppercase tracking-[.16em] max-[540px]:mb-[7px] max-[540px]:tracking-[.12em] ${light ? "text-[#226c9a]/65" : "text-[#96c3ff]/45"}`}>{copy.code.leftLabel}</span>
          {copy.code.leftLines.map((line, index) => (
            <div className={lineClass} key={`left-${index}`}>
              <i className={`not-italic ${light ? "text-[#1f789f]/60" : "text-[#59e1ee]/65"}`}>{String(index + 1).padStart(2, "0")}</i>
              <span>{line}</span>
            </div>
          ))}
        </div>

        <div className={`${panelClass} code-panel-right right-[-1%] top-[20%] w-[min(310px,34vw)] max-[1240px]:w-[min(245px,25vw)] max-[960px]:right-[2%] max-[960px]:top-[12%] max-[960px]:w-[min(250px,38vw)] max-[540px]:hidden`}>
          <span className={`code-panel-label text-[8px] uppercase tracking-[.16em] ${light ? "text-[#226c9a]/65" : "text-[#96c3ff]/45"}`}>{copy.code.rightLabel}</span>
          {copy.code.rightLines.map((line, index) => (
            <div className={lineClass} key={`right-${index}`}>
              <i className={`not-italic ${light ? "text-[#1f789f]/60" : "text-[#59e1ee]/65"}`}>{String(index + 6).padStart(2, "0")}</i>
              <span>{line}</span>
            </div>
          ))}
        </div>

        <div className={`${panelClass} code-panel-bottom bottom-[7%] left-[12%] w-[min(420px,44vw)] max-[1240px]:w-[min(350px,37vw)] max-[960px]:bottom-[5%] max-[960px]:left-[10%] max-[960px]:w-[min(360px,52vw)] max-[540px]:hidden`}>
          <span className={`code-panel-label text-[8px] uppercase tracking-[.16em] ${light ? "text-[#226c9a]/65" : "text-[#96c3ff]/45"}`}>{copy.code.bottomLabel}</span>
          {copy.code.bottomLines.map(([marker, line], index) => (
            <div className={lineClass} key={`bottom-${index}`}>
              <i className={`not-italic ${light ? "text-[#1f789f]/60" : "text-[#59e1ee]/65"}`}>{marker}</i>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={coreRef}
        className="hero-core hero-core-construction relative z-[2] grid aspect-[1285.46/807.55] w-[min(var(--construction-width),100%)] min-w-0 place-items-center [transform-origin:50%_50%] [transform-style:preserve-3d] [will-change:transform] max-[1240px]:w-[min(var(--construction-width),54vw)] max-[960px]:w-[min(var(--construction-width),88vw)] max-[540px]:order-1 max-[540px]:w-[min(96vw,390px)] max-[540px]:max-w-none max-[390px]:w-[min(98vw,372px)]"
        style={constructionStyle}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute z-0 rounded-[28px] border backdrop-blur-xl ${
            light
              ? "inset-[6.6%_5.6%] rounded-[30px] border-white/80 [background:radial-gradient(circle_at_60%_40%,rgba(93,145,224,.10),transparent_38%),linear-gradient(132deg,rgba(255,255,255,.68)_0%,rgba(255,255,255,.30)_40%,rgba(209,221,239,.18)_100%),rgba(220,229,241,.22)] shadow-[0_34px_78px_rgba(47,62,89,.15),0_10px_26px_rgba(53,75,112,.07),inset_0_1px_0_rgba(255,255,255,.98)] [backdrop-filter:blur(28px)_saturate(155%)] max-[720px]:rounded-[25px]"
              : "inset-[7%_6%] border-[#96c3ff]/10 [background:radial-gradient(circle_at_58%_44%,rgba(113,135,255,.085),transparent_36%),linear-gradient(150deg,rgba(113,135,255,.04),transparent_48%),linear-gradient(180deg,rgba(255,255,255,.034),rgba(255,255,255,.007)),rgba(7,8,12,.4)] shadow-[0_46px_100px_rgba(0,0,0,.4),0_0_70px_rgba(113,135,255,.055),inset_0_1px_0_rgba(255,255,255,.04)]"
          }`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute z-[1] ${
            light
              ? "inset-[8.4%_7.5%] rounded-[25px] [background:linear-gradient(118deg,rgba(255,255,255,.52)_0%,rgba(255,255,255,.10)_26%,transparent_40%),radial-gradient(circle_at_73%_27%,rgba(82,145,220,.11),transparent_30%),linear-gradient(180deg,rgba(255,255,255,.22),transparent_58%)] opacity-[.88] shadow-[inset_0_0_0_1px_rgba(255,255,255,.20)]"
              : "inset-[10%_9%] rounded-[22px] [background:linear-gradient(180deg,rgba(255,255,255,.012),transparent_68%)] opacity-30"
          }`}
        />

        <svg className="logo-field construction-field absolute inset-0 z-[2] h-full w-full overflow-visible" viewBox="0 0 1285.46 807.55" aria-hidden="true">
          <defs>
            <linearGradient id="logoDirectionalLightGradient" ref={logoDirectionalLightRef} gradientUnits="userSpaceOnUse" x1="3050" y1="630" x2="3780" y2="1022">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.00" />
              <stop offset="26%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="58%" stopColor="#f4f8fb" stopOpacity={light ? "0.26" : "0.18"} />
              <stop offset="78%" stopColor="#dce8ef" stopOpacity={light ? "0.14" : "0.10"} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="logoReflectionGradient" ref={logoReflectionRef} gradientUnits="userSpaceOnUse" x1="2960" y1="570" x2="3900" y2="1100">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.00" />
              <stop offset="18%" stopColor="#ffffff" stopOpacity="0.00" />
              <stop offset="44%" stopColor="#ffffff" stopOpacity={light ? "0.18" : "0.12"} />
              <stop offset="54%" stopColor="#ffffff" stopOpacity={light ? "0.38" : "0.32"} />
              <stop offset="64%" stopColor="#e7eef2" stopOpacity="0.10" />
              <stop offset="84%" stopColor="#ffffff" stopOpacity="0.00" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="logoFresnelGradient" ref={logoFresnelRef} gradientUnits="userSpaceOnUse" x1="3050" y1="630" x2="3780" y2="1022">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.00" />
              <stop offset="42%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity={light ? "0.48" : "0.42"} />
              <stop offset="88%" stopColor="#f1f6f8" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="logoLightGlassBaseGradient" gradientUnits="userSpaceOnUse" x1="3020" y1="590" x2="3860" y2="1090">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.78" />
              <stop offset="18%" stopColor="#f7fbff" stopOpacity="0.52" />
              <stop offset="45%" stopColor="#b9d9f8" stopOpacity="0.22" />
              <stop offset="67%" stopColor="#ffffff" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#8ba7d8" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="logoLightGlassSheenGradient" gradientUnits="userSpaceOnUse" x1="3000" y1="560" x2="3910" y2="1120">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.00" />
              <stop offset="27%" stopColor="#ffffff" stopOpacity="0.10" />
              <stop offset="47%" stopColor="#ffffff" stopOpacity="0.72" />
              <stop offset="58%" stopColor="#d9f4ff" stopOpacity="0.42" />
              <stop offset="72%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="logoLightGlassRimGradient" gradientUnits="userSpaceOnUse" x1="3040" y1="1080" x2="3830" y2="600">
              <stop offset="0%" stopColor="#5d7fae" stopOpacity="0.20" />
              <stop offset="24%" stopColor="#d9efff" stopOpacity="0.44" />
              <stop offset="52%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="76%" stopColor="#8dd9f2" stopOpacity="0.46" />
              <stop offset="100%" stopColor="#6d72c7" stopOpacity="0.18" />
            </linearGradient>
            <clipPath id="logoMarkClip" clipPathUnits="userSpaceOnUse">
              <g transform={logoTransform}><g transform="translate(-2918.45 -540.86)"><path d={LOGO_PATH_A} /><path d={LOGO_PATH_B} /></g></g>
            </clipPath>
          </defs>

          <g className="construction-guides" transform={gridTransform}>
            <g className="construction-grid [transform-box:fill-box] [transform-origin:center] [will-change:transform]">
              {GRID_LINES.map(([x1, y1, x2, y2], index) => (
                <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} className={`${gridLineClass} ${[4, 5, 9, 10].includes(index) ? primaryGridClass : ""}`} />
              ))}
              <g className="grid-caption-stack">
                <text x="654.3" y="26" className={`grid-caption grid-caption-depth grid-caption-axis-depth ${mono} text-[10px] tracking-[.14em] ${light ? "fill-[#283651]/20" : "fill-white/10"}`}>{copy.grid.axis}</text>
                <text x="652" y="24" className={`grid-caption grid-caption-axis ${mono} text-[10px] tracking-[.14em] ${light ? "fill-[rgba(28,119,166,.58)]" : "fill-[rgba(150,195,255,.48)]"}`}>{copy.grid.axis}</text>
              </g>
              <g className="grid-caption-stack">
                <text x="1092.3" y="634" className={`grid-caption grid-caption-depth ${mono} text-[10px] tracking-[.14em] ${light ? "fill-[#283651]/20" : "fill-white/10"}`}>{copy.grid.original}</text>
                <text x="1090" y="632" className={`grid-caption ${mono} text-[10px] tracking-[.14em] ${light ? "fill-[rgba(40,54,81,.40)]" : "fill-white/25"}`}>{copy.grid.original}</text>
              </g>
              <g className="grid-caption-stack">
                <text x="50.2" y="568" className={`grid-caption grid-caption-depth ${mono} text-[10px] tracking-[.14em] ${light ? "fill-[#283651]/20" : "fill-white/10"}`}>{copy.grid.guide}</text>
                <text x="48" y="566" className={`grid-caption ${mono} text-[10px] tracking-[.14em] ${light ? "fill-[rgba(40,54,81,.40)]" : "fill-white/25"}`}>{copy.grid.guide}</text>
              </g>
            </g>

            <g className="formation-lines-group [transform-box:fill-box] [transform-origin:center] [will-change:transform]">
              <line x1="639.43" y1="76" x2="639.43" y2="732" className={`${formationLineClass} formation-line-axis [stroke-width:1] ${light ? "stroke-[rgba(49,106,157,.34)]" : "stroke-[rgba(150,195,255,.34)]"}`} />
              <line x1="250" y1="403.78" x2="1032" y2="403.78" className={`${formationLineClass} formation-line-axis formation-line-axis-soft [stroke-width:1] ${light ? "stroke-[rgba(49,106,157,.18)]" : "stroke-white/15"}`} />
            </g>
          </g>

          <g className="formation-mark formation-mark-position formation-mark-depth opacity-50 [transform-box:fill-box] [transform-origin:center] [will-change:transform]" transform={logoDepthTransform}>
            <g transform="translate(-2918.45 -540.86)">
              <path className={`logo-depth-shadow-path ${light ? "fill-[rgba(51,72,108,.11)] [filter:blur(2px)_drop-shadow(0_16px_20px_rgba(49,65,94,.15))]" : "fill-[rgba(18,20,24,.22)] [filter:blur(1.6px)_drop-shadow(0_10px_18px_rgba(0,0,0,.14))]"}`} d={LOGO_PATH_A} />
              <path className={`logo-depth-shadow-path ${light ? "fill-[rgba(51,72,108,.11)] [filter:blur(2px)_drop-shadow(0_16px_20px_rgba(49,65,94,.15))]" : "fill-[rgba(18,20,24,.22)] [filter:blur(1.6px)_drop-shadow(0_10px_18px_rgba(0,0,0,.14))]"}`} d={LOGO_PATH_B} />
            </g>
          </g>

          <g className={`logo-refraction pointer-events-none ${light ? "opacity-25 mix-blend-multiply" : "opacity-[.16] mix-blend-screen"}`} clipPath="url(#logoMarkClip)">
            <g className="logo-refraction-inner [will-change:transform,opacity]">
              <g className="logo-refraction-grid" transform={gridTransform}>
                {GRID_LINES.map(([x1, y1, x2, y2], index) => (
                  <line
                    key={`r-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={`logo-refraction-line ${technicalLine} [stroke-width:1] ${
                      [4, 5, 9, 10].includes(index)
                        ? light
                          ? "logo-refraction-line-primary stroke-[rgba(23,119,163,.28)]"
                          : "logo-refraction-line-primary stroke-[rgba(245,249,250,.16)]"
                        : light
                          ? "stroke-[rgba(52,91,127,.18)]"
                          : "stroke-[rgba(238,245,248,.12)]"
                    }`}
                  />
                ))}
                <line x1="639.43" y1="76" x2="639.43" y2="732" className={`logo-refraction-axis ${technicalLine} [stroke-width:1] ${light ? "stroke-[rgba(23,119,163,.28)]" : "stroke-[rgba(245,249,250,.16)]"}`} />
                <line x1="250" y1="403.78" x2="1032" y2="403.78" className={`logo-refraction-axis logo-refraction-axis-soft ${technicalLine} [stroke-width:1] opacity-50 ${light ? "stroke-[rgba(23,119,163,.20)]" : "stroke-[rgba(245,249,250,.12)]"}`} />
              </g>
            </g>
          </g>

          <g className="formation-mark formation-mark-position formation-mark-main [transform-box:fill-box] [transform-origin:center] [will-change:transform]" transform={logoTransform}>
            <g transform="translate(-2918.45 -540.86)">
              {[LOGO_PATH_A, LOGO_PATH_B].map((path, index) => (
                <path
                  key={`fill-${index}`}
                  className={`logo-fill ${
                    light
                      ? "[fill:url(#logoLightGlassBaseGradient)] [filter:drop-shadow(0_1px_0_rgba(255,255,255,.95))_drop-shadow(0_15px_27px_rgba(48,68,101,.17))]"
                      : "fill-[rgba(179,199,231,var(--logo-glass-opacity))] [filter:drop-shadow(0_1px_0_rgba(255,255,255,.11))_drop-shadow(0_12px_26px_rgba(113,135,255,.08))_drop-shadow(0_14px_24px_rgba(0,0,0,.16))]"
                  }`}
                  d={path}
                />
              ))}
              {[LOGO_PATH_A, LOGO_PATH_B].map((path, index) => (
                <path key={`sheen-${index}`} className={`logo-glass-sheen pointer-events-none ${light ? "block [fill:url(#logoLightGlassSheenGradient)] mix-blend-screen [filter:blur(.55px)]" : "hidden"}`} d={path} />
              ))}
              {[LOGO_PATH_A, LOGO_PATH_B].map((path, index) => (
                <path key={`rim-${index}`} className={`logo-glass-rim pointer-events-none ${technicalLine} ${light ? "block [stroke:url(#logoLightGlassRimGradient)] [stroke-width:1.35] [stroke-linejoin:round] mix-blend-screen [filter:drop-shadow(0_0_2px_rgba(255,255,255,.62))_drop-shadow(0_0_7px_rgba(46,144,187,.08))] max-[720px]:[stroke-width:1.1]" : "hidden"}`} d={path} />
              ))}
              {[LOGO_PATH_A, LOGO_PATH_B].map((path, index) => (
                <path key={`light-${index}`} className={`logo-directional-light pointer-events-none [fill:url(#logoDirectionalLightGradient)] mix-blend-screen ${light ? "[filter:blur(6px)_drop-shadow(0_0_8px_rgba(255,255,255,.20))]" : "[filter:blur(8px)_drop-shadow(0_0_10px_rgba(255,255,255,.04))]"}`} d={path} />
              ))}
              {[LOGO_PATH_A, LOGO_PATH_B].map((path, index) => (
                <path key={`reflect-${index}`} className={`logo-reflection-layer pointer-events-none [fill:url(#logoReflectionGradient)] mix-blend-screen ${light ? "blur-[11px]" : "blur-[16px]"}`} d={path} />
              ))}
              {[LOGO_PATH_A, LOGO_PATH_B].map((path, index) => (
                <path key={`fresnel-${index}`} className={`logo-fresnel-edge pointer-events-none ${technicalLine} [stroke:url(#logoFresnelGradient)] mix-blend-screen ${light ? "[stroke-width:1.15] [filter:drop-shadow(0_0_2px_rgba(255,255,255,.55))]" : "[stroke-width:.95] [filter:blur(.25px)]"}`} d={path} />
              ))}
              {[LOGO_PATH_A, LOGO_PATH_B].map((path, index) => (
                <path key={`outline-${index}`} className={`logo-outline ${technicalLine} [stroke-width:.7] ${light ? "stroke-[rgba(50,79,114,.22)] [filter:drop-shadow(0_1px_0_rgba(255,255,255,.34))]" : "stroke-[rgba(150,195,255,.16)]"}`} d={path} />
              ))}
              {[LOGO_PATH_A, LOGO_PATH_B].map((path, index) => (
                <path key={`build-${index}`} className={`logo-build-stroke ${technicalLine} [stroke-width:1.25] [stroke-linejoin:round] ${light ? "stroke-[rgba(34,100,144,.62)] [filter:drop-shadow(0_0_5px_rgba(255,255,255,.35))_drop-shadow(0_0_8px_rgba(39,132,174,.10))]" : "stroke-[rgba(219,234,255,.68)] [filter:drop-shadow(0_0_8px_rgba(150,195,255,.15))]"}`} d={path} />
              ))}
            </g>
          </g>
        </svg>

        <div className={`${noteClass} formation-note-top left-[5%] top-[17%] max-[960px]:left-[2%] max-[960px]:top-[10%]`}>
          <span className="text-[8px] tracking-[.16em]">{copy.notes.topA}</span>
          <b className={`text-[10px] font-medium tracking-[.08em] ${light ? "text-[#1b2840]/85" : "text-[#e8efff]/90"}`}>{copy.notes.topB}</b>
        </div>
        <div className={`${noteClass} formation-note-right right-[2%] top-[42%] max-[960px]:right-[1%] max-[960px]:top-[41%]`}>
          <span className="text-[8px] tracking-[.16em]">{copy.notes.rightA}</span>
          <b className={`text-[10px] font-medium tracking-[.08em] ${light ? "text-[#1b2840]/85" : "text-[#e8efff]/90"}`}>{copy.notes.rightB}</b>
        </div>
        <div className={`${noteClass} formation-note-bottom bottom-[10%] left-[16%] max-[960px]:bottom-[5%] max-[960px]:left-[9%]`}>
          <span className="text-[8px] tracking-[.16em]">{copy.notes.bottomA}</span>
          <b className={`text-[10px] font-medium tracking-[.08em] ${light ? "text-[#1b2840]/85" : "text-[#e8efff]/90"}`}>{copy.notes.bottomB}</b>
        </div>
      </div>
    </div>
  );
}

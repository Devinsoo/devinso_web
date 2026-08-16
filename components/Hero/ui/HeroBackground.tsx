import type { HeroCopy } from "@/components/Hero/copy";
import type { DevinsoTheme } from "@/lib/preferences";

type HeroBackgroundProps = {
  copy: HeroCopy;
  theme: DevinsoTheme;
};

const wireBase = "ambient-wire-line fill-none [vector-effect:non-scaling-stroke] [stroke-linecap:round]";

export function HeroBackground({ copy, theme }: HeroBackgroundProps) {
  const light = theme === "light";

  return (
    <div className="hero-background pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className={`hero-grid absolute inset-0 z-0 ${
          light
            ? "opacity-50 [background-image:linear-gradient(rgba(58,77,111,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(58,77,111,.06)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(circle_at_58%_50%,#000_0%,rgba(0,0,0,.96)_58%,transparent_94%)]"
            : "opacity-20 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_50%_50%,#000_0%,rgba(0,0,0,.84)_55%,transparent_90%)] max-[720px]:opacity-[.18] max-[720px]:[background-size:48px_48px]"
        }`}
        aria-hidden="true"
      />

      <div
        className={`hero-grid-light absolute inset-0 z-[1] [mask-repeat:no-repeat] [mask-size:34%_100%] [mask-position:-52%_0] [will-change:mask-position,opacity] max-[940px]:[mask-size:42%_100%] max-[720px]:[background-size:48px_48px] ${
          light
            ? "opacity-90 [background-image:linear-gradient(rgba(29,149,195,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(29,149,195,.28)_1px,transparent_1px)] [background-size:60px_60px] [filter:drop-shadow(0_0_12px_rgba(30,149,194,.12))_drop-shadow(0_0_28px_rgba(78,123,218,.08))]"
            : "opacity-[.78] [background-image:linear-gradient(rgba(110,188,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(110,188,255,.18)_1px,transparent_1px)] [background-size:64px_64px] [filter:drop-shadow(0_0_10px_rgba(110,188,255,.08))] max-[720px]:opacity-[.62]"
        } [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,.12)_24%,#000_43%,#000_57%,rgba(0,0,0,.12)_76%,transparent_100%)]`}
        aria-hidden="true"
      />

      <div className="hero-ambient absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
        <div
          className={`hero-ambient-spotlight absolute left-1/2 top-1/2 h-[min(72vw,980px)] w-[min(72vw,980px)] -translate-x-1/2 -translate-y-1/2 rounded-full ${
            light
              ? "opacity-40 [background:radial-gradient(circle,rgba(35,147,192,.16),rgba(74,129,191,.055)_40%,transparent_72%)] blur-[40px]"
              : "opacity-30 [background:radial-gradient(circle,rgba(110,188,255,.10),rgba(113,135,255,.045)_42%,transparent_72%)] blur-[48px]"
          }`}
        />

        <svg className="hero-ambient-wire absolute inset-0 h-full w-full opacity-30 max-[720px]:hidden" viewBox="0 0 1600 900" preserveAspectRatio="none">
          <g className="ambient-wire-cluster ambient-wire-cluster-left">
            <path d="M64 176 L214 108 L360 156 L510 92" className={`${wireBase} ${light ? "stroke-[rgba(58,88,130,.14)]" : "stroke-[rgba(255,255,255,.075)]"}`} />
            <path d="M102 292 L252 230 L410 280 L572 214" className={`${wireBase} ${light ? "stroke-[rgba(58,88,130,.10)]" : "stroke-[rgba(255,255,255,.055)]"}`} />
            <path d="M54 402 L190 344 L330 394 L474 334" className={`${wireBase} ${light ? "stroke-[rgba(58,88,130,.07)]" : "stroke-[rgba(255,255,255,.035)]"}`} />
            <text x="88" y="150" className="ambient-wire-label hidden">{copy.ambient.leftA}</text>
            <text x="218" y="257" className="ambient-wire-label ambient-wire-label-soft hidden">{copy.ambient.leftB}</text>
          </g>
          <g className="ambient-wire-cluster ambient-wire-cluster-right">
            <path d="M1048 146 L1196 214 L1350 168 L1528 236" className={`${wireBase} ${light ? "stroke-[rgba(58,88,130,.14)]" : "stroke-[rgba(255,255,255,.075)]"}`} />
            <path d="M1016 316 L1184 262 L1332 320 L1518 278" className={`${wireBase} ${light ? "stroke-[rgba(58,88,130,.10)]" : "stroke-[rgba(255,255,255,.055)]"}`} />
            <path d="M1100 436 L1260 388 L1402 454 L1532 402" className={`${wireBase} ${light ? "stroke-[rgba(58,88,130,.07)]" : "stroke-[rgba(255,255,255,.035)]"}`} />
            <text x="1228" y="142" className="ambient-wire-label hidden">{copy.ambient.rightA}</text>
            <text x="1360" y="476" className="ambient-wire-label ambient-wire-label-soft hidden">{copy.ambient.rightB}</text>
          </g>
        </svg>
      </div>

      <div
        className={`hero-halo absolute left-[58%] top-1/2 z-[3] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full ${
          light
            ? "w-[min(54vw,760px)] opacity-[.74] [background:radial-gradient(circle_at_50%_48%,rgba(255,255,255,.86),transparent_16%),radial-gradient(circle,rgba(76,143,231,.23),rgba(116,97,209,.11)_36%,transparent_71%)] blur-[72px] max-[940px]:left-1/2 max-[720px]:blur-[30px] max-[720px]:opacity-[.46]"
            : "w-[min(62vw,920px)] opacity-95 [background:radial-gradient(circle_at_48%_48%,rgba(255,255,255,.075),transparent_15%),radial-gradient(circle,rgba(113,135,255,.20),rgba(169,128,255,.08)_35%,transparent_69%)] blur-[74px] max-[940px]:left-1/2 max-[940px]:w-[min(90vw,760px)]"
        }`}
        aria-hidden="true"
      />

      <div
        className={`hero-orb hero-orb-a absolute right-[8%] top-[16%] z-[4] h-[210px] w-[210px] rounded-full blur-[1px] max-[520px]:-right-[8%] max-[520px]:top-[18%] max-[520px]:h-[130px] max-[520px]:w-[130px] ${
          light
            ? "opacity-[.34] [background:radial-gradient(circle_at_33%_26%,rgba(255,255,255,.95),rgba(86,151,222,.18)_38%,transparent_74%)]"
            : "opacity-[.55] [background:radial-gradient(circle_at_32%_28%,rgba(255,255,255,.15),rgba(113,135,255,.1)_35%,transparent_72%)]"
        }`}
        aria-hidden="true"
      />
      <div
        className={`hero-orb hero-orb-b absolute bottom-[9%] left-[28%] z-[4] h-40 w-40 rounded-full blur-[1px] max-[520px]:hidden ${
          light
            ? "opacity-30 [background:radial-gradient(circle_at_48%_42%,rgba(29,152,194,.18),rgba(126,102,197,.11)_44%,transparent_72%)]"
            : "opacity-[.55] [background:radial-gradient(circle_at_48%_42%,rgba(89,225,238,.1),rgba(169,128,255,.065)_44%,transparent_72%)]"
        }`}
        aria-hidden="true"
      />

      <div
        className={`hero-vignette absolute inset-0 z-[5] ${
          light
            ? "[box-shadow:inset_0_0_180px_36px_rgba(72,90,120,.055),inset_0_-120px_150px_rgba(74,92,126,.055),inset_0_90px_130px_rgba(255,255,255,.18)]"
            : "[box-shadow:inset_0_0_190px_42px_rgba(0,0,0,.68),inset_0_-130px_130px_rgba(0,0,0,.42)]"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

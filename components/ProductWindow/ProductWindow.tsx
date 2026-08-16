"use client";

import { ArrowUpRight, Command } from "lucide-react";
import type { RefObject } from "react";

type ProductWindowProps = {
  productRef?: RefObject<HTMLDivElement | null>;
};

const glass = "border border-white/[.08] bg-white/[.03] backdrop-blur-xl";
const skeleton = "rounded-full bg-white/[.08]";

export function ProductWindow({ productRef }: ProductWindowProps) {
  return (
    <div ref={productRef} className="product-shell group relative mx-auto w-full max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="product-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle,rgba(113,135,255,.16),rgba(89,225,238,.06)_38%,transparent_72%)] blur-[70px] transition-opacity duration-500 group-hover:opacity-100" />

      <div className="product-browser relative overflow-hidden rounded-[28px] border border-white/[.09] bg-[#090a0f]/90 shadow-[0_34px_100px_rgba(0,0,0,.42),0_0_60px_rgba(113,135,255,.05),inset_0_1px_rgba(255,255,255,.04)] backdrop-blur-2xl">
        <div className="browser-topbar flex h-12 items-center gap-4 border-b border-white/[.06] bg-white/[.025] px-4 font-mono text-[9px] uppercase tracking-[.12em] text-white/30 sm:px-5">
          <div className="browser-dots flex items-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
          </div>
          <div className="browser-address min-w-0 flex-1 truncate text-center">signal.dev / concept-01</div>
          <div className="browser-status rounded-full border border-[#59e1ee]/10 bg-[#59e1ee]/[.04] px-2 py-1 text-[#59e1ee]/55">draft</div>
        </div>

        <div className="product-ui min-h-[590px] [background:radial-gradient(circle_at_68%_42%,rgba(113,135,255,.07),transparent_32%),linear-gradient(180deg,rgba(255,255,255,.012),transparent_46%)] p-4 sm:p-6 lg:p-8">
          <nav className="product-nav flex items-center justify-between gap-5 border-b border-white/[.055] pb-5">
            <div className="product-mark flex items-center gap-2.5 text-[10px] font-semibold tracking-[.18em] text-white/80">
              <span className="product-mark-dot h-1.5 w-1.5 rounded-full bg-[#59e1ee] shadow-[0_0_12px_rgba(89,225,238,.45)]" />
              SIGNAL
            </div>

            <div className="product-nav-links hidden items-center gap-6 text-[9px] tracking-[.08em] text-white/30 sm:flex" aria-label="Prototype navigation">
              <span>Overview</span>
              <span>Signals</span>
              <span className={`${skeleton} unfinished-link h-1.5 w-12`} />
            </div>

            <button className={`${glass} command-button inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 font-mono text-[9px] text-white/45 transition hover:border-white/[.14] hover:bg-white/[.055] hover:text-white/70`} type="button" aria-label="Open command menu">
              <Command size={11} strokeWidth={1.5} />
              <span>K</span>
            </button>
          </nav>

          <div className="prototype-grid grid gap-8 pt-10 lg:grid-cols-[minmax(0,.85fr)_minmax(420px,1.15fr)] lg:items-center lg:gap-12">
            <section className="prototype-copy max-w-[480px]">
              <div className="eyebrow-line mb-5 flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[.16em] text-white/35">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#59e1ee] shadow-[0_0_12px_rgba(89,225,238,.35)]" />
                <span>Live intelligence · forming</span>
              </div>

              <h1 className="m-0 text-[clamp(38px,5vw,72px)] font-[560] leading-[.98] tracking-[-.055em] text-white">
                See the signal
                <span className="block [background:linear-gradient(110deg,#fff,#96c3ff_60%,#c6b4ff)] bg-clip-text text-transparent"> before the noise.</span>
              </h1>

              <p className="mt-6 max-w-[430px] text-[12px] leading-7 text-white/38">
                One operating layer for product, revenue and operations. The useful parts are still becoming real.
              </p>

              <div className="prototype-actions mt-8 flex flex-wrap items-center gap-4">
                <button className="prototype-cta inline-flex min-h-11 items-center gap-2.5 rounded-xl border border-white/70 [background:linear-gradient(135deg,#f8fbff,#cedcff_58%,#c9baff)] px-4 text-[10px] font-semibold text-[#090a0e] shadow-[0_12px_30px_rgba(113,135,255,.14)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(113,135,255,.22)]" type="button">
                  Open workspace
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </button>
                <span className="prototype-note font-mono text-[8px] uppercase tracking-[.14em] text-white/25">Private preview · 01</span>
              </div>
            </section>

            <aside className={`${glass} signal-canvas rounded-2xl p-4 shadow-[0_28px_60px_rgba(0,0,0,.24)] sm:p-5`} aria-label="Unfinished signal map">
              <div className="signal-panel-head flex items-start justify-between gap-5 border-b border-white/[.05] pb-4">
                <div className="grid gap-1">
                  <span className="tiny-label font-mono text-[8px] uppercase tracking-[.15em] text-white/25">Signal map</span>
                  <strong className="text-sm font-medium text-white/80">Today</strong>
                </div>
                <span className="panel-badge rounded-full border border-[#59e1ee]/10 bg-[#59e1ee]/[.04] px-2 py-1 font-mono text-[8px] uppercase tracking-[.12em] text-[#59e1ee]/55">live / partial</span>
              </div>

              <div className="signal-map relative mt-4 aspect-[360/220] overflow-hidden rounded-xl border border-white/[.045] [background:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px),radial-gradient(circle_at_50%_50%,rgba(113,135,255,.06),transparent_60%)] [background-size:24px_24px,24px_24px,auto]" aria-hidden="true">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 220" preserveAspectRatio="none">
                  <path d="M44 157 C 92 138, 99 68, 164 104 S 247 155, 315 67" className="map-line map-line-a fill-none stroke-[#96c3ff]/45 [stroke-width:1.2]" />
                  <path d="M55 71 C 117 83, 128 150, 201 127 S 265 82, 323 133" className="map-line map-line-b fill-none stroke-[#59e1ee]/30 [stroke-width:1]" />
                  <path d="M164 104 L201 127" className="map-line map-line-link fill-none stroke-white/15 [stroke-width:1] [stroke-dasharray:3_5]" />
                </svg>

                <span className="signal-node signal-node-a absolute left-[14%] top-[67%] h-2 w-2 rounded-full border border-[#96c3ff]/40 bg-[#0c0e16]" />
                <span className="signal-node signal-node-b absolute left-[43%] top-[45%] h-2 w-2 rounded-full border border-[#96c3ff]/45 bg-[#0c0e16]" />
                <span className="signal-node signal-node-c absolute left-[56%] top-[56%] h-2 w-2 rounded-full border border-[#59e1ee]/40 bg-[#0c0e16]" />
                <span className="signal-node signal-node-d absolute right-[12%] top-[28%] h-2 w-2 rounded-full border border-[#96c3ff]/45 bg-[#0c0e16]" />

                <span className="signal-node-core absolute left-[44%] top-[44%] h-2.5 w-2.5 rounded-full bg-[#96c3ff] shadow-[0_0_18px_rgba(150,195,255,.4)]" />
                <span className="signal-ping signal-ping-a absolute left-[calc(44%_-_7px)] top-[calc(44%_-_7px)] h-6 w-6 rounded-full border border-[#96c3ff]/20" />
                <span className="signal-ping signal-ping-b absolute right-[calc(12%_-_6px)] top-[calc(28%_-_6px)] h-5 w-5 rounded-full border border-[#59e1ee]/15" />

                <div className="signal-tooltip signal-tooltip-a absolute left-[47%] top-[27%] grid gap-0.5 rounded-lg border border-white/[.07] bg-[#0b0d13]/75 px-2.5 py-2 font-mono backdrop-blur-md">
                  <span className="text-[7px] uppercase tracking-[.12em] text-white/25">Activation</span>
                  <b className="text-[10px] font-medium text-[#59e1ee]/70">+8.4%</b>
                </div>

                <div className="signal-tooltip signal-tooltip-b skeleton-tooltip absolute bottom-[14%] right-[8%] grid w-20 gap-2 rounded-lg border border-white/[.05] bg-white/[.025] p-2.5">
                  <span className={`${skeleton} h-1.5 w-10`} />
                  <b className={`${skeleton} h-2 w-12`} />
                </div>
              </div>

              <div className="signal-stats mt-4 grid grid-cols-3 gap-2">
                <article className="rounded-xl border border-white/[.055] bg-white/[.025] p-3">
                  <span className="block font-mono text-[7px] uppercase tracking-[.12em] text-white/25">Product</span>
                  <strong className="mt-2 block text-xl font-medium text-white/75">62</strong>
                  <i className="mt-1 block font-mono text-[7px] not-italic text-white/20">signal score</i>
                </article>
                <article className="unfinished-stat rounded-xl border border-white/[.045] bg-white/[.018] p-3">
                  <span className={`${skeleton} block h-1.5 w-9`} />
                  <strong className={`${skeleton} mt-3 block h-5 w-8`} />
                  <i className={`${skeleton} mt-2 block h-1.5 w-12`} />
                </article>
                <article className="unfinished-stat faint rounded-xl border border-white/[.04] bg-white/[.012] p-3 opacity-55">
                  <span className={`${skeleton} block h-1.5 w-8`} />
                  <strong className={`${skeleton} mt-3 block h-5 w-7`} />
                  <i className={`${skeleton} mt-2 block h-1.5 w-10`} />
                </article>
              </div>
            </aside>
          </div>

          <div className="prototype-footer-line mt-8 flex items-center gap-3 border-t border-white/[.045] pt-4 font-mono text-[8px] uppercase tracking-[.13em] text-white/20">
            <span>Data source</span>
            <i className="h-px flex-1 bg-white/[.055]" />
            <em className="not-italic">not connected</em>
          </div>
        </div>
      </div>

      <div className="browser-measure measure-top pointer-events-none absolute left-1/2 top-2 hidden -translate-x-1/2 font-mono text-[7px] uppercase tracking-[.16em] text-white/15 lg:block" aria-hidden="true">
        <span>fluid viewport</span>
      </div>
      <div className="browser-measure measure-side pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 rotate-90 font-mono text-[7px] uppercase tracking-[.16em] text-white/15 lg:block" aria-hidden="true">
        <span>concept 01</span>
      </div>
    </div>
  );
}

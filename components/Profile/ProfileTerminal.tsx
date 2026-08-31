"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type ProfileTerminalProps = {
  lines: readonly string[];
  status: string;
  ready: string;
  skip: string;
  username: string;
  onComplete: () => void;
};

export function ProfileTerminal({ lines, status, ready, skip, username, onComplete }: ProfileTerminalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const lineEls = gsap.utils.toArray<HTMLElement>(".profile-boot-line");

      if (reducedMotion) {
        gsap.set(lineEls, { opacity: 1 });
        if (statusRef.current) statusRef.current.textContent = ready;
        const tl = gsap.timeline({ delay: 0.25, onComplete: finish });
        tl.to(rootRef.current, { opacity: 0, duration: 0.4 });
        return;
      }

      gsap.set(lineEls, { opacity: 0 });
      gsap.set(".profile-boot-caret", { opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(rootRef.current, {
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: finish,
          });
        },
      });

      lineEls.forEach((el, index) => {
        const full = el.textContent ?? "";
        el.textContent = "";
        tl.set(el, { opacity: 1 }, index === 0 ? 0 : "+=0.05");
        tl.to(
          {},
          {
            duration: Math.max(0.28, full.length * 0.014),
            onUpdate: function () {
              const progress = this.progress();
              const count = Math.round(full.length * progress);
              el.textContent = full.slice(0, count);
            },
          },
        );
      });

      tl.call(() => {
        if (statusRef.current) statusRef.current.textContent = ready;
      });
      tl.to(".profile-boot-caret", { opacity: 0, duration: 0.2, repeat: 3, yoyo: true }, "-=0.1");
      tl.to({}, { duration: 0.35 });
    }, rootRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050508] px-6"
    >
      <button
        type="button"
        onClick={finish}
        className="absolute right-5 top-5 rounded-full border border-white/[.1] bg-white/[.025] px-3.5 py-2 font-mono text-[9px] uppercase tracking-[.16em] text-white/40 outline-none transition-colors hover:border-white/25 hover:text-white/75 focus-visible:ring-2 focus-visible:ring-white/25"
      >
        {skip}
      </button>
      <div className="w-full max-w-[460px] rounded-[18px] border border-white/[.09] bg-white/[.02] p-5 font-mono text-[11px] leading-[1.9] text-white/70 shadow-[0_30px_80px_rgba(0,0,0,.5)] backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between border-b border-white/[.08] pb-2 text-[9px] uppercase tracking-[.2em] text-white/35">
          <span>record://{username}</span>
          <span className="flex gap-1">
            <span className="h-[6px] w-[6px] rounded-full bg-white/20" />
            <span className="h-[6px] w-[6px] rounded-full bg-white/20" />
            <span className="h-[6px] w-[6px] rounded-full bg-[rgba(var(--accent-a),.6)]" />
          </span>
        </div>
        {lines.map((line, index) => (
          <div key={index} className="profile-boot-line whitespace-pre text-white/75">
            <span className="text-[rgba(var(--accent-a),.85)]">{">"} </span>
            {line}
          </div>
        ))}
        <div className="mt-3 text-[9px] uppercase tracking-[.2em] text-white/30">
          <span ref={statusRef}>{status}</span>
          <span className="profile-boot-caret ml-1 inline-block h-[10px] w-[6px] translate-y-[1px] bg-[rgba(var(--accent-a),.7)] align-middle" />
        </div>
      </div>
    </div>
  );
}

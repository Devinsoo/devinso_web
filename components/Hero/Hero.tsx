"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { UI_COPY } from "@/components/Hero/copy";
import { HeroBackground } from "@/components/Hero/ui/HeroBackground";
import { HeroHeader } from "@/components/Hero/ui/HeroHeader";
import { HeroIntro } from "@/components/Hero/ui/HeroIntro";
import { HeroFooter } from "@/components/Hero/ui/HeroFooter";
import { ConstructionStage } from "@/components/Hero/ui/ConstructionStage";
import { SelectedWork, type WorkProject } from "@/components/Work/SelectedWork";
import { MembersSection } from "@/components/Members/MembersSection";
import type { TeamMember } from "@/lib/team";
import { CONSTRUCTION_SETTINGS, GRID_LINES } from "@/components/Hero/construction";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import {
  setCookie,
  DEVINSO_COOKIE,
  type DevinsoLanguage,
  type DevinsoTheme,
} from "@/lib/preferences";

type Language = DevinsoLanguage;

function distanceToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return Math.hypot(px - x1, py - y1);

  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
  const x = x1 + t * dx;
  const y = y1 + t * dy;
  return Math.hypot(px - x, py - y);
}

type HeroProps = {
  initialTheme?: DevinsoTheme;
  initialLanguage?: Language;
  /** Registry rows fetched on the server; the section falls back without them. */
  members?: TeamMember[];
  /** Team projects fetched on the server; the rail falls back without them. */
  work?: WorkProject[];
};

export function Hero({ initialTheme = "dark", initialLanguage = "en", members, work }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const logoDirectionalLightRef = useRef<SVGLinearGradientElement>(null);
  const logoReflectionRef = useRef<SVGLinearGradientElement>(null);
  const logoFresnelRef = useRef<SVGLinearGradientElement>(null);

  const isRTL = language === "fa";
  const copy = UI_COPY[language];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.body.style.backgroundColor = theme === "light" ? "#e8eef5" : "#050508";
    document.body.style.color = theme === "light" ? "#182235" : "#f2f0ec";

    // A theme swap repaints colours; it can also nudge box sizes (light mode
    // gives a few chrome elements a border and padding), which moves the points
    // the scroll timelines are pinned to. Recomputing those positions is all
    // that is needed — the timelines themselves animate numbers and selectors
    // and contain no colour, so rebuilding them would be pure waste.
    ScrollTrigger.refresh();

    return () => {
      document.body.style.removeProperty("background-color");
      document.body.style.removeProperty("color");
    };
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language === "fa" ? "fa" : "en";
    // Keep the document layout physically LTR. Persian RTL is applied only
    // to text containers so grid/flex positioning does not reverse twice.
    document.documentElement.dir = "ltr";
  }, [language, isRTL]);
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setCookie(DEVINSO_COOKIE.theme, nextTheme);
  };

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setSettingsOpen(false);
    setCookie(DEVINSO_COOKIE.language, nextLanguage);
  };

  useEffect(() => {
    if (!settingsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [settingsOpen]);

  useLayoutEffect(() => {
    if (!rootRef.current || !stageRef.current || !coreRef.current) return;

    let interactionReady = false;
    let handlePointerMove: ((event: PointerEvent) => void) | undefined;
    let handlePointerLeave: (() => void) | undefined;
    let handleRootPointerMove: ((event: PointerEvent) => void) | undefined;
    let handleRootPointerLeave: (() => void) | undefined;
    let idleTweens: gsap.core.Tween[] = [];

    const ctx = gsap.context(() => {
      gsap.set("[data-reveal]", { y: 14, opacity: 0 });
      gsap.set(coreRef.current, { opacity: 1, scale: 1, x: 0, y: 0 });
      gsap.set(".logo-fill, .logo-glass-sheen, .logo-glass-rim", { opacity: 0 });
      gsap.set(".logo-directional-light, .logo-reflection-layer, .logo-fresnel-edge", { opacity: 0 });
      gsap.set(".logo-outline", { opacity: 0 });
      gsap.set(".logo-refraction-inner", { x: 0, y: 0, opacity: 0 });
      gsap.set(".formation-caption", { opacity: 0, y: 8 });
      gsap.set(".code-panel", { opacity: 0, y: 12 });
      gsap.set(".code-line", { opacity: 0, y: 5 });
      gsap.set(".grid-caption", { opacity: 0, y: 5 });

      const gridLines = gsap.utils.toArray<SVGLineElement>(".construction-grid-line");
      gridLines.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      const formationLines = gsap.utils.toArray<SVGPathElement>(".formation-line");
      formationLines.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      const buildPaths = gsap.utils.toArray<SVGPathElement>(".logo-build-stroke");
      buildPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const startIdle = () => {
        if (reducedMotion || idleTweens.length) return;

        idleTweens = [
          gsap.to(".logo-directional-light", {
            opacity: CONSTRUCTION_SETTINGS.material.lightOpacity + 0.02,
            duration: 4.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.to(".logo-reflection-layer", {
            opacity: CONSTRUCTION_SETTINGS.material.reflectionOpacity + 0.02,
            duration: 4.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.to(".logo-refraction-inner", {
            x: 1.1,
            y: -0.6,
            duration: 6.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.to(".hero-status-dot", {
            opacity: 1,
            scale: 1.06,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.to(".code-panel", {
            yPercent: -1,
            duration: 6.2,
            stagger: 0.35,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.to(".code-line", {
            opacity: 0.34,
            duration: 2,
            stagger: 0.08,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.fromTo(
            ".hero-grid-light",
            { webkitMaskPosition: "-52% 0", maskPosition: "-52% 0", opacity: 0.18 },
            {
              webkitMaskPosition: "152% 0",
              maskPosition: "152% 0",
              opacity: 0.82,
              duration: 8.8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            },
          ),
          gsap.fromTo(
            ".scroll-cue-flow",
            { xPercent: -100 },
            { xPercent: 100, duration: 2.3, repeat: -1, ease: "sine.inOut" },
          ),
          gsap.to(".hero-orb-a", {
            x: -28,
            y: 18,
            scale: 1.05,
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          gsap.to(".hero-orb-b", {
            x: 24,
            y: -16,
            scale: 1.06,
            duration: 11,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
        ];
      };

      const intro = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          interactionReady = true;
          startIdle();
        },
      });

      intro
        .to("[data-reveal]", {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.045,
        })
        .to(
          ".construction-grid-line",
          {
            strokeDashoffset: 0,
            opacity: 0.62,
            duration: 1.05,
            stagger: 0.045,
            ease: "power2.inOut",
          },
          0.16,
        )
        .to(
          ".grid-caption",
          {
            opacity: 0.68,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
          },
          0.54,
        )
        .to(
          ".formation-line",
          {
            strokeDashoffset: 0,
            opacity: 0.58,
            duration: 0.88,
            stagger: 0.04,
            ease: "power2.inOut",
          },
          0.42,
        )
        .to(
          ".logo-build-stroke",
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.5,
            stagger: 0.12,
            ease: "power2.inOut",
          },
          0.82,
        )
        .to(
          ".logo-outline",
          {
            opacity: 1,
            duration: 0.48,
          },
          1.78,
        )
        .to(
          ".logo-fill, .logo-glass-sheen, .logo-glass-rim",
          {
            opacity: 1,
            duration: 0.82,
            stagger: 0.045,
          },
          1.84,
        )
        .to(
          ".logo-build-stroke",
          {
            opacity: 0,
            duration: 0.72,
            ease: "sine.out",
          },
          2.16,
        )
        .to(
          ".construction-grid-line",
          {
            opacity: (_, element) =>
              (element as SVGLineElement).classList.contains("construction-grid-primary") ? 0.28 : 0.16,
            duration: 0.85,
            ease: "sine.out",
          },
          2.12,
        )
        .to(
          ".formation-line",
          {
            opacity: 0.22,
            duration: 0.65,
            ease: "sine.out",
          },
          2.1,
        )
        .to(
          ".formation-caption",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
          },
          2.18,
        )
        .to(
          ".code-panel",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
          },
          1.48,
        )
        .to(
          ".code-line",
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.022,
          },
          1.64,
        );

      const moveX = gsap.quickTo(coreRef.current, "x", { duration: 1.05, ease: "power3.out" });
      const moveY = gsap.quickTo(coreRef.current, "y", { duration: 1.05, ease: "power3.out" });
      const tiltX = gsap.quickTo(coreRef.current, "rotationX", { duration: 1.2, ease: "power3.out" });
      const tiltY = gsap.quickTo(coreRef.current, "rotationY", { duration: 1.2, ease: "power3.out" });
      const gridX = gsap.quickTo(".construction-grid", "x", { duration: 1.35, ease: "power3.out" });
      const gridY = gsap.quickTo(".construction-grid", "y", { duration: 1.35, ease: "power3.out" });
      const guidesX = gsap.quickTo(".formation-lines-group", "x", { duration: 1.5, ease: "power3.out" });
      const guidesY = gsap.quickTo(".formation-lines-group", "y", { duration: 1.5, ease: "power3.out" });
      const notesX = gsap.quickTo(".formation-note", "x", { duration: 1.35, ease: "power3.out" });
      const notesY = gsap.quickTo(".formation-note", "y", { duration: 1.35, ease: "power3.out" });
      const codeX = gsap.quickTo(".code-atmosphere", "x", { duration: 1.6, ease: "power3.out" });
      const codeY = gsap.quickTo(".code-atmosphere", "y", { duration: 1.6, ease: "power3.out" });
      const haloX = gsap.quickTo(".hero-halo", "x", { duration: 1.8, ease: "power3.out" });
      const haloY = gsap.quickTo(".hero-halo", "y", { duration: 1.8, ease: "power3.out" });
      const ambientX = gsap.quickTo(".hero-ambient-wire", "x", { duration: 1.6, ease: "power3.out" });
      const ambientY = gsap.quickTo(".hero-ambient-wire", "y", { duration: 1.6, ease: "power3.out" });
      const spotlightX = gsap.quickTo(".hero-ambient-spotlight", "x", { duration: 1.15, ease: "power3.out" });
      const spotlightY = gsap.quickTo(".hero-ambient-spotlight", "y", { duration: 1.15, ease: "power3.out" });
      const scannerX = gsap.quickTo(".construction-dial", "x", { duration: 1.2, ease: "power3.out" });
      const scannerY = gsap.quickTo(".construction-dial", "y", { duration: 1.2, ease: "power3.out" });

      const lightState = { dx: 0, dy: 0, proximity: 0 };
      const applyOpticalLight = () => {
        const { dx, dy, proximity } = lightState;
        const centerX = 3416.73;
        const centerY = 826.0;
        const rangeX = CONSTRUCTION_SETTINGS.material.directionRangeX;
        const rangeY = CONSTRUCTION_SETTINGS.material.directionRangeY;

        if (logoDirectionalLightRef.current) {
          gsap.set(logoDirectionalLightRef.current, {
            attr: {
              x1: centerX - dx * rangeX,
              y1: centerY - dy * rangeY,
              x2: centerX + dx * rangeX,
              y2: centerY + dy * rangeY,
            },
          });
        }

        if (logoReflectionRef.current) {
          gsap.set(logoReflectionRef.current, {
            attr: {
              x1: centerX - dx * (rangeX * 0.68) - 110,
              y1: centerY - dy * (rangeY * 0.68) - 92,
              x2: centerX + dx * (rangeX * 0.82) + 140,
              y2: centerY + dy * (rangeY * 0.82) + 108,
            },
          });
        }

        if (logoFresnelRef.current) {
          gsap.set(logoFresnelRef.current, {
            attr: {
              x1: centerX - dx * (rangeX * 0.95),
              y1: centerY - dy * (rangeY * 0.95),
              x2: centerX + dx * (rangeX * 0.95),
              y2: centerY + dy * (rangeY * 0.95),
            },
          });
        }

        gsap.set(".logo-directional-light", {
          opacity:
            CONSTRUCTION_SETTINGS.material.lightOpacity +
            (CONSTRUCTION_SETTINGS.material.lightOpacityHover - CONSTRUCTION_SETTINGS.material.lightOpacity) * proximity,
        });
        gsap.set(".logo-reflection-layer", {
          opacity:
            CONSTRUCTION_SETTINGS.material.reflectionOpacity +
            (CONSTRUCTION_SETTINGS.material.reflectionOpacityHover - CONSTRUCTION_SETTINGS.material.reflectionOpacity) * proximity,
        });
        gsap.set(".logo-fresnel-edge", {
          opacity:
            CONSTRUCTION_SETTINGS.material.edgeOpacity +
            (CONSTRUCTION_SETTINGS.material.edgeOpacityHover - CONSTRUCTION_SETTINGS.material.edgeOpacity) * proximity,
        });
        gsap.set(".logo-refraction-inner", {
          x: dx * CONSTRUCTION_SETTINGS.material.refractionX,
          y: dy * CONSTRUCTION_SETTINGS.material.refractionY,
        });
      };

      handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const coreRect = coreRef.current!.getBoundingClientRect();
        const viewX = gsap.utils.clamp(
          0,
          1285.46,
          ((event.clientX - coreRect.left) / coreRect.width) * 1285.46,
        );
        const viewY = gsap.utils.clamp(
          0,
          807.55,
          ((event.clientY - coreRect.top) / coreRect.height) * 807.55,
        );

        const dx = gsap.utils.clamp(-1, 1, (viewX - CONSTRUCTION_SETTINGS.logo.x) / 360);
        const dy = gsap.utils.clamp(-1, 1, (viewY - CONSTRUCTION_SETTINGS.logo.y) / 250);
        const proximity = gsap.utils.clamp(0, 1, 1.04 - Math.hypot(dx, dy) * 0.32);

        gsap.to(lightState, {
          dx,
          dy,
          proximity,
          duration: 1.25,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: applyOpticalLight,
        });

        if (!interactionReady) return;

        const rect = stageRef.current!.getBoundingClientRect();
        const px = gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width - 0.5) * 2);
        const py = gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height - 0.5) * 2);

        moveX(0);
        moveY(0);
        tiltX(py * -CONSTRUCTION_SETTINGS.depth.tiltX);
        tiltY(px * CONSTRUCTION_SETTINGS.depth.tiltY);
        gridX(px * 5);
        gridY(py * 3);
        guidesX(px * -3);
        guidesY(py * -2);
        notesX(px * -3);
        notesY(py * -2);
        codeX(px * -2.5);
        codeY(py * -1.5);
        haloX(px * 9);
        haloY(py * 6);
        scannerX(px * -8);
        scannerY(py * -5);

        gridLines.forEach((line, index) => {
          const [x1, y1, x2, y2] = GRID_LINES[index];
          const distance = distanceToSegment(viewX, viewY, x1, y1, x2, y2);
          const isPrimary = line.classList.contains("construction-grid-primary");
          const baseline = isPrimary ? 0.28 : 0.16;
          const highlight = gsap.utils.mapRange(150, 22, baseline, isPrimary ? 0.58 : 0.44, distance);
          gsap.set(line, { opacity: gsap.utils.clamp(baseline, isPrimary ? 0.58 : 0.44, highlight) });
        });
      };

      handlePointerLeave = () => {
        gsap.to(lightState, {
          dx: 0,
          dy: 0,
          proximity: 0,
          duration: 1.35,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: applyOpticalLight,
        });

        if (!interactionReady) return;

        moveX(0);
        moveY(0);
        tiltX(0);
        tiltY(0);
        gridX(0);
        gridY(0);
        guidesX(0);
        guidesY(0);
        notesX(0);
        notesY(0);
        codeX(0);
        codeY(0);
        haloX(0);
        haloY(0);
        scannerX(0);
        scannerY(0);

        gridLines.forEach((line) => {
          gsap.to(line, {
            opacity: line.classList.contains("construction-grid-primary") ? 0.28 : 0.16,
            duration: 0.55,
            ease: "sine.out",
          });
        });
      };

      handleRootPointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch" || !rootRef.current) return;

        const rect = (stickyRef.current ?? rootRef.current).getBoundingClientRect();
        const px = gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width - 0.5) * 2);
        const py = gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height - 0.5) * 2);

        ambientX(px * -12);
        ambientY(py * -8);
        spotlightX(px * rect.width * 0.10);
        spotlightY(py * rect.height * 0.08);
      };

      handleRootPointerLeave = () => {
        ambientX(0);
        ambientY(0);
        spotlightX(0);
        spotlightY(0);
      };

      stageRef.current?.addEventListener("pointermove", handlePointerMove);
      stageRef.current?.addEventListener("pointerleave", handlePointerLeave);
      rootRef.current?.addEventListener("pointermove", handleRootPointerMove);
      rootRef.current?.addEventListener("pointerleave", handleRootPointerLeave);
    }, rootRef);

    return () => {
      if (handlePointerMove) stageRef.current?.removeEventListener("pointermove", handlePointerMove);
      if (handlePointerLeave) stageRef.current?.removeEventListener("pointerleave", handlePointerLeave);
      if (handleRootPointerMove) rootRef.current?.removeEventListener("pointermove", handleRootPointerMove);
      if (handleRootPointerLeave) rootRef.current?.removeEventListener("pointerleave", handleRootPointerLeave);
      idleTweens.forEach((tween) => tween.kill());
      ctx.revert();
    };
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current || !coreRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const root = rootRef.current;

    const ctx = gsap.context(() => {
      gsap.set("[data-morph-work-heading]", { y: 58, opacity: 0, filter: "blur(9px)" });
      gsap.set("[data-morph-meta]", { y: 12, opacity: 0 });
      gsap.set("[data-morph-scroll-cue]", { y: 20, opacity: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.05,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(".hero-copy", {
          y: -54,
          opacity: 0,
          filter: "blur(9px)",
          duration: 0.22,
          ease: "power2.in",
        }, 0.08)
        .to(".hero-topline", {
          y: -14,
          opacity: 0.18,
          duration: 0.25,
          ease: "power2.inOut",
        }, 0.10)
        .to(".hero-footer", {
          y: 14,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        }, 0.10)
        // fromTo, not to: the stage is also a [data-reveal] element, so the
        // intro timeline owns its opacity too and starts it at 0. A plain .to()
        // records whatever is on the element when it first renders, and
        // invalidateOnRefresh re-records it on every refresh. Loading the page
        // scrolled down renders this scrub at the far end while the intro still
        // has the stage at 0, so 0 gets recorded as the resting value and
        // scrolling back to the top restores the stage to invisible. Stating
        // the start explicitly keeps the two timelines from trading values.
        .fromTo(stageRef.current, {
          scale: 1,
          opacity: 1,
        }, {
          scale: 0.985,
          opacity: 0.68,
          duration: 0.28,
          ease: "power2.inOut",
        }, 0.08)
        .to(coreRef.current, {
          scale: 0.90,
          opacity: 0.06,
          filter: "blur(10px)",
          duration: 0.46,
          ease: "power2.inOut",
        }, 0.15)
        // The code panels used to sit beside the cover card. With the title now
        // centred over them they read as clutter behind the type, so they clear
        // out with the rest of the hero furniture instead of lingering.
        .to(".code-atmosphere", {
          opacity: 0,
          y: -16,
          filter: "blur(7px)",
          duration: 0.30,
          ease: "power2.in",
        }, 0.12)
        .to("[data-morph-work-heading]", {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.30,
          ease: "power3.out",
        }, 0.53)
        .to("[data-morph-meta]", {
          y: 0,
          opacity: 1,
          duration: 0.24,
          stagger: 0.04,
          ease: "power2.out",
        }, 0.62)
        .to("[data-morph-scroll-cue]", {
          y: 0,
          opacity: 1,
          duration: 0.26,
          ease: "power2.out",
        }, 0.70)
        .to(".hero-grid-light", { opacity: 0.24, duration: 0.34, ease: "power1.inOut" }, 0.42);

      // The cue's travelling light runs on its own loop rather than on the
      // scrubbed timeline: it has to keep inviting the scroll while the reader
      // is sitting still, which a scrub-driven tween cannot do.
      // The rail clips the beam at both ends, so it travels in and out on its
      // own — animating opacity as well would only make the repeat visibly jump.
      gsap.fromTo(
        "[data-cue-beam]",
        { yPercent: -120 },
        {
          yPercent: 260,
          duration: 1.8,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 0.5,
        },
      );
    }, root);

    return () => ctx.revert();
    // Deliberately not keyed on `theme`: nothing in this timeline reads a
    // colour, so a theme swap would tear down and rebuild every tween and
    // ScrollTrigger for no visual difference. The effect above refreshes the
    // trigger positions instead. `language` stays, because Persian changes the
    // grid order and the copy lengths, which really does move the layout.
  }, [language]);

  const heroThemeClass = theme === "light"
    ? "[background:radial-gradient(ellipse_58%_52%_at_72%_44%,rgba(79,132,228,.15),transparent_66%),radial-gradient(ellipse_48%_42%_at_42%_78%,rgba(123,102,214,.10),transparent_64%),radial-gradient(circle_at_15%_22%,rgba(37,171,203,.10),transparent_26%),radial-gradient(circle_at_83%_12%,rgba(255,255,255,.98),transparent_22%),linear-gradient(135deg,#fbfdff_0%,#eff4fa_42%,#e8eef7_100%)] text-[#182235]"
    : "[background:radial-gradient(circle_at_50%_50%,rgba(150,195,255,.09),transparent_22%),radial-gradient(circle_at_22%_44%,rgba(113,135,255,.10),transparent_26%),radial-gradient(circle_at_76%_46%,rgba(113,135,255,.09),transparent_29%),radial-gradient(circle_at_16%_74%,rgba(110,188,255,.028),transparent_18%),linear-gradient(180deg,rgba(255,255,255,.014),rgba(255,255,255,0)),#050508] text-[#f2f0ec]";

  const desktopGrid = language === "fa"
    ? "min-[961px]:grid-cols-[minmax(500px,1.30fr)_minmax(270px,.70fr)]"
    : "min-[961px]:grid-cols-[minmax(270px,.70fr)_minmax(500px,1.30fr)]";

  return (
    <>
      <section
        ref={rootRef}
        className={`hero-stage logo-hero relative isolate h-[188svh] min-h-[1180px] transition-colors duration-300 max-[760px]:h-[176svh] max-[540px]:min-h-[1080px] ${heroThemeClass}`}
        data-theme={theme}
        data-language={language}
      >
        <div ref={stickyRef} className="hero-morph-sticky sticky top-0 h-[100svh] min-h-[720px] overflow-hidden max-[540px]:min-h-[100dvh]">
      <HeroBackground copy={copy} theme={theme} />

      <HeroHeader
        copy={copy}
        theme={theme}
        language={language}
        settingsOpen={settingsOpen}
        settingsRef={settingsRef}
        onToggleSettings={() => setSettingsOpen((open) => !open)}
        onToggleTheme={toggleTheme}
        onLanguageChange={changeLanguage}
      />

      <div className={`hero-frame hero-frame-logo relative z-10 mx-auto grid min-h-[max(760px,100svh)] min-w-0 w-[min(1440px,calc(100%_-_clamp(40px,7vw,112px)))] items-center gap-[clamp(34px,5vw,78px)] [isolation:isolate] ${desktopGrid} min-[961px]:max-[1240px]:w-[min(1160px,calc(100%_-_44px))] min-[961px]:max-[1240px]:gap-[clamp(24px,3.4vw,44px)] max-[960px]:w-[min(820px,calc(100%_-_40px))] max-[960px]:min-h-0 max-[960px]:grid-cols-1 max-[960px]:gap-[22px] max-[960px]:py-[118px] max-[760px]:w-[calc(100%_-_28px)] max-[760px]:pt-[104px] max-[760px]:pb-[78px] max-[540px]:w-full max-[540px]:items-start max-[540px]:gap-0 max-[540px]:px-4 max-[540px]:pb-0 max-[540px]:pt-[114px] max-[390px]:px-3 max-[390px]:pt-[108px] max-[540px]:[overflow-anchor:none]`}>
        <HeroIntro copy={copy} theme={theme} language={language} />

        <ConstructionStage
          copy={copy}
          theme={theme}
          language={language}
          stageRef={stageRef}
          coreRef={coreRef}
          logoDirectionalLightRef={logoDirectionalLightRef}
          logoReflectionRef={logoReflectionRef}
          logoFresnelRef={logoFresnelRef}
        />
      </div>

        <div
          data-morph-work-heading
          className={`pointer-events-none absolute inset-x-0 top-1/2 z-[34] flex -translate-y-1/2 flex-col items-center px-6 text-center ${language === "fa" ? "[direction:rtl]" : ""}`}
        >
          <div className={`font-mono text-[10px] uppercase tracking-[.32em] ${theme === "light" ? "text-[#253a5a]/40" : "text-white/30"}`} data-morph-meta>
            01 / SELECTED WORK
          </div>
          <div className={`mt-6 text-[clamp(58px,11vw,188px)] font-[560] leading-[.8] tracking-[-.075em] ${theme === "light" ? "text-[#172238]" : "text-[#f4f6fb]"}`}>
            SELECTED
            <span className={`mt-[.1em] block ${theme === "light" ? "text-[#172238]/14" : "text-white/10"}`}>WORK</span>
          </div>
          <div className={`mt-8 max-w-[420px] text-[11px] leading-[1.75] ${theme === "light" ? "text-[#2b3953]/48" : "text-white/40"}`} data-morph-meta>
            Design, technology and interaction — resolved into shipped work.
          </div>

          {/* Invitation to keep scrolling: the projects themselves live below
              this sticky hero, so the section needs to say that out loud now
              that no cover sits here to imply more content. */}
          <div data-morph-scroll-cue className="mt-11 flex flex-col items-center">
            <div className={`font-mono text-[9px] uppercase tracking-[.34em] ${theme === "light" ? "text-[#253a5a]/45" : "text-white/35"}`}>
              {copy.stage.scroll}
            </div>
            <div className={`relative mt-4 h-[92px] w-px overflow-hidden ${theme === "light" ? "bg-[#294368]/12" : "bg-white/10"}`}>
              <div
                data-cue-beam
                className={`absolute left-0 top-0 h-[38px] w-full ${theme === "light" ? "bg-[linear-gradient(180deg,transparent,#2397bb,transparent)]" : "bg-[linear-gradient(180deg,transparent,#59e1ee,transparent)]"}`}
              />
            </div>
          </div>
        </div>

        <HeroFooter copy={copy} theme={theme} language={language} />
        </div>
      </section>

      <SelectedWork theme={theme} language={language} projects={work} />

      <MembersSection theme={theme} language={language} members={members} />
    </>
  );
}

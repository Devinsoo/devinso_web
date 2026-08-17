"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { UI_COPY } from "@/components/Hero/copy";
import { HeroBackground } from "@/components/Hero/ui/HeroBackground";
import { HeroHeader } from "@/components/Hero/ui/HeroHeader";
import { HeroIntro } from "@/components/Hero/ui/HeroIntro";
import { HeroFooter } from "@/components/Hero/ui/HeroFooter";
import { ConstructionStage } from "@/components/Hero/ui/ConstructionStage";
import { SelectedWork } from "@/components/Work/SelectedWork";
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
};

export function Hero({ initialTheme = "dark", initialLanguage = "en" }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const morphCoverRef = useRef<HTMLDivElement>(null);
  const morphImageRef = useRef<HTMLImageElement>(null);
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
    if (!rootRef.current || !stickyRef.current || !coreRef.current || !morphCoverRef.current || !morphImageRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const root = rootRef.current;
    const sticky = stickyRef.current;
    const morphCover = morphCoverRef.current;
    const morphImage = morphImageRef.current;

    const getStart = () => {
      const stickyRect = sticky.getBoundingClientRect();
      const coreRect = coreRef.current!.getBoundingClientRect();
      return {
        x: coreRect.left - stickyRect.left + coreRect.width * 0.065,
        y: coreRect.top - stickyRect.top + coreRect.height * 0.075,
        width: coreRect.width * 0.87,
        height: coreRect.height * 0.85,
      };
    };

    const getEnd = () => {
      const width = sticky.clientWidth;
      const height = sticky.clientHeight;
      const mobile = width < 760;
      const compact = width < 1080;
      const finalWidth = mobile
        ? width - 28
        : Math.min(width * (compact ? 0.58 : 0.56), 900);
      const finalHeight = finalWidth * 9 / 16;
      return {
        x: mobile ? 14 : width - finalWidth - Math.max(32, width * 0.055),
        y: mobile ? Math.max(300, height * 0.42) : Math.max(150, (height - finalHeight) * 0.53),
        width: finalWidth,
        height: finalHeight,
      };
    };

    const ctx = gsap.context(() => {
      const start = getStart();
      gsap.set(morphCover, {
        x: start.x,
        y: start.y,
        width: start.width,
        height: start.height,
        opacity: 0,
        borderRadius: 28,
      });
      gsap.set(morphImage, {
        opacity: 0,
        scale: 1.16,
        filter: "blur(12px) brightness(.62)",
        clipPath: "inset(49% 0% 49% 0% round 22px)",
      });
      gsap.set("[data-morph-work-heading]", { y: 58, opacity: 0, filter: "blur(9px)" });
      gsap.set("[data-morph-meta]", { y: 12, opacity: 0 });
      gsap.set("[data-morph-scan]", { yPercent: -160, opacity: 0 });

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
        .to(stageRef.current, {
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
        .fromTo(
          morphCover,
          {
            x: () => getStart().x,
            y: () => getStart().y,
            width: () => getStart().width,
            height: () => getStart().height,
            opacity: 0,
            borderRadius: 30,
          },
          {
            x: () => getEnd().x,
            y: () => getEnd().y,
            width: () => getEnd().width,
            height: () => getEnd().height,
            opacity: 1,
            borderRadius: 24,
            duration: 0.62,
            ease: "power3.inOut",
          },
          0.13,
        )
        .to(morphImage, {
          opacity: 1,
          scale: 1.04,
          filter: "blur(0px) brightness(1)",
          clipPath: "inset(0% 0% 0% 0% round 18px)",
          duration: 0.42,
          ease: "power3.out",
        }, 0.42)
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
        .fromTo(
          "[data-morph-scan]",
          { yPercent: -160, opacity: 0 },
          { yPercent: 180, opacity: 0.8, duration: 0.22, ease: "power2.inOut" },
          0.64,
        )
        .to("[data-morph-scan]", { opacity: 0, duration: 0.08 }, 0.84)
        .to(".hero-grid-light", { opacity: 0.24, duration: 0.34, ease: "power1.inOut" }, 0.42);
    }, root);

    return () => ctx.revert();
  }, [theme, language]);

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
          className={`pointer-events-none absolute left-[clamp(22px,5.5vw,86px)] top-[31%] z-[34] max-w-[38vw] max-[760px]:left-4 max-[760px]:top-[19%] max-[760px]:max-w-[calc(100%_-_32px)] ${language === "fa" ? "text-right [direction:rtl]" : "text-left"}`}
        >
          <div className={`font-mono text-[9px] uppercase tracking-[.2em] ${theme === "light" ? "text-[#253a5a]/40" : "text-white/30"}`} data-morph-meta>
            01 / SELECTED WORK
          </div>
          <div className={`mt-5 text-[clamp(54px,7.8vw,126px)] font-[560] leading-[.78] tracking-[-.085em] ${theme === "light" ? "text-[#172238]" : "text-[#f4f6fb]"}`}>
            SELECTED
            <span className={`mt-[.12em] block ${theme === "light" ? "text-[#172238]/14" : "text-white/10"}`}>WORK</span>
          </div>
          <div className={`mt-8 max-w-[340px] text-[11px] leading-[1.75] ${theme === "light" ? "text-[#2b3953]/48" : "text-white/40"}`} data-morph-meta>
            Design, technology and interaction — resolved into shipped work.
          </div>
        </div>

        <div
          ref={morphCoverRef}
          data-hero-morph-cover
          className={`pointer-events-none absolute left-0 top-0 z-[36] overflow-hidden border [will-change:transform,width,height,opacity] ${
            theme === "light"
              ? "border-[#294368]/10 bg-[#e9eef6] shadow-[0_36px_90px_rgba(45,65,98,.16)]"
              : "border-white/[.09] bg-[#07090d] shadow-[0_42px_110px_rgba(0,0,0,.55),0_0_70px_rgba(113,135,255,.06)]"
          }`}
        >
          <img
            ref={morphImageRef}
            src="/projects/allixro-cover-1920x1080.jpg"
            alt="Allixro red profile project cover"
            className="absolute inset-0 h-full w-full object-cover object-center [will-change:transform,filter,clip-path,opacity]"
            draggable={false}
          />
          <div className={`absolute inset-0 ${theme === "light" ? "bg-[linear-gradient(180deg,transparent_58%,rgba(18,37,66,.10))]" : "bg-[linear-gradient(180deg,transparent_54%,rgba(2,4,8,.32))]"}`} />
          <div data-morph-scan className={`absolute left-0 top-0 z-10 h-[16%] w-full ${theme === "light" ? "bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.62),rgba(69,117,183,.15),transparent)]" : "bg-[linear-gradient(180deg,transparent,rgba(186,226,255,.38),rgba(114,229,238,.08),transparent)]"}`} />
          <div className={`absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between border-t pt-3 font-mono text-[7.5px] uppercase tracking-[.15em] ${theme === "light" ? "border-[#294368]/10 text-[#213550]/42" : "border-white/[.08] text-white/34"}`} data-morph-meta>
            <span>ASSET / COVER_01</span>
            <span>16:9 / LOADED</span>
          </div>
        </div>

        <HeroFooter copy={copy} theme={theme} language={language} />
        </div>
      </section>

      <SelectedWork theme={theme} language={language} />
    </>
  );
}

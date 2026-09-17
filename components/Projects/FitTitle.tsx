"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";

type FitTitleProps = {
  text: string;
  /** Smallest font size we are willing to shrink to, in px. */
  min?: number;
  /** Largest font size, in px — the size a short title keeps. */
  max?: number;
  /** Hard cap on wrapped lines; the size shrinks until the text fits in them. */
  maxLines?: number;
  /** Unitless line-height, applied inline so the fit maths matches what renders. */
  leading?: number;
  className?: string;
  style?: CSSProperties;
} & Record<`data-${string}`, string | undefined>;

/**
 * Headline that binary-searches its own font size so the text fills the column
 * width without overflowing it or spilling past `maxLines`. A fixed clamp() can
 * only guess at the title length; this measures the actual string.
 */
export function FitTitle({
  text,
  min = 34,
  max = 122,
  maxLines = 3,
  leading = 0.86,
  className = "",
  style,
  ...rest
}: FitTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fits = (px: number) => {
      el.style.fontSize = `${px}px`;
      // +1px of slack: sub-pixel layout rounding otherwise rejects a size that fits.
      return el.scrollWidth <= parent.clientWidth + 1 && el.scrollHeight <= px * leading * maxLines + 1;
    };

    const fit = () => {
      let lo = min;
      let hi = max;
      let best = min;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (fits(mid)) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      el.style.fontSize = `${best}px`;
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(parent);
    // Re-fit once webfonts land: metrics before that belong to the fallback face.
    document.fonts?.ready.then(fit).catch(() => {});

    return () => observer.disconnect();
  }, [text, min, max, maxLines, leading]);

  return (
    <h1
      ref={ref}
      className={className}
      style={{
        // Pre-hydration fallback, replaced by the measured size on mount.
        fontSize: `clamp(${min}px, 8.3vw, ${max}px)`,
        lineHeight: leading,
        ...style,
      }}
      {...rest}
    >
      {text}
    </h1>
  );
}

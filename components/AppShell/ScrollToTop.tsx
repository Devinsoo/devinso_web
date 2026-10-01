"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Starts every new page at the top.
 *
 * Next.js keeps the scroll position on navigation whenever the new page is
 * still "visible", and it skips sticky and fixed elements when deciding what
 * to scroll to. Every page here is tall and opens with a fixed or sticky
 * header, so leaving the home page 3,000px down landed the visitor 3,000px
 * down the project page too.
 *
 * Two cases are left alone on purpose:
 * - a URL with a hash (`/#members`), which Next scrolls to that section;
 * - back/forward, where returning to the previous position is the point.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Layout effect: runs after the new page commits but before it paints, so
  // the old scroll position never flashes on screen.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }

    if (window.location.hash) return;

    // "instant" overrides the site-wide `scroll-behavior: smooth`, which would
    // otherwise animate the jump through the whole previous page.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

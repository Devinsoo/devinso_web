import { test, expect, type Page } from "@playwright/test";

/**
 * The construction stage (the logo build on the right of the hero) is driven by
 * a scrubbed ScrollTrigger that fades `.hero-core` down to opacity .06 across
 * the hero. Reported bug: reload while scrolled to the bottom, come back to the
 * top, and the stage is gone — the scrub never brings it back.
 */

const ORIGIN = "http://localhost:4000";

async function seedPreferences(page: Page) {
  await page.context().addCookies([
    { name: "devinso_theme", value: "dark", url: ORIGIN },
    { name: "devinso_language", value: "en", url: ORIGIN },
  ]);
}

/**
 * Emulate a browser restoring a bottom scroll offset across a reload. Chrome
 * gives up early against this page because the markup is short until React
 * hydrates, so chase the bottom for a moment the way it would if the content
 * had already been there.
 */
async function emulateRestoreToBottom(page: Page) {
  await page.addInitScript(() => {
    const until = Date.now() + 2500;
    const loop = () => {
      const max =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (max > 0) window.scrollTo(0, max);
      if (Date.now() < until) requestAnimationFrame(loop);
    };
    document.addEventListener("DOMContentLoaded", loop);
  });
}

async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3500);
}

/**
 * Opacity as actually rendered: the element's own value multiplied through
 * every ancestor. The scrub drives both `.hero-core` and its stage wrapper, so
 * checking one in isolation can miss the stage being invisible.
 */
async function stageVisibility(page: Page) {
  return page.evaluate(() => {
    const effective = (selector: string) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      let node: Element | null = el;
      let value = 1;
      while (node && node !== document.documentElement) {
        value *= Number(getComputedStyle(node).opacity);
        node = node.parentElement;
      }
      return value;
    };
    return {
      core: effective(".hero-core"),
      codePanel: effective(".code-panel"),
      logo: effective(".logo-outline"),
      gridLine: effective(".construction-grid-line"),
      stageOwn: Number(
        getComputedStyle(document.querySelector(".hero-logo-stage")!).opacity,
      ),
      scrollY: window.scrollY,
    };
  });
}

/** Scroll in per-frame steps, the way a wheel does, so the scrub can follow. */
async function scrollSmooth(page: Page, target: number) {
  await page.evaluate(async (to) => {
    const from = window.scrollY;
    for (let i = 1; i <= 60; i++) {
      window.scrollTo(0, from + ((to - from) * i) / 60);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
  }, target);
  await page.waitForTimeout(2500);
}

const maxScroll = (page: Page) =>
  page.evaluate(
    () => document.documentElement.scrollHeight - document.documentElement.clientHeight,
  );

test.describe("hero construction stage", () => {
  test.beforeEach(async ({ page }) => {
    await seedPreferences(page);
  });

  test("is visible on a normal visit", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    const seen = await stageVisibility(page);
    expect(seen.core).toBeGreaterThan(0.9);
    expect(seen.codePanel).toBeGreaterThan(0.5);
  });

  test("comes back after scrolling down and up again", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    await scrollSmooth(page, await maxScroll(page));
    expect((await stageVisibility(page)).core).toBeLessThan(0.2);

    await scrollSmooth(page, 0);
    const seen = await stageVisibility(page);
    expect(seen.core).toBeGreaterThan(0.9);
    expect(seen.codePanel).toBeGreaterThan(0.5);
  });

  test("still dims while scrolling after a reload at the bottom", async ({ page }) => {
    await emulateRestoreToBottom(page);
    await page.goto("/");
    await settle(page);

    // The scrub takes the stage to .68 across the hero. Losing that means the
    // intro's reveal has taken the element over as the last writer, which is
    // the same ownership bug as the blank stage - it just fails the other way.
    const heroHeight = await page.evaluate(
      () => document.querySelector(".hero-stage")!.getBoundingClientRect().height,
    );
    await scrollSmooth(page, Math.round(heroHeight * 0.5));

    const dimmed = await stageVisibility(page);
    expect(dimmed.stageOwn, "stage should dim across the hero").toBeLessThan(0.8);
  });

  test("comes back after a reload taken at the bottom", async ({ page }) => {
    await emulateRestoreToBottom(page);
    await page.goto("/");
    await settle(page);

    const atBottom = await stageVisibility(page);
    expect(atBottom.scrollY, "should have been restored down the page").toBeGreaterThan(500);

    await scrollSmooth(page, 0);
    const seen = await stageVisibility(page);
    expect(seen.core, "construction stage must return when back at the top").toBeGreaterThan(0.9);
    expect(seen.codePanel).toBeGreaterThan(0.5);
    expect(seen.logo).toBeGreaterThan(0.1);
  });
});

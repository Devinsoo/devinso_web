/**
 * Where the Devinso API lives, per environment and per side of the render.
 *
 * Server and browser take different routes to the same API on purpose:
 *
 * - On the server (React Server Components, route handlers) we call the API
 *   origin directly. Nothing about it is public, so the URL stays a private
 *   env var rather than a `NEXT_PUBLIC_` one.
 * - In the browser we call a same-origin path that `next.config.ts` rewrites
 *   onto the API. That keeps dev free of CORS preflights and cookie/origin
 *   surprises, and means the API origin is never baked into the client bundle.
 *
 * Reads are server-rendered today, so the browser path mainly matters for the
 * form posts.
 */

/** API origin used for server-side fetches. No trailing slash. */
export const API_ORIGIN = (process.env.DEVINSO_API_URL ?? "http://localhost:5200").replace(/\/$/, "");

/** Same-origin prefix the browser uses; rewritten onto `API_ORIGIN/api/v1`. */
export const API_BROWSER_PATH = "/api/devinso";

/** Version segment, kept in one place so a v2 is a one-line change. */
export const API_VERSION = "v1";

/** How long a single API call may take before it is abandoned, in ms. */
export const API_TIMEOUT_MS = Number(process.env.DEVINSO_API_TIMEOUT_MS ?? 8000);

/**
 * Base for the current side of the render. `typeof window` is the check rather
 * than an env flag, because the same module is bundled for both.
 */
export function apiBase(): string {
  return typeof window === "undefined"
    ? `${API_ORIGIN}/api/${API_VERSION}`
    : API_BROWSER_PATH;
}

export const isDev = process.env.NODE_ENV !== "production";

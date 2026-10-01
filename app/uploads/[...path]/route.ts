/**
 * Server-side proxy for uploaded images.
 *
 * Uploads live in the admin panel's wwwroot and are served from its origin.
 * `lib/api/media.ts` rewrites every upload URL in an API response to a path on
 * *our* origin, so the panel's hostname never reaches the browser; this handler
 * is the hop back. `next/image` then treats `/uploads/...` as a local image and
 * fetches it from here, which is why `next.config.ts` needs no `remotePatterns`.
 *
 * This is a route handler rather than a `rewrites()` entry because a rewrite's
 * destination is resolved by `next build` and frozen into
 * `.next/routes-manifest.json`; `next start` reads it from there and never
 * re-runs the config. The image is built by CI, where DEVINSO_MEDIA_URL is
 * unset, so a rewrite would be baked to the localhost default and every upload
 * would 500 on the server no matter what the deployment set at runtime. A
 * handler reads the env var per request, so the same image works in any
 * environment.
 */
import { NextResponse } from "next/server";

/** The env var is read per request, so the response must never be prerendered. */
export const dynamic = "force-dynamic";

/** Origin serving the uploads. In production this may be an internal address. */
function mediaOrigin(): string {
  return (process.env.DEVINSO_MEDIA_URL ?? "http://localhost:5100").replace(/\/$/, "");
}

/** How long a single upload fetch may take before it is abandoned, in ms. */
const FETCH_TIMEOUT_MS = Number(process.env.DEVINSO_MEDIA_TIMEOUT_MS ?? 15000);

/**
 * Response headers worth passing through. An allow-list rather than a copy of
 * everything: the panel is an ASP.NET app and its `server`, `set-cookie` and
 * auth-related headers have no business on this origin.
 */
const PASS_THROUGH = [
  "content-type",
  "content-length",
  "cache-control",
  "etag",
  "last-modified",
  "content-disposition",
];

/**
 * Rebuilds the upstream path from the matched segments.
 *
 * Next hands them already decoded, so they are re-encoded here; a segment that
 * is empty, `.` or `..` is rejected outright rather than normalised, so no
 * request can walk out of `/uploads/` and into the rest of the panel's wwwroot.
 */
function upstreamPath(segments: string[]): string | null {
  if (segments.length === 0) return null;

  for (const segment of segments) {
    if (segment === "" || segment === "." || segment === ".." || segment.includes("/")) {
      return null;
    }
  }

  return segments.map(encodeURIComponent).join("/");
}

async function proxy(request: Request, segments: string[], method: "GET" | "HEAD") {
  const path = upstreamPath(segments);
  if (!path) return new NextResponse(null, { status: 404 });

  const target = `${mediaOrigin()}/uploads/${path}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers: {
        // Conditional requests are forwarded so a repeat fetch can still come
        // back as a 304 rather than re-sending the whole image.
        ...headerIfPresent(request, "accept"),
        ...headerIfPresent(request, "if-none-match"),
        ...headerIfPresent(request, "if-modified-since"),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    // The panel being down is not this origin's fault, and a 502 keeps it
    // distinguishable from an upload that genuinely is not there.
    return new NextResponse(null, { status: 502 });
  }

  const headers = new Headers();
  for (const name of PASS_THROUGH) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }

  // Uploads are content-addressed — a new upload is a new GUID filename — so a
  // long lifetime is safe even if the panel forgot to send one.
  if (!headers.has("cache-control") && upstream.ok) {
    headers.set("cache-control", "public, max-age=31536000, immutable");
  }

  // 204 and 304 must not carry a body, and a HEAD never does.
  const bodiless = method === "HEAD" || upstream.status === 204 || upstream.status === 304;

  return new NextResponse(bodiless ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

function headerIfPresent(request: Request, name: string): Record<string, string> {
  const value = request.headers.get(name);
  return value ? { [name]: value } : {};
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, path, "GET");
}

export async function HEAD(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, path, "HEAD");
}

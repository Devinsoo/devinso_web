/**
 * Server-side proxy for browser calls to the Devinso API.
 *
 * The browser talks to this same-origin path instead of the API directly, so
 * there is no CORS preflight and the API origin stays out of the client bundle
 * — see `lib/api/config.ts`. Server-side reads skip this entirely and call the
 * API origin themselves.
 *
 * Like `app/uploads/[...path]/route.ts`, this is a route handler rather than a
 * `rewrites()` entry: a rewrite's destination is resolved by `next build` and
 * frozen into `.next/routes-manifest.json`, which `next start` reads back
 * without re-running the config. CI builds the image with DEVINSO_API_URL
 * unset, so a rewrite would be baked to the localhost default and every browser
 * call would 500 whatever the deployment set at runtime.
 */
import { NextResponse } from "next/server";
import { API_VERSION } from "@/lib/api/config";

/** The env var is read per request, so the response must never be prerendered. */
export const dynamic = "force-dynamic";

/** API origin, read per request. No trailing slash. */
function apiOrigin(): string {
  return (process.env.DEVINSO_API_URL ?? "http://localhost:5200").replace(/\/$/, "");
}

/** How long a single proxied call may take before it is abandoned, in ms. */
const FETCH_TIMEOUT_MS = Number(process.env.DEVINSO_API_TIMEOUT_MS ?? 8000);

/** Request headers forwarded upstream. Everything else is dropped. */
const FORWARD_REQUEST = ["accept", "accept-language", "content-type"];

/** Response headers passed back. The API's `server` header is not one of them. */
const FORWARD_RESPONSE = ["content-type", "cache-control"];

function upstreamPath(segments: string[]): string | null {
  if (segments.length === 0) return null;

  for (const segment of segments) {
    if (segment === "" || segment === "." || segment === ".." || segment.includes("/")) {
      return null;
    }
  }

  return segments.map(encodeURIComponent).join("/");
}

async function proxy(request: Request, segments: string[]) {
  const path = upstreamPath(segments);
  if (!path) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const incoming = new URL(request.url);
  const target = `${apiOrigin()}/api/${API_VERSION}/${path}${incoming.search}`;

  const headers = new Headers();
  for (const name of FORWARD_REQUEST) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  // Without these the API's rate limiter sees every visitor as this container.
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) headers.set("x-forwarded-for", forwardedFor);

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return NextResponse.json({ error: "The Devinso API could not be reached." }, { status: 502 });
  }

  const responseHeaders = new Headers();
  for (const name of FORWARD_RESPONSE) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  const bodiless = upstream.status === 204 || upstream.status === 304;

  return new NextResponse(bodiless ? null : upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type Context = { params: Promise<{ path: string[] }> };

async function handler(request: Request, context: Context) {
  const { path } = await context.params;
  return proxy(request, path);
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as HEAD,
};

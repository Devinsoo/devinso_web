import { API_TIMEOUT_MS, apiBase, isDev } from "@/lib/api/config";
import { CACHE_TAG, type CacheOptions, cached } from "@/lib/api/cache";

/** A non-2xx answer, or a request that never got one. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
    readonly body?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** True when the resource is simply absent — an unpublished slug, say. */
  get isNotFound() {
    return this.status === 404;
  }

  /** True when the API could not be reached at all (down, wrong port, DNS). */
  get isUnreachable() {
    return this.status === 0;
  }
}

type RequestOptions = {
  /** Query string values; null and undefined entries are dropped. */
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Seconds a GET stays fresh. See `CACHE_TTL` in `lib/api/cache.ts`. */
  revalidate?: number;
  /**
   * Cache tags for this read, so the admin panel can drop exactly what it
   * changed. `CACHE_TAG.all` is added for free — never list it here.
   */
  tags?: readonly string[];
  signal?: AbortSignal;
};

const DEFAULT_REVALIDATE_SECONDS = 60;

function cacheOptions(options: RequestOptions): CacheOptions {
  return {
    ttlSeconds: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
    tags: [CACHE_TAG.all, ...(options.tags ?? [])],
  };
}

/**
 * What the *fetch* does about caching, which is a separate question from what
 * `lib/api/cache.ts` does about it.
 *
 * Production hands the read to Next's data cache, tagged, so it is shared
 * across the whole server and survives a restart. Development has no data
 * cache to hand it to, so the fetch is unconditional and the memory layer in
 * `lib/api/cache.ts` — deliberately short-lived there — is the only thing
 * standing between a render and the API.
 */
function cachePolicy(options: RequestOptions): RequestInit {
  if (isDev) return { cache: "no-store" };

  return {
    next: {
      revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
      tags: [CACHE_TAG.all, ...(options.tags ?? [])],
    },
  } as RequestInit;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = apiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined) params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function request<T>(path: string, init: RequestInit, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.query);

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...(init.headers ?? {}) },
      // A hung API must not hang the page render with it.
      signal: options.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch (cause) {
    // Status 0 distinguishes "never reached the API" from anything it answered.
    throw new ApiError(
      `Could not reach the Devinso API at ${url}: ${(cause as Error).message}`,
      0,
      path,
    );
  }

  if (!response.ok) {
    // ProblemDetails bodies are small; keeping one makes a 400 debuggable.
    const body = await response.text().catch(() => undefined);
    throw new ApiError(`${response.status} ${response.statusText} for ${url}`, response.status, path, body);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

/**
 * A cached GET. Identical reads inside one render share a single request, and a
 * read repeated within its TTL does not reach the API at all.
 *
 * A caller supplying its own `signal` owns the request lifetime, so that one
 * skips the cache rather than handing a later caller a result whose abort
 * signal it never saw.
 */
export function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const send = () => request<T>(path, { method: "GET", ...cachePolicy(options) }, options);

  if (options.signal) return send();

  return cached<T>(`GET ${buildUrl(path, options.query)}`, cacheOptions(options), send);
}

export function apiPost<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  return request<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
    options,
  );
}

/**
 * A GET that degrades instead of throwing: null when the API is unreachable or
 * answers 404. Pages use this to fall back to their bundled content, so the
 * site still renders with the API stopped — which during local development it
 * often is.
 *
 * Anything else (a 500, a malformed body) is re-thrown: that is a real bug and
 * hiding it behind placeholder content would waste an afternoon.
 */
export async function apiGetOrNull<T>(path: string, options: RequestOptions = {}): Promise<T | null> {
  try {
    return await apiGet<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError && (error.isUnreachable || error.isNotFound)) {
      if (isDev) {
        console.warn(`[devinso-api] ${error.message} — falling back to bundled content.`);
      }
      return null;
    }
    throw error;
  }
}

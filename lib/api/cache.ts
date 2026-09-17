/**
 * The cache that sits in front of the API.
 *
 * Three layers, each covering a hole the next one leaves:
 *
 * 1. **In-flight dedupe.** Two components asking for `/members` while the first
 *    request is still open share that one promise. `loadRoster` and
 *    `loadAccentsByUsername` both call `fetchMembers`, and a project page walks
 *    the project list twice; without this, one render is several identical
 *    round trips.
 * 2. **Process memory, with a TTL.** Survives between requests, so a second
 *    visitor inside the window is served without touching the API. This is the
 *    only layer that works in development, where Next's data cache is off.
 * 3. **Next's data cache.** Production only, via `next: { revalidate, tags }`
 *    on the fetch itself (see `lib/api/client.ts`). Shared across the whole
 *    server and persisted, which module memory is not.
 *
 * Every entry carries tags, so `revalidateTag` from the admin panel and
 * `invalidateTags` here can drop exactly the same set (see
 * `app/api/revalidate/route.ts`).
 */
import { isDev } from "@/lib/api/config";

/** Escape hatch: `DEVINSO_API_CACHE=off` makes every read go to the API. */
export const CACHE_DISABLED = process.env.DEVINSO_API_CACHE === "off";

/**
 * How long a successful read stays fresh, in seconds, per resource.
 *
 * These are lifetimes for a marketing site: content changes a few times a week
 * and nothing on the page is per-user, so minutes cost nothing and save every
 * visitor after the first a round trip.
 */
export const CACHE_TTL = {
  /** Settings render in the shell of every page and almost never change. */
  site: 900,
  members: 300,
  memberProjects: 300,
  projects: 300,
  project: 300,
  openings: 120,
  opening: 120,
} as const;

/**
 * Development clamps every TTL to this, because the admin panel is usually
 * open in the next tab: a five-minute cache there reads as "my edit did not
 * save". Long enough to collapse a burst of renders, short enough that a
 * refresh after an edit shows it.
 */
const DEV_MAX_TTL_SECONDS = Number(process.env.DEVINSO_API_DEV_TTL_SECONDS ?? 15);

/**
 * A failed read is cached too, briefly. With the API stopped, every fetch waits
 * out the 8s timeout; without this, one page render spends half a minute
 * discovering the same outage three times over.
 */
const ERROR_TTL_SECONDS = Number(process.env.DEVINSO_API_ERROR_TTL_SECONDS ?? 10);

/** Ceiling on entries held in memory, so a crawler cannot grow the map forever. */
const MAX_ENTRIES = 500;

/** Cache tags, shared by the memory layer and Next's data cache. */
export const CACHE_TAG = {
  /** On everything. Invalidating it empties the cache. */
  all: "devinso",
  site: "devinso:site",
  members: "devinso:members",
  member: (handle: string) => `devinso:member:${handle.toLowerCase()}`,
  projects: "devinso:projects",
  project: (slug: string) => `devinso:project:${slug.toLowerCase()}`,
  openings: "devinso:openings",
  opening: (id: string) => `devinso:opening:${id.toLowerCase()}`,
} as const;

type Entry = {
  /** The resolved value, or the error to re-throw for a negatively cached read. */
  value: unknown;
  failed: boolean;
  expiresAt: number;
  tags: readonly string[];
};

type Store = {
  entries: Map<string, Entry>;
  inFlight: Map<string, Promise<unknown>>;
  hits: number;
  misses: number;
};

/**
 * Hung off globalThis rather than a module const: a dev HMR reload re-evaluates
 * this module, and a cache that empties on every file save is not a cache.
 */
const store: Store = ((globalThis as { __devinsoApiCache?: Store }).__devinsoApiCache ??= {
  entries: new Map(),
  inFlight: new Map(),
  hits: 0,
  misses: 0,
});

function ttlFor(seconds: number): number {
  return isDev ? Math.min(seconds, DEV_MAX_TTL_SECONDS) : seconds;
}

/** Drop expired entries, then the oldest ones if the map is still over budget. */
function prune() {
  const now = Date.now();
  for (const [key, entry] of store.entries) {
    if (entry.expiresAt <= now) store.entries.delete(key);
  }

  // Map iterates in insertion order, so the front of it is the oldest.
  let over = store.entries.size - MAX_ENTRIES;
  if (over <= 0) return;

  for (const key of store.entries.keys()) {
    store.entries.delete(key);
    if (--over <= 0) break;
  }
}

export type CacheOptions = {
  /** Seconds a successful result stays fresh. See `CACHE_TTL`. */
  ttlSeconds: number;
  tags: readonly string[];
};

/**
 * Run `load`, or return what a previous call to it left behind.
 *
 * A rejection is remembered for `ERROR_TTL_SECONDS` and re-thrown as-is, so
 * callers keep seeing the original `ApiError` and can still tell a 404 from an
 * unreachable API.
 */
export function cached<T>(key: string, options: CacheOptions, load: () => Promise<T>): Promise<T> {
  if (CACHE_DISABLED) return load();

  const now = Date.now();

  const entry = store.entries.get(key);
  if (entry && entry.expiresAt > now) {
    store.hits += 1;
    if (entry.failed) return Promise.reject(entry.value);
    return Promise.resolve(entry.value as T);
  }

  // Someone already asked for this and is still waiting. Wait with them.
  const pending = store.inFlight.get(key);
  if (pending) {
    store.hits += 1;
    return pending as Promise<T>;
  }

  store.misses += 1;

  const request = load()
    .then((value) => {
      store.entries.set(key, {
        value,
        failed: false,
        expiresAt: Date.now() + ttlFor(options.ttlSeconds) * 1000,
        tags: options.tags,
      });
      return value;
    })
    .catch((error: unknown) => {
      store.entries.set(key, {
        value: error,
        failed: true,
        expiresAt: Date.now() + ERROR_TTL_SECONDS * 1000,
        tags: options.tags,
      });
      throw error;
    })
    .finally(() => {
      store.inFlight.delete(key);
      prune();
    });

  store.inFlight.set(key, request);
  return request;
}

/**
 * Forget every entry carrying one of `tags`. Returns how many were dropped, so
 * the revalidate route can report whether the tag matched anything.
 */
export function invalidateTags(tags: readonly string[]): number {
  const wanted = new Set(tags);
  if (wanted.has(CACHE_TAG.all)) {
    const size = store.entries.size;
    store.entries.clear();
    return size;
  }

  let dropped = 0;
  for (const [key, entry] of store.entries) {
    if (entry.tags.some((tag) => wanted.has(tag))) {
      store.entries.delete(key);
      dropped += 1;
    }
  }
  return dropped;
}

/** Everything, unconditionally. */
export function clearCache(): number {
  const size = store.entries.size;
  store.entries.clear();
  return size;
}

/** Hit rate and contents, for the debug endpoint and for tests. */
export function cacheStats() {
  const now = Date.now();
  return {
    enabled: !CACHE_DISABLED,
    entries: store.entries.size,
    inFlight: store.inFlight.size,
    hits: store.hits,
    misses: store.misses,
    keys: [...store.entries].map(([key, entry]) => ({
      key,
      failed: entry.failed,
      expiresInMs: Math.max(entry.expiresAt - now, 0),
      tags: [...entry.tags],
    })),
  };
}

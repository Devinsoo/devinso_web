/**
 * Uploaded files are stored by the admin panel and served from its own origin,
 * so the API hands us absolute URLs like
 * `https://panel.devinso.ir/uploads/members/<guid>.jpg`.
 *
 * Those must never reach the browser. Putting them in a page means every
 * visitor — and every crawler — learns the panel's hostname from an <img> tag,
 * which is one guessed path away from the login form. So every upload URL in
 * an API response is rewritten to a path on *our* origin, which
 * `next.config.ts` rewrites back onto the panel server-side. The panel's
 * address then exists only in an env var and in traffic between containers.
 *
 * The same-origin path is also what makes `next/image` work here: the
 * optimiser treats `/uploads/...` as a local image and fetches it through our
 * own rewrite, so it needs no `remotePatterns` entry and no route out to the
 * public internet.
 */

/**
 * Prefix the browser sees for an upload. Deliberately identical to the path
 * the panel stores, so a relative path from the API (`Media:BaseUrl` unset) and
 * an absolute one (`Media:BaseUrl` set) end up as the same URL.
 */
export const UPLOADS_PATH_PREFIX = "/uploads/";

/**
 * Strips the origin off an upload URL, leaving a same-origin path.
 *
 * Matching is on the *path*, not on a configured origin: in production the
 * origin the API advertises (a public hostname behind the CDN) and the one we
 * fetch from (a container on the internal network) are not the same string, and
 * a mismatch there would silently leak the panel's address instead of failing.
 * Anything that is not an upload URL is returned untouched.
 */
export function toSameOriginUpload(value: string): string {
  // Already a same-origin path, or not a URL at all.
  if (!/^https?:\/\//i.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }

  if (!url.pathname.startsWith(UPLOADS_PATH_PREFIX)) return value;

  // Query and hash are dropped: uploads are static files addressed by a GUID
  // filename, so neither carries meaning, and keeping them would let the API
  // smuggle a tracking parameter into the page.
  return url.pathname;
}

/**
 * Applies {@link toSameOriginUpload} to every string in a parsed API response.
 *
 * Walking the whole payload rather than naming fields is on purpose: upload
 * URLs arrive as `avatarUrl`, `coverImageUrl` and `imageUrl` today, nested at
 * several depths, and a field added to the API later must not reintroduce the
 * leak by being forgotten here. Responses are small — a page's worth of
 * content — so the walk costs nothing worth measuring.
 */
export function withSameOriginUploads<T>(payload: T): T {
  if (typeof payload === "string") {
    return toSameOriginUpload(payload) as T;
  }

  if (Array.isArray(payload)) {
    return payload.map(withSameOriginUploads) as T;
  }

  // Only plain objects from JSON.parse get walked; anything exotic is left be.
  if (payload !== null && typeof payload === "object") {
    const source = payload as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const key in source) {
      result[key] = withSameOriginUploads(source[key]);
    }

    return result as T;
  }

  return payload;
}

/**
 * On-demand cache invalidation, for the admin panel to call after a publish.
 *
 * Without it the only way to see an edit is to wait out the TTL, which for site
 * settings is fifteen minutes. With it, publishing is followed by one POST and
 * the next visitor gets the new content.
 *
 *   curl -X POST http://localhost:4000/api/revalidate \
 *        -H 'authorization: Bearer <DEVINSO_REVALIDATE_SECRET>' \
 *        -H 'content-type: application/json' \
 *        -d '{"tags":["devinso:project:atlas"]}'
 *
 * Both caching layers are dropped together: `invalidateTags` clears this
 * process's memory, `revalidateTag` clears Next's data cache. Clearing one and
 * not the other leaves the stale copy to win.
 */
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CACHE_TAG, cacheStats, invalidateTags } from "@/lib/api/cache";

/** The route mutates server state; it must never be prerendered or cached. */
export const dynamic = "force-dynamic";

const SECRET = process.env.DEVINSO_REVALIDATE_SECRET;

/** Tag names the caller may ask for, by their short form. */
const NAMED_TAGS: Record<string, string> = {
  all: CACHE_TAG.all,
  site: CACHE_TAG.site,
  members: CACHE_TAG.members,
  projects: CACHE_TAG.projects,
  openings: CACHE_TAG.openings,
};

function presentedSecret(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return request.headers.get("x-devinso-revalidate-secret");
}

/**
 * Constant-time-ish comparison. The secret is a deploy-time value rather than a
 * user password, but a length check plus a full-string walk costs nothing.
 */
function secretMatches(presented: string | null): boolean {
  if (!SECRET || !presented || presented.length !== SECRET.length) return false;

  let diff = 0;
  for (let i = 0; i < SECRET.length; i += 1) {
    diff |= SECRET.charCodeAt(i) ^ presented.charCodeAt(i);
  }
  return diff === 0;
}

/** `["site", "devinso:project:atlas"]` → fully qualified tags. */
function resolveTags(raw: unknown): string[] {
  const values = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];

  const tags = values
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .map((value) => NAMED_TAGS[value] ?? value);

  // No tag named means "everything": the common case after a bulk import.
  return tags.length > 0 ? tags : [CACHE_TAG.all];
}

export async function POST(request: Request) {
  if (!SECRET) {
    // Refusing beats defaulting to open: an unauthenticated cache-buster is a
    // free way to make the site hammer the API.
    return NextResponse.json(
      { revalidated: false, error: "DEVINSO_REVALIDATE_SECRET is not configured." },
      { status: 503 },
    );
  }

  if (!secretMatches(presentedSecret(request))) {
    return NextResponse.json({ revalidated: false, error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}));
  const requested = (body as { tags?: unknown }).tags ?? url.searchParams.getAll("tag");
  const tags = resolveTags(requested);

  const dropped = invalidateTags(tags);

  for (const tag of tags) {
    // "max" serves the stale copy while the refetch runs, so an invalidation
    // never makes a visitor wait on the API.
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: true, tags, droppedFromMemory: dropped });
}

/** Cache contents, for working out why a page is showing what it is showing. */
export async function GET(request: Request) {
  if (!SECRET || !secretMatches(presentedSecret(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(cacheStats());
}

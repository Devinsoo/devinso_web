/**
 * One function per API endpoint. Nothing here maps to UI types — that happens
 * in `lib/content/*`, so this module stays a faithful mirror of the API.
 */
import { ApiError, apiGetOrNull, apiPost } from "@/lib/api/client";
import { CACHE_TAG, CACHE_TTL } from "@/lib/api/cache";
import { API_ORIGIN, API_TIMEOUT_MS } from "@/lib/api/config";
import type {
  ApiMemberProfile,
  ApiMemberProject,
  ApiMemberSummary,
  ApiOpeningDetail,
  ApiOpeningSummary,
  ApiProjectDetail,
  ApiProjectSummary,
  ApiProjectType,
  ApiSiteSettings,
  JoinApplicationSubmission,
  ProjectRequestSubmission,
  SubmissionAccepted,
} from "@/lib/api/types";

// ----------------------------------------------------------------- reads ---
//
// Every read is cached and tagged; `lib/api/cache.ts` explains the layers and
// holds the lifetimes. A read tagged both `members` and `member:<handle>` can
// be dropped by the collection or on its own, so editing one profile in the
// admin panel need not expire the whole roster.

export function fetchSiteSettings() {
  return apiGetOrNull<ApiSiteSettings>("/site", {
    revalidate: CACHE_TTL.site,
    tags: [CACHE_TAG.site],
  });
}

export function fetchMembers() {
  return apiGetOrNull<ApiMemberSummary[]>("/members", {
    revalidate: CACHE_TTL.members,
    tags: [CACHE_TAG.members],
  });
}

/**
 * A profile by username (how the site links to it) or by id. Null when the
 * member is unpublished, unknown, or the API is down.
 */
export function fetchMember(handle: string) {
  return apiGetOrNull<ApiMemberProfile>(`/members/${encodeURIComponent(handle)}`, {
    revalidate: CACHE_TTL.members,
    tags: [CACHE_TAG.members, CACHE_TAG.member(handle)],
  });
}

export function fetchMemberProjects(handle: string) {
  return apiGetOrNull<ApiMemberProject[]>(`/members/${encodeURIComponent(handle)}/projects`, {
    revalidate: CACHE_TTL.memberProjects,
    // Tagged with projects too: publishing a project changes this list.
    tags: [CACHE_TAG.members, CACHE_TAG.member(handle), CACHE_TAG.projects],
  });
}

export function fetchProjects(options: { featured?: boolean; type?: ApiProjectType } = {}) {
  return apiGetOrNull<ApiProjectSummary[]>("/projects", {
    query: { featured: options.featured, type: options.type },
    revalidate: CACHE_TTL.projects,
    // The filters are part of the cache key, so each variant caches separately
    // while one tag still clears all of them.
    tags: [CACHE_TAG.projects],
  });
}

export function fetchProject(slug: string) {
  return apiGetOrNull<ApiProjectDetail>(`/projects/${encodeURIComponent(slug)}`, {
    revalidate: CACHE_TTL.project,
    tags: [CACHE_TAG.projects, CACHE_TAG.project(slug)],
  });
}

export function fetchOpenings() {
  return apiGetOrNull<ApiOpeningSummary[]>("/openings", {
    revalidate: CACHE_TTL.openings,
    tags: [CACHE_TAG.openings],
  });
}

export function fetchOpening(id: string) {
  return apiGetOrNull<ApiOpeningDetail>(`/openings/${encodeURIComponent(id)}`, {
    revalidate: CACHE_TTL.opening,
    tags: [CACHE_TAG.openings, CACHE_TAG.opening(id)],
  });
}

// ---------------------------------------------------------------- writes ---
//
// Writes throw rather than degrading: a submitted form that quietly vanished is
// worse than an error the user can act on. Both are rate limited server-side
// (5 per 10 minutes per IP), which surfaces here as an ApiError with status 429.

export function submitProjectRequest(submission: ProjectRequestSubmission) {
  return apiPost<SubmissionAccepted>("/project-requests", submission);
}

export function submitJoinApplication(openingId: string, submission: JoinApplicationSubmission) {
  return apiPost<SubmissionAccepted>(
    `/openings/${encodeURIComponent(openingId)}/applications`,
    submission,
  );
}

/**
 * Liveness check used by `npm run check:api`. Server-side only: /health sits at
 * the API root rather than under /api/v1, so it skips the versioned base.
 * Throws if the API is not up.
 */
export async function fetchHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_ORIGIN}/health`, {
    cache: "no-store",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new ApiError(`Health check failed: ${response.status}`, response.status, "/health");
  }

  return (await response.json()) as { status: string };
}

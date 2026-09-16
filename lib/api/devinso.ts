/**
 * One function per API endpoint. Nothing here maps to UI types — that happens
 * in `lib/content/*`, so this module stays a faithful mirror of the API.
 */
import { ApiError, apiGetOrNull, apiPost } from "@/lib/api/client";
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

export function fetchSiteSettings() {
  return apiGetOrNull<ApiSiteSettings>("/site");
}

export function fetchMembers() {
  return apiGetOrNull<ApiMemberSummary[]>("/members");
}

/**
 * A profile by username (how the site links to it) or by id. Null when the
 * member is unpublished, unknown, or the API is down.
 */
export function fetchMember(handle: string) {
  return apiGetOrNull<ApiMemberProfile>(`/members/${encodeURIComponent(handle)}`);
}

export function fetchMemberProjects(handle: string) {
  return apiGetOrNull<ApiMemberProject[]>(`/members/${encodeURIComponent(handle)}/projects`);
}

export function fetchProjects(options: { featured?: boolean; type?: ApiProjectType } = {}) {
  return apiGetOrNull<ApiProjectSummary[]>("/projects", {
    query: { featured: options.featured, type: options.type },
  });
}

export function fetchProject(slug: string) {
  return apiGetOrNull<ApiProjectDetail>(`/projects/${encodeURIComponent(slug)}`);
}

export function fetchOpenings() {
  return apiGetOrNull<ApiOpeningSummary[]>("/openings");
}

export function fetchOpening(id: string) {
  return apiGetOrNull<ApiOpeningDetail>(`/openings/${encodeURIComponent(id)}`);
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

import { fetchProjects } from "@/lib/api/devinso";
import type { ProjectDetail } from "@/lib/project-details";
import { toDateOnly } from "@/lib/content/dates";

/**
 * The "next project" teaser at the bottom of a project page reads four fields:
 * slug, position, title and accent. Building those from the already-cheap
 * project list avoids fetching a second full project just to render a link.
 */
export async function loadNextProject(currentSlug: string): Promise<ProjectDetail | null> {
  const projects = await fetchProjects();
  if (!projects || projects.length === 0) return null;

  const index = projects.findIndex((project) => project.slug === currentSlug);
  if (index < 0) return null;

  const next = projects[(index + 1) % projects.length];
  const position = ((index + 1) % projects.length) + 1;

  // Only the fields the teaser reads are meaningful here; the rest satisfy the
  // shared ProjectDetail shape and are never rendered on that link.
  return {
    id: position,
    slug: next.slug,
    title: next.title,
    titleFa: next.titleFa ?? next.title,
    description: "",
    descriptionFa: "",
    content: [],
    coverImage: next.coverImageUrl ?? null,
    coverAlt: null,
    projectUrl: null,
    githubUrl: null,
    techStack: [],
    type: next.type === "Personal" ? "PERSONAL" : "TEAM",
    status: "PUBLISHED",
    createdBy: { id: 0, fullName: "" },
    members: [],
    createdAt: toDateOnly(next.createdAt),
    updatedAt: toDateOnly(next.createdAt),
    accent: "#ff5147",
    accentSoft: "rgba(255,81,71,.16)",
    preview: "identity",
  };
}

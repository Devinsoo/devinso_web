import { fetchProject, fetchProjects } from "@/lib/api/devinso";
import type {
  ApiContentBlock,
  ApiMemberProject,
  ApiProjectDetail,
  ApiProjectMember,
  ApiProjectRole,
} from "@/lib/api/types";
import type { MemberProject } from "@/components/Profile/types";
import { toDateOnly } from "@/lib/content/dates";
import { ACCENTS, toAccentKey } from "@/lib/accents";
import type {
  ProjectContentBlock,
  ProjectDetail,
  ProjectMemberRole,
} from "@/lib/project-details";

/**
 * Maps API projects onto the shapes the project UI already speaks.
 *
 * The accent is the colour picked for the project in the admin panel. The
 * preview treatment has no column behind it, so it is chosen from the slug and
 * a given project always renders the same way.
 */

const ROLES: Record<ApiProjectRole, ProjectMemberRole> = {
  Lead: "LEAD",
  Creator: "LEAD",
  Developer: "DEVELOPER",
  Designer: "DESIGNER",
  Strategy: "STRATEGY",
  ProjectManager: "STRATEGY",
  Analyst: "CONTRIBUTOR",
  QA: "CONTRIBUTOR",
  Contributor: "CONTRIBUTOR",
};

const PREVIEWS = ["allixro", "automation", "identity"] as const;

/** Stable per slug, so a project does not change appearance between renders. */
function previewFor(slug: string): (typeof PREVIEWS)[number] {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  return PREVIEWS[hash % PREVIEWS.length];
}

function blockFor(block: ApiContentBlock): ProjectContentBlock | null {
  switch (block.type) {
    case "heading":
      return { type: "heading", text: block.text ?? "", textFa: block.textFa ?? block.text ?? "" };

    // The API calls it "text" because the box stores rich text; the UI calls
    // the same thing a paragraph.
    case "text":
      return { type: "paragraph", text: block.text ?? "", textFa: block.textFa ?? block.text ?? "" };

    case "image":
      return {
        type: "image",
        src: block.imageUrl ?? "",
        alt: block.caption ?? "",
        altFa: block.captionFa ?? block.caption ?? "",
        caption: block.caption,
        captionFa: block.captionFa,
      };

    case "quote":
      return {
        type: "quote",
        text: block.text ?? "",
        textFa: block.textFa ?? block.text ?? "",
        byline: block.caption,
        bylineFa: block.captionFa,
      };

    case "video":
      return {
        type: "video",
        src: block.url ?? null,
        caption: block.caption,
        captionFa: block.captionFa,
      };

    case "embed":
      return {
        type: "embed",
        label: block.caption ?? block.url ?? "",
        labelFa: block.captionFa ?? block.caption ?? "",
        url: block.url ?? null,
      };

    default:
      // An unknown block type means the API grew one the site does not render
      // yet; skipping it beats crashing the page.
      return null;
  }
}

function memberFor(member: ApiProjectMember, index: number) {
  return {
    id: index + 1,
    fullName: member.fullName,
    fullNameFa: member.fullNameFa,
    username: member.username,
    roleType: member.role ? (ROLES[member.role] ?? "CONTRIBUTOR") : "CONTRIBUTOR",
    role: member.jobTitle ?? "",
    roleFa: member.jobTitleFa,
    // No per-project blurb or join date in the schema yet.
    description: null,
    avatar: member.avatarUrl ?? null,
    joinedAt: null,
  };
}

function toProjectDetail(project: ApiProjectDetail): ProjectDetail {
  // The lead is whoever holds the lead role; failing that, the first member
  // credited on the project.
  const lead = project.members.find((member) => member.role === "Lead" || member.role === "Creator")
    ?? project.members[0];

  const palette = ACCENTS[toAccentKey(project.accent)];

  return {
    id: 0,
    slug: project.slug,
    title: project.title,
    titleFa: project.titleFa ?? project.title,
    description: project.description ?? "",
    descriptionFa: project.descriptionFa ?? project.description ?? "",
    content: project.content
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(blockFor)
      .filter((block): block is ProjectContentBlock => block !== null),
    coverImage: project.coverImageUrl ?? null,
    coverAlt: project.media[0]?.altText ?? project.media[0]?.title ?? null,
    coverAltFa: project.media[0]?.altTextFa ?? project.media[0]?.title ?? null,
    projectUrl: project.projectUrl ?? null,
    githubUrl: project.repositoryUrl ?? null,
    techStack: project.techStack.map((tool) => tool.name),
    type: project.type === "Personal" ? "PERSONAL" : "TEAM",

    // Only published projects are reachable through the public API at all.
    status: "PUBLISHED",

    createdBy: { id: 0, fullName: lead?.fullName ?? "", fullNameFa: lead?.fullNameFa },
    members: project.members.map(memberFor),
    createdAt: toDateOnly(project.createdAt),
    updatedAt: toDateOnly(project.updatedAt ?? project.createdAt),
    accent: palette.strong,
    accentDeep: palette.deep,
    accentSoft: palette.soft,
    preview: previewFor(project.slug),
  };
}

/** Projects on a member's profile, with what that member did on each. */
export function toMemberProjects(projects: ApiMemberProject[]): MemberProject[] {
  return projects.map((project, index) => ({
    id: index + 1,
    title: project.title,
    titleFa: project.titleFa,
    slug: project.slug,
    description: project.description ?? "",
    descriptionFa: project.descriptionFa,
    featured: project.isFeatured,
    accent: toAccentKey(project.accent),
    coverImage: project.coverImageUrl,
    projectUrl: project.projectUrl,
    githubUrl: project.repositoryUrl,
    techStack: project.techStack.map((tool) => tool.name),
    type: project.type === "Personal" ? "PERSONAL" : "TEAM",
    status: "PUBLISHED",
    createdAt: toDateOnly(project.createdAt),
    membership: {
      role: project.membership.role ?? "",
      roleFa: project.membership.roleFa,
    },
    // `outcome` has no column behind it; the card omits that block.
  }));
}

/**
 * One project by slug, or null when it is unpublished, unknown, or the API is
 * down.
 */
export async function loadProjectDetail(slug: string): Promise<ProjectDetail | null> {
  const project = await fetchProject(slug);
  return project ? toProjectDetail(project) : null;
}

/** Published project slugs, for the next/previous link on a project page. */
export async function loadProjectSlugs(): Promise<string[]> {
  const projects = await fetchProjects();
  return projects?.map((project) => project.slug) ?? [];
}

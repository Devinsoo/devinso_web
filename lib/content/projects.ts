import { fetchProject, fetchProjects } from "@/lib/api/devinso";
import type {
  ApiContentBlock,
  ApiMemberProject,
  ApiProjectDetail,
  ApiProjectMember,
  ApiProjectRole,
} from "@/lib/api/types";
import type { MemberProject } from "@/components/Profile/types";
import type {
  ProjectContentBlock,
  ProjectDetail,
  ProjectMemberRole,
} from "@/lib/project-details";

/**
 * Maps API projects onto the shapes the project UI already speaks.
 *
 * Three presentation fields have no column behind them - `accent`,
 * `accentSoft` and `preview`. Rather than inventing content, the accent is
 * taken from the project lead's own accent colour, and the preview treatment is
 * chosen from the slug so a given project always renders the same way.
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

const ACCENT_PALETTE = {
  crimson: { accent: "#ff5147", accentSoft: "rgba(255,81,71,.16)" },
  violet: { accent: "#8d7dff", accentSoft: "rgba(141,125,255,.16)" },
  ice: { accent: "#8be7ff", accentSoft: "rgba(139,231,255,.14)" },
} as const;

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
    roleType: member.role ? (ROLES[member.role] ?? "CONTRIBUTOR") : "CONTRIBUTOR",
    role: member.jobTitle ?? "",
    // No per-project blurb or join date in the schema yet.
    description: null,
    avatar: member.avatarUrl ?? null,
    joinedAt: null,
  };
}

function toProjectDetail(project: ApiProjectDetail, accentKey: keyof typeof ACCENT_PALETTE): ProjectDetail {
  // The lead is whoever holds the lead role; failing that, the first member
  // credited on the project.
  const lead = project.members.find((member) => member.role === "Lead" || member.role === "Creator")
    ?? project.members[0];

  const palette = ACCENT_PALETTE[accentKey];

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
    projectUrl: project.projectUrl ?? null,
    githubUrl: project.repositoryUrl ?? null,
    techStack: project.techStack.map((tool) => tool.name),
    type: project.type === "Personal" ? "PERSONAL" : "TEAM",

    // Only published projects are reachable through the public API at all.
    status: "PUBLISHED",

    createdBy: { id: 0, fullName: lead?.fullName ?? "" },
    members: project.members.map(memberFor),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt ?? project.createdAt,
    accent: palette.accent,
    accentSoft: palette.accentSoft,
    preview: previewFor(project.slug),
  };
}

/** Projects on a member's profile, with what that member did on each. */
export function toMemberProjects(projects: ApiMemberProject[]): MemberProject[] {
  return projects.map((project, index) => ({
    id: index + 1,
    title: project.title,
    description: project.description ?? "",
    descriptionFa: project.descriptionFa,
    featured: project.isFeatured,
    coverImage: project.coverImageUrl,
    projectUrl: project.projectUrl,
    githubUrl: project.repositoryUrl,
    techStack: project.techStack.map((tool) => tool.name),
    type: project.type === "Personal" ? "PERSONAL" : "TEAM",
    status: "PUBLISHED",
    createdAt: project.createdAt,
    membership: {
      role: project.membership.role ?? "",
      roleFa: project.membership.roleFa,
    },
    // `outcome` has no column behind it; the card omits that block.
  }));
}

/**
 * One project by slug, or null when it is unpublished, unknown, or the API is
 * down. The accent comes from the lead member's own colour, which is why the
 * roster is consulted alongside the project.
 */
export async function loadProjectDetail(
  slug: string,
  accentByUsername: Map<string, keyof typeof ACCENT_PALETTE> = new Map(),
): Promise<ProjectDetail | null> {
  const project = await fetchProject(slug);
  if (!project) return null;

  const lead = project.members.find((member) => member.role === "Lead" || member.role === "Creator")
    ?? project.members[0];

  const accentKey = (lead?.username && accentByUsername.get(lead.username)) || "crimson";

  return toProjectDetail(project, accentKey);
}

/** Published project slugs, for the next/previous link on a project page. */
export async function loadProjectSlugs(): Promise<string[]> {
  const projects = await fetchProjects();
  return projects?.map((project) => project.slug) ?? [];
}

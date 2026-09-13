import { fetchProjects } from "@/lib/api/devinso";
import type { ApiProjectSummary } from "@/lib/api/types";
import { toDateOnly } from "@/lib/content/dates";
import type { WorkProject } from "@/components/Work/SelectedWork";

/**
 * The home page work rail: published team projects, mapped onto the card shape
 * the rail already renders.
 *
 * Four of those fields describe how a card behaves rather than what it says —
 * `accent`, `morph`, `layout` and the fallback `preview`. The database holds
 * none of them, so they cycle by position, which reproduces the rhythm the
 * section was designed with (expand, then split, then depth) and keeps going
 * for a fourth project and beyond. Cycling by position rather than by slug
 * matters here: neighbouring cards must differ, or the rail reads as repetitive.
 */

const ACCENTS = ["crimson", "violet", "ice"] as const;
const MORPHS = ["expand", "split", "depth"] as const;
const LAYOUTS = ["media-right", "media-left", "stacked"] as const;
const PREVIEWS = ["automation", "identity"] as const;

/** The stack line is one row on the card, so a long toolchain gets trimmed. */
const MAX_STACK_ITEMS = 4;

const EMPTY = "—";

const TYPE_LABEL = {
  Team: { en: "Team project", fa: "پروژه تیمی" },
  Personal: { en: "Personal project", fa: "پروژه شخصی" },
} as const;

function toWorkProject(project: ApiProjectSummary, index: number): WorkProject {
  const stack = project.techStack.map((tool) => tool.name).slice(0, MAX_STACK_ITEMS);

  // Categories come from the toolchain the project is built with; a project
  // with no tools recorded falls back to naming what kind of project it is.
  const categories = [...new Set(project.techStack.map((tool) => tool.category).filter(Boolean))];
  const category = categories.length > 0 ? categories.join(" / ") : TYPE_LABEL[project.type].en;
  const categoryFa = categories.length > 0 ? categories.join(" / ") : TYPE_LABEL[project.type].fa;

  // A project with nobody credited, or nothing in its stack, still renders a
  // labelled row on the card. An em dash reads as "not recorded"; an empty
  // string reads as a broken card.
  const roles = project.roles.map((entry) => entry.role).join(" + ") || EMPTY;
  const rolesFa = project.roles.map((entry) => entry.roleFa).join(" + ") || EMPTY;

  return {
    id: project.id,
    slug: project.slug,
    number: String(index + 1).padStart(2, "0"),
    title: project.title,
    titleFa: project.titleFa ?? project.title,
    category,
    categoryFa,
    description: project.description ?? "",
    descriptionFa: project.descriptionFa ?? project.description ?? "",
    role: roles,
    roleFa: rolesFa,
    stack: stack.length > 0 ? stack : [EMPTY],
    year: toDateOnly(project.createdAt).slice(0, 4),
    accent: ACCENTS[index % ACCENTS.length],
    morph: MORPHS[index % MORPHS.length],
    layout: LAYOUTS[index % LAYOUTS.length],

    // The preview illustration only stands in for a missing cover.
    preview: project.coverImageUrl ? undefined : PREVIEWS[index % PREVIEWS.length],
    coverImage: project.coverImageUrl,
    coverAlt: project.coverImageUrl ? project.title : undefined,
  };
}

/**
 * Published team work for the rail. Null when the API is unreachable, so the
 * section can keep its bundled projects rather than rendering an empty rail.
 */
export async function loadSelectedWork(): Promise<WorkProject[] | null> {
  const projects = await fetchProjects({ type: "Team" });
  if (!projects || projects.length === 0) return null;

  return projects.map(toWorkProject);
}

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/components/Projects/ProjectDetailPage";
import {
  PROJECT_DETAILS,
  getProjectDetail,
  type ProjectDetail,
} from "@/lib/project-details";
import {
  DEVINSO_COOKIE,
  type DevinsoLanguage,
  type DevinsoTheme,
} from "@/lib/preferences";
import { loadAccentsByUsername } from "@/lib/content/members";
import { loadProjectDetail } from "@/lib/content/projects";
import { loadNextProject } from "@/lib/content/navigation";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Live project first, bundled project second — same rule as the member page, so
 * the site keeps rendering while the API is stopped.
 *
 * A project carries no accent colour of its own, so the lead member's accent is
 * used; that is why the roster is fetched alongside it.
 */
async function resolveProject(slug: string): Promise<ProjectDetail | undefined> {
  // The roster read is started without awaiting it, so it overlaps the project
  // read rather than queueing behind it; `loadProjectDetail` awaits both.
  const live = await loadProjectDetail(slug, loadAccentsByUsername());

  return live ?? getProjectDetail(slug);
}

/** Picks the teaser from an already-resolved live answer, or the bundled list. */
function pickNextProject(
  slug: string,
  current: ProjectDetail,
  live: ProjectDetail | null,
): ProjectDetail {
  if (live) return live;

  // Bundled fallback: the next entry in the bundled list, wrapping around.
  const index = PROJECT_DETAILS.findIndex((item) => item.slug === slug);
  if (index < 0) return current;

  return PROJECT_DETAILS[(index + 1) % PROJECT_DETAILS.length];
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolveProject(slug);

  if (!project) {
    return { title: "Project not found | Devinso" };
  }

  return {
    title: `${project.title} | Devinso`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Devinso`,
      description: project.description,
      type: "article",
      images: [],
    },
    twitter: {
      card: "summary",
      title: `${project.title} | Devinso`,
      description: project.description,
      images: [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  // The project, the teaser's project list and the cookies are independent of
  // one another, so all three are started together. Previously each awaited the
  // one before it, making the page cost the sum of the round trips rather than
  // the slowest of them.
  const [project, liveNextProject, cookieStore] = await Promise.all([
    resolveProject(slug),
    loadNextProject(slug),
    cookies(),
  ]);

  if (!project) notFound();

  const rawTheme = cookieStore.get(DEVINSO_COOKIE.theme)?.value;
  const rawLanguage = cookieStore.get(DEVINSO_COOKIE.language)?.value;
  const initialTheme: DevinsoTheme = rawTheme === "light" ? "light" : "dark";
  const initialLanguage: DevinsoLanguage = rawLanguage === "fa" ? "fa" : "en";

  const nextProject = pickNextProject(slug, project, liveNextProject);

  return (
    <ProjectDetailPage
      project={project}
      nextProject={nextProject}
      initialTheme={initialTheme}
      initialLanguage={initialLanguage}
    />
  );
}

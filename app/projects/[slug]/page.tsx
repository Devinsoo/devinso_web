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
import { loadProjectDetail } from "@/lib/content/projects";
import { loadNextProject } from "@/lib/content/navigation";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Live project first, bundled project second — same rule as the member page, so
 * the site keeps rendering while the API is stopped.
 */
async function resolveProject(slug: string): Promise<ProjectDetail | undefined> {
  const live = await loadProjectDetail(slug);

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
  const [project, cookieStore] = await Promise.all([resolveProject(slug), cookies()]);
  const fa = cookieStore.get(DEVINSO_COOKIE.language)?.value === "fa";

  // Bare titles: the root layout's template already appends "· Devinso".
  if (!project) {
    return { title: fa ? "پروژه پیدا نشد" : "Project not found" };
  }

  const title = (fa && project.titleFa) || project.title;
  const description = (fa && project.descriptionFa) || project.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} · Devinso`,
      description,
      type: "article",
      images: [],
    },
    twitter: {
      card: "summary",
      title: `${title} · Devinso`,
      description,
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

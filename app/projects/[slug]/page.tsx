import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/components/Projects/ProjectDetailPage";
import {
  PROJECT_DETAILS,
  getProjectDetail,
} from "@/lib/project-details";
import {
  DEVINSO_COOKIE,
  type DevinsoLanguage,
  type DevinsoTheme,
} from "@/lib/preferences";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectDetail(slug);

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
  const projectIndex = PROJECT_DETAILS.findIndex((item) => item.slug === slug);
  const project = PROJECT_DETAILS[projectIndex];

  if (!project) notFound();

  const cookieStore = await cookies();
  const rawTheme = cookieStore.get(DEVINSO_COOKIE.theme)?.value;
  const rawLanguage = cookieStore.get(DEVINSO_COOKIE.language)?.value;
  const initialTheme: DevinsoTheme = rawTheme === "light" ? "light" : "dark";
  const initialLanguage: DevinsoLanguage = rawLanguage === "fa" ? "fa" : "en";
  const nextProject = PROJECT_DETAILS[(projectIndex + 1) % PROJECT_DETAILS.length];

  return (
    <ProjectDetailPage
      project={project}
      nextProject={nextProject}
      initialTheme={initialTheme}
      initialLanguage={initialLanguage}
    />
  );
}

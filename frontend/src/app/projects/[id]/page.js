import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

async function getProject(id) {
  const response = await fetch(
    `http://localhost:5000/api/projects/${id}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  const result = await response.json();
  return result.data;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: "Project Not Found | TaskFlow",
      description: "The requested TaskFlow project could not be found.",
    };
  }

  return {
    title: `${project.title} | TaskFlow`,
    description:
      project.description || "View this TaskFlow project and its details.",
  };
}

async function ProjectDetails({ params }) {
  const { id } = await params;

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <article>
      <h1>{project.title}</h1>

      <p>{project.description}</p>

      <p>
        <strong>Status:</strong> {project.status}
      </p>

      <p>
        <strong>Project ID:</strong> {project.id}
      </p>

      <p>
        <strong>User ID:</strong> {project.user_id}
      </p>
    </article>
  );
}

export default function ProjectDetailPage({ params }) {
  return (
    <main>
      <Link href="/projects">← Back to Projects</Link>

      <Suspense fallback={<p>Loading project...</p>}>
        <ProjectDetails params={params} />
      </Suspense>
    </main>
  );
}
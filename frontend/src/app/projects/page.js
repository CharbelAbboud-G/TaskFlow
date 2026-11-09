export const metadata = {
  title: "Projects | TaskFlow",
  description: "Browse TaskFlow projects and view project details.",
};

import { Suspense } from "react";
import ProjectCard from "@/components/ProjectCard";
import { API_BASE_URL } from "@/lib/api";

async function getProjects() {
  const response = await fetch(
    `${API_BASE_URL}/projects`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const result = await response.json();
  return result.data;
}

async function ProjectsList() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <article>
        <h2>No projects found</h2>
        <p>There are currently no projects available.</p>
      </article>
    );
  }

  return (
    <div>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <main>
      <h1>Projects</h1>

      <Suspense fallback={<p>Loading projects...</p>}>
        <ProjectsList />
      </Suspense>
    </main>
  );
}
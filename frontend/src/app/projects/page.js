export const metadata = {
  title: "Projects | TaskFlow",
  description: "Browse TaskFlow projects and view project details.",
};

import { Suspense } from "react";
import ProjectCard from "@/components/ProjectCard";

async function getProjects() {
  const response = await fetch(
    "http://localhost:5000/api/projects",
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

  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
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
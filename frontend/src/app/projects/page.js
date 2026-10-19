import { Suspense } from "react";

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
        <article key={project.id}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p>Status: {project.status}</p>
        </article>
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
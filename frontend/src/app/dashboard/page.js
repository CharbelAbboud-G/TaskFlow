import Link from "next/link";
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

async function getTasks() {
  const response = await fetch(
    "http://localhost:5000/api/tasks",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const result = await response.json();
  return result.data;
}

async function DashboardData() {
  const [projects, tasks] = await Promise.all([
    getProjects(),
    getTasks(),
  ]);

  return (
    <>
      <section>
        <h2>Projects</h2>

        {projects.map((project) => (
          <div key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Status: {project.status}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Tasks</h2>

        {tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main>
      <h1>TaskFlow Dashboard</h1>

      <nav>
        <Link href="/">Home</Link>
        {" | "}
        <Link href="/projects">Projects</Link>
        {" | "}
        <Link href="/tasks">Tasks</Link>
      </nav>

      <Suspense fallback={<p>Loading dashboard data...</p>}>
        <DashboardData />
      </Suspense>
    </main>
  );
}
import { Suspense } from "react";

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

async function TasksList() {
  const tasks = await getTasks();

  return (
    <div>
      {tasks.map((task) => (
        <article key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>
          <p>Project ID: {task.project_id}</p>
        </article>
      ))}
    </div>
  );
}

export default function TasksPage() {
  return (
    <main>
      <h1>Tasks</h1>

      <Suspense fallback={<p>Loading tasks...</p>}>
        <TasksList />
      </Suspense>
    </main>
  );
}
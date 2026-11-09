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

  if (tasks.length === 0) {
    return (
      <article>
        <h2>No tasks found</h2>
        <p>There are currently no tasks available.</p>
      </article>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <article key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Project ID:</strong> {task.project_id}
          </p>
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
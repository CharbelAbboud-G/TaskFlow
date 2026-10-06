import { useEffect, useState } from "react";
import { authFetch } from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [projectId, setProjectId] = useState("");

  const [userId, setUserId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const response = await authFetch("/tasks");
      const result = await response.json();

      if (response.ok) {
        setTasks(result.data);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await authFetch("/projects");
      const result = await response.json();

      if (response.ok) {
        setProjects(result.data);

        if (result.data.length > 0 && !projectId) {
          setProjectId(result.data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const response = await authFetch("/auth/me");
      const result = await response.json();

      if (response.ok) {
        setUserId(result.user.id);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
    loadCurrentUser();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("medium");
    setEditingTaskId(null);

    if (projects.length > 0) {
      setProjectId(projects[0].id);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      let response;

      if (editingTaskId) {
        response = await authFetch(`/tasks/${editingTaskId}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            description,
            status,
            priority,
            project_id: Number(projectId),
            assigned_user_id: userId,
          }),
        });
      } else {
        response = await authFetch("/tasks", {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            status,
            priority,
            project_id: Number(projectId),
            assigned_user_id: userId,
          }),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (editingTaskId
              ? "Failed to update task"
              : "Failed to create task")
        );
      }

      resetForm();
      await loadTasks();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);
    setProjectId(task.project_id);
  };

  const handleDeleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await authFetch(`/tasks/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete task");
      }

      if (editingTaskId === id) {
        resetForm();
      }

      await loadTasks();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Tasks</h1>

      <h2>{editingTaskId ? "Edit Task" : "Create Task"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>

          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label>Priority</label>

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label>Project</label>

          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            required
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">
          {editingTaskId ? "Update Task" : "Create Task"}
        </button>

        {editingTaskId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}

        {error && <p>{error}</p>}
      </form>

      <h2>Task List</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Project ID</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>{task.project_id}</td>

              <td>
                <button onClick={() => handleEditTask(task)}>
                  Edit
                </button>

                <button onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tasks;
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadTasks = async () => {
    setLoading(true);

    try {
      const response = await authFetch("/tasks");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load tasks");
      }

      setTasks(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await authFetch("/projects");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load projects");
      }

      setProjects(result.data);

      if (result.data.length > 0) {
        setProjectId((currentProjectId) =>
          currentProjectId || result.data[0].id
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const response = await authFetch("/auth/me");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load current user");
      }

      setUserId(result.user.id);
    } catch (error) {
      setError(error.message);
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
    setSuccess("");

    const cleanTitle = title.trim();

    if (cleanTitle.length < 3) {
      setError("Task title must be at least 3 characters.");
      return;
    }

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    if (!editingTaskId && !userId) {
      setError("User information is still loading. Please try again.");
      return;
    }

    setSubmitting(true);

    try {
      let response;

      const taskData = {
        title: cleanTitle,
        description: description.trim(),
        status,
        priority,
        project_id: Number(projectId),
        assigned_user_id: userId,
      };

      if (editingTaskId) {
        response = await authFetch(`/tasks/${editingTaskId}`, {
          method: "PUT",
          body: JSON.stringify(taskData),
        });
      } else {
        response = await authFetch("/tasks", {
          method: "POST",
          body: JSON.stringify(taskData),
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

      setSuccess(
        editingTaskId
          ? "Task updated successfully."
          : "Task created successfully."
      );

      resetForm();
      await loadTasks();
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = (task) => {
    setError("");
    setSuccess("");

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

    setError("");
    setSuccess("");

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

      setSuccess("Task deleted successfully.");

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

        <button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : editingTaskId
              ? "Update Task"
              : "Create Task"}
        </button>

        {editingTaskId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <h2>Task List</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
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
      )}
    </div>
  );
}

export default Tasks;
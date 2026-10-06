import { useEffect, useState } from "react";
import { authFetch } from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");

  const [userId, setUserId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      const response = await authFetch("/projects");
      const result = await response.json();

      if (response.ok) {
        setProjects(result.data);
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
    loadProjects();
    loadCurrentUser();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("planning");
    setEditingProjectId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      let response;

      if (editingProjectId) {
        response = await authFetch(`/projects/${editingProjectId}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            description,
            status,
          }),
        });
      } else {
        response = await authFetch("/projects", {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            status,
            user_id: userId,
          }),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (editingProjectId
              ? "Failed to update project"
              : "Failed to create project")
        );
      }

      resetForm();
      await loadProjects();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setTitle(project.title);
    setDescription(project.description || "");
    setStatus(project.status);
  };

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await authFetch(`/projects/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete project");
      }

      if (editingProjectId === id) {
        resetForm();
      }

      await loadProjects();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Projects</h1>

      <h2>
        {editingProjectId ? "Edit Project" : "Create Project"}
      </h2>

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
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button type="submit">
          {editingProjectId ? "Update Project" : "Create Project"}
        </button>

        {editingProjectId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}

        {error && <p>{error}</p>}
      </form>

      <h2>Project List</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>User ID</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.title}</td>
              <td>{project.status}</td>
              <td>{project.user_id}</td>

              <td>
                <button onClick={() => handleEditProject(project)}>
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteProject(project.id)}
                >
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

export default Projects;
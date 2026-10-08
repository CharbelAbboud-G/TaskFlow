import { useEffect, useState } from "react";
import { authFetch } from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");

  const [userId, setUserId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authFetch("/projects");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load projects");
      }

      setProjects(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
    setSuccess("");

    const cleanTitle = title.trim();

    if (cleanTitle.length < 3) {
      setError("Project title must be at least 3 characters.");
      return;
    }

    if (!editingProjectId && !userId) {
      setError("User information is still loading. Please try again.");
      return;
    }

    setSubmitting(true);

    try {
      let response;

      if (editingProjectId) {
        response = await authFetch(`/projects/${editingProjectId}`, {
          method: "PUT",
          body: JSON.stringify({
            title: cleanTitle,
            description: description.trim(),
            status,
          }),
        });
      } else {
        response = await authFetch("/projects", {
          method: "POST",
          body: JSON.stringify({
            title: cleanTitle,
            description: description.trim(),
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

      setSuccess(
        editingProjectId
          ? "Project updated successfully."
          : "Project created successfully."
      );

      resetForm();
      await loadProjects();
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = (project) => {
    setError("");
    setSuccess("");

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

    setError("");
    setSuccess("");

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

      setSuccess("Project deleted successfully.");

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

        <button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : editingProjectId
              ? "Update Project"
              : "Create Project"}
        </button>

        {editingProjectId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <h2>Project List</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
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
      )}
    </div>
  );
}

export default Projects;
const pool = require("../config/db");

// GET all projects
const getAllProjects = async (req, res) => {
  try {
    const [projects] = await pool.query(`
      SELECT
        projects.id,
        projects.title,
        projects.description,
        projects.status,
        projects.user_id,
        projects.created_at,
        projects.updated_at
      FROM projects
      ORDER BY projects.created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// GET one project
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const [projects] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: projects[0],
    });
  } catch (error) {
    console.error("Error fetching project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

// CREATE project
const createProject = async (req, res) => {
  try {
    const { title, description, status, user_id } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Title and user_id are required",
      });
    }

    const allowedStatuses = [
      "planning",
      "active",
      "completed",
      "archived",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status",
      });
    }

    const [users] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const projectStatus = status || "planning";

    const [result] = await pool.query(
      `INSERT INTO projects
       (title, description, status, user_id)
       VALUES (?, ?, ?, ?)`,
      [title, description || null, projectStatus, user_id]
    );

    const [projects] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: projects[0],
    });
  } catch (error) {
    console.error("Error creating project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// UPDATE project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, user_id } = req.body;

    const [existingProjects] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );

    if (existingProjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const currentProject = existingProjects[0];

    const allowedStatuses = [
      "planning",
      "active",
      "completed",
      "archived",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status",
      });
    }

    const newUserId =
      user_id !== undefined ? user_id : currentProject.user_id;

    if (user_id !== undefined) {
      const [users] = await pool.query(
        "SELECT id FROM users WHERE id = ?",
        [user_id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    }

    await pool.query(
      `UPDATE projects
       SET title = ?,
           description = ?,
           status = ?,
           user_id = ?
       WHERE id = ?`,
      [
        title !== undefined ? title : currentProject.title,
        description !== undefined
          ? description
          : currentProject.description,
        status !== undefined ? status : currentProject.status,
        newUserId,
        id,
      ]
    );

    const [updatedProjects] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProjects[0],
    });
  } catch (error) {
    console.error("Error updating project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// DELETE project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const [projects] = await pool.query(
      "SELECT id FROM projects WHERE id = ?",
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await pool.query(
      "DELETE FROM projects WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
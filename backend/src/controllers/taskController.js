const pool = require("../config/db");

// GET all tasks
const getAllTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query(`
      SELECT
        tasks.id,
        tasks.title,
        tasks.description,
        tasks.status,
        tasks.priority,
        tasks.due_date,
        tasks.project_id,
        tasks.assigned_user_id,
        tasks.created_at,
        tasks.updated_at
      FROM tasks
      ORDER BY tasks.created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// CREATE task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      due_date,
      project_id,
      assigned_user_id,
    } = req.body;

    if (!title || !project_id) {
      return res.status(400).json({
        success: false,
        message: "Title and project_id are required",
      });
    }

    const allowedStatuses = ["todo", "in_progress", "completed"];
    const allowedPriorities = ["low", "medium", "high"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    const [projects] = await pool.query(
      "SELECT id FROM projects WHERE id = ?",
      [project_id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (assigned_user_id !== undefined && assigned_user_id !== null) {
      const [users] = await pool.query(
        "SELECT id FROM users WHERE id = ?",
        [assigned_user_id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO tasks
      (
        title,
        description,
        status,
        priority,
        due_date,
        project_id,
        assigned_user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        status || "todo",
        priority || "medium",
        due_date || null,
        project_id,
        assigned_user_id || null,
      ]
    );

    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: tasks[0],
    });
  } catch (error) {
    console.error("Error creating task:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tasks[0],
    });
  } catch (error) {
    console.error("Error fetching task:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      status,
      priority,
      due_date,
      project_id,
      assigned_user_id,
    } = req.body;

    const [existingTasks] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const currentTask = existingTasks[0];

    const allowedStatuses = ["todo", "in_progress", "completed"];
    const allowedPriorities = ["low", "medium", "high"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    const newProjectId =
      project_id !== undefined ? project_id : currentTask.project_id;

    if (project_id !== undefined) {
      const [projects] = await pool.query(
        "SELECT id FROM projects WHERE id = ?",
        [project_id]
      );

      if (projects.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
    }

    const newAssignedUserId =
      assigned_user_id !== undefined
        ? assigned_user_id
        : currentTask.assigned_user_id;

    if (assigned_user_id !== undefined && assigned_user_id !== null) {
      const [users] = await pool.query(
        "SELECT id FROM users WHERE id = ?",
        [assigned_user_id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    await pool.query(
      `UPDATE tasks
       SET title = ?,
           description = ?,
           status = ?,
           priority = ?,
           due_date = ?,
           project_id = ?,
           assigned_user_id = ?
       WHERE id = ?`,
      [
        title !== undefined ? title : currentTask.title,
        description !== undefined
          ? description
          : currentTask.description,
        status !== undefined ? status : currentTask.status,
        priority !== undefined ? priority : currentTask.priority,
        due_date !== undefined ? due_date : currentTask.due_date,
        newProjectId,
        newAssignedUserId,
        id,
      ]
    );

    const [updatedTasks] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTasks[0],
    });
  } catch (error) {
    console.error("Error updating task:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const [tasks] = await pool.query(
      "SELECT id FROM tasks WHERE id = ?",
      [id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await pool.query(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
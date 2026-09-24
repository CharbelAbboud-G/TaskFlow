const express = require("express");

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);

router.post("/", authenticateToken, createTask);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;
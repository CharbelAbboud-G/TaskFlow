const express = require("express");

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

router.post("/", authenticateToken, createProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, deleteProject);

module.exports = router;
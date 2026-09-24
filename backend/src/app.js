const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "TaskFlow API is healthy",
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;
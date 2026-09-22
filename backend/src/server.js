require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL database connected successfully.");

    connection.release();

    app.listen(PORT, () => {
      console.log(`TaskFlow server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
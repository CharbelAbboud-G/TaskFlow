require("dotenv").config();

const pool = require("../src/config/db");

const initializeDatabase = async () => {
  let connection;

  try {
    connection = await pool.getConnection();

    console.log("Connected to MySQL.");
    console.log("Initializing TaskFlow database...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_user_email (email)
      )
      ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `);

    console.log("users table ready.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        status ENUM('planning', 'active', 'completed', 'archived')
          NOT NULL DEFAULT 'planning',
        user_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY fk_projects_user (user_id),
        CONSTRAINT fk_projects_user
          FOREIGN KEY (user_id)
          REFERENCES users (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )
      ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `);

    console.log("projects table ready.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        status ENUM('todo', 'in_progress', 'completed')
          NOT NULL DEFAULT 'todo',
        priority ENUM('low', 'medium', 'high')
          NOT NULL DEFAULT 'medium',
        due_date DATETIME NULL,
        project_id INT UNSIGNED NOT NULL,
        assigned_user_id INT UNSIGNED NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY fk_tasks_project (project_id),
        KEY fk_tasks_assigned_user (assigned_user_id),
        CONSTRAINT fk_tasks_project
          FOREIGN KEY (project_id)
          REFERENCES projects (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_tasks_assigned_user
          FOREIGN KEY (assigned_user_id)
          REFERENCES users (id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )
      ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `);

    console.log("tasks table ready.");
    console.log("TaskFlow database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      connection.release();
    }

    await pool.end();
  }
};

initializeDatabase();
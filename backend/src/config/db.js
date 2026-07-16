// Database configuration for HireTrack.
// This file creates a PostgreSQL connection pool and makes sure the required tables exist
// before the backend starts serving requests.

const { Pool } = require("pg");

// Pool maintains a pool of DB connections - much faster than opening a new
// connection for every request. pg handles this automatically.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// This runs once when the server starts.
// Creates all tables if they don't already exist.
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(150) UNIQUE NOT NULL,
        password    VARCHAR(255),
        auth_provider VARCHAR(50),
        provider_id VARCHAR(255),
        avatar_url  VARCHAR(500),
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS applications (
        id            SERIAL PRIMARY KEY,
        user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company       VARCHAR(150) NOT NULL,
        role          VARCHAR(150) NOT NULL,
        status        VARCHAR(50) DEFAULT 'Applied',
        applied_date  DATE DEFAULT CURRENT_DATE,
        follow_up_date DATE,
        notes         TEXT,
        job_url       VARCHAR(500),
        salary_range  VARCHAR(100),
        location      VARCHAR(150),
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token       VARCHAR(500) NOT NULL,
        expires_at  TIMESTAMP NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_resumes (
        id            SERIAL PRIMARY KEY,
        user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
        file_name     VARCHAR(255),
        text_content  TEXT,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
    `);

    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
    `);
    console.log("✅ Database tables ready");
  } catch (err) {
    console.error("❌ DB init error:", err.message);
    process.exit(1);
  }
};

module.exports = { pool, initDB };

import pg from "pg";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env from the server directory (works regardless of cwd)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const DATABASE_URL = process.env.DATABASE_URL;

// Validate DATABASE_URL at startup
if (
  !DATABASE_URL ||
  (!DATABASE_URL.startsWith("postgres://") &&
    !DATABASE_URL.startsWith("postgresql://"))
) {
  console.error(
    "❌ FATAL: DATABASE_URL must be a valid PostgreSQL connection string."
  );
  console.error(
    "   Expected format: postgresql://user:password@host:port/dbname"
  );
  console.error("   Current value:", DATABASE_URL || "(not set)");
  process.exit(1);
}

/* -------------------- POSTGRESQL POOL -------------------- */
console.log("🐘 Using PostgreSQL database");

// Parse the URL to handle special characters in password (e.g. @ symbols)
const parsedUrl = new URL(DATABASE_URL);
const pool = new pg.Pool({
  user: parsedUrl.username,
  password: decodeURIComponent(parsedUrl.password),
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port, 10) || 5432,
  database: parsedUrl.pathname.slice(1),
  ssl: false, // local development — no SSL needed
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL idle client error:", err);
});

/* -------------------- QUERY FUNCTION -------------------- */
export const query = (text, params = []) => {
  return pool.query(text, params);
};

/* -------------------- INIT DB -------------------- */
export async function initDB() {
  try {
    // Verify connection first
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");

    // Run schema init
    const sql = readFileSync(join(__dirname, "init_pg.sql"), "utf-8");
    await pool.query(sql);
    console.log("✅ PostgreSQL tables initialized");
  } catch (err) {
    console.error("❌ PostgreSQL init error:", err.message);
    throw err;
  }
}

/* -------------------- CLEAN CLOSE -------------------- */
export const closeDB = async () => {
  await pool.end();
};
import pg from "pg";
const pool = new pg.Pool({ user: "postgres", password: "sameer1234", host: "localhost", port: 5432, database: "postgres" });
const { rows } = await pool.query("SELECT datname FROM pg_database WHERE datname = 'true_angel'");
if (rows.length === 0) {
  await pool.query("CREATE DATABASE true_angel");
  console.log("✅ Database 'true_angel' created");
} else {
  console.log("✅ Database 'true_angel' already exists");
}
await pool.end();

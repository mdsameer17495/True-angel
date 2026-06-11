import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres"
});

pool.query("SELECT 1")
  .then(() => { console.log("Success with NO password"); process.exit(0); })
  .catch(err => { console.log("Failed with NO password: " + err.message); process.exit(1); });

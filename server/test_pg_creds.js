import pg from "pg";

const passwords = ["", "postgres", "admin", "root", "password"];
const users = ["postgres", "naziya", "root"];

async function test() {
  for (const u of users) {
    for (const p of passwords) {
      const pool = new pg.Pool({
        user: u,
        password: p,
        host: "localhost",
        port: 5432,
        database: "postgres" // try connecting to default db first
      });
      try {
        await pool.query("SELECT 1");
        console.log(`✅ Success: postgresql://${u}:${p}@localhost:5432/postgres`);
        process.exit(0);
      } catch (err) {
        // ignore
      } finally {
        await pool.end();
      }
    }
  }
  console.log("❌ All failed");
}
test();

import pg from "pg";

// Try the exact password we extracted
const passwords = ["Sameer@1234", "sameer@1234", "Sameer1234", "sameer1234", "Sameer@123", "sameer@123"];

async function test() {
  for (const pw of passwords) {
    const pool = new pg.Pool({ user: "postgres", password: pw, host: "localhost", port: 5432, database: "postgres" });
    try {
      await pool.query("SELECT 1");
      console.log(`✅ "${pw}" works!`);
      await pool.end();
      process.exit(0);
    } catch { await pool.end(); }
  }
  console.log("❌ None worked. Please check your actual postgres password.");
}
test();

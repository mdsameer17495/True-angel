import pg from "pg";

const passwords = ["postgres", "admin", "password", "root", "12345", "yourpassword"];
const dbName = "true_angel";

async function testPasswords() {
  for (const pw of passwords) {
    const pool = new pg.Pool({
      user: "postgres",
      password: pw,
      host: "localhost",
      port: 5432,
      database: dbName
    });

    try {
      await pool.query("SELECT 1");
      console.log(`✅ Success with password: ${pw}`);
      process.exit(0);
    } catch (err) {
      console.log(`❌ Failed with password: ${pw} (${err.message})`);
    } finally {
      await pool.end();
    }
  }
}

testPasswords();

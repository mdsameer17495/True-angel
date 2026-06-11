import sqlite3 from 'sqlite3';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: "./.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  console.log('🚀 Starting SQLite to PostgreSQL Migration...');

  const postgresUrl = process.env.DATABASE_URL;
  if (!postgresUrl || (!postgresUrl.startsWith('postgres://') && !postgresUrl.startsWith('postgresql://'))) {
    console.error('❌ ERROR: DATABASE_URL is not set to a valid PostgreSQL connection string in .env');
    console.error('Example: DATABASE_URL=postgresql://user:password@localhost:5432/true_angel');
    process.exit(1);
  }

  // Setup PostgreSQL
  const pool = new pg.Pool({
    connectionString: postgresUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  const pgClient = await pool.connect();
  console.log('✅ Connected to PostgreSQL');

  // Setup SQLite
  const dbPath = join(__dirname, 'database.sqlite');
  const sqliteDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('❌ ERROR: Failed to open SQLite database:', err.message);
      process.exit(1);
    }
  });

  const querySqlite = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  try {
    console.log('✅ Connected to SQLite Database');

    // Initialize PostgreSQL schema if empty (using the query from db.js approach or just raw tables)
    // We assume init_pg.sql was executed on server startup if DATABASE_URL was set.
    // Let's ensure tables exist:
    const fs = await import('fs');
    const initPgSql = fs.readFileSync(join(__dirname, 'init_pg.sql'), 'utf-8');
    await pgClient.query(initPgSql);
    console.log('✅ PostgreSQL Schema Verified');

    const tables = ['users', 'medicines', 'alarms', 'reminders', 'emergency_contacts', 'history'];

    await pgClient.query('BEGIN');
    console.log('📦 Started PostgreSQL Transaction');

    for (const table of tables) {
      console.log(`\n⏳ Migrating table: ${table}...`);
      const rows = await querySqlite(`SELECT * FROM ${table}`);
      
      if (rows.length === 0) {
        console.log(`   - 0 rows found in SQLite. Skipping.`);
        continue;
      }

      const columns = Object.keys(rows[0]);
      
      // Map SQLite integer booleans to actual booleans for Postgres
      const booleanColumns = ['taken_today', 'enabled', 'completed'];

      const insertQuery = `
        INSERT INTO ${table} (${columns.join(', ')})
        VALUES (${columns.map((_, i) => `$${i + 1}`).join(', ')})
        ON CONFLICT (id) DO NOTHING
      `;

      let migratedCount = 0;
      for (const row of rows) {
        const values = columns.map(col => {
          let val = row[col];
          // SQLite stores booleans as 0/1. Convert to true/false for Postgres boolean fields.
          if (booleanColumns.includes(col)) {
            val = val === 1 || val === true;
          }
          return val;
        });

        const res = await pgClient.query(insertQuery, values);
        if (res.rowCount > 0) migratedCount++;
      }

      console.log(`   - Read ${rows.length} rows from SQLite`);
      console.log(`   - Inserted ${migratedCount} new rows to PostgreSQL (skipped ${rows.length - migratedCount} duplicates)`);
      
      // Verify row count matches
      const { rows: pgCountResult } = await pgClient.query(`SELECT COUNT(*) as count FROM ${table}`);
      const pgCount = parseInt(pgCountResult[0].count, 10);
      console.log(`   - Verification: PostgreSQL has ${pgCount} rows total.`);
    }

    await pgClient.query('COMMIT');
    console.log('\n🎉 Migration completed successfully!');
  } catch (err) {
    await pgClient.query('ROLLBACK');
    console.error('\n❌ MIGRATION FAILED - Transaction rolled back.');
    console.error(err);
  } finally {
    pgClient.release();
    await pool.end();
    sqliteDb.close();
  }
}

migrate();

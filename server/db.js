import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fallback to local database.sqlite file if DATABASE_URL is not set or doesn't look like sqlite
const dbPath = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('sqlite:')
  ? process.env.DATABASE_URL.replace(/^sqlite:/, '')
  : join(__dirname, 'database.sqlite');

console.log(`📂 Using SQLite database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to open SQLite database:', err.message);
  } else {
    console.log('✅ SQLite database opened successfully');
  }
});

// Helper to query DB (handles Postgres-style $1, $2 parameters)
export const query = (text, params = []) => {
  return new Promise((resolve, reject) => {
    // Translate Postgres-style $1, $2 to SQLite ? parameters
    const sqliteSql = text.replace(/\$\d+/g, '?');

    db.all(sqliteSql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve({ rows: rows || [] });
      }
    });
  });
};

// Initialize database tables on startup
export async function initDB() {
  try {
    const sql = readFileSync(join(__dirname, 'init.sql'), 'utf-8');
    
    // SQLite db.exec runs all SQL statements sequentially
    await new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    throw err;
  }
}

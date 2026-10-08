import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'skyrovix.db');

const db = new sqlite3.Database(dbPath);

const dbRun = (sql) => new Promise((resolve) => db.run(sql, () => resolve()));

async function alignColumns() {
  console.log('Aligning database columns with production schema...');
  await dbRun('ALTER TABLE students ADD COLUMN avatar_url TEXT');
  await dbRun("ALTER TABLE registrations ADD COLUMN domain TEXT DEFAULT 'Full Stack Development'");
  await dbRun('ALTER TABLE payments ADD COLUMN cf_payment_id TEXT');
  await dbRun('ALTER TABLE payments ADD COLUMN failure_reason TEXT');
  await dbRun('ALTER TABLE payments ADD COLUMN payment_time DATETIME');
  console.log('✅ Columns aligned!');
  db.close();
}

alignColumns();

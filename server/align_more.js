import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'skyrovix.db');

const db = new sqlite3.Database(dbPath);

const dbRun = (sql) => new Promise((resolve) => db.run(sql, (err) => resolve()));

async function alignMore() {
  await dbRun("ALTER TABLE certificates ADD COLUMN grade TEXT DEFAULT 'A+'");
  await dbRun("ALTER TABLE certificates ADD COLUMN verification_hash TEXT");
  await dbRun("ALTER TABLE certificates ADD COLUMN revoked INTEGER DEFAULT 0");
  await dbRun("ALTER TABLE offer_letters ADD COLUMN terms TEXT");
  console.log('✅ Certificates & Offer Letters aligned!');
  db.close();
}

alignMore();

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'skyrovix.db');

const db = new sqlite3.Database(dbPath);

db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name IN ('registrations', 'payments', 'student_tasks', 'submissions')", (err, rows) => {
  if (err) console.error(err);
  else rows.forEach(r => console.log(r.sql + '\n---'));
  db.close();
});

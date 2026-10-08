import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3307', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Hari@123',
  database: process.env.MYSQL_DATABASE || 'skyrovix'
});

async function migrate() {
  console.log('🔄 Migrating existing database rows to 3 Months / 6 Months standards...');

  // 1. Registrations
  const [regResult] = await pool.query(`
    UPDATE registrations 
    SET duration = '3 Months',
        end_date = '21 December 2026'
    WHERE duration IS NULL OR duration = '' OR duration = '1 Month' OR duration LIKE '%1 Month%'
  `);
  console.log('Updated registrations:', regResult.affectedRows);

  // 2. Offer Letters
  const [olResult] = await pool.query(`
    UPDATE offer_letters 
    SET duration = '3 Months',
        program = '3-Month Full Stack Development Internship',
        end_date = '21 December 2026'
    WHERE duration IS NULL OR duration = '' OR duration = '1 Month' OR duration LIKE '%1 Month%'
  `);
  console.log('Updated offer_letters:', olResult.affectedRows);

  // 3. Certificates
  const [certResult] = await pool.query(`
    UPDATE certificates 
    SET duration = '3 Months',
        program = '3-Month Full Stack Development Internship'
    WHERE duration IS NULL OR duration = '' OR duration = '1 Month' OR duration LIKE '%1 Month%'
  `);
  console.log('Updated certificates:', certResult.affectedRows);

  // Check rows
  const [regs] = await pool.query('SELECT id, student_id, duration, start_date, end_date FROM registrations');
  console.log('Current registrations:', regs);
  const [ols] = await pool.query('SELECT id, student_id, program, duration, start_date, end_date FROM offer_letters');
  console.log('Current offer_letters:', ols);

  await pool.end();
  console.log('✅ Migration completed successfully!');
}

migrate().catch(console.error);

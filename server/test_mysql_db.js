import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

async function runDatabaseTests() {
  console.log('====================================================');
  console.log('🚀 SKYROVIX MYSQL DATABASE TEST SUITE');
  console.log('====================================================\n');

  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = Number(process.env.MYSQL_PORT) || 3307;
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'skyrovix';

  console.log(`Target: ${user}@${host}:${port}/${database}`);

  let conn = null;
  let testCount = 0;
  let passCount = 0;

  const assert = (condition, description) => {
    testCount++;
    if (condition) {
      console.log(`  ✅ PASS: ${description}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${description}`);
    }
  };

  try {
    // 1. Connection test
    conn = await mysql.createConnection({ host, port, user, password });
    assert(true, '1. Connected to MySQL Server successfully');

    // 2. skyrovix database exists
    const [dbs] = await conn.query('SHOW DATABASES LIKE ?', [database]);
    assert(dbs.length > 0, `2. Database "${database}" exists`);

    // Switch to database
    await conn.query(`USE \`${database}\``);

    // List all existing tables
    const [tablesRes] = await conn.query('SHOW TABLES');
    const existingTables = tablesRes.map(row => Object.values(row)[0]);
    console.log(`\nFound ${existingTables.length} tables in "${database}":`);
    console.log(existingTables.join(', '));
    console.log('');

    // 3 - 8. Required core tables
    const requiredTables = [
      'students',
      'registrations',
      'payments',
      'offer_letters',
      'certificates',
      'admins',
      'batches',
      'settings',
      'payment_events',
      'notifications',
      'user_notifications',
      'student_tasks',
      'submissions',
      'training_modules',
      'training_submissions',
      'linkedin_submissions',
      'intern_workflows',
      'support_tickets',
      'support_replies',
      'audit_logs',
      'email_logs'
    ];

    for (const tbl of requiredTables) {
      assert(existingTables.includes(tbl), `Table "${tbl}" exists in schema`);
    }

    // 9. Foreign key relationships check
    console.log('\nTesting Foreign Key Constraints & Relationships:');
    const [fks] = await conn.query(`
      SELECT 
        TABLE_NAME, 
        COLUMN_NAME, 
        CONSTRAINT_NAME, 
        REFERENCED_TABLE_NAME, 
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE CONSTRAINT_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [database]);

    assert(fks.length > 0, `Schema has active Foreign Key constraints (${fks.length} constraints detected)`);
    fks.forEach(fk => {
      console.log(`    🔗 ${fk.TABLE_NAME}.${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME} (${fk.CONSTRAINT_NAME})`);
    });

    // Check specific foreign key relationships mentioned in specifications
    const regStudentFk = fks.find(fk => fk.TABLE_NAME === 'registrations' && fk.REFERENCED_TABLE_NAME === 'students');
    assert(Boolean(regStudentFk), 'Foreign Key: registrations -> students relationship confirmed');

    const paymentRegFk = fks.find(fk => fk.TABLE_NAME === 'payments' && fk.REFERENCED_TABLE_NAME === 'registrations');
    assert(Boolean(paymentRegFk), 'Foreign Key: payments -> registrations relationship confirmed');

    console.log('\n====================================================');
    console.log(`TEST RESULTS: ${passCount} / ${testCount} PASSED`);
    console.log('====================================================');

    if (passCount === testCount) {
      console.log('🎉 ALL DATABASE VERIFICATION TESTS PASSED!\n');
    } else {
      console.warn(`⚠️ Some checks did not pass. (${testCount - passCount} failed)\n`);
    }

  } catch (err) {
    console.error('❌ Database Test Execution Failed:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

runDatabaseTests();

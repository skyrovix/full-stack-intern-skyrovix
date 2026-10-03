import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, isSupabaseConfigured } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'skyrovix.db');

const db = new sqlite3.Database(dbPath);

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

async function syncAllToSupabase() {
  console.log('⚡ Starting SQLite to Supabase Full Sync...');

  if (!isSupabaseConfigured() || !supabase) {
    console.error('❌ Supabase is not configured.');
    return;
  }

  try {
    // 1. Batches
    const batches = await dbAll('SELECT id, name, title, registration_fee as price, start_notice, created_at FROM batches');
    if (batches.length) {
      const { error } = await supabase.from('batches').upsert(batches);
      if (error) console.error('Batches sync error:', error.message);
      else console.log(`✅ Synced ${batches.length} batches`);
    }

    // 2. Settings
    const settings = await dbAll('SELECT key, value, updated_at FROM settings');
    if (settings.length) {
      const { error } = await supabase.from('settings').upsert(settings);
      if (error) console.error('Settings sync error:', error.message);
      else console.log(`✅ Synced ${settings.length} settings`);
    }

    // 3. Admins
    const admins = await dbAll('SELECT id, email, password_hash, username as full_name, role, created_at FROM admins');
    if (admins.length) {
      const { error } = await supabase.from('admins').upsert(admins);
      if (error) console.error('Admins sync error:', error.message);
      else console.log(`✅ Synced ${admins.length} admins`);
    }

    // 4. Students
    const students = await dbAll('SELECT id, full_name, email, mobile, college, department, year_of_study, city, skill_level, github_url, linkedin_url, bio, password_hash, is_active, created_at, updated_at FROM students');
    if (students.length) {
      const { error } = await supabase.from('students').upsert(students);
      if (error) console.error('Students sync error:', error.message);
      else console.log(`✅ Synced ${students.length} students`);
    }

    // 5. Registrations
    const registrations = await dbAll('SELECT id, student_id, batch_id, domain, full_name, email, mobile, college, department, year_of_study, city, skill_level, payment_status, registration_status, created_at, updated_at FROM registrations');
    if (registrations.length) {
      const { error } = await supabase.from('registrations').upsert(registrations);
      if (error) console.error('Registrations sync error:', error.message);
      else console.log(`✅ Synced ${registrations.length} registrations`);
    }

    // 6. Payments
    const payments = await dbAll('SELECT id, order_id, student_id, registration_id, amount, currency, status, cf_payment_id, payment_method, payment_time, failure_reason, created_at, updated_at FROM payments');
    if (payments.length) {
      const { error } = await supabase.from('payments').upsert(payments);
      if (error) console.error('Payments sync error:', error.message);
      else console.log(`✅ Synced ${payments.length} payments`);
    }

    // 7. Student Tasks
    const tasks = await dbAll('SELECT id, student_id, task_order, title, description, domain, difficulty, due_days, status, submission_status, created_at FROM student_tasks');
    if (tasks.length) {
      const { error } = await supabase.from('student_tasks').upsert(tasks);
      if (error) console.error('Student tasks sync error:', error.message);
      else console.log(`✅ Synced ${tasks.length} student tasks`);
    }

    // 8. Submissions
    const submissions = await dbAll('SELECT id, student_id, task_id, github_repo_url, live_deployment_url, notes, status, grade, feedback, evaluated_at, created_at, updated_at FROM submissions');
    if (submissions.length) {
      const { error } = await supabase.from('submissions').upsert(submissions);
      if (error) console.error('Submissions sync error:', error.message);
      else console.log(`✅ Synced ${submissions.length} submissions`);
    }

    // 9. Certificates
    const certificates = await dbAll('SELECT id, student_id, program, duration, batch, issue_date, grade, status, verification_hash, revoked, created_at FROM certificates');
    if (certificates.length) {
      const { error } = await supabase.from('certificates').upsert(certificates);
      if (error) console.error('Certificates sync error:', error.message);
      else console.log(`✅ Synced ${certificates.length} certificates`);
    }

    // 10. Offer Letters
    const offerLetters = await dbAll('SELECT id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms, created_at FROM offer_letters');
    if (offerLetters.length) {
      const { error } = await supabase.from('offer_letters').upsert(offerLetters);
      if (error) console.error('Offer letters sync error:', error.message);
      else console.log(`✅ Synced ${offerLetters.length} offer letters`);
    }

    // 11. Support Tickets
    const tickets = await dbAll('SELECT id, student_id, subject, category, priority, status, created_at, updated_at FROM support_tickets');
    if (tickets.length) {
      const { error } = await supabase.from('support_tickets').upsert(tickets);
      if (error) console.error('Support tickets sync error:', error.message);
      else console.log(`✅ Synced ${tickets.length} support tickets`);
    }

    // 12. Support Replies
    const replies = await dbAll('SELECT id, ticket_id, sender_type, sender_id, sender_name, message, created_at FROM support_replies');
    if (replies.length) {
      const { error } = await supabase.from('support_replies').upsert(replies);
      if (error) console.error('Support replies sync error:', error.message);
      else console.log(`✅ Synced ${replies.length} support replies`);
    }

    // 13. Audit Logs
    const auditLogs = await dbAll('SELECT id, admin_id, action, target_type, target_id, details, created_at FROM audit_logs');
    if (auditLogs.length) {
      const { error } = await supabase.from('audit_logs').upsert(auditLogs);
      if (error) console.error('Audit logs sync error:', error.message);
      else console.log(`✅ Synced ${auditLogs.length} audit logs`);
    }

    console.log('🎉 Full Sync to Supabase Completed Successfully!');
  } catch (err) {
    console.error('Sync error:', err);
  } finally {
    db.close();
  }
}

syncAllToSupabase();

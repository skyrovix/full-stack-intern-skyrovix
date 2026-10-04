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
    const registrations = await dbAll(`
      SELECT 
        r.id, r.student_id, r.batch_id, COALESCE(r.domain, 'Full Stack Development') as domain,
        s.full_name, s.email, s.mobile, s.college, s.department, s.year_of_study, s.city, s.skill_level,
        r.payment_status, r.registration_status, r.created_at, r.updated_at
      FROM registrations r
      JOIN students s ON r.student_id = s.id
    `);
    if (registrations.length) {
      const { error } = await supabase.from('registrations').upsert(registrations);
      if (error) console.error('Registrations sync error:', error.message);
      else console.log(`✅ Synced ${registrations.length} registrations`);
    }

    // 6. Payments
    const payments = await dbAll(`
      SELECT 
        p.id, p.order_id, r.student_id, p.registration_id, p.amount, p.currency, p.status,
        COALESCE(p.cf_payment_id, p.cashfree_payment_id) as cf_payment_id,
        p.payment_method, p.payment_time, p.failure_reason, p.created_at, p.updated_at
      FROM payments p
      JOIN registrations r ON p.registration_id = r.id
    `);
    if (payments.length) {
      const { error } = await supabase.from('payments').upsert(payments);
      if (error) console.error('Payments sync error:', error.message);
      else console.log(`✅ Synced ${payments.length} payments`);
    }

    // 7. Student Tasks
    try {
      const tasks = await dbAll('SELECT id, student_id, task_order, title, description, domain, difficulty, due_days, status, submission_status, created_at FROM student_tasks');
      if (tasks && tasks.length) {
        const { error } = await supabase.from('student_tasks').upsert(tasks);
        if (error) console.error('Student tasks sync error:', error.message);
        else console.log(`✅ Synced ${tasks.length} student tasks`);
      }
    } catch (e) {
      console.warn('Student tasks skip:', e.message);
    }

    // 8. Submissions
    try {
      const submissions = await dbAll('SELECT id, student_id, project_id as task_id, github_repo_url, live_deployment_url, notes, status, grade, feedback, reviewed_at as evaluated_at, submitted_at as created_at, submitted_at as updated_at FROM submissions');
      if (submissions && submissions.length) {
        const { error } = await supabase.from('submissions').upsert(submissions);
        if (error) console.error('Submissions sync error:', error.message);
        else console.log(`✅ Synced ${submissions.length} submissions`);
      }
    } catch (e) {
      console.warn('Submissions skip:', e.message);
    }

    // 9. Certificates
    try {
      const certificates = await dbAll('SELECT id, student_id, program, duration, batch, issue_date, grade, status, verification_hash, revoked, created_at FROM certificates');
      if (certificates && certificates.length) {
        const { error } = await supabase.from('certificates').upsert(certificates);
        if (error) console.error('Certificates sync error:', error.message);
        else console.log(`✅ Synced ${certificates.length} certificates`);
      }
    } catch (e) {
      console.warn('Certificates skip:', e.message);
    }

    // 10. Offer Letters
    try {
      const offerLetters = await dbAll('SELECT id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms, created_at FROM offer_letters');
      if (offerLetters && offerLetters.length) {
        const { error } = await supabase.from('offer_letters').upsert(offerLetters);
        if (error) console.error('Offer letters sync error:', error.message);
        else console.log(`✅ Synced ${offerLetters.length} offer letters`);
      }
    } catch (e) {
      console.warn('Offer letters skip:', e.message);
    }

    // 11. Support Tickets
    try {
      const tickets = await dbAll('SELECT id, user_id as student_id, subject, category, priority, status, created_at, updated_at FROM support_tickets');
      if (tickets && tickets.length) {
        const { error } = await supabase.from('support_tickets').upsert(tickets);
        if (error) console.error('Support tickets sync error:', error.message);
        else console.log(`✅ Synced ${tickets.length} support tickets`);
      }
    } catch (e) {
      console.warn('Support tickets skip:', e.message);
    }

    // 12. Support Replies
    try {
      const replies = await dbAll('SELECT id, ticket_id, sender_role as sender_type, sender_id, sender_name, message, created_at FROM support_replies');
      if (replies && replies.length) {
        const { error } = await supabase.from('support_replies').upsert(replies);
        if (error) console.error('Support replies sync error:', error.message);
        else console.log(`✅ Synced ${replies.length} support replies`);
      }
    } catch (e) {
      console.warn('Support replies skip:', e.message);
    }

    // 13. Audit Logs
    try {
      const auditLogs = await dbAll('SELECT id, admin_id, action, target_type, target_id, details, created_at FROM audit_logs');
      if (auditLogs && auditLogs.length) {
        const { error } = await supabase.from('audit_logs').upsert(auditLogs);
        if (error) console.error('Audit logs sync error:', error.message);
        else console.log(`✅ Synced ${auditLogs.length} audit logs`);
      }
    } catch (e) {
      console.warn('Audit logs skip:', e.message);
    }

    console.log('🎉 Full Sync to Supabase Completed Successfully!');
  } catch (err) {
    console.error('Sync error:', err);
  } finally {
    db.close();
  }
}

syncAllToSupabase();

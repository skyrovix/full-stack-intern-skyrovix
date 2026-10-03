import { supabase, isSupabaseConfigured } from './supabase.js';

export async function pullFromSupabase(dbRun) {
  if (!isSupabaseConfigured() || !supabase) {
    return;
  }

  try {
    console.log('📥 Synchronizing live data from Supabase...');

    // 1. Settings
    const { data: settings } = await supabase.from('settings').select('*');
    if (settings && dbRun) {
      for (const s of settings) {
        await dbRun('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [s.key, s.value]);
      }
    }

    // 2. Students
    const { data: students } = await supabase.from('students').select('*');
    if (students && dbRun) {
      for (const st of students) {
        await dbRun(`
          INSERT INTO students (
            id, full_name, email, mobile, college, degree, department, year_of_study, city, skill_level,
            github_url, linkedin_url, bio, avatar_url, password_hash, is_active, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            full_name = excluded.full_name,
            email = excluded.email,
            mobile = excluded.mobile,
            college = excluded.college,
            department = excluded.department,
            year_of_study = excluded.year_of_study,
            city = excluded.city,
            skill_level = excluded.skill_level,
            github_url = excluded.github_url,
            linkedin_url = excluded.linkedin_url,
            bio = excluded.bio,
            password_hash = COALESCE(excluded.password_hash, students.password_hash),
            is_active = excluded.is_active,
            updated_at = excluded.updated_at
        `, [
          st.id, st.full_name, st.email, st.mobile, st.college, 'B.Tech', st.department, st.year_of_study,
          st.city, st.skill_level, st.github_url || '', st.linkedin_url || '', st.bio || '',
          st.avatar_url || '', st.password_hash || '', st.is_active ?? 1, st.created_at, st.updated_at
        ]);
      }
    }

    // 3. Offer Letters
    const { data: offerLetters } = await supabase.from('offer_letters').select('*');
    if (offerLetters && dbRun) {
      for (const ol of offerLetters) {
        await dbRun(`
          INSERT INTO offer_letters (
            id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            status = excluded.status,
            verification_code = excluded.verification_code
        `, [
          ol.id, ol.student_id, ol.student_name, ol.program, ol.domain, ol.batch, ol.duration,
          ol.issue_date, ol.status, ol.verification_code, ol.terms, ol.created_at
        ]);
      }
    }

    // 4. Certificates
    const { data: certificates } = await supabase.from('certificates').select('*, students(full_name)');
    if (certificates && dbRun) {
      for (const c of certificates) {
        const studentName = c.students?.full_name || 'Skyrovix Intern';
        await dbRun(`
          INSERT INTO certificates (
            id, student_id, student_name, program, duration, batch, issue_date, grade, status, verification_hash, revoked, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            status = excluded.status,
            revoked = excluded.revoked
        `, [
          c.id, c.student_id, studentName, c.program, c.duration, c.batch, c.issue_date, c.grade || 'A+', c.status,
          c.verification_hash, c.revoked ?? 0, c.created_at
        ]);
      }
    }

    // 5. Support Tickets
    const { data: tickets } = await supabase.from('support_tickets').select('*, students(full_name, email)');
    if (tickets && dbRun) {
      for (const t of tickets) {
        const uName = t.students?.full_name || 'Student';
        const uEmail = t.students?.email || 'student@skyrovix.com';
        await dbRun(`
          INSERT INTO support_tickets (id, user_id, user_name, user_email, subject, category, message, priority, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at
        `, [t.id, t.student_id, uName, uEmail, t.subject, t.category, t.subject, t.priority, t.status, t.created_at, t.updated_at]);
      }
    }

    // 6. Support Replies
    const { data: replies } = await supabase.from('support_replies').select('*');
    if (replies && dbRun) {
      for (const r of replies) {
        await dbRun(`
          INSERT INTO support_replies (id, ticket_id, sender_id, sender_name, sender_role, message, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO NOTHING
        `, [r.id, r.ticket_id, r.sender_id, r.sender_name, r.sender_type || 'user', r.message, r.created_at]);
      }
    }

    console.log('⚡ Live Supabase synchronization active.');
  } catch (err) {
    console.error('Warning during Supabase sync:', err.message);
  }
}

// Push Helpers to write directly into Supabase
export async function pushToSupabase(table, data) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    const { error } = await supabase.from(table).upsert(data);
    if (error) {
      console.warn(`Supabase upsert warning on table "${table}":`, error.message);
    }
  } catch (err) {
    console.warn(`Supabase network error on table "${table}":`, err.message);
  }
}

export async function deleteFromSupabase(table, matchCriteria) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from(table).delete().match(matchCriteria);
  } catch (err) {
    console.warn(`Supabase delete error on table "${table}":`, err.message);
  }
}

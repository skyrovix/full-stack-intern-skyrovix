import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isServerless = Boolean(process.env.VERCEL || (process.env.NODE_ENV === 'production' && process.env.AWS_LAMBDA_FUNCTION_NAME));
let dbPath = path.join(__dirname, 'skyrovix.db');

let sqlite3Db = null;
let sqlJsDb = null;
let isUsingSqlJs = false;

// Initialization helper
let initEnginePromise = null;
export async function getDbEngine() {
  if (initEnginePromise) return initEnginePromise;
  initEnginePromise = (async () => {
    // In serverless / Vercel, always use sql.js (WebAssembly) to avoid glibc version mismatches
    if (isServerless) {
      try {
        const { default: initSqlJs } = await import('sql.js');
        const SQL = await initSqlJs();
        const seedPath = path.join(__dirname, 'skyrovix.db');
        let filebuffer = null;
        if (fs.existsSync(seedPath)) {
          filebuffer = fs.readFileSync(seedPath);
        } else if (fs.existsSync(path.join(process.cwd(), 'server', 'skyrovix.db'))) {
          filebuffer = fs.readFileSync(path.join(process.cwd(), 'server', 'skyrovix.db'));
        }
        sqlJsDb = filebuffer ? new SQL.Database(filebuffer) : new SQL.Database();
        isUsingSqlJs = true;
        console.log('⚡ Connected to SQLite database via WebAssembly (sql.js)');
        return;
      } catch (sqlJsErr) {
        console.warn('⚠️ sql.js failed to initialize in serverless:', sqlJsErr.message);
      }
    }

    // Try native sqlite3
    try {
      const sqlite3Module = (await import('sqlite3')).default;
      sqlite3Module.verbose();
      sqlite3Db = new sqlite3Module.Database(dbPath, (err) => {
        if (err) console.error('❌ Could not connect to SQLite database:', err.message);
        else console.log('✅ Connected to SQLite database at', dbPath);
      });
    } catch (sqliteErr) {
      console.warn('⚠️ sqlite3 native addon failed, falling back to sql.js WebAssembly:', sqliteErr.message);
      const { default: initSqlJs } = await import('sql.js');
      const SQL = await initSqlJs();
      const seedPath = path.join(__dirname, 'skyrovix.db');
      let filebuffer = null;
      if (fs.existsSync(seedPath)) {
        filebuffer = fs.readFileSync(seedPath);
      } else if (fs.existsSync(path.join(process.cwd(), 'server', 'skyrovix.db'))) {
        filebuffer = fs.readFileSync(path.join(process.cwd(), 'server', 'skyrovix.db'));
      }
      sqlJsDb = filebuffer ? new SQL.Database(filebuffer) : new SQL.Database();
      isUsingSqlJs = true;
      console.log('⚡ Connected to SQLite database via WebAssembly (sql.js)');
    }
  })();
  return initEnginePromise;
}

// Start engine loading immediately
getDbEngine();

export const db = {
  run: (...args) => (sqlite3Db ? sqlite3Db.run(...args) : sqlJsDb?.run(...args)),
  get: (...args) => (sqlite3Db ? sqlite3Db.get(...args) : null),
  all: (...args) => (sqlite3Db ? sqlite3Db.all(...args) : null),
};

// Promisified DB helpers
export const dbRun = async (sql, params = []) => {
  await getDbEngine();
  if (isUsingSqlJs && sqlJsDb) {
    sqlJsDb.run(sql, params);
    return { lastID: null, changes: sqlJsDb.getRowsModified() };
  }
  return new Promise((resolve, reject) => {
    sqlite3Db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = async (sql, params = []) => {
  await getDbEngine();
  if (isUsingSqlJs && sqlJsDb) {
    const stmt = sqlJsDb.prepare(sql);
    stmt.bind(params);
    let row = null;
    if (stmt.step()) {
      row = stmt.getAsObject();
    }
    stmt.free();
    return row;
  }
  return new Promise((resolve, reject) => {
    sqlite3Db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

export const dbAll = async (sql, params = []) => {
  await getDbEngine();
  if (isUsingSqlJs && sqlJsDb) {
    const stmt = sqlJsDb.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }
  return new Promise((resolve, reject) => {
    sqlite3Db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Initialize schema
export async function initDb() {
  await dbRun('PRAGMA foreign_keys = ON');

  // Batches table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      internship_fee REAL DEFAULT 0,
      registration_fee REAL DEFAULT 200,
      start_notice TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Settings table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admins table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'ADMIN',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Students table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT NOT NULL,
      college TEXT NOT NULL,
      degree TEXT NOT NULL,
      department TEXT NOT NULL,
      year_of_study TEXT NOT NULL,
      city TEXT NOT NULL,
      github_url TEXT,
      linkedin_url TEXT,
      skill_level TEXT NOT NULL,
      password_hash TEXT,
      bio TEXT,
      is_active INTEGER DEFAULT 1,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Registrations table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      batch_id TEXT DEFAULT 'batch-1',
      registration_status TEXT DEFAULT 'APPLICATION_STARTED',
      payment_status TEXT DEFAULT 'CREATED',
      payment_order_id TEXT,
      whatsapp_joined INTEGER DEFAULT 0,
      current_week INTEGER DEFAULT 1,
      progress_pct INTEGER DEFAULT 0,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (batch_id) REFERENCES batches(id)
    )
  `);

  // Payments table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      registration_id TEXT NOT NULL,
      order_id TEXT UNIQUE NOT NULL,
      payment_session_id TEXT,
      cashfree_payment_id TEXT,
      amount REAL DEFAULT 200.00,
      currency TEXT DEFAULT 'INR',
      status TEXT DEFAULT 'CREATED',
      payment_method TEXT,
      raw_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
    )
  `);

  // Payment audit log / events table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS payment_events (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload TEXT,
      signature_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Notifications / Announcements table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      batch_id TEXT DEFAULT 'batch-1',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'announcement',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Submissions table for student assignments and projects
  await dbRun(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      project_title TEXT NOT NULL,
      github_repo_url TEXT NOT NULL,
      live_deployment_url TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'SUBMITTED',
      feedback TEXT,
      grade TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Certificates table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      program TEXT DEFAULT '3-Month Full Stack Development Internship',
      batch TEXT DEFAULT 'Batch 1',
      duration TEXT DEFAULT '3 Months',
      issue_date TEXT NOT NULL,
      status TEXT DEFAULT 'ISSUED',
      verification_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Offer Letters table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS offer_letters (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      program TEXT NOT NULL,
      domain TEXT NOT NULL,
      batch TEXT DEFAULT 'Batch 1',
      duration TEXT DEFAULT '1 Month',
      issue_date TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      verification_code TEXT UNIQUE NOT NULL,
      terms TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Support Tickets table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES students(id)
    )
  `);

  // Support Ticket Replies table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS support_replies (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    )
  `);

  // Audit Logs table for Admin Operations
  await dbRun(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      admin_name TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User-specific / In-App Notifications table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Student Tasks table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS student_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      domain TEXT DEFAULT 'Full Stack Development',
      difficulty TEXT DEFAULT 'Beginner',
      due_date TEXT NOT NULL,
      key_features TEXT NOT NULL,
      expected_outcome TEXT NOT NULL,
      order_num INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1
    )
  `);

  // 3-Stage Internship Workflow tables
  await dbRun(`
    CREATE TABLE IF NOT EXISTS intern_workflows (
      id TEXT PRIMARY KEY,
      student_id TEXT UNIQUE NOT NULL,
      batch_id TEXT DEFAULT 'batch-1',
      current_stage INTEGER DEFAULT 1,
      stage1_status TEXT DEFAULT 'PENDING',
      stage2_status TEXT DEFAULT 'LOCKED',
      stage3_status TEXT DEFAULT 'LOCKED',
      is_manually_locked INTEGER DEFAULT 0,
      manual_lock_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS linkedin_submissions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      offer_letter_id TEXT,
      post_url TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING_VERIFICATION',
      admin_feedback TEXT,
      reviewed_by TEXT,
      reviewed_at DATETIME,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS training_modules (
      id TEXT PRIMARY KEY,
      module_num INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      short_title TEXT NOT NULL,
      description TEXT NOT NULL,
      objectives TEXT NOT NULL,
      instructions TEXT NOT NULL,
      exercises TEXT NOT NULL,
      resources TEXT NOT NULL,
      submission_fields TEXT NOT NULL,
      order_num INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS training_submissions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      submission_url TEXT,
      github_url TEXT,
      live_demo_url TEXT,
      notes TEXT,
      submission_data TEXT,
      status TEXT DEFAULT 'SUBMITTED',
      admin_feedback TEXT,
      reviewed_by TEXT,
      reviewed_at DATETIME,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (module_id) REFERENCES training_modules(id) ON DELETE CASCADE,
      UNIQUE(student_id, module_id)
    )
  `);

  // Safe column additions to students
  try {
    await dbRun(`ALTER TABLE students ADD COLUMN bio TEXT`);
  } catch (e) {}
  try {
    await dbRun(`ALTER TABLE students ADD COLUMN is_active INTEGER DEFAULT 1`);
  } catch (e) {}
  try {
    await dbRun(`ALTER TABLE students ADD COLUMN avatar_url TEXT`);
  } catch (e) {}

  // Seed default batch
  const existingBatch = await dbGet(`SELECT id FROM batches WHERE id = 'batch-1'`);
  if (!existingBatch) {
    await dbRun(`
      INSERT INTO batches (id, name, title, internship_fee, registration_fee, start_notice)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'batch-1',
      'Batch 1',
      '3-Month Full Stack Development Internship',
      0.00,
      200.00,
      'Batch 1 starts within the next 10 days. Exact start date, schedule and further instructions will be shared through the official WhatsApp group.'
    ]);
  }

  // Seed default settings
  const defaultSettings = [
    {
      key: 'BATCH_1_WHATSAPP_URL',
      value: process.env.BATCH_1_WHATSAPP_URL || 'https://chat.whatsapp.com/SkyrovixBatch1Official',
      description: 'Official WhatsApp Group invitation link for Batch 1 students'
    },
    {
      key: 'BATCH_START_NOTICE',
      value: 'Batch 1 starts within the next 10 days.',
      description: 'Public announcement notice displayed across hero & banners'
    },
    {
      key: 'REGISTRATION_FEE',
      value: '200',
      description: 'Registration fee amount in INR'
    },
    {
      key: 'REGISTRATION_STATUS_ACTIVE',
      value: 'true',
      description: 'Whether new registrations are active'
    }
  ];

  for (const s of defaultSettings) {
    const exists = await dbGet(`SELECT key FROM settings WHERE key = ?`, [s.key]);
    if (!exists) {
      await dbRun(`INSERT INTO settings (key, value, description) VALUES (?, ?, ?)`, [s.key, s.value, s.description]);
    }
  }

  // Seed default admin account (admin@skyrovix.com / Skyrovix@Admin2026)
  const existingAdmin = await dbGet(`SELECT id FROM admins WHERE email = ?`, ['admin@skyrovix.com']);
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Skyrovix@Admin2026', salt);
    await dbRun(`
      INSERT INTO admins (id, username, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `, [
      'admin-default',
      'skyrovix_admin',
      'admin@skyrovix.com',
      passwordHash,
      'SUPER_ADMIN'
    ]);
    console.log('👑 Default admin seeded: admin@skyrovix.com (Password: Skyrovix@Admin2026)');
  }

  // Seed sample announcements
  const existingAnnouncements = await dbAll(`SELECT id FROM notifications LIMIT 1`);
  if (existingAnnouncements.length === 0) {
    await dbRun(`
      INSERT INTO notifications (id, batch_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `, [
      'ann-1',
      'batch-1',
      'Welcome to Skyrovix Batch 1 Internship',
      'Congratulations on your registration! Please ensure you join the official WhatsApp group for live orientation schedules and starter repositories.',
      'announcement'
    ]);
    await dbRun(`
      INSERT INTO notifications (id, batch_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `, [
      'ann-2',
      'batch-1',
      'Pre-Internship Setup: Git & Node.js Environment',
      'Before orientation, ensure Node.js LTS and Git are installed on your workstation. Review the Month 1 Roadmap.',
      'info'
    ]);
  }

  // Seed default student tasks (50 Full Stack Projects)
  const existingTasks = await dbAll(`SELECT id FROM student_tasks LIMIT 1`);
  if (existingTasks.length === 0) {
    try {
      const { allProjects } = await import('../client/src/data/projects.js');
      for (const p of allProjects) {
        const features = [
          'Tech: ' + p.tech.join(', '),
          'Learn: ' + p.whatToLearn,
          ...p.projectRequirements
        ];
        await dbRun(`
          INSERT INTO student_tasks (id, title, description, domain, difficulty, due_date, key_features, expected_outcome, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          p.id,
          p.num + '. ' + p.title,
          p.whatToLearn,
          'Full Stack Development',
          p.difficulty,
          p.dueDate,
          JSON.stringify(features),
          p.expectedOutcome,
          parseInt(p.num, 10)
        ]);
      }
    } catch (err) {
      console.error('Error seeding 50 projects in db.js:', err);
    }
  }

  // Seed default Offer Letter for Hariharan S if exists
  const hariharan = await dbGet(`SELECT id, full_name, department FROM students WHERE email = 'skyrovix@gmail.com'`);
  if (hariharan) {
    const existingOL = await dbGet(`SELECT id FROM offer_letters WHERE student_id = ?`, [hariharan.id]);
    if (!existingOL) {
      await dbRun(`
        INSERT INTO offer_letters (id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'OL-SKX-2026-9055',
        hariharan.id,
        hariharan.full_name,
        '3-Month Full Stack Development Internship',
        'Full Stack Development',
        'Batch 1',
        '1 Month',
        '21 Sept 2026',
        'ACTIVE',
        'SKX-OL-2026-9055',
        'Virtual internship engagement with mandatory milestone deliverables and code evaluations.'
      ]);
    }

    // Seed sample support ticket for Hariharan
    const existingTicket = await dbGet(`SELECT id FROM support_tickets WHERE user_id = ?`, [hariharan.id]);
    if (!existingTicket) {
      await dbRun(`
        INSERT INTO support_tickets (id, user_id, user_name, user_email, subject, category, message, priority, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'TICK-1001',
        hariharan.id,
        hariharan.full_name,
        'skyrovix@gmail.com',
        'Clarification regarding Task 1 Cloud Storage repository structure',
        'Internship Tasks',
        'Hello Skyrovix Team, should I configure AWS S3 bucket directly or use local MinIO for testing during sprint 1?',
        'Medium',
        'In Progress'
      ]);

      await dbRun(`
        INSERT INTO support_replies (id, ticket_id, sender_id, sender_name, sender_role, message)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'REP-1001-1',
        'TICK-1001',
        'admin-default',
        'Skyrovix Mentor Board',
        'ADMIN',
        'Hi Hariharan! You can use either AWS S3 Free Tier or local MinIO/Supabase Storage for your demonstration. Make sure your repository README contains setup steps.'
      ]);
    }

    // Seed sample user notifications
    const existingUserNotifs = await dbAll(`SELECT id FROM user_notifications WHERE user_id = ?`, [hariharan.id]);
    if (existingUserNotifs.length === 0) {
      await dbRun(`
        INSERT INTO user_notifications (id, user_id, title, message, type, is_read, link)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'notif-1',
        hariharan.id,
        'Offer Letter Generated & Ready',
        'Your official Skyrovix Batch 1 offer letter (Ref: SKX-OL-2026-9055) has been issued and verified.',
        'offer_letter',
        0,
        '/dashboard/offer-letters'
      ]);
      await dbRun(`
        INSERT INTO user_notifications (id, user_id, title, message, type, is_read, link)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'notif-2',
        hariharan.id,
        'Task 1 Evaluated & Passed',
        'Your Cloud File Storage submission has been approved by the mentor board with grade A+.',
        'task',
        1,
        '/dashboard/tasks'
      ]);
    }
  }

  // Seed sample audit log
  const existingAudit = await dbAll(`SELECT id FROM audit_logs LIMIT 1`);
  if (existingAudit.length === 0) {
    await dbRun(`
      INSERT INTO audit_logs (id, admin_id, admin_name, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      'log-1',
      'admin-default',
      'Skyrovix Admin',
      'BATCH_INITIALIZED',
      'BATCH',
      'batch-1',
      'Batch 1 program and default curriculum initialized'
    ]);
  }

  // Seed default 5 Training Modules
  const existingTrainingModules = await dbAll(`SELECT id FROM training_modules LIMIT 1`);
  if (existingTrainingModules.length === 0) {
    for (const m of DEFAULT_TRAINING_MODULES) {
      await dbRun(`
        INSERT INTO training_modules (
          id, module_num, title, short_title, description, objectives, instructions, exercises, resources, submission_fields, order_num, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        m.id,
        m.module_num,
        m.title,
        m.short_title,
        m.description,
        m.objectives,
        m.instructions,
        m.exercises,
        m.resources,
        m.submission_fields,
        m.order_num,
        m.is_active
      ]);
    }
    console.log('📚 Seeded 5 Training & Learning Modules successfully.');
  }

  // Backfill intern_workflows for existing confirmed/paid students
  try {
    const confirmedStudents = await dbAll(`
      SELECT r.student_id, r.registration_status, r.payment_status 
      FROM registrations r
      WHERE r.registration_status = 'CONFIRMED' OR r.payment_status = 'PAID'
    `);

    for (const cs of confirmedStudents) {
      const existingWf = await dbGet(`SELECT id FROM intern_workflows WHERE student_id = ?`, [cs.student_id]);
      if (!existingWf) {
        const approvedSubmissions = await dbGet(`
          SELECT COUNT(*) as count FROM submissions WHERE student_id = ? AND status = 'APPROVED'
        `, [cs.student_id]);
        const hasApprovedTasks = (approvedSubmissions?.count || 0) > 0;
        const isHariharan = cs.student_id === 'std_d4e07eca887784b0';

        const stage = (hasApprovedTasks || isHariharan) ? 3 : 1;
        const stage1 = (hasApprovedTasks || isHariharan) ? 'APPROVED' : 'PENDING';
        const stage2 = (hasApprovedTasks || isHariharan) ? 'COMPLETED' : 'LOCKED';
        const stage3 = (hasApprovedTasks || isHariharan) ? 'UNLOCKED' : 'LOCKED';

        await dbRun(`
          INSERT INTO intern_workflows (id, student_id, batch_id, current_stage, stage1_status, stage2_status, stage3_status)
          VALUES (?, ?, 'batch-1', ?, ?, ?, ?)
        `, [`wf_${cs.student_id}`, cs.student_id, stage, stage1, stage2, stage3]);

        if (hasApprovedTasks || isHariharan) {
          const existingLS = await dbGet(`SELECT id FROM linkedin_submissions WHERE student_id = ?`, [cs.student_id]);
          if (!existingLS) {
            await dbRun(`
              INSERT INTO linkedin_submissions (id, student_id, post_url, status, admin_feedback, reviewed_by, reviewed_at)
              VALUES (?, ?, ?, 'APPROVED', 'Verified official offer letter publication.', 'admin-default', CURRENT_TIMESTAMP)
            `, [`ls_${cs.student_id}`, cs.student_id, 'https://www.linkedin.com/posts/skyrovix_internship-offer-batch1-activity-7123456789']);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Notice during intern_workflows backfill:', err.message);
  }

  console.log('✅ Database tables and seed records initialized successfully.');
}

// 5 Standard Training Modules Specification
export const DEFAULT_TRAINING_MODULES = [
  {
    id: 'mod-1',
    module_num: 1,
    title: 'Module 1: AI Tools & Development Workflow',
    short_title: 'AI Tools & Dev Workflow',
    description: 'Master cutting-edge AI software engineering assistants, prompt-driven architecture design, and enterprise Git branch workflows.',
    objectives: JSON.stringify([
      'Configure and utilize AI-assisted coding tools (GitHub Copilot, Cursor, Gemini CLI) for accelerated full-stack development.',
      'Implement prompt engineering patterns for code generation, test scaffolding, and architectural refactoring.',
      'Establish disciplined Git branching, feature workflows, atomic conventional commits, and pull request reviews.',
      'Set up Node.js 18+ and React development environments with ESLint, Prettier, and automated lint checks.'
    ]),
    instructions: `### Module Overview
In this module, you will establish a high-productivity software development environment integrating industry-grade AI tools and structured Git version control.

### Step-by-Step Instructions:
1. **Environment Setup**: Ensure Node.js 18+ LTS and Git are installed on your workstation.
2. **AI Tooling Configuration**: Set up an AI coding assistant (Cursor, GitHub Copilot, Gemini Code Assist, or Claude Code) in your IDE.
3. **Structured Prompting Practice**: Practice prompt-driven component generation by scaffolding a responsive UI component using structured system and user prompts.
4. **Git Feature Workflow**: Initialize a Git repository, create a feature branch named \`feature/ai-workflow-setup\`, and commit at least 3 atomic changes using the Conventional Commits specification (\`feat:\`, \`fix:\`, \`docs:\`).
5. **PR & Code Review Readiness**: Push your branch to GitHub, open a Pull Request with a clear summary, and document prompt interactions and code verification.`,
    exercises: JSON.stringify([
      { name: 'AI Environment Setup', task: 'Install Node.js 18+, Git, and configure an AI coding assistant in VS Code or Cursor.' },
      { name: 'Prompt-Driven Component Scaffolding', task: 'Generate a typed, accessible UI card component using structured prompt engineering.' },
      { name: 'Conventional Git Workflow', task: 'Initialize a repo, create a feature branch, and submit clean atomic commits conforming to conventional commit standards.' }
    ]),
    resources: JSON.stringify([
      { title: 'Prompt Engineering for Software Engineers', url: 'https://skyrovix.com/resources/ai-prompting-guide', type: 'Guide' },
      { title: 'Conventional Commits Specification', url: 'https://www.conventionalcommits.org', type: 'Docs' },
      { title: 'GitHub Flow & Pull Request Best Practices', url: 'https://docs.github.com/en/get-started/using-github/github-flow', type: 'Docs' }
    ]),
    submission_fields: JSON.stringify([
      { name: 'github_url', label: 'GitHub Repository URL', type: 'url', required: true, placeholder: 'https://github.com/username/ai-workflow-starter' },
      { name: 'live_demo_url', label: 'Walkthrough or Demo Link', type: 'url', required: false, placeholder: 'https://loom.com/share/... or YouTube link (optional)' },
      { name: 'notes', label: 'Prompt Engineering Notes & Tools Used', type: 'textarea', required: true, placeholder: 'Detail which AI tools you used, prompts tested, and key learnings...' }
    ]),
    order_num: 1,
    is_active: 1
  },
  {
    id: 'mod-2',
    module_num: 2,
    title: 'Module 2: Database & Project Development',
    short_title: 'Database & Data Modeling',
    description: 'Design relational database schemas, write optimized SQL queries, and implement complete ACID-compliant CRUD operations.',
    objectives: JSON.stringify([
      'Model complex relational schemas using Entity-Relationship Diagrams (ERD) and 3NF normalization.',
      'Implement schema migration scripts with primary keys, foreign keys, indexes, and unique constraints.',
      'Write parameterized, injection-safe SQL queries including multi-table JOINs, subqueries, and aggregations.',
      'Compare relational SQLite/PostgreSQL architectures with document NoSQL datastores.'
    ]),
    instructions: `### Module Overview
Learn how to design robust relational database architectures from scratch, avoiding data redundancy and enforcing relational integrity.

### Step-by-Step Instructions:
1. **Entity-Relationship Modeling**: Create a visual ERD diagram representing a multi-tenant platform (Users, Roles, Batches, Projects, Submissions, Audit Logs).
2. **Schema Migration Scripting**: Write clean SQL DDL statements creating normalized tables with appropriate data types, foreign key constraints (\`ON DELETE CASCADE\`), and indexed lookup fields.
3. **Synthetic Seed Data**: Write a seeding script inserting at least 15-20 rows of interrelated test data.
4. **Analytical SQL Queries**: Construct and execute 5 complex SQL queries showcasing INNER JOIN, LEFT JOIN, GROUP BY aggregations, and date filtering.
5. **Documentation & Benchmark**: Push SQL files and ERD diagram to GitHub with clear execution instructions in your README.`,
    exercises: JSON.stringify([
      { name: 'Relational Schema Design', task: 'Create a normalized ERD covering User, Batch, Project, and Review relationships.' },
      { name: 'Migration & Seeding Script', task: 'Write safe DDL migration scripts with foreign keys and automated seed data.' },
      { name: 'Advanced SQL Query Suite', task: 'Execute complex multi-table JOIN queries with aggregation and performance index validation.' }
    ]),
    resources: JSON.stringify([
      { title: 'Relational Database Normalization Guide (1NF to 3NF)', url: 'https://skyrovix.com/resources/db-normalization', type: 'Guide' },
      { title: 'SQL Injection Prevention & Parameterized Queries', url: 'https://owasp.org/www-community/attacks/SQL_Injection', type: 'Security' },
      { title: 'DBeaver / DB Browser Tooling', url: 'https://dbeaver.io', type: 'Tool' }
    ]),
    submission_fields: JSON.stringify([
      { name: 'github_url', label: 'GitHub Repository URL (with SQL / Schema files)', type: 'url', required: true, placeholder: 'https://github.com/username/relational-db-project' },
      { name: 'live_demo_url', label: 'ERD Diagram Link (dbdiagram.io / Figma / Image)', type: 'url', required: false, placeholder: 'https://dbdiagram.io/d/...' },
      { name: 'notes', label: 'Schema Architecture & Query Explanation', type: 'textarea', required: true, placeholder: 'Explain your normalization choices, foreign key constraints, and index decisions...' }
    ]),
    order_num: 2,
    is_active: 1
  },
  {
    id: 'mod-3',
    module_num: 3,
    title: 'Module 3: Database + Backend Practical Work',
    short_title: 'Backend Architecture & APIs',
    description: 'Build robust, secure, and production-ready server applications with industry-standard REST architectures.',
    objectives: JSON.stringify([
      'Construct layered Express.js REST APIs with structured controllers, routes, and middleware chains.',
      'Implement secure JWT authentication, bcrypt password hashing, and token validation.',
      'Build Role-Based Access Control (RBAC) middleware for student vs administrator roles.',
      'Implement request body validation, rate limiting, and centralized async error handling.'
    ]),
    instructions: `### Module Overview
Bridge database models with secure backend API services following production Express.js and Node.js best practices.

### Step-by-Step Instructions:
1. **Server Boilerplate Setup**: Initialize Express.js with JSON parsing, CORS configuration, Helmet security headers, and express-rate-limit.
2. **Authentication Flow**: Build \`/api/auth/register\` and \`/api/auth/login\` with bcrypt password hashing (salt rounds: 10) and signed JWT tokens.
3. **Authorization Middleware**: Implement JWT verification middleware and role guards (\`authenticateToken\`, \`requireRole('ADMIN')\`).
4. **CRUD REST Endpoints**: Build full CRUD operations for an assigned entity (e.g., student tasks / submissions), ensuring all SQL operations use parameterized queries.
5. **API Verification Suite**: Test all endpoints with Postman, Bruno, or VS Code REST Client, documenting successful and failure response payloads.`,
    exercises: JSON.stringify([
      { name: 'Auth & JWT Middleware', task: 'Build token verification and role guard middleware with Bearer header parsing.' },
      { name: 'Parameterized DB Integration', task: 'Connect controllers to the database using parameterized prepared statements.' },
      { name: 'API Test Verification', task: 'Test 200, 400, 401, 403, and 500 status code flows with Postman/cURL.' }
    ]),
    resources: JSON.stringify([
      { title: 'Express.js Production Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html', type: 'Docs' },
      { title: 'OWASP REST Security Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html', type: 'Docs' },
      { title: 'JWT Authentication Architecture', url: 'https://skyrovix.com/resources/jwt-architecture', type: 'Guide' }
    ]),
    submission_fields: JSON.stringify([
      { name: 'github_url', label: 'Backend API GitHub Repository URL', type: 'url', required: true, placeholder: 'https://github.com/username/express-backend-api' },
      { name: 'live_demo_url', label: 'Postman Collection / API Documentation URL', type: 'url', required: false, placeholder: 'https://documenter.getpostman.com/view/...' },
      { name: 'notes', label: 'API Endpoints & Security Implementation Summary', type: 'textarea', required: true, placeholder: 'Describe your route structure, auth middleware, and validation rules...' }
    ]),
    order_num: 3,
    is_active: 1
  },
  {
    id: 'mod-4',
    module_num: 4,
    title: 'Module 4: Project Implementation',
    short_title: 'Full Stack Integration',
    description: 'Integrate client-side React applications with authenticated backend APIs, state management, and real-time feedback.',
    objectives: JSON.stringify([
      'Integrate React components with asynchronous backend REST APIs using the Fetch API and React hooks.',
      'Implement persistent client-side authentication state and protected route guards.',
      'Build intuitive user interfaces with responsive layout grids, toast notifications, and modal dialogs.',
      'Handle loading skeletons, empty data states, and graceful network error boundaries.'
    ]),
    instructions: `### Module Overview
Bring the frontend and backend together into a cohesive, responsive, full-stack web application.

### Step-by-Step Instructions:
1. **Frontend Architecture**: Build a React Single Page Application using Vite, Tailwind CSS, and Lucide icons.
2. **API Client Integration**: Connect user registration and login forms to your Module 3 backend, storing tokens in localStorage and managing auth state.
3. **Data Fetching & Feedback**: Implement loading states, skeleton screens, error alerts, and animated toast feedback for async operations.
4. **Form Validation & Modals**: Implement interactive modal dialogs with strict client-side validation and responsive mobile layouts.
5. **Comprehensive Walkthrough**: Document the application workflow in your GitHub README with screenshots or a live preview link.`,
    exercises: JSON.stringify([
      { name: 'API State Orchestration', task: 'Implement custom React hooks for data fetching, caching, and state synchronization.' },
      { name: 'Protected Route Guards', task: 'Guard protected routes redirecting unauthenticated users to the login screen.' },
      { name: 'Form Validation & Toasts', task: 'Implement robust client-side validation with real-time field error indicators.' }
    ]),
    resources: JSON.stringify([
      { title: 'React Modern Hooks Pattern Guide', url: 'https://react.dev/reference/react', type: 'Docs' },
      { title: 'Tailwind CSS Responsive Design Strategies', url: 'https://tailwindcss.com/docs/responsive-design', type: 'Docs' },
      { title: 'Frontend Error Handling & Toast Systems', url: 'https://skyrovix.com/resources/frontend-error-handling', type: 'Guide' }
    ]),
    submission_fields: JSON.stringify([
      { name: 'github_url', label: 'Full Stack GitHub Repository URL', type: 'url', required: true, placeholder: 'https://github.com/username/fullstack-app' },
      { name: 'live_demo_url', label: 'Live Client Preview URL (Vercel / Render / Netlify)', type: 'url', required: false, placeholder: 'https://my-app.vercel.app' },
      { name: 'notes', label: 'Architecture & Component Breakdown Notes', type: 'textarea', required: true, placeholder: 'Summarize components created, state flow, and user experience optimizations...' }
    ]),
    order_num: 4,
    is_active: 1
  },
  {
    id: 'mod-5',
    module_num: 5,
    title: 'Module 5: Deployment & Hosting',
    short_title: 'Cloud Deployment & DevOps',
    description: 'Deploy full-stack applications to modern cloud platforms, configure production domains, environment variables, and CI/CD pipelines.',
    objectives: JSON.stringify([
      'Deploy frontend client builds to static hosting networks (Vercel, Netlify, or Render Static).',
      'Deploy Node.js backend services to cloud containers or compute runtimes (Render, Railway, or VPS).',
      'Configure production environment variables, database URLs, and cross-origin CORS rules.',
      'Set up automated GitHub Actions workflow for linting, testing, and continuous deployment.',
      'Verify HTTPS/SSL certificates, health check endpoints, and live production error logs.'
    ]),
    instructions: `### Module Overview
Deploy your full-stack system to production cloud environments with automated continuous delivery and monitoring.

### Step-by-Step Instructions:
1. **Production Build Verification**: Run \`npm run build\` and ensure the bundle builds cleanly without lint or compilation errors.
2. **Backend Cloud Deployment**: Deploy your Node.js server to Render, Railway, or Koyeb. Set environment variables (\`PORT\`, \`NODE_ENV=production\`, \`JWT_SECRET\`) securely.
3. **Frontend Cloud Deployment**: Deploy your React frontend to Vercel, configuring rewrite rules for SPA client routing and pointing API endpoints to the live backend.
4. **CORS & Domain Security**: Enforce CORS origins on the live backend matching only your production frontend domain.
5. **CI/CD Automation & Verification**: Create a GitHub Actions workflow (\`.github/workflows/deploy.yml\`) to automatically lint and test on every push to \`main\`. Verify live HTTPS.`,
    exercises: JSON.stringify([
      { name: 'Production Build & Optimization', task: 'Generate production bundles using `npm run build` and eliminate debug logs.' },
      { name: 'Cloud Service Deployment', task: 'Deploy backend and frontend services with configured environment variables.' },
      { name: 'Live Health Check Verification', task: 'Perform end-to-end verification on the live URL with live SSL/HTTPS.' }
    ]),
    resources: JSON.stringify([
      { title: 'Vercel & Render Deployment Checklist', url: 'https://skyrovix.com/resources/cloud-deployment-checklist', type: 'Guide' },
      { title: 'Production CORS & Environment Configuration', url: 'https://skyrovix.com/resources/production-security', type: 'Docs' },
      { title: 'GitHub Actions CI/CD Starter for Node & React', url: 'https://docs.github.com/en/actions', type: 'Docs' }
    ]),
    submission_fields: JSON.stringify([
      { name: 'live_demo_url', label: 'Live Production Frontend URL', type: 'url', required: true, placeholder: 'https://my-app.vercel.app' },
      { name: 'github_url', label: 'GitHub Repository with CI/CD Workflow', type: 'url', required: true, placeholder: 'https://github.com/username/fullstack-app' },
      { name: 'notes', label: 'Live Server Health URL & Deployment Notes', type: 'textarea', required: true, placeholder: 'Provide live health check endpoint URL (e.g. https://api.my-app.onrender.com/api/health) and deployment summary...' }
    ]),
    order_num: 5,
    is_active: 1
  }
];

// Helper to get or create an intern workflow record
export async function getOrCreateInternWorkflow(studentId) {
  let wf = await dbGet(`SELECT * FROM intern_workflows WHERE student_id = ?`, [studentId]);
  if (!wf) {
    const id = `wf_${studentId}`;
    await dbRun(`
      INSERT INTO intern_workflows (id, student_id, batch_id, current_stage, stage1_status, stage2_status, stage3_status)
      VALUES (?, ?, 'batch-1', 1, 'PENDING', 'LOCKED', 'LOCKED')
    `, [id, studentId]);
    wf = await dbGet(`SELECT * FROM intern_workflows WHERE student_id = ?`, [studentId]);
  }
  return wf;
}


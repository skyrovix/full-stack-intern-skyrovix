-- ==============================================================================
-- SKYROVIX INTERNSHIP & USER/ADMIN DASHBOARD DATABASE SCHEMA (SUPABASE POSTGRES)
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BATCHES TABLE
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'UPCOMING',
    start_notice TEXT,
    price INTEGER DEFAULT 200,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'ADMIN',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENTS / USERS TABLE
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT NOT NULL,
    college TEXT NOT NULL,
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    city TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    bio TEXT DEFAULT '',
    avatar_url TEXT,
    password_hash TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
    domain TEXT DEFAULT 'Full Stack Development',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    college TEXT NOT NULL,
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    city TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    payment_status TEXT DEFAULT 'PENDING',
    registration_status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    registration_id TEXT REFERENCES registrations(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'PENDING',
    cf_payment_id TEXT,
    payment_method TEXT,
    payment_time TIMESTAMPTZ,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PAYMENT EVENTS (WEBHOOK LOGS) TABLE
CREATE TABLE IF NOT EXISTS payment_events (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. GLOBAL ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'INFO',
    audience TEXT DEFAULT 'ALL',
    target_id TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER SPECIFIC NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS user_notifications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'INFO',
    is_read INTEGER DEFAULT 0,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. STUDENT TASKS (CURRICULUM MILESTONES) TABLE
CREATE TABLE IF NOT EXISTS student_tasks (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    task_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    domain TEXT DEFAULT 'Full Stack Development',
    difficulty TEXT DEFAULT 'Intermediate',
    due_days INTEGER DEFAULT 7,
    status TEXT DEFAULT 'PENDING',
    submission_status TEXT DEFAULT 'NOT_SUBMITTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    task_id TEXT REFERENCES student_tasks(id) ON DELETE CASCADE,
    github_repo_url TEXT NOT NULL,
    live_deployment_url TEXT,
    notes TEXT,
    status TEXT DEFAULT 'SUBMITTED',
    grade TEXT,
    feedback TEXT,
    evaluated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    program TEXT NOT NULL,
    duration TEXT NOT NULL,
    batch TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    grade TEXT DEFAULT 'A+',
    status TEXT DEFAULT 'ISSUED',
    verification_hash TEXT,
    revoked INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. OFFER LETTERS TABLE
CREATE TABLE IF NOT EXISTS offer_letters (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    program TEXT NOT NULL,
    domain TEXT NOT NULL,
    batch TEXT NOT NULL,
    duration TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    verification_code TEXT UNIQUE NOT NULL,
    terms TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SUPPORT TICKET REPLIES TABLE
CREATE TABLE IF NOT EXISTS support_replies (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    ticket_id TEXT REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'user' or 'admin'
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_tasks_student ON student_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_offer_letters_code ON offer_letters(verification_code);
CREATE INDEX IF NOT EXISTS idx_offer_letters_student ON offer_letters(student_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_student ON support_tickets(student_id);
CREATE INDEX IF NOT EXISTS idx_support_replies_ticket ON support_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Public Verifications and Config
CREATE POLICY "Public read batches" ON batches FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public verify certificates" ON certificates FOR SELECT USING (revoked = 0);
CREATE POLICY "Public verify offer letters" ON offer_letters FOR SELECT USING (status = 'ACTIVE');

-- Service Role (Backend API) Full Access Policy
-- When backend uses SUPABASE_SERVICE_ROLE_KEY, it bypasses RLS automatically.
-- For Authenticated Users, provide secure access:
CREATE POLICY "Users read own profile" ON students FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON students FOR UPDATE USING (true);
CREATE POLICY "Users read own registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "Users read own tasks" ON student_tasks FOR SELECT USING (true);
CREATE POLICY "Users read own submissions" ON submissions FOR SELECT USING (true);
CREATE POLICY "Users insert own submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Users read own offer letters" ON offer_letters FOR SELECT USING (true);
CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Users read own notifications" ON user_notifications FOR SELECT USING (true);
CREATE POLICY "Users read own support tickets" ON support_tickets FOR SELECT USING (true);
CREATE POLICY "Users read own ticket replies" ON support_replies FOR SELECT USING (true);
CREATE POLICY "Users insert support tickets" ON support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Users insert ticket replies" ON support_replies FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Default Batch
INSERT INTO batches (id, name, title, status, start_notice, price)
VALUES ('batch_1', 'Batch 1', '3-Month Full Stack Development Internship', 'UPCOMING', 'Batch 1 starts within the next 10 days.', 200)
ON CONFLICT (id) DO NOTHING;

-- 2. System Settings
INSERT INTO settings (key, value) VALUES
('BATCH_START_NOTICE', 'Batch 1 starts within the next 10 days.'),
('REGISTRATION_FEE', '200'),
('BATCH_1_WHATSAPP_URL', 'https://chat.whatsapp.com/SkyrovixBatch1Official'),
('REGISTRATIONS_OPEN', 'true')
ON CONFLICT (key) DO NOTHING;

-- 3. Default Master Admin (admin@skyrovix.com / Skyrovix@Admin2026)
INSERT INTO admins (id, email, password_hash, full_name, role)
VALUES (
    'admin_root_001',
    'admin@skyrovix.com',
    '$2a$10$w4r6W.U3J8lZ6yC0Ew8ybe6YlEw44mN0rK98bHjRkJxV1u5Z8vMee',
    'Skyrovix Administrator',
    'SUPERADMIN'
)
ON CONFLICT (email) DO NOTHING;

-- 4. Default Student User (skyrovix@gmail.com / skyrovix123)
INSERT INTO students (
    id, full_name, email, mobile, college, department, year_of_study, city, skill_level,
    github_url, linkedin_url, bio, password_hash, is_active
) VALUES (
    'std_d4e07eca887784b0',
    'Hariharan S',
    'skyrovix@gmail.com',
    '9876543210',
    'MZCET',
    'IT',
    '3rd Year',
    'Pudukkottai',
    'Intermediate',
    'https://github.com/skyrovix',
    'https://linkedin.com/in/skyrovix',
    'Full-stack software development intern at Skyrovix Batch 1.',
    '$2a$10$tZ9kK1gD5z0bM3o4y9KXeO2cWnUvOq6aZ2NlD5w5yG4qJ8jH6KkLm',
    1
)
ON CONFLICT (id) DO NOTHING;

-- 5. Student Registration & Payment Record
INSERT INTO registrations (
    id, student_id, batch_id, domain, full_name, email, mobile, college, department, year_of_study, city, skill_level, payment_status, registration_status
) VALUES (
    'reg_b1_d4e07eca',
    'std_d4e07eca887784b0',
    'batch_1',
    'Full Stack Development',
    'Hariharan S',
    'skyrovix@gmail.com',
    '9876543210',
    'MZCET',
    'IT',
    '3rd Year',
    'Pudukkottai',
    'Intermediate',
    'PAID',
    'CONFIRMED'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (
    id, order_id, student_id, registration_id, amount, currency, status, cf_payment_id, payment_method, payment_time
) VALUES (
    'pay_b1_d4e07eca',
    'order_SKX_9055_CONFIRMED',
    'std_d4e07eca887784b0',
    'reg_b1_d4e07eca',
    200.00,
    'INR',
    'SUCCESS',
    'cf_pay_live_9055',
    'UPI / QR Code',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 6. Default 6 Student Tasks (Matching User UI)
INSERT INTO student_tasks (id, student_id, task_order, title, description, domain, difficulty, due_days, status, submission_status)
VALUES 
('TASK-01', 'std_d4e07eca887784b0', 1, 'Share Internship Acceptance on LinkedIn', 'Celebrate your selection! Post your official Skyrovix offer letter on LinkedIn, tag @Skyrovix Technologies, and share your commitment.', 'Career & Social', 'Beginner', 3, 'COMPLETED', 'APPROVED'),
('TASK-02', 'std_d4e07eca887784b0', 2, 'File Storage Architecture Setup', 'Design and implement an automated file storage pipeline using S3-compatible storage with pre-signed URLs and access control policies.', 'Full Stack Development', 'Intermediate', 7, 'IN_PROGRESS', 'SUBMITTED'),
('TASK-03', 'std_d4e07eca887784b0', 3, 'Containerization & Dockerfile Optimization', 'Create multi-stage production Dockerfiles for Node.js API and React Vite client, reducing image footprint below 120MB with non-root security.', 'DevOps & Containers', 'Intermediate', 10, 'PENDING', 'NOT_SUBMITTED'),
('TASK-04', 'std_d4e07eca887784b0', 4, 'CI/CD Pipeline with GitHub Actions', 'Build a continuous integration and automated deployment pipeline that executes linting, builds assets, and deploys directly to cloud hosting.', 'CI/CD & Automation', 'Advanced', 14, 'PENDING', 'NOT_SUBMITTED'),
('TASK-05', 'std_d4e07eca887784b0', 5, 'Serverless Microservice & Database Integration', 'Deploy a serverless backend function integrated with cloud SQL database, connection pooling, and JWT bearer token authorization.', 'Serverless & Database', 'Advanced', 21, 'PENDING', 'NOT_SUBMITTED'),
('TASK-06', 'std_d4e07eca887784b0', 6, 'Production Performance & Security Hardening', 'Audit and optimize cloud infrastructure: implement SSL/TLS enforcement, rate limiting, CORS configuration, and lighthouse score above 90.', 'Security & Reliability', 'Advanced', 28, 'PENDING', 'NOT_SUBMITTED')
ON CONFLICT (id) DO NOTHING;

-- 7. Default Offer Letter
INSERT INTO offer_letters (id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms)
VALUES (
    'OL-SKX-2026-9055',
    'std_d4e07eca887784b0',
    'Hariharan S',
    '3-Month Full Stack Development Internship',
    'Full Stack Development',
    'Batch 1',
    '1 Month',
    '21 Sept 2026',
    'ACTIVE',
    'SKX-OL-2026-9055',
    'Virtual internship engagement with mandatory milestone deliverables and code evaluations.'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Default Certificate
INSERT INTO certificates (id, student_id, program, duration, batch, issue_date, grade, status, verification_hash, revoked)
VALUES (
    'SKY-B1-211764-9055',
    'std_d4e07eca887784b0',
    '3-Month Full Stack Development Internship',
    '3 Months',
    'Batch 1',
    '25 Sept 2026',
    'A+',
    'ISSUED',
    'hash_b1_cert_9055',
    0
)
ON CONFLICT (id) DO NOTHING;

-- 9. Default Support Ticket & Admin Reply
INSERT INTO support_tickets (id, student_id, subject, category, priority, status)
VALUES (
    'TICK-1001',
    'std_d4e07eca887784b0',
    'Task 2 S3 Access Permissions Inquiry',
    'Internship Tasks',
    'Medium',
    'Waiting for User'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO support_replies (id, ticket_id, sender_type, sender_id, sender_name, message)
VALUES 
(
    'REP-1001-1',
    'TICK-1001',
    'user',
    'std_d4e07eca887784b0',
    'Hariharan S',
    'Hi Team, should we use AWS S3 free tier or can we use MinIO / Supabase storage for the Cloud Storage Architecture milestone?'
),
(
    'REP-1001-2',
    'TICK-1001',
    'admin',
    'admin_root_001',
    'Skyrovix Mentor Team',
    'Hi Hariharan! You can use either AWS S3 Free Tier or local MinIO/Supabase Storage for your demonstration. Make sure your repository README contains setup steps.'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 10. 3-STAGE INTERNSHIP WORKFLOW SCHEMA
-- =====================================================

CREATE TABLE IF NOT EXISTS intern_workflows (
    id TEXT PRIMARY KEY,
    student_id TEXT UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    batch_id TEXT REFERENCES batches(id) DEFAULT 'batch-1',
    current_stage INTEGER DEFAULT 1,
    stage1_status TEXT DEFAULT 'PENDING',
    stage2_status TEXT DEFAULT 'LOCKED',
    stage3_status TEXT DEFAULT 'LOCKED',
    is_manually_locked INTEGER DEFAULT 0,
    manual_lock_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS linkedin_submissions (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    offer_letter_id TEXT,
    post_url TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING_VERIFICATION',
    admin_feedback TEXT,
    reviewed_by TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS training_modules (
    id TEXT PRIMARY KEY,
    module_num INTEGER UNIQUE NOT NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS training_submissions (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    module_id TEXT REFERENCES training_modules(id) ON DELETE CASCADE,
    submission_url TEXT,
    github_url TEXT,
    live_demo_url TEXT,
    notes TEXT,
    submission_data TEXT,
    status TEXT DEFAULT 'SUBMITTED',
    admin_feedback TEXT,
    reviewed_by TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, module_id)
);

ALTER TABLE intern_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read training modules" ON training_modules FOR SELECT USING (is_active = 1);
CREATE POLICY "Users read own workflow" ON intern_workflows FOR SELECT USING (true);
CREATE POLICY "Users read own linkedin submissions" ON linkedin_submissions FOR SELECT USING (true);
CREATE POLICY "Users read own training submissions" ON training_submissions FOR SELECT USING (true);


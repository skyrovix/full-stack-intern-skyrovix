import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

import {
  initDb,
  dbGet,
  dbAll,
  dbRun,
  getOrCreateInternWorkflow,
  DEFAULT_TRAINING_MODULES
} from './db.js';

import {
  createCashfreeOrder,
  verifyCashfreePayment,
  verifyCashfreeWebhookSignature,
  generateOrderId,
  isCashfreeConfigured,
  getCashfreeEnvironment
} from './cashfree.js';

import { isSupabaseConfigured } from './supabase.js';
import { pullFromSupabase, pushToSupabase } from './supabaseSync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skyrovix_super_secret_jwt_2026';

// Middleware for CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Capture raw body for Cashfree Webhook Signature Verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.use(express.urlencoded({ extended: true }));

// Rate limiting for public registration / payment APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/', apiLimiter);

// JWT Auth Middleware for Admin
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication session' });
  }
};

// Helper to record admin audit log
async function recordAuditLog(adminId, adminUsername, action, targetType, targetId, details) {
  try {
    const id = `audit_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : String(details);
    await dbRun(
      `INSERT INTO audit_logs (id, admin_id, admin_name, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, adminId || 'admin', adminUsername || 'Skyrovix Administrator', action, targetType, targetId || null, detailsStr]
    );
    await pushToSupabase('audit_logs', {
      id,
      admin_id: adminId || 'admin',
      action,
      target_type: targetType,
      target_id: targetId || 'SYSTEM',
      details: detailsStr
    });
  } catch (err) {
    console.warn('Audit log write error:', err.message);
  }
}

// ==========================================
// 1. PUBLIC CONFIGURATION & HEALTH
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Skyrovix Batch 1 Platform API',
    cashfree_configured: isCashfreeConfigured(),
    cashfree_env: getCashfreeEnvironment()
  });
});

app.get('/api/public/config', async (req, res) => {
  try {
    const whatsappSetting = await dbGet(`SELECT value FROM settings WHERE key = 'BATCH_1_WHATSAPP_URL'`);
    const startNotice = await dbGet(`SELECT value FROM settings WHERE key = 'BATCH_START_NOTICE'`);
    const regActive = await dbGet(`SELECT value FROM settings WHERE key = 'REGISTRATION_STATUS_ACTIVE'`);
    const batch = await dbGet(`SELECT * FROM batches WHERE id = 'batch-1'`);

    res.json({
      success: true,
      batch: {
        id: batch?.id || 'batch-1',
        name: batch?.name || 'Batch 1',
        title: batch?.title || '3-Month Full Stack Development Internship',
        internship_fee: 0,
        registration_fee: 200,
        start_notice: startNotice?.value || 'Batch 1 starts within the next 10 days.',
      },
      whatsapp_group_url: whatsappSetting?.value || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP',
      registration_active: regActive?.value !== 'false',
      cashfree_mode: isCashfreeConfigured() ? (process.env.CASHFREE_ENVIRONMENT || 'sandbox') : 'sandbox_simulation'
    });
  } catch (error) {
    console.error('Error fetching public config:', error);
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// Public Student Guide Blueprint (20 Modules & 15 Parts)
app.get('/api/public/student-guide', async (req, res) => {
  try {
    const guideData = await import('../client/src/data/studentGuide.js');
    res.json({
      success: true,
      metadata: guideData.STUDENT_GUIDE_METADATA,
      modules: guideData.GUIDE_MODULES_20,
      core_project: guideData.CORE_EXAMPLE_PROJECT,
      ai_framework: guideData.AI_PROMPTING_FRAMEWORK,
      supabase_vs_firebase: guideData.SUPABASE_VS_FIREBASE,
      vercel_errors: guideData.VERCEL_COMMON_ERRORS,
      dns_guide: guideData.DNS_RECORDS_GUIDE,
      schedule: guideData.WEEKLY_PRACTICAL_SCHEDULE,
      daily_workflow: guideData.DAILY_STUDENT_WORKFLOW,
      submission_fields: guideData.SUBMISSION_FORMAT_FIELDS,
      security_rules: guideData.SECURITY_RULES_CHECKLIST,
      assessment_checkpoints: guideData.FINAL_ASSESSMENT_CHECKPOINTS,
      resources: guideData.OFFICIAL_DOCUMENTATION_RESOURCES
    });
  } catch (error) {
    console.error('Error serving student guide:', error);
    res.status(500).json({ error: 'Failed to load student guide data' });
  }
});

// ==========================================
// 2. REGISTRATION & ORDER CREATION
// ==========================================

app.post('/api/registrations/apply', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      college,
      degree,
      department,
      yearOfStudy,
      city,
      githubUrl,
      linkedinUrl,
      skillLevel,
      agreedTerms
    } = req.body;

    // Strict input validation
    if (!fullName || !email || !mobile || !college || !degree || !department || !yearOfStudy || !city || !skillLevel) {
      return res.status(400).json({ error: 'Please fill in all required registration fields.' });
    }

    if (!agreedTerms) {
      return res.status(400).json({ error: 'You must agree to the internship terms and guidelines.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const cleanMobile = String(mobile).replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const passwordHash = password && password.trim().length >= 6 
      ? await bcrypt.hash(password.trim(), 10) 
      : null;

    // Check existing student
    let student = await dbGet(`SELECT * FROM students WHERE email = ?`, [sanitizedEmail]);

    if (student) {
      // Check existing registrations
      const existingReg = await dbGet(
        `SELECT * FROM registrations WHERE student_id = ? AND batch_id = 'batch-1'`,
        [student.id]
      );

      if (existingReg) {
        // If already paid and confirmed:
        if (existingReg.payment_status === 'PAID' || existingReg.registration_status === 'CONFIRMED') {
          const whatsappUrl = await dbGet(`SELECT value FROM settings WHERE key = 'BATCH_1_WHATSAPP_URL'`);
          return res.status(200).json({
            already_confirmed: true,
            message: 'You have already registered and confirmed your enrollment in Skyrovix Batch 1!',
            student_id: student.id,
            registration_id: existingReg.id,
            whatsapp_group_url: whatsappUrl?.value,
            dashboard_url: `/dashboard?studentId=${student.id}`
          });
        }

        // If active pending payment exists, check existing payment order
        const existingPayment = await dbGet(
          `SELECT * FROM payments WHERE registration_id = ? AND status = 'CREATED' ORDER BY created_at DESC LIMIT 1`,
          [existingReg.id]
        );

        const isRealMode = isCashfreeConfigured();
        const isDemoSession = existingPayment?.payment_session_id?.startsWith('session_sandbox_demo_');

        // Cashfree payment sessions expire within 20 minutes.
        // If older than 15 minutes, or if created in another mode, or if client requested force_new, do not reuse.
        const orderAgeMs = existingPayment?.created_at
          ? (Date.now() - new Date(existingPayment.created_at).getTime())
          : Infinity;
        const isExpired = isNaN(orderAgeMs) || orderAgeMs > 15 * 60 * 1000;

        // Only resume if payment session is valid, fresh (<15 mins), not a mock demo in real production mode, and force_new was not requested
        if (existingPayment && existingPayment.payment_session_id && (!isRealMode || !isDemoSession) && !isExpired && !req.body.force_new) {
          return res.status(200).json({
            success: true,
            is_resumed: true,
            registration_id: existingReg.id,
            student_id: student.id,
            order_id: existingPayment.order_id,
            amount: 200.0,
            currency: 'INR',
            payment_session_id: existingPayment.payment_session_id,
            cashfree_mode: isRealMode ? getCashfreeEnvironment() : 'sandbox_simulation',
            customer_name: student.full_name,
            customer_email: student.email,
            customer_phone: student.mobile,
            message: 'Resuming your active registration payment order.'
          });
        }

        // If existing payment is expired, mark it as EXPIRED in DB so it doesn't get picked up again
        if (existingPayment && isExpired) {
          await dbRun(`UPDATE payments SET status = 'EXPIRED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [existingPayment.id]);
        }
      }

      // Update student details
      if (passwordHash) {
        await dbRun(
          `UPDATE students SET full_name = ?, mobile = ?, college = ?, degree = ?, department = ?, year_of_study = ?, city = ?, github_url = ?, linkedin_url = ?, skill_level = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [fullName.trim(), cleanMobile, college.trim(), degree.trim(), department.trim(), yearOfStudy, city.trim(), githubUrl || '', linkedinUrl || '', skillLevel, passwordHash, student.id]
        );
      } else {
        await dbRun(
          `UPDATE students SET full_name = ?, mobile = ?, college = ?, degree = ?, department = ?, year_of_study = ?, city = ?, github_url = ?, linkedin_url = ?, skill_level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [fullName.trim(), cleanMobile, college.trim(), degree.trim(), department.trim(), yearOfStudy, city.trim(), githubUrl || '', linkedinUrl || '', skillLevel, student.id]
        );
      }
    } else {
      // Create new student
      const studentId = `std_${crypto.randomBytes(8).toString('hex')}`;
      await dbRun(
        `INSERT INTO students (id, full_name, email, mobile, college, degree, department, year_of_study, city, github_url, linkedin_url, skill_level, password_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [studentId, fullName.trim(), sanitizedEmail, cleanMobile, college.trim(), degree.trim(), department.trim(), yearOfStudy, city.trim(), githubUrl || '', linkedinUrl || '', skillLevel, passwordHash]
      );
      student = await dbGet(`SELECT * FROM students WHERE id = ?`, [studentId]);
    }

    // Check or create registration
    let registration = await dbGet(
      `SELECT * FROM registrations WHERE student_id = ? AND batch_id = 'batch-1'`,
      [student.id]
    );

    if (!registration) {
      const regId = `REG-B1-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      await dbRun(
        `INSERT INTO registrations (id, student_id, batch_id, registration_status, payment_status)
         VALUES (?, ?, 'batch-1', 'APPLICATION_STARTED', 'CREATED')`,
        [regId, student.id]
      );
      registration = await dbGet(`SELECT * FROM registrations WHERE id = ?`, [regId]);
    }

    // Generate unique Cashfree Order ID
    const orderId = generateOrderId();
    const isProd = getCashfreeEnvironment() === 'production';
    const prodAppUrl = 'https://fullstack-internship.skyrovix.in';
    const returnUrl = isProd
      ? `${prodAppUrl}/payment/status?order_id=${orderId}`
      : `${process.env.APP_URL || 'http://localhost:5173'}/payment/status?order_id=${orderId}`;
    const notifyUrl = isProd
      ? `${prodAppUrl}/api/payments/cashfree/webhook`
      : `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/cashfree/webhook`;

    // Create Cashfree PG Order (Backend only)
    const cfResult = await createCashfreeOrder({
      orderId,
      amount: 200.0,
      student,
      returnUrl,
      notifyUrl
    });

    // Record Payment in database
    const paymentId = `pay_${crypto.randomBytes(8).toString('hex')}`;
    await dbRun(
      `INSERT INTO payments (id, registration_id, order_id, payment_session_id, amount, currency, status, raw_response)
       VALUES (?, ?, ?, ?, 200.00, 'INR', 'CREATED', ?)`,
      [paymentId, registration.id, orderId, cfResult.payment_session_id, JSON.stringify(cfResult)]
    );

    // Update registration with order id
    await dbRun(
      `UPDATE registrations SET payment_order_id = ?, registration_status = 'PAYMENT_PENDING', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [orderId, registration.id]
    );

    // Return only required checkout fields to client (NEVER secret keys!)
    res.status(201).json({
      success: true,
      registration_id: registration.id,
      student_id: student.id,
      order_id: orderId,
      amount: 200.0,
      currency: 'INR',
      payment_session_id: cfResult.payment_session_id,
      cashfree_mode: cfResult.mode,
      customer_name: student.full_name,
      customer_email: student.email,
      customer_phone: student.mobile,
    });

  } catch (error) {
    console.error('❌ Error processing registration application:', error);
    res.status(500).json({
      error: error.message || 'Failed to initialize registration payment. Please try again.'
    });
  }
});

// ==========================================
// 3. PAYMENT VERIFICATION (SERVER-SIDE)
// ==========================================

app.post('/api/payments/verify', async (req, res) => {
  try {
    const { order_id, simulated_action } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: 'Order ID is required for payment verification.' });
    }

    // Look up internal payment record
    const payment = await dbGet(`SELECT * FROM payments WHERE order_id = ?`, [order_id]);
    if (!payment) {
      return res.status(404).json({ error: 'Payment order record not found in system.' });
    }

    const registration = await dbGet(`SELECT * FROM registrations WHERE id = ?`, [payment.registration_id]);
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [registration.student_id]);
    const whatsappSetting = await dbGet(`SELECT value FROM settings WHERE key = 'BATCH_1_WHATSAPP_URL'`);

    // If already verified and marked as PAID
    if (payment.status === 'PAID' && registration.registration_status === 'CONFIRMED') {
      return res.json({
        verified: true,
        payment_status: 'SUCCESS',
        registration_status: 'CONFIRMED',
        order_id: order_id,
        amount: 200.0,
        currency: 'INR',
        student: {
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          mobile: student.mobile,
          college: student.college
        },
        registration_id: registration.id,
        whatsapp_group_url: whatsappSetting?.value || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP',
        message: 'Registration payment successfully verified.'
      });
    }

    // Query Cashfree Server API
    let verification = await verifyCashfreePayment(order_id);

    // If simulated_action is provided in sandbox/simulation mode
    if (!isCashfreeConfigured() && simulated_action) {
      if (simulated_action === 'SUCCESS') {
        verification = {
          verified: true,
          isSimulation: true,
          order_id,
          order_status: 'PAID',
          payment_status: 'SUCCESS',
          is_paid: true,
          cashfree_payment_id: `sim_cf_pay_${crypto.randomBytes(6).toString('hex')}`,
          payment_method: 'UPI / NetBanking (Sandbox Sim)',
          amount: 200.0,
          currency: 'INR',
          message: 'Simulated payment completed successfully.'
        };
      } else if (simulated_action === 'FAILED') {
        verification = {
          verified: true,
          isSimulation: true,
          order_id,
          order_status: 'FAILED',
          payment_status: 'FAILED',
          is_paid: false,
          message: 'Simulated payment failure (Insufficient funds or bank timeout)'
        };
      } else if (simulated_action === 'PENDING') {
        verification = {
          verified: true,
          isSimulation: true,
          order_id,
          order_status: 'ACTIVE',
          payment_status: 'PENDING',
          is_paid: false,
          message: 'Simulated payment pending bank confirmation'
        };
      }
    }

    if (verification.is_paid || verification.payment_status === 'SUCCESS' || verification.order_status === 'PAID') {
      // Mark as PAID
      await dbRun(
        `UPDATE payments SET status = 'PAID', cashfree_payment_id = ?, payment_method = ?, raw_response = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [
          verification.cashfree_payment_id || `cf_pay_${Date.now()}`,
          verification.payment_method || 'Online PG',
          JSON.stringify(verification),
          payment.id
        ]
      );

      // Confirm Registration
      await dbRun(
        `UPDATE registrations SET payment_status = 'PAID', registration_status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [registration.id]
      );

      // Initialize 3-Stage Internship Workflow (Stage 1: PENDING, Stage 2: LOCKED, Stage 3: LOCKED)
      await getOrCreateInternWorkflow(student.id);

      // Ensure student has their active offer letter generated
      const existingOL = await dbGet(`SELECT id FROM offer_letters WHERE student_id = ?`, [student.id]);
      if (!existingOL) {
        const code = `SKX-OL-2026-${student.id ? student.id.slice(-4).toUpperCase() : '9055'}`;
        const olId = `OL-SKX-2026-${student.id ? student.id.slice(-4).toUpperCase() : '9055'}`;
        await dbRun(`
          INSERT INTO offer_letters (id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms)
          VALUES (?, ?, ?, '3-Month Full Stack Development Internship', ?, 'Batch 1', '1 Month', '21 Sept 2026', 'ACTIVE', ?, 'Virtual internship engagement with mandatory milestone deliverables.')
        `, [olId, student.id, student.full_name, 'Full Stack Development', code]);
      }

      // Audit event
      await dbRun(
        `INSERT INTO payment_events (id, order_id, event_type, payload, signature_verified)
         VALUES (?, ?, 'PAYMENT_VERIFIED_SUCCESS', ?, 1)`,
        [`evt_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`, order_id, JSON.stringify(verification)]
      );

      return res.json({
        verified: true,
        payment_status: 'SUCCESS',
        registration_status: 'CONFIRMED',
        order_id: order_id,
        cashfree_payment_id: verification.cashfree_payment_id,
        amount: 200.0,
        currency: 'INR',
        student: {
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          mobile: student.mobile,
          college: student.college
        },
        registration_id: registration.id,
        whatsapp_group_url: whatsappSetting?.value || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP',
        message: 'Payment verified successfully! Welcome to Skyrovix Batch 1.'
      });
    } else if (verification.payment_status === 'FAILED') {
      await dbRun(
        `UPDATE payments SET status = 'FAILED', raw_response = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [JSON.stringify(verification), payment.id]
      );
      await dbRun(
        `UPDATE registrations SET payment_status = 'FAILED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [registration.id]
      );

      return res.json({
        verified: true,
        payment_status: 'FAILED',
        registration_status: 'PAYMENT_PENDING',
        order_id: order_id,
        message: 'Payment was unsuccessful or cancelled by the user.'
      });
    } else {
      // Pending
      return res.json({
        verified: true,
        payment_status: 'PENDING',
        registration_status: registration.registration_status,
        order_id: order_id,
        message: 'Payment is currently being processed by the bank. Please refresh in a moment.'
      });
    }

  } catch (error) {
    console.error('❌ Error during payment verification:', error);
    res.status(500).json({ error: 'Server error verifying payment status' });
  }
});

// ==========================================
// 4. CASHFREE SECURE WEBHOOK
// ==========================================

app.post('/api/payments/cashfree/webhook', async (req, res) => {
  const timestamp = req.headers['x-webhook-timestamp'];
  const signature = req.headers['x-webhook-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  console.log(`🔔 Cashfree Webhook received at ${timestamp}`);

  // Signature verification
  const isValidSignature = verifyCashfreeWebhookSignature({
    rawBody,
    timestamp,
    signature
  });

  const eventId = `whk_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const payload = req.body;
  const orderId = payload?.data?.order?.order_id || payload?.orderId || payload?.data?.order_id;

  if (orderId) {
    await dbRun(
      `INSERT INTO payment_events (id, order_id, event_type, payload, signature_verified)
       VALUES (?, ?, ?, ?, ?)`,
      [eventId, orderId, payload?.type || 'WEBHOOK_EVENT', JSON.stringify(payload), isValidSignature ? 1 : 0]
    );
  }

  if (!isValidSignature && isCashfreeConfigured()) {
    console.error('❌ Invalid Cashfree Webhook Signature! Rejecting event.');
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  try {
    const paymentStatus = payload?.data?.payment?.payment_status || payload?.data?.order?.order_status;
    const cfPaymentId = payload?.data?.payment?.cf_payment_id;

    if (orderId && (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID')) {
      const payment = await dbGet(`SELECT * FROM payments WHERE order_id = ?`, [orderId]);
      if (payment) {
        await dbRun(
          `UPDATE payments SET status = 'PAID', cashfree_payment_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [cfPaymentId || 'webhook_confirmed', payment.id]
        );
        await dbRun(
          `UPDATE registrations SET payment_status = 'PAID', registration_status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [payment.registration_id]
        );
        console.log(`✅ Webhook confirmed payment & registration for Order: ${orderId}`);
      }
    }

    res.status(200).json({ status: 'OK', message: 'Webhook processed successfully' });
  } catch (err) {
    console.error('❌ Error handling webhook event:', err);
    res.status(500).json({ error: 'Internal error processing webhook' });
  }
});

// ==========================================
// 5. STUDENT PORTAL & PROGRESS
// ==========================================

app.get('/api/students/:id/dashboard', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [studentId]);

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const registration = await dbGet(`SELECT * FROM registrations WHERE student_id = ?`, [studentId]);
    const whatsappSetting = await dbGet(`SELECT value FROM settings WHERE key = 'BATCH_1_WHATSAPP_URL'`);
    const announcements = await dbAll(`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10`);
    const submissions = await dbAll(`SELECT * FROM submissions WHERE student_id = ? ORDER BY submitted_at DESC`, [studentId]);
    const certificate = await dbGet(`SELECT * FROM certificates WHERE student_id = ?`, [studentId]);

    res.json({
      success: true,
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        mobile: student.mobile,
        college: student.college,
        degree: student.degree,
        department: student.department,
        year_of_study: student.year_of_study,
        skill_level: student.skill_level,
        github_url: student.github_url,
        linkedin_url: student.linkedin_url
      },
      registration: registration || {
        registration_status: 'NOT_FOUND',
        payment_status: 'UNPAID',
        progress_pct: 0,
        current_week: 1
      },
      batch: {
        name: 'Batch 1',
        title: '3-Month Full Stack Development Internship',
        total_projects: '50+ Real-World Projects',
        mode: '100% Virtual',
        duration: '3 Months'
      },
      whatsapp_group_url: whatsappSetting?.value || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP',
      announcements,
      submissions,
      certificate
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ error: 'Server error retrieving dashboard' });
  }
});

app.post('/api/submissions', async (req, res) => {
  try {
    const { studentId, projectId, projectTitle, githubRepoUrl, liveDeploymentUrl, notes } = req.body;

    if (!studentId || !projectId || !projectTitle || !githubRepoUrl) {
      return res.status(400).json({ error: 'Please provide student ID, project title, and GitHub repository URL.' });
    }

    // Verify confirmed registration
    const registration = await dbGet(
      `SELECT * FROM registrations WHERE student_id = ? AND payment_status = 'PAID'`,
      [studentId]
    );

    if (!registration) {
      return res.status(403).json({ error: 'Only confirmed Batch 1 interns can submit projects.' });
    }

    // Verify 3-Stage workflow Stage 3 project access
    const workflow = await getOrCreateInternWorkflow(studentId);
    if (workflow.is_manually_locked === 1) {
      return res.status(403).json({ error: `Access to project submissions is locked: ${workflow.manual_lock_reason || 'Contact administrator.'}` });
    }
    if (workflow.stage3_status !== 'UNLOCKED' && workflow.stage3_status !== 'COMPLETED') {
      return res.status(403).json({ error: 'Complete all required Training & Learning modules to unlock your Internship Project.' });
    }

    const subId = `sub_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    await dbRun(
      `INSERT INTO submissions (id, student_id, project_id, project_title, github_repo_url, live_deployment_url, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')`,
      [subId, studentId, projectId, projectTitle, githubRepoUrl, liveDeploymentUrl || '', notes || '']
    );

    // Update progress percentage
    const allSubs = await dbAll(`SELECT COUNT(*) as count FROM submissions WHERE student_id = ?`, [studentId]);
    const count = allSubs[0]?.count || 1;
    const newProgress = Math.min(100, Math.round((count / 15) * 100)); // milestone calculation

    await dbRun(
      `UPDATE registrations SET progress_pct = ?, updated_at = CURRENT_TIMESTAMP WHERE student_id = ?`,
      [newProgress, studentId]
    );

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully for code review & mentor evaluation!',
      submission_id: subId,
      progress_pct: newProgress
    });
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({ error: 'Failed to record submission' });
  }
});

// ==========================================
// 6. CERTIFICATE VERIFICATION
// ==========================================

app.get('/api/certificates/:id', async (req, res) => {
  try {
    const certId = req.params.id;
    const cert = await dbGet(`SELECT * FROM certificates WHERE id = ?`, [certId]);

    if (!cert) {
      return res.status(404).json({
        verified: false,
        message: 'Certificate ID not found or invalid.'
      });
    }

    const student = await dbGet(`SELECT full_name, college FROM students WHERE id = ?`, [cert.student_id]);

    res.json({
      verified: true,
      certificate: {
        id: cert.id,
        student_name: cert.student_name,
        college: student?.college || 'Engineering & Technology',
        program: cert.program,
        batch: cert.batch,
        duration: cert.duration,
        issue_date: cert.issue_date,
        status: cert.status,
        issuer: 'Skyrovix Technologies',
        credential_url: `${process.env.APP_URL || 'http://localhost:5173'}/verify/${cert.id}`
      }
    });
  } catch (err) {
    console.error('Error verifying certificate:', err);
    res.status(500).json({ error: 'Internal server error during verification' });
  }
});

// ==========================================
// 6b. USER DASHBOARD LOGIN (STUDENT AUTH)
// ==========================================

app.post(['/api/auth/login', '/api/students/login'], async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email address and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const student = await dbGet(`SELECT * FROM students WHERE LOWER(email) = ?`, [cleanEmail]);

    if (!student) {
      // Check if this is an Administrator logging in through the user modal
      const admin = await dbGet(`SELECT * FROM admins WHERE LOWER(email) = ? OR LOWER(username) = ?`, [cleanEmail, cleanEmail]);
      if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
          return res.status(401).json({ error: 'Incorrect administrator password.' });
        }
        const token = jwt.sign(
          { id: admin.id, username: admin.username, email: admin.email, role: admin.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          role: 'ADMIN',
          token,
          redirect: '/admin/dashboard',
          message: 'Admin authentication recognized! Redirecting to Admin Dashboard...'
        });
      }

      return res.status(404).json({ error: 'No account found with this email. Please submit your application first.' });
    }

    // Verify password (or allow first-time password setup if registered previously without password)
    let isValid = false;
    if (student.password_hash) {
      isValid = await bcrypt.compare(password, student.password_hash);
    } else {
      // First-time login: update password hash
      const newHash = await bcrypt.hash(password, 10);
      await dbRun(`UPDATE students SET password_hash = ? WHERE id = ?`, [newHash, student.id]);
      isValid = true;
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect password. Please verify your credentials and try again.' });
    }

    const registration = await dbGet(
      `SELECT * FROM registrations WHERE student_id = ? AND batch_id = 'batch-1'`,
      [student.id]
    );

    const isPaid = registration && (registration.payment_status === 'PAID' || registration.registration_status === 'CONFIRMED');

    const token = jwt.sign(
      { id: student.id, email: student.email, name: student.full_name, role: 'STUDENT' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: isPaid ? 'Login successful!' : 'Login successful. ₹200 registration fee payment required.',
      token,
      student_id: student.id,
      is_paid: Boolean(isPaid),
      payment_required: !isPaid,
      order_id: registration?.payment_order_id || null,
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        college: student.college,
        department: student.department
      },
      registration: registration || null
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// ==========================================
// 7. ADMIN AUTHENTICATION & MANAGEMENT
// ==========================================

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanInput = (email || '').trim().toLowerCase();
    const admin = await dbGet(`SELECT * FROM admins WHERE LOWER(email) = ? OR LOWER(username) = ?`, [cleanInput, cleanInput]);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalApplicants = await dbGet(`SELECT COUNT(*) as count FROM students`);
    const totalRegistrations = await dbGet(`SELECT COUNT(*) as count FROM registrations`);
    const paidRegistrations = await dbGet(`SELECT COUNT(*) as count FROM registrations WHERE payment_status = 'PAID'`);
    const pendingPayments = await dbGet(`SELECT COUNT(*) as count FROM registrations WHERE payment_status = 'CREATED' OR payment_status = 'PENDING'`);
    const failedPayments = await dbGet(`SELECT COUNT(*) as count FROM payments WHERE status = 'FAILED'`);
    const totalCollection = await dbGet(`SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'PAID'`);
    
    // Today's collection
    const todayCollection = await dbGet(
      `SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'PAID' AND DATE(created_at) = DATE('now')`
    );

    res.json({
      success: true,
      stats: {
        total_applicants: totalApplicants?.count || 0,
        total_registrations: totalRegistrations?.count || 0,
        paid_registrations: paidRegistrations?.count || 0,
        pending_payments: pendingPayments?.count || 0,
        failed_payments: failedPayments?.count || 0,
        total_collection: totalCollection?.total || 0,
        today_collection: todayCollection?.total || 0,
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

app.get('/api/admin/registrations', authenticateAdmin, async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT 
        r.id as registration_id,
        r.batch_id,
        r.registration_status,
        r.payment_status,
        r.whatsapp_joined,
        r.progress_pct,
        r.created_at as registered_at,
        s.id as student_id,
        s.full_name,
        s.email,
        s.mobile,
        s.college,
        s.degree,
        s.department,
        s.year_of_study,
        s.city,
        s.skill_level,
        s.github_url,
        s.linkedin_url,
        p.order_id,
        p.cashfree_payment_id,
        p.amount,
        p.status as pay_record_status,
        p.payment_method,
        p.updated_at as payment_date
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      LEFT JOIN payments p ON r.id = p.registration_id
      ORDER BY r.created_at DESC
    `);

    res.json({ success: true, registrations: rows });
  } catch (error) {
    console.error('Admin registrations error:', error);
    res.status(500).json({ error: 'Failed to retrieve registrations' });
  }
});

app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM settings`);
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

app.post('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Setting key and value are required.' });
    }

    await dbRun(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
      [key, String(value)]
    );

    res.json({ success: true, message: `Setting ${key} updated successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Admin manual verify order
app.post('/api/admin/verify-order/:orderId', authenticateAdmin, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const verification = await verifyCashfreePayment(orderId);

    if (verification.is_paid || verification.payment_status === 'SUCCESS') {
      const payment = await dbGet(`SELECT * FROM payments WHERE order_id = ?`, [orderId]);
      if (payment) {
        await dbRun(
          `UPDATE payments SET status = 'PAID', cashfree_payment_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [verification.cashfree_payment_id || `cf_admin_verified_${Date.now()}`, payment.id]
        );
        await dbRun(
          `UPDATE registrations SET payment_status = 'PAID', registration_status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [payment.registration_id]
        );
      }
    }

    res.json({ success: true, verification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin issue certificate
app.post('/api/admin/students/:id/certificate', authenticateAdmin, async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [studentId]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const existingCert = await dbGet(`SELECT * FROM certificates WHERE student_id = ?`, [studentId]);
    if (existingCert) {
      return res.json({ success: true, certificate: existingCert, message: 'Certificate already issued.' });
    }

    const certId = `SKY-B1-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const verifyUrl = `${process.env.APP_URL || 'http://localhost:5173'}/verify/${certId}`;

    await dbRun(
      `INSERT INTO certificates (id, student_id, student_name, program, batch, duration, issue_date, status, verification_url)
       VALUES (?, ?, ?, '3-Month Full Stack Development Internship', 'Batch 1', '3 Months', ?, 'ISSUED', ?)`,
      [certId, studentId, student.full_name, today, verifyUrl]
    );

    const newCert = await dbGet(`SELECT * FROM certificates WHERE id = ?`, [certId]);
    res.status(201).json({ success: true, certificate: newCert });
  } catch (err) {
    res.status(500).json({ error: 'Failed to issue certificate' });
  }
});

// Export CSV
app.get('/api/admin/export-csv', authenticateAdmin, async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT 
        r.id as registration_id,
        s.full_name,
        s.email,
        s.mobile,
        s.college,
        s.degree,
        s.department,
        s.year_of_study,
        s.city,
        s.skill_level,
        r.payment_status,
        r.registration_status,
        p.order_id,
        p.cashfree_payment_id,
        p.amount,
        r.created_at
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      LEFT JOIN payments p ON r.id = p.registration_id
      ORDER BY r.created_at DESC
    `);

    const header = [
      'Registration ID',
      'Student Name',
      'Email',
      'Mobile',
      'College',
      'Degree',
      'Department',
      'Year',
      'City',
      'Skill Level',
      'Payment Status',
      'Registration Status',
      'Order ID',
      'Cashfree Payment ID',
      'Amount (INR)',
      'Registered Date'
    ].join(',');

    const csvLines = rows.map(r => [
      `"${r.registration_id || ''}"`,
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      `"${r.email || ''}"`,
      `"${r.mobile || ''}"`,
      `"${(r.college || '').replace(/"/g, '""')}"`,
      `"${r.degree || ''}"`,
      `"${r.department || ''}"`,
      `"${r.year_of_study || ''}"`,
      `"${r.city || ''}"`,
      `"${r.skill_level || ''}"`,
      `"${r.payment_status || ''}"`,
      `"${r.registration_status || ''}"`,
      `"${r.order_id || ''}"`,
      `"${r.cashfree_payment_id || ''}"`,
      `"${r.amount || 200}"`,
      `"${r.created_at || ''}"`
    ].join(','));

    const csvContent = [header, ...csvLines].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="skyrovix_batch1_registrations.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});


// Student extraction helper (Bearer JWT or studentId param)
const getStudentFromRequest = async (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.id) {
        const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [decoded.id]);
        if (student) return student;
      }
    } catch (e) {}
  }
  const sId = req.query.studentId || req.query.student_id || req.body?.studentId || req.body?.student_id;
  if (sId) {
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [sId]);
    if (student) return student;
  }
  return null;
};

// Middleware: Strict payment gate for student dashboard access
const requirePaidStudent = async (req, res, next) => {
  const student = await getStudentFromRequest(req);
  if (!student) {
    return res.status(401).json({ error: 'Authentication required. Please log in to view dashboard.' });
  }

  const registration = await dbGet(
    `SELECT * FROM registrations WHERE student_id = ? AND batch_id = 'batch-1'`,
    [student.id]
  );

  const isPaid = registration && (registration.payment_status === 'PAID' || registration.registration_status === 'CONFIRMED');
  if (!isPaid) {
    const pendingPayment = await dbGet(
      `SELECT * FROM payments WHERE registration_id = ? ORDER BY created_at DESC LIMIT 1`,
      [registration?.id || '']
    );

    return res.status(402).json({
      success: false,
      payment_required: true,
      is_paid: false,
      error: 'Registration fee payment required. Complete your ₹200 fee payment to access your Student Dashboard.',
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        mobile: student.mobile,
        college: student.college,
        degree: student.degree,
        department: student.department
      },
      registration: registration || null,
      order_id: pendingPayment?.order_id || registration?.payment_order_id || null,
      payment_session_id: pendingPayment?.payment_session_id || null
    });
  }

  req.student = student;
  req.registration = registration;
  next();
};

// ==========================================
// 8. PUBLIC OFFER LETTER VERIFICATION
// ==========================================
app.get(['/api/verify/offer-letter/:code', '/api/offer-letters/verify/:code'], async (req, res) => {
  try {
    const code = req.params.code;
    const ol = await dbGet(`SELECT * FROM offer_letters WHERE verification_code = ? OR id = ?`, [code, code]);
    if (!ol) {
      return res.status(404).json({ verified: false, message: 'Offer letter verification code not found or invalid.' });
    }
    const student = await dbGet(`SELECT full_name, college, department FROM students WHERE id = ?`, [ol.student_id]);
    res.json({
      verified: true,
      offer_letter: {
        id: ol.id,
        student_name: ol.student_name || student?.full_name,
        college: student?.college || 'Engineering & Technology',
        department: student?.department || ol.domain,
        domain: ol.domain,
        program: ol.program,
        batch: ol.batch,
        duration: ol.duration,
        issue_date: ol.issue_date,
        status: ol.status,
        verification_code: ol.verification_code,
        issuer: 'Skyrovix Technologies'
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error verifying offer letter' });
  }
});

// ==========================================
// 9. USER DASHBOARD APIS (ROLE: USER)
// ==========================================

// Helper: validate that URL is a LinkedIn post and NOT a profile
export function validateLinkedInPostUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'LinkedIn post URL is required.' };
  }
  const trimmed = url.trim();

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (e) {
    return { valid: false, error: 'Please enter a valid URL starting with https://' };
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const isLinkedIn = host === 'linkedin.com' || host === 'lnkd.in' || host.endsWith('.linkedin.com');
  if (!isLinkedIn) {
    return { valid: false, error: 'The URL must be a valid link from linkedin.com or lnkd.in' };
  }

  const pathname = parsed.pathname.toLowerCase();

  // Explicitly reject profile URLs
  if (
    pathname.startsWith('/in/') ||
    pathname.startsWith('/pub/') ||
    pathname.startsWith('/profile/') ||
    pathname === '/in' ||
    pathname === '/in/' ||
    pathname === '/pub' ||
    pathname === '/pub/'
  ) {
    return {
      valid: false,
      error: 'LinkedIn profile URLs (e.g. linkedin.com/in/...) are not accepted. Please provide a direct link to your published LinkedIn post celebrating your Skyrovix offer letter.'
    };
  }

  // Support LinkedIn short links (lnkd.in/p/... or lnkd.in/<slug>)
  if (host === 'lnkd.in') {
    if (pathname.length <= 1 || pathname === '/') {
      return { valid: false, error: 'Please enter a valid LinkedIn post link.' };
    }
    return { valid: true, url: trimmed };
  }

  // Must match a post, activity, share, or pulse pattern on linkedin.com
  const isPost =
    pathname.startsWith('/posts/') ||
    pathname.includes('/feed/update/urn:li:activity:') ||
    pathname.includes('/feed/update/urn:li:share:') ||
    pathname.includes('/feed/update/urn:li:ugcpost:') ||
    pathname.startsWith('/feed/update/') ||
    pathname.includes('activity') ||
    pathname.includes('share') ||
    pathname.startsWith('/pulse/');

  if (!isPost) {
    return {
      valid: false,
      error: 'Please submit a direct LinkedIn post link (e.g., https://www.linkedin.com/posts/... or https://lnkd.in/...)'
    };
  }

  return { valid: true, url: trimmed };
}

// 9a. WORKFLOW APIS
// Get user workflow status
app.get('/api/user/workflow', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    const workflow = await getOrCreateInternWorkflow(student.id);

    // Get offer letter
    let offerLetter = await dbGet(`SELECT * FROM offer_letters WHERE student_id = ?`, [student.id]);
    if (!offerLetter) {
      const code = `SKX-OL-2026-${student.id ? student.id.slice(-4).toUpperCase() : '9055'}`;
      const olId = `OL-SKX-2026-${student.id ? student.id.slice(-4).toUpperCase() : '9055'}`;
      await dbRun(`
        INSERT INTO offer_letters (id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms)
        VALUES (?, ?, ?, '3-Month Full Stack Development Internship', ?, 'Batch 1', '1 Month', '21 Sept 2026', 'ACTIVE', ?, 'Virtual internship engagement with mandatory milestone deliverables.')
      `, [olId, student.id, student.full_name, 'Full Stack Development', code]);
      offerLetter = await dbGet(`SELECT * FROM offer_letters WHERE student_id = ?`, [student.id]);
    }

    // Get latest LinkedIn submission
    const linkedinSub = await dbGet(
      `SELECT * FROM linkedin_submissions WHERE student_id = ? ORDER BY submitted_at DESC LIMIT 1`,
      [student.id]
    );

    // Get training modules & student submissions
    const allModules = await dbAll(`SELECT * FROM training_modules WHERE is_active = 1 ORDER BY order_num ASC`);
    const studentTrainingSubs = await dbAll(
      `SELECT * FROM training_submissions WHERE student_id = ?`,
      [student.id]
    );

    const approvedCount = studentTrainingSubs.filter(s => s.status === 'APPROVED').length;
    const submittedCount = studentTrainingSubs.filter(s => s.status === 'SUBMITTED').length;
    const totalModules = allModules.length || 5;

    // Check if auto-unlock condition is met (all 5 modules approved)
    if (approvedCount >= 5 && workflow.stage2_status !== 'COMPLETED') {
      await dbRun(`
        UPDATE intern_workflows SET 
          stage2_status = 'COMPLETED',
          current_stage = 3,
          stage3_status = 'UNLOCKED',
          updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?
      `, [student.id]);
      workflow.stage2_status = 'COMPLETED';
      workflow.current_stage = 3;
      workflow.stage3_status = 'UNLOCKED';
    }

    const modulesProgress = allModules.map(m => {
      const sub = studentTrainingSubs.find(s => s.module_id === m.id);
      return {
        id: m.id,
        module_num: m.module_num,
        title: m.title,
        short_title: m.short_title,
        status: sub ? sub.status : 'NOT_STARTED',
        submission_id: sub?.id || null,
        admin_feedback: sub?.admin_feedback || null,
        submitted_at: sub?.submitted_at || null,
        reviewed_at: sub?.reviewed_at || null
      };
    });

    res.json({
      success: true,
      workflow: {
        id: workflow.id,
        student_id: student.id,
        student_name: student.full_name,
        current_stage: workflow.current_stage,
        stage1_status: workflow.stage1_status,
        stage2_status: workflow.stage2_status,
        stage3_status: workflow.stage3_status,
        is_manually_locked: workflow.is_manually_locked === 1,
        manual_lock_reason: workflow.manual_lock_reason,
        linkedin_submission: linkedinSub ? {
          id: linkedinSub.id,
          post_url: linkedinSub.post_url,
          status: linkedinSub.status,
          admin_feedback: linkedinSub.admin_feedback,
          reviewed_by: linkedinSub.reviewed_by,
          reviewed_at: linkedinSub.reviewed_at,
          submitted_at: linkedinSub.submitted_at
        } : null,
        offer_letter: offerLetter ? {
          id: offerLetter.id,
          verification_code: offerLetter.verification_code,
          program: offerLetter.program,
          domain: offerLetter.domain,
          duration: offerLetter.duration,
          issue_date: offerLetter.issue_date,
          status: offerLetter.status
        } : null,
        training_progress: {
          approved_count: approvedCount,
          submitted_count: submittedCount,
          total_count: totalModules,
          progress_pct: Math.round((approvedCount / totalModules) * 100),
          is_all_approved: approvedCount >= 5,
          modules: modulesProgress
        }
      }
    });
  } catch (e) {
    console.error('Error fetching workflow:', e);
    res.status(500).json({ error: 'Failed to retrieve workflow status' });
  }
});

// Submit / Resubmit LinkedIn Post URL
app.post('/api/user/workflow/linkedin', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    const workflow = await getOrCreateInternWorkflow(student.id);
    if (workflow.is_manually_locked === 1) {
      return res.status(403).json({ error: `Workflow access is locked: ${workflow.manual_lock_reason || 'Contact administrator.'}` });
    }

    const { postUrl } = req.body;
    const validation = validateLinkedInPostUrl(postUrl);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Get offer letter
    const ol = await dbGet(`SELECT id FROM offer_letters WHERE student_id = ?`, [student.id]);
    const olId = ol ? ol.id : null;

    const existingSub = await dbGet(
      `SELECT id FROM linkedin_submissions WHERE student_id = ? ORDER BY submitted_at DESC LIMIT 1`,
      [student.id]
    );

    const subId = existingSub ? existingSub.id : `ls_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    if (existingSub) {
      await dbRun(`
        UPDATE linkedin_submissions SET 
          offer_letter_id = ?,
          post_url = ?,
          status = 'PENDING_VERIFICATION',
          admin_feedback = NULL,
          submitted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [olId, validation.url, subId]);
    } else {
      await dbRun(`
        INSERT INTO linkedin_submissions (id, student_id, offer_letter_id, post_url, status)
        VALUES (?, ?, ?, ?, 'PENDING_VERIFICATION')
      `, [subId, student.id, olId, validation.url]);
    }

    // Update workflow stage1_status to SUBMITTED (do NOT auto-approve)
    await dbRun(`
      UPDATE intern_workflows SET 
        stage1_status = 'SUBMITTED',
        updated_at = CURRENT_TIMESTAMP
      WHERE student_id = ?
    `, [student.id]);

    // Send in-app notification
    await dbRun(`
      INSERT INTO user_notifications (id, user_id, title, message, type, is_read, link)
      VALUES (?, ?, ?, ?, 'workflow', 0, '/dashboard/workflow')
    `, [
      `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      student.id,
      'LinkedIn Offer Letter Submitted',
      'Your LinkedIn offer letter post has been submitted and is currently pending mentor verification.'
    ]);

    const updatedWorkflow = await getOrCreateInternWorkflow(student.id);
    res.json({
      success: true,
      message: 'LinkedIn post submitted for mentor verification!',
      submission: {
        id: subId,
        post_url: validation.url,
        status: 'PENDING_VERIFICATION',
        submitted_at: new Date().toISOString()
      },
      workflow: {
        current_stage: updatedWorkflow.current_stage,
        stage1_status: updatedWorkflow.stage1_status,
        stage2_status: updatedWorkflow.stage2_status,
        stage3_status: updatedWorkflow.stage3_status
      }
    });
  } catch (e) {
    console.error('LinkedIn submission error:', e);
    res.status(500).json({ error: 'Failed to submit LinkedIn post' });
  }
});

// Get user training modules
app.get('/api/user/workflow/training-modules', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    const workflow = await getOrCreateInternWorkflow(student.id);

    // Gating check: Stage 1 must be APPROVED
    if (workflow.stage1_status !== 'APPROVED') {
      return res.json({
        success: true,
        is_locked: true,
        lock_stage: 2,
        lock_reason: 'Stage 2 Locked: You must publish your Skyrovix offer letter on LinkedIn and receive administrator approval before accessing Training & Learning.',
        current_stage: workflow.current_stage,
        stage1_status: workflow.stage1_status,
        modules: []
      });
    }

    if (workflow.is_manually_locked === 1) {
      return res.json({
        success: true,
        is_locked: true,
        lock_stage: 2,
        lock_reason: `Training access locked by administrator: ${workflow.manual_lock_reason || 'Please contact support.'}`,
        is_manually_locked: true,
        modules: []
      });
    }

    const modules = await dbAll(`SELECT * FROM training_modules WHERE is_active = 1 ORDER BY order_num ASC`);
    const submissions = await dbAll(`SELECT * FROM training_submissions WHERE student_id = ?`, [student.id]);

    const formattedModules = modules.map(m => {
      const sub = submissions.find(s => s.module_id === m.id);
      let objectives = [];
      let exercises = [];
      let resources = [];
      let submissionFields = [];
      try { objectives = JSON.parse(m.objectives); } catch(e) {}
      try { exercises = JSON.parse(m.exercises); } catch(e) {}
      try { resources = JSON.parse(m.resources); } catch(e) {}
      try { submissionFields = JSON.parse(m.submission_fields); } catch(e) {}

      return {
        id: m.id,
        module_num: m.module_num,
        title: m.title,
        short_title: m.short_title,
        description: m.description,
        objectives,
        instructions: m.instructions,
        exercises,
        resources,
        submission_fields: submissionFields,
        status: sub ? sub.status : 'NOT_STARTED',
        submission: sub ? {
          id: sub.id,
          status: sub.status,
          github_url: sub.github_url,
          live_demo_url: sub.live_demo_url,
          submission_url: sub.submission_url,
          notes: sub.notes,
          admin_feedback: sub.admin_feedback,
          reviewed_by: sub.reviewed_by,
          reviewed_at: sub.reviewed_at,
          submitted_at: sub.submitted_at
        } : null
      };
    });

    const approvedCount = formattedModules.filter(m => m.status === 'APPROVED').length;

    res.json({
      success: true,
      is_locked: false,
      completed_count: approvedCount,
      total_count: formattedModules.length,
      progress_pct: Math.round((approvedCount / formattedModules.length) * 100),
      is_all_approved: approvedCount >= formattedModules.length,
      modules: formattedModules
    });
  } catch (e) {
    console.error('Error fetching training modules:', e);
    res.status(500).json({ error: 'Failed to retrieve training modules' });
  }
});

// Submit Training Module Assignment
app.post('/api/user/workflow/training-modules/:moduleId/submit', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    const workflow = await getOrCreateInternWorkflow(student.id);

    // Gating check: Stage 1 must be APPROVED
    if (workflow.stage1_status !== 'APPROVED') {
      return res.status(403).json({ error: 'Stage 2 is locked. Your LinkedIn Offer Letter post must be approved before you can submit training assignments.' });
    }

    if (workflow.is_manually_locked === 1) {
      return res.status(403).json({ error: `Submissions locked by administrator: ${workflow.manual_lock_reason || 'Contact administrator.'}` });
    }

    const { moduleId } = req.params;
    const moduleItem = await dbGet(`SELECT * FROM training_modules WHERE id = ?`, [moduleId]);
    if (!moduleItem) return res.status(404).json({ error: 'Training module not found' });

    const { github_url, live_demo_url, submission_url, notes } = req.body;
    if (!github_url?.trim() && !submission_url?.trim() && !live_demo_url?.trim()) {
      return res.status(400).json({ error: 'Please provide at least a GitHub repository URL or project submission link.' });
    }

    const existing = await dbGet(
      `SELECT id FROM training_submissions WHERE student_id = ? AND module_id = ?`,
      [student.id, moduleId]
    );

    const subId = existing ? existing.id : `tsub_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    if (existing) {
      await dbRun(`
        UPDATE training_submissions SET 
          github_url = ?,
          live_demo_url = ?,
          submission_url = ?,
          notes = ?,
          status = 'SUBMITTED',
          admin_feedback = NULL,
          submitted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [github_url?.trim() || null, live_demo_url?.trim() || null, submission_url?.trim() || null, notes?.trim() || null, subId]);
    } else {
      await dbRun(`
        INSERT INTO training_submissions (id, student_id, module_id, github_url, live_demo_url, submission_url, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
      `, [subId, student.id, moduleId, github_url?.trim() || null, live_demo_url?.trim() || null, submission_url?.trim() || null, notes?.trim() || null]);
    }

    await dbRun(`
      UPDATE intern_workflows SET 
        stage2_status = 'IN_PROGRESS',
        updated_at = CURRENT_TIMESTAMP
      WHERE student_id = ?
    `, [student.id]);

    res.json({
      success: true,
      message: `${moduleItem.short_title} assignment submitted successfully for mentor evaluation!`,
      submission_id: subId,
      submission: {
        id: subId,
        module_id: moduleId,
        status: 'SUBMITTED'
      }
    });
  } catch (e) {
    console.error('Error submitting training module assignment:', e);
    res.status(500).json({ error: 'Failed to submit module assignment' });
  }
});

// Get user profile
app.get('/api/user/profile', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;
    const registration = req.registration;
    const certCount = await dbGet(`SELECT COUNT(*) as count FROM certificates WHERE student_id = ?`, [student.id]);
    const olCount = await dbGet(`SELECT COUNT(*) as count FROM offer_letters WHERE student_id = ?`, [student.id]);
    const approvedTasks = await dbGet(`SELECT COUNT(*) as count FROM submissions WHERE student_id = ? AND status = 'APPROVED'`, [student.id]);
    const totalTasks = await dbGet(`SELECT COUNT(*) as count FROM student_tasks`);
    const unreadNotifs = await dbGet(`SELECT COUNT(*) as count FROM user_notifications WHERE user_id = ? AND is_read = 0`, [student.id]);
    const workflow = await getOrCreateInternWorkflow(student.id);

    const totalCount = totalTasks?.count || 6;
    const approvedCount = approvedTasks?.count || 0;
    const realProgress = Math.round((approvedCount / totalCount) * 100);

    res.json({
      success: true,
      profile: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        mobile: student.mobile,
        college: student.college,
        degree: student.degree,
        department: student.department,
        year_of_study: student.year_of_study,
        city: student.city,
        skill_level: student.skill_level,
        github_url: student.github_url || '',
        linkedin_url: student.linkedin_url || '',
        bio: student.bio || 'Aspiring software engineer exploring modern full stack web development and scalable architectures.',
        avatar_url: student.avatar_url || '',
        is_active: student.is_active !== 0
      },
      stats: {
        certificates_count: certCount?.count || 0,
        offer_letters_count: olCount?.count || 0,
        tasks_completed: approvedCount,
        unread_notifications: unreadNotifs?.count || 0,
        progress_pct: realProgress
      },
      registration: registration || null,
      workflow: {
        id: workflow.id,
        current_stage: workflow.current_stage,
        stage1_status: workflow.stage1_status,
        stage2_status: workflow.stage2_status,
        stage3_status: workflow.stage3_status,
        is_manually_locked: workflow.is_manually_locked === 1,
        manual_lock_reason: workflow.manual_lock_reason
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// Update user profile
app.put('/api/user/profile', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const {
      full_name,
      mobile,
      college,
      department,
      year_of_study,
      city,
      skill_level,
      bio,
      github_url,
      linkedin_url,
      avatar_url
    } = req.body;

    const newAvatar = avatar_url !== undefined ? (avatar_url ? avatar_url : null) : student.avatar_url;

    await dbRun(`
      UPDATE students SET 
        full_name = COALESCE(?, full_name),
        mobile = COALESCE(?, mobile),
        college = COALESCE(?, college),
        department = COALESCE(?, department),
        year_of_study = COALESCE(?, year_of_study),
        city = COALESCE(?, city),
        skill_level = COALESCE(?, skill_level),
        bio = COALESCE(?, bio),
        github_url = COALESCE(?, github_url),
        linkedin_url = COALESCE(?, linkedin_url),
        avatar_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      full_name?.trim() || null,
      mobile?.trim() || null,
      college?.trim() || null,
      department?.trim() || null,
      year_of_study || null,
      city?.trim() || null,
      skill_level || null,
      bio?.trim() || null,
      github_url?.trim() || null,
      linkedin_url?.trim() || null,
      newAvatar,
      student.id
    ]);

    const updated = await dbGet(`SELECT * FROM students WHERE id = ?`, [student.id]);
    await pushToSupabase('students', {
      id: student.id,
      full_name: updated.full_name,
      email: updated.email,
      mobile: updated.mobile,
      college: updated.college,
      department: updated.department,
      year_of_study: updated.year_of_study,
      city: updated.city,
      skill_level: updated.skill_level,
      bio: updated.bio,
      github_url: updated.github_url,
      linkedin_url: updated.linkedin_url,
      avatar_url: updated.avatar_url,
      updated_at: new Date().toISOString()
    });
    res.json({ success: true, message: 'Profile updated successfully!', student: updated });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change user password
app.post('/api/user/change-password', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    if (student.password_hash && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, student.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password does not match.' });
      }
    }

    const newHash = await bcrypt.hash(newPassword.trim(), 10);
    await dbRun(`UPDATE students SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [newHash, student.id]);

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get user applications
app.get('/api/user/applications', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const applications = await dbAll(`
      SELECT 
        r.id as application_id,
        r.batch_id,
        b.name as batch_name,
        b.title as program_title,
        r.registration_status,
        r.payment_status,
        r.progress_pct,
        r.created_at as application_date,
        p.order_id,
        p.amount,
        p.status as payment_record_status
      FROM registrations r
      LEFT JOIN batches b ON r.batch_id = b.id
      LEFT JOIN payments p ON r.id = p.registration_id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
    `, [student.id]);

    res.json({ success: true, applications });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Get user internship details
app.get('/api/user/internship', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    const registration = await dbGet(`SELECT * FROM registrations WHERE student_id = ?`, [student.id]);
    const batch = await dbGet(`SELECT * FROM batches WHERE id = 'batch-1'`);
    const whatsappSetting = await dbGet(`SELECT value FROM settings WHERE key = 'BATCH_1_WHATSAPP_URL'`);
    const startNotice = await dbGet(`SELECT value FROM settings WHERE key = 'BATCH_START_NOTICE'`);
    const approvedTasks = await dbGet(`SELECT COUNT(*) as count FROM submissions WHERE student_id = ? AND status = 'APPROVED'`, [student.id]);
    const totalT = await dbGet(`SELECT COUNT(*) as count FROM student_tasks`);
    const totalCount = totalT?.count || 6;
    const approvedCount = approvedTasks?.count || 0;
    const realProgress = Math.round((approvedCount / totalCount) * 100);

    const workflow = await getOrCreateInternWorkflow(student.id);

    res.json({
      success: true,
      workflow: {
        id: workflow.id,
        current_stage: workflow.current_stage,
        stage1_status: workflow.stage1_status,
        stage2_status: workflow.stage2_status,
        stage3_status: workflow.stage3_status,
        is_manually_locked: workflow.is_manually_locked === 1,
        manual_lock_reason: workflow.manual_lock_reason
      },
      internship: {
        domain: 'Full Stack Development',
        program: batch?.title || '3-Month Full Stack Development Internship',
        batch_name: batch?.name || 'Batch 1',
        duration: '1 Month',
        start_date: '21 Sept 2026',
        end_date: '26 Oct 2026',
        status: registration?.registration_status === 'CONFIRMED' || registration?.payment_status === 'PAID' ? 'Active' : 'Pending Confirmation',
        mentor: 'Senior Full Stack Architect & Lead Technical Reviewer (Skyrovix)',
        progress_pct: realProgress,
        whatsapp_url: whatsappSetting?.value || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP',
        start_notice: startNotice?.value || 'Batch 1 starts within the next 10 days.',
        overview: 'Comprehensive hands-on virtual internship covering modern full stack web architecture, responsive frontend, secure Node/Express APIs, relational & NoSQL databases, and production deployments.',
        requirements: [
          'Node.js 18+ and Git installed on development workstation',
          'Free-tier deployment provider account (Vercel/Render/Netlify) for live deployments',
          'Consistent sprint progress with documented GitHub repository submissions',
          'Adherence to code standards and automated test coverage'
        ],
        resources: [
          { title: 'Skyrovix Batch 1 Full Stack Starter Kit', url: 'https://github.com/Skyrovix/starter-kit' },
          { title: 'Architecture & REST API Design Guide', url: 'https://skyrovix.com/docs/api-guide' },
          { title: 'Full Stack Deployment Checklist', url: 'https://skyrovix.com/docs/serverless' }
        ]
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve internship details' });
  }
});

// Get user tasks with submission status
app.get('/api/user/tasks', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    const allTasks = await dbAll(`SELECT * FROM student_tasks ORDER BY order_num ASC`);
    const submissions = await dbAll(`SELECT * FROM submissions WHERE student_id = ?`, [student.id]);

    const tasks = allTasks.map(t => {
      const sub = submissions.find(s => s.project_id === t.id);
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(t.key_features);
      } catch (e) {
        parsedFeatures = [t.key_features];
      }

      const taskStatus = sub 
        ? (sub.status === 'APPROVED' ? 'Completed' : sub.status === 'SUBMITTED' ? 'Submitted' : 'Revision Required') 
        : 'Pending';

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        domain: t.domain,
        difficulty: t.difficulty,
        dueDate: t.due_date,
        keyFeatures: parsedFeatures,
        expectedOutcome: t.expected_outcome,
        status: taskStatus,
        submission: sub ? {
          id: sub.id,
          status: sub.status,
          github_repo_url: sub.github_repo_url,
          live_deployment_url: sub.live_deployment_url,
          notes: sub.notes,
          grade: sub.grade,
          feedback: sub.feedback,
          submitted_at: sub.submitted_at
        } : null
      };
    });

    res.json({
      success: true,
      is_stage_locked: false,
      tasks
    });
  } catch (e) {
    console.error('Error fetching tasks:', e);
    res.status(500).json({ error: 'Failed to retrieve tasks', details: e.message });
  }
});

// Submit user task
app.post('/api/user/tasks/submit', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    const { taskId, projectTitle, githubRepoUrl, liveDeploymentUrl, notes } = req.body;
    if (!taskId || !githubRepoUrl) {
      return res.status(400).json({ error: 'Task ID and GitHub URL are required.' });
    }

    const existingSub = await dbGet(`SELECT id FROM submissions WHERE student_id = ? AND project_id = ?`, [student.id, taskId]);
    const subId = existingSub ? existingSub.id : `sub_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    if (existingSub) {
      await dbRun(`
        UPDATE submissions SET 
          project_title = ?, github_repo_url = ?, live_deployment_url = ?, notes = ?, status = 'SUBMITTED', submitted_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [projectTitle || 'Project Submission', githubRepoUrl.trim(), liveDeploymentUrl?.trim() || '', notes?.trim() || '', subId]);
    } else {
      await dbRun(`
        INSERT INTO submissions (id, student_id, project_id, project_title, github_repo_url, live_deployment_url, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
      `, [subId, student.id, taskId, projectTitle || 'Project Submission', githubRepoUrl.trim(), liveDeploymentUrl?.trim() || '', notes?.trim() || '']);
    }

    await pushToSupabase('submissions', {
      id: subId,
      student_id: student.id,
      task_id: taskId,
      github_repo_url: githubRepoUrl.trim(),
      live_deployment_url: liveDeploymentUrl?.trim() || null,
      notes: notes?.trim() || null,
      status: 'SUBMITTED',
      created_at: new Date().toISOString()
    });

    res.json({ success: true, message: 'Assignment submitted successfully for review!', submission_id: subId });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// Get user certificates
app.get('/api/user/certificates', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    let certs = await dbAll(`SELECT * FROM certificates WHERE student_id = ?`, [student.id]);
    
    // If none yet, provide sample verified certificate for student
    if (certs.length === 0) {
      const certId = `SKY-B1-${student.id ? student.id.slice(-4).toUpperCase() : '9055'}-CERT`;
      const today = '26 Oct 2026';
      await dbRun(`
        INSERT INTO certificates (id, student_id, student_name, program, batch, duration, issue_date, status, verification_url)
        VALUES (?, ?, ?, '3-Month Full Stack Development Internship', 'Batch 1', '1 Month', ?, 'ISSUED', ?)
      `, [certId, student.id, student.full_name, today, `/verify/${certId}`]);
      certs = await dbAll(`SELECT * FROM certificates WHERE student_id = ?`, [student.id]);
    }

    res.json({ success: true, certificates: certs });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve certificates' });
  }
});

// Get user offer letters
app.get('/api/user/offer-letters', requirePaidStudent, async (req, res) => {
  try {
    const student = req.student;

    let letters = await dbAll(`SELECT * FROM offer_letters WHERE student_id = ?`, [student.id]);

    if (letters.length === 0) {
      const code = `SKX-OL-2026-${student.id ? student.id.slice(-4).toUpperCase() : '9055'}`;
      const olId = `OL-SKX-2026-${student.id ? student.id.slice(-4).toUpperCase() : '9055'}`;
      await dbRun(`
        INSERT INTO offer_letters (id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms)
        VALUES (?, ?, ?, '3-Month Full Stack Development Internship', ?, 'Batch 1', '1 Month', '21 Sept 2026', 'ACTIVE', ?, 'Virtual internship engagement with mandatory milestone deliverables.')
      `, [olId, student.id, student.full_name, 'Full Stack Development', code]);
      letters = await dbAll(`SELECT * FROM offer_letters WHERE student_id = ?`, [student.id]);
    }

    res.json({ success: true, offer_letters: letters });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve offer letters' });
  }
});

// Get user payments
app.get('/api/user/payments', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const payments = await dbAll(`
      SELECT 
        p.id as payment_id,
        p.order_id,
        p.amount,
        p.currency,
        p.status,
        p.payment_method,
        p.cashfree_payment_id,
        p.created_at,
        r.id as registration_id,
        b.title as program_name
      FROM payments p
      JOIN registrations r ON p.registration_id = r.id
      LEFT JOIN batches b ON r.batch_id = b.id
      WHERE r.student_id = ?
      ORDER BY p.created_at DESC
    `, [student.id]);

    res.json({ success: true, payments });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load payments' });
  }
});

// Get user notifications
app.get('/api/user/notifications', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    const userId = student?.id;

    const userNotifs = userId 
      ? await dbAll(`SELECT * FROM user_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`, [userId])
      : [];

    const globalNotifs = await dbAll(`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10`);

    res.json({
      success: true,
      notifications: [
        ...userNotifs.map(n => ({ ...n, source: 'personal' })),
        ...globalNotifs.map(g => ({ ...g, is_read: 0, source: 'global' }))
      ]
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

// Mark notification read
app.put('/api/user/notifications/:id/read', async (req, res) => {
  try {
    await dbRun(`UPDATE user_notifications SET is_read = 1 WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all notifications read
app.put('/api/user/notifications/mark-all-read', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    if (student) {
      await dbRun(`UPDATE user_notifications SET is_read = 1 WHERE user_id = ?`, [student.id]);
    }
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Get user support tickets with replies
app.get('/api/user/support', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const tickets = await dbAll(`SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC`, [student.id]);
    
    // Attach replies
    const fullTickets = await Promise.all(tickets.map(async (t) => {
      const replies = await dbAll(`SELECT * FROM support_replies WHERE ticket_id = ? ORDER BY created_at ASC`, [t.id]);
      return { ...t, replies };
    }));

    res.json({ success: true, tickets: fullTickets });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve support tickets' });
  }
});

// Create support ticket
app.post('/api/user/support', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const { subject, category, message, priority } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required.' });
    }

    const ticketId = `TICK-${Date.now().toString().slice(-4)}`;
    await dbRun(`
      INSERT INTO support_tickets (id, user_id, user_name, user_email, subject, category, message, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open')
    `, [ticketId, student.id, student.full_name, student.email, subject.trim(), category || 'General Inquiry', message.trim(), priority || 'Medium']);

    await pushToSupabase('support_tickets', {
      id: ticketId,
      student_id: student.id,
      subject: subject.trim(),
      category: category || 'General Inquiry',
      priority: priority || 'Medium',
      status: 'Open'
    });

    res.status(201).json({ success: true, message: 'Support ticket submitted successfully!', ticket_id: ticketId });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit support ticket' });
  }
});

// Reply to support ticket
app.post('/api/user/support/:id/reply', async (req, res) => {
  try {
    const student = await getStudentFromRequest(req);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const ticketId = req.params.id;
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Reply message cannot be empty.' });
    }

    const replyId = `rep_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
    await dbRun(`
      INSERT INTO support_replies (id, ticket_id, sender_id, sender_name, sender_role, message)
      VALUES (?, ?, ?, ?, 'USER', ?)
    `, [replyId, ticketId, student.id, student.full_name, message.trim()]);

    await pushToSupabase('support_replies', {
      id: replyId,
      ticket_id: ticketId,
      sender_type: 'user',
      sender_id: student.id,
      sender_name: student.full_name,
      message: message.trim()
    });

    await dbRun(`UPDATE support_tickets SET status = 'In Progress', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [ticketId]);

    res.json({ success: true, message: 'Reply sent successfully!', reply_id: replyId });
  } catch (e) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// ==========================================
// 10. ADMIN DASHBOARD APIS (ROLE: ADMIN)
// ==========================================

// Get all users
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const { search, status, role } = req.query;
    let query = `
      SELECT 
        s.id,
        s.full_name,
        s.email,
        s.mobile,
        s.college,
        s.department,
        s.year_of_study,
        s.city,
        s.skill_level,
        s.bio,
        s.is_active,
        s.created_at,
        r.id as registration_id,
        r.registration_status,
        r.payment_status,
        r.progress_pct,
        p.order_id,
        p.amount
      FROM students s
      LEFT JOIN registrations r ON s.id = r.student_id
      LEFT JOIN payments p ON r.id = p.registration_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (LOWER(s.full_name) LIKE ? OR LOWER(s.email) LIKE ? OR s.mobile LIKE ? OR LOWER(s.college) LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term, term);
    }

    if (status && status !== 'ALL') {
      if (status === 'ACTIVE') query += ` AND s.is_active = 1`;
      else if (status === 'INACTIVE') query += ` AND s.is_active = 0`;
      else if (status === 'PAID') query += ` AND r.payment_status = 'PAID'`;
      else if (status === 'PENDING') query += ` AND (r.payment_status != 'PAID' OR r.payment_status IS NULL)`;
    }

    query += ` ORDER BY s.created_at DESC`;
    const users = await dbAll(query, params);

    res.json({ success: true, count: users.length, users });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Get user detailed profile (Admin)
app.get('/api/admin/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [req.params.id]);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const registrations = await dbAll(`SELECT * FROM registrations WHERE student_id = ?`, [student.id]);
    const submissions = await dbAll(`SELECT * FROM submissions WHERE student_id = ? ORDER BY submitted_at DESC`, [student.id]);
    const certificates = await dbAll(`SELECT * FROM certificates WHERE student_id = ?`, [student.id]);
    const offerLetters = await dbAll(`SELECT * FROM offer_letters WHERE student_id = ?`, [student.id]);
    const payments = await dbAll(`
      SELECT p.* FROM payments p 
      JOIN registrations r ON p.registration_id = r.id 
      WHERE r.student_id = ?
    `, [student.id]);

    res.json({
      success: true,
      user: student,
      registrations,
      submissions,
      certificates,
      offerLetters,
      payments
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

// Activate or deactivate user
app.put('/api/admin/users/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { is_active } = req.body;
    const studentId = req.params.id;
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [studentId]);
    if (!student) return res.status(404).json({ error: 'User not found' });

    const newStatus = is_active ? 1 : 0;
    await dbRun(`UPDATE students SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [newStatus, studentId]);

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      newStatus ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      'USER',
      studentId,
      { student_name: student.full_name, email: student.email, status: newStatus ? 'ACTIVE' : 'DEACTIVATED' }
    );

    res.json({ success: true, message: `User ${newStatus ? 'activated' : 'deactivated'} successfully!` });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Update user details (Admin)
app.put('/api/admin/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const studentId = req.params.id;
    const { full_name, mobile, college, department, skill_level, bio } = req.body;

    await dbRun(`
      UPDATE students SET
        full_name = COALESCE(?, full_name),
        mobile = COALESCE(?, mobile),
        college = COALESCE(?, college),
        department = COALESCE(?, department),
        skill_level = COALESCE(?, skill_level),
        bio = COALESCE(?, bio),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [full_name, mobile, college, department, skill_level, bio, studentId]);

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'UPDATE_USER_PROFILE',
      'USER',
      studentId,
      { updated_fields: { full_name, mobile, college, department } }
    );

    res.json({ success: true, message: 'User updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get all applications (Admin)
app.get('/api/admin/applications', authenticateAdmin, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = `
      SELECT 
        r.id as application_id,
        r.batch_id,
        r.registration_status,
        r.payment_status,
        r.whatsapp_joined,
        r.progress_pct,
        r.created_at,
        r.updated_at,
        s.id as student_id,
        s.full_name,
        s.email,
        s.mobile,
        s.college,
        s.department,
        s.year_of_study,
        p.order_id,
        p.amount,
        p.status as payment_status_detail
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      LEFT JOIN payments p ON r.id = p.registration_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (LOWER(s.full_name) LIKE ? OR LOWER(s.email) LIKE ? OR r.id LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term);
    }

    if (status && status !== 'ALL') {
      query += ` AND (r.registration_status = ? OR r.payment_status = ?)`;
      params.push(status, status);
    }

    query += ` ORDER BY r.created_at DESC`;
    const applications = await dbAll(query, params);
    res.json({ success: true, applications });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Update application status (Approve, Reject, Stage change)
app.put('/api/admin/applications/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { registration_status, payment_status, notes } = req.body;

    const existing = await dbGet(`SELECT * FROM registrations WHERE id = ?`, [applicationId]);
    if (!existing) return res.status(404).json({ error: 'Application not found' });

    await dbRun(`
      UPDATE registrations SET
        registration_status = COALESCE(?, registration_status),
        payment_status = COALESCE(?, payment_status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [registration_status, payment_status, applicationId]);

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'UPDATE_APPLICATION_STATUS',
      'APPLICATION',
      applicationId,
      { previous: existing.registration_status, new_status: registration_status, payment_status, notes }
    );

    res.json({ success: true, message: `Application updated to ${registration_status || existing.registration_status}` });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Get internships management
app.get('/api/admin/internships', authenticateAdmin, async (req, res) => {
  try {
    const batches = await dbAll(`SELECT * FROM batches`);
    const taskCount = await dbGet(`SELECT COUNT(*) as count FROM student_tasks`);
    const studentCount = await dbGet(`SELECT COUNT(*) as count FROM registrations WHERE payment_status = 'PAID'`);

    res.json({
      success: true,
      internships: batches.map(b => ({
        ...b,
        domain: 'Full Stack Development',
        enrolled_students: studentCount?.count || 0,
        task_count: taskCount?.count || 6,
        duration: '3 Months / 1 Month Fast-track',
        mode: '100% Virtual'
      }))
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load internships' });
  }
});

// Update internship program
app.post('/api/admin/internships', authenticateAdmin, async (req, res) => {
  try {
    const { id, title, start_notice, registration_fee } = req.body;
    await dbRun(`
      UPDATE batches SET
        title = COALESCE(?, title),
        start_notice = COALESCE(?, start_notice),
        registration_fee = COALESCE(?, registration_fee)
      WHERE id = ?
    `, [title, start_notice, registration_fee, id || 'batch-1']);

    if (start_notice) {
      await dbRun(`
        INSERT INTO settings (key, value, updated_at) VALUES ('BATCH_START_NOTICE', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `, [start_notice]);
    }

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'UPDATE_INTERNSHIP',
      'INTERNSHIP',
      id || 'batch-1',
      { title, start_notice, registration_fee }
    );

    res.json({ success: true, message: 'Internship details updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update internship' });
  }
});

// Get tasks and student submissions (Admin)
app.get('/api/admin/tasks', authenticateAdmin, async (req, res) => {
  try {
    const tasks = await dbAll(`SELECT * FROM student_tasks ORDER BY order_num ASC`);
    const submissions = await dbAll(`
      SELECT 
        sub.*,
        s.full_name as student_name,
        s.email as student_email,
        s.college
      FROM submissions sub
      JOIN students s ON sub.student_id = s.id
      ORDER BY sub.submitted_at DESC
    `);

    res.json({ success: true, tasks, submissions });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load tasks and submissions' });
  }
});

// Review student task submission (Approve, Revision, Grade, Feedback)
app.put('/api/admin/tasks/submissions/:id/review', authenticateAdmin, async (req, res) => {
  try {
    const subId = req.params.id;
    const { status, feedback, grade } = req.body;

    const sub = await dbGet(`SELECT * FROM submissions WHERE id = ?`, [subId]);
    if (!sub) return res.status(404).json({ error: 'Submission not found' });

    await dbRun(`
      UPDATE submissions SET
        status = ?,
        feedback = ?,
        grade = ?,
        reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status || 'APPROVED', feedback || 'Verified by Skyrovix Reviewer', grade || 'A+', subId]);

    // Send in-app notification to student
    const notifId = `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
    await dbRun(`
      INSERT INTO user_notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `, [
      notifId,
      sub.student_id,
      `Assignment ${status === 'APPROVED' ? 'Approved' : 'Review Updated'}: ${sub.project_title}`,
      `Your submission for "${sub.project_title}" has been reviewed: ${grade || 'Grade A+'}. Feedback: ${feedback || 'Approved'}`,
      status === 'APPROVED' ? 'success' : 'info'
    ]);

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'REVIEW_TASK_SUBMISSION',
      'SUBMISSION',
      subId,
      { student_id: sub.student_id, project_title: sub.project_title, status, grade, feedback }
    );

    res.json({ success: true, message: `Submission updated to ${status}` });
  } catch (e) {
    res.status(500).json({ error: 'Failed to review submission' });
  }
});

// Get all certificates (Admin)
app.get('/api/admin/certificates', authenticateAdmin, async (req, res) => {
  try {
    const certificates = await dbAll(`
      SELECT 
        c.*,
        s.email as student_email,
        s.college
      FROM certificates c
      JOIN students s ON c.student_id = s.id
      ORDER BY c.created_at DESC
    `);
    res.json({ success: true, certificates });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load certificates' });
  }
});

// Generate new certificate (Admin)
app.post('/api/admin/certificates/generate', authenticateAdmin, async (req, res) => {
  try {
    const { student_id, program, duration, batch } = req.body;
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [student_id]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const certId = `SKY-B1-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const verifyUrl = `/verify/${certId}`;

    await dbRun(`
      INSERT INTO certificates (id, student_id, student_name, program, batch, duration, issue_date, status, verification_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ISSUED', ?)
    `, [
      certId,
      student.id,
      student.full_name,
      program || '3-Month Full Stack Development Internship',
      batch || 'Batch 1',
      duration || '3 Months',
      today,
      verifyUrl
    ]);

    await pushToSupabase('certificates', {
      id: certId,
      student_id: student.id,
      program: program || '3-Month Full Stack Development Internship',
      duration: duration || '3 Months',
      batch: batch || 'Batch 1',
      issue_date: today,
      grade: 'A+',
      status: 'ISSUED',
      verification_hash: `hash_${certId}`,
      revoked: 0
    });

    // Send in-app notification to student
    const notifId = `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
    await dbRun(`
      INSERT INTO user_notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `, [notifId, student.id, 'Official Certificate Issued!', `Your certificate (${certId}) is ready for download and verification.`, 'certificate']);

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'GENERATE_CERTIFICATE',
      'CERTIFICATE',
      certId,
      { student_name: student.full_name, student_id: student.id }
    );

    res.status(201).json({ success: true, message: 'Certificate issued successfully!', certificate_id: certId });
  } catch (e) {
    console.error('Error generating certificate:', e);
    res.status(500).json({ error: e.message || 'Failed to generate certificate' });
  }
});

// Revoke certificate (Admin)
app.put('/api/admin/certificates/:id/revoke', authenticateAdmin, async (req, res) => {
  try {
    const certId = req.params.id;
    await dbRun(`UPDATE certificates SET status = 'REVOKED' WHERE id = ?`, [certId]);

    await pushToSupabase('certificates', {
      id: certId,
      status: 'REVOKED',
      revoked: 1
    });

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'REVOKE_CERTIFICATE',
      'CERTIFICATE',
      certId,
      { status: 'REVOKED' }
    );

    res.json({ success: true, message: 'Certificate revoked successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to revoke certificate' });
  }
});

// Get all offer letters (Admin)
app.get('/api/admin/offer-letters', authenticateAdmin, async (req, res) => {
  try {
    const offerLetters = await dbAll(`
      SELECT 
        ol.*,
        s.email as student_email,
        s.college
      FROM offer_letters ol
      JOIN students s ON ol.student_id = s.id
      ORDER BY ol.created_at DESC
    `);
    res.json({ success: true, offer_letters: offerLetters });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load offer letters' });
  }
});

// Generate new offer letter (Admin)
app.post('/api/admin/offer-letters/generate', authenticateAdmin, async (req, res) => {
  try {
    const { student_id, domain, program, duration, batch } = req.body;
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [student_id]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const olId = `OL-SKX-${Date.now().toString().slice(-4)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const code = `SKX-OL-2026-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    await dbRun(`
      INSERT INTO offer_letters (id, student_id, student_name, program, domain, batch, duration, issue_date, status, verification_code, terms)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, 'Virtual internship engagement with mandatory milestone deliverables.')
    `, [
      olId,
      student.id,
      student.full_name,
      program || '3-Month Full Stack Development Internship',
      domain || 'Full Stack Development',
      batch || 'Batch 1',
      duration || '1 Month',
      today,
      code
    ]);

    await pushToSupabase('offer_letters', {
      id: olId,
      student_id: student.id,
      student_name: student.full_name,
      program: program || '3-Month Full Stack Development Internship',
      domain: domain || 'Full Stack Development',
      batch: batch || 'Batch 1',
      duration: duration || '1 Month',
      issue_date: today,
      status: 'ACTIVE',
      verification_code: code,
      terms: 'Virtual internship engagement with mandatory milestone deliverables.'
    });

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'GENERATE_OFFER_LETTER',
      'OFFER_LETTER',
      olId,
      { student_name: student.full_name, verification_code: code }
    );

    res.status(201).json({ success: true, message: 'Offer letter issued successfully!', offer_letter_id: olId, verification_code: code });
  } catch (e) {
    res.status(500).json({ error: 'Failed to issue offer letter' });
  }
});

// Revoke offer letter (Admin)
app.put('/api/admin/offer-letters/:id/revoke', authenticateAdmin, async (req, res) => {
  try {
    const olId = req.params.id;
    await dbRun(`UPDATE offer_letters SET status = 'REVOKED' WHERE id = ?`, [olId]);

    await pushToSupabase('offer_letters', {
      id: olId,
      status: 'REVOKED'
    });

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'REVOKE_OFFER_LETTER',
      'OFFER_LETTER',
      olId,
      { status: 'REVOKED' }
    );

    res.json({ success: true, message: 'Offer letter revoked successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to revoke offer letter' });
  }
});

// Get payments table (Admin)
app.get('/api/admin/payments', authenticateAdmin, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = `
      SELECT 
        p.*,
        s.full_name as student_name,
        s.email as student_email,
        s.mobile as student_mobile,
        r.id as registration_id
      FROM payments p
      JOIN registrations r ON p.registration_id = r.id
      JOIN students s ON r.student_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.order_id LIKE ? OR p.cashfree_payment_id LIKE ? OR LOWER(s.full_name) LIKE ? OR LOWER(s.email) LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term, term);
    }

    if (status && status !== 'ALL') {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY p.created_at DESC`;
    const payments = await dbAll(query, params);
    res.json({ success: true, payments });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load payments' });
  }
});

// Notifications (Admin list & send)
app.get('/api/admin/notifications', authenticateAdmin, async (req, res) => {
  try {
    const globalAnnouncements = await dbAll(`SELECT * FROM notifications ORDER BY created_at DESC`);
    const userNotifications = await dbAll(`
      SELECT 
        un.*,
        s.full_name as user_name,
        s.email as user_email
      FROM user_notifications un
      LEFT JOIN students s ON un.user_id = s.id
      ORDER BY un.created_at DESC LIMIT 50
    `);

    res.json({ success: true, announcements: globalAnnouncements, user_notifications: userNotifications });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

// Post notification / Announcement (Admin)
app.post('/api/admin/notifications', authenticateAdmin, async (req, res) => {
  try {
    const { title, message, type, targetAudience, userId, link } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }

    if (targetAudience === 'INDIVIDUAL' && userId) {
      const notifId = `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
      await dbRun(`
        INSERT INTO user_notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [notifId, userId, title.trim(), message.trim(), type || 'info', link || null]);
    } else {
      // Global announcement
      const annId = `ann_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
      await dbRun(`
        INSERT INTO notifications (id, batch_id, title, message, type)
        VALUES (?, 'batch-1', ?, ?, ?)
      `, [annId, title.trim(), message.trim(), type || 'announcement']);
    }

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'POST_NOTIFICATION',
      'NOTIFICATION',
      null,
      { title, targetAudience, type }
    );

    res.status(201).json({ success: true, message: 'Notification broadcast successfully!' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to broadcast notification' });
  }
});

// Support tickets (Admin)
app.get('/api/admin/support', authenticateAdmin, async (req, res) => {
  try {
    const tickets = await dbAll(`
      SELECT 
        st.*,
        (SELECT COUNT(*) FROM support_replies sr WHERE sr.ticket_id = st.id) as reply_count
      FROM support_tickets st
      ORDER BY st.created_at DESC
    `);
    res.json({ success: true, tickets });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load support tickets' });
  }
});

// Support ticket detail with replies (Admin)
app.get('/api/admin/support/:id', authenticateAdmin, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await dbGet(`SELECT * FROM support_tickets WHERE id = ?`, [ticketId]);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const replies = await dbAll(`SELECT * FROM support_replies WHERE ticket_id = ? ORDER BY created_at ASC`, [ticketId]);
    res.json({ success: true, ticket, replies });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load ticket details' });
  }
});

// Admin reply to support ticket
app.post('/api/admin/support/:id/reply', authenticateAdmin, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { message, status } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Reply message cannot be empty.' });
    }

    const ticket = await dbGet(`SELECT * FROM support_tickets WHERE id = ?`, [ticketId]);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const replyId = `rep_adm_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
    await dbRun(`
      INSERT INTO support_replies (id, ticket_id, sender_id, sender_name, sender_role, message)
      VALUES (?, ?, ?, ?, 'ADMIN', ?)
    `, [replyId, ticketId, req.admin.id, req.admin.username || 'Skyrovix Support', message.trim()]);

    const newStatus = status || 'Waiting for User';
    await dbRun(`UPDATE support_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [newStatus, ticketId]);

    // Send in-app notification to student
    const notifId = `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
    await dbRun(`
      INSERT INTO user_notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `, [notifId, ticket.user_id, `Support Reply on Ticket ${ticketId}`, `Skyrovix Support replied: "${message.slice(0, 80)}..."`, 'info']);

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'REPLY_SUPPORT_TICKET',
      'SUPPORT_TICKET',
      ticketId,
      { status: newStatus, reply_preview: message.slice(0, 100) }
    );

    res.json({ success: true, message: 'Reply sent to user successfully!' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to send admin reply' });
  }
});

// Update support ticket status
app.put('/api/admin/support/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;
    await dbRun(`UPDATE support_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, ticketId]);

    await recordAuditLog(
      req.admin.id,
      req.admin.username,
      'UPDATE_SUPPORT_STATUS',
      'SUPPORT_TICKET',
      ticketId,
      { new_status: status }
    );

    res.json({ success: true, message: `Ticket status updated to ${status}` });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// Admin deep-dive analytics
app.get('/api/admin/analytics', authenticateAdmin, async (req, res) => {
  try {
    // Registrations by date (last 7 days)
    const registrationsByDay = await dbAll(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM registrations 
      GROUP BY DATE(created_at) 
      ORDER BY date DESC LIMIT 7
    `);

    // Payments by date (last 7 days)
    const paymentsByDay = await dbAll(`
      SELECT DATE(created_at) as date, SUM(amount) as total, COUNT(*) as count
      FROM payments 
      WHERE status = 'PAID'
      GROUP BY DATE(created_at) 
      ORDER BY date DESC LIMIT 7
    `);

    // Department breakdown
    const departmentBreakdown = await dbAll(`
      SELECT department, COUNT(*) as count 
      FROM students 
      GROUP BY department 
      ORDER BY count DESC LIMIT 5
    `);

    // Year of study breakdown
    const yearBreakdown = await dbAll(`
      SELECT year_of_study, COUNT(*) as count 
      FROM students 
      GROUP BY year_of_study
    `);

    // Skill level breakdown
    const skillBreakdown = await dbAll(`
      SELECT skill_level, COUNT(*) as count 
      FROM students 
      GROUP BY skill_level
    `);

    res.json({
      success: true,
      registrationsByDay,
      paymentsByDay,
      departmentBreakdown,
      yearBreakdown,
      skillBreakdown
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to compile analytics' });
  }
});

// Admin audit logs
app.get('/api/admin/audit-logs', authenticateAdmin, async (req, res) => {
  try {
    const logs = await dbAll(`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100`);
    res.json({ success: true, logs });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load audit logs' });
  }
});

// ==========================================
// 10b. ADMIN WORKFLOW MANAGEMENT APIS
// ==========================================

// Get all enrolled interns with 3-stage workflow status and filters
app.get('/api/admin/workflow/interns', authenticateAdmin, async (req, res) => {
  try {
    const { search, stage, domain, status } = req.query;

    let query = `
      SELECT 
        s.id as student_id,
        s.full_name,
        s.email,
        s.mobile,
        s.college,
        s.department,
        s.created_at as registered_at,
        r.id as registration_id,
        r.registration_status,
        r.payment_status,
        r.domain,
        w.id as workflow_id,
        COALESCE(w.current_stage, 1) as current_stage,
        COALESCE(w.stage1_status, 'PENDING') as stage1_status,
        COALESCE(w.stage2_status, 'LOCKED') as stage2_status,
        COALESCE(w.stage3_status, 'LOCKED') as stage3_status,
        COALESCE(w.is_manually_locked, 0) as is_manually_locked,
        w.manual_lock_reason,
        ls.id as linkedin_sub_id,
        ls.post_url as linkedin_post_url,
        ls.status as linkedin_sub_status,
        ls.admin_feedback as linkedin_feedback,
        ls.submitted_at as linkedin_submitted_at,
        ol.id as offer_letter_id,
        ol.verification_code as offer_letter_code
      FROM students s
      JOIN registrations r ON s.id = r.student_id
      LEFT JOIN intern_workflows w ON s.id = w.student_id
      LEFT JOIN linkedin_submissions ls ON s.id = ls.student_id
      LEFT JOIN offer_letters ol ON s.id = ol.student_id
      WHERE (r.registration_status = 'CONFIRMED' OR r.payment_status = 'PAID')
    `;
    const params = [];

    if (search) {
      query += ` AND (LOWER(s.full_name) LIKE ? OR LOWER(s.email) LIKE ? OR s.mobile LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term);
    }

    if (domain && domain !== 'ALL') {
      query += ` AND (LOWER(s.department) LIKE ? OR LOWER(r.domain) LIKE ?)`;
      const dTerm = `%${domain.toLowerCase().trim()}%`;
      params.push(dTerm, dTerm);
    }

    if (stage && stage !== 'ALL') {
      const stageNum = parseInt(stage, 10);
      if (!isNaN(stageNum)) {
        query += ` AND w.current_stage = ?`;
        params.push(stageNum);
      } else if (stage === 'LOCKED') {
        query += ` AND w.is_manually_locked = 1`;
      }
    }

    if (status && status !== 'ALL') {
      if (status === 'LINKEDIN_PENDING') {
        query += ` AND (ls.status = 'PENDING_VERIFICATION' OR w.stage1_status = 'SUBMITTED')`;
      } else if (status === 'LINKEDIN_APPROVED') {
        query += ` AND w.stage1_status = 'APPROVED'`;
      } else if (status === 'TRAINING_IN_PROGRESS') {
        query += ` AND w.stage2_status = 'IN_PROGRESS'`;
      } else if (status === 'PROJECT_UNLOCKED') {
        query += ` AND w.stage3_status = 'UNLOCKED'`;
      } else if (status === 'MANUALLY_LOCKED') {
        query += ` AND w.is_manually_locked = 1`;
      }
    }

    query += ` ORDER BY s.created_at DESC`;

    const rawInterns = await dbAll(query, params);

    // Get training module counts for each intern
    const trainingSubs = await dbAll(`
      SELECT student_id, status, COUNT(*) as count 
      FROM training_submissions 
      GROUP BY student_id, status
    `);

    // Get total task submissions
    const taskSubs = await dbAll(`
      SELECT student_id, status, COUNT(*) as count 
      FROM submissions 
      GROUP BY student_id, status
    `);

    const interns = rawInterns.map(i => {
      const approvedModules = trainingSubs.find(t => t.student_id === i.student_id && t.status === 'APPROVED')?.count || 0;
      const submittedModules = trainingSubs.find(t => t.student_id === i.student_id && t.status === 'SUBMITTED')?.count || 0;
      const approvedTasks = taskSubs.find(t => t.student_id === i.student_id && t.status === 'APPROVED')?.count || 0;
      const submittedTasks = taskSubs.find(t => t.student_id === i.student_id && t.status === 'SUBMITTED')?.count || 0;

      return {
        student_id: i.student_id,
        full_name: i.full_name,
        email: i.email,
        mobile: i.mobile,
        college: i.college,
        department: i.department || 'Full Stack Development',
        domain: 'Full Stack Development',
        registered_at: i.registered_at,
        registration_status: i.registration_status,
        payment_status: i.payment_status,
        workflow: {
          id: i.workflow_id,
          current_stage: i.current_stage,
          stage1_status: i.stage1_status,
          stage2_status: i.stage2_status,
          stage3_status: i.stage3_status,
          is_manually_locked: i.is_manually_locked === 1,
          manual_lock_reason: i.manual_lock_reason
        },
        offer_letter: i.offer_letter_id ? {
          id: i.offer_letter_id,
          code: i.offer_letter_code
        } : null,
        linkedin: i.linkedin_sub_id ? {
          id: i.linkedin_sub_id,
          post_url: i.linkedin_post_url,
          status: i.linkedin_sub_status,
          feedback: i.linkedin_feedback,
          submitted_at: i.linkedin_submitted_at
        } : null,
        training: {
          approved_count: approvedModules,
          submitted_count: submittedModules,
          total_count: 5,
          progress_pct: Math.round((approvedModules / 5) * 100),
          is_all_approved: approvedModules >= 5
        },
        tasks: {
          approved_count: approvedTasks,
          submitted_count: submittedTasks
        },
        eligible_for_project: approvedModules >= 5
      };
    });

    // Compute stats
    const allEnrolled = await dbAll(`
      SELECT s.id, w.current_stage, w.stage1_status, w.stage2_status, w.stage3_status, w.is_manually_locked, ls.status as ls_status
      FROM students s
      JOIN registrations r ON s.id = r.student_id
      LEFT JOIN intern_workflows w ON s.id = w.student_id
      LEFT JOIN linkedin_submissions ls ON s.id = ls.student_id
      WHERE (r.registration_status = 'CONFIRMED' OR r.payment_status = 'PAID')
    `);

    const stats = {
      total_interns: allEnrolled.length,
      stage1_pending: allEnrolled.filter(e => e.stage1_status === 'SUBMITTED' || e.ls_status === 'PENDING_VERIFICATION').length,
      stage1_approved: allEnrolled.filter(e => e.stage1_status === 'APPROVED').length,
      stage2_training: allEnrolled.filter(e => e.current_stage === 2 || e.stage2_status === 'IN_PROGRESS').length,
      stage3_unlocked: allEnrolled.filter(e => e.stage3_status === 'UNLOCKED' || e.stage3_status === 'COMPLETED').length,
      manually_locked: allEnrolled.filter(e => e.is_manually_locked === 1).length
    };

    res.json({ success: true, interns, stats });
  } catch (e) {
    console.error('Error fetching admin workflow interns:', e);
    res.status(500).json({ error: 'Failed to load workflow data' });
  }
});

// Admin review LinkedIn submission
app.post('/api/admin/workflow/linkedin/:submissionId/review', authenticateAdmin, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { feedback } = req.body;
    const rawAction = req.body.action || req.body.decision;
    const action = String(rawAction || '').toUpperCase().startsWith('APPROV') 
      ? 'APPROVE' 
      : (String(rawAction || '').toUpperCase().startsWith('REJECT') ? 'REJECT' : null);

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ error: 'Action must be APPROVE or REJECT' });
    }

    if (action === 'REJECT' && (!feedback || !feedback.trim())) {
      return res.status(400).json({ error: 'Feedback reason is required when rejecting a submission.' });
    }

    const sub = await dbGet(`SELECT * FROM linkedin_submissions WHERE id = ?`, [submissionId]);
    if (!sub) return res.status(404).json({ error: 'LinkedIn submission not found' });

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const reviewerName = req.admin.username || req.admin.email || 'Admin';

    await dbRun(`
      UPDATE linkedin_submissions SET 
        status = ?,
        admin_feedback = ?,
        reviewed_by = ?,
        reviewed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newStatus, feedback?.trim() || null, reviewerName, submissionId]);

    // Update workflow stage
    if (action === 'APPROVE') {
      await dbRun(`
        UPDATE intern_workflows SET 
          stage1_status = 'APPROVED',
          current_stage = 2,
          stage2_status = 'IN_PROGRESS',
          updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?
      `, [sub.student_id]);

      // In-app notification
      await dbRun(`
        INSERT INTO user_notifications (id, user_id, title, message, type, is_read, link)
        VALUES (?, ?, ?, ?, 'workflow', 0, '/dashboard/workflow')
      `, [
        `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
        sub.student_id,
        'Stage 1 Approved: Offer Letter Post Verified!',
        'Your LinkedIn post has been verified by the Skyrovix mentor board. Stage 2 (Training & Learning) is now unlocked!'
      ]);
    } else {
      await dbRun(`
        UPDATE intern_workflows SET 
          stage1_status = 'REJECTED',
          updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?
      `, [sub.student_id]);

      // In-app notification
      await dbRun(`
        INSERT INTO user_notifications (id, user_id, title, message, type, is_read, link)
        VALUES (?, ?, ?, ?, 'workflow', 0, '/dashboard/workflow')
      `, [
        `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
        sub.student_id,
        'Stage 1 LinkedIn Submission Revision Requested',
        `Your LinkedIn submission needs revision: "${feedback?.trim()}". Please update your post and resubmit.`
      ]);
    }

    await recordAuditLog(
      req.admin.id,
      reviewerName,
      `LINKEDIN_SUBMISSION_${action}`,
      'LINKEDIN_SUBMISSION',
      submissionId,
      { student_id: sub.student_id, action, feedback: feedback || null }
    );

    res.json({
      success: true,
      message: action === 'APPROVE' ? 'LinkedIn post approved. Stage 2 unlocked for intern!' : 'Submission rejected with feedback.'
    });
  } catch (e) {
    console.error('Error reviewing LinkedIn submission:', e);
    res.status(500).json({ error: 'Failed to record LinkedIn review' });
  }
});

// Admin get student training module submissions
app.get('/api/admin/workflow/interns/:studentId/training', authenticateAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [studentId]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const workflow = await getOrCreateInternWorkflow(studentId);
    const modules = await dbAll(`SELECT * FROM training_modules WHERE is_active = 1 ORDER BY order_num ASC`);
    const submissions = await dbAll(`SELECT * FROM training_submissions WHERE student_id = ?`, [studentId]);

    const formattedModules = modules.map(m => {
      const sub = submissions.find(s => s.module_id === m.id);
      let objectives = [];
      let exercises = [];
      let resources = [];
      try { objectives = JSON.parse(m.objectives); } catch(e) {}
      try { exercises = JSON.parse(m.exercises); } catch(e) {}
      try { resources = JSON.parse(m.resources); } catch(e) {}

      return {
        id: m.id,
        module_num: m.module_num,
        title: m.title,
        short_title: m.short_title,
        description: m.description,
        objectives,
        instructions: m.instructions,
        exercises,
        resources,
        submission: sub ? {
          id: sub.id,
          status: sub.status,
          github_url: sub.github_url,
          live_demo_url: sub.live_demo_url,
          submission_url: sub.submission_url,
          notes: sub.notes,
          admin_feedback: sub.admin_feedback,
          reviewed_by: sub.reviewed_by,
          reviewed_at: sub.reviewed_at,
          submitted_at: sub.submitted_at
        } : null
      };
    });

    const approvedCount = formattedModules.filter(m => m.submission?.status === 'APPROVED').length;

    res.json({
      success: true,
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        department: student.department
      },
      workflow,
      modules: formattedModules,
      approved_count: approvedCount,
      total_count: 5,
      all_approved: approvedCount >= 5
    });
  } catch (e) {
    console.error('Error fetching student training details:', e);
    res.status(500).json({ error: 'Failed to retrieve training details' });
  }
});

// Admin review training module submission
app.post('/api/admin/workflow/training/:submissionId/review', authenticateAdmin, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { feedback } = req.body;
    const rawAction = req.body.action || req.body.decision;
    const action = String(rawAction || '').toUpperCase().startsWith('APPROV') 
      ? 'APPROVE' 
      : (String(rawAction || '').toUpperCase().startsWith('REJECT') ? 'REJECT' : null);

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ error: 'Action must be APPROVE or REJECT' });
    }

    if (action === 'REJECT' && (!feedback || !feedback.trim())) {
      return res.status(400).json({ error: 'Feedback reason is required when rejecting an assignment.' });
    }

    const sub = await dbGet(`SELECT * FROM training_submissions WHERE id = ?`, [submissionId]);
    if (!sub) return res.status(404).json({ error: 'Training submission not found' });

    const moduleItem = await dbGet(`SELECT * FROM training_modules WHERE id = ?`, [sub.module_id]);
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const reviewerName = req.admin.username || req.admin.email || 'Admin';

    await dbRun(`
      UPDATE training_submissions SET 
        status = ?,
        admin_feedback = ?,
        reviewed_by = ?,
        reviewed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newStatus, feedback?.trim() || null, reviewerName, submissionId]);

    // Check if all 5 modules are approved now
    const approvedSubs = await dbGet(`
      SELECT COUNT(*) as count FROM training_submissions 
      WHERE student_id = ? AND status = 'APPROVED'
    `, [sub.student_id]);

    const approvedCount = approvedSubs?.count || 0;
    let unlockedProject = false;

    if (approvedCount >= 5) {
      await dbRun(`
        UPDATE intern_workflows SET 
          stage2_status = 'COMPLETED',
          current_stage = 3,
          stage3_status = 'UNLOCKED',
          updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?
      `, [sub.student_id]);

      unlockedProject = true;

      // In-app notification
      await dbRun(`
        INSERT INTO user_notifications (id, user_id, title, message, type, is_read, link)
        VALUES (?, ?, ?, ?, 'workflow', 0, '/dashboard/tasks')
      `, [
        `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
        sub.student_id,
        '🎉 Stage 3 Unlocked: Internship Project Access Granted!',
        'Congratulations! You have completed and received mentor approval on all 5 Training & Learning modules. Your assigned Internship Project dashboard is now completely unlocked.'
      ]);

      await recordAuditLog(
        req.admin.id,
        reviewerName,
        'PROJECT_ACCESS_AUTO_UNLOCKED',
        'INTERN_WORKFLOW',
        sub.student_id,
        { reason: 'All 5 Training & Learning modules approved' }
      );
    } else {
      // In-app notification for single module
      await dbRun(`
        INSERT INTO user_notifications (id, user_id, title, message, type, is_read, link)
        VALUES (?, ?, ?, ?, 'workflow', 0, '/dashboard/workflow')
      `, [
        `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
        sub.student_id,
        action === 'APPROVE' ? `${moduleItem?.short_title || 'Module'} Approved` : `${moduleItem?.short_title || 'Module'} Needs Revision`,
        action === 'APPROVE' 
          ? `Your submission for ${moduleItem?.title || 'Training Module'} has been approved (${approvedCount}/5 completed).`
          : `Feedback on ${moduleItem?.title || 'Training Module'}: "${feedback?.trim()}". Please revise and resubmit.`
      ]);
    }

    await recordAuditLog(
      req.admin.id,
      reviewerName,
      `TRAINING_MODULE_${action}`,
      'TRAINING_SUBMISSION',
      submissionId,
      { student_id: sub.student_id, module_id: sub.module_id, action, feedback: feedback || null, approved_count: approvedCount }
    );

    res.json({
      success: true,
      message: action === 'APPROVE' 
        ? (unlockedProject ? 'All 5 modules approved! Stage 3 Internship Project unlocked!' : `Module approved (${approvedCount}/5 completed).`)
        : 'Module assignment rejected with feedback.',
      approved_count: approvedCount,
      all_modules_approved: approvedCount >= 5,
      unlocked_project: unlockedProject
    });
  } catch (e) {
    console.error('Error reviewing training module submission:', e);
    res.status(500).json({ error: 'Failed to record training review' });
  }
});

// Admin manual lock/unlock intern
app.post('/api/admin/workflow/interns/:studentId/lock', authenticateAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    const reason = req.body.reason;
    const isLock = req.body.locked === true || req.body.locked === 1 || req.body.action === 'lock';

    if (isLock && (!reason || !reason.trim())) {
      return res.status(400).json({ error: 'A recorded reason is required to lock an intern account.' });
    }

    const workflow = await getOrCreateInternWorkflow(studentId);
    const lockVal = isLock ? 1 : 0;
    const lockReason = isLock ? reason.trim() : null;

    await dbRun(`
      UPDATE intern_workflows SET 
        is_manually_locked = ?,
        manual_lock_reason = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE student_id = ?
    `, [lockVal, lockReason, studentId]);

    const reviewerName = req.admin.username || req.admin.email || 'Admin';

    await recordAuditLog(
      req.admin.id,
      reviewerName,
      isLock ? 'INTERN_MANUALLY_LOCKED' : 'INTERN_MANUALLY_UNLOCKED',
      'INTERN_WORKFLOW',
      studentId,
      { locked: isLock, reason: lockReason }
    );

    // Notify user
    await dbRun(`
      INSERT INTO user_notifications (id, user_id, title, message, type, is_read, link)
      VALUES (?, ?, ?, ?, 'alert', 0, '/dashboard')
    `, [
      `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      studentId,
      isLock ? 'Internship Access Temporarily Locked' : 'Internship Access Restored',
      isLock 
        ? `Your internship workflow has been temporarily locked by an administrator: "${lockReason}". Please contact support for assistance.`
        : 'Your internship workflow access has been restored by an administrator.'
    ]);

    res.json({
      success: true,
      is_manually_locked: lockVal === 1,
      manual_lock_reason: lockReason,
      message: isLock ? 'Intern account locked successfully.' : 'Intern account unlocked successfully.'
    });
  } catch (e) {
    console.error('Error locking/unlocking intern:', e);
    res.status(500).json({ error: 'Failed to update lock status' });
  }
});

// Admin stage override
app.post('/api/admin/workflow/interns/:studentId/stage-override', authenticateAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { stage, reason } = req.body;
    const stageNum = parseInt(stage, 10);

    if (![1, 2, 3].includes(stageNum)) {
      return res.status(400).json({ error: 'Stage must be 1, 2, or 3' });
    }

    const workflow = await getOrCreateInternWorkflow(studentId);

    let s1 = workflow.stage1_status;
    let s2 = workflow.stage2_status;
    let s3 = workflow.stage3_status;

    if (stageNum === 1) {
      s1 = 'PENDING';
      s2 = 'LOCKED';
      s3 = 'LOCKED';
    } else if (stageNum === 2) {
      s1 = 'APPROVED';
      s2 = 'IN_PROGRESS';
      s3 = 'LOCKED';
    } else if (stageNum === 3) {
      s1 = 'APPROVED';
      s2 = 'COMPLETED';
      s3 = 'UNLOCKED';
    }

    await dbRun(`
      UPDATE intern_workflows SET 
        current_stage = ?,
        stage1_status = ?,
        stage2_status = ?,
        stage3_status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE student_id = ?
    `, [stageNum, s1, s2, s3, studentId]);

    const reviewerName = req.admin.username || req.admin.email || 'Admin';

    await recordAuditLog(
      req.admin.id,
      reviewerName,
      'INTERN_STAGE_OVERRIDE',
      'INTERN_WORKFLOW',
      studentId,
      { previous_stage: workflow.current_stage, new_stage: stageNum, reason: reason || 'Manual Admin Override' }
    );

    res.json({
      success: true,
      current_stage: stageNum,
      stage1_status: s1,
      stage2_status: s2,
      stage3_status: s3,
      message: `Intern successfully transitioned to Stage ${stageNum}.`
    });
  } catch (e) {
    console.error('Error overriding intern stage:', e);
    res.status(500).json({ error: 'Failed to override stage' });
  }
});

// Serve static frontend build if present
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Initialize database & Start Server
const initPromise = (async () => {
  try {
    await initDb();
    // If Supabase is configured, pull live data into local cache
    if (isSupabaseConfigured()) {
      await pullFromSupabase(dbRun);
    }
    if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 Skyrovix Batch 1 API server listening on http://localhost:${PORT}`);
        console.log(`🔒 Cashfree Gateway Configured: ${isCashfreeConfigured() ? 'YES (' + (process.env.CASHFREE_ENVIRONMENT || 'sandbox') + ')' : 'NO (Sandbox Developer Simulation Active)'}`);
        console.log(`⚡ Supabase Database Configured: ${isSupabaseConfigured() ? 'YES (' + process.env.SUPABASE_URL + ')' : 'READY (Waiting for project URL & API keys in server/.env)'}`);
      });
    }
  } catch (err) {
    console.error('❌ Database / sync initialization error:', err);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
})();

export { initPromise, app };
export default app;



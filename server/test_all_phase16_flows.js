import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const BASE_URL = 'http://localhost:5000';

async function runPhase16Tests() {
  console.log('====================================================');
  console.log('🧪 SKYROVIX PHASE 16 — COMPLETE WORKFLOW VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testEmail = `candidate.${timestamp}@example.com`;
  const testPassword = 'Password@123';
  let studentToken = null;
  let studentId = null;
  let registrationId = null;
  let orderId = null;
  let adminToken = null;
  let offerLetterCode = null;
  let certificateId = null;

  try {
    // -------------------------------------------------------------------------
    // 1 & 2. Backend & MySQL Health Verification
    // -------------------------------------------------------------------------
    console.log('--- 1 & 2. Verify Backend & MySQL Connection ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const health = await healthRes.json();
    assert(health.success === true, 'GET /api/health returned success: true');
    assert(health.database === 'mysql', `Database engine is MySQL (got: ${health.database})`);
    assert(health.status === 'connected', `Database status is connected (got: ${health.status})`);

    // -------------------------------------------------------------------------
    // 3 & 4. Student Registration & Internship Registration
    // -------------------------------------------------------------------------
    console.log('\n--- 3 & 4. Student Registration & Internship Registration ---');
    const applyRes = await fetch(`${BASE_URL}/api/registrations/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Arun Kumar',
        email: testEmail,
        password: testPassword,
        mobile: '9876543210',
        college: 'Anna University',
        degree: 'B.E',
        department: 'Computer Science and Engineering',
        yearOfStudy: '3rd Year',
        city: 'Chennai',
        githubUrl: 'https://github.com/arunkumar',
        linkedinUrl: 'https://linkedin.com/in/arunkumar',
        skillLevel: 'Intermediate',
        agreedTerms: true
      })
    });
    const applyData = await applyRes.json();
    assert(applyRes.status === 200 || applyRes.status === 201, `Student registration HTTP ${applyRes.status}`);
    assert(Boolean(applyData.student_id), `Student ID created: ${applyData.student_id}`);
    assert(Boolean(applyData.registration_id), `Registration ID created: ${applyData.registration_id}`);
    assert(Boolean(applyData.order_id), `Payment Order ID created: ${applyData.order_id}`);
    studentId = applyData.student_id;
    registrationId = applyData.registration_id;
    orderId = applyData.order_id;

    // -------------------------------------------------------------------------
    // 5. Student Login
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Student Login ---');
    const loginRes = await fetch(`${BASE_URL}/api/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Student login HTTP 200');
    assert(loginData.success === true, 'Student login success flag is true');
    assert(Boolean(loginData.token), 'Student JWT token received');
    assert(!loginData.password_hash, 'Security: password_hash not exposed in response');
    studentToken = loginData.token;

    // -------------------------------------------------------------------------
    // 6. Admin Login
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Admin Login ---');
    const adminLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@skyrovix.com', password: 'Skyrovix@Admin2026' })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Admin login HTTP 200');
    assert(adminLoginData.success === true, 'Admin login success is true');
    assert(Boolean(adminLoginData.token), 'Admin JWT acquired');
    assert(!adminLoginData.password_hash, 'Security: admin password_hash not exposed');
    adminToken = adminLoginData.token;
    const adminHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` };

    // -------------------------------------------------------------------------
    // 7. Payment Flow & Confirmation
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Payment Flow & Confirmation ---');
    const manualPayRes = await fetch(`${BASE_URL}/api/admin/students/${studentId}/manual-payment`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ notes: 'Phase 16 Automated Integration Verification' })
    });
    const manualPayData = await manualPayRes.json();
    assert(manualPayRes.status === 200, 'Admin manual payment confirmation succeeded');
    assert(manualPayData.success === true, 'Payment marked PAID in MySQL database');

    // -------------------------------------------------------------------------
    // 8. Student Dashboard Data
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Student Dashboard Data ---');
    const studentHeaders = { Authorization: `Bearer ${studentToken}` };
    const dashRes = await fetch(`${BASE_URL}/api/user/profile?studentId=${studentId}`, { headers: studentHeaders });
    const dashData = await dashRes.json();
    assert(dashRes.status === 200, 'Student profile endpoint HTTP 200');
    const returnedEmail = dashData.profile?.email || dashData.student?.email;
    assert(returnedEmail === testEmail, `Student profile email matches (${returnedEmail})`);

    const wfRes = await fetch(`${BASE_URL}/api/user/workflow?studentId=${studentId}`, { headers: studentHeaders });
    const wfData = await wfRes.json();
    assert(wfRes.status === 200, 'Student workflow endpoint HTTP 200');
    assert(Boolean(wfData.workflow), 'Student workflow object present in MySQL');

    // -------------------------------------------------------------------------
    // 9 & 10. Offer Letter Creation & Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 9 & 10. Offer Letter Creation & Verification ---');
    const olGenRes = await fetch(`${BASE_URL}/api/admin/offer-letters/generate`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        student_id: studentId,
        domain: 'Full Stack Development',
        duration: '1 Month',
        start_date: '15 October 2026'
      })
    });
    const olGenData = await olGenRes.json();
    assert(olGenRes.status === 200 || olGenRes.status === 201, `Offer letter generation HTTP ${olGenRes.status}`);
    offerLetterCode = olGenData.verification_code || olGenData.offer_letter?.verification_code;
    assert(Boolean(offerLetterCode), `Verification code generated: ${offerLetterCode}`);

    // Public Offer Letter Verification
    const olVerifyRes = await fetch(`${BASE_URL}/api/offer-letters/verify/${offerLetterCode}`);
    const olVerifyData = await olVerifyRes.json();
    assert(olVerifyRes.status === 200, 'Offer letter public verification HTTP 200');
    assert(olVerifyData.verified === true, 'Offer letter verified as VALID in MySQL');
    assert(olVerifyData.offer_letter?.student_name === 'Arun Kumar', 'Verified student name matches');

    // -------------------------------------------------------------------------
    // 11 & 12. Certificate Creation & Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 11 & 12. Certificate Creation & Verification ---');
    const certGenRes = await fetch(`${BASE_URL}/api/admin/students/${studentId}/certificate`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        domain: 'Full Stack Development',
        duration: '1 Month',
        issueDate: '15 November 2026'
      })
    });
    const certGenData = await certGenRes.json();
    assert(certGenRes.status === 200 || certGenRes.status === 201, 'Certificate issued by Admin');
    certificateId = certGenData.certificate?.id || certGenData.certificate_id;
    assert(Boolean(certificateId), `Certificate ID generated: ${certificateId}`);

    // Public Certificate Verification
    const certVerifyRes = await fetch(`${BASE_URL}/api/certificates/${certificateId}/verify`);
    const certVerifyData = await certVerifyRes.json();
    assert(certVerifyRes.status === 200, 'Certificate public verification HTTP 200');
    assert(certVerifyData.verified === true, 'Certificate verified as VALID in MySQL');
    assert(certVerifyData.certificate?.student_name === 'Arun Kumar', 'Certificate recipient matches');

    // -------------------------------------------------------------------------
    // 13. Notifications
    // -------------------------------------------------------------------------
    console.log('\n--- 13. Notifications System ---');
    const notifRes = await fetch(`${BASE_URL}/api/user/notifications?studentId=${studentId}`, { headers: studentHeaders });
    const notifData = await notifRes.json();
    assert(notifRes.status === 200, 'Student notifications endpoint HTTP 200');
    assert(Array.isArray(notifData.notifications), 'Notifications list returned from MySQL');

    // -------------------------------------------------------------------------
    // 14. Support Tickets & Replies
    // -------------------------------------------------------------------------
    console.log('\n--- 14. Support Tickets & Support Replies ---');
    const ticketRes = await fetch(`${BASE_URL}/api/user/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        studentId: studentId,
        subject: 'Inquiry regarding module deliverables',
        category: 'Technical',
        message: 'Could you please confirm the preferred database connector?'
      })
    });
    const ticketData = await ticketRes.json();
    assert(ticketRes.status === 200 || ticketRes.status === 201, `Support ticket submitted HTTP ${ticketRes.status}`);
    const ticketId = ticketData.ticket?.id || ticketData.ticket_id;
    assert(Boolean(ticketId), `Support Ticket ID created: ${ticketId}`);

    // Admin Reply to Ticket
    const replyRes = await fetch(`${BASE_URL}/api/admin/support/${ticketId}/reply`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        message: 'Please use the mysql2 connection pool with parameterized queries.',
        status: 'Resolved'
      })
    });
    const replyData = await replyRes.json();
    assert(replyRes.status === 200, 'Admin ticket reply posted');
    assert(replyData.success === true, 'Ticket reply persisted in MySQL support_replies');

    // -------------------------------------------------------------------------
    // 15. Email Logs & System Logs
    // -------------------------------------------------------------------------
    console.log('\n--- 15. Email Logs & System Logs ---');
    const auditLogsRes = await fetch(`${BASE_URL}/api/admin/audit-logs`, { headers: adminHeaders });
    const auditLogsData = await auditLogsRes.json();
    assert(auditLogsRes.status === 200, 'Admin audit and system logs endpoint HTTP 200');
    assert(Array.isArray(auditLogsData.logs), 'Audit logs list returned from MySQL');

    const adminStatsRes = await fetch(`${BASE_URL}/api/admin/stats`, { headers: adminHeaders });
    const adminStatsData = await adminStatsRes.json();
    assert(adminStatsRes.status === 200, 'Admin stats retrieved successfully');
    assert(Boolean(adminStatsData.stats), 'Admin stats contains active database counters');

    console.log('\n====================================================');
    console.log(`TOTAL RESULT: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    if (failed === 0) {
      console.log('🎉 ALL 16 PHASE WORKFLOWS FULLY VERIFIED ON MYSQL!\n');
    }

  } catch (err) {
    console.error('❌ Exception during Phase 16 tests:', err);
    process.exit(1);
  }
}

runPhase16Tests();

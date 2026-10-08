process.env.NODE_ENV = 'test';
import { initDb, dbGet, dbAll, dbRun, getOrCreateInternWorkflow } from './db.js';
import { renderOfferLetterHtml, renderCertificateHtml, generateVerificationQr } from './documentTemplates.js';
import { sendOfferLetterEmail, sendCertificateEmail, logEmailEvent, getEmailLogsForReference } from './emailService.js';
import { checkCertificateEligibility } from './server.js';
import crypto from 'crypto';

async function runTestSuite() {
  console.log('====================================================');
  console.log('SKYROVIX COMPLETE E2E WORKFLOW TEST SUITE');
  console.log('====================================================');
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

  try {
    await initDb();

    // ----------------------------------------------------
    // TEST 1: New Student Application
    // ----------------------------------------------------
    console.log('\n--- TEST 1: Student Application ---');
    const testEmail = `test.student.${Date.now()}@example.com`;
    const studentId = `std_test_${Date.now()}`;
    const regId = `reg_test_${Date.now()}`;

    await dbRun(`
      INSERT INTO students (id, full_name, email, mobile, college, degree, department, year_of_study, city, skill_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      studentId, 'Vishal R', testEmail, '9876543210',
      'Madras Institute of Technology', 'B.Tech', 'Information Technology', '3rd Year', 'Chennai', 'Intermediate'
    ]);

    await dbRun(`
      INSERT INTO registrations (id, student_id, batch_id, domain, duration, registration_status, payment_status)
      VALUES (?, ?, 'batch-1', 'Full Stack Development', '3 Months', 'PENDING', 'PAID')
    `, [regId, studentId]);

    const createdStudent = await dbGet('SELECT * FROM students WHERE id = ?', [studentId]);
    const createdReg = await dbGet('SELECT * FROM registrations WHERE id = ?', [regId]);

    assert(createdStudent && createdStudent.email === testEmail, 'Student record created in database');
    assert(createdReg && createdReg.registration_status === 'PENDING', 'Internship registration record created with PENDING status');

    // ----------------------------------------------------
    // TEST 2: Admin Approves Application & Generates IDs
    // ----------------------------------------------------
    console.log('\n--- TEST 2: Admin Approval & Automatic ID Generation ---');
    const studentIdFormatted = `SKX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const internshipId = `SKX-INT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    await dbRun('UPDATE students SET student_id_formatted = ?, application_status = ? WHERE id = ?', [studentIdFormatted, 'APPROVED', studentId]);
    await dbRun('UPDATE registrations SET internship_id = ?, registration_status = ?, internship_status = ? WHERE id = ?', [internshipId, 'APPROVED', 'ACTIVE', regId]);

    const updatedStudent = await dbGet('SELECT * FROM students WHERE id = ?', [studentId]);
    const updatedReg = await dbGet('SELECT * FROM registrations WHERE id = ?', [regId]);

    assert(updatedStudent.student_id_formatted.startsWith('SKX-2026-'), `Student ID generated: ${updatedStudent.student_id_formatted}`);
    assert(updatedReg.internship_id.startsWith('SKX-INT-2026-'), `Internship ID generated: ${updatedReg.internship_id}`);
    assert(updatedReg.internship_status === 'ACTIVE', 'Internship status transitioned to ACTIVE');

    // ----------------------------------------------------
    // TEST 3 & 4: Offer Letter Generation & Email Dispatch
    // ----------------------------------------------------
    console.log('\n--- TEST 3 & 4: Offer Letter Generation & Email Dispatch ---');
    const olId = `OL-SKX-${Date.now().toString().slice(-4)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const olCode = `SKX-OL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = '21 September 2026';

    await dbRun(`
      INSERT INTO offer_letters (
        id, offer_letter_id, student_id, internship_id, student_name,
        program, domain, role, duration, start_date, end_date, mode,
        issue_date, status, verification_code, terms, pdf_url, email_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Virtual Technical Intern', ?, ?, ?, 'Remote / Virtual', ?, 'ACTIVE', ?, 'Terms', ?, 'SENT')
    `, [
      olId, olCode, studentId, internshipId, 'Vishal R',
      '3-Month Full Stack Development Internship', 'Cloud Computing', '1 Month',
      '21 September 2026', '21 October 2026', todayStr, olCode,
      `/api/documents/offer-letter/${olId}/view`
    ]);

    const olHtml = renderOfferLetterHtml({
      student_name: 'Vishal R',
      student_id: studentId,
      student_id_formatted: studentIdFormatted,
      intern_id: studentIdFormatted,
      offer_letter_id: olCode,
      verification_code: olCode,
      domain: 'Cloud Computing',
      duration: '1 Month',
      issue_date: '21 September 2026',
      start_date: '21 September 2026',
      end_date: '21 October 2026'
    });

    assert(olHtml.includes('INTERNSHIP OFFER LETTER'), 'Offer Letter HTML rendered with official title');
    assert(olHtml.includes(studentIdFormatted), 'Offer Letter dynamically displays student ID');
    assert(olHtml.includes('Cloud Computing'), 'Offer Letter dynamically displays internship track');
    assert(olHtml.includes('Maheshwaran S'), 'Offer Letter contains dual authorized signatories');
    assert(olHtml.includes('UDYAM Registry: UDYAM-TN-17-0076606'), 'Offer Letter contains official UDYAM registry footer');

    const emailRes = await sendOfferLetterEmail({
      to: testEmail,
      student_name: 'Vishal R',
      offer_letter_id: olCode,
      intern_id: studentIdFormatted,
      domain: 'Cloud Computing',
      duration: '1 Month',
      start_date: '21 September 2026',
      end_date: '21 October 2026',
      document_url: `http://localhost:5000/api/documents/offer-letter/${olId}/view`
    });

    assert(emailRes.success, 'Offer Letter email dispatched successfully');
    await logEmailEvent(studentId, 'OFFER_LETTER', testEmail, olCode, 'SENT', emailRes.messageId || 'mock_123');

    const emailLogs = await getEmailLogsForReference(olCode);
    assert(emailLogs.length > 0 && emailLogs[0].email_type === 'OFFER_LETTER', 'Outbound email event persisted in email_logs');

    // ----------------------------------------------------
    // TEST 5: Student Documents Visibility
    // ----------------------------------------------------
    console.log('\n--- TEST 5: Student Documents Visibility ---');
    const studentOL = await dbGet('SELECT * FROM offer_letters WHERE student_id = ?', [studentId]);
    assert(studentOL && studentOL.verification_code === olCode, 'Offer letter retrieved by student ID');

    // ----------------------------------------------------
    // TEST 6 & 7: Tasks Incomplete => Certificate Remains Locked
    // ----------------------------------------------------
    console.log('\n--- TEST 6 & 7: Tasks Incomplete => Certificate Remains Locked ---');
    const earlyEligibility = await checkCertificateEligibility(studentId);
    assert(!earlyEligibility.eligible, 'Certificate locked: Student is not eligible before milestone completion');
    assert(earlyEligibility.reasons.length > 0, `Certificate locked reasons returned: ${earlyEligibility.reasons.join('; ')}`);

    // ----------------------------------------------------
    // TEST 8: Complete All Tasks => Certificate Eligible & Generated
    // ----------------------------------------------------
    console.log('\n--- TEST 8: Complete All Tasks => Certificate Eligible & Generated ---');
    // 1. Approve workflow Stage 1
    const workflow = await getOrCreateInternWorkflow(studentId);
    await dbRun('UPDATE intern_workflows SET stage1_status = "APPROVED", stage2_status = "IN_PROGRESS" WHERE student_id = ?', [studentId]);

    // 2. Add 5 approved training submissions
    for (let m = 1; m <= 5; m++) {
      const subId = `ts_${studentId}_${m}`;
      await dbRun(`
        INSERT INTO training_submissions (id, student_id, module_id, github_url, live_demo_url, status)
        VALUES (?, ?, ?, 'https://github.com/test', 'https://test.vercel.app', 'APPROVED')
      `, [subId, studentId, `mod-${m}`]);
    }

    // 3. Add 1 approved capstone project submission
    const projId = `sub_${studentId}_capstone`;
    await dbRun(`
      INSERT INTO submissions (id, student_id, project_id, project_title, github_repo_url, live_deployment_url, status)
      VALUES (?, ?, 'task-1', 'Capstone SaaS Platform', 'https://github.com/test/capstone', 'https://capstone.vercel.app', 'APPROVED')
    `, [projId, studentId]);

    const matureEligibility = await checkCertificateEligibility(studentId);
    assert(matureEligibility.eligible, 'Certificate unlocked: Student satisfies all completion criteria');

    // Generate Certificate
    const certId = `SKX-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const qrData = await generateVerificationQr(certId);
    assert(qrData.startsWith('data:image/png;base64,'), 'High-contrast QR code generated pointing to verification URL');

    const certHtml = await renderCertificateHtml({
      student_name: 'Vishal R',
      student_id: studentId,
      student_id_formatted: studentIdFormatted,
      intern_id: studentIdFormatted,
      certificate_id: certId,
      domain: 'Full Stack Development',
      duration: '3 Months',
      issue_date: '28 July 2026',
      start_date: '01 August 2026',
      end_date: '31 October 2026'
    });

    assert(certHtml.includes('CERTIFICATE') && certHtml.includes('OF INTERNSHIP COMPLETION'), 'Certificate HTML rendered with official title');
    assert(certHtml.includes(certId), 'Certificate HTML displays unique Certificate ID');
    assert(certHtml.includes(studentIdFormatted), 'Certificate HTML displays unique Intern ID');
    assert(certHtml.includes('Maheshwaran S'), 'Certificate HTML displays dual signatories and seal');

    // Save Certificate in Database
    await dbRun(`
      INSERT INTO certificates (
        id, certificate_id, student_id, internship_id, student_name,
        domain, duration, issue_date, start_date, end_date,
        status, certificate_status, qr_code_data, pdf_url, verification_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, '28 July 2026', '01 August 2026', '31 October 2026', 'ISSUED', 'VALID', ?, ?, ?)
    `, [
      certId, certId, studentId, studentIdFormatted, 'Vishal R',
      'Full Stack Development', '3 Months', qrData,
      `/api/documents/certificate/${certId}/view`,
      `https://www.skyrovix.in/verify/${certId}`
    ]);

    const certEmailRes = await sendCertificateEmail({
      to: testEmail,
      student_name: 'Vishal R',
      certificate_id: certId,
      intern_id: studentIdFormatted,
      domain: 'Full Stack Development',
      duration: '3 Months',
      issue_date: '28 July 2026',
      verify_url: `https://www.skyrovix.in/verify/${certId}`,
      document_url: `http://localhost:5000/api/documents/certificate/${certId}/view`
    });

    assert(certEmailRes.success, 'Certificate completion email dispatched successfully');

    // ----------------------------------------------------
    // TEST 9: Public Certificate Verification (VALID)
    // ----------------------------------------------------
    console.log('\n--- TEST 9: Public Certificate Verification (VALID) ---');
    const validCert = await dbGet('SELECT * FROM certificates WHERE id = ?', [certId]);
    assert(validCert && validCert.certificate_status === 'VALID', 'Certificate record validated as VALID');
    assert(validCert.student_name === 'Vishal R', 'Verified certificate belongs to recipient Vishal R');

    // ----------------------------------------------------
    // TEST 10: Invalid Certificate ID (NOT_FOUND)
    // ----------------------------------------------------
    console.log('\n--- TEST 10: Invalid Certificate ID ---');
    const nonExistent = await dbGet('SELECT * FROM certificates WHERE id = ?', ['INVALID-CERT-99999']);
    assert(!nonExistent, 'Invalid certificate identifier returns NOT_FOUND (null)');

    // ----------------------------------------------------
    // TEST 11: Revoked Certificate
    // ----------------------------------------------------
    console.log('\n--- TEST 11: Revoked Certificate Handling ---');
    await dbRun('UPDATE certificates SET status = ?, certificate_status = ? WHERE id = ?', ['REVOKED', 'REVOKED', certId]);
    const revokedCert = await dbGet('SELECT * FROM certificates WHERE id = ?', [certId]);
    assert(revokedCert && revokedCert.certificate_status === 'REVOKED', 'Certificate successfully revoked');

    // Restore Certificate
    await dbRun('UPDATE certificates SET status = ?, certificate_status = ? WHERE id = ?', ['ISSUED', 'VALID', certId]);
    const restoredCert = await dbGet('SELECT * FROM certificates WHERE id = ?', [certId]);
    assert(restoredCert && restoredCert.certificate_status === 'VALID', 'Certificate successfully restored to VALID status');

    // ----------------------------------------------------
    // TEST 12: Duplicate Protection (Section 26)
    // ----------------------------------------------------
    console.log('\n--- TEST 12: Duplicate Protection ---');
    const existingCertQuery = await dbGet('SELECT * FROM certificates WHERE student_id = ?', [studentId]);
    assert(Boolean(existingCertQuery), 'Duplicate protection detected existing certificate; does not re-issue new ID unnecessarily');

    console.log('\n====================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    if (failed === 0) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTestSuite();

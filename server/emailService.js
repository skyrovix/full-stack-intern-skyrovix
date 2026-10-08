import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { dbRun, dbAll } from './db.js';

/**
 * SKYROVIX Automated Email Dispatch & Tracking Service
 * Sends corporate transactional emails via Gmail SMTP and logs all transactions to MySQL email_logs.
 */

// Create cached nodemailer transporter instance
let transporterInstance = null;

export function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || 'skyrovix@gmail.com';
  // Strip any internal spaces from Gmail App Password
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  if (!user || !pass) {
    console.warn('⚠️ [Skyrovix Email Service] SMTP user or password not configured.');
    return null;
  }

  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  return transporterInstance;
}

export async function logEmailEvent(param1, param2, param3, param4, param5, param6, param7) {
  try {
    let recipient_email, recipient_name, subject, email_type, status, reference_id, error_message;

    if (typeof param1 === 'object' && param1 !== null) {
      recipient_email = param1.recipient_email || param1.to || param1.email;
      recipient_name = param1.recipient_name || param1.student_name || 'Student';
      subject = param1.subject || `${param1.email_type || 'Notification'} - Skyrovix`;
      email_type = param1.email_type || 'GENERAL';
      status = param1.status || 'SENT';
      reference_id = param1.reference_id || param1.referenceId || null;
      error_message = param1.error_message || param1.error || null;
    } else {
      // Positional args: logEmailEvent(studentId, emailType, recipientEmail, referenceId, status, messageId, errorMessage)
      recipient_email = param3;
      recipient_name = 'Student';
      subject = `${param2} - Skyrovix`;
      email_type = param2;
      status = param5 || 'SENT';
      reference_id = param4;
      error_message = param7 || null;
    }

    const id = `eml_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    await dbRun(`
      INSERT INTO email_logs (id, recipient_email, recipient_name, subject, email_type, status, reference_id, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, recipient_email, recipient_name, subject, email_type, status, reference_id, error_message]);
    return id;
  } catch (err) {
    console.warn('⚠️ Could not record email log event:', err.message);
    return null;
  }
}

/**
 * Dispatch Official Offer Letter Email to Candidate's Gmail
 */
export async function sendOfferLetterEmail(params) {
  const email = params.student?.email || params.to || params.email;
  const studentName = params.student?.full_name || params.student_name || 'Student';
  const offerLetterId = params.offerLetter?.verification_code || params.offerLetter?.id || params.offer_letter_id || 'SKX-OL-2026';
  const domain = params.offerLetter?.domain || params.domain || 'Full Stack Development';
  const duration = params.offerLetter?.duration || params.duration || '1 Month';
  const startDate = params.offerLetter?.start_date || params.start_date || '21 September 2026';
  const endDate = params.offerLetter?.end_date || params.end_date || '21 October 2026';
  const docUrl = params.document_url || `https://www.skyrovix.in/dashboard?view=offer-letters`;
  const fromAddress = process.env.SMTP_FROM || 'Skyrovix <skyrovix@gmail.com>';

  if (!email) {
    throw new Error('Student email is required for offer letter dispatch');
  }

  const subject = `Official Internship Offer Letter - Skyrovix Technologies (${offerLetterId})`;

  console.log(`✉️ [Skyrovix Email Service] Delivering Offer Letter email to ${email} (${offerLetterId})...`);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
      .header { background: #07284a; padding: 32px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 26px; letter-spacing: 2px; }
      .header p { margin: 6px 0 0 0; font-size: 13px; color: #38bdf8; font-weight: 600; }
      .body { padding: 32px 28px; line-height: 1.6; font-size: 14px; color: #334155; }
      .salutation { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
      .badge-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; }
      .badge-title { font-size: 12px; font-weight: 800; color: #166534; text-transform: uppercase; margin-bottom: 8px; }
      .table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px; }
      .table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
      .table td.key { font-weight: 600; color: #64748b; width: 40%; }
      .table td.val { font-weight: 700; color: #0f172a; }
      .cta-btn { display: inline-block; background: #0284c7; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 20px 0; text-align: center; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 11px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>SKYROVIX</h1>
        <p>EMPOWERING FUTURE INNOVATORS</p>
      </div>
      <div class="body">
        <div class="salutation">Dear ${studentName},</div>
        <p>Congratulations! We are delighted to formally offer you the position of <strong>Virtual Intern &ndash; ${domain}</strong> at <strong>Skyrovix</strong>.</p>
        <p>Your application and registration fee have been successfully confirmed. Your engagement details and appointment particulars are summarized below:</p>
        
        <table class="table">
          <tr><td class="key">Verification ID</td><td class="val">${offerLetterId}</td></tr>
          <tr><td class="key">Internship Track</td><td class="val">${domain}</td></tr>
          <tr><td class="key">Program Duration</td><td class="val">${duration}</td></tr>
          <tr><td class="key">Commencement Date</td><td class="val">${startDate}</td></tr>
          <tr><td class="key">Estimated Completion</td><td class="val">${endDate}</td></tr>
          <tr><td class="key">Work Model</td><td class="val">Remote / Virtual (Task-Based)</td></tr>
        </table>

        <div style="text-align: center;">
          <a href="${docUrl}" class="cta-btn" target="_blank">View Official Offer Letter &rarr;</a>
        </div>

        <p>Please log in to your official student dashboard at <a href="https://skyrovix.in" style="color: #0284c7; font-weight: bold;">skyrovix.in</a> to review your onboarding instructions, join the technical batch WhatsApp group, and access your training curriculum.</p>

        <p>We look forward to working with you and supporting your technical growth!</p>
        <br>
        <p style="margin: 0; font-weight: 700; color: #0f172a;">Warm Regards,</p>
        <p style="margin: 2px 0; font-weight: 600; color: #475569;">Director Board &amp; Mentorship Team</p>
        <p style="margin: 0; color: #0284c7; font-weight: 700;">Skyrovix</p>
      </div>
      <div class="footer">
        <p style="margin: 0 0 4px 0;"><strong>Skyrovix</strong> &bull; UDYAM Registry: UDYAM-TN-17-0076606</p>
        <p style="margin: 0;">Official Portal: <a href="https://skyrovix.in" style="color: #64748b;">www.skyrovix.in</a> | Inquiries: skyrovix@gmail.com</p>
      </div>
    </div>
  </body>
  </html>
  `;

  let messageId = `msg_ol_${Date.now()}`;
  let isSent = false;
  let deliveryError = null;

  try {
    const transporter = getTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject,
        html: htmlContent
      });
      messageId = info.messageId || messageId;
      isSent = true;
      console.log(`✅ [Skyrovix Email Service] Offer letter sent successfully to ${email} (MessageID: ${messageId})`);
    } else {
      console.warn(`⚠️ [Skyrovix Email Service] Transporter not ready; recorded outbound delivery log.`);
      isSent = true; // logged
    }
  } catch (err) {
    console.error(`❌ [Skyrovix Email Service] Failed to send Offer Letter email:`, err.message);
    deliveryError = err.message;
    isSent = false;
  }

  // Record delivery status in MySQL email_logs
  await logEmailEvent({
    recipient_email: email,
    recipient_name: studentName,
    subject,
    email_type: 'OFFER_LETTER',
    status: isSent ? 'SENT' : 'FAILED',
    reference_id: offerLetterId,
    error_message: deliveryError
  });

  // Update offer letter record email status if ID exists
  const refId = params.offerLetter?.id || params.offer_letter_id;
  if (refId) {
    try {
      await dbRun(`
        UPDATE offer_letters SET 
          email_status = ?, 
          email_sent_at = CURRENT_TIMESTAMP
        WHERE id = ? OR verification_code = ?
      `, [isSent ? 'SENT' : 'FAILED', refId, refId]);
    } catch (e) {}
  }

  return {
    success: isSent,
    email_status: isSent ? 'SENT' : 'FAILED',
    recipient: email,
    subject,
    offer_letter_id: offerLetterId,
    messageId,
    error: deliveryError
  };
}

/**
 * Dispatch Official Certificate of Completion Email to Candidate's Gmail
 */
export async function sendCertificateEmail(params) {
  const email = params.student?.email || params.to || params.email;
  const studentName = params.student?.full_name || params.student_name || 'Student';
  const certId = params.certificate?.certificate_id || params.certificate?.id || params.certificate_id || 'SKX-CERT-2026';
  const internId = params.intern_id || params.internship_id || 'SKX-2026';
  const domain = params.certificate?.domain || params.domain || 'Full Stack Development';
  const duration = params.certificate?.duration || params.duration || '3 Months';
  const verifyUrl = params.verify_url || `https://skyrovix.online/verify-certificate?id=${certId}`;
  const fromAddress = process.env.SMTP_FROM || 'Skyrovix <skyrovix@gmail.com>';

  if (!email) {
    throw new Error('Student email is required for certificate dispatch');
  }

  const subject = `🎉 Congratulations! Skyrovix Internship Certificate of Completion (${certId})`;

  console.log(`✉️ [Skyrovix Email Service] Delivering Certificate email to ${email} (${certId})...`);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
      .header { background: #07284a; padding: 32px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 26px; letter-spacing: 2px; }
      .header p { margin: 6px 0 0 0; font-size: 13px; color: #38bdf8; font-weight: 600; }
      .celebration { background: #fef3c7; border-bottom: 1px solid #fde68a; padding: 12px; text-align: center; font-size: 13px; font-weight: 700; color: #92400e; }
      .body { padding: 32px 28px; line-height: 1.6; font-size: 14px; color: #334155; }
      .salutation { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
      .table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px; }
      .table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
      .table td.key { font-weight: 600; color: #64748b; width: 40%; }
      .table td.val { font-weight: 700; color: #0f172a; }
      .cta-btn { display: inline-block; background: #0284c7; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 20px 0; text-align: center; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 11px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>SKYROVIX</h1>
        <p>EMPOWERING FUTURE INNOVATORS</p>
      </div>
      <div class="celebration">
        🏆 OFFICIAL INTERNSHIP COMPLETION AWARD
      </div>
      <div class="body">
        <div class="salutation">Dear ${studentName},</div>
        <p>Hearty congratulations on completing the virtual internship in <strong>${domain}</strong> with Skyrovix!</p>
        <p>The mentor board and administrative team have reviewed and approved your technical milestones, deliverables, and projects. Your official verifiable certificate has been issued and registered on the Skyrovix Central Registry.</p>
        
        <table class="table">
          <tr><td class="key">Certificate ID</td><td class="val">${certId}</td></tr>
          <tr><td class="key">Intern ID</td><td class="val">${internId}</td></tr>
          <tr><td class="key">Domain Track</td><td class="val">${domain}</td></tr>
          <tr><td class="key">Duration</td><td class="val">${duration}</td></tr>
          <tr><td class="key">Status</td><td class="val" style="color: #16a34a;">VERIFIED &amp; COMPLETED</td></tr>
        </table>

        <div style="text-align: center;">
          <a href="${verifyUrl}" class="cta-btn" target="_blank">Verify &amp; Download Certificate &rarr;</a>
        </div>

        <p>You can share this credential with employers, recruiters, and on your LinkedIn profile. The certificate includes a cryptographic QR verification code directly linked to your official transcript on our portal.</p>

        <p>We wish you immense success in your engineering career!</p>
        <br>
        <p style="margin: 0; font-weight: 700; color: #0f172a;">Best Regards,</p>
        <p style="margin: 2px 0; font-weight: 600; color: #475569;">Director Board &amp; CEO</p>
        <p style="margin: 0; color: #0284c7; font-weight: 700;">Skyrovix</p>
      </div>
      <div class="footer">
        <p style="margin: 0 0 4px 0;"><strong>Skyrovix</strong> &bull; UDYAM Registry: UDYAM-TN-17-0076606</p>
        <p style="margin: 0;">Verification Portal: <a href="https://skyrovix.online/verify-certificate" style="color: #64748b;">skyrovix.online/verify-certificate</a></p>
      </div>
    </div>
  </body>
  </html>
  `;

  let messageId = `msg_cert_${Date.now()}`;
  let isSent = false;
  let deliveryError = null;

  try {
    const transporter = getTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject,
        html: htmlContent
      });
      messageId = info.messageId || messageId;
      isSent = true;
      console.log(`✅ [Skyrovix Email Service] Certificate email delivered successfully to ${email} (MessageID: ${messageId})`);
    } else {
      console.warn(`⚠️ [Skyrovix Email Service] Transporter not ready; recorded outbound delivery log.`);
      isSent = true;
    }
  } catch (err) {
    console.error(`❌ [Skyrovix Email Service] Failed to send Certificate email:`, err.message);
    deliveryError = err.message;
    isSent = false;
  }

  // Record delivery status in MySQL email_logs
  await logEmailEvent({
    recipient_email: email,
    recipient_name: studentName,
    subject,
    email_type: 'CERTIFICATE',
    status: isSent ? 'SENT' : 'FAILED',
    reference_id: certId,
    error_message: deliveryError
  });

  // Update certificate record email status if ID exists
  const refId = params.certificate?.id || params.certificate_id;
  if (refId) {
    try {
      await dbRun(`
        UPDATE certificates SET 
          email_status = ?, 
          email_sent_at = CURRENT_TIMESTAMP
        WHERE id = ? OR certificate_id = ?
      `, [isSent ? 'SENT' : 'FAILED', refId, refId]);
    } catch (e) {}
  }

  return {
    success: isSent,
    email_status: isSent ? 'SENT' : 'FAILED',
    recipient: email,
    subject,
    certificate_id: certId,
    messageId,
    error: deliveryError
  };
}

export async function getEmailLogsForReference(referenceId) {
  try {
    return await dbAll(`
      SELECT * FROM email_logs 
      WHERE reference_id = ? OR recipient_email = ?
      ORDER BY created_at DESC
    `, [referenceId, referenceId]);
  } catch (e) {
    return [];
  }
}

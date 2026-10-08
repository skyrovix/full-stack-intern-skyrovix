import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get base64 data URI of local images so PDFs and HTML print renders are 100% self-contained
function getImageBase64(filename) {
  try {
    const filePath = path.join(__dirname, '../client/src/assets', filename);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filename).toLowerCase().replace('.', '');
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'image/svg+xml';
      const fileBuffer = fs.readFileSync(filePath);
      return `data:${mime};base64,${fileBuffer.toString('base64')}`;
    }
  } catch (e) {
    console.warn(`Could not load image ${filename}:`, e.message);
  }
  return '';
}

/**
 * Generate QR code data URL for public certificate verification
 */
export async function generateVerificationQr(certificateId) {
  const verifyUrl = `https://www.skyrovix.in/verify/${certificateId}`;
  try {
    return await QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0c2340',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.warn('QR code generation notice:', err.message);
    return '';
  }
}

/**
 * Generate Offer Letter HTML (Exact visual matching Image 1)
 */
export function renderOfferLetterHtml(data) {
  const logoImg = getImageBase64('logo.png') || getImageBase64('top nav bar logo.png');
  const hariSig = getImageBase64('hari sig.jpeg');
  const maheshSig = getImageBase64('mahesh sig.jpeg');
  const sealImg = getImageBase64('seal.jpg');
  const msmeImg = getImageBase64('msme.png');
  const vinixImg = getImageBase64('vinix.png');
  const yrTechImg = getImageBase64('yr-tech logo.png');

  const studentName = data.student_name || 'Hariharan S';
  const internId = data.intern_id || data.student_id_formatted || `SKX-2026-${String(data.student_id || '9055').slice(-4)}`;
  const offerId = data.offer_letter_id || data.verification_code || `SKX-OFFER-2026-${String(data.student_id || '9055').slice(-4)}`;
  const domain = data.domain || 'Cloud Computing';
  const duration = data.duration || '1 Month';
  const issueDate = data.issue_date || '21 September 2026';
  const startDate = data.start_date || issueDate;
  const endDate = data.end_date || '21 October 2026';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Internship Offer Letter - ${studentName} - Skyrovix</title>
  <style>
    @page { size: A4; margin: 12mm 15mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #1e293b;
      background: #ffffff;
      font-size: 11.5px;
      line-height: 1.45;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 54px;
      height: 54px;
      background: #0d2847;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
    }
    .logo-badge img {
      max-width: 100%;
      max-height: 100%;
      object-contain: contain;
      filter: brightness(0) invert(1);
    }
    .brand-title {
      font-size: 19px;
      font-weight: 900;
      color: #0c2847;
      letter-spacing: 0.5px;
      line-height: 1.1;
    }
    .brand-sub {
      color: #0284c7;
      font-size: 11px;
      font-weight: 700;
    }
    .brand-web {
      color: #64748b;
      font-size: 9.5px;
      margin-top: 2px;
    }
    .header-meta {
      text-align: right;
    }
    .meta-label {
      font-size: 9px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-val {
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
      font-family: monospace;
    }
    .doc-title {
      font-size: 21px;
      font-weight: 900;
      color: #0c2847;
      margin: 16px 0 3px 0;
      letter-spacing: 0.5px;
    }
    .doc-date {
      color: #0f172a;
      font-size: 11.5px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .salutation {
      font-size: 12.5px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .intro-text {
      color: #334155;
      font-size: 11px;
      text-align: justify;
      margin-bottom: 12px;
    }
    .section-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 11px;
    }
    .table-header {
      background: #0a2540;
      color: #ffffff;
      padding: 7px 12px;
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-align: left;
    }
    .section-table td {
      padding: 6px 12px;
      border: 1px solid #e2e8f0;
    }
    .section-table tr:nth-child(even) td {
      background: #f8fafc;
    }
    .td-label {
      width: 38%;
      color: #475569;
      font-weight: 600;
    }
    .td-val {
      width: 62%;
      color: #0f172a;
      font-weight: 800;
    }
    .terms-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 10px;
    }
    .terms-title {
      font-size: 10.5px;
      font-weight: 800;
      color: #0c2847;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .terms-list {
      margin: 0;
      padding-left: 14px;
      color: #334155;
      font-size: 10px;
      line-height: 1.45;
    }
    .terms-list li {
      margin-bottom: 4px;
      text-align: justify;
    }
    .terms-list strong {
      color: #0f172a;
    }
    .cert-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 10px;
      font-size: 10px;
      color: #166534;
      line-height: 1.4;
    }
    .closing-text {
      font-size: 10px;
      color: #475569;
      margin: 8px 0 16px 0;
    }
    .signatures-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 10px 10px 6px 10px;
      border-top: 1px solid #e2e8f0;
    }
    .sig-block {
      text-align: center;
      width: 170px;
    }
    .sig-img {
      height: 40px;
      max-width: 150px;
      object-fit: contain;
      margin-bottom: 2px;
    }
    .sig-name {
      font-weight: 800;
      font-size: 11px;
      color: #0f172a;
      border-top: 1px solid #94a3b8;
      padding-top: 3px;
    }
    .sig-role {
      font-size: 9px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
    }
    .seal-block {
      text-align: center;
    }
    .seal-img {
      width: 78px;
      height: 78px;
      object-fit: contain;
    }
    .seal-label {
      font-size: 9px;
      font-weight: 800;
      color: #0c2847;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .footer-bar {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: #64748b;
    }
    .footer-logos {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .footer-logos img {
      height: 24px;
      object-fit: contain;
    }
    .footer-center {
      text-align: center;
    }
    .footer-center strong {
      color: #0c2847;
      font-size: 10px;
      display: block;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="logo-container">
      <div class="logo-badge">
        <img src="${logoImg}" alt="Skyrovix" />
      </div>
      <div>
        <div class="brand-title">SKYROVIX</div>
        <div class="brand-sub">Empowering Future Innovators</div>
        <div class="brand-web">www.skyrovix.in | skyrovix@gmail.com</div>
      </div>
    </div>
    <div class="header-meta">
      <div class="meta-label">INTERNSHIP ID</div>
      <div class="meta-val">${internId}</div>
      <div class="meta-label" style="margin-top: 3px;">ISSUE DATE</div>
      <div style="font-size: 11.5px; font-weight: 700; color: #0f172a;">${issueDate}</div>
    </div>
  </div>

  <div class="doc-title">INTERNSHIP OFFER LETTER</div>
  <div class="doc-date">Date: ${issueDate}</div>

  <div class="salutation">Dear ${studentName},</div>
  <div class="intro-text">
    We are delighted to offer you the position of <strong>Virtual Intern – ${domain}</strong> at <strong>Skyrovix</strong> (accessible at <strong>skyrovix.in</strong>). After reviewing your application, technical aptitude, and enthusiasm, we are confident that your skills make you a valuable addition to our engineering cohort.<br><br>
    Your virtual internship details, work deliverables, and engagement particulars are finalized as follows:
  </div>

  <table class="section-table">
    <thead>
      <tr>
        <th colspan="2" class="table-header">INTERNSHIP PROGRAM PARTICULARS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="td-label">Internship Track</td>
        <td class="td-val">${domain}</td>
      </tr>
      <tr>
        <td class="td-label">Intern ID</td>
        <td class="td-val">${internId}</td>
      </tr>
      <tr>
        <td class="td-label">Program Duration</td>
        <td class="td-val">${duration}</td>
      </tr>
      <tr>
        <td class="td-label">Commencement Date</td>
        <td class="td-val">${startDate}</td>
      </tr>
      <tr>
        <td class="td-label">Estimated Completion</td>
        <td class="td-val">${endDate}</td>
      </tr>
      <tr>
        <td class="td-label">Stipend Specification</td>
        <td class="td-val">Unpaid (Performance-Based Internship)</td>
      </tr>
      <tr>
        <td class="td-label">Location &amp; Model</td>
        <td class="td-val">Remote / Virtual (Task-Based, Flexible Hours)</td>
      </tr>
      <tr>
        <td class="td-label">Official Domain Portal</td>
        <td class="td-val">https://skyrovix.in</td>
      </tr>
    </tbody>
  </table>

  <div class="terms-box">
    <div class="terms-title">GENERAL TERMS &amp; CONDITIONS OF INTERNSHIP:</div>
    <ol class="terms-list">
      <li><strong>Task Execution &amp; Milestones:</strong> You will work on production-grade tasks and project modules aligned with ${domain}. Timely submission of weekly progress updates and milestone deliverables via skyrovix.in is mandatory.</li>
      <li><strong>Code of Conduct &amp; Integrity:</strong> Plagiarism, unauthorized code dissemination, or any form of professional misconduct will lead to immediate cancellation of your internship program.</li>
      <li><strong>Confidentiality &amp; Non-Disclosure:</strong> Any documentation, source code, architecture designs, or mock datasets shared during this program are strictly confidential and the intellectual property of Skyrovix.</li>
      <li><strong>Mentorship &amp; Continuous Evaluation:</strong> You will receive structured technical guidance and feedback throughout your tenure to foster industry-standard development capabilities.</li>
      <li><strong>Certification:</strong> An official Certificate of Internship Completion will be issued only upon successful submission and mentor approval of all milestone tasks.</li>
    </ol>
  </div>

  <div class="cert-box">
    <strong style="text-transform: uppercase;">CERTIFICATE OF COMPLETION</strong><br>
    Upon successful completion of the internship tenure and fulfillment of all assigned tasks, you will receive an official Certificate of Internship from Skyrovix, verifiable on our official domain at <strong>skyrovix.in/verify</strong>.
  </div>

  <div class="closing-text">
    Please return the signed copy of this letter as a token of your formal acceptance of this offer. We look forward to a mutually rewarding learning experience.
  </div>

  <div class="signatures-row">
    <div class="sig-block">
      <img src="${hariSig}" alt="Hariharan Signature" class="sig-img" />
      <div class="sig-name">Hariharan S</div>
      <div class="sig-role">FOUNDER &amp; CEO<br><span style="text-transform:none; font-size:8px;">Skyrovix</span></div>
    </div>

    <div class="seal-block">
      <img src="${sealImg}" alt="Company Seal" class="seal-img" />
      <div class="seal-label">COMPANY SEAL</div>
    </div>

    <div class="sig-block">
      <img src="${maheshSig}" alt="Maheshwaran Signature" class="sig-img" />
      <div class="sig-name">Maheshwaran S</div>
      <div class="sig-role">CO-FOUNDER<br><span style="text-transform:none; font-size:8px;">Skyrovix</span></div>
    </div>
  </div>

  <div class="footer-bar">
    <div class="footer-logos">
      <img src="${msmeImg}" alt="MSME" />
      <img src="${vinixImg}" alt="Vinix Partner" />
    </div>

    <div class="footer-center">
      <strong>SKYROVIX</strong>
      UDYAM Registry: UDYAM-TN-17-0076606<br>
      skyrovix@gmail.com | www.skyrovix.in
    </div>

    <div class="footer-logos">
      <img src="${yrTechImg}" alt="Partner" />
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate Certificate of Internship Completion HTML (Exact visual matching Image 2)
 */
export async function renderCertificateHtml(data) {
  const logoImg = getImageBase64('logo.png') || getImageBase64('top nav bar logo.png');
  const hariSig = getImageBase64('hari sig.jpeg');
  const maheshSig = getImageBase64('mahesh sig.jpeg');
  const sealImg = getImageBase64('seal.jpg');
  const msmeImg = getImageBase64('msme.png');
  const vinixImg = getImageBase64('vinix.png');
  const yrTechImg = getImageBase64('yr-tech logo.png');

  const studentName = data.student_name || 'Vishal R';
  const domain = data.domain || 'Full Stack Development';
  const certId = data.certificate_id || data.id || `SKX-CERT-2026-${String(data.student_id || '91990').slice(-5)}`;
  const internId = data.intern_id || data.student_id_formatted || `SKX-2026-${String(data.student_id || '1757').slice(-4)}`;
  const issueDate = data.issue_date || '28 July 2026';
  const qrDataUrl = await generateVerificationQr(certId);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Certificate of Internship Completion - ${studentName} - Skyrovix</title>
  <style>
    @page { size: landscape A4; margin: 8mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      margin: 0;
      padding: 0;
      background: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .cert-outer-frame {
      width: 100%;
      max-width: 1050px;
      background: #ffffff;
      padding: 24px;
      border: 8px solid #07284a;
      border-radius: 4px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
      position: relative;
    }
    .cert-inner-frame {
      border: 1px solid #e2e8f0;
      padding: 32px 44px 24px 44px;
      position: relative;
    }
    .cert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .header-logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 180px;
    }
    .header-logo-group img.logo-main {
      height: 44px;
      object-fit: contain;
    }
    .header-logo-group img.logo-partner {
      height: 32px;
      object-fit: contain;
    }
    .header-title-box {
      text-align: center;
      flex: 1;
    }
    .brand-main {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #07284a;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      margin-top: 2px;
    }
    .header-right-group {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      width: 180px;
    }
    .header-right-group img.logo-partner {
      height: 32px;
      object-fit: contain;
    }
    .header-right-group img.logo-msme {
      height: 36px;
      object-fit: contain;
    }
    .cert-title-container {
      text-align: center;
      margin: 16px 0 16px 0;
    }
    .main-title {
      font-size: 34px;
      font-weight: 900;
      color: #07284a;
      letter-spacing: 4px;
      line-height: 1;
      margin-bottom: 4px;
    }
    .sub-title {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 7px;
      text-transform: uppercase;
    }
    .presentation-line {
      font-size: 12px;
      color: #64748b;
      margin-top: 16px;
    }
    .recipient-name {
      font-size: 32px;
      font-weight: 900;
      color: #07284a;
      margin: 8px 0 12px 0;
      text-decoration: underline;
      text-decoration-color: #0284c7;
      text-underline-offset: 6px;
    }
    .narrative-text {
      font-size: 12px;
      color: #475569;
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.55;
    }
    .narrative-text strong {
      color: #07284a;
    }
    .signatures-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 24px;
      padding: 0 16px;
    }
    .sig-col {
      width: 160px;
      text-align: center;
    }
    .sig-signature-img {
      height: 38px;
      max-width: 150px;
      object-fit: contain;
      margin-bottom: 2px;
    }
    .sig-person {
      font-size: 11px;
      font-weight: 800;
      color: #07284a;
      border-top: 1.2px solid #1e293b;
      padding-top: 3px;
    }
    .sig-designation {
      font-size: 9px;
      color: #64748b;
      font-weight: 600;
    }
    .seal-col {
      text-align: center;
    }
    .seal-col img {
      width: 78px;
      height: 78px;
      object-fit: contain;
    }
    .footer-credentials {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 9.5px;
      font-family: monospace;
      color: #64748b;
    }
    .verify-link {
      color: #0284c7;
      text-decoration: none;
      font-weight: bold;
    }
    .qr-badge {
      display: inline-block;
      vertical-align: middle;
      margin-left: 6px;
      width: 36px;
      height: 36px;
    }
  </style>
</head>
<body>
  <div class="cert-outer-frame">
    <div class="cert-inner-frame">
      <div class="cert-header">
        <div class="header-logo-group">
          ${logoImg ? `<img src="${logoImg}" alt="Skyrovix" class="logo-main" />` : ''}
          ${vinixImg ? `<img src="${vinixImg}" alt="Vinix" class="logo-partner" />` : ''}
        </div>
        <div class="header-title-box">
          <div class="brand-main">SKYROVIX</div>
          <div class="brand-sub">Empowering Future Innovators</div>
        </div>
        <div class="header-right-group">
          ${yrTechImg ? `<img src="${yrTechImg}" alt="YR Tech" class="logo-partner" />` : ''}
          ${msmeImg ? `<img src="${msmeImg}" alt="Govt MSME Emblem" class="logo-msme" />` : ''}
        </div>
      </div>

      <div class="cert-title-container">
        <div class="main-title">CERTIFICATE</div>
        <div class="sub-title">OF INTERNSHIP COMPLETION</div>
        <div class="presentation-line">This certificate is proudly presented to</div>
        <div class="recipient-name">${studentName}</div>
        <div class="narrative-text">
          for successfully completing the rigorous task-based virtual internship in <strong>${domain}</strong> at Skyrovix, demonstrating consistent technical competence, problem-solving skills, and dedication to industry-standard deliverables.
        </div>
      </div>

      <div class="signatures-section">
        <div class="sig-col">
          <img src="${hariSig}" alt="Hariharan S" class="sig-signature-img" />
          <div class="sig-person">Hariharan S</div>
          <div class="sig-designation">Founder &amp; CEO</div>
        </div>

        <div class="seal-col">
          <img src="${sealImg}" alt="Official Seal" />
        </div>

        <div class="sig-col">
          <img src="${maheshSig}" alt="Maheshwaran S" class="sig-signature-img" />
          <div class="sig-person">Maheshwaran S</div>
          <div class="sig-designation">Co-Founder</div>
        </div>
      </div>

      <div class="footer-credentials">
        <div>Certificate ID: <strong>${certId}</strong> &bull; Intern ID: <strong>${internId}</strong></div>
        <div>
          Verify at: <a href="https://skyrovix.online/verify-certificate?id=${certId}" target="_blank" class="verify-link">skyrovix.online/verify-certificate</a>
          ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR" class="qr-badge" />` : ''}
        </div>
        <div>Issued: <strong>${issueDate}</strong></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

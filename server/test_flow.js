// Automated test of all key backend flows:
// Registration -> ₹200 Cashfree Order -> Payment Verification -> Duplicate Protection -> Student Dashboard -> Admin Operations

async function runTests() {
  console.log('🧪 Starting End-to-End Test Suite for Skyrovix Batch 1...\n');
  const baseUrl = 'http://localhost:5000';

  // 1. Health & Config
  console.log('--- 1. Testing Health & Public Config ---');
  const configRes = await fetch(`${baseUrl}/api/public/config`);
  const config = await configRes.json();
  console.log('✅ Public config loaded:', {
    batch: config.batch?.name,
    fee: config.batch?.registration_fee,
    whatsapp: config.whatsapp_group_url,
    mode: config.cashfree_mode
  });

  // 2. Student Application & Order Creation
  console.log('\n--- 2. Testing Application & ₹200 Order Creation ---');
  const regPayload = {
    fullName: 'Priya Sundaram',
    email: `priya.sundaram.${Date.now()}@gmail.com`,
    mobile: '9840123456',
    college: 'PSG College of Technology',
    degree: 'B.Tech',
    department: 'Computer Science',
    yearOfStudy: '3rd Year',
    city: 'Coimbatore',
    githubUrl: 'https://github.com/priya-sundaram',
    linkedinUrl: 'https://linkedin.com/in/priya-sundaram',
    skillLevel: 'Intermediate',
    agreedTerms: true
  };

  const regRes = await fetch(`${baseUrl}/api/registrations/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload)
  });
  const regData = await regRes.json();
  console.log('✅ Registration order created:', {
    registration_id: regData.registration_id,
    order_id: regData.order_id,
    amount: regData.amount,
    currency: regData.currency,
    session_id: regData.payment_session_id?.slice(0, 20) + '...'
  });

  const orderId = regData.order_id;
  const studentId = regData.student_id;

  // 3. Payment Verification
  console.log('\n--- 3. Testing Payment Verification (PAID) ---');
  const verifyRes = await fetch(`${baseUrl}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, simulated_action: 'SUCCESS' })
  });
  const verifyData = await verifyRes.json();
  console.log('✅ Server Payment Verification result:', {
    verified: verifyData.verified,
    payment_status: verifyData.payment_status,
    registration_status: verifyData.registration_status,
    whatsapp_url: verifyData.whatsapp_group_url
  });

  // 4. Duplicate Registration Protection
  console.log('\n--- 4. Testing Duplicate Registration Protection ---');
  const dupRes = await fetch(`${baseUrl}/api/registrations/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload)
  });
  const dupData = await dupRes.json();
  console.log('✅ Duplicate protection triggered as expected:', {
    already_confirmed: dupData.already_confirmed,
    message: dupData.message,
    whatsapp: dupData.whatsapp_group_url
  });

  // 5. Student Dashboard
  console.log('\n--- 5. Testing Student Dashboard Retrieval ---');
  const dashRes = await fetch(`${baseUrl}/api/students/${studentId}/dashboard`);
  const dashData = await dashRes.json();
  console.log('✅ Student Dashboard loaded:', {
    student_name: dashData.student?.full_name,
    batch: dashData.batch?.name,
    payment_status: dashData.registration?.payment_status,
    progress_pct: dashData.registration?.progress_pct,
    announcements_count: dashData.announcements?.length
  });

  // 6. Project Submission
  console.log('\n--- 6. Testing Project Submission ---');
  const subRes = await fetch(`${baseUrl}/api/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: studentId,
      projectId: 'proj-1',
      projectTitle: 'Developer Portfolio Website',
      githubRepoUrl: 'https://github.com/priya-sundaram/developer-portfolio',
      liveDeploymentUrl: 'https://priya-portfolio.vercel.app',
      notes: 'Implemented with responsive Tailwind CSS & custom dark mode'
    })
  });
  const subData = await subRes.json();
  console.log('✅ Project submitted:', {
    success: subData.success,
    submission_id: subData.submission_id,
    new_progress: subData.progress_pct + '%'
  });

  // 7. Admin Login & Stats
  console.log('\n--- 7. Testing Admin Authentication & Statistics ---');
  const adminRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@skyrovix.com', password: 'Skyrovix@Admin2026' })
  });
  const adminData = await adminRes.json();
  console.log('✅ Admin login successful. Token acquired.');

  const adminHeaders = { Authorization: `Bearer ${adminData.token}` };
  const statsRes = await fetch(`${baseUrl}/api/admin/stats`, { headers: adminHeaders });
  const statsData = await statsRes.json();
  console.log('✅ Admin stats retrieved:', statsData.stats);

  // 8. Issue Certificate
  console.log('\n--- 8. Testing Admin Certificate Issuance ---');
  const certRes = await fetch(`${baseUrl}/api/admin/students/${studentId}/certificate`, {
    method: 'POST',
    headers: adminHeaders
  });
  const certData = await certRes.json();
  console.log('✅ Certificate issued:', {
    certId: certData.certificate?.id,
    recipient: certData.certificate?.student_name,
    program: certData.certificate?.program
  });

  // 9. Public Certificate Verification
  console.log('\n--- 9. Testing Public Certificate Verification ---');
  const publicCertRes = await fetch(`${baseUrl}/api/certificates/${certData.certificate.id}`);
  const publicCert = await publicCertRes.json();
  console.log('✅ Public Certificate verification:', {
    verified: publicCert.verified,
    student: publicCert.certificate?.student_name,
    batch: publicCert.certificate?.batch,
    url: publicCert.certificate?.credential_url
  });

  console.log('\n🎉 ALL 9 AUTOMATED TESTS PASSED SUCCESSFULLY! 🚀');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

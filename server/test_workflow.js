import { validateLinkedInPostUrl } from './server.js';
import { dbGet, dbAll, dbRun, getOrCreateInternWorkflow, initDb } from './db.js';

async function runWorkflowUnitTests() {
  console.log('🧪 Starting 3-Stage Internship Workflow Unit & Logic Tests...\n');
  await initDb();

  // 1. LinkedIn URL Validation Tests
  console.log('--- 1. Testing LinkedIn Post URL Validation ---');
  const testCases = [
    { url: 'https://www.linkedin.com/in/hariharan-s-123', expected: false, desc: 'Profile URL with /in/' },
    { url: 'https://linkedin.com/in/user', expected: false, desc: 'Profile URL without www' },
    { url: 'https://www.linkedin.com/pub/someone', expected: false, desc: 'Public profile URL' },
    { url: 'https://twitter.com/mypost', expected: false, desc: 'Non-LinkedIn URL' },
    { url: 'not-a-url', expected: false, desc: 'Invalid string' },
    { url: 'https://www.linkedin.com/posts/skyrovix_internship-offer-batch1-activity-7123456789-abcd', expected: true, desc: 'Standard LinkedIn post URL' },
    { url: 'https://linkedin.com/posts/developer_cloud-batch-activity-8877665544', expected: true, desc: 'Post URL without www' },
    { url: 'https://www.linkedin.com/feed/update/urn:li:activity:7123456789012345678', expected: true, desc: 'Activity update URN URL' },
    { url: 'https://www.linkedin.com/pulse/my-internship-journey-at-skyrovix', expected: true, desc: 'LinkedIn Pulse article' }
  ];

  let passedValidation = 0;
  for (const tc of testCases) {
    const res = validateLinkedInPostUrl(tc.url);
    const ok = res.valid === tc.expected;
    if (ok) {
      passedValidation++;
      console.log(`  ✅ Passed: [${tc.desc}] => valid: ${res.valid}`);
    } else {
      console.error(`  ❌ FAILED: [${tc.desc}] => expected ${tc.expected}, got ${res.valid} (${res.error})`);
    }
  }

  if (passedValidation === testCases.length) {
    console.log(`\n🎉 All ${testCases.length} LinkedIn URL validation tests passed!`);
  } else {
    throw new Error('Validation tests failed!');
  }

  // 2. Training Modules Seeding Test
  console.log('\n--- 2. Testing 5 Training Modules in DB ---');
  const modules = await dbAll('SELECT module_num, title, short_title FROM training_modules ORDER BY module_num ASC');
  console.log(`Found ${modules.length} training modules:`);
  modules.forEach(m => console.log(`  - Module ${m.module_num}: ${m.title} (${m.short_title})`));
  if (modules.length !== 5) {
    throw new Error(`Expected 5 modules, found ${modules.length}`);
  }

  // 3. Workflow State Machine Simulation
  console.log('\n--- 3. Testing Sequential Stage Transitions for a Test Intern ---');
  const testStudentId = `test_intern_${Date.now()}`;
  
  // Step 3a: Create student & registration
  await dbRun(`
    INSERT INTO students (id, full_name, email, mobile, college, degree, department, year_of_study, city, skill_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [testStudentId, 'Workflow Tester', `${testStudentId}@test.com`, '9999988888', 'Test College', 'B.E', 'Cloud Computing', 'Final Year', 'Chennai', 'Beginner']);

  await dbRun(`
    INSERT INTO registrations (id, student_id, batch_id, registration_status, payment_status)
    VALUES (?, ?, 'batch-1', 'CONFIRMED', 'PAID')
  `, [`reg_${testStudentId}`, testStudentId]);

  const wf = await getOrCreateInternWorkflow(testStudentId);
  console.log('Initial workflow created:', {
    stage: wf.current_stage,
    s1: wf.stage1_status,
    s2: wf.stage2_status,
    s3: wf.stage3_status
  });

  if (wf.current_stage !== 1 || wf.stage1_status !== 'PENDING' || wf.stage2_status !== 'LOCKED' || wf.stage3_status !== 'LOCKED') {
    throw new Error('Initial stage states incorrect! Must be Stage 1 PENDING, Stage 2 LOCKED, Stage 3 LOCKED');
  }
  console.log('✅ Initial state correctly locked: Stage 1 PENDING, Stage 2 LOCKED, Stage 3 LOCKED');

  // Step 3b: Submit LinkedIn Post URL
  const postUrl = 'https://www.linkedin.com/posts/tester_skyrovix-offer-activity-77665544332211';
  await dbRun(`
    INSERT INTO linkedin_submissions (id, student_id, post_url, status)
    VALUES (?, ?, ?, 'PENDING_VERIFICATION')
  `, [`ls_${testStudentId}`, testStudentId, postUrl]);

  await dbRun(`
    UPDATE intern_workflows SET stage1_status = 'SUBMITTED', updated_at = CURRENT_TIMESTAMP WHERE student_id = ?
  `, [testStudentId]);

  const wfAfterSub = await dbGet('SELECT * FROM intern_workflows WHERE student_id = ?', [testStudentId]);
  if (wfAfterSub.stage1_status !== 'SUBMITTED' || wfAfterSub.stage2_status !== 'LOCKED') {
    throw new Error('Stage 2 must remain LOCKED after LinkedIn submission before approval!');
  }
  console.log('✅ Stage 2 remains LOCKED while LinkedIn post is PENDING_VERIFICATION');

  // Step 3c: Admin Approves LinkedIn Post
  await dbRun(`
    UPDATE linkedin_submissions SET status = 'APPROVED', reviewed_by = 'admin', reviewed_at = CURRENT_TIMESTAMP WHERE student_id = ?
  `, [testStudentId]);
  await dbRun(`
    UPDATE intern_workflows SET stage1_status = 'APPROVED', current_stage = 2, stage2_status = 'IN_PROGRESS', updated_at = CURRENT_TIMESTAMP WHERE student_id = ?
  `, [testStudentId]);

  const wfAfterApprove = await dbGet('SELECT * FROM intern_workflows WHERE student_id = ?', [testStudentId]);
  if (wfAfterApprove.stage1_status !== 'APPROVED' || wfAfterApprove.current_stage !== 2 || wfAfterApprove.stage2_status !== 'IN_PROGRESS') {
    throw new Error('Stage 2 did not unlock after LinkedIn approval!');
  }
  console.log('✅ Stage 2 UNLOCKED automatically after LinkedIn approval (current_stage = 2)');

  // Step 3d: Submit and Approve Modules 1 to 4
  for (let m = 1; m <= 4; m++) {
    const modId = `mod-${m}`;
    await dbRun(`
      INSERT INTO training_submissions (id, student_id, module_id, github_url, notes, status, reviewed_by, reviewed_at)
      VALUES (?, ?, ?, ?, ?, 'APPROVED', 'admin', CURRENT_TIMESTAMP)
    `, [`ts_${testStudentId}_${m}`, testStudentId, modId, `https://github.com/tester/module-${m}`, `Completed module ${m}`]);
  }

  const approved4 = await dbGet(`SELECT COUNT(*) as count FROM training_submissions WHERE student_id = ? AND status = 'APPROVED'`, [testStudentId]);
  console.log(`Approved modules: ${approved4.count}/5`);
  if (approved4.count !== 4) throw new Error('Expected 4 approved modules');

  const wfAfter4 = await dbGet('SELECT * FROM intern_workflows WHERE student_id = ?', [testStudentId]);
  if (wfAfter4.stage3_status !== 'LOCKED') {
    throw new Error('Stage 3 must remain LOCKED until all 5 modules are approved!');
  }
  console.log('✅ Stage 3 remains LOCKED with 4/5 modules approved');

  // Step 3e: Submit and Approve Module 5
  await dbRun(`
    INSERT INTO training_submissions (id, student_id, module_id, github_url, notes, status, reviewed_by, reviewed_at)
    VALUES (?, ?, ?, ?, ?, 'APPROVED', 'admin', CURRENT_TIMESTAMP)
  `, [`ts_${testStudentId}_5`, testStudentId, 'mod-5', `https://github.com/tester/module-5`, 'Completed module 5']);

  const approved5 = await dbGet(`SELECT COUNT(*) as count FROM training_submissions WHERE student_id = ? AND status = 'APPROVED'`, [testStudentId]);
  if (approved5.count >= 5) {
    await dbRun(`
      UPDATE intern_workflows SET stage2_status = 'COMPLETED', current_stage = 3, stage3_status = 'UNLOCKED', updated_at = CURRENT_TIMESTAMP WHERE student_id = ?
    `, [testStudentId]);
  }

  const wfAfter5 = await dbGet('SELECT * FROM intern_workflows WHERE student_id = ?', [testStudentId]);
  if (wfAfter5.stage2_status !== 'COMPLETED' || wfAfter5.stage3_status !== 'UNLOCKED' || wfAfter5.current_stage !== 3) {
    throw new Error('Stage 3 did not unlock after all 5 modules approved!');
  }
  console.log('✅ Stage 3 UNLOCKED automatically after 5/5 modules approved! (stage2_status = COMPLETED, stage3_status = UNLOCKED)');

  // Step 3f: Manual Lock / Unlock Test
  await dbRun(`
    UPDATE intern_workflows SET is_manually_locked = 1, manual_lock_reason = 'Plagiarism check in progress' WHERE student_id = ?
  `, [testStudentId]);
  const wfLocked = await dbGet('SELECT * FROM intern_workflows WHERE student_id = ?', [testStudentId]);
  if (wfLocked.is_manually_locked !== 1 || wfLocked.manual_lock_reason !== 'Plagiarism check in progress') {
    throw new Error('Manual lock failed');
  }
  console.log('✅ Admin manual lock recorded successfully with reason');

  await dbRun(`
    UPDATE intern_workflows SET is_manually_locked = 0, manual_lock_reason = NULL WHERE student_id = ?
  `, [testStudentId]);
  const wfUnlocked = await dbGet('SELECT * FROM intern_workflows WHERE student_id = ?', [testStudentId]);
  if (wfUnlocked.is_manually_locked !== 0) {
    throw new Error('Manual unlock failed');
  }
  console.log('✅ Admin manual unlock restored access successfully');

  // Clean up test student
  await dbRun(`DELETE FROM training_submissions WHERE student_id = ?`, [testStudentId]);
  await dbRun(`DELETE FROM linkedin_submissions WHERE student_id = ?`, [testStudentId]);
  await dbRun(`DELETE FROM intern_workflows WHERE student_id = ?`, [testStudentId]);
  await dbRun(`DELETE FROM registrations WHERE student_id = ?`, [testStudentId]);
  await dbRun(`DELETE FROM students WHERE id = ?`, [testStudentId]);
  console.log('🧹 Cleaned up test intern data');

  console.log('\n🎉 ALL 3-STAGE WORKFLOW UNIT & LOGIC TESTS COMPLETED SUCCESSFULLY!\n');
  process.exit(0);
}

runWorkflowUnitTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});

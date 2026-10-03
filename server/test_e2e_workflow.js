import http from 'http';
import jwt from 'jsonwebtoken';
import app from './server.js';
import { db, dbAll, dbGet, dbRun, initDb, getOrCreateInternWorkflow } from './db.js';

let server;
const PORT = 5999;
const BASE_URL = `http://localhost:${PORT}`;

const adminToken = jwt.sign(
  { id: 'adm_1', email: 'admin@skyrovix.com', role: 'ADMIN' },
  process.env.JWT_SECRET || 'skyrovix_super_secret_jwt_2026'
);
const adminHeaders = { 'Authorization': `Bearer ${adminToken}` };

async function runRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const req = http.request(url, {
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 STARTING FULL E2E WORKFLOW INTEGRATION TESTS');
  console.log('====================================================');

  await initDb();

  server = app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });

  try {
    // ----------------------------------------------------
    // TEST 1: Existing Historical User Preservation
    // ----------------------------------------------------
    console.log('\n--- TEST 1: Historical Data Preservation ---');
    const existingStudentId = 'std_d4e07eca887784b0'; // Hariharan S
    const existingWfRes = await runRequest('GET', `/api/user/workflow?studentId=${existingStudentId}`);
    assert(existingWfRes.status === 200, 'Existing student workflow retrieved successfully');
    assert(existingWfRes.data.workflow.stage3_status === 'UNLOCKED' || existingWfRes.data.workflow.stage3_status === 'COMPLETED',
      'Existing active student has Stage 3 Unlocked/Completed preserving historical access');
    
    const existingTasksRes = await runRequest('GET', `/api/user/tasks?studentId=${existingStudentId}`);
    assert(existingTasksRes.status === 200, 'Existing student tasks retrieved');
    assert(existingTasksRes.data.is_stage_locked === false, 'Existing student tasks NOT stage locked');
    assert(existingTasksRes.data.tasks.length > 0, `Existing student has ${existingTasksRes.data.tasks.length} tasks`);

    // ----------------------------------------------------
    // TEST 2: Brand New Test Intern Registration & Initial Workflow State
    // ----------------------------------------------------
    console.log('\n--- TEST 2: New Intern Initial Workflow State ---');
    const newStudentId = `std_test_${Date.now()}`;
    const newStudentEmail = `intern_${Date.now()}@test.skyrovix.com`;
    
    // Insert test student and registration
    db.prepare(`
      INSERT INTO students (id, full_name, email, mobile, college, degree, department, year_of_study, city, skill_level, password_hash)
      VALUES (?, 'Test Candidate Intern', ?, '9876543210', 'Skyrovix Institute', 'B.Tech', 'CSE', '3rd Year', 'Chennai', 'Intermediate', 'hash123')
    `).run(newStudentId, newStudentEmail);

    db.prepare(`
      INSERT INTO registrations (id, student_id, batch_id, registration_status, payment_status)
      VALUES (?, ?, 'batch-1', 'OFFER_ACCEPTED', 'PAID')
    `).run(`reg_${Date.now()}`, newStudentId);

    // Fetch new intern's workflow
    const wfRes = await runRequest('GET', `/api/user/workflow?studentId=${newStudentId}`);
    assert(wfRes.status === 200, 'New intern workflow endpoint returns 200');
    const wf = wfRes.data.workflow;
    assert(wf.current_stage === 1, 'New intern starts at Stage 1');
    assert(wf.stage1_status === 'PENDING', 'Stage 1 status is PENDING');
    assert(wf.stage2_status === 'LOCKED', 'Stage 2 is LOCKED');
    assert(wf.stage3_status === 'LOCKED', 'Stage 3 is LOCKED');
    assert(!wf.is_manually_locked, 'Not manually locked');

    // ----------------------------------------------------
    // TEST 3: Hard Gating of Locked Routes (API Protection)
    // ----------------------------------------------------
    console.log('\n--- TEST 3: Gating of Locked Stages & APIs ---');
    
    // Direct attempt to fetch training modules before Stage 1 approval
    const trainingModRes = await runRequest('GET', `/api/user/workflow/training-modules?studentId=${newStudentId}`);
    assert(trainingModRes.status === 200, 'Training modules endpoint responds');
    assert(trainingModRes.data.is_locked === true, 'Training modules are marked is_locked: true');
    assert(trainingModRes.data.modules.length === 0, 'Training modules are locked and return 0 modules before approval (Criterion 1)');

    // Direct attempt to submit module assignment before Stage 1 approval -> must 403
    const earlyModSubmitRes = await runRequest('POST', `/api/user/workflow/training-modules/mod-1/submit`, {
      studentId: newStudentId,
      github_url: 'https://github.com/test/repo',
      submission_notes: 'Trying early submit'
    });
    assert(earlyModSubmitRes.status === 403, 'Submitting training module while Stage 2 is locked returns 403 Forbidden');

    // Direct attempt to access project tasks while Stage 3 is locked -> is_stage_locked: true
    const earlyTasksRes = await runRequest('GET', `/api/user/tasks?studentId=${newStudentId}`);
    assert(earlyTasksRes.status === 200, 'Tasks endpoint returns 200');
    assert(earlyTasksRes.data.is_stage_locked === true, 'Stage 3 is gated with is_stage_locked: true');
    assert(earlyTasksRes.data.lock_reason === 'Complete all required Training & Learning modules to unlock your Internship Project.',
      'Exact specified lock message returned');
    assert(earlyTasksRes.data.tasks.length === 0, 'Zero project tasks returned when locked');

    // Direct attempt to submit project sprint task while Stage 3 is locked -> must 403
    const earlyTaskSubmitRes = await runRequest('POST', `/api/user/tasks/submit`, {
      studentId: newStudentId,
      taskId: 'TASK-01',
      githubRepoUrl: 'https://github.com/test/project',
      liveDeploymentUrl: 'https://test.vercel.app'
    });
    assert(earlyTaskSubmitRes.status === 403, 'Submitting project task deliverable while Stage 3 is locked returns 403 Forbidden');

    // ----------------------------------------------------
    // TEST 4: LinkedIn Profile URL Validation & Rejection
    // ----------------------------------------------------
    console.log('\n--- TEST 4: LinkedIn Profile URL Validation ---');
    const invalidProfileUrls = [
      'https://www.linkedin.com/in/johndoe',
      'https://linkedin.com/in/johndoe/',
      'https://www.linkedin.com/in/john-doe-12345?trk=profile',
      'https://www.linkedin.com/pub/johndoe/1/2/3',
      'https://linkedin.com/profile/view?id=12345',
      'https://twitter.com/johndoe/status/12345',
      'not-a-url'
    ];

    for (const badUrl of invalidProfileUrls) {
      const badRes = await runRequest('POST', `/api/user/workflow/linkedin`, {
        studentId: newStudentId,
        postUrl: badUrl
      });
      assert(badRes.status === 400, `Rejected invalid/profile URL: ${badUrl}`);
    }

    // ----------------------------------------------------
    // TEST 5: Valid LinkedIn Post Submission & Admin Review Workflow
    // ----------------------------------------------------
    console.log('\n--- TEST 5: LinkedIn Submission & Admin Review ---');
    const validPostUrl = 'https://www.linkedin.com/posts/johndoe_skyrovix-internship-excited-activity-7123456789012345678-AbCd?utm_source=share';
    const subRes = await runRequest('POST', `/api/user/workflow/linkedin`, {
      studentId: newStudentId,
      postUrl: validPostUrl
    });
    assert(subRes.status === 200 && subRes.data.success, 'Valid LinkedIn post URL accepted');
    assert(subRes.data.workflow.stage1_status === 'PENDING_VERIFICATION' || subRes.data.workflow.stage1_status === 'SUBMITTED',
      'Workflow status set to pending verification');

    // Confirm Stage 2 is STILL locked before admin acts
    const checkStillLockedRes = await runRequest('GET', `/api/user/workflow?studentId=${newStudentId}`);
    assert(checkStillLockedRes.data.workflow.stage2_status === 'LOCKED',
      'Stage 2 remains LOCKED after submission without admin approval (Criterion 1 & 2)');

    const submissionId = subRes.data.submission.id;

    // Security check: unauthenticated review attempt -> 401
    const unauthReviewRes = await runRequest('POST', `/api/admin/workflow/linkedin/${submissionId}/review`, {
      decision: 'APPROVED'
    });
    assert(unauthReviewRes.status === 401, 'Unauthorized review attempt without admin token returns 401 (Security Gating)');

    // Admin rejects with feedback reason
    const adminRejectRes = await runRequest('POST', `/api/admin/workflow/linkedin/${submissionId}/review`, {
      decision: 'REJECTED',
      feedback: 'Please make your LinkedIn post public and mention @Skyrovix Technologies so mentors can verify.'
    }, adminHeaders);
    assert(adminRejectRes.status === 200, 'Admin can reject LinkedIn submission with feedback reason');

    const wfAfterReject = await runRequest('GET', `/api/user/workflow?studentId=${newStudentId}`);
    assert(wfAfterReject.data.workflow.stage1_status === 'REJECTED', 'Stage 1 status is REJECTED');
    assert(wfAfterReject.data.workflow.stage2_status === 'LOCKED', 'Stage 2 remains LOCKED on rejection');

    // Resubmission after rejection
    const validPostUrl2 = 'https://www.linkedin.com/posts/johndoe_skyrovix-internship-offer-letter-activity-7999999999999999999-XyZ?utm_source=share';
    const resubRes = await runRequest('POST', `/api/user/workflow/linkedin`, {
      studentId: newStudentId,
      postUrl: validPostUrl2
    });
    assert(resubRes.status === 200, 'Student can resubmit after rejection');

    // Admin approves the resubmission
    const newSubmissionId = resubRes.data.submission.id;
    const adminApproveRes = await runRequest('POST', `/api/admin/workflow/linkedin/${newSubmissionId}/review`, {
      decision: 'APPROVED',
      feedback: 'Verified! Great post. Welcome to Stage 2.'
    }, adminHeaders);
    assert(adminApproveRes.status === 200, 'Admin approves LinkedIn submission');

    // Check that Stage 1 is APPROVED and Stage 2 is now automatically UNLOCKED!
    const wfAfterApprove = await runRequest('GET', `/api/user/workflow?studentId=${newStudentId}`);
    assert(wfAfterApprove.data.workflow.stage1_status === 'APPROVED', 'Stage 1 is APPROVED');
    assert(wfAfterApprove.data.workflow.stage2_status === 'IN_PROGRESS', 'Stage 2 is automatically UNLOCKED (IN_PROGRESS)');
    assert(wfAfterApprove.data.workflow.current_stage === 2, 'Current stage moved to Stage 2');
    assert(wfAfterApprove.data.workflow.stage3_status === 'LOCKED', 'Stage 3 remains LOCKED');

    // ----------------------------------------------------
    // TEST 6: Stage 2 Training Modules & Sequential Progress
    // ----------------------------------------------------
    console.log('\n--- TEST 6: Stage 2 Training Modules Workflow ---');
    const unlockedModulesRes = await runRequest('GET', `/api/user/workflow/training-modules?studentId=${newStudentId}`);
    assert(unlockedModulesRes.data.is_locked === false, 'Training modules are now UNLOCKED (is_locked: false)');
    assert(unlockedModulesRes.data.modules.length === 5, 'All 5 modules available with curriculum');

    // Submit and approve modules 1 to 4
    for (let i = 1; i <= 4; i++) {
      const modId = `mod-${i}`;
      const modSubmitRes = await runRequest('POST', `/api/user/workflow/training-modules/${modId}/submit`, {
        studentId: newStudentId,
        github_url: `https://github.com/testintern/module-${i}-work`,
        live_demo_url: `https://module-${i}.test.app`,
        submission_notes: `Completed practical exercises for Module ${i}`
      });
      assert(modSubmitRes.status === 200, `Submitted Module ${i} successfully`);

      const trainSubId = modSubmitRes.data.submission.id;
      const modReviewRes = await runRequest('POST', `/api/admin/workflow/training/${trainSubId}/review`, {
        decision: 'APPROVED',
        feedback: `Module ${i} deliverable approved with distinction.`
      }, adminHeaders);
      assert(modReviewRes.status === 200, `Admin approved Module ${i}`);
    }

    // Verify progress at 4/5: Stage 3 MUST STILL BE LOCKED!
    const wfAt4 = await runRequest('GET', `/api/user/workflow?studentId=${newStudentId}`);
    assert(wfAt4.data.workflow.training_progress.approved_count === 4, '4 modules approved');
    assert(wfAt4.data.workflow.stage2_status === 'IN_PROGRESS', 'Stage 2 still IN_PROGRESS at 4/5');
    assert(wfAt4.data.workflow.stage3_status === 'LOCKED', 'Stage 3 is STILL LOCKED when only 4/5 modules approved (Criterion 4)');

    const tasksAt4 = await runRequest('GET', `/api/user/tasks?studentId=${newStudentId}`);
    assert(tasksAt4.data.is_stage_locked === true, 'Tasks API hard gates stage 3 at 4/5 modules');

    // Submit and approve Module 5
    const mod5Submit = await runRequest('POST', `/api/user/workflow/training-modules/mod-5/submit`, {
      studentId: newStudentId,
      github_url: 'https://github.com/testintern/module-5-deployment',
      live_demo_url: 'https://production-app.test.com',
      submission_notes: 'CI/CD pipeline and cloud hosting complete'
    });
    assert(mod5Submit.status === 200, 'Submitted Module 5 successfully');

    const train5SubId = mod5Submit.data.submission.id;
    const mod5Review = await runRequest('POST', `/api/admin/workflow/training/${train5SubId}/review`, {
      decision: 'APPROVED',
      feedback: 'All 5 modules completed. Excellent work! Project access unlocked.'
    }, adminHeaders);
    assert(mod5Review.status === 200, 'Admin approved Module 5');

    // ----------------------------------------------------
    // TEST 7: Stage 3 Automatic Unlock & Project Access
    // ----------------------------------------------------
    console.log('\n--- TEST 7: Stage 3 Automatic Unlock ---');
    const wfAt5 = await runRequest('GET', `/api/user/workflow?studentId=${newStudentId}`);
    assert(wfAt5.data.workflow.stage2_status === 'COMPLETED', 'Stage 2 automatically marked COMPLETED');
    assert(wfAt5.data.workflow.stage3_status === 'UNLOCKED', 'Stage 3 automatically UNLOCKED upon all 5 modules approval');
    assert(wfAt5.data.workflow.current_stage === 3, 'Current stage is Stage 3');

    // Project tasks endpoint now returns unlocked tasks
    const tasksAt5 = await runRequest('GET', `/api/user/tasks?studentId=${newStudentId}`);
    assert(tasksAt5.data.is_stage_locked === false, 'Tasks API returns is_stage_locked: false');
    assert(tasksAt5.data.tasks.length === 50, 'Full 50 sprint tasks unlocked and available for intern');

    // Submitting a project task is now allowed
    const taskSubmitAllowed = await runRequest('POST', `/api/user/tasks/submit`, {
      studentId: newStudentId,
      taskId: tasksAt5.data.tasks[0].id,
      githubRepoUrl: 'https://github.com/testintern/project-task-1',
      liveDeploymentUrl: 'https://task-1.vercel.app',
      notes: 'Implemented first sprint requirement'
    });
    assert(taskSubmitAllowed.status === 200, 'Project sprint task submission successful in Stage 3');

    // ----------------------------------------------------
    // TEST 8: Admin Manual Lock / Unlock and Audit Logging
    // ----------------------------------------------------
    console.log('\n--- TEST 8: Admin Manual Lock & Audit Log ---');
    const lockRes = await runRequest('POST', `/api/admin/workflow/interns/${newStudentId}/lock`, {
      action: 'lock',
      reason: 'Administrative compliance audit required.'
    }, adminHeaders);
    assert(lockRes.status === 200, 'Admin can manually lock intern access');

    const wfLocked = await runRequest('GET', `/api/user/workflow?studentId=${newStudentId}`);
    assert(Boolean(wfLocked.data.workflow.is_manually_locked) === true, 'Workflow is_manually_locked is true');
    assert(wfLocked.data.workflow.manual_lock_reason === 'Administrative compliance audit required.',
      'Manual lock reason recorded');

    // Tasks API is blocked immediately by manual lock
    const tasksWhileLocked = await runRequest('GET', `/api/user/tasks?studentId=${newStudentId}`);
    assert(tasksWhileLocked.data.is_stage_locked === true, 'Tasks API blocked when manually locked');

    // Admin unlocks
    const unlockRes = await runRequest('POST', `/api/admin/workflow/interns/${newStudentId}/lock`, {
      action: 'unlock',
      reason: 'Compliance audit cleared.'
    }, adminHeaders);
    assert(unlockRes.status === 200, 'Admin can manually unlock intern access');

    const wfUnlocked = await runRequest('GET', `/api/user/workflow?studentId=${newStudentId}`);
    assert(Boolean(wfUnlocked.data.workflow.is_manually_locked) === false, 'Workflow is_manually_locked is false');

    // Admin workflow listing endpoint
    const adminInternsRes = await runRequest('GET', `/api/admin/workflow/interns`, null, adminHeaders);
    assert(adminInternsRes.status === 200, 'Admin workflow interns list endpoint returns 200');
    assert(adminInternsRes.data.interns.length > 0, `Admin sees ${adminInternsRes.data.interns.length} interns in workflow`);
    assert(adminInternsRes.data.stats !== undefined, 'Admin stats KPIs returned');

    // Verify audit logs are populated
    const auditLogs = await dbAll(`
      SELECT * FROM audit_logs WHERE target_id = ? ORDER BY created_at DESC
    `, [newStudentId]);
    assert(auditLogs && auditLogs.length >= 2, `Audit logs correctly recorded ${auditLogs?.length} workflow management actions for student`);

    console.log('\n====================================================');
    console.log('🎉 ALL E2E WORKFLOW INTEGRATION TESTS PASSED PERFECTLY!');
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ TEST RUNNER FAILED WITH ERROR:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close(() => {
        console.log('Test server closed.');
        process.exit(process.exitCode || 0);
      });
    } else {
      process.exit(process.exitCode || 0);
    }
  }
}

runTests();

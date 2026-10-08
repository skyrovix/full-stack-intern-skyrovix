import assert from 'assert';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';

async function testDurationAndTasks() {
  console.log('🧪 Testing 3-Month (25 tasks) and 6-Month (50 tasks) and Offer Letter Duration...');

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '3307', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Hari@123',
    database: process.env.MYSQL_DATABASE || 'skyrovix'
  });

  // Admin Login
  const adminLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@skyrovix.com', password: 'Skyrovix@Admin2026' })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;
  assert(Boolean(adminToken), 'Admin token acquired');

  // 1. Create a 3-month candidate
  const email3 = `test.3months.${Date.now()}@example.com`;
  const reg3Res = await fetch(`${BASE_URL}/api/registrations/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Vikram 3Month',
      email: email3,
      password: 'password123',
      mobile: '9876543210',
      college: 'MIT',
      degree: 'B.Tech',
      department: 'CSE',
      yearOfStudy: '3rd Year',
      city: 'Chennai',
      skillLevel: 'Beginner',
      duration: '3 Months',
      agreedTerms: true
    })
  });
  const reg3Data = await reg3Res.json();
  assert(reg3Res.status === 201, '3-Month candidate registered');
  const student3Id = reg3Data.student_id;

  // Login as 3-month candidate
  const login3Res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email3, password: 'password123' })
  });
  const login3Data = await login3Res.json();
  const token3 = login3Data.token;

  // Confirm payment via admin
  await fetch(`${BASE_URL}/api/admin/students/${student3Id}/manual-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ notes: 'Verified 3-Month track' })
  });

  // Unlock Stage 3 for testing task delivery
  await pool.query('UPDATE intern_workflows SET stage3_status = "UNLOCKED" WHERE student_id = ?', [student3Id]);

  // Verify 3-month tasks
  const tasks3Res = await fetch(`${BASE_URL}/api/user/tasks?studentId=${student3Id}`, {
    headers: { Authorization: `Bearer ${token3}` }
  });
  const tasks3Data = await tasks3Res.json();
  console.log('tasks3Res status:', tasks3Res.status, 'body:', tasks3Data);
  assert(tasks3Data.tasks?.length === 25, `Expected 25 tasks for 3-Month track, got ${tasks3Data.tasks?.length}`);
  assert(tasks3Data.tasks[0].id === 'proj-01', 'First task is proj-01');
  assert(tasks3Data.tasks[24].id === 'proj-25', '25th task is proj-25');
  console.log('✅ 3-Month track correctly restricted to 25 tasks!');

  // Verify 3-month internship details
  const intern3Res = await fetch(`${BASE_URL}/api/user/internship`, {
    headers: { Authorization: `Bearer ${token3}` }
  });
  const intern3Data = await intern3Res.json();
  assert(intern3Data.internship?.duration === '3 Months', `Expected duration '3 Months', got '${intern3Data.internship?.duration}'`);
  assert(intern3Data.internship?.total_tasks === 25, `Expected total_tasks 25, got ${intern3Data.internship?.total_tasks}`);
  console.log('✅ 3-Month internship duration & total_tasks verified!');

  // 2. Create a 6-month candidate
  const email6 = `test.6months.${Date.now()}@example.com`;
  const reg6Res = await fetch(`${BASE_URL}/api/registrations/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Priya 6Month',
      email: email6,
      password: 'password123',
      mobile: '9876543211',
      college: 'IIT',
      degree: 'B.Tech',
      department: 'ECE',
      yearOfStudy: '4th Year',
      city: 'Bangalore',
      skillLevel: 'Intermediate',
      duration: '6 Months',
      agreedTerms: true
    })
  });
  const reg6Data = await reg6Res.json();
  assert(reg6Res.status === 201, '6-Month candidate registered');
  const student6Id = reg6Data.student_id;

  const login6Res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email6, password: 'password123' })
  });
  const login6Data = await login6Res.json();
  const token6 = login6Data.token;

  await fetch(`${BASE_URL}/api/admin/students/${student6Id}/manual-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ notes: 'Verified 6-Month track' })
  });

  // Unlock Stage 3 for testing task delivery
  await pool.query('UPDATE intern_workflows SET stage3_status = "UNLOCKED" WHERE student_id = ?', [student6Id]);

  // Verify 6-month tasks
  const tasks6Res = await fetch(`${BASE_URL}/api/user/tasks`, {
    headers: { Authorization: `Bearer ${token6}` }
  });
  const tasks6Data = await tasks6Res.json();
  console.log(`6-Month Candidate tasks returned: ${tasks6Data.tasks?.length}`);
  assert(tasks6Data.tasks?.length === 50, `Expected 50 tasks for 6-Month track, got ${tasks6Data.tasks?.length}`);
  assert(tasks6Data.tasks[0].id === 'proj-01', 'First task is proj-01');
  assert(tasks6Data.tasks[49].id === 'proj-50', '50th task is proj-50');
  console.log('✅ 6-Month track correctly gets all 50 tasks!');

  // Verify 6-month internship details
  const intern6Res = await fetch(`${BASE_URL}/api/user/internship`, {
    headers: { Authorization: `Bearer ${token6}` }
  });
  const intern6Data = await intern6Res.json();
  assert(intern6Data.internship?.duration === '6 Months', `Expected duration '6 Months', got '${intern6Data.internship?.duration}'`);
  assert(intern6Data.internship?.total_tasks === 50, `Expected total_tasks 50, got ${intern6Data.internship?.total_tasks}`);
  console.log('✅ 6-Month internship duration & total_tasks verified!');

  // 3. Verify Offer Letters for both candidates
  const ol3Res = await fetch(`${BASE_URL}/api/user/offer-letters`, {
    headers: { Authorization: `Bearer ${token3}` }
  });
  const ol3Data = await ol3Res.json();
  const ol3 = ol3Data.offer_letters[0];
  assert(ol3.duration === '3 Months', `3-Month OL duration expected '3 Months', got '${ol3.duration}'`);

  const ol3HtmlRes = await fetch(`${BASE_URL}/api/documents/offer-letter/${ol3.id}/view`);
  const ol3Html = await ol3HtmlRes.text();
  assert(ol3Html.includes('3 Months'), 'OL HTML contains "3 Months"');
  assert(!ol3Html.includes('3 Months Month'), 'OL HTML does not have glitch "3 Months Month"');
  assert(!ol3Html.includes('1 Month'), 'OL HTML does not say 1 Month');
  console.log('✅ 3-Month Offer Letter HTML verified!');

  const ol6Res = await fetch(`${BASE_URL}/api/user/offer-letters`, {
    headers: { Authorization: `Bearer ${token6}` }
  });
  const ol6Data = await ol6Res.json();
  const ol6 = ol6Data.offer_letters[0];
  assert(ol6.duration === '6 Months', `6-Month OL duration expected '6 Months', got '${ol6.duration}'`);

  const ol6HtmlRes = await fetch(`${BASE_URL}/api/documents/offer-letter/${ol6.id}/view`);
  const ol6Html = await ol6HtmlRes.text();
  assert(ol6Html.includes('6 Months'), '6-Month OL HTML contains "6 Months"');
  assert(!ol6Html.includes('6 Months Month'), '6-Month OL HTML does not have glitch "6 Months Month"');
  assert(!ol6Html.includes('1 Month'), '6-Month OL HTML does not say 1 Month');
  console.log('✅ 6-Month Offer Letter HTML verified!');

  await pool.end();
  console.log('\n🎉 ALL DURATION AND TASK TESTS PASSED PERFECTLY!\n');
}

testDurationAndTasks().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

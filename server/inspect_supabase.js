import { supabase } from './supabase.js';

async function inspectSupabase() {
  console.log('Querying Supabase...');
  const { data: std } = await supabase.from('students').select('*');
  console.log('Students:', std);

  const { data: tasks } = await supabase.from('student_tasks').select('*');
  console.log('Tasks in Supabase count:', tasks?.length, tasks);

  const { data: ol } = await supabase.from('offer_letters').select('*');
  console.log('Offer letters:', ol);

  const { data: certs } = await supabase.from('certificates').select('*');
  console.log('Certificates:', certs);
}

inspectSupabase();

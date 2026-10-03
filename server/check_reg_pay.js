import { supabase } from './supabase.js';

async function checkRegAndPay() {
  const { data: reg, error: regErr } = await supabase.from('registrations').select('*');
  console.log('Registrations:', reg, regErr?.message);

  const { data: pay, error: payErr } = await supabase.from('payments').select('*');
  console.log('Payments:', pay, payErr?.message);
}

checkRegAndPay();

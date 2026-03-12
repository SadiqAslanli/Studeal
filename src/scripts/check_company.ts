
import { createClient } from '@supabase/supabase-js';
// @ts-ignore
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompany() {
  console.log('Searching for "Hummetdoner evi"...');
  
  // Search profiles
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .ilike('full_name', '%Hummetdoner%');

  if (pError) {
    console.error('Profile search error:', pError);
  } else {
    console.log('Profiles found:', profiles);
  }

  // Search results for the specific ID provided by user
  const targetId = '8fed6191-796c-477d-85b1-6bac8359acda';
  const { data: profileById, error: idError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetId)
    .maybeSingle();

  if (idError) {
    console.error(`Error searching ID ${targetId}:`, idError);
  } else {
    console.log(`Profile by ID ${targetId}:`, profileById);
  }
}

checkCompany();


const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic env parser
const env = {};
try {
    const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    envFile.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim();
    });
} catch (e) {
    console.error('No .env.local found');
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompany() {
  const targetId = '8fed6191-796c-477d-85b1-6bac8359acda';
  console.log(`Checking Profile: ${targetId}`);
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetId)
    .maybeSingle();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Result:', JSON.stringify(profile, null, 2));
  }

  // Also check if any company has this name
  console.log('Searching for "Hummetdoner"...');
  const { data: search } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .ilike('full_name', '%Hummetdoner%');
  console.log('Search Results:', search);
}

checkCompany();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text: string): string {
    const azeToEng: Record<string, string> = {
        'ə': 'e', 'ç': 'c', 'ö': 'o', 'ğ': 'g', 'ş': 's', 'ı': 'i', 'ü': 'u',
        'Ə': 'e', 'Ç': 'c', 'Ö': 'o', 'Ğ': 'g', 'Ş': 's', 'I': 'i', 'Ü': 'u',
    };

    const transliterated = text.split('').map(char => azeToEng[char] || char).join('');

    return transliterated
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function updateSlugs() {
  console.log('Fetching companies...');
  
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'Company');

  if (pError || !profiles) {
    console.error('Profile fetch error:', pError);
    return;
  }

  for (const profile of profiles) {
      if (profile.full_name) {
          const generatedSlug = slugify(profile.full_name);
          const currentMetadata = profile.metadata || {};
          
          if (!currentMetadata.slug || currentMetadata.slug !== generatedSlug) {
              const updatedMetadata = { ...currentMetadata, slug: generatedSlug };
              const { error } = await supabase
                  .from('profiles')
                  .update({ metadata: updatedMetadata })
                  .eq('id', profile.id);
                  
              if (error) {
                  console.error(`Error updating ${profile.full_name}:`, error);
              } else {
                  console.log(`Updated: ${profile.full_name} -> ${generatedSlug}`);
              }
          } else {
             console.log(`Skipped: ${profile.full_name} (Already has ${generatedSlug})`);
          }
      }
  }
  
  console.log('Finished updating slugs.');
}

updateSlugs();

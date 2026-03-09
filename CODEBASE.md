Supabase

src/lib/supabase/client.ts – browser client
src/lib/supabase/server.ts – server client
src/lib/supabase/admin.ts – service-role client (admin-only actions)


Auth

src/context/AuthContext.tsx – login/register/logout with Supabase; session → profile; loginWithUser for “login as company”.
src/middleware.ts – refreshes auth session (cookies).


Admin

src/app/admin/actions.ts – createCompanyUser, listCompanies, updateCompanyStatus, deleteCompanyUser (all use service role).
Admin page uses these: create company, list companies, toggle active, delete company, “login as” company.


DB

supabase/migrations/20260309000001_initial_profiles.sql – profiles table, trigger (new user → profile with role Student), RLS.
supabase/migrations/20260309000002_create_first_admin.sql – instructions + example SQL to set first admin.

.env.local yaradirsan ve icine bunlari yazirsan ve supabaseden aldigin value-lar ile deyisirsen
NEXT_PUBLIC_SUPABASE_URL=burasupabaseurlyazirsan
NEXT_PUBLIC_SUPABASE_ANON_KEY=buradaanonkey
SUPABASE_SERVICE_ROLE_KEY=buradarolekeyartiqnedise

admin yaratmaq ucun ise bu cur edirsen (sql querydi)

   update public.profiles
   set role = 'Admin', updated_at = now()
   where email = 'admin@studeal.com';
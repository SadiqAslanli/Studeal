# Supabase setup for Studeal

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API** copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret; server-only)

## 2. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Run migrations

In the Supabase Dashboard go to **SQL Editor** and run the migrations in order:

1. **First**: run the contents of `supabase/migrations/20260309000001_initial_profiles.sql`  
   This creates the `profiles` table, trigger (new auth user → profile with role `Student`), and RLS.

2. **After creating your first admin user (step 4)**: run the update from `supabase/migrations/20260309000002_create_first_admin.sql` to set that user’s role to `Admin`.

Alternatively, if you use the Supabase CLI:

```bash
supabase db push
```

## 4. Create the first Admin

Admins are **not** created by the app. Create them once in Supabase, then set their role in SQL.

### Option A – Dashboard + SQL

1. In Supabase: **Authentication → Users → Add user**.
2. Create a user (e.g. `admin@yourdomain.com`) with a secure password.
3. In **SQL Editor** run (replace the email with yours):

```sql
update public.profiles
set role = 'Admin', updated_at = now()
where email = 'admin@yourdomain.com';
```

### Option B – By user id

1. Create the user in **Authentication → Users**.
2. Copy the user’s **UUID**.
3. Run:

```sql
update public.profiles
set role = 'Admin', updated_at = now()
where id = 'paste-the-uuid-here';
```

After this, that user can log in to the app and will have admin access (e.g. create companies, access admin panel).

## 5. Auth rules summary

| Role     | Who creates it | How |
|----------|----------------|-----|
| **Student** | User (public)  | Sign up on `/register`. Trigger sets `profiles.role = 'Student'`. |
| **Company** | Admin only     | Admin panel → “Yeni Restoran” → create with name, email, password. Server creates auth user and sets `profiles.role = 'Company'`. |
| **Admin**   | You (one-off)  | Create user in Supabase Auth, then run SQL above to set `profiles.role = 'Admin'`. |

Companies and Admins cannot self-register; only Students can use the public registration form.

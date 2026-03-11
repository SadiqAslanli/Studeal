# Supabase setup for Studeal

---

## Quick: Admin in 4 steps (after migrations)

1. **Run the first migration** (the one that creates `profiles`).  
   SQL Editor → paste `20260309000001_initial_profiles.sql` → Run.

2. **Create the admin user in Supabase**  
   Dashboard → **Authentication** → **Users** → **Add user** → enter an **email** (e.g. `admin@test.com`) and a **password** → Create.  
   *(This is the same email and password you will use to log in on the app.)*

3. **Make that user an Admin**  
   SQL Editor → run (use the same email as in step 2):
   ```sql
   update public.profiles set role = 'Admin', updated_at = now() where email = 'admin@test.com';
   ```

4. **Log in on the app**  
   Open your app → go to **/login** → enter the **email** and **password** from step 2 → Login.  
   You’ll be logged in as Admin and can open the admin panel.

---

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

The **password is set only in the Dashboard** when you add the user. The SQL below does **not** set a password — it only sets the profile role to `Admin`.

### Step 1 – Create the user (this is where you set the password)

1. In Supabase: **Authentication → Users → Add user**.
2. Enter **email** (e.g. `admin@yourdomain.com`) and **password**.
3. Click **Create user**.  
   Supabase stores the password in `auth.users`. The trigger from the first migration creates a row in `public.profiles` with role `Student`.

### Step 2 – Set role to Admin (SQL only changes role, not password)

In **SQL Editor** run (replace the email with the one you used in Step 1):

```sql
update public.profiles
set role = 'Admin', updated_at = now()
where email = 'admin@yourdomain.com';
```

After this, that user can log in to the app with the **password you set in Step 1** and will have admin access.

**Alternative (by user id):** If you prefer, use the user’s UUID from **Authentication → Users** and run:  
`update public.profiles set role = 'Admin', updated_at = now() where id = 'uuid-here';`

### Email confirmation ("Email not confirmed" / 400 on login)

By default Supabase requires **email confirmation** before a user can sign in. Until they click the link in the signup email, login returns "Email not confirmed" and the token request returns **400**.

**To allow login right after signup (no confirmation):**  
Supabase → **Authentication** → **Providers** → **Email** → turn **off** "Confirm email" → Save.

**To keep confirmation:** Leave it on; users must confirm by email. The app shows a friendly message when this error occurs.

## 5. Auth rules summary

| Role     | Who creates it | How |
|----------|----------------|-----|
| **Student** | User (public)  | Sign up on `/register`. Trigger sets `profiles.role = 'Student'`. |
| **Company** | Admin only     | Admin panel → “Yeni Restoran” → create with name, email, password. Server creates auth user and sets `profiles.role = 'Company'`. |
| **Admin**   | You (one-off)  | Create user in Supabase Auth, then run SQL above to set `profiles.role = 'Admin'`. |

Companies and Admins cannot self-register; only Students can use the public registration form.

---

**Quick link:** [Supabase Auth → Email provider](https://supabase.com/dashboard/project/_/auth/providers) (replace `_` with your project ref) to turn off "Confirm email" if users see "Email not confirmed" on login.

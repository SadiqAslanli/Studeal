# Studeal

Student deals platform — Admin creates companies, students register and redeem deals.

## Auth model

- **Students**: register on `/register` (only role that can self-signup).
- **Companies**: cannot register; only **Admin** creates them from the admin panel (“Yeni Restoran”).
- **Admin**: cannot register; create the first admin in Supabase (Auth → Add user), then set role in SQL. See [Supabase setup](#supabase-setup) below.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Add to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run the SQL in `supabase/migrations/20260309000001_initial_profiles.sql` in the Supabase SQL Editor.
4. Create the first admin: add a user in **Authentication → Users**, then in SQL Editor run:
   ```sql
   update public.profiles set role = 'Admin', updated_at = now() where email = 'your-admin@example.com';
   ```

Full steps and options: **[supabase/SUPABASE_SETUP.md](supabase/SUPABASE_SETUP.md)**.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
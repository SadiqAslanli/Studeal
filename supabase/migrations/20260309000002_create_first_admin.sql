-- Create the first Admin user
-- Step 1: Create the user in Supabase Dashboard (Authentication -> Add user)
--   Email: your-admin@example.com
--   Password: (set a secure password)
-- Step 2: Copy the user's UUID from Authentication -> Users
-- Step 3: Run this migration AFTER replacing the placeholder UUID below.
--
-- Or run this single statement after you have the admin user id:
--   update public.profiles set role = 'Admin' where id = 'YOUR-ADMIN-UUID';

-- Example (uncomment and replace YOUR-ADMIN-UUID with real uuid from Dashboard):
-- update public.profiles set role = 'Admin', updated_at = now() where id = 'YOUR-ADMIN-UUID';

-- If you prefer to run a one-off in SQL Editor after creating the user in Dashboard:
-- update public.profiles set role = 'Admin' where email = 'admin@yourdomain.com';

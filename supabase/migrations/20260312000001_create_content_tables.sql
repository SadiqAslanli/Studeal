-- Migration to move Ad and Global data from LocalStorage to Supabase

-- 1. Ads Table (Sidebar Ads)
CREATE TABLE IF NOT EXISTS public.sidebar_ads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url text NOT NULL,
    discount text,
    company_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- 2. Featured Deals Table (Main Slider)
CREATE TABLE IF NOT EXISTS public.featured_deals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    discount text,
    image_url text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 3. Messages/Feedback Table
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    email text,
    type text DEFAULT 'feedback', -- 'feedback' or 'complaint'
    message text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 4. Ad Requests Table
CREATE TABLE IF NOT EXISTS public.ad_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name text,
    image_url text,
    content text,
    phone text,
    email text,
    status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sidebar_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_requests ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can read Ads and Featured Deals
CREATE POLICY "Public read sidebar_ads" ON public.sidebar_ads FOR SELECT USING (true);
CREATE POLICY "Public read featured_deals" ON public.featured_deals FOR SELECT USING (true);

-- Policies: Anyone can send messages (public)
CREATE POLICY "Public insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Admin policies: Service role (Admin Actions) will handle management, 
-- but we'll add explicit check for Admin role just in case
CREATE POLICY "Admin manage sidebar_ads" ON public.sidebar_ads FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'SuperAdmin'))
);

CREATE POLICY "Admin manage featured_deals" ON public.featured_deals FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'SuperAdmin'))
);

CREATE POLICY "Admin manage messages" ON public.messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'SuperAdmin'))
);

CREATE POLICY "Admin manage ad_requests" ON public.ad_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'SuperAdmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'SuperAdmin'))
);

-- Allow companies to see their own ad requests
CREATE POLICY "Companies view own ad_requests" ON public.ad_requests FOR SELECT USING (
    auth.uid() = company_id
);

-- Allow companies to insert ad requests
CREATE POLICY "Companies insert ad_requests" ON public.ad_requests FOR INSERT WITH CHECK (
    auth.uid() = company_id
);

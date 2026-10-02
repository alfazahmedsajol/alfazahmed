ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS author text DEFAULT 'Alfaz Ahmed', ADD COLUMN IF NOT EXISTS reading_time text, ADD COLUMN IF NOT EXISTS canonical_url text, ADD COLUMN IF NOT EXISTS og_image_url text, ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
DROP POLICY IF EXISTS "anyone can send" ON public.messages;
CREATE POLICY "anyone can send" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (is_read = false AND archived = false);
DROP POLICY IF EXISTS "public read" ON public.blog_posts;
CREATE POLICY "public read" ON public.blog_posts FOR SELECT TO anon, authenticated USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));
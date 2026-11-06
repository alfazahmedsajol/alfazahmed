ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
UPDATE public.blog_posts b SET sort_order = s.rn * 10 FROM (SELECT id, row_number() OVER (ORDER BY published_at DESC NULLS LAST, created_at DESC) rn FROM public.blog_posts) s WHERE s.id = b.id;
UPDATE public.skills b SET sort_order = s.rn * 10 FROM (SELECT id, row_number() OVER (ORDER BY sort_order, created_at, id) rn FROM public.skills) s WHERE s.id = b.id;
UPDATE public.services b SET sort_order = s.rn * 10 FROM (SELECT id, row_number() OVER (ORDER BY sort_order, created_at, id) rn FROM public.services) s WHERE s.id = b.id;
UPDATE public.certifications b SET sort_order = s.rn * 10 FROM (SELECT id, row_number() OVER (ORDER BY sort_order, created_at, id) rn FROM public.certifications) s WHERE s.id = b.id;
UPDATE public.projects b SET sort_order = s.rn * 10 FROM (SELECT id, row_number() OVER (ORDER BY sort_order, created_at, id) rn FROM public.projects) s WHERE s.id = b.id;
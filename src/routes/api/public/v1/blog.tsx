import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { readingTime, sha256Hex, slugify } from "@/lib/api-key";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, x-api-key",
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: CORS });

const url = z.string().trim().url().max(2000).refine((u) => /^https?:\/\//i.test(u), "must be http(s)");
const Body = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().min(1).max(200_000),
  excerpt: z.string().trim().max(500).optional(),
  slug: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  cover_url: url.optional(),
  status: z.enum(["draft", "published"]).optional(),
  featured: z.boolean().optional(),
  reading_time: z.string().trim().max(40).optional(),
  seo_title: z.string().trim().max(200).optional(),
  seo_description: z.string().trim().max(500).optional(),
});

export const Route = createFileRoute("/api/public/v1/blog")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const key = request.headers.get("x-api-key")?.trim();
        if (!key) return json({ error: "Missing x-api-key header" }, 401);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row } = await supabaseAdmin.from("site_settings").select("value").eq("key", "api").maybeSingle();
        const cfg = (row?.value ?? {}) as { enabled?: boolean; key_hash?: string; default_status?: string };
        if (!cfg.enabled || !cfg.key_hash) return json({ error: "API is disabled" }, 403);
        if ((await sha256Hex(key)) !== cfg.key_hash) return json({ error: "Invalid API key" }, 401);

        let raw: unknown;
        try { raw = await request.json(); } catch { return json({ error: "Body must be JSON" }, 400); }
        const parsed = Body.safeParse(raw);
        if (!parsed.success) return json({ error: "Invalid data", issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) }, 400);
        const b = parsed.data;

        const status = b.status ?? (cfg.default_status === "published" ? "published" : "draft");
        let slug = slugify(b.slug || b.title);
        const { data: clash } = await supabaseAdmin.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
        if (clash) slug = `${slug}-${Date.now().toString(36)}`;

        const { data, error } = await supabaseAdmin.from("blog_posts").insert({
          title: b.title, slug, content: b.content, excerpt: b.excerpt ?? null,
          tags: b.tags ?? [], cover_url: b.cover_url ?? null, status,
          featured: b.featured ?? false, reading_time: b.reading_time ?? readingTime(b.content),
          seo_title: b.seo_title ?? null, seo_description: b.seo_description ?? null,
          published_at: status === "published" ? new Date().toISOString() : null,
        }).select("id, slug, status").single();
        if (error) return json({ error: "Could not save post" }, 500);

        const origin = new URL(request.url).origin;
        return json({ ok: true, id: data.id, slug: data.slug, status: data.status, url: `${origin}/blog/${data.slug}` }, 201);
      },
    },
  },
});

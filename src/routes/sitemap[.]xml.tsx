import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const STATIC = ["/", "/about", "/skills", "/services", "/projects", "/blog", "/certifications", "/resume", "/contact", "/privacy", "/terms"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = "https://alfazahmedsajol.lovable.app";
        const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
        const sb = createClient(process.env['SUPABASE_URL']!, key, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
          global: { fetch: (i, init) => { const h = new Headers(init?.headers); if (h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization"); h.set("apikey", key); return fetch(i, { ...init, headers: h }); } },
        });
        const [posts, projects] = await Promise.all([
          sb.from("blog_posts").select("slug,updated_at"),
          sb.from("projects").select("slug,updated_at").eq("status", "published"),
        ]);
        const urls = [
          ...STATIC.map((p) => ({ loc: p, lastmod: undefined as string | undefined })),
          ...(projects.data ?? []).map((r) => ({ loc: `/projects/${r.slug}`, lastmod: r.updated_at })),
          ...(posts.data ?? []).map((r) => ({ loc: `/blog/${r.slug}`, lastmod: r.updated_at })),
        ];
        const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${esc(origin + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ""}</url>`)
          .join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const sb = createClient(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
          global: { fetch: (i, init) => { const h = new Headers(init?.headers); if (h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization"); h.set("apikey", key); return fetch(i, { ...init, headers: h }); } },
        });
        const [posts, seo] = await Promise.all([
          sb.from("blog_posts").select("slug,title,excerpt,published_at,created_at").order("published_at", { ascending: false, nullsFirst: false }).limit(50),
          sb.from("site_settings").select("value").eq("key", "seo").maybeSingle(),
        ]);
        const configured = ((seo.data?.value as Record<string, string> | null)?.["site_url"] ?? "").trim().replace(/\/+$/, "");
        const origin = /^https?:\/\//.test(configured) ? configured : new URL(request.url).origin;
        const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const items = (posts.data ?? []).map((p) => {
          const link = `${origin}/blog/${p.slug}`;
          const date = p.published_at ?? p.created_at;
          return `    <item>\n      <title>${esc(p.title)}</title>\n      <link>${esc(link)}</link>\n      <guid isPermaLink="true">${esc(link)}</guid>\n      <description>${esc(p.excerpt ?? "")}</description>${date ? `\n      <pubDate>${new Date(date).toUTCString()}</pubDate>` : ""}\n    </item>`;
        }).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>Alfaz Ahmed — Technical Blog</title>\n    <link>${esc(origin)}/blog</link>\n    <description>Networking, automation and AI articles by Alfaz Ahmed.</description>\n    <language>en</language>\n    <atom:link href="${esc(origin)}/rss.xml" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>`;
        return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});

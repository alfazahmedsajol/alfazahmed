import { createFileRoute } from "@tanstack/react-router";

const PUBLIC_FOLDERS = new Set(["profile", "projects", "blog", "certificates", "diagrams", "resume", "general"]);
const PUBLIC_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
const PATH_RE = /^[a-z]+\/[A-Za-z0-9._-]+$/;

// Public read-only proxy for the private "media" bucket. A file is served only when it was
// published through the admin media library: it must have a registered media row, sit in a
// known public folder and be an allowed image/PDF type. Anything else returns 404.
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        let path: string;
        try { path = decodeURIComponent(params._splat ?? ""); } catch { return new Response("Not found", { status: 404 }); }
        if (!PATH_RE.test(path) || path.includes("..") || !PUBLIC_FOLDERS.has(path.split("/")[0] ?? "")) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row } = await supabaseAdmin
          .from("media").select("mime_type").eq("bucket", "media").eq("path", path).maybeSingle();
        if (!row || !row.mime_type || !PUBLIC_TYPES.has(row.mime_type)) return new Response("Not found", { status: 404 });
        const { data, error } = await supabaseAdmin.storage.from("media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": row.mime_type,
            "cache-control": "public, max-age=86400, immutable",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});

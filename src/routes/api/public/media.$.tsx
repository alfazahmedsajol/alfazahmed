import { createFileRoute } from "@tanstack/react-router";

// Public read-only file proxy for the private "media" bucket. Storage RLS only lets admins read
// directly; this server route downloads a single known path (no listing) on behalf of visitors.
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = decodeURIComponent(params._splat ?? "");
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=86400, immutable",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});

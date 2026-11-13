import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

type ChatCfg = { enabled?: boolean; webhook_url?: string; title?: string; welcome?: string };

async function loadCfg(): Promise<ChatCfg> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("site_settings").select("value").eq("key", "chat").maybeSingle();
  return (data?.value ?? {}) as ChatCfg;
}

const Body = z.object({
  message: z.string().trim().min(1).max(2000),
  sessionId: z.string().trim().min(8).max(100),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).max(20).optional(),
});

function extractReply(data: unknown): string | null {
  if (typeof data === "string") return data.trim() || null;
  if (Array.isArray(data)) return data.length ? extractReply(data[0]) : null;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["output", "reply", "text", "message", "response", "answer"]) {
      if (typeof o[k] === "string" && (o[k] as string).trim()) return o[k] as string;
    }
    if (o.json) return extractReply(o.json);
  }
  return null;
}

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      // Visitor-safe config only — never expose the webhook URL.
      GET: async () => {
        const c = await loadCfg();
        const enabled = !!c.enabled && !!c.webhook_url;
        return Response.json({ enabled, title: c.title || "Chat with Alfaz", welcome: c.welcome || "Hi! How can I help you today?" },
          { headers: { "Cache-Control": "no-store" } });
      },
      POST: async ({ request }) => {
        const c = await loadCfg();
        if (!c.enabled || !c.webhook_url) return Response.json({ error: "Chat is offline" }, { status: 403 });
        let raw: unknown;
        try { raw = await request.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
        const p = Body.safeParse(raw);
        if (!p.success) return Response.json({ error: "Invalid message" }, { status: 400 });
        try {
          const res = await fetch(c.webhook_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatInput: p.data.message, message: p.data.message, sessionId: p.data.sessionId, history: p.data.history ?? [], page: request.headers.get("referer") ?? "" }),
            signal: AbortSignal.timeout(45000),
          });
          const text = await res.text();
          if (!res.ok) {
            console.error(`Chat webhook failed [${res.status}]: ${text.slice(0, 500)}`);
            return Response.json({ error: "The assistant is unavailable right now." }, { status: 502 });
          }
          let data: unknown = text;
          try { data = JSON.parse(text); } catch { /* plain text reply */ }
          const reply = extractReply(data);
          return Response.json({ reply: reply ?? "Sorry, I couldn't generate a reply." });
        } catch (e) {
          console.error("Chat webhook error", e);
          return Response.json({ error: "The assistant is unavailable right now." }, { status: 502 });
        }
      },
    },
  },
});

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Json } from "@/integrations/supabase/types";

type Cfg = { enabled?: boolean; webhook_url?: string; title?: string; welcome?: string };

export function ChatSettings() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "settings", "chat"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "chat").maybeSingle();
      if (error) throw error;
      return (data?.value ?? {}) as Cfg;
    },
  });
  const [cfg, setCfg] = useState<Cfg>({});
  const [testing, setTesting] = useState(false);
  useEffect(() => { if (q.data) setCfg(q.data); }, [q.data]);

  async function save(next: Cfg, msg: string) {
    if (next.webhook_url && !/^https:\/\//i.test(next.webhook_url)) { toast.error("Webhook URL must start with https://"); return; }
    if (next.enabled && !next.webhook_url) { toast.error("Add a webhook URL first"); return; }
    const { error } = await supabase.from("site_settings").upsert({ key: "chat", value: next as Json }, { onConflict: "key" });
    if (error) { toast.error(error.message); return; }
    setCfg(next); toast.success(msg);
    qc.invalidateQueries({ queryKey: ["admin", "settings", "chat"] });
  }

  async function test() {
    setTesting(true);
    try {
      const r = await fetch("/api/public/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "Hello (test from admin)", sessionId: "admin-test-" + Date.now() }) });
      const d = await r.json();
      d.reply ? toast.success("Reply: " + d.reply.slice(0, 120)) : toast.error(d.error ?? "No reply");
    } catch { toast.error("Test failed"); } finally { setTesting(false); }
  }

  if (q.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  return (
    <section className="panel space-y-5 p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Visitor chat</h2>
        <p className="text-sm text-muted-foreground">A chat bubble on every public page. Messages go to your n8n webhook and its reply is shown to the visitor.</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="chat-enabled">Chat enabled</Label>
          <p className="text-xs text-muted-foreground">When off, the chat bubble is hidden.</p>
        </div>
        <Switch id="chat-enabled" checked={!!cfg.enabled} onCheckedChange={(v) => save({ ...cfg, enabled: v }, v ? "Chat enabled" : "Chat disabled")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="chat-url">n8n webhook URL (Production)</Label>
        <Input id="chat-url" placeholder="https://your-n8n.com/webhook/..." value={cfg.webhook_url ?? ""} onChange={(e) => setCfg({ ...cfg, webhook_url: e.target.value.trim() })} />
        <p className="text-xs text-muted-foreground">Kept private — visitors never see it. Sent fields: chatInput, message, sessionId, history, page. Reply with JSON like {"{"}"output": "..."{"}"} (Respond to Webhook node).</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="chat-title">Chat title</Label>
          <Input id="chat-title" placeholder="Chat with Alfaz" value={cfg.title ?? ""} onChange={(e) => setCfg({ ...cfg, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chat-welcome">Welcome message</Label>
          <Input id="chat-welcome" placeholder="Hi! How can I help you today?" value={cfg.welcome ?? ""} onChange={(e) => setCfg({ ...cfg, welcome: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={() => save(cfg, "Chat settings saved")}>Save</Button>
        <Button type="button" size="sm" variant="outline" disabled={testing || !cfg.enabled} onClick={test}>{testing ? "Testing…" : "Send test message"}</Button>
      </div>
    </section>
  );
}

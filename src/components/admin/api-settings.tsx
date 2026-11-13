import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { sha256Hex } from "@/lib/api-key";
import type { Json } from "@/integrations/supabase/types";

type Cfg = { enabled?: boolean; key_hash?: string; key_hint?: string; default_status?: "draft" | "published" };

export function ApiSettings() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "settings", "api"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "api").maybeSingle();
      if (error) throw error;
      return (data?.value ?? {}) as Cfg;
    },
  });
  const [cfg, setCfg] = useState<Cfg>({});
  const [newKey, setNewKey] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  useEffect(() => { if (q.data) setCfg(q.data); }, [q.data]);
  useEffect(() => { setOrigin(window.location.origin); }, []);

  async function save(next: Cfg, msg: string) {
    const { error } = await supabase.from("site_settings").upsert({ key: "api", value: next as Json }, { onConflict: "key" });
    if (error) { toast.error(error.message); return false; }
    setCfg(next); toast.success(msg);
    qc.invalidateQueries({ queryKey: ["admin", "settings", "api"] });
    return true;
  }

  async function generate() {
    if (cfg.key_hash && !confirm("Create a new key? The old key will stop working immediately.")) return;
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const key = "ak_" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    const ok = await save({ ...cfg, enabled: true, key_hash: await sha256Hex(key), key_hint: key.slice(-4) }, "New API key created");
    if (ok) setNewKey(key);
  }
  async function revoke() {
    if (!confirm("Delete the API key? Automations will stop working.")) return;
    const { key_hash: _h, key_hint: _k, ...rest } = cfg;
    await save({ ...rest, enabled: false }, "API key deleted");
    setNewKey(null);
  }
  const copy = (t: string) => navigator.clipboard.writeText(t).then(() => toast.success("Copied"));

  const endpoint = `${origin}/api/public/v1/blog`;
  const curl = `curl -X POST ${endpoint} \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: YOUR_API_KEY" \\\n  -d '{"title":"My post","content":"## Hello\\n\\nWritten by automation.","tags":["Automation"],"status":"draft"}'`;

  if (q.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  return (
    <section className="panel space-y-5 p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">API & Automation</h2>
        <p className="text-sm text-muted-foreground">Let tools like n8n, Make, Zapier or a Python script create blog posts.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="api-enabled">API enabled</Label>
          <p className="text-xs text-muted-foreground">When off, every automation request is refused.</p>
        </div>
        <Switch id="api-enabled" checked={!!cfg.enabled} disabled={!cfg.key_hash}
          onCheckedChange={(v) => save({ ...cfg, enabled: v }, v ? "API enabled" : "API disabled")} />
      </div>

      <div className="space-y-2">
        <Label>Default status for new posts</Label>
        <div className="flex gap-2">
          {(["draft", "published"] as const).map((s) => (
            <Button key={s} type="button" size="sm" variant={(cfg.default_status ?? "draft") === s ? "default" : "outline"}
              onClick={() => save({ ...cfg, default_status: s }, "Default status saved")}>
              {s === "draft" ? "Draft (review first)" : "Publish immediately"}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Used when a request doesn't send its own "status".</p>
      </div>

      <div className="space-y-2">
        <Label>API key</Label>
        {newKey ? (
          <div className="space-y-2 rounded-md border border-primary/40 bg-primary/5 p-3">
            <p className="text-xs font-medium">Copy this key now — it won't be shown again.</p>
            <div className="flex gap-2">
              <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1.5 font-mono text-xs">{newKey}</code>
              <Button size="sm" type="button" onClick={() => copy(newKey)}>Copy</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {cfg.key_hash ? <>Active key ending in <code className="font-mono">…{cfg.key_hint}</code></> : "No key yet."}
          </p>
        )}
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={generate}>{cfg.key_hash ? "Regenerate key" : "Generate key"}</Button>
          {cfg.key_hash && <Button type="button" size="sm" variant="outline" onClick={revoke}>Delete key</Button>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Endpoint</Label>
        <div className="flex gap-2">
          <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1.5 font-mono text-xs">POST {endpoint}</code>
          <Button size="sm" type="button" variant="outline" onClick={() => copy(endpoint)}>Copy</Button>
        </div>
        <p className="text-xs text-muted-foreground">Use your published site address in automations. Fields: title*, content* (Markdown), excerpt, slug, tags, cover_url, status, featured, reading_time, seo_title, seo_description.</p>
        <div className="relative">
          <pre className="overflow-x-auto rounded bg-muted p-3 font-mono text-xs">{curl}</pre>
          <Button size="sm" type="button" variant="outline" className="absolute right-2 top-2" onClick={() => copy(curl)}>Copy</Button>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiSettings } from "@/components/admin/api-settings";
import { ChatSettings } from "@/components/admin/chat-settings";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Site & SEO settings — Admin" }, { name: "robots", content: "noindex" }] }),
  component: Settings,
});

type F = { key: string; label: string; long?: boolean; help?: string };
const GENERAL: F[] = [
  { key: "site_title", label: "Site title" },
  { key: "byline", label: "Byline" },
  { key: "hero_title", label: "Hero title" },
  { key: "hero_subtitle", label: "Hero subtitle", long: true },
  { key: "profile_image", label: "Profile image URL", help: "Upload in Media library, then paste the link" },
  { key: "resume_url", label: "Resume / CV PDF URL" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "footer_text", label: "Footer text" },
];
const SEO: F[] = [
  { key: "default_title", label: "Default page title" },
  { key: "default_description", label: "Default meta description", long: true },
  { key: "og_image", label: "Default share image URL" },
  { key: "site_url", label: "Public site address", help: "e.g. https://yourdomain.com — used for canonical links and the sitemap" },
];

function Settings() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <h1 className="font-display text-2xl font-semibold">Site & SEO settings</h1>
      <Group settingKey="general" title="General" fields={GENERAL} />
      <Group settingKey="seo" title="SEO defaults" fields={SEO} />
      <SocialLinks />
      <ChatSettings />
      <ApiSettings />
    </div>
  );
}

function Group({ settingKey, title, fields }: { settingKey: string; title: string; fields: F[] }) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "settings", settingKey],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", settingKey).maybeSingle();
      if (error) throw error;
      return (data?.value ?? {}) as Record<string, string>;
    },
  });
  const [v, setV] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (q.data) setV(q.data); }, [q.data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const clean = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, String(x ?? "").trim().slice(0, 2000)]));
    const { error } = await supabase.from("site_settings").upsert({ key: settingKey, value: clean as Json }, { onConflict: "key" });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${title} saved`);
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    qc.invalidateQueries({ queryKey: ["public", "settings"] });
  }

  if (q.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  return (
    <form onSubmit={save} className="panel space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {fields.map((f) => {
        const id = `${settingKey}-${f.key}`;
        return (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={id}>{f.label}</Label>
            {f.long
              ? <Textarea id={id} value={v[f.key] ?? ""} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />
              : <Input id={id} value={v[f.key] ?? ""} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />}
            {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
          </div>
        );
      })}
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
    </form>
  );
}

function SocialLinks() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "social"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_links").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin", "social"] }); qc.invalidateQueries({ queryKey: ["public", "settings"] }); };

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!/^https?:\/\//i.test(url)) { toast.error("Link must start with https://"); return; }
    const { error } = await supabase.from("social_links").insert({ platform: platform.trim().slice(0, 40), url: url.trim(), sort_order: q.data?.length ?? 0 });
    if (error) { toast.error(error.message); return; }
    setPlatform(""); setUrl(""); refresh();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  return (
    <section className="panel space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold">Social links</h2>
      {q.data?.length ? (
        <ul className="divide-y divide-border">
          {q.data.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="min-w-0 truncate"><strong>{s.platform}</strong> · <span className="text-muted-foreground">{s.url}</span></span>
              <Button size="sm" variant="outline" onClick={() => remove(s.id)}>Remove</Button>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-muted-foreground">No social links yet. The footer shows placeholders until you add some.</p>}
      <form onSubmit={add} className="grid gap-2 sm:grid-cols-[160px_1fr_auto]">
        <Input aria-label="Platform" placeholder="GitHub" required value={platform} onChange={(e) => setPlatform(e.target.value)} />
        <Input aria-label="Profile URL" placeholder="https://github.com/…" required type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>
    </section>
  );
}

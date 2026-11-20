import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultAbout, mergeAbout, type AboutContent, type AboutPillar } from "@/data/about";
import { uploadMedia } from "@/lib/media";
import { toImageUrl } from "@/lib/cms";

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d; if (j < 0 || j >= arr.length) return arr;
  const c = [...arr]; [c[i], c[j]] = [c[j]!, c[i]!]; return c;
}
function Tools({ onUp, onDown, onDelete }: { onUp: () => void; onDown: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button type="button" size="icon" variant="ghost" aria-label="Move up" onClick={onUp}><ArrowUp className="h-4 w-4" /></Button>
      <Button type="button" size="icon" variant="ghost" aria-label="Move down" onClick={onDown}><ArrowDown className="h-4 w-4" /></Button>
      <Button type="button" size="icon" variant="ghost" aria-label="Delete" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </div>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
const ICONS: AboutPillar["icon"][] = ["network", "server", "cpu", "award"];

export function AboutEditor() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "settings", "about"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "about").maybeSingle();
      if (error) throw error;
      return mergeAbout(data?.value);
    },
  });
  const [a, setA] = useState<AboutContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { if (q.data && !a) setA(q.data); }, [q.data, a]);
  if (q.isLoading || !a) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const set = (p: Partial<AboutContent>) => setA({ ...a, ...p });

  async function save(next: AboutContent, msg = "About saved") {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key: "about", value: next as unknown as Json }, { onConflict: "key" });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(msg);
    qc.invalidateQueries({ queryKey: ["public", "about"] });
    qc.invalidateQueries({ queryKey: ["admin", "settings", "about"] });
  }
  async function onFiles(files: FileList | null) {
    if (!files?.length || !a) return;
    setUploading(true);
    const added: AboutContent["photos"] = [];
    for (const f of Array.from(files)) {
      try { added.push({ url: await uploadMedia(f, "about"), caption: "", location: "", featured: true }); }
      catch (e) { toast.error(`${f.name}: ${e instanceof Error ? e.message : "upload failed"}`); }
    }
    setUploading(false);
    if (added.length) { set({ photos: [...a.photos, ...added] }); toast.success(`${added.length} photo(s) uploaded — click Save to publish`); }
  }
  const saveBtn = <Button onClick={() => save(a)} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">About</h1>
          <p className="text-sm text-muted-foreground">Photos and text for the homepage About section and the About page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { if (confirm("Reset all text to the original? Photos are kept. (Saved immediately)")) { const n = { ...defaultAbout, photos: a.photos }; setA(n); save(n, "Text reset"); } }}>Reset text</Button>
          {saveBtn}
        </div>
      </div>
      <Tabs defaultValue="photos">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="home">Homepage</TabsTrigger>
          <TabsTrigger value="pillars">Focus pillars</TabsTrigger>
          <TabsTrigger value="page">About page</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4 pt-4">
          <label className="panel flex cursor-pointer flex-col items-center gap-2 border-dashed p-6 text-center hover:border-primary/50">
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{uploading ? "Uploading…" : "Upload work photos"}</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or WEBP · up to 10MB each</span>
            <input type="file" accept="image/*" multiple className="sr-only" disabled={uploading} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
          </label>
          {a.photos.length === 0 ? <p className="text-sm text-muted-foreground">No photos yet.</p> : null}
          <div className="grid gap-3 md:grid-cols-2">
            {a.photos.map((p, i) => {
              const up = (patch: Partial<typeof p>) => set({ photos: a.photos.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
              return (
                <div key={p.url + i} className="panel flex gap-3 p-3">
                  <img src={toImageUrl(p.url) ?? p.url} alt={p.caption || "Photo"} className="h-24 w-24 shrink-0 rounded-md object-cover sm:h-28 sm:w-32" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Input value={p.caption} placeholder="Caption" onChange={(e) => up({ caption: e.target.value })} />
                    <Input value={p.location} placeholder="Location (e.g. Client site, Dhaka)" onChange={(e) => up({ location: e.target.value })} />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-xs"><Switch checked={p.featured} onCheckedChange={(v) => up({ featured: v })} /> Show on homepage</label>
                      <Tools onUp={() => set({ photos: move(a.photos, i, -1) })} onDown={() => set({ photos: move(a.photos, i, 1) })} onDelete={() => set({ photos: a.photos.filter((_, j) => j !== i) })} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="home" className="space-y-4 pt-4">
          <Field label="Headline"><Input value={a.homeTitle} onChange={(e) => set({ homeTitle: e.target.value })} /></Field>
          <Field label="Short description"><Textarea rows={5} value={a.homeDescription} onChange={(e) => set({ homeDescription: e.target.value })} /></Field>
        </TabsContent>

        <TabsContent value="pillars" className="space-y-3 pt-4">
          {a.pillars.map((p, i) => {
            const up = (patch: Partial<AboutPillar>) => set({ pillars: a.pillars.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
            return (
              <div key={i} className="panel space-y-2 p-3">
                <div className="flex gap-2">
                  <select value={p.icon} onChange={(e) => up({ icon: e.target.value as AboutPillar["icon"] })} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                    {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                  <Input value={p.title} placeholder="Title" onChange={(e) => up({ title: e.target.value })} />
                  <Tools onUp={() => set({ pillars: move(a.pillars, i, -1) })} onDown={() => set({ pillars: move(a.pillars, i, 1) })} onDelete={() => set({ pillars: a.pillars.filter((_, j) => j !== i) })} />
                </div>
                <Input value={p.text} placeholder="Short text" onChange={(e) => up({ text: e.target.value })} />
              </div>
            );
          })}
          <Button variant="outline" onClick={() => set({ pillars: [...a.pillars, { icon: "network", title: "", text: "" }] })}><Plus className="mr-1 h-4 w-4" /> Add pillar</Button>
        </TabsContent>

        <TabsContent value="page" className="space-y-4 pt-4">
          <Field label="Page title"><Input value={a.pageTitle} onChange={(e) => set({ pageTitle: e.target.value })} /></Field>
          <Field label="Page intro"><Textarea rows={3} value={a.pageDescription} onChange={(e) => set({ pageDescription: e.target.value })} /></Field>
          <Field label="Introduction heading"><Input value={a.introTitle} onChange={(e) => set({ introTitle: e.target.value })} /></Field>
          <Field label="Introduction text"><Textarea rows={4} value={a.introDescription} onChange={(e) => set({ introDescription: e.target.value })} /></Field>
          <h2 className="pt-2 text-sm font-semibold">Detailed sections</h2>
          {a.sections.map((s, i) => {
            const up = (patch: Partial<typeof s>) => set({ sections: a.sections.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
            return (
              <div key={i} className="panel space-y-2 p-3">
                <div className="flex gap-2">
                  <Input value={s.title} placeholder="Section title" onChange={(e) => up({ title: e.target.value })} />
                  <Tools onUp={() => set({ sections: move(a.sections, i, -1) })} onDown={() => set({ sections: move(a.sections, i, 1) })} onDelete={() => set({ sections: a.sections.filter((_, j) => j !== i) })} />
                </div>
                <Textarea rows={5} value={s.body.join("\n\n")} placeholder="Paragraphs — leave a blank line between them" onChange={(e) => up({ body: e.target.value.split(/\n\s*\n/) })} />
              </div>
            );
          })}
          <Button variant="outline" onClick={() => set({ sections: [...a.sections, { title: "", body: [""] }] })}><Plus className="mr-1 h-4 w-4" /> Add section</Button>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end">{saveBtn}</div>
    </div>
  );
}

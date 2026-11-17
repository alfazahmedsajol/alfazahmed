import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload, Network, Server, FlaskConical, Image as ImageIcon, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultLab, labStatusLabel, mergeLab, type GearItem, type LabContent, type LabGroup, type LabStatus } from "@/data/lab";
import { uploadMedia } from "@/lib/media";
import { toImageUrl } from "@/lib/cms";

const STATUSES = Object.keys(labStatusLabel) as LabStatus[];
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const commas = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d; if (j < 0 || j >= arr.length) return arr;
  const c = [...arr]; [c[i], c[j]] = [c[j]!, c[i]!]; return c;
}

function RowTools({ onUp, onDown, onDelete }: { onUp: () => void; onDown: () => void; onDelete: () => void }) {
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

/** Text field that keeps raw text while typing and parses on blur-free change. */
function ListInput({ value, onChange, multiline, placeholder }: { value: string[]; onChange: (v: string[]) => void; multiline?: boolean; placeholder?: string }) {
  const [raw, setRaw] = useState(value.join(multiline ? "\n" : ", "));
  const parse = multiline ? lines : commas;
  return multiline
    ? <Textarea rows={3} value={raw} placeholder={placeholder} onChange={(e) => { setRaw(e.target.value); onChange(parse(e.target.value)); }} />
    : <Input value={raw} placeholder={placeholder} onChange={(e) => { setRaw(e.target.value); onChange(parse(e.target.value)); }} />;
}

function StatusSelect({ value, onChange }: { value: LabStatus; onChange: (v: LabStatus) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as LabStatus)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
      {STATUSES.map((s) => <option key={s} value={s}>{labStatusLabel[s]}</option>)}
    </select>
  );
}

function GroupsEditor({ groups, onChange, kind }: { groups: LabGroup[]; onChange: (g: LabGroup[]) => void; kind: string }) {
  const setGroup = (gi: number, g: LabGroup) => onChange(groups.map((x, i) => (i === gi ? g : x)));
  const setItem = (gi: number, ii: number, it: GearItem) => setGroup(gi, { ...groups[gi]!, items: groups[gi]!.items.map((x, i) => (i === ii ? it : x)) });
  return (
    <div className="space-y-6">
      {groups.map((g, gi) => (
        <div key={gi} className="panel space-y-4 p-4 sm:p-5">
          <div className="flex items-end gap-2">
            <div className="flex-1"><Field label={`${kind} group title`}><Input value={g.title} onChange={(e) => setGroup(gi, { ...g, title: e.target.value })} /></Field></div>
            <RowTools onUp={() => onChange(move(groups, gi, -1))} onDown={() => onChange(move(groups, gi, 1))} onDelete={() => confirm("Delete this group?") && onChange(groups.filter((_, i) => i !== gi))} />
          </div>
          {g.items.map((it, ii) => (
            <div key={ii} className="space-y-3 rounded-md border border-border p-3">
              <div className="flex items-end gap-2">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Field label="Name"><Input value={it.name} onChange={(e) => setItem(gi, ii, { ...it, name: e.target.value })} /></Field>
                  <Field label="Status"><StatusSelect value={it.status} onChange={(v) => setItem(gi, ii, { ...it, status: v })} /></Field>
                </div>
                <RowTools
                  onUp={() => setGroup(gi, { ...g, items: move(g.items, ii, -1) })}
                  onDown={() => setGroup(gi, { ...g, items: move(g.items, ii, 1) })}
                  onDelete={() => setGroup(gi, { ...g, items: g.items.filter((_, i) => i !== ii) })}
                />
              </div>
              <Field label="Description"><Textarea rows={2} value={it.description} onChange={(e) => setItem(gi, ii, { ...it, description: e.target.value })} /></Field>
              <Field label="Tags (comma separated)"><ListInput value={it.chips} onChange={(v) => setItem(gi, ii, { ...it, chips: v })} /></Field>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setGroup(gi, { ...g, items: [...g.items, { name: "New item", description: "", chips: [], status: "active" }] })}><Plus className="mr-1 h-4 w-4" /> Add item</Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => onChange([...groups, { title: "New group", items: [] }])}><Plus className="mr-1 h-4 w-4" /> Add group</Button>
    </div>
  );
}

export function LabEditor() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "settings", "lab"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "lab").maybeSingle();
      if (error) throw error;
      return mergeLab(data?.value);
    },
  });
  const [lab, setLab] = useState<LabContent | null>(null);
  const [version, setVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { if (q.data && !lab) setLab(q.data); }, [q.data, lab]);

  if (q.isLoading || !lab) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const set = (patch: Partial<LabContent>) => setLab({ ...lab, ...patch });

  async function save(next: LabContent, msg = "Lab saved") {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key: "lab", value: next as unknown as Json }, { onConflict: "key" });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(msg);
    qc.invalidateQueries({ queryKey: ["public", "lab"] });
    qc.invalidateQueries({ queryKey: ["admin", "settings", "lab"] });
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const added: { url: string; caption: string }[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) { toast.error(`${f.name}: images only`); continue; }
      try { added.push({ url: await uploadMedia(f, "lab"), caption: "" }); }
      catch (e) { toast.error(`${f.name}: ${e instanceof Error ? e.message : "upload failed"}`); }
    }
    setUploading(false);
    if (added.length) { set({ photos: [...lab!.photos, ...added] }); toast.success(`${added.length} photo(s) uploaded — click Save to publish`); }
  }

  const tiers = lab.topologyTiers;
  const setTier = (ti: number, t: (typeof tiers)[number]) => set({ topologyTiers: tiers.map((x, i) => (i === ti ? t : x)) });

  return (
    <div className="space-y-6" key={version}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Lab</h1>
          <p className="text-sm text-muted-foreground">Everything on the public Lab page. Changes go live after Save.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { if (confirm("Replace everything with the original sample content? (Saved immediately)")) { setLab(defaultLab); setVersion((v) => v + 1); save(defaultLab, "Reset to defaults"); } }}>Reset to defaults</Button>
          <Button onClick={() => save(lab)} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-5">
          <TabsTrigger value="overview"><FileText className="mr-1.5 h-4 w-4" />Overview</TabsTrigger>
          <TabsTrigger value="topology"><Network className="mr-1.5 h-4 w-4" />Topology</TabsTrigger>
          <TabsTrigger value="gear"><Server className="mr-1.5 h-4 w-4" />Gear & Stack</TabsTrigger>
          <TabsTrigger value="experiments"><FlaskConical className="mr-1.5 h-4 w-4" />Experiments</TabsTrigger>
          <TabsTrigger value="photos"><ImageIcon className="mr-1.5 h-4 w-4" />Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" forceMount className="mt-6 data-[state=inactive]:hidden">
          <div className="panel space-y-4 p-4 sm:p-6">
            <Field label="Lab title"><Input value={lab.intro.title} onChange={(e) => set({ intro: { ...lab.intro, title: e.target.value } })} /></Field>
            <Field label="Purpose / intro"><Textarea rows={4} value={lab.intro.purpose} onChange={(e) => set({ intro: { ...lab.intro, purpose: e.target.value } })} /></Field>
            <Field label="Principles (one per line)"><ListInput multiline value={lab.intro.principles} onChange={(v) => set({ intro: { ...lab.intro, principles: v } })} /></Field>
          </div>
        </TabsContent>

        <TabsContent value="topology" forceMount className="mt-6 space-y-6 data-[state=inactive]:hidden">
          <p className="text-sm text-muted-foreground">Layers show top to bottom on the diagram. Use dummy IPs/ASNs for safety.</p>
          {tiers.map((t, ti) => (
            <div key={ti} className="panel space-y-4 p-4 sm:p-5">
              <div className="flex items-end gap-2">
                <div className="flex-1"><Field label="Layer name"><Input value={t.name} onChange={(e) => setTier(ti, { ...t, name: e.target.value })} /></Field></div>
                <RowTools onUp={() => set({ topologyTiers: move(tiers, ti, -1) })} onDown={() => set({ topologyTiers: move(tiers, ti, 1) })} onDelete={() => confirm("Delete this layer?") && set({ topologyTiers: tiers.filter((_, i) => i !== ti) })} />
              </div>
              {t.nodes.map((n, ni) => {
                const setNode = (nn: typeof n) => setTier(ti, { ...t, nodes: t.nodes.map((x, i) => (i === ni ? nn : x)) });
                return (
                  <div key={ni} className="space-y-3 rounded-md border border-border p-3">
                    <div className="flex items-end gap-2">
                      <div className="grid flex-1 gap-3 sm:grid-cols-2">
                        <Field label="Device name"><Input value={n.label} onChange={(e) => setNode({ ...n, label: e.target.value })} /></Field>
                        <Field label="Role"><Input value={n.role} onChange={(e) => setNode({ ...n, role: e.target.value })} /></Field>
                      </div>
                      <RowTools onUp={() => setTier(ti, { ...t, nodes: move(t.nodes, ni, -1) })} onDown={() => setTier(ti, { ...t, nodes: move(t.nodes, ni, 1) })} onDelete={() => setTier(ti, { ...t, nodes: t.nodes.filter((_, i) => i !== ni) })} />
                    </div>
                    <Field label="Details (one per line)"><ListInput multiline value={n.details} onChange={(v) => setNode({ ...n, details: v })} /></Field>
                    <Field label="Tags (comma separated)"><ListInput value={n.chips} onChange={(v) => setNode({ ...n, chips: v })} /></Field>
                  </div>
                );
              })}
              <Button type="button" size="sm" variant="outline" onClick={() => setTier(ti, { ...t, nodes: [...t.nodes, { id: `n-${Date.now()}`, label: "New device", role: "", details: [], chips: [] }] })}><Plus className="mr-1 h-4 w-4" /> Add device</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => set({ topologyTiers: [...tiers, { name: "New layer", nodes: [] }] })}><Plus className="mr-1 h-4 w-4" /> Add layer</Button>
        </TabsContent>

        <TabsContent value="gear" forceMount className="mt-6 space-y-10 data-[state=inactive]:hidden">
          <div><h2 className="mb-4 font-display text-lg font-semibold">Hardware & emulation</h2><GroupsEditor kind="Hardware" groups={lab.gearGroups} onChange={(g) => set({ gearGroups: g })} /></div>
          <div><h2 className="mb-4 font-display text-lg font-semibold">Services & automation</h2><GroupsEditor kind="Service" groups={lab.serviceGroups} onChange={(g) => set({ serviceGroups: g })} /></div>
        </TabsContent>

        <TabsContent value="experiments" forceMount className="mt-6 space-y-4 data-[state=inactive]:hidden">
          {lab.experiments.map((ex, i) => {
            const setEx = (e: typeof ex) => set({ experiments: lab.experiments.map((x, j) => (j === i ? e : x)) });
            return (
              <div key={i} className="panel space-y-3 p-4 sm:p-5">
                <div className="flex items-end gap-2">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <Field label="Title"><Input value={ex.title} onChange={(e) => setEx({ ...ex, title: e.target.value })} /></Field>
                    <Field label="Status"><StatusSelect value={ex.status} onChange={(v) => setEx({ ...ex, status: v })} /></Field>
                  </div>
                  <RowTools onUp={() => set({ experiments: move(lab.experiments, i, -1) })} onDown={() => set({ experiments: move(lab.experiments, i, 1) })} onDelete={() => set({ experiments: lab.experiments.filter((_, j) => j !== i) })} />
                </div>
                <Field label="Description"><Textarea rows={2} value={ex.description} onChange={(e) => setEx({ ...ex, description: e.target.value })} /></Field>
                <Field label="Tags (comma separated)"><ListInput value={ex.chips} onChange={(v) => setEx({ ...ex, chips: v })} /></Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Link text"><Input value={ex.link.label} onChange={(e) => setEx({ ...ex, link: { ...ex.link, label: e.target.value } })} /></Field>
                  <Field label="Link goes to">
                    <select value={ex.link.to} onChange={(e) => setEx({ ...ex, link: { ...ex.link, to: e.target.value as "/projects" | "/blog" } })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="/projects">Projects page</option><option value="/blog">Blog page</option>
                    </select>
                  </Field>
                </div>
              </div>
            );
          })}
          <Button type="button" variant="outline" onClick={() => set({ experiments: [...lab.experiments, { title: "New experiment", description: "", chips: [], status: "experiment", link: { label: "See project writeup", to: "/projects" } }] })}><Plus className="mr-1 h-4 w-4" /> Add experiment</Button>
        </TabsContent>

        <TabsContent value="photos" forceMount className="mt-6 space-y-4 data-[state=inactive]:hidden">
          <label className="panel flex cursor-pointer flex-col items-center justify-center gap-2 border-dashed p-8 text-center hover:border-primary/60"
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}>
            <Upload className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">{uploading ? "Uploading…" : "Upload lab photos"}</span>
            <span className="text-xs text-muted-foreground">Drag & drop or click · JPG, PNG, WEBP · max 10 MB each</span>
            <input type="file" accept="image/*" multiple className="sr-only" disabled={uploading} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
          </label>
          {lab.photos.length === 0 && <p className="text-sm text-muted-foreground">No photos yet — the gallery stays hidden on the Lab page until you add some.</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lab.photos.map((p, i) => (
              <div key={p.url + i} className="panel space-y-2 overflow-hidden p-3">
                <img src={toImageUrl(p.url) ?? p.url} alt={p.caption || "Lab photo"} className="aspect-[4/3] w-full rounded object-cover" />
                <Input placeholder="Caption (optional)" value={p.caption} onChange={(e) => set({ photos: lab.photos.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)) })} />
                <RowTools onUp={() => set({ photos: move(lab.photos, i, -1) })} onDown={() => set({ photos: move(lab.photos, i, 1) })} onDelete={() => set({ photos: lab.photos.filter((_, j) => j !== i) })} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end"><Button onClick={() => save(lab)} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></div>
    </div>
  );
}

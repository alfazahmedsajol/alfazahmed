import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/site/markdown";
import { uploadMedia } from "@/lib/media";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "code" | "number" | "bool" | "date" | "tags" | "select" | "relation" | "url" | "markdown" | "datetime";
  required?: boolean;
  options?: string[];
  relation?: string; // table with id,name
  help?: string;
  upload?: string; // media folder; shows an upload button on url fields
};

export type CrudConfig = {
  table: string;
  title: string;
  singular: string;
  fields: Field[];
  columns: string[]; // field keys shown in table
  orderBy: string;
  publishKey?: "published" | "status";
  featuredKey?: string;
  slugFrom?: string;
  sortable?: boolean; // has sort_order but list is ordered by another column; reorder in Featured view
};

type Row = Record<string, unknown> & { id: string; status?: unknown; published?: unknown; slug?: unknown; published_at?: unknown; sort_order?: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;
const PAGE = 10;

const bySort = (a: Row[]) => [...a].sort((x, y) => (Number(x.sort_order) || 0) - (Number(y.sort_order) || 0) || x.id.localeCompare(y.id));
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function CrudPage({ config }: { config: CrudConfig }) {
  const qc = useQueryClient();
  const key = ["admin", config.table];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "featured">("all");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Row | Partial<Row> | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await db.from(config.table).select("*").order(config.orderBy, { ascending: config.orderBy === "sort_order" }).order("id");
      if (error) throw error;
      return data as Row[];
    },
  });

  const relTables = [...new Set(config.fields.filter((f) => f.relation).map((f) => f.relation!))];
  const rels = useQuery({
    queryKey: ["admin-rel", ...relTables],
    enabled: relTables.length > 0,
    queryFn: async () => {
      const out: Record<string, { id: string; name: string }[]> = {};
      for (const t of relTables) {
        const { data, error } = await db.from(t).select("id,name").order("name");
        if (error) throw error;
        out[t] = data;
      }
      return out;
    },
  });

  const hasSort = config.orderBy === "sort_order" || !!config.sortable;
  const canReorder = hasSort && !search && (filter === "featured" || (filter === "all" && config.orderBy === "sort_order"));
  const isPub = (r: Row) => (config.publishKey === "status" ? r.status === "published" : r.published === true);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = filter === "featured" && hasSort ? bySort(list.data ?? []) : (list.data ?? []);
    return base.filter((r) => {
      if (filter === "published" && !isPub(r)) return false;
      if (filter === "draft" && isPub(r)) return false;
      if (filter === "featured" && !(config.featuredKey && r[config.featuredKey])) return false;
      if (!q) return true;
      return config.columns.some((c) => String(r[c] ?? "").toLowerCase().includes(q));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.data, search, filter]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice(page * PAGE, page * PAGE + PAGE);

  const refresh = () => qc.invalidateQueries({ queryKey: key });

  const save = useMutation({
    mutationFn: async (r: Partial<Row>) => {
      const payload: Record<string, unknown> & { slug?: unknown; status?: unknown; published_at?: unknown } = {};
      for (const f of config.fields) {
        let v = r[f.key];
        if (f.type === "tags") v = Array.isArray(v) ? v : String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        else if (f.type === "number") v = v === "" || v == null ? (f.key === "sort_order" ? 0 : null) : Number(v);
        else if (f.type === "bool") v = !!v;
        else if (f.type === "datetime") v = v ? new Date(String(v)).toISOString() : null;
        else if (v === "") v = null;
        payload[f.key] = v;
      }
      if ("reading_time" in payload && !payload["reading_time"] && payload["content"]) payload["reading_time"] = `${Math.max(1, Math.round(String(payload["content"]).split(/\s+/).length / 200))} min read`;
      if (config.slugFrom && !payload.slug) payload.slug = slugify(String(payload[config.slugFrom] ?? ""));
      if (config.publishKey === "status" && payload.status === "published" && !r.published_at) payload.published_at = new Date().toISOString();
      if (!r.id && hasSort && !payload["sort_order"]) payload["sort_order"] = Math.max(0, ...(list.data ?? []).map((x) => Number(x.sort_order) || 0)) + 10;
      const res = r.id ? await db.from(config.table).update(payload).eq("id", r.id) : await db.from(config.table).insert(payload);
      if (res.error) throw res.error;
    },
    onSuccess: () => { toast.success(`${config.singular} saved`); setEditing(null); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await db.from(config.table).update(values).eq("id", id);
      if (error) throw error;
    },
    onMutate: ({ id, values }) => {
      qc.setQueryData<Row[]>(key, (old) => old?.map((x) => (x.id === id ? { ...x, ...values } : x)));
    },
    onSettled: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      const res = await Promise.all(updates.map((u) => db.from(config.table).update({ sort_order: u.sort_order }).eq("id", u.id)));
      const err = res.find((x: { error: unknown }) => x.error);
      if (err) throw err.error;
    },
    onMutate: (updates) => {
      const m = new Map(updates.map((u) => [u.id, u.sort_order]));
      qc.setQueryData<Row[]>(key, (old) => {
        const next = old?.map((x) => (m.has(x.id) ? { ...x, sort_order: m.get(x.id) } : x));
        return next && config.orderBy === "sort_order" ? bySort(next) : next;
      });
    },
    onSettled: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(config.table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`${config.singular} deleted`); setDeleting(null); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  function move(r: Row, dir: -1 | 1) {
    // Swap with the neighbour in the visible list, then renumber everything so orders stay unique.
    const i = rows.findIndex((x) => x.id === r.id);
    const o = rows[i + dir];
    if (!o || reorder.isPending) return;
    const full = bySort(list.data ?? []);
    const a = full.findIndex((x) => x.id === r.id);
    const b = full.findIndex((x) => x.id === o.id);
    [full[a], full[b]] = [full[b]!, full[a]!];
    const updates = full.map((x, idx) => ({ id: x.id, sort_order: (idx + 1) * 10, old: Number(x.sort_order) }))
      .filter((u) => u.sort_order !== u.old).map(({ id, sort_order }) => ({ id, sort_order }));
    reorder.mutate(updates);
  }

  function togglePub(r: Row) {
    const values = config.publishKey === "status"
      ? { status: isPub(r) ? "draft" : "published", ...(isPub(r) || r.published_at ? {} : { published_at: new Date().toISOString() }) }
      : { published: !isPub(r) };
    patch.mutate({ id: r.id, values });
  }

  const cell = (r: Row, k: string) => {
    const f = config.fields.find((x) => x.key === k);
    const v = r[k];
    if (f?.relation) return rels.data?.[f.relation]?.find((x) => x.id === v)?.name ?? "—";
    if (Array.isArray(v)) return v.join(", ");
    return v == null || v === "" ? "—" : String(v);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">{config.title}</h1>
        <Button onClick={() => setEditing({})}><Plus className="mr-1 h-4 w-4" /> Add {config.singular.toLowerCase()}</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input placeholder="Search…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-full sm:max-w-xs" />
        {config.publishKey && (["all", "published", "draft", ...(config.featuredKey ? ["featured"] : [])] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => { setFilter(f as typeof filter); setPage(0); }}>
            {f[0]!.toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {config.featuredKey && hasSort && (
        <p className="mt-3 text-xs text-muted-foreground">
          {filter === "featured" ? "Use the arrows to set the order featured items appear on the homepage." : 'Tip: open "Featured" to set the order of featured items.'}
        </p>
      )}
      <div className="panel mt-4 overflow-x-auto">
        {list.isLoading ? <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        : list.error ? <p className="p-6 text-sm text-destructive">Couldn't load: {(list.error as Error).message}</p>
        : shown.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Nothing here yet. Use "Add {config.singular.toLowerCase()}" to create one.</p>
        : (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                {config.columns.map((c) => <th key={c} className="p-3 font-medium">{config.fields.find((f) => f.key === c)?.label ?? c}</th>)}
                {config.publishKey && <th className="p-3 font-medium">Published</th>}
                {config.featuredKey && <th className="p-3 font-medium">Featured</th>}
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shown.map((r) => (
                <tr key={r.id}>
                  {config.columns.map((c) => <td key={c} className="max-w-[10rem] truncate p-3 sm:max-w-xs">{cell(r, c)}</td>)}
                  {config.publishKey && <td className="p-3"><Switch checked={isPub(r)} onCheckedChange={() => togglePub(r)} aria-label="Published" /></td>}
                  {config.featuredKey && <td className="p-3"><Switch checked={!!r[config.featuredKey]} onCheckedChange={(v) => patch.mutate({ id: r.id, values: { [config.featuredKey!]: v } })} aria-label="Featured" /></td>}
                  <td className="whitespace-nowrap p-3 text-right">
                    {canReorder && (<>
                      <Button size="icon" variant="ghost" aria-label="Move up" onClick={() => move(r, -1)}><ArrowUp className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" aria-label="Move down" onClick={() => move(r, 1)}><ArrowDown className="h-4 w-4" /></Button>
                    </>)}
                    <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDeleting(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-muted-foreground">Page {page + 1} of {pages}</span>
          <Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-2xl overflow-y-auto p-4 sm:p-6">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} {config.singular.toLowerCase()}</DialogTitle></DialogHeader>
          {editing && <EditForm config={config} initial={editing} rels={rels.data ?? {}} saving={save.isPending} onSave={(r) => save.mutate(r)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && remove.mutate(deleting.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EditForm({ config, initial, rels, saving, onSave }: {
  config: CrudConfig; initial: Partial<Row>; rels: Record<string, { id: string; name: string }[]>; saving: boolean; onSave: (r: Partial<Row>) => void;
}) {
  const [v, setV] = useState<Record<string, unknown>>(() => {
    const o: Record<string, unknown> = { ...initial };
    for (const f of config.fields) {
      if (o[f.key] === undefined) o[f.key] = f.type === "bool" ? (f.key === "published") : f.type === "select" ? f.options?.[0] : "";
      if (f.type === "datetime" && o[f.key]) { const d = new Date(String(o[f.key])); o[f.key] = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
      if (f.type === "tags" && Array.isArray(o[f.key])) o[f.key] = (o[f.key] as string[]).join(", ");
    }
    return o;
  });
  const set = (k: string, val: unknown) => setV((p) => ({ ...p, [k]: val }));
  const cls = "flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

  return (
    <form className="space-y-4" onSubmit={(e) => {
      e.preventDefault();
      const miss = config.fields.find((f) => f.required && !String(v[f.key] ?? "").trim());
      if (miss) return void toast.error(`${miss.label} is required`);
      onSave({ ...v, id: initial.id } as Partial<Row>);
    }}>
      {config.fields.map((f) => {
        const id = `f-${f.key}`;
        const val = v[f.key];
        return (
          <div key={f.key} className="space-y-1.5">
            {f.type === "bool" ? (
              <div className="flex items-center gap-3"><Switch id={id} checked={!!val} onCheckedChange={(c) => set(f.key, c)} /><Label htmlFor={id}>{f.label}</Label></div>
            ) : (<>
              <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
              {f.type === "markdown" ? (
                <MarkdownField id={id} value={String(val ?? "")} onChange={(t) => set(f.key, t)} />
              ) : f.type === "textarea" || f.type === "code" ? (
                <Textarea id={id} rows={f.type === "code" ? 8 : 4} className={f.type === "code" ? "font-mono text-xs" : ""} value={String(val ?? "")} onChange={(e) => set(f.key, e.target.value)} />
              ) : f.type === "select" ? (
                <select id={id} className={cls} value={String(val ?? "")} onChange={(e) => set(f.key, e.target.value)}>
                  {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === "relation" ? (
                <select id={id} className={cls} value={String(val ?? "")} onChange={(e) => set(f.key, e.target.value)}>
                  <option value="">— None —</option>
                  {(rels[f.relation!] ?? []).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              ) : f.upload ? (
                <UploadInput id={id} folder={f.upload} value={String(val ?? "")} onChange={(v) => set(f.key, v)} />
              ) : (
                <Input id={id} type={f.type === "number" ? "number" : f.type === "datetime" ? "datetime-local" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"} value={String(val ?? "")} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </>)}
            {(f.help || f.type === "tags") && <p className="text-xs text-muted-foreground">{f.help ?? "Separate with commas"}</p>}
          </div>
        );
      })}
      <DialogFooter><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button></DialogFooter>
    </form>
  );
}

function MarkdownField({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [preview, setPreview] = useState(false);
  return (
    <div>
      <div className="mb-2 flex gap-2">
        <Button type="button" size="sm" variant={preview ? "outline" : "default"} onClick={() => setPreview(false)}>Write</Button>
        <Button type="button" size="sm" variant={preview ? "default" : "outline"} onClick={() => setPreview(true)}>Preview</Button>
      </div>
      {preview ? (
        <div className="max-h-[50vh] overflow-y-auto rounded-md border border-border p-4"><Markdown>{value || "_Nothing to preview yet._"}</Markdown></div>
      ) : (
        <Textarea id={id} rows={16} className="font-mono text-xs" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      <p className="mt-1 text-xs text-muted-foreground">Markdown: ## Heading, **bold**, *italic*, - list, [link](https://…), ![image](https://…), ```bash code```, | tables |, &gt; quote. Paste a YouTube link on its own line to embed it.</p>
    </div>
  );
}

function UploadInput({ id, folder, value, onChange }: { id: string; folder: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex gap-2">
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste a link or upload" />
      <label className="inline-flex shrink-0 cursor-pointer items-center rounded-md border border-border px-3 text-sm hover:bg-surface focus-within:ring-2 focus-within:ring-ring">
        {busy ? "Uploading…" : "Upload"}
        <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0]; e.target.value = "";
            if (!file) return;
            setBusy(true);
            try { onChange(await uploadMedia(file, folder)); toast.success("File uploaded"); }
            catch (err) { toast.error(err instanceof Error ? err.message : "Upload failed"); }
            finally { setBusy(false); }
          }} />
      </label>
    </div>
  );
}

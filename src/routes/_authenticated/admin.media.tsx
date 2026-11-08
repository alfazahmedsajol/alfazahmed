import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MEDIA_BUCKET, MEDIA_FOLDERS, mediaUrl, uploadMedia } from "@/lib/media";

export const Route = createFileRoute("/_authenticated/admin/media")({
  head: () => ({ meta: [{ title: "Media library — Admin" }, { name: "robots", content: "noindex" }] }),
  component: MediaLibrary,
});

function MediaLibrary() {
  const qc = useQueryClient();
  const [folder, setFolder] = useState<string>("general");
  const [busy, setBusy] = useState(false);
  const list = useQuery({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data;
    },
  });
  const del = useMutation({
    mutationFn: async (m: { id: string; path: string }) => {
      const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([m.path]);
      if (error) throw error;
      const { error: e2 } = await supabase.from("media").delete().eq("id", m.id);
      if (e2) throw e2;
    },
    onSuccess: () => { toast.success("File deleted"); qc.invalidateQueries({ queryKey: ["admin", "media"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      try { await uploadMedia(f, folder); toast.success(`Uploaded ${f.name}`); }
      catch (e) { toast.error(`${f.name}: ${e instanceof Error ? e.message : "upload failed"}`); }
    }
    setBusy(false);
    qc.invalidateQueries({ queryKey: ["admin", "media"] });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Media library</h1>
      <p className="mt-1 text-sm text-muted-foreground">Images (JPG, PNG, WEBP, GIF) and PDFs up to 10 MB. Copy a link to use it anywhere in the admin.</p>
      <div className="panel mt-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <label htmlFor="folder" className="text-sm">Folder</label>
        <select id="folder" value={folder} onChange={(e) => setFolder(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          {MEDIA_FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-within:ring-2 focus-within:ring-ring">
          {busy ? "Uploading…" : "Upload files"}
          <input type="file" multiple className="sr-only" disabled={busy} accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
        </label>
      </div>
      {list.isLoading ? <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
        : list.error ? <p className="mt-6 text-sm text-destructive">Could not load media.</p>
        : !list.data?.length ? <p className="panel mt-6 p-10 text-center text-sm text-muted-foreground">No files yet. Upload your first image or PDF above.</p>
        : (
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {list.data.map((m) => {
              const url = mediaUrl(m.path);
              return (
                <li key={m.id} className="panel overflow-hidden">
                  <div className="flex aspect-video items-center justify-center bg-surface">
                    {m.mime_type?.startsWith("image/")
                      ? <img src={url} alt={m.alt ?? m.file_name} loading="lazy" className="h-full w-full object-cover" />
                      : <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs" title={m.file_name}>{m.file_name}</p>
                    <p className="font-mono text-[0.65rem] text-muted-foreground">{m.path.split("/")[0]} · {Math.round((m.size_bytes ?? 0) / 1024)} KB</p>
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" variant="outline" aria-label={`Copy link for ${m.file_name}`} onClick={() => { navigator.clipboard.writeText(url); toast.success("Link copied"); }}><Copy className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="outline" aria-label={`Delete ${m.file_name}`} onClick={() => { if (confirm(`Delete ${m.file_name}?`)) del.mutate(m); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
}

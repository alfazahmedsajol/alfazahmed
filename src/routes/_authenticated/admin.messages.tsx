import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, ArchiveRestore, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Admin" }, { name: "robots", content: "noindex" }] }),
  component: Messages,
});

type View = "inbox" | "unread" | "archived";

function Messages() {
  const qc = useQueryClient();
  const [view, setView] = useState<View>("inbox");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const list = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: { is_read?: boolean; archived?: boolean } }) => {
      const { error } = await supabase.from("messages").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "messages"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Message deleted"); setDeleteId(null); setOpenId(null); qc.invalidateQueries({ queryKey: ["admin", "messages"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (list.data ?? []).filter((m) => {
      if (view === "archived" ? !m.archived : m.archived) return false;
      if (view === "unread" && m.is_read) return false;
      return !q || [m.name, m.email, m.subject, m.body].some((x) => (x ?? "").toLowerCase().includes(q));
    });
  }, [list.data, view, search]);
  const unread = (list.data ?? []).filter((m) => !m.is_read && !m.archived).length;
  const open = list.data?.find((m) => m.id === openId);

  function openMsg(id: string, isRead: boolean) {
    setOpenId(id);
    if (!isRead) update.mutate({ id, values: { is_read: true } });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Messages {unread > 0 && <span className="ml-2 rounded-full bg-primary/15 px-2.5 py-0.5 text-sm text-primary">{unread} unread</span>}</h1>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        {(["inbox", "unread", "archived"] as const).map((v) => (
          <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)}>{v[0]!.toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="panel divide-y divide-border">
          {list.isLoading ? <p className="p-6 text-sm text-muted-foreground">Loading…</p>
          : list.error ? <p className="p-6 text-sm text-destructive">Couldn't load messages.</p>
          : rows.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No messages here.</p>
          : rows.map((m) => (
            <button key={m.id} onClick={() => openMsg(m.id, m.is_read)} className={`block w-full p-4 text-left text-sm hover:bg-surface ${openId === m.id ? "bg-surface" : ""}`}>
              <div className="flex justify-between gap-2">
                <span className={m.is_read ? "text-muted-foreground" : "font-semibold text-foreground"}>{!m.is_read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />}{m.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 truncate text-muted-foreground">{m.subject ?? "(no subject)"}</p>
            </button>
          ))}
        </div>

        <div className="panel p-6">
          {!open ? <p className="text-sm text-muted-foreground">Select a message to read it.</p> : (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{open.subject ?? "(no subject)"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{open.name} · <a className="text-primary hover:underline" href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject ?? "")}`}>{open.email}</a></p>
                  <p className="text-xs text-muted-foreground">{new Date(open.created_at).toLocaleString()} · {open.archived ? "Archived" : open.is_read ? "Read" : "Unread"}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" aria-label={open.is_read ? "Mark unread" : "Mark read"} title={open.is_read ? "Mark unread" : "Mark read"} onClick={() => update.mutate({ id: open.id, values: { is_read: !open.is_read } })}>{open.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}</Button>
                  <Button size="icon" variant="ghost" aria-label={open.archived ? "Unarchive" : "Archive"} title={open.archived ? "Unarchive" : "Archive"} onClick={() => update.mutate({ id: open.id, values: { archived: !open.archived } })}>{open.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}</Button>
                  <Button size="icon" variant="ghost" aria-label="Delete" title="Delete" onClick={() => setDeleteId(open.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{open.body}</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this message?</AlertDialogTitle><AlertDialogDescription>This can't be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Alfaz Ahmed" },
      { name: "description", content: "Manage site content." },
      { property: "og:title", content: "Admin dashboard — Alfaz Ahmed" },
      { property: "og:description", content: "Manage site content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type T = "projects" | "blog_posts" | "skills" | "services" | "certifications" | "messages";
async function count(table: T, filter?: [string, string | boolean]) {
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) q = q.eq(filter[0], filter[1] as never);
  const { count: c, error } = await q;
  if (error) throw error;
  return c ?? 0;
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const admin = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("claim_owner_admin");
      if (error) throw error;
      return data === true;
    },
  });
  const stats = useQuery({
    enabled: admin.data === true,
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [p, pp, b, bp, s, sv, c, m] = await Promise.all([
        count("projects"), count("projects", ["status", "published"]),
        count("blog_posts"), count("blog_posts", ["status", "published"]),
        count("skills"), count("services"), count("certifications"),
        count("messages", ["is_read", false]),
      ]);
      const { data: msgs } = await supabase.from("messages").select("id,name,subject,created_at").order("created_at", { ascending: false }).limit(5);
      return { cards: [["Total projects", p], ["Published projects", pp], ["Blog posts", b], ["Published posts", bp], ["Skills", s], ["Services", sv], ["Certifications", c], ["Unread messages", m]] as const, msgs: msgs ?? [] };
    },
  });

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (admin.isLoading) return <p className="p-10 text-muted-foreground">Checking access…</p>;
  if (!admin.data)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">This account doesn't have admin access. Confirm your email first if you just signed up.</p>
        <Button className="mt-6" variant="outline" onClick={logout}>Sign out</Button>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <Button variant="outline" onClick={logout}>Log out</Button>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {(stats.data?.cards ?? []).map(([label, n]) => (
          <div key={label} className="panel p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl">{n}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-display text-xl">Recent messages</h2>
      <div className="panel mt-4 divide-y divide-border">
        {stats.data?.msgs.length ? stats.data.msgs.map((m) => (
          <div key={m.id} className="flex justify-between p-4 text-sm">
            <span>{m.name} — {m.subject ?? "(no subject)"}</span>
            <span className="text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
          </div>
        )) : <p className="p-4 text-sm text-muted-foreground">No messages yet.</p>}
      </div>
    </div>
  );
}

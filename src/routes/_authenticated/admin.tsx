import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { nav } from "@/components/admin/sections";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Alfaz Ahmed" },
      { name: "description", content: "Manage site content." },
      { property: "og:title", content: "Admin — Alfaz Ahmed" },
      { property: "og:description", content: "Manage site content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const linkCls = "block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface hover:text-foreground";
const activeCls = "bg-primary/10 text-primary";

function AdminLayout() {
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
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-background/60 p-4">
        <Link to="/" className="block px-3 font-display text-lg font-semibold">Alfaz Admin</Link>
        <nav className="mt-6 space-y-5">
          <Link to="/admin" activeOptions={{ exact: true }} className={linkCls} activeProps={{ className: activeCls }}>Dashboard</Link>
          {nav.map((g) => (
            <div key={g.group}>
              <p className="px-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{g.group}</p>
              <div className="mt-2 space-y-0.5">
                {g.items.map(([slug, label]) => (
                  <Link key={slug} to="/admin/$section" params={{ section: slug }} className={linkCls} activeProps={{ className: activeCls }}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
          <button onClick={logout} className={linkCls + " w-full text-left"}>Log out</button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1 p-6 lg:p-10"><Outlet /></div>
    </div>
  );
}

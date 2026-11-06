import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, FileText, FolderTree, Briefcase, Layers, Zap, Tags, Wrench, Award,
  Mail, BriefcaseBusiness, GraduationCap, Image, Settings, LogOut, type LucideIcon,
} from "lucide-react";
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

const icons: Record<string, LucideIcon> = {
  blog: FileText, "blog-categories": FolderTree, projects: Briefcase, "project-categories": Layers,
  skills: Zap, "skill-categories": Tags, services: Wrench, certifications: Award, messages: Mail,
  experience: BriefcaseBusiness, education: GraduationCap, media: Image, settings: Settings,
};

const linkCls =
  "flex items-center gap-2.5 rounded-md border-l-2 border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground";
const activeCls = "border-primary bg-primary/10 font-medium text-primary";

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
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-background/60">
        <div className="border-b border-border px-4 py-4">
          <Link to="/" className="block px-3 font-display text-lg font-semibold">Alfaz Admin</Link>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <Link to="/admin" activeOptions={{ exact: true }} className={linkCls} activeProps={{ className: activeCls }}>
            <LayoutDashboard className="h-4 w-4 shrink-0" /> Dashboard
          </Link>
          {nav.map((g) => (
            <div key={g.group} className="border-t border-border/60 pt-4">
              <p className="flex items-center gap-2 px-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {g.group}
              </p>
              <div className="mt-2 space-y-0.5">
                {g.items.map(([slug, label]) => {
                  const Icon = icons[slug] ?? FileText;
                  return (
                    <Link key={slug} to="/admin/$section" params={{ section: slug }} className={linkCls} activeProps={{ className: activeCls }}>
                      <Icon className="h-4 w-4 shrink-0" /> {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 p-6 lg:p-10"><Outlet /></div>
    </div>
  );
}

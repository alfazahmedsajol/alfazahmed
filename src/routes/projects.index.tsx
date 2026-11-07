import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, PageHeader, SectionHeading } from "@/components/site/section";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsQuery } from "@/lib/cms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Network, FTTH & Automation Builds | Alfaz Ahmed" },
      {
        name: "description",
        content:
          "Documented lab projects across networking, ISP & FTTH, Linux infrastructure and automation & AI, with filters and search.",
      },
      { property: "og:title", content: "Projects — Network, FTTH & Automation Builds" },
      {
        property: "og:description",
        content: "Lab builds and automation work, each with objectives, approach and outcome.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://alfazahmedsajol.lovable.app/projects" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  component: Projects,
});

function Projects() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [page, setPage] = useState(1);
  const { data } = useSuspenseQuery(projectsQuery);
  const projects = data.projects;
  const projectCategories = data.categories;
  const featuredProjects = projects.filter((p) => p.featured);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category, projects]);
  const PER = 9;
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const shown = filtered.slice((Math.min(page, pages) - 1) * PER, Math.min(page, pages) * PER);

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Builds, labs and automation experiments"
        description="Each project lists what it set out to do, how it was built and what came out of it — no invented clients or results."
      />

      <section className="py-14 sm:py-20">
        <Container>

          <SectionHeading eyebrow="Featured" title="Highlighted work" className="mt-10" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} className="relative">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-5 border-t border-border pt-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-sm">
              <label htmlFor="project-search" className="sr-only">
                Search projects
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="project-search"
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by title or technology"
                className="pl-9"
              />
            </div>
            <div
              role="group"
              aria-label="Filter projects by category"
              className="flex flex-wrap gap-2"
            >
              {["All", ...projectCategories].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => { setCategory(c); setPage(1); }}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    category === c
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <p aria-live="polite" className="mt-6 font-mono text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"} shown
          </p>

          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 60} className="relative">
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          ) : null}
          {pages > 1 && (
            <nav aria-label="Projects pagination" className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" aria-current={n === page ? "page" : undefined} onClick={() => setPage(n)}
                  className={cn("h-9 min-w-9 rounded-md border px-3 text-sm", n === page ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>{n}</button>
              ))}
            </nav>
          )}
          {filtered.length === 0 && (
            <div className="panel mt-6 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No projects match that search. Try a different term or clear the filters.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

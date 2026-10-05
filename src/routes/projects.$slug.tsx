import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/site/cards";
import { Markdown } from "@/components/site/markdown";
import { Container, Eyebrow } from "@/components/site/section";
import { projectQuery, projectsQuery } from "@/lib/cms";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params, context }) => {
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    context.queryClient.prefetchQuery(projectsQuery);
    return { project };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project not found — Alfaz Ahmed" }, { name: "robots", content: "noindex" }] };
    const title = p.seoTitle || `${p.title} — Projects | Alfaz Ahmed`;
    const desc = p.seoDescription || p.summary;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: `/projects/${params.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: desc, author: { "@type": "Person", name: "Alfaz Ahmed" }, keywords: p.stack.join(", ") }),
      }],
    };
  },
  errorComponent: () => <Container className="py-24 text-center text-muted-foreground">Could not load this project. Please try again.</Container>,
  notFoundComponent: ProjectNotFound,
  component: ProjectDetail,
});

function ProjectNotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Project not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">This project may have been renamed or removed.</p>
      <Button asChild className="mt-8"><Link to="/projects">Back to projects</Link></Button>
    </Container>
  );
}

function Block({ title, text }: { title: string; text: string | null }) {
  if (!text?.trim()) return null;
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="prose-tech mt-4"><Markdown>{text}</Markdown></div>
    </section>
  );
}

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(projectsQuery);
  const related = all.projects
    .filter((p) => p.slug !== project.slug)
    .map((p) => ({ p, s: (p.category === project.category ? 2 : 0) + p.stack.filter((t) => project.stack.includes(t)).length }))
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3).map((x) => x.p);

  return (
    <article>
      <header className="border-b border-border bg-surface/40">
        <Container className="py-14 sm:py-20">
          <div className="max-w-3xl">
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All projects
            </Link>
            <div className="mt-6"><Eyebrow>{project.category}</Eyebrow></div>
            <h1 className="mt-4 break-words text-3xl font-semibold text-foreground sm:text-4xl">{project.title}</h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{project.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((t) => <li key={t}><TagChip>{t}</TagChip></li>)}
            </ul>
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-10">
          {project.cover && <img src={project.cover} alt={`${project.title} cover`} loading="lazy" className="w-full rounded-lg border border-border" />}
          <Block title="Problem" text={project.problem} />
          <Block title="Objective" text={project.objective} />
          <Block title="Architecture" text={project.architecture} />
          {project.diagram && (
            <figure>
              <img src={project.diagram} alt={`${project.title} architecture diagram`} loading="lazy" className="w-full rounded-lg border border-border bg-surface" />
              <figcaption className="mt-2 text-xs text-muted-foreground">Architecture diagram</figcaption>
            </figure>
          )}
          <Block title="Implementation" text={project.implementation} />
          {project.configuration?.trim() && (
            <section>
              <h2 className="text-xl font-semibold text-foreground">Configuration / workflow</h2>
              <div className="prose-tech mt-4"><Markdown>{"```\n" + project.configuration + "\n```"}</Markdown></div>
            </section>
          )}
          <Block title="Results" text={project.results} />
          <Block title="Lessons learned" text={project.lessons} />
          <Block title="Notes" text={project.content} />
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">Project details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Category</dt><dd className="text-right text-foreground">{project.category}</dd></div>
              {project.year && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Year</dt><dd className="text-right text-foreground">{project.year}</dd></div>}
              {project.status && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Status</dt><dd className="text-right text-foreground">{project.status}</dd></div>}
            </dl>
            <div className="mt-6 space-y-2">
              {project.github && <Button asChild variant="outline" className="w-full"><a href={project.github} target="_blank" rel="noopener noreferrer"><Github className="mr-1.5 h-4 w-4" aria-hidden="true" />Source code</a></Button>}
              {project.demo && <Button asChild variant="outline" className="w-full"><a href={project.demo} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1.5 h-4 w-4" aria-hidden="true" />Live demo</a></Button>}
              <Button asChild className="w-full"><Link to="/contact">Discuss similar work</Link></Button>
            </div>
          </div>
          {related.length > 0 && (
            <div className="panel p-6">
              <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">Related projects</h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}><Link to="/projects/$slug" params={{ slug: r.slug }} className="text-sm text-foreground transition-colors hover:text-primary">{r.title}</Link></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>
    </article>
  );
}

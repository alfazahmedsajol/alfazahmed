import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, DemoNotice, Eyebrow } from "@/components/site/section";
import { getProject, projects } from "@/data/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project not found — Alfaz Ahmed" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.title} — Projects | Alfaz Ahmed` },
        { name: "description", content: project.summary },
        { property: "og:title", content: `${project.title} — Projects` },
        { property: "og:description", content: project.summary },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectDetail,
});

function ProjectNotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Project not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">This project may have been renamed or removed.</p>
      <Button asChild className="mt-8">
        <Link to="/projects">Back to projects</Link>
      </Button>
    </Container>
  );
}

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const related = projects.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 2);

  return (
    <article>
      <header className="border-b border-border bg-surface/40">
        <Container className="py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All projects
            </Link>
            <div className="mt-6">
              <Eyebrow>{project.category}</Eyebrow>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">{project.title}</h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {project.summary}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t}>
                  <TagChip>{t}</TagChip>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <DemoNotice>Demo lab project — {project.year}</DemoNotice>
            </div>
          </Reveal>
        </Container>
      </header>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_280px] sm:py-20">
        <div className="space-y-10">
          <Reveal>
            <h2 className="text-xl font-semibold text-foreground">Overview</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {project.overview}
            </p>
          </Reveal>

          <Reveal>
            <h2 className="text-xl font-semibold text-foreground">Objectives</h2>
            <ul className="mt-4 space-y-2">
              {project.objectives.map((o) => (
                <li key={o} className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="text-xl font-semibold text-foreground">Approach</h2>
            <ol className="mt-4 space-y-4">
              {project.approach.map((a, i) => (
                <li key={a} className="panel flex gap-4 p-5">
                  <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{a}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <h2 className="text-xl font-semibold text-foreground">Outcome</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {project.outcome}
            </p>
          </Reveal>
        </div>

        <aside className="space-y-6">
          <Reveal className="panel p-6">
            <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
              Project details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="text-right text-foreground">{project.category}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Year</dt>
                <dd className="text-right text-foreground">{project.year}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="text-right text-foreground">Lab / study build</dd>
              </div>
            </dl>
            <Button asChild className="mt-6 w-full">
              <Link to="/contact">Discuss similar work</Link>
            </Button>
          </Reveal>

          {related.length > 0 ? (
            <Reveal className="panel p-6">
              <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                Related projects
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: r.slug }}
                      className="text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </aside>
      </Container>
    </article>
  );
}

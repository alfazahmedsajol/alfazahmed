import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";

import type { Project } from "@/data/projects";
import { formatDate, type BlogPost } from "@/data/blog";

export function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[0.68rem] text-muted-foreground">
      {children}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="panel panel-hover group flex h-full flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-primary">
          {project.category}
        </span>
        <span className="font-mono text-[0.68rem] text-muted-foreground">{project.year}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          <span className="relative">{project.title}</span>
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((t) => (
          <li key={t}>
            <TagChip>{t}</TagChip>
          </li>
        ))}
      </ul>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        View project
        <ArrowUpRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </article>
  );
}

export function BlogCard({ post }: { post: Pick<BlogPost, "slug" | "title" | "category" | "date" | "excerpt" | "tags" | "readingTime"> }) {
  return (
    <article className="panel panel-hover group relative flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-primary">
          {post.category}
        </span>
        <span className="font-mono text-[0.68rem] text-muted-foreground">{formatDate(post.date)}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        <Link to="/blog/$slug" params={{ slug: post.slug }} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((t) => (
            <li key={t}>
              <TagChip>#{t}</TagChip>
            </li>
          ))}
        </ul>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {post.readingTime}
        </span>
      </div>
    </article>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogCard, TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, PageHeader, SectionHeading } from "@/components/site/section";
import { blogCategories, blogPosts, featuredPost, formatDate } from "@/data/blog";
import { cn } from "@/lib/utils";

const PER_PAGE = 4;

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Networking, FTTH, Linux & Automation Notes | Alfaz Ahmed" },
      {
        name: "description",
        content:
          "Technical writing on RouterOS firewalls, PPPoE access networks, Linux monitoring, Python automation and AI-assisted network operations.",
      },
      { property: "og:title", content: "Blog — Networking & Automation Notes" },
      {
        property: "og:description",
        content: "Lab notes, configuration decisions and automation experiments.",
      },
    ],
  }),
  component: Blog,
});

function Blog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const rest = blogPosts.filter((p) => p.slug !== featuredPost.slug);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rest.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the lab and the console"
        description="Practical writing about network configuration, fiber access, Linux infrastructure and automation — the things I'd want to read while solving the same problem."
      />

      <section className="border-b border-border py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Featured" title="Latest featured article" />
          <Reveal className="panel panel-hover relative mt-8 grid gap-8 p-8 lg:grid-cols-[1.3fr_0.7fr] sm:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-primary">
                  {featuredPost.category}
                </span>
                <span className="font-mono text-[0.68rem] text-muted-foreground">
                  {formatDate(featuredPost.date)}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {featuredPost.readingTime}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                <Link
                  to="/blog/$slug"
                  params={{ slug: featuredPost.slug }}
                  className="after:absolute after:inset-0"
                >
                  {featuredPost.title}
                </Link>
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featuredPost.excerpt}
              </p>
            </div>
            <ul className="flex flex-wrap content-start gap-2 lg:justify-end">
              {featuredPost.tags.map((t) => (
                <li key={t}>
                  <TagChip>#{t}</TagChip>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-sm">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="blog-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search articles and tags"
                className="pl-9"
              />
            </div>
            <div role="group" aria-label="Filter articles by category" className="flex flex-wrap gap-2">
              {["All", ...blogCategories].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => {
                    setCategory(c);
                    setPage(1);
                  }}
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
            {filtered.length} {filtered.length === 1 ? "article" : "articles"} · page {current} of{" "}
            {totalPages}
          </p>

          {visible.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {visible.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 2) * 60}>
                  <BlogCard post={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="panel mt-6 p-10 text-center">
              <p className="text-sm text-muted-foreground">No articles match that search.</p>
            </div>
          )}

          {totalPages > 1 ? (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={n === current ? "page" : undefined}
                  onClick={() => setPage(n)}
                  className={cn(
                    "h-9 w-9 rounded-md border text-sm transition-colors",
                    n === current
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {n}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={current === totalPages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </nav>
          ) : null}

          <div className="mt-16 border-t border-border pt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">Tags</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {allTags.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(t);
                      setPage(1);
                    }}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    #{t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}

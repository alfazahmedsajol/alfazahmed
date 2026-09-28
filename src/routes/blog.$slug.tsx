import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, Eyebrow } from "@/components/site/section";
import { blogPosts, formatDate, getPost } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found — Alfaz Ahmed" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} — Blog | Alfaz Ahmed` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: `${post.title} — Blog` },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: PostDetail,
});

function PostNotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Article not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">This post may have been renamed or removed.</p>
      <Button asChild className="mt-8">
        <Link to="/blog">Back to blog</Link>
      </Button>
    </Container>
  );
}

function PostDetail() {
  const { post } = Route.useLoaderData();
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article>
      <header className="border-b border-border bg-surface/40">
        <Container className="py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All articles
            </Link>
            <div className="mt-6">
              <Eyebrow>{post.category}</Eyebrow>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
              <span>{formatDate(post.date)}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {post.readingTime}
              </span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t}>
                  <TagChip>#{t}</TagChip>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </header>

      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="border-l-2 border-primary pl-5 text-base leading-relaxed text-foreground sm:text-lg">
            {post.excerpt}
          </p>

          <div className="mt-12 space-y-10">
            {post.body.map((section) => (
              <Reveal key={section.heading} as="section">
                <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((p) => (
                    <p key={p} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {p}
                    </p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-5 space-y-2">
                    {section.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            ))}
          </div>

          <div className="panel mt-14 p-7">
            <h2 className="text-base font-semibold text-foreground">Keep reading</h2>
            <ul className="mt-4 space-y-3">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/contact">Ask me about this topic</Link>
            </Button>
          </div>
        </div>
      </Container>
    </article>
  );
}

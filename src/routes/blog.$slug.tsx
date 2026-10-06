import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Link2, Linkedin, Twitter, Facebook } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, Eyebrow } from "@/components/site/section";
import { Markdown, headingsOf } from "@/components/site/markdown";
import { formatDate } from "@/data/blog";
import { blogListQuery, blogPostQuery } from "@/lib/cms";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData(blogPostQuery(params.slug));
    if (!post) throw notFound();
    await context.queryClient.ensureQueryData(blogListQuery);
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found — Alfaz Ahmed" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const title = post.seoTitle || `${post.title} — Blog | Alfaz Ahmed`;
    const desc = post.seoDescription || post.excerpt;
    const image = post.ogImage || post.cover;
    const canonical = post.canonical || `/blog/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: desc,
          datePublished: post.date, author: { "@type": "Person", name: post.author },
          ...(image?.startsWith("https://") ? { image } : {}), keywords: post.tags.join(", "),
        }),
      }],
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
      <Button asChild className="mt-8"><Link to="/blog">Back to blog</Link></Button>
    </Container>
  );
}

function PostDetail() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(blogPostQuery(slug));
  const { data: list } = useSuspenseQuery(blogListQuery);
  if (!post) return <PostNotFound />;
  const toc = headingsOf(post.content);
  const related = list.posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);

  const share = (kind: "x" | "linkedin" | "facebook" | "copy") => {
    const url = window.location.href;
    const t = encodeURIComponent(post.title);
    const u = encodeURIComponent(url);
    if (kind === "copy") { navigator.clipboard.writeText(url).then(() => toast.success("Link copied")); return; }
    const href = kind === "x" ? `https://twitter.com/intent/tweet?text=${t}&url=${u}`
      : kind === "linkedin" ? `https://www.linkedin.com/sharing/share-offsite/?url=${u}`
      : `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <article>
      <header className="border-b border-border bg-surface/40">
        <Container className="py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All articles
            </Link>
            <div className="mt-6"><Eyebrow>{post.category}</Eyebrow></div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
              <span>By {post.author}</span>
              <span>{formatDate(post.date)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{post.readingTime}</span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((t) => <li key={t}><TagChip>#{t}</TagChip></li>)}
            </ul>
          </Reveal>
        </Container>
      </header>

      <Container className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_220px]">
          <div className="min-w-0">
            {post.cover && <img src={post.cover} alt={`Cover image for ${post.title}`} className="mb-10 w-full rounded-xl border border-border" />}
            {post.excerpt && <p className="border-l-2 border-primary pl-5 text-base leading-relaxed text-foreground sm:text-lg">{post.excerpt}</p>}
            <div className="mt-10"><Markdown>{post.content}</Markdown></div>

            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <span className="mr-2 text-sm text-muted-foreground">Share:</span>
              <Button size="icon" variant="outline" aria-label="Share on X" onClick={() => share("x")}><Twitter className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" aria-label="Share on LinkedIn" onClick={() => share("linkedin")}><Linkedin className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" aria-label="Share on Facebook" onClick={() => share("facebook")}><Facebook className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" aria-label="Copy link" onClick={() => share("copy")}><Link2 className="h-4 w-4" /></Button>
            </div>

            {related.length > 0 && (
              <div className="panel mt-10 p-7">
                <h2 className="text-base font-semibold text-foreground">Related posts</h2>
                <ul className="mt-4 space-y-3">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <Link to="/blog/$slug" params={{ slug: p.slug }} className="text-sm text-muted-foreground transition-colors hover:text-primary">{p.title}</Link>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-6"><Link to="/contact">Ask me about this topic</Link></Button>
              </div>
            )}
          </div>

          {toc.length >= 3 && (
            <aside className="hidden lg:block">
              <nav aria-label="Table of contents" className="sticky top-24">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">On this page</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {toc.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                      <a href={`#${h.id}`} className="text-muted-foreground hover:text-primary">{h.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
      </Container>
    </article>
  );
}

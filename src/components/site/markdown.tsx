import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import "highlight.js/styles/github-dark.css";

function youtubeId(href: string) {
  const m = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m?.[1];
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-tech">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          a: ({ href = "", children: c }) => {
            const yt = youtubeId(href);
            if (yt && String(c) === href)
              return (
                <span className="my-6 block aspect-video overflow-hidden rounded-lg border border-border">
                  <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${yt}`} title="Video" allowFullScreen loading="lazy" />
                </span>
              );
            return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{c}</a>;
          },
          img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" className="rounded-lg border border-border" />,
          table: ({ children: c }) => <div className="overflow-x-auto"><table>{c}</table></div>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function headingsOf(md: string) {
  return [...md.matchAll(/^(##|###) (.+)$/gm)].map((m) => ({
    level: m[1]!.length,
    text: m[2]!.trim(),
    id: m[2]!.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-"),
  }));
}

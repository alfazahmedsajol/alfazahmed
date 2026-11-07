import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import "highlight.js/styles/github-dark.css";

function youtubeId(href: string) {
  const m = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m?.[1];
}

function CodeBlock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(ref.current?.innerText ?? "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border border-border bg-background/80 px-2 py-1 font-mono text-xs text-muted-foreground opacity-80 backdrop-blur transition hover:text-primary group-hover:opacity-100"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  );
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
          pre: ({ children: c }) => <CodeBlock>{c}</CodeBlock>,
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

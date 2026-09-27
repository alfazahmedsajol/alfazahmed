import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, DemoNotice, PageHeader } from "@/components/site/section";
import { skillCategories } from "@/data/skills";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Networking, Linux, Automation & AI | Alfaz Ahmed" },
      {
        name: "description",
        content:
          "Skill breakdown across networking, MikroTik, ISP/FTTH, OLT, Linux, security, automation, AI, programming, monitoring and cloud.",
      },
      { property: "og:title", content: "Skills — Networking, Linux, Automation & AI" },
      {
        property: "og:description",
        content: "A category-by-category view of the technologies I work with and where I'm improving.",
      },
    ],
  }),
  component: Skills,
});

function Skills() {
  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="A transparent view of what I can do today"
        description="Every skill is labeled with an honest level: what I use confidently, what I'm practising, and what I'm still learning."
      />

      <section className="py-14 sm:py-20">
        <Container>
          <Reveal className="flex flex-wrap items-center gap-4">
            <DemoNotice>Levels are self-assessed and updated as I progress</DemoNotice>
            <nav aria-label="Skill categories" className="flex flex-wrap gap-2">
              {skillCategories.map((c) => (
                <a
                  key={c.slug}
                  href={`#${c.slug}`}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {c.title}
                </a>
              ))}
            </nav>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {skillCategories.map((cat, i) => (
              <Reveal key={cat.slug} delay={(i % 2) * 70}>
                <section id={cat.slug} className="panel h-full scroll-mt-24 p-7">
                  <h2 className="text-lg font-semibold text-foreground">{cat.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cat.summary}</p>
                  <ul className="mt-6 space-y-4">
                    {cat.skills.map((s) => (
                      <li key={s.name} className="border-t border-border pt-4 first:border-0 first:pt-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground">{s.name}</span>
                          <TagChip>{s.level}</TagChip>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/projects">See these skills applied</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Discuss a project</Link>
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

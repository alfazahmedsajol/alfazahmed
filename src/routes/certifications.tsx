import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { Container, DemoNotice, PageHeader } from "@/components/site/section";
import { certifications } from "@/data/resume";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications & Study Track — Alfaz Ahmed" },
      {
        name: "description",
        content:
          "An honest certification track covering MikroTik, Cisco and self-study in Linux administration and network automation with Python.",
      },
      { property: "og:title", content: "Certifications & Study Track" },
      {
        property: "og:description",
        content: "MikroTik, Cisco and self-study tracks — each marked with its real status.",
      },
    ],
  }),
  component: Certifications,
});

function Certifications() {
  return (
    <>
      <PageHeader
        eyebrow="Certifications"
        title="What I'm studying, stated honestly"
        description="Nothing here is presented as an awarded credential unless it is. Each entry shows its real status: in progress, planned or self-study."
      />

      <section className="py-14 sm:py-20">
        <Container>
          <Reveal>
            <DemoNotice>Statuses update as exams are completed</DemoNotice>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 70}>
                <article className="panel panel-hover flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-primary">
                      <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
                      {c.status}
                    </span>
                  </div>
                  <h2 className="mt-5 text-base font-semibold text-foreground">{c.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.issuer} · {c.year}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="panel mt-14 p-8 sm:p-10">
            <h2 className="text-xl font-semibold text-foreground">Study approach</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every syllabus topic gets built in the lab before it counts as learned. Configuration is
              exported, documented and rebuilt from scratch at least once — that repetition is what turns
              exam material into working knowledge.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/projects">See the lab work</Link>
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

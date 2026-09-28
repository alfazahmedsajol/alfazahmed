import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, DemoNotice, PageHeader } from "@/components/site/section";
import { certifications, education, experience, resumeSummary } from "@/data/resume";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { site } from "@/data/site";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Alfaz Ahmed, Network & Automation Engineer" },
      {
        name: "description",
        content:
          "Resume of Alfaz Ahmed: summary, skills, experience, projects, education and certification track in networking, Linux and automation.",
      },
      { property: "og:title", content: "Resume — Alfaz Ahmed" },
      {
        property: "og:description",
        content: "Summary, skills, experience, projects, education and certifications.",
      },
    ],
  }),
  component: Resume,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="border-t border-border pt-8">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{title}</h2>
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}

function Resume() {
  return (
    <>
      <PageHeader
        eyebrow="Resume"
        title="Alfaz Ahmed — Network & Automation Engineer"
        description={site.role}
      />

      <section className="py-14 sm:py-20">
        <Container>
          <Reveal className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex flex-wrap gap-5 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> {site.phone}
              </a>
            </div>
            <Button
              onClick={() =>
                toast.info("CV download will be enabled once the PDF is uploaded in the next phase.")
              }
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download CV
            </Button>
          </Reveal>

          <div className="panel mt-10 space-y-10 p-8 sm:p-10">
            <Reveal as="section">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Summary</h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {resumeSummary}
              </p>
              <div className="mt-5">
                <DemoNotice>Placeholder resume content — replace with final details</DemoNotice>
              </div>
            </Reveal>

            <Section title="Skills">
              <div className="grid gap-5 sm:grid-cols-2">
                {skillCategories.map((c) => (
                  <div key={c.slug}>
                    <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {c.skills.map((s) => (
                        <li key={s.name}>
                          <TagChip>{s.name}</TagChip>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Experience">
              <ul className="space-y-7">
                {experience.map((e) => (
                  <li key={e.role}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold text-foreground">{e.role}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{e.period}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
                    <ul className="mt-3 space-y-2">
                      {e.points.map((p) => (
                        <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Projects">
              <ul className="grid gap-4 sm:grid-cols-2">
                {projects.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: p.slug }}
                      className="block rounded-lg border border-border bg-background/50 p-5 transition-colors hover:border-primary/50"
                    >
                      <span className="block text-sm font-semibold text-foreground">{p.title}</span>
                      <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                        {p.summary}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Education">
              <ul className="space-y-5">
                {education.map((e) => (
                  <li key={e.title}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold text-foreground">{e.title}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{e.period}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Certifications">
              <ul className="space-y-3">
                {certifications.map((c) => (
                  <li
                    key={c.title}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-foreground">
                      {c.title} <span className="text-muted-foreground">· {c.issuer}</span>
                    </span>
                    <TagChip>{c.status}</TagChip>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </Container>
      </section>
    </>
  );
}

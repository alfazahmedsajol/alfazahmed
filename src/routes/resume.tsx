import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, PageHeader } from "@/components/site/section";
import { resumeSummary } from "@/data/resume";
import { useQuery } from "@tanstack/react-query";
import { certificationsQuery, educationQuery, experienceQuery, formatPeriod, projectsQuery, settingsQuery } from "@/lib/cms";
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
      { property: "og:type", content: "profile" },
    ],
    links: [{ rel: "canonical", href: "https://alfazahmedsajol.lovable.app/resume" }],
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
  const projQ = useQuery(projectsQuery);
  const experience = useQuery(experienceQuery).data ?? [];
  const education = useQuery(educationQuery).data ?? [];
  const certifications = useQuery(certificationsQuery).data ?? [];
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
            <CvButton />
          </Reveal>

          <div className="panel mt-10 space-y-10 p-8 sm:p-10">
            <Reveal as="section">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Summary</h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {resumeSummary}
              </p>
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
                  <li key={e.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold text-foreground">{e.role}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{formatPeriod(e.start_date, e.end_date, e.is_current)}</span>
                    </div>
                    {e.company && <p className="mt-1 text-sm text-muted-foreground">{e.company}</p>}
                    <ul className="mt-3 space-y-2">
                      {(e.description ?? "").split("\n").map((p) => p.replace(/^[-*•]\s*/, "").trim()).filter(Boolean).map((p) => (
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
                {(projQ.data?.projects ?? []).slice(0, 4).map((p) => (
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
                  <li key={e.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold text-foreground">{e.degree}{e.field ? ` — ${e.field}` : ""}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{formatPeriod(e.start_date, e.end_date)}</span>
                    </div>
                    {e.institution && <p className="mt-1 text-sm text-muted-foreground">{e.institution}</p>}
                    {e.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description}</p>}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Certifications">
              <ul className="space-y-3">
                {certifications.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-foreground">
                      {c.name} {c.issuer && <span className="text-muted-foreground">· {c.issuer}</span>}
                    </span>
                    <TagChip>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</TagChip>
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

function CvButton() {
  const { data } = useQuery(settingsQuery);
  const url = (data?.general?.["resume_url"] ?? "").trim();
  if (!url) {
    return (
      <Button disabled title="CV not available yet">
        <Download className="mr-2 h-4 w-4" aria-hidden="true" /> CV coming soon
      </Button>
    );
  }
  return (
    <Button asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download CV
      </a>
    </Button>
  );
}

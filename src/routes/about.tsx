import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { Container, PageHeader, SectionHeading } from "@/components/site/section";
import { timeline } from "@/data/resume";
import { useQuery } from "@tanstack/react-query";
import { aboutQuery } from "@/lib/cms";
import { defaultAbout } from "@/data/about";
import { AboutPhotoGrid } from "@/components/site/about-photos";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Alfaz Ahmed — Network & Automation Engineer" },
      {
        name: "description",
        content:
          "How I work across networking, infrastructure and automation — my focus areas, technical interests, career vision and working philosophy.",
      },
      { property: "og:title", content: "About Alfaz Ahmed — Network & Automation Engineer" },
      {
        property: "og:description",
        content: "Focus areas, technical interests, career vision and working philosophy.",
      },
    ],
    links: [{ rel: "canonical", href: "https://alfazahmedsajol.lovable.app/about" }],
  }),
  component: About,
});

function About() {
  const { data: a = defaultAbout } = useQuery(aboutQuery);
  const sections = a.sections;
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={a.pageTitle}
        description={a.pageDescription}
      />

      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Introduction"
            title={a.introTitle}
            description={a.introDescription}
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <article className="panel h-full p-7">
                  <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
                  <div className="mt-4 space-y-3">
                    {s.body.map((p) => (
                      <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {a.photos.length ? (
        <section className="border-b border-border py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Gallery" title="Work in the field" description="Moments from sites, racks and deployments." />
            <div className="mt-10"><AboutPhotoGrid photos={a.photos} /></div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Timeline"
            title="Where I am and where I'm heading"
            description="A simple view of current focus and the next steps in the plan."
          />
          <ol className="mt-12 relative border-l border-border pl-6 sm:pl-8">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.title} delay={i * 80} className="relative pb-10 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background sm:-left-[calc(2rem+5px)]"
                />
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">
                  {t.period}
                </p>
                <h3 className="mt-2 text-base font-semibold text-foreground">{t.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Reveal className="flex flex-wrap items-center justify-between gap-6 panel p-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Want the condensed version?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The resume page lays out skills, projects and education in one place.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/resume">View Resume</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Me</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

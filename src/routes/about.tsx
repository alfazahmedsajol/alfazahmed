import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { Container, DemoNotice, PageHeader, SectionHeading } from "@/components/site/section";
import { timeline } from "@/data/resume";

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

const sections = [
  {
    title: "What I Do",
    body: [
      "I design, configure and document networks — MikroTik edges, VLAN segmentation, PPPoE subscriber access and fiber delivery — and the Linux infrastructure that supports them.",
      "On top of that I build automation: scheduled configuration backups, API-driven changes, health checks, and workflows that turn monitoring events into clear, actionable notifications.",
    ],
  },
  {
    title: "Technical Interests",
    body: [
      "Service-provider scale routing, FTTH access networks and optical troubleshooting are where I spend most of my study time.",
      "Alongside that, I'm interested in how AI can assist operations — not by configuring devices, but by making noisy machine output readable, so engineers spend less time reading logs and more time fixing causes.",
    ],
  },
  {
    title: "Career Vision",
    body: [
      "My goal is to work on networks where reliability is measured, not assumed: documented topologies, versioned configuration, monitoring that reflects reality and automation that removes human error from routine tasks.",
      "I'm building toward service-provider and large infrastructure environments, with network automation as the core specialisation.",
    ],
  },
  {
    title: "Working Philosophy",
    body: [
      "Document before you configure. A written addressing plan and a clear intent make every later change safer.",
      "Automate anything done more than twice. Manual repetition is where mistakes and outages come from.",
      "Be honest about scope. I'd rather say what I'm still learning than claim experience I don't have.",
    ],
  },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Networking, infrastructure and automation — practised deliberately"
        description="I'm Alfaz Ahmed, a network and infrastructure engineer focused on MikroTik, FTTH access networks, Linux and automation, with a growing focus on AI-assisted operations."
      />

      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Introduction"
            title="A professional introduction"
            description="Most of my work starts the same way: understand what the network needs to deliver, write down the plan, then build it in a way that can be rebuilt. I care about configurations that another engineer can read, monitoring that supports real decisions, and automation that quietly removes daily toil."
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

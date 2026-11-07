import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Cable, Network, Router, Server, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, PageHeader } from "@/components/site/section";
import { useSuspenseQuery } from "@tanstack/react-query";
import { servicesQuery } from "@/lib/cms";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — MikroTik, ISP, FTTH, Linux & Automation | Alfaz Ahmed" },
      {
        name: "description",
        content:
          "Network and infrastructure services: MikroTik configuration, ISP/PPPoE networks, OLT/FTTH, Linux infrastructure, network automation and AI automation.",
      },
      { property: "og:title", content: "Services — Networking, Infrastructure & Automation" },
      {
        property: "og:description",
        content: "MikroTik, ISP/PPPoE, OLT/FTTH, Linux, network automation and AI-assisted workflows.",
      },
    ],
    links: [{ rel: "canonical", href: "https://alfazahmedsajol.lovable.app/services" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Services,
});

const icons: Record<string, typeof Router> = {
  router: Router,
  network: Network,
  fiber: Cable,
  server: Server,
  workflow: Workflow,
  brain: Brain,
};

function Services() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Practical help with networks, infrastructure and automation"
        description="Each engagement includes documentation: an addressing plan, configuration export and a short handover note, so the work stays maintainable after it's delivered."
      />

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s, i) => {
              const Icon = icons[s.icon ?? ""] ?? Network;
              return (
                <Reveal key={s.id} delay={(i % 2) * 70}>
                  <article id={s.slug ?? s.id} className="panel panel-hover flex h-full scroll-mt-24 flex-col p-7">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background/60 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                    {s.details && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.details}</p>}
                    {s.features.length > 0 && (
                      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {s.features.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    )}
                    <div className="mt-6">
                      <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                        Technologies
                      </h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {s.technologies.map((t) => (
                          <li key={t}>
                            <TagChip>{t}</TagChip>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild variant="outline" className="mt-6 self-start">
                      <Link to="/contact">{s.cta ?? "Get in touch"}</Link>
                    </Button>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="panel mt-14 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-semibold text-foreground">
              Not sure which of these you need?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Describe the problem — slow links, messy firewall rules, manual provisioning — and I&apos;ll
              suggest the shortest path to a stable setup.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/contact">Let&apos;s Work Together</Link>
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Maximize2 } from "lucide-react";
import { useState } from "react";

import { TagChip } from "@/components/site/cards";
import { Reveal } from "@/components/site/reveal";
import { Container, PageHeader, SectionHeading } from "@/components/site/section";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  experiments, gearGroups, labIntro, labStatusLabel, serviceGroups, topologyTiers,
  type GearItem, type LabStatus, type TopologyNode,
} from "@/data/lab";
import { cn } from "@/lib/utils";

const URL = "https://alfazahmedsajol.lovable.app/lab";
const DESC = "Inside Alfaz Ahmed's ISP network and automation lab: Dual-IIG BGP topology, MikroTik, GNS3/CHR emulation, n8n automation and monitoring.";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Lab — ISP Network & Automation Lab | Alfaz Ahmed" },
      { name: "description", content: DESC },
      { property: "og:title", content: "ISP Network & Automation Lab — Alfaz Ahmed" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: LabPage,
});

export function StatusBadge({ status }: { status: LabStatus }) {
  const icon = status === "active" ? "●" : status === "progress" ? "⚡" : "🧪";
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] font-semibold",
      status === "active" && "border-primary/40 bg-primary/10 text-primary shadow-[0_0_12px_-4px_var(--color-primary)]",
      status === "progress" && "border-accent/40 bg-accent/10 text-accent-foreground",
      status === "experiment" && "border-border bg-muted text-muted-foreground",
    )}>
      <span aria-hidden="true" className={cn(status === "active" && "animate-pulse")}>{icon}</span>
      {labStatusLabel[status]}
    </span>
  );
}

function Topology({ selected, onSelect, large }: { selected: string; onSelect: (n: TopologyNode) => void; large?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {topologyTiers.map((tier, ti) => (
        <div key={tier.name} className="flex w-full flex-col items-center gap-2">
          {ti > 0 && <div aria-hidden="true" className="h-6 w-0.5 bg-gradient-to-b from-primary/70 to-primary/20" />}
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{tier.name}</p>
          <div className="flex w-full flex-wrap justify-center gap-3">
            {tier.nodes.map((n) => (
              <button
                key={n.id}
                type="button"
                title={n.details.join(" · ")}
                onClick={() => onSelect(n)}
                className={cn(
                  "rounded-lg border bg-card px-4 py-3 text-left transition hover:border-primary/60 hover:shadow-[0_0_20px_-8px_var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  large ? "min-w-[13rem]" : "min-w-[10rem]",
                  selected === n.id ? "border-primary shadow-[0_0_20px_-8px_var(--color-primary)]" : "border-border",
                )}
              >
                <span className="block text-sm font-semibold text-foreground">{n.label}</span>
                <span className="block font-mono text-[0.7rem] text-muted-foreground">{n.role}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NodeDetails({ node }: { node: TopologyNode }) {
  return (
    <div className="panel p-5" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{node.role}</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">{node.label}</h3>
      <ul className="mt-3 space-y-1.5 font-mono text-sm text-muted-foreground">
        {node.details.map((d) => <li key={d}>› {d}</li>)}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">{node.chips.map((c) => <TagChip key={c}>{c}</TagChip>)}</div>
    </div>
  );
}

function ItemCard({ item }: { item: GearItem }) {
  return (
    <article className="panel panel-hover h-full p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="text-base font-semibold text-foreground">{item.name}</h4>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{item.chips.map((c) => <TagChip key={c}>{c}</TagChip>)}</div>
    </article>
  );
}

function Groups({ groups }: { groups: { title: string; items: GearItem[] }[] }) {
  return (
    <div className="mt-10 space-y-10">
      {groups.map((g) => (
        <div key={g.title}>
          <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.15em] text-primary">{g.title}</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {g.items.map((it, i) => <Reveal key={it.name} delay={i * 60}><ItemCard item={it} /></Reveal>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function LabPage() {
  const first = topologyTiers[1]!.nodes[0]!;
  const [node, setNode] = useState<TopologyNode>(first);
  const [full, setFull] = useState(false);

  return (
    <>
      <PageHeader eyebrow="Lab" title={labIntro.title} description={labIntro.purpose} />
      <Container className="py-6">
        <ul className="flex flex-wrap gap-2">
          {labIntro.principles.map((p) => <li key={p}><TagChip>{p}</TagChip></li>)}
        </ul>
      </Container>

      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Topology" title="Network architecture" description="Click any node for details. All IPs and ASNs shown are dummy documentation ranges." />
            <Button variant="outline" onClick={() => setFull(true)}><Maximize2 className="mr-1.5 h-4 w-4" /> Fullscreen</Button>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]">
            <div className="panel overflow-x-auto p-6"><Topology selected={node.id} onSelect={setNode} /></div>
            <NodeDetails node={node} />
          </div>
        </Container>
      </section>

      <Dialog open={full} onOpenChange={setFull}>
        <DialogContent className="max-h-[94vh] w-[calc(100vw-1rem)] max-w-6xl overflow-auto">
          <DialogTitle>Lab topology</DialogTitle>
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
            <div className="py-4"><Topology selected={node.id} onSelect={setNode} large /></div>
            <NodeDetails node={node} />
          </div>
        </DialogContent>
      </Dialog>

      <section className="border-b border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Hardware" title="Hardware, emulation & rack gear" description="Physical devices plus virtual routers for scale." />
          <Groups groups={gearGroups} />
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Stack" title="Self-hosted services & automation" description="What runs in the lab day to day." />
          <Groups groups={serviceGroups} />
        </Container>
      </section>

      <section className="border-b border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Experiments" title="Active experiments & documented builds" description="What I'm testing right now." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {experiments.map((e, i) => (
              <Reveal key={e.title} delay={i * 60}>
                <article className="panel panel-hover flex h-full flex-col p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground">{e.title}</h3>
                    <StatusBadge status={e.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{e.chips.map((c) => <TagChip key={c}>{c}</TagChip>)}</div>
                  <Link to={e.link.to} className="mt-auto pt-5 text-sm font-medium text-primary hover:underline">
                    {e.link.label} <ArrowRight className="inline h-3.5 w-3.5" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

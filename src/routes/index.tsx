import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, FlaskConical, Cpu, Network, Server, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectCard, TagChip } from "@/components/site/cards";
import { NetworkBackdrop } from "@/components/site/network-backdrop";
import { Reveal } from "@/components/site/reveal";
import { Container, DemoNotice, SectionHeading } from "@/components/site/section";
import { useQuery } from "@tanstack/react-query";
import { aboutQuery, projectsQuery, settingsQuery, toImageUrl } from "@/lib/cms";
import { useState } from "react";
import { site, techBadges } from "@/data/site";
import { defaultAbout } from "@/data/about";
import { AboutPhotoGrid } from "@/components/site/about-photos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alfaz Ahmed — AI-Powered Networking & Automation" },
      {
        name: "description",
        content:
          "Building smarter networks and automating infrastructure. Networking, MikroTik, FTTH, Linux and AI automation work by Alfaz Ahmed.",
      },
      { property: "og:title", content: "Alfaz Ahmed — AI-Powered Networking & Automation" },
      {
        property: "og:description",
        content:
          "Networking, infrastructure, automation and AI-powered solutions built around modern technologies.",
      },
    ],
    links: [{ rel: "canonical", href: "https://alfazahmedsajol.lovable.app/" }],
  }),
  component: Home,
});

function Home() {
  const { data: about = defaultAbout } = useQuery(aboutQuery);
  const homePhotos = about.photos.filter((p) => p.featured).slice(0, 8);
  const pillarIcons = { network: Network, server: Server, cpu: Cpu, award: Award };
  const { data: proj } = useQuery(projectsQuery);
  const featuredProjects = (proj?.projects ?? []).filter((p) => p.featured).slice(0, 3);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <NetworkBackdrop />
        <Container className="relative py-16 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Available for networking &amp; automation work
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {site.brand}
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {site.byline}
              </p>
              <h1 className="mt-6 text-5xl text-foreground sm:text-6xl lg:text-7xl">
                Building Smarter Networks.
                <br />
                <span className="text-signal">Automating Infrastructure.</span>
              </h1>
              <p className="mt-6 max-w-xl font-editorial text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {site.heroSupport}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {techBadges.map((b) => (
                  <li key={b}>
                    <TagChip>{b}</TagChip>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/projects">View My Projects</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/contact">Contact Me</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={120} className="justify-self-center lg:justify-self-end">
              <div className="panel relative w-64 p-5 sm:w-80">
                <ProfilePhoto />
                <div className="mt-5">
                  <p className="font-display text-base font-semibold text-foreground">{site.owner}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{site.role}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* About preview */}
      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          {homePhotos.length ? <div className="mb-10"><AboutPhotoGrid photos={homePhotos} /></div> : null}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              eyebrow="About"
              title={about.homeTitle}
              description={about.homeDescription}
            />
            <Reveal delay={100} className="grid gap-4 sm:grid-cols-2">
              {about.pillars.map((p) => ({ ...p, icon: pillarIcons[p.icon] ?? Network })).map((item) => (
                <div key={item.title} className="panel p-5">
                  <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal className="mt-10">
            <Button asChild variant="outline">
              <Link to="/about">
                Read More <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Featured projects */}
      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Projects"
              title="Featured lab and automation work"
              description="Documented builds from my own lab environment."
            />
            <Reveal delay={80}>
              <DemoNotice>Lab and study builds — managed from the admin panel</DemoNotice>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} className="relative">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <Button asChild variant="outline">
              <Link to="/projects">
                View all projects <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Lab teaser */}
      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <Reveal>
            <Link to="/lab" className="panel panel-hover group grid gap-6 p-6 sm:p-10 md:grid-cols-[auto_1fr_auto] md:items-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_24px_-6px_var(--color-primary)]">
                <FlaskConical className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Inside the Lab</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">My ISP network & automation lab</h2>
                <p className="mt-2 text-sm text-muted-foreground">Dual-IIG BGP topology, MikroTik & GNS3/CHR emulation, n8n automation and monitoring.</p>
                <div className="mt-4 flex flex-wrap gap-2">{["RouterOS v7", "BGP / OSPF", "GNS3", "n8n"].map((t) => <TagChip key={t}>{t}</TagChip>)}</div>
              </div>
              <span className="inline-flex items-center text-sm font-medium text-primary">Explore the lab <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <NetworkBackdrop className="opacity-60" />
        <Container className="relative">
          <Reveal className="panel mx-auto max-w-3xl p-8 text-center sm:p-12">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Have a networking or automation project? Let&apos;s build it.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tell me what your network needs to do, and I&apos;ll tell you how I&apos;d approach it.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/contact">Get In Touch</Link>
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function ProfilePhoto() {
  const { data } = useQuery(settingsQuery);
  const [failed, setFailed] = useState(false);
  const src = toImageUrl(data?.general?.["profile_image"]);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`Portrait of ${site.owner}`}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="aspect-square w-full rounded-lg border border-border object-cover"
      />
    );
  }
  return (
    <div className="flex aspect-square items-center justify-center rounded-lg border border-border bg-background/60">
      <User className="h-16 w-16 text-primary" aria-hidden="true" />
    </div>
  );
}

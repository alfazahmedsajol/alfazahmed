import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Cpu, Network, Server, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlogCard, ProjectCard, TagChip } from "@/components/site/cards";
import { NetworkBackdrop } from "@/components/site/network-backdrop";
import { Reveal } from "@/components/site/reveal";
import { Container, DemoNotice, SectionHeading } from "@/components/site/section";
import { useQuery } from "@tanstack/react-query";
import { blogListQuery, certificationsQuery, projectsQuery, servicesQuery, settingsQuery, skillsQuery, toImageUrl } from "@/lib/cms";
import { useState } from "react";
import { site, techBadges } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-Powered Networking & Automation — Alfaz Ahmed" },
      {
        name: "description",
        content:
          "Building smarter networks and automating infrastructure. Networking, MikroTik, FTTH, Linux and AI automation work by Alfaz Ahmed.",
      },
      { property: "og:title", content: "AI-Powered Networking & Automation — Alfaz Ahmed" },
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
  const { data: proj } = useQuery(projectsQuery);
  const featuredProjects = (proj?.projects ?? []).filter((p) => p.featured).slice(0, 6);
  const { data: services = [] } = useQuery(servicesQuery);
  const { data: blog } = useQuery(blogListQuery);
  const { data: certifications = [] } = useQuery(certificationsQuery);
  const { data: skillCats = [] } = useQuery(skillsQuery);
  const allSkills = skillCats.flatMap((c) => c.skills);
  const featuredSkills = allSkills.filter((s) => s.featured);
  const coreSkills = (featuredSkills.length ? featuredSkills : allSkills).slice(0, 10).map((s) => s.name);
  const homeServices = (services.some((s) => s.featured) ? services.filter((s) => s.featured) : services).slice(0, 6);
  const homeCerts = (certifications.some((c) => c.featured) ? certifications.filter((c) => c.featured) : certifications).slice(0, 3);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <NetworkBackdrop />
        <Container className="relative py-16 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {site.brand}
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {site.byline}
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
                Building Smarter Networks.
                <br />
                <span className="text-signal">Automating Infrastructure.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
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
                <Button asChild size="lg" variant="ghost">
                  <Link to="/blog">Read My Blog</Link>
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
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              eyebrow="About"
              title="A networking engineer who automates the repetitive parts"
              description="I work across routing, ISP access networks, fiber delivery and Linux infrastructure — then use scripting, n8n and AI-assisted workflows to remove the manual, repetitive operations that slow teams down. Everything I build gets documented so it can be rebuilt, reviewed and handed over."
            />
            <Reveal delay={100} className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Network, title: "Networking", text: "Routing, switching, segmentation and edge security." },
                { icon: Server, title: "Infrastructure", text: "Linux servers, monitoring and supporting services." },
                { icon: Cpu, title: "Automation", text: "Python, APIs and n8n workflows for daily operations." },
                { icon: Award, title: "Learning", text: "Structured certification track with hands-on labs." },
              ].map((item) => (
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

      {/* Core skills */}
      <section className="border-b border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Core skills"
            title="The technologies I work with every week"
            description="Each area below has its own breakdown on the skills page."
          />
          <Reveal className="mt-10">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {coreSkills.map((s) => (
                <li
                  key={s}
                  className="panel panel-hover flex items-center justify-center px-4 py-5 text-center text-sm font-medium text-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-8">
            <Button asChild variant="ghost">
              <Link to="/skills">
                Explore all skills <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
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

      {/* Services */}
      <section className="border-b border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="How I can help"
            description="From router configuration to automated operations, with documentation included."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((s, i) => (
              <Reveal key={s.id} delay={i * 60}>
                <article className="panel panel-hover h-full p-6">
                  <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {(s.technologies ?? []).map((t) => (
                      <li key={t}>
                        <TagChip>{t}</TagChip>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <Button asChild variant="outline">
              <Link to="/services">
                See service details <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Blog */}
      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Blog"
            title="Latest technical writing"
            description="Notes from labs, configuration decisions and automation experiments."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(blog?.posts ?? []).slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <BlogCard post={p} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <Button asChild variant="outline">
              <Link to="/blog">
                Read the blog <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Certifications */}
      <section className="border-b border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Certifications"
              title="Certification track"
              description="Study progress, honestly labeled — nothing listed as achieved unless it is."
            />
            <Reveal delay={80}>
              <DemoNotice>Status reflects study intent, not awarded credentials</DemoNotice>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {homeCerts.map((c, i) => (
              <Reveal key={c.id} delay={i * 70}>
                <article className="panel panel-hover h-full p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-primary">
                      {c.status}
                    </span>
                    <span className="font-mono text-[0.68rem] text-muted-foreground">{c.issued_on?.slice(0, 4) ?? ""}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.issuer}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <Button asChild variant="outline">
              <Link to="/certifications">
                All certifications <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
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

export type AboutPhoto = { url: string; caption: string; location: string; featured: boolean };
export type AboutPillar = { icon: "network" | "server" | "cpu" | "award"; title: string; text: string };
export type AboutBlock = { title: string; body: string[] };
export type AboutContent = {
  homeTitle: string;
  homeDescription: string;
  pageTitle: string;
  pageDescription: string;
  introTitle: string;
  introDescription: string;
  pillars: AboutPillar[];
  sections: AboutBlock[];
  photos: AboutPhoto[];
};

export const defaultAbout: AboutContent = {
  homeTitle: "A networking engineer who automates the repetitive parts",
  homeDescription:
    "I work across routing, ISP access networks, fiber delivery and Linux infrastructure — then use scripting, n8n and AI-assisted workflows to remove the manual, repetitive operations that slow teams down. Everything I build gets documented so it can be rebuilt, reviewed and handed over.",
  pageTitle: "Networking, infrastructure and automation — practised deliberately",
  pageDescription:
    "I'm Alfaz Ahmed, a network and infrastructure engineer focused on MikroTik, FTTH access networks, Linux and automation, with a growing focus on AI-assisted operations.",
  introTitle: "A professional introduction",
  introDescription:
    "Most of my work starts the same way: understand what the network needs to deliver, write down the plan, then build it in a way that can be rebuilt. I care about configurations that another engineer can read, monitoring that supports real decisions, and automation that quietly removes daily toil.",
  pillars: [
    { icon: "network", title: "Networking", text: "Routing, switching, segmentation and edge security." },
    { icon: "server", title: "Infrastructure", text: "Linux servers, monitoring and supporting services." },
    { icon: "cpu", title: "Automation", text: "Python, APIs and n8n workflows for daily operations." },
    { icon: "award", title: "Learning", text: "Structured certification track with hands-on labs." },
  ],
  sections: [
    { title: "What I Do", body: [
      "I design, configure and document networks — MikroTik edges, VLAN segmentation, PPPoE subscriber access and fiber delivery — and the Linux infrastructure that supports them.",
      "On top of that I build automation: scheduled configuration backups, API-driven changes, health checks, and workflows that turn monitoring events into clear, actionable notifications.",
    ] },
    { title: "Technical Interests", body: [
      "Service-provider scale routing, FTTH access networks and optical troubleshooting are where I spend most of my study time.",
      "Alongside that, I'm interested in how AI can assist operations — not by configuring devices, but by making noisy machine output readable, so engineers spend less time reading logs and more time fixing causes.",
    ] },
    { title: "Career Vision", body: [
      "My goal is to work on networks where reliability is measured, not assumed: documented topologies, versioned configuration, monitoring that reflects reality and automation that removes human error from routine tasks.",
      "I'm building toward service-provider and large infrastructure environments, with network automation as the core specialisation.",
    ] },
    { title: "Working Philosophy", body: [
      "Document before you configure. A written addressing plan and a clear intent make every later change safer.",
      "Automate anything done more than twice. Manual repetition is where mistakes and outages come from.",
      "Be honest about scope. I'd rather say what I'm still learning than claim experience I don't have.",
    ] },
  ],
  photos: [],
};

export function mergeAbout(value: unknown): AboutContent {
  const v = (value && typeof value === "object" ? value : {}) as Partial<AboutContent>;
  const str = (x: unknown, d: string) => (typeof x === "string" && x.trim() ? x : d);
  return {
    homeTitle: str(v.homeTitle, defaultAbout.homeTitle),
    homeDescription: str(v.homeDescription, defaultAbout.homeDescription),
    pageTitle: str(v.pageTitle, defaultAbout.pageTitle),
    pageDescription: str(v.pageDescription, defaultAbout.pageDescription),
    introTitle: str(v.introTitle, defaultAbout.introTitle),
    introDescription: str(v.introDescription, defaultAbout.introDescription),
    pillars: Array.isArray(v.pillars) ? v.pillars : defaultAbout.pillars,
    sections: Array.isArray(v.sections) ? v.sections : defaultAbout.sections,
    photos: Array.isArray(v.photos)
      ? v.photos.filter((p) => p && typeof p.url === "string" && p.url).map((p) => ({ url: p.url, caption: p.caption ?? "", location: p.location ?? "", featured: !!p.featured }))
      : [],
  };
}

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: string;
  excerpt: string;
  featured: boolean;
  body: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const blogCategories = ["Networking", "MikroTik", "FTTH", "Linux", "Automation", "AI"];

/** Demo articles for Phase 1. */
export const blogPosts: BlogPost[] = [
  {
    slug: "designing-a-default-deny-firewall",
    title: "Designing a Default-Deny Firewall on RouterOS",
    category: "MikroTik",
    tags: ["Firewall", "Security", "RouterOS"],
    date: "2026-08-12",
    readingTime: "7 min read",
    excerpt:
      "Why starting from deny and opening only what you need produces a far more predictable edge than patching an allow-all policy.",
    featured: true,
    body: [
      {
        heading: "Start from a closed door",
        paragraphs: [
          "An allow-everything firewall grows by exception. Every incident adds one more narrow rule, and after a year nobody can explain why half the list exists.",
          "A default-deny policy inverts that: the router drops anything not explicitly permitted, so the rule list becomes a description of the services you actually run.",
        ],
      },
      {
        heading: "Structure the chains",
        paragraphs: ["Keep each chain focused on a single question so rules stay readable."],
        bullets: [
          "input — who is allowed to talk to the router itself",
          "forward — what traffic may cross the router",
          "output — rarely needed, but useful for restricting the device's own traffic",
        ],
      },
      {
        heading: "Verify before you commit",
        paragraphs: [
          "Apply changes with a safe-mode or scheduled rollback so a mistake in the management rule does not lock you out of the device.",
        ],
      },
    ],
  },
  {
    slug: "pppoe-basics-for-small-isps",
    title: "PPPoE Basics for Small ISPs",
    category: "FTTH",
    tags: ["PPPoE", "ISP", "Access network"],
    date: "2026-07-03",
    readingTime: "6 min read",
    excerpt:
      "A walkthrough of how subscriber authentication works, where bandwidth profiles attach, and what to document before your first customer.",
    featured: false,
    body: [
      {
        heading: "What PPPoE actually gives you",
        paragraphs: [
          "PPPoE turns an anonymous access port into an identified session. That identity is what makes plans, suspension and usage accounting possible.",
        ],
      },
      {
        heading: "Profiles before customers",
        paragraphs: [
          "Define the service plans first. When a plan is a profile rather than a set of per-user rules, changing a package is a single field edit.",
        ],
      },
    ],
  },
  {
    slug: "automating-network-backups-with-python",
    title: "Automating Network Backups with Python",
    category: "Automation",
    tags: ["Python", "Git", "Operations"],
    date: "2026-06-18",
    readingTime: "8 min read",
    excerpt:
      "A simple, dependable pattern: pull configuration on a schedule, normalise it, and commit only when something changed.",
    featured: false,
    body: [
      {
        heading: "The failure you are preventing",
        paragraphs: [
          "Configuration loss is rarely dramatic. A device is replaced, someone assumes a backup exists, and an afternoon disappears rebuilding rules from memory.",
        ],
      },
      {
        heading: "Normalise before diffing",
        paragraphs: [
          "Timestamps and counters change on every export. Strip them, or every backup looks like a change and the history becomes useless.",
        ],
      },
    ],
  },
  {
    slug: "monitoring-that-people-actually-read",
    title: "Monitoring That People Actually Read",
    category: "Linux",
    tags: ["Monitoring", "SNMP", "Grafana"],
    date: "2026-05-21",
    readingTime: "5 min read",
    excerpt:
      "Dashboards fail when they show everything. Choosing a small number of decisions to support makes monitoring usable.",
    featured: false,
    body: [
      {
        heading: "Pick the decisions first",
        paragraphs: [
          "Every panel should answer a question someone asks during an incident. If no one asks it, the panel is decoration.",
        ],
      },
    ],
  },
  {
    slug: "where-ai-helps-in-network-operations",
    title: "Where AI Actually Helps in Network Operations",
    category: "AI",
    tags: ["AI", "n8n", "Operations"],
    date: "2026-04-09",
    readingTime: "6 min read",
    excerpt:
      "AI is not going to configure your core router. It is very good at turning noisy machine output into something a human can act on.",
    featured: false,
    body: [
      {
        heading: "Summarisation, not control",
        paragraphs: [
          "The safe and immediately useful application is reading: collapsing hundreds of log lines or alerts into a short account of what changed.",
        ],
      },
      {
        heading: "Keep the raw data one click away",
        paragraphs: [
          "A summary is a starting point. Any workflow that hides the underlying events will eventually mislead someone during an incident.",
        ],
      },
    ],
  },
  {
    slug: "vlan-segmentation-in-small-offices",
    title: "VLAN Segmentation in Small Offices",
    category: "Networking",
    tags: ["VLAN", "Switching", "Design"],
    date: "2026-03-02",
    readingTime: "5 min read",
    excerpt:
      "Small networks benefit from segmentation too — especially when guest devices and cameras share the same cable plant.",
    featured: false,
    body: [
      {
        heading: "Three segments cover most cases",
        paragraphs: ["Staff, guest and devices. Anything further should be driven by a real requirement."],
      },
    ],
  },
  {
    slug: "reading-optical-power-readings",
    title: "Reading Optical Power Readings Without Guesswork",
    category: "FTTH",
    tags: ["GPON", "Optical", "Troubleshooting"],
    date: "2026-01-28",
    readingTime: "7 min read",
    excerpt:
      "What the numbers on an ONU mean, what a healthy range looks like, and how to tell a dirty connector from a real break.",
    featured: false,
    body: [
      {
        heading: "Record the baseline at install",
        paragraphs: [
          "A reading only means something compared to what the link looked like when it was working.",
        ],
      },
    ],
  },
];

export const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

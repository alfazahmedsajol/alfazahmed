export type Certification = {
  title: string;
  issuer: string;
  status: "In progress" | "Planned" | "Self-study";
  year: string;
  description: string;
};

/** No certification is claimed as awarded. Status reflects study intent only. */
export const certifications: Certification[] = [
  {
    title: "MikroTik Certified Network Associate (MTCNA)",
    issuer: "MikroTik",
    status: "In progress",
    year: "2026",
    description: "RouterOS fundamentals: addressing, routing, firewall, wireless and queues.",
  },
  {
    title: "MikroTik Certified Routing Engineer (MTCRE)",
    issuer: "MikroTik",
    status: "Planned",
    year: "2026",
    description: "Advanced routing, tunnelling and multi-site topologies.",
  },
  {
    title: "Cisco CCNA",
    issuer: "Cisco",
    status: "Planned",
    year: "2027",
    description: "Core networking, switching, IP services and automation fundamentals.",
  },
  {
    title: "Linux Server Administration",
    issuer: "Self-study track",
    status: "Self-study",
    year: "2026",
    description: "Service management, hardening, networking stack and containerised tooling.",
  },
  {
    title: "Network Automation with Python",
    issuer: "Self-study track",
    status: "Self-study",
    year: "2026",
    description: "Scripting device interactions, API-based configuration and scheduled operations.",
  },
];

export const timeline = [
  {
    period: "Now",
    title: "Network & Automation Engineering",
    description:
      "Building and documenting lab infrastructure around MikroTik, FTTH access networks and Linux, with automation layered on top.",
  },
  {
    period: "Ongoing",
    title: "Automation & AI Workflows",
    description:
      "Designing n8n and Python workflows that remove repetitive operational work from daily network administration.",
  },
  {
    period: "Ongoing",
    title: "Certification Track",
    description:
      "Working through MikroTik and vendor-neutral networking material with hands-on labs rather than theory alone.",
  },
  {
    period: "Next",
    title: "Service Provider Scale",
    description:
      "Deepening ISP-grade routing, monitoring and automation practice for larger subscriber networks.",
  },
];

export const resumeSummary =
  "Network and infrastructure engineer focused on MikroTik, FTTH access networks, Linux servers and automation. I build labs, document them carefully, and automate the repetitive parts of network operations — increasingly with AI-assisted workflows.";

export const experience = [
  {
    role: "Network & Infrastructure Engineering (independent practice)",
    org: "Personal lab and study projects",
    period: "Current",
    points: [
      "Design and rebuild multi-site MikroTik topologies with segmented VLANs and default-deny firewall policy",
      "Operate a self-hosted Linux monitoring stack for lab devices",
      "Automate configuration backups and health checks with Python and scheduled jobs",
    ],
  },
  {
    role: "Automation & AI Workflow Practice",
    org: "Personal projects",
    period: "Current",
    points: [
      "Build n8n workflows connecting monitoring events to readable notifications",
      "Experiment with AI-assisted log and alert summarisation",
    ],
  },
];

export const education = [
  {
    title: "Technical study in networking and infrastructure",
    org: "Continuous self-directed learning",
    period: "Ongoing",
    description:
      "Structured study combining vendor documentation, certification syllabi and hands-on lab work.",
  },
];

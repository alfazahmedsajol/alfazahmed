export const projectCategories = [
  "Networking",
  "ISP & FTTH",
  "Linux & Infrastructure",
  "Automation & AI",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  featured: boolean;
  year: string;
  stack: string[];
  overview: string;
  objectives: string[];
  approach: string[];
  outcome: string;
};

/** Demo lab projects — clearly labeled placeholder content for Phase 1. */
export const projects: Project[] = [
  {
    slug: "mikrotik-branch-edge-lab",
    title: "MikroTik Branch Edge Lab",
    category: "Networking",
    summary:
      "A lab build of a multi-branch edge topology with segmented VLANs, default-deny firewalling and site-to-site tunnels.",
    featured: true,
    year: "2026",
    stack: ["RouterOS", "VLAN", "WireGuard", "Firewall"],
    overview:
      "A practice topology built to rehearse a realistic branch-office edge: three simulated sites, a central hub and an isolated guest segment.",
    objectives: [
      "Segment traffic per department using VLANs",
      "Apply a default-deny firewall policy at every edge",
      "Connect all branches through encrypted tunnels",
    ],
    approach: [
      "Addressing plan documented before any device configuration",
      "Firewall chains structured into input, forward and management rules",
      "WireGuard tunnels with restricted allowed-address lists",
      "Configuration exported and version controlled",
    ],
    outcome:
      "A repeatable lab template that can be rebuilt from exported configuration in minutes.",
  },
  {
    slug: "pppoe-subscriber-lab",
    title: "PPPoE Subscriber Network Lab",
    category: "ISP & FTTH",
    summary:
      "Simulated small ISP access network with PPPoE authentication, bandwidth profiles and subscriber lifecycle handling.",
    featured: true,
    year: "2026",
    stack: ["PPPoE", "RouterOS", "RADIUS", "Queues"],
    overview:
      "A study project modelling how a small provider authenticates subscribers and enforces service plans.",
    objectives: [
      "Authenticate subscribers centrally",
      "Attach speed profiles per plan",
      "Make suspension and reactivation a one-step action",
    ],
    approach: [
      "PPPoE server with per-profile rate limits",
      "Central user database for authentication",
      "Queue tree for aggregate upstream control",
    ],
    outcome: "A working reference configuration for subscriber onboarding scenarios.",
  },
  {
    slug: "ftth-onu-provisioning-workflow",
    title: "FTTH ONU Provisioning Workflow",
    category: "ISP & FTTH",
    summary:
      "Documented provisioning flow for authorising ONUs on a GPON access network, including optical health checks.",
    featured: false,
    year: "2025",
    stack: ["GPON", "OLT", "Documentation"],
    overview:
      "A written and diagrammed runbook covering the steps from a new ONU arriving on the PON to a service being live.",
    objectives: [
      "Standardise ONU authorisation steps",
      "Capture optical readings at install time",
      "Reduce avoidable repeat site visits",
    ],
    approach: [
      "Checklist per install with recorded optical power",
      "Naming convention for ONUs tied to the distribution point",
      "Fault-isolation decision tree for common optical issues",
    ],
    outcome: "A runbook that makes provisioning consistent regardless of who performs it.",
  },
  {
    slug: "linux-monitoring-stack",
    title: "Linux Monitoring Stack",
    category: "Linux & Infrastructure",
    summary:
      "Self-hosted monitoring for network devices with SNMP collection, dashboards and alert routing.",
    featured: true,
    year: "2026",
    stack: ["Linux", "SNMP", "Grafana", "Docker"],
    overview:
      "A containerised monitoring stack on a single Linux host, polling lab devices and surfacing interface and uptime metrics.",
    objectives: [
      "See interface utilisation over time",
      "Get notified before a link saturates",
      "Keep the whole stack reproducible",
    ],
    approach: [
      "SNMP polling for device and interface metrics",
      "Dashboards grouped by site and device role",
      "Alert rules routed to a notification channel",
    ],
    outcome: "Continuous visibility into the lab network instead of reactive checking.",
  },
  {
    slug: "router-backup-automation",
    title: "Router Backup Automation",
    category: "Automation & AI",
    summary:
      "Scheduled configuration backups for network devices with change detection and versioned storage.",
    featured: false,
    year: "2025",
    stack: ["Python", "Git", "Cron", "REST API"],
    overview:
      "A small Python service that pulls configuration from each device on a schedule and commits changes to a repository.",
    objectives: [
      "Never lose a device configuration",
      "See exactly what changed and when",
      "Remove manual export work",
    ],
    approach: [
      "API-based export per device",
      "Normalisation step to strip volatile lines",
      "Commit only when the configuration actually changed",
    ],
    outcome: "A full history of configuration changes with no manual effort.",
  },
  {
    slug: "ai-assisted-alert-triage",
    title: "AI-Assisted Alert Triage",
    category: "Automation & AI",
    summary:
      "An n8n workflow that groups monitoring alerts and produces a short, readable summary of what is happening.",
    featured: true,
    year: "2026",
    stack: ["n8n", "LLM API", "Webhooks", "Monitoring"],
    overview:
      "An experiment in reducing alert noise: raw alerts enter a workflow, are de-duplicated, then summarised into one plain-language message.",
    objectives: [
      "Cut down repetitive alert notifications",
      "Make on-call messages readable at a glance",
      "Keep the raw data available for deeper inspection",
    ],
    approach: [
      "Webhook ingestion of monitoring events",
      "Grouping window to collapse duplicates",
      "Summarisation step with a strict output format",
    ],
    outcome: "Fewer, clearer notifications during simulated incident scenarios.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

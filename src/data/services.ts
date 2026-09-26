export type Service = {
  slug: string;
  title: string;
  icon: "router" | "network" | "fiber" | "server" | "workflow" | "brain";
  description: string;
  technologies: string[];
  cta: string;
};

export const services: Service[] = [
  {
    slug: "mikrotik-network-configuration",
    title: "MikroTik Network Configuration",
    icon: "router",
    description:
      "RouterOS setup and tuning for offices, branches and service-provider edges — addressing, firewalling, queues, VPN and remote management.",
    technologies: ["RouterOS", "Firewall", "Queues", "WireGuard", "VLAN"],
    cta: "Discuss a MikroTik setup",
  },
  {
    slug: "isp-pppoe-network",
    title: "ISP / PPPoE Network",
    icon: "network",
    description:
      "Subscriber network design with PPPoE authentication, bandwidth profiles, user management and a clean path for future growth.",
    technologies: ["PPPoE", "RADIUS", "Bandwidth profiles", "NAT"],
    cta: "Plan an ISP network",
  },
  {
    slug: "olt-ftth",
    title: "OLT / FTTH",
    icon: "fiber",
    description:
      "Fiber access work covering ONU provisioning, GPON/EPON profiles, optical checks and structured documentation of the distribution network.",
    technologies: ["GPON", "EPON", "ONU provisioning", "Optical testing"],
    cta: "Talk about fiber access",
  },
  {
    slug: "linux-infrastructure",
    title: "Linux Infrastructure",
    icon: "server",
    description:
      "Hardened Linux servers for the supporting services around a network: monitoring stacks, DNS, backups, tunnels and internal tooling.",
    technologies: ["Ubuntu", "Debian", "systemd", "Docker", "Bash"],
    cta: "Set up Linux services",
  },
  {
    slug: "network-automation",
    title: "Network Automation",
    icon: "workflow",
    description:
      "Replacing repetitive console work with scripts and workflows: scheduled backups, bulk configuration, health checks and automatic alerting.",
    technologies: ["Python", "REST API", "n8n", "Cron", "Git"],
    cta: "Automate your operations",
  },
  {
    slug: "ai-automation",
    title: "AI Automation",
    icon: "brain",
    description:
      "AI-assisted operational workflows — summarising logs, drafting support replies and connecting monitoring events to useful, human-readable actions.",
    technologies: ["n8n", "LLM APIs", "Webhooks", "Python"],
    cta: "Explore AI workflows",
  },
];

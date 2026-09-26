export type Skill = {
  name: string;
  level: "Learning" | "Working knowledge" | "Practising" | "Focus area";
  note: string;
};

export type SkillCategory = {
  slug: string;
  title: string;
  summary: string;
  skills: Skill[];
};

/** Demo data. Phase 2 replaces this module with database-driven queries. */
export const skillCategories: SkillCategory[] = [
  {
    slug: "networking",
    title: "Networking",
    summary: "Routing, switching and the fundamentals behind reliable connectivity.",
    skills: [
      { name: "TCP/IP & subnetting", level: "Working knowledge", note: "Addressing, VLSM, troubleshooting" },
      { name: "Routing (static, OSPF, BGP)", level: "Practising", note: "Lab-based study and configuration" },
      { name: "Switching & VLANs", level: "Working knowledge", note: "Trunking, segmentation" },
      { name: "Network troubleshooting", level: "Focus area", note: "Packet-level diagnosis" },
    ],
  },
  {
    slug: "mikrotik",
    title: "MikroTik",
    summary: "RouterOS configuration for edge, ISP and enterprise scenarios.",
    skills: [
      { name: "RouterOS firewall", level: "Practising", note: "Filter, NAT, mangle chains" },
      { name: "Queues & bandwidth control", level: "Practising", note: "Simple and tree queues" },
      { name: "Hotspot & PPPoE server", level: "Working knowledge", note: "User management" },
      { name: "VPN (WireGuard, IPsec)", level: "Practising", note: "Site-to-site tunnels" },
    ],
  },
  {
    slug: "isp-ftth",
    title: "ISP / FTTH",
    summary: "Service-provider access networks and subscriber delivery.",
    skills: [
      { name: "PPPoE subscriber networks", level: "Practising", note: "AAA flow, profiles" },
      { name: "Fiber distribution planning", level: "Learning", note: "Splitters, drop design" },
      { name: "Bandwidth management", level: "Working knowledge", note: "Fair usage policy design" },
    ],
  },
  {
    slug: "olt",
    title: "OLT",
    summary: "GPON/EPON access equipment operation and ONU lifecycle.",
    skills: [
      { name: "ONU provisioning", level: "Practising", note: "Authorisation and profiles" },
      { name: "GPON/EPON concepts", level: "Working knowledge", note: "Optical budget basics" },
      { name: "Optical fault isolation", level: "Learning", note: "Power readings, loss analysis" },
    ],
  },
  {
    slug: "linux",
    title: "Linux",
    summary: "Server administration for network-adjacent infrastructure.",
    skills: [
      { name: "Debian / Ubuntu administration", level: "Working knowledge", note: "Services, systemd" },
      { name: "Shell scripting", level: "Practising", note: "Operational automation" },
      { name: "Networking stack (ip, nft)", level: "Practising", note: "Routing tables, firewalling" },
      { name: "Docker basics", level: "Learning", note: "Containerised tooling" },
    ],
  },
  {
    slug: "security",
    title: "Security",
    summary: "Hardening the edge and protecting subscriber traffic.",
    skills: [
      { name: "Firewall policy design", level: "Practising", note: "Default-deny approach" },
      { name: "Access control & RADIUS", level: "Learning", note: "Centralised authentication" },
      { name: "Traffic inspection", level: "Learning", note: "Anomaly spotting" },
    ],
  },
  {
    slug: "automation",
    title: "Automation",
    summary: "Removing repetitive operations from daily network work.",
    skills: [
      { name: "n8n workflows", level: "Focus area", note: "Alerting and ops automation" },
      { name: "API-driven configuration", level: "Practising", note: "REST calls to RouterOS" },
      { name: "Scheduled maintenance jobs", level: "Working knowledge", note: "Backups, health checks" },
    ],
  },
  {
    slug: "ai",
    title: "AI",
    summary: "Applying AI assistance to network operations and support.",
    skills: [
      { name: "AI-assisted troubleshooting", level: "Focus area", note: "Log summarisation experiments" },
      { name: "LLM workflow integration", level: "Practising", note: "Chained automation steps" },
      { name: "Prompt design for ops", level: "Practising", note: "Repeatable runbooks" },
    ],
  },
  {
    slug: "programming",
    title: "Programming",
    summary: "Scripting and tooling to support infrastructure work.",
    skills: [
      { name: "Python", level: "Practising", note: "Automation scripts, parsing" },
      { name: "Bash", level: "Working knowledge", note: "Server-side tooling" },
      { name: "Git", level: "Working knowledge", note: "Versioned configuration" },
    ],
  },
  {
    slug: "monitoring",
    title: "Monitoring",
    summary: "Visibility into uptime, capacity and network health.",
    skills: [
      { name: "SNMP monitoring", level: "Practising", note: "Interface and device metrics" },
      { name: "Grafana dashboards", level: "Learning", note: "Operational views" },
      { name: "Alerting pipelines", level: "Practising", note: "Notification routing" },
    ],
  },
  {
    slug: "cloud",
    title: "Cloud",
    summary: "Hosting supporting services outside the on-premise rack.",
    skills: [
      { name: "VPS provisioning", level: "Working knowledge", note: "Secure initial setup" },
      { name: "DNS management", level: "Working knowledge", note: "Records, propagation" },
      { name: "Remote access design", level: "Practising", note: "Tunnels and bastions" },
    ],
  },
];

export const coreSkills = [
  "MikroTik",
  "OLT / FTTH",
  "Linux",
  "Networking",
  "Network Security",
  "n8n",
  "AI Automation",
  "Python",
  "Monitoring",
];

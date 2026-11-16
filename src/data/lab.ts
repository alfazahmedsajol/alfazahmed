/**
 * Lab showcase content. Edit this file to add devices, services, topology nodes
 * or experiments — the /lab page and home teaser update automatically.
 * All IPs/ASNs are documentation-range dummies (RFC 5737 / RFC 5398) for safety.
 */
export type LabStatus = "active" | "progress" | "experiment";

export const labStatusLabel: Record<LabStatus, string> = {
  active: "Active in Lab",
  progress: "In Progress",
  experiment: "Experiment",
};

export const labIntro = {
  title: "My ISP Network & Automation Lab Environment",
  purpose:
    "A space for production-style ISP testing — BGP, OSPF, PPPoE and MPLS — and for researching self-hosted automation workflows before they touch a real network.",
  principles: [
    "Build it in the lab before calling it learned",
    "Document every configuration decision",
    "Automate the repetitive parts",
  ],
};

export type TopologyNode = {
  id: string;
  label: string;
  role: string;
  details: string[];
  chips: string[];
};

/** Tiers render top-to-bottom: WAN → core → distribution → access/automation. */
export const topologyTiers: { name: string; nodes: TopologyNode[] }[] = [
  {
    name: "Upstream",
    nodes: [
      { id: "iig-a", label: "IIG-A Uplink", role: "Upstream transit", details: ["eBGP peer AS64510", "Link 198.51.100.0/30", "Primary path, higher local-pref"], chips: ["eBGP", "Transit"] },
      { id: "iig-b", label: "IIG-B Uplink", role: "Backup transit", details: ["eBGP peer AS64511", "Link 203.0.113.0/30", "AS-path prepend for backup"], chips: ["eBGP", "Failover"] },
    ],
  },
  {
    name: "Core",
    nodes: [
      { id: "core", label: "Core BGP Router", role: "Edge & policy", details: ["Local AS64500 (dummy)", "Prefix filters & route-maps", "Dual-IIG failover logic"], chips: ["RouterOS v7", "BGP", "Firewall"] },
    ],
  },
  {
    name: "Distribution",
    nodes: [
      { id: "dist", label: "OSPF Distribution", role: "Internal routing", details: ["OSPF area 0 backbone", "Loopbacks 10.255.0.0/24", "Queue Tree bandwidth policy"], chips: ["OSPF", "Queue Tree", "VLAN"] },
    ],
  },
  {
    name: "Access & Automation",
    nodes: [
      { id: "olt", label: "OLT / PPPoE", role: "Subscriber access", details: ["PPPoE server with profiles", "GPON OLT → ONT test clients", "Subscriber pool 100.64.0.0/22"], chips: ["PPPoE", "GPON", "FTTH"] },
      { id: "auto", label: "Automation Node", role: "Ops & monitoring", details: ["n8n + Python API bots", "Grafana / Uptime Kuma", "WireGuard management access"], chips: ["n8n", "Docker", "API"] },
    ],
  },
];

export type GearItem = { name: string; description: string; chips: string[]; status: LabStatus };

export const gearGroups: { title: string; items: GearItem[] }[] = [
  {
    title: "Physical Networking",
    items: [
      { name: "MikroTik Routers", description: "Core and edge routing, firewalling and PPPoE.", chips: ["RouterOS v7", "BGP / OSPF"], status: "active" },
      { name: "Managed Switches", description: "VLAN segmentation and trunking between lab segments.", chips: ["802.1Q", "VLAN"], status: "active" },
      { name: "OLT / ONT Gear", description: "FTTH access testing with GPON subscriber devices.", chips: ["GPON", "FTTH"], status: "active" },
    ],
  },
  {
    title: "Virtual & Emulation Lab",
    items: [
      { name: "GNS3", description: "Multi-router topologies for BGP, OSPF and MPLS scenarios.", chips: ["GNS3", "MPLS"], status: "active" },
      { name: "MikroTik CHR", description: "Cloud Hosted Router instances for large-scale emulation.", chips: ["CHR", "RouterOS v7"], status: "active" },
    ],
  },
  {
    title: "Compute & Power",
    items: [
      { name: "Linux Host / Workstation", description: "Runs emulation, containers and monitoring.", chips: ["Linux", "Docker"], status: "active" },
      { name: "Backup Power", description: "Keeps the lab up through short outages.", chips: ["UPS"], status: "active" },
    ],
  },
];

export const serviceGroups: { title: string; items: GearItem[] }[] = [
  {
    title: "Automation",
    items: [
      { name: "n8n Workflows", description: "Event-driven automation and alert routing.", chips: ["n8n", "Webhooks"], status: "active" },
      { name: "Python Scripts & API Bots", description: "RouterOS API tasks, backups and reports.", chips: ["Python", "REST API"], status: "progress" },
    ],
  },
  {
    title: "Virtualization & Containers",
    items: [{ name: "Docker", description: "Isolated, reproducible self-hosted services.", chips: ["Docker", "Compose"], status: "active" }],
  },
  {
    title: "Monitoring & Observability",
    items: [
      { name: "Grafana", description: "Dashboards for interfaces, latency and uptime.", chips: ["Grafana"], status: "active" },
      { name: "Uptime Kuma / Zabbix", description: "Availability checks and alerting.", chips: ["Uptime Kuma", "Zabbix"], status: "experiment" },
    ],
  },
  {
    title: "Security & Remote Access",
    items: [{ name: "WireGuard VPN", description: "Secure remote management tunnels.", chips: ["WireGuard", "Tunneling"], status: "active" }],
  },
];

export type Experiment = {
  title: string;
  description: string;
  chips: string[];
  status: LabStatus;
  link: { label: string; to: "/projects" | "/blog" };
};

export const experiments: Experiment[] = [
  { title: "Dual-IIG eBGP Failover", description: "Automatic upstream failover with local-pref and AS-path prepending.", chips: ["BGP", "RouterOS v7"], status: "progress", link: { label: "See project writeup", to: "/projects" } },
  { title: "Queue Tree Bandwidth Management", description: "Per-subscriber shaping with PCQ and queue trees.", chips: ["Queue Tree", "PCQ"], status: "active", link: { label: "Read configuration guide", to: "/blog" } },
  { title: "MPLS Testing", description: "LDP and L3VPN basics on a CHR emulation topology.", chips: ["MPLS", "GNS3"], status: "experiment", link: { label: "See project writeup", to: "/projects" } },
  { title: "n8n Network Automation", description: "Alert triage and scheduled config backups via n8n.", chips: ["n8n", "Python"], status: "progress", link: { label: "Read configuration guide", to: "/blog" } },
];

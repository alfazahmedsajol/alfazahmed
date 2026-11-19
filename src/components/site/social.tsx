import { Facebook, Github, Globe, Instagram, Link2, Linkedin, MessageCircle, Send, Twitter, Youtube, type LucideIcon } from "lucide-react";

export type SocialPlatform = { id: string; label: string; icon: LucideIcon; placeholder: string };

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/…" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "https://wa.me/8801…" },
  { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/…" },
  { id: "x", label: "X", icon: Twitter, placeholder: "https://x.com/…" },
  { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/…" },
  { id: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/…" },
  { id: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@…" },
  { id: "telegram", label: "Telegram", icon: Send, placeholder: "https://t.me/…" },
  { id: "website", label: "Website", icon: Globe, placeholder: "https://…" },
];

const OTHER: SocialPlatform = { id: "other", label: "Other", icon: Link2, placeholder: "https://…" };

/** Match a stored platform name (or URL) to a known platform. */
export function resolvePlatform(name: string, url = ""): SocialPlatform {
  const n = name.trim().toLowerCase();
  const byName = SOCIAL_PLATFORMS.find((p) => p.id === n || p.label.toLowerCase() === n);
  if (byName) return byName;
  if (n === "twitter" || /(twitter|x)\.com/.test(url)) return SOCIAL_PLATFORMS[3]!;
  if (/wa\.me|whatsapp/.test(url)) return SOCIAL_PLATFORMS[1]!;
  const byUrl = SOCIAL_PLATFORMS.find((p) => p.id !== "website" && url.toLowerCase().includes(p.id));
  return byUrl ?? (n === "website" || n === "portfolio" ? SOCIAL_PLATFORMS[8]! : OTHER);
}

/** Short readable handle instead of the raw link. */
export function socialHandle(url: string): string {
  const clean = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const m = clean.match(/^(?:linkedin\.com\/in|instagram\.com|x\.com|twitter\.com|github\.com|t\.me|youtube\.com)\/(@?[\w.-]+)/i);
  const h = m?.[1];
  if (h) return h.startsWith("@") ? h : `@${h}`;
  const wa = clean.match(/^wa\.me\/\+?(\d+)/);
  if (wa) return `+${wa[1]}`;
  return clean;
}

import { Link } from "@tanstack/react-router";
import { Mail, Network, Phone } from "lucide-react";

import { navLinks, site } from "@/data/site";
import { services } from "@/data/services";
import { Container } from "./section";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/cms";

export function Footer() {
  const { data } = useQuery(settingsQuery);
  const links = data?.socials ?? [];
  const copyright = data?.general?.footer_text?.trim() || "© 2026 Alfaz Ahmed. All rights reserved.";
  return (
    <footer className="border-t border-border bg-surface/40">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-primary">
                <Network className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-sm font-semibold text-foreground">
                  {site.brand}
                </span>
                <span className="block font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {site.byline}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.heroSupport}
            </p>
          </div>

          <nav aria-label="Quick links">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">Quick links</h2>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/resume" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Resume
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Services">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">Services</h2>
            <ul className="mt-4 space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services"
                    hash={s.slug}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">Contact</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2">
              {links.map((s) => (
                <li key={s.platform + s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{copyright}</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Terms of Use
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { Menu, Network, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { navLinks, site } from "@/data/site";
import { Container } from "./section";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "border-border bg-background/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label={`${site.brand}, home`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-primary transition-colors group-hover:border-primary/50">
            <Network className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[0.8rem] font-semibold text-foreground sm:text-[0.95rem]">
              AI-Powered Networking &amp; Automation
            </span>
            <span className="block font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
              {site.byline}
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ThemeToggle className="ml-auto xl:ml-0" />

        <div className="hidden xl:block">
          <Button asChild>
            <Link to="/contact">Let&apos;s Work Together</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground xl:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </Container>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-border bg-background xl:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1 p-5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-lg border border-transparent px-4 py-3 text-base text-muted-foreground transition-colors hover:border-border hover:bg-surface hover:text-foreground"
                activeProps={{ className: "border-border bg-surface text-primary" }}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="lg" className="mt-4">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Let&apos;s Work Together
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

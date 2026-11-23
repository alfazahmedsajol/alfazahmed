import { Link } from "@tanstack/react-router";
import { Menu, User, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery, toImageUrl } from "@/lib/cms";
import { useEffect, useState } from "react";

import { navLinks, site } from "@/data/site";
import { Container } from "./section";
import { ThemeLogoButton } from "./theme-toggle";

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
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors ${
          scrolled
            ? "border-border bg-background/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <div className="flex min-w-0 items-center gap-3">
            <ThemeLogoButton />
            <Link
              to="/"
              className="truncate font-display text-[0.95rem] font-semibold text-foreground transition-colors hover:text-primary sm:text-base"
              aria-label={`${site.owner}, home`}
            >
              {site.owner}
            </Link>
          </div>

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                activeProps={{ className: "text-primary" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden xl:block">
            <AuditButton />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground xl:ml-0 xl:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </Container>
      </header>
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
                onClick={() => setOpen(false)}
                className="rounded-lg border border-transparent px-4 py-3 text-base text-muted-foreground transition-colors hover:border-border hover:bg-surface hover:text-foreground"
                activeProps={{ className: "border-border bg-surface text-primary" }}
              >
                {link.label}
              </Link>
            ))}
            <AuditButton className="mt-4 self-start" onClick={() => setOpen(false)} />
          </nav>
        </div>
      ) : null}
    </>
  );
}

function AuditButton({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  const { data } = useQuery(settingsQuery);
  const [failed, setFailed] = useState(false);
  const src = toImageUrl(data?.general?.["profile_image"]);
  return (
    <Link
      to="/contact"
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-primary py-1.5 pl-1.5 pr-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 ${className}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary-foreground/30 bg-background">
        {src && !failed ? (
          <img src={src} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        ) : (
          <User className="h-4 w-4 text-primary" aria-hidden="true" />
        )}
      </span>
      Get a Free Network Audit
    </Link>
  );
}

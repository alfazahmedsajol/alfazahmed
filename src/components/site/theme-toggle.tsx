import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/** Inline script run before paint: stored choice, else system preference. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

function useTheme() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return;
      document.documentElement.classList.toggle("dark", e.matches);
      setDark(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return { dark, toggle };
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { dark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:text-primary ${className}`}
    >
      {dark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}

/** Brand logo button that doubles as the light/dark theme switch. */
export function ThemeLogoButton({ className = "" }: { className?: string }) {
  const { dark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface transition-colors hover:border-primary/50 ${className}`}
    >
      <img src="/favicon.png" alt="" aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}

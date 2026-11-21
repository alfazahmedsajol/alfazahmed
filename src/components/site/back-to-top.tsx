import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-background/80 text-primary shadow-lg backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-primary/10 ${show ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

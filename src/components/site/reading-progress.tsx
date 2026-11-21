import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_8px_var(--primary)] transition-[width] duration-100" style={{ width: `${p}%` }} />
    </div>
  );
}

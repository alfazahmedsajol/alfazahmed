import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };
type Cfg = { enabled: boolean; title: string; welcome: string };
const KEY = "chat-session";

export function ChatWidget() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sid, setSid] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/public/chat").then((r) => r.json()).then(setCfg).catch(() => {});
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (saved?.sid) { setSid(saved.sid); setMsgs(saved.msgs ?? []); return; }
    } catch { /* ignore */ }
    setSid(crypto.randomUUID());
  }, []);
  useEffect(() => { if (sid) sessionStorage.setItem(KEY, JSON.stringify({ sid, msgs })); }, [sid, msgs]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy, open]);

  if (!cfg?.enabled) return null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const history = msgs.slice(-10);
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput(""); setBusy(true);
    try {
      const r = await fetch("/api/public/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, sessionId: sid, history }) });
      const d = await r.json();
      setMsgs((m) => [...m, { role: "assistant", content: d.reply ?? d.error ?? "Something went wrong." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Network error — please try again." }]);
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(520px,75vh)] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-primary/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <p className="font-display text-sm font-semibold">{cfg.title}</p>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            <Bubble role="assistant" content={cfg.welcome} />
            {msgs.map((m, i) => <Bubble key={i} {...m} />)}
            {busy && <p className="text-xs text-muted-foreground">Typing…</p>}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={2000} placeholder="Type a message…" aria-label="Message"
              className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      )}
      <Button size="icon" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close chat" : "Open chat"} className="h-14 w-14 rounded-full shadow-lg">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}

function Bubble({ role, content }: Msg) {
  const me = role === "user";
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 ${me ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{content}</div>
    </div>
  );
}

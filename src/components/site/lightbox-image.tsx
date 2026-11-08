import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function LightboxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  return (
    <>
      <button type="button" onClick={() => { setZoom(1); setOpen(true); }} className="block w-full cursor-zoom-in" aria-label={`Open ${alt} full screen`}>
        <img src={src} alt={alt} loading="lazy" className={className} />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] border-border bg-background/95 p-2 sm:max-w-[95vw] [&>button]:hidden">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="absolute right-3 top-3 z-10 flex gap-1">
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="rounded-md border border-border bg-card p-2 hover:bg-muted"><Minus className="h-4 w-4" /></button>
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} className="rounded-md border border-border bg-card p-2 hover:bg-muted"><Plus className="h-4 w-4" /></button>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="rounded-md border border-border bg-card p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-[88vh] overflow-auto">
            <img src={src} alt={alt} style={{ width: `${zoom * 100}%`, maxWidth: "none" }} className="mx-auto block transition-[width]" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

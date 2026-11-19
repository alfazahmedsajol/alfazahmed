import { MapPin } from "lucide-react";
import { LightboxImage } from "@/components/site/lightbox-image";
import { Reveal } from "@/components/site/reveal";
import { toImageUrl } from "@/lib/cms";
import type { AboutPhoto } from "@/data/about";

export function AboutPhotoGrid({ photos }: { photos: AboutPhoto[] }) {
  if (!photos.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((p, i) => (
        <Reveal key={p.url + i} delay={i * 60}>
          <figure className="group panel panel-hover overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <LightboxImage src={toImageUrl(p.url) ?? p.url} alt={p.caption || "Work photo"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {p.location ? (
                <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background/80 px-2 py-0.5 font-mono text-[0.65rem] text-primary backdrop-blur">
                  <MapPin className="h-3 w-3" aria-hidden="true" /> {p.location}
                </span>
              ) : null}
            </div>
            {p.caption ? <figcaption className="px-3 py-2 text-xs leading-snug text-muted-foreground sm:text-sm">{p.caption}</figcaption> : null}
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

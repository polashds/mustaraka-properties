"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: { url: string; alt: string }[];
}

export default function ImageGallery({ images }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-video bg-brand-surface overflow-hidden">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-brand-bg/70 border border-gold/20 font-body text-[10px] text-gold/80 tracking-[0.15em] uppercase px-3 py-1.5">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={img.alt}
              className={`relative shrink-0 w-[88px] h-[60px] overflow-hidden border-2 transition-all duration-150 ${
                i === active
                  ? "border-gold"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="88px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

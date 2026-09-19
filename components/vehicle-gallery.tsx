"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function VehicleGallery({ images, title }: { images: string[]; title: string }) {
  const pics = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef<number | null>(null);

  const count = pics.length;
  const go = (i: number) => setIndex(((i % count) + count) % count);

  if (count === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-[#111] text-sm text-white/50">
        {title}
      </div>
    );
  }

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 40) go(index - 1);
    else if (dx < -40) go(index + 1);
    touchX.current = null;
  }

  return (
    <>
      <div
        className="group relative aspect-[16/10] overflow-hidden bg-[#111]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {pics.map((src, i) => (
            <button
              type="button"
              key={`${src}-${i}`}
              onClick={() => setLightbox(true)}
              className="relative h-full w-full shrink-0 cursor-zoom-in"
              aria-label="Povećaj sliku"
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
            </button>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Prethodna"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Sljedeća"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {pics.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Slika ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
            <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
              {index + 1}/{count}
            </span>
          </>
        ) : null}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative h-[70vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image src={pics[index]} alt={`${title} ${index + 1}`} fill sizes="100vw" className="object-contain" />

            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Prethodna"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Sljedeća"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}
          </div>

          {count > 1 ? (
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
              {pics.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(i);
                  }}
                  aria-label={`Slika ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/40"}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

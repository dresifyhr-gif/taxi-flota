"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "fleethub:saved-vehicles";

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Srce za spremanje oglasa (po vozilu), sprema se lokalno na uređaj. */
export function FavoriteHeart({
  slug,
  className = "",
  tone = "dark",
}: {
  slug: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(slug));
  }, [slug]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const list = readSaved();
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // localStorage nedostupan — samo vizualno preklopi
    }
    setSaved(next.includes(slug));
  }

  const idle = tone === "light" ? "text-neutral-400 hover:text-neutral-700" : "text-white/40 hover:text-white";
  const active = tone === "light" ? "text-emerald-500" : "text-accent";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Ukloni iz spremljenih" : "Spremi oglas"}
      aria-pressed={saved}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
        saved ? active : idle
      } ${className}`}
    >
      <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} strokeWidth={2} />
    </button>
  );
}

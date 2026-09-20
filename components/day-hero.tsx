"use client";

import dynamic from "next/dynamic";

const HeroCity3D = dynamic(() => import("@/components/hero-city-3d"), { ssr: false });

/** 3D grad u "dan" modu — za svijetlu temu. */
export function DayHero() {
  return (
    <div className="absolute inset-0">
      <HeroCity3D dayMode />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
    // Ovdje će se aktivirati analytics kad dobijemo ID-ove
    window.dispatchEvent(new Event("cookie-accepted"));
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:bottom-6 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-5 sm:p-6">
        <p className="text-sm font-semibold text-[#111]">Kolačići (Cookies) 🍪</p>
        <p className="mt-1.5 text-xs leading-5 text-black/55">
          Koristimo kolačiće za analitiku i poboljšanje korisničkog iskustva. Prihvaćanjem suglašavaš se s našom{" "}
          <Link href="/privacy-policy" className="underline hover:text-accent">
            politikom privatnosti
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={accept}
            className="rounded-xl bg-black px-5 py-2 text-xs font-bold text-white transition hover:bg-black/80"
          >
            Prihvaćam
          </button>
          <button
            onClick={decline}
            className="rounded-xl border border-black/10 bg-transparent px-5 py-2 text-xs font-semibold text-black/60 transition hover:bg-black/5"
          >
            Odbijam
          </button>
        </div>
      </div>
    </div>
  );
}

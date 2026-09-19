"use client";

import { useEffect } from "react";

/** Registrira service worker kad je admin otvoren (nužno za PWA install + push). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

"use client";

import { Bell, BellOff, Check } from "lucide-react";
import { useEffect, useState } from "react";

type State = "unknown" | "unsupported" | "denied" | "idle" | "working" | "subscribed";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function PushToggle({ vapidPublicKey }: { vapidPublicKey: string | null }) {
  const [state, setState] = useState<State>("unknown");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    (async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        const sub = reg ? await reg.pushManager.getSubscription() : null;
        if (Notification.permission === "denied") setState("denied");
        else setState(sub ? "subscribed" : "idle");
      } catch {
        setState("idle");
      }
    })();
  }, []);

  async function sendTest() {
    setMessage(null);
    try {
      const res = await fetch("/api/admin/push/test", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      setMessage(res.ok ? (data.message ?? "Probna obavijest je poslana.") : (data.message ?? "Slanje nije uspjelo."));
    } catch {
      setMessage("Slanje probne obavijesti nije uspjelo.");
    }
  }

  async function disable() {
    setMessage(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        await fetch("/api/admin/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe().catch(() => {});
      }
      setState("idle");
      setMessage("Obavijesti su isključene na ovom uređaju.");
    } catch {
      setMessage("Isključivanje nije uspjelo.");
    }
  }

  async function enable() {
    setMessage(null);
    if (!vapidPublicKey) {
      setMessage("Nedostaje NEXT_PUBLIC_VAPID_PUBLIC_KEY u env varijablama.");
      return;
    }
    setState("working");
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const res = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      if (!res.ok) {
        setMessage("Spremanje pretplate nije uspjelo — je li baza spojena?");
        setState("idle");
        return;
      }

      setState("subscribed");
      setMessage("Obavijesti su uključene na ovom uređaju.");
    } catch {
      setMessage("Greška pri uključivanju obavijesti.");
      setState("idle");
    }
  }

  if (state === "unsupported") {
    return (
      <p className="text-sm text-white/45">
        Ovaj preglednik ne podržava push obavijesti. Na iPhoneu prvo dodaj aplikaciju na
        početni zaslon (Share → Add to Home Screen), pa uključi obavijesti unutar aplikacije.
      </p>
    );
  }

  if (state === "subscribed") {
    return (
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-3 py-2 text-sm text-accent">
          <Check className="h-4 w-4" /> Obavijesti uključene na ovom uređaju
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={sendTest}
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-3.5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.06]"
          >
            <Bell className="h-4 w-4" /> Pošalji probnu obavijest
          </button>
          <button
            onClick={disable}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 px-3.5 py-2 text-sm font-semibold text-red-300 transition hover:border-red-500/50 hover:bg-red-500/10"
          >
            <BellOff className="h-4 w-4" /> Isključi na ovom uređaju
          </button>
        </div>
        {message ? <p className="text-sm text-white/45">{message}</p> : null}
      </div>
    );
  }

  if (state === "denied") {
    return (
      <p className="text-sm text-amber-300">
        <BellOff className="mr-1 inline h-4 w-4" />
        Obavijesti su blokirane u postavkama preglednika. Omogući ih pa osvježi stranicu.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={enable}
        disabled={state === "working"}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-[#04120b] transition hover:bg-accentDark disabled:opacity-50"
      >
        <Bell className="h-4 w-4" />
        {state === "working" ? "Uključujem…" : "Uključi obavijesti na ovom uređaju"}
      </button>
      {message ? <p className="text-sm text-white/45">{message}</p> : null}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Sunrise, Sunset } from "lucide-react";

export function HeroClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const h = now.getHours();
  const time = now.toLocaleTimeString("hr-HR", { hour: "2-digit", minute: "2-digit" });
  const phase =
    h < 6
      ? { Icon: Moon, label: "Noć" }
      : h < 8
        ? { Icon: Sunrise, label: "Zora" }
        : h < 18
          ? { Icon: Sun, label: "Dan" }
          : h < 20
            ? { Icon: Sunset, label: "Zalazak" }
            : { Icon: Moon, label: "Noć" };
  const Icon = phase.Icon;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
      <Icon className="h-3.5 w-3.5 text-accent" />
      <span className="tabular-nums text-white/90">{time}</span>
      <span className="text-white/40">· {phase.label} · Zagreb</span>
    </div>
  );
}

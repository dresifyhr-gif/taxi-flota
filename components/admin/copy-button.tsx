"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard nedostupan (npr. http) — tiho ignoriraj
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? "Kopirano!" : `Kopiraj ${label ?? ""}`.trim()}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1 text-xs font-medium text-white/60 transition hover:border-white/25 hover:text-white",
        copied && "border-accent/40 text-accent",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Kopirano" : label ?? "Kopiraj"}
    </button>
  );
}

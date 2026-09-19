import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-accent/70 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/20";

export const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_16px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className="block text-xs text-white/35">{hint}</span> : null}
    </label>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-[#04120b] hover:bg-accentDark shadow-[0_10px_30px_-12px_rgba(52,209,134,0.7)]",
  secondary: "border border-white/12 text-white/80 hover:border-white/25 hover:bg-white/[0.06] hover:text-white",
  danger: "border border-red-500/25 text-red-300 hover:border-red-500/50 hover:bg-red-500/10",
  ghost: "text-white/60 hover:bg-white/[0.06] hover:text-white",
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

const statusStyles: Record<string, string> = {
  novo: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  kontaktiran: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  odobreno: "border-accent/30 bg-accent/12 text-accent",
  odbijeno: "border-red-500/25 bg-red-500/10 text-red-300",
  rijeseno: "border-accent/30 bg-accent/12 text-accent",
};

const statusLabels: Record<string, string> = {
  novo: "Novo",
  kontaktiran: "Kontaktiran",
  odobreno: "Odobreno",
  odbijeno: "Odbijeno",
  rijeseno: "Riješeno",
};

export function StatusBadge({ status }: { status: string | null }) {
  const key = status ?? "novo";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        statusStyles[key] ?? statusStyles.novo,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabels[key] ?? key}
    </span>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-sky-400/20 bg-sky-400/[0.07] text-sky-200",
    success: "border-accent/25 bg-accent/[0.08] text-accent",
    error: "border-red-500/25 bg-red-500/[0.08] text-red-200",
  };
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs", tones[tone])}>
      {children}
    </div>
  );
}

/** Naslov stranice + opcionalni podnaslov i akcija zdesna. */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-white/45">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

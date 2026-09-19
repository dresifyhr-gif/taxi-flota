import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition focus:border-emerald-500";

export const labelClass = "block text-xs font-semibold uppercase tracking-wide text-neutral-400";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5", className)}
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
      {hint ? <span className="block text-xs text-neutral-500">{hint}</span> : null}
    </label>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-emerald-500 text-neutral-950 hover:bg-emerald-400",
  secondary: "border border-neutral-700 text-neutral-100 hover:border-neutral-500",
  danger: "border border-red-500/40 text-red-300 hover:bg-red-500/10",
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50";

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
  novo: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  kontaktiran: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  odobreno: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  odbijeno: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function StatusBadge({ status }: { status: string | null }) {
  const key = status ?? "novo";
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        statusStyles[key] ?? statusStyles.novo,
      )}
    >
      {key}
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
    info: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    error: "border-red-500/30 bg-red-500/10 text-red-200",
  };
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", tones[tone])}>{children}</div>
  );
}

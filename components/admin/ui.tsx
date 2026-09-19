import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export const labelClass = "block text-xs font-semibold uppercase tracking-wide text-neutral-500";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm", className)}
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
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary: "border border-neutral-300 text-neutral-700 hover:bg-neutral-100",
  danger: "border border-red-300 text-red-600 hover:bg-red-50",
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
  novo: "bg-sky-100 text-sky-700 border-sky-200",
  kontaktiran: "bg-amber-100 text-amber-700 border-amber-200",
  odobreno: "bg-emerald-100 text-emerald-700 border-emerald-200",
  odbijeno: "bg-red-100 text-red-700 border-red-200",
  rijeseno: "bg-emerald-100 text-emerald-700 border-emerald-200",
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
    info: "border-sky-200 bg-sky-50 text-sky-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-700",
  };
  return <div className={cn("rounded-xl border px-4 py-3 text-sm", tones[tone])}>{children}</div>;
}

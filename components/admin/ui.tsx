import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-hairline bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-accent/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-accent/20";

export const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40";

type CardVariant = "default" | "elevated" | "soft" | "outlined";

export function Card({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & { variant?: CardVariant }) {
  const styles: Record<CardVariant, string> = {
    default:
      "border border-hairline bg-surface-raised/70 shadow-card backdrop-blur-sm",
    elevated:
      "border border-hairline-strong bg-surface-elevated shadow-cardHover backdrop-blur-sm",
    soft:     "border border-hairline-soft bg-white/[0.02]",
    outlined: "border border-hairline bg-transparent",
  };
  return (
    <div className={cn("rounded-2xl p-5", styles[variant], className)} {...props} />
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

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "subtle";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-[#04120b] hover:bg-accentDark shadow-glow",
  secondary:
    "border border-hairline-strong bg-white/[0.03] text-white/85 hover:border-white/25 hover:bg-white/[0.07] hover:text-white",
  subtle:
    "bg-white/[0.04] text-white/75 hover:bg-white/[0.08] hover:text-white",
  danger:
    "border border-red-500/25 bg-red-500/[0.08] text-red-300 hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-200",
  ghost:
    "text-white/60 hover:bg-white/[0.05] hover:text-white",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <Link
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
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

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1.5">
        {eyebrow ? (
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/85">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-[26px] font-bold tracking-tight text-white leading-none">{title}</h1>
        {subtitle ? <p className="text-sm text-white/55">{subtitle}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
}

type KpiTone = "neutral" | "accent" | "info" | "warn" | "danger";

export function KpiTile({
  label,
  value,
  icon,
  href,
  hint,
  trend,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  href?: string;
  hint?: ReactNode;
  trend?: { direction: "up" | "down" | "flat"; label: string };
  tone?: KpiTone;
}) {
  const toneBg: Record<KpiTone, string> = {
    neutral: "bg-white/[0.05] text-white/70",
    accent:  "bg-accent/15 text-accent",
    info:    "bg-sky-400/15 text-sky-300",
    warn:    "bg-amber-400/15 text-amber-300",
    danger:  "bg-red-500/15 text-red-300",
  };
  const trendClass =
    trend?.direction === "up"
      ? "text-accent"
      : trend?.direction === "down"
      ? "text-red-300"
      : "text-white/40";

  const body = (
    <>
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
          {label}
        </span>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", toneBg[tone])}>
          {icon}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-2 whitespace-nowrap">
        <span className="text-[28px] font-bold text-white tabular-nums tracking-tight">{value}</span>
        {trend ? (
          <span className={cn("text-xs font-semibold tabular-nums", trendClass)}>{trend.label}</span>
        ) : null}
      </div>
      {hint ? <div className="mt-1 text-xs text-white/45">{hint}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block rounded-2xl border border-hairline bg-surface-raised/70 p-5 shadow-card backdrop-blur-sm transition hover:border-hairline-strong hover:shadow-cardHover"
      >
        {body}
      </Link>
    );
  }
  return (
    <div className="rounded-2xl border border-hairline bg-surface-raised/70 p-5 shadow-card backdrop-blur-sm">
      {body}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-hairline border-dashed bg-white/[0.02] p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-white/50">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      {description ? <p className="mt-1 text-sm text-white/55">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="mt-0.5 text-sm font-semibold text-white">{title}</h2>
      </div>
      {right}
    </div>
  );
}

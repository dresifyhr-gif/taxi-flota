import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  invert?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <span
          className={cn(
            "mb-4 inline-flex rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em]",
            invert ? "border-white/15 bg-white/5 text-accent" : "border-white/10 bg-white/5 text-accent",
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", invert ? "text-white" : "text-white")}>
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-7 sm:text-lg", invert ? "text-white/70" : "text-white/60")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition duration-200",
        variant === "primary"
          ? "bg-accent text-black shadow-lg shadow-accent/20 hover:bg-accentDark hover:text-white"
          : "border border-black/10 bg-white text-black hover:border-accent hover:text-accentDark",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

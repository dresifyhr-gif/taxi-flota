"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function AnimateIn({
  children,
  delay = 0,
  direction = "up",
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
  immediate?: boolean;
}) {
  const { ref, inView } = useInView();
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (!immediate) return;
    const id = setTimeout(() => setForced(true), 30);
    return () => clearTimeout(id);
  }, [immediate]);

  const show = immediate ? forced : inView;

  const variants = {
    up: show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
    left: show ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0",
    right: show ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0",
    none: show ? "opacity-100" : "opacity-0",
  };

  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", variants[direction], className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView(0.5);
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(ease * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  const display = Number.isInteger(end) ? Math.round(count) : count.toFixed(1);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export function PulseDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2.5 w-2.5", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
    </span>
  );
}

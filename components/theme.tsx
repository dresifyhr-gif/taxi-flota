"use client";

import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const KEY = "fleethub:theme";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isAdmin = pathname?.startsWith("/admin");
    const root = document.documentElement;
    // Admin ostaje uvijek taman.
    if (theme === "light" && !isAdmin) root.classList.add("theme-light");
    else root.classList.remove("theme-light");
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, mounted, pathname]);

  const toggle = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}

/** Skripta u <head> koja postavi temu prije prvog rendera (bez bljeska). */
export function ThemeNoFlashScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{var t=localStorage.getItem('${KEY}');if(t==='light'&&location.pathname.indexOf('/admin')!==0)document.documentElement.classList.add('theme-light');}catch(e){}`,
      }}
    />
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "Prebaci na tamnu temu" : "Prebaci na svijetlu temu"}
      title={theme === "light" ? "Tamna tema" : "Svijetla tema"}
      className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20 ${className}`}
    >
      {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
    </button>
  );
}
